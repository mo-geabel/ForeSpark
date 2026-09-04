import os
import gc
import base64
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor

import torch
import torch.nn as nn
from torchvision import transforms, models
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
import numpy as np

# Optimize PyTorch for single/shared CPU cores (prevents context-switch thrashing)
torch.set_num_threads(1)
torch.set_num_interop_threads(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)
CORS(app)

# --- CONFIG ---
MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")
OFFSET_X = 0.0085   # longitude offset — horizontal tile spacing
OFFSET_Y = 0.0060   # latitude offset  — vertical tile spacing

WEIGHT_MATRIX = [
    [0.05, 0.10, 0.05],
    [0.10, 0.40, 0.10],
    [0.05, 0.10, 0.05]
]

# --- MODEL SETUP ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.mobilenet_v2(weights=None)
num_ftrs = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_ftrs, 2)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'best_wildfire_model_MobileNetV2.pth')
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# Freeze all model weights (prevents gradient computation on conv layers, saving ~70% memory)
for param in model.parameters():
    param.requires_grad = False

# Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def pil_to_base64(pil_img):
    """Helper to convert PIL image to base64 string for React and Mobile"""
    buffered = BytesIO()
    pil_img.save(buffered, format="JPEG", quality=80)
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def fetch_single_tile(item):
    """Fetch Mapbox satellite image directly at 224x224 concurrently (saves network & RAM)"""
    lat, lng, weight, label = item
    url = f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/{lng},{lat},15,0/224x224?access_token={MAPBOX_TOKEN}&logo=false&attribution=false"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            base_img = Image.open(BytesIO(resp.content)).convert('RGB')
            return {
                "label": label,
                "lat": lat,
                "lng": lng,
                "weight": weight,
                "url": url,
                "base_img": base_img,
                "error": None
            }
        else:
            return {"label": label, "lat": lat, "lng": lng, "weight": weight, "url": url, "base_img": None, "error": f"Mapbox error: {resp.status_code}"}
    except Exception as e:
        return {"label": label, "lat": lat, "lng": lng, "weight": weight, "url": url, "base_img": None, "error": str(e)}

def compute_batch_gradcam(model, batch_tensors):
    """
    Vectorized Batch Grad-CAM in pure PyTorch (0.05s total for all 9 tiles).
    Runs feature extraction in no_grad, then backpropagates through the classifier
    to extract activation gradients without retaining intermediate conv layers.
    """
    with torch.no_grad():
        features = model.features(batch_tensors)

    # Enable gradients ONLY on the feature map for Grad-CAM
    features.requires_grad_(True)
    pooled = nn.functional.adaptive_avg_pool2d(features, (1, 1))
    logits = model.classifier(torch.flatten(pooled, 1))
    
    # Class 1 is wildfire risk
    probs = nn.functional.softmax(logits, dim=1)[:, 1]
    
    # Target score backpropagation
    target_scores = logits[:, 1].sum()
    target_scores.backward()

    # Channel-wise global average pooling of gradients
    weights = torch.mean(features.grad, dim=(2, 3), keepdim=True)

    # Weighted combination of feature maps + ReLU
    cams = torch.relu(torch.sum(weights * features.detach(), dim=1, keepdim=True))

    # Bilinear interpolation to original 224x224 resolution
    cams = nn.functional.interpolate(cams, size=(224, 224), mode='bilinear', align_corners=False)

    probs_list = probs.detach().cpu().numpy().tolist()
    cams_np = cams[:, 0].detach().cpu().numpy()

    # Immediately free intermediate tensors
    del features, pooled, logits, target_scores, weights, cams

    normalized_cams = []
    for i in range(len(probs_list)):
        cam = cams_np[i]
        c_min, c_max = cam.min(), cam.max()
        if c_max > c_min:
            cam = (cam - c_min) / (c_max - c_min)
        else:
            cam = np.zeros_like(cam)
        normalized_cams.append(cam)

    return probs_list, normalized_cams

def generate_overlay_b64(base_img, cam_norm):
    """
    Blends satellite image with standard JET colormap heatmap in NumPy.
    Pure mathematical formula: zero OpenCV buffer overhead, identical visualization.
    """
    orig_np = np.array(base_img).astype(np.float32) / 255.0

    # JET colormap calculation
    four_val = 4.0 * cam_norm
    r = np.clip(np.minimum(four_val - 1.5, -four_val + 4.5), 0.0, 1.0)
    g = np.clip(np.minimum(four_val - 0.5, -four_val + 3.5), 0.0, 1.0)
    b = np.clip(np.minimum(four_val + 0.5, -four_val + 2.5), 0.0, 1.0)
    jet_rgb = np.stack([r, g, b], axis=-1)

    # Blend: 55% satellite + 45% heatmap
    blended = np.clip(0.55 * orig_np + 0.45 * jet_rgb, 0.0, 1.0)
    blended_uint8 = (blended * 255.0).astype(np.uint8)

    pil_overlay = Image.fromarray(blended_uint8)
    return pil_to_base64(pil_overlay)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "ForeSpark Python API is running 🔥"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(silent=True) or {}
        c_lat, c_lng = data.get('lat'), data.get('lng')

        if c_lat is None or c_lng is None:
            return jsonify({"error": "lat and lng are required"}), 400

        labels = ["NW", "N", "NE", "W", "CENTER", "E", "SW", "S", "SE"]
        coords = [
            (c_lat + OFFSET_Y, c_lng - OFFSET_X),
            (c_lat + OFFSET_Y, c_lng),
            (c_lat + OFFSET_Y, c_lng + OFFSET_X),
            (c_lat,            c_lng - OFFSET_X),
            (c_lat,            c_lng),
            (c_lat,            c_lng + OFFSET_X),
            (c_lat - OFFSET_Y, c_lng - OFFSET_X),
            (c_lat - OFFSET_Y, c_lng),
            (c_lat - OFFSET_Y, c_lng + OFFSET_X),
        ]
        weights = [
            WEIGHT_MATRIX[0][0], WEIGHT_MATRIX[0][1], WEIGHT_MATRIX[0][2],
            WEIGHT_MATRIX[1][0], WEIGHT_MATRIX[1][1], WEIGHT_MATRIX[1][2],
            WEIGHT_MATRIX[2][0], WEIGHT_MATRIX[2][1], WEIGHT_MATRIX[2][2],
        ]

        tasks = [(lat, lng, w, lbl) for (lat, lng), w, lbl in zip(coords, weights, labels)]

        # 1. Fetch all 9 tiles concurrently (takes ~1s total)
        with ThreadPoolExecutor(max_workers=5) as executor:
            fetched_tiles = list(executor.map(fetch_single_tile, tasks))

        # Maintain proper grid order NW..SE
        tile_map = {t["label"]: t for t in fetched_tiles}
        ordered_tiles = [tile_map[lbl] for lbl in labels]

        # 2. Vectorized Batch Inference + Grad-CAM across all valid tiles in ONE step
        valid_indices = [i for i, t in enumerate(ordered_tiles) if t["base_img"] is not None]

        probabilities = [0.0] * 9
        cam_heatmaps = [None] * 9

        if valid_indices:
            batch_tensors = torch.stack([transform(ordered_tiles[i]["base_img"]) for i in valid_indices]).to(device)
            valid_probs, valid_cams = compute_batch_gradcam(model, batch_tensors)
            del batch_tensors

            for idx, prob, cam in zip(valid_indices, valid_probs, valid_cams):
                probabilities[idx] = float(prob)
                cam_heatmaps[idx] = cam

        # 3. Assemble Grid Results
        grid_results = []
        for i, tile in enumerate(ordered_tiles):
            lbl = tile["label"]
            lat = tile["lat"]
            lng = tile["lng"]
            weight = tile["weight"]
            url = tile["url"]
            base_img = tile["base_img"]
            err = tile["error"]
            prob = round(probabilities[i], 4)
            weighted_contrib = round(prob * weight, 4)

            if base_img is None:
                grid_results.append({
                    "label": lbl, "lat": lat, "lng": lng, "mapbox_url": url, "error": err or "Failed to load image"
                })
                continue

            orig_b64 = pil_to_base64(base_img)

            # Generate lightweight Grad-CAM XAI overlay
            try:
                expl_b64 = generate_overlay_b64(base_img, cam_heatmaps[i])
            except Exception as cam_err:
                print(f"Overlay fallback for {lbl}: {cam_err}")
                expl_b64 = orig_b64

            grid_results.append({
                "label": lbl,
                "lat": lat,
                "lng": lng,
                "mapbox_url": url,
                "individual_prob": prob,
                "weighted_contribution": weighted_contrib,
                "original_img": orig_b64,
                "explanation_img": expl_b64
            })

        total_score = sum(item.get('weighted_contribution', 0) for item in grid_results)

        if total_score > 0.85:
            res = "Critical Risk"
        elif total_score > 0.45:
            res = "High Risk"
        else:
            res = "Low Risk"

        # Explicit garbage collection and memory release
        del ordered_tiles, fetched_tiles, probabilities, cam_heatmaps
        gc.collect()
        try:
            import ctypes
            libc = ctypes.CDLL("libc.so.6")
            libc.malloc_trim(0)
        except Exception:
            pass

        return jsonify({
            "result": res,
            "total_probability": round(total_score, 4),
            "grid_data": grid_results,
            "center_coords": {"lat": c_lat, "lng": c_lng}
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))
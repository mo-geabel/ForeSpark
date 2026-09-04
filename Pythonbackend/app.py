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

# XAI Imports
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

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

# Grad-CAM Engine Setup (Standard GradCAM is mathematically identical for MobileNetV2 and 3x faster)
target_layer = [model.features[18]]
cam_engine = GradCAM(model=model, target_layers=target_layer)

# Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def pil_to_base64(pil_img):
    """Helper to convert PIL image to base64 string for React"""
    buffered = BytesIO()
    pil_img.save(buffered, format="JPEG", quality=80)
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def fetch_single_tile(item):
    """Fetch Mapbox satellite image concurrently"""
    lat, lng, weight, label = item
    url = f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/{lng},{lat},15,0/350x350?access_token={MAPBOX_TOKEN}&logo=false&attribution=false"
    try:
        resp = requests.get(url, timeout=12)
        if resp.status_code == 200:
            full_img = Image.open(BytesIO(resp.content)).convert('RGB')
            base_img = full_img.resize((224, 224))
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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "ForeSpark Python API is running 🔥"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json or {}
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

        # 1. Fetch all 9 tiles concurrently (takes ~1-2s total instead of 15s)
        with ThreadPoolExecutor(max_workers=5) as executor:
            fetched_tiles = list(executor.map(fetch_single_tile, tasks))

        # Re-order fetched tiles to match original tasks order
        tile_map = {t["label"]: t for t in fetched_tiles}
        ordered_tiles = [tile_map[lbl] for lbl in labels]

        # 2. Batch Inference across all valid tiles in one single forward pass
        valid_indices = [i for i, t in enumerate(ordered_tiles) if t["base_img"] is not None]

        probabilities = [0.0] * 9
        if valid_indices:
            batch_tensors = torch.stack([transform(ordered_tiles[i]["base_img"]) for i in valid_indices]).to(device)
            with torch.inference_mode():
                outputs = model(batch_tensors)
                probs = torch.nn.functional.softmax(outputs, dim=1)
                predicted_scores = probs[:, 1].cpu().numpy().tolist()

            for idx, score in zip(valid_indices, predicted_scores):
                probabilities[idx] = float(score)

        # 3. Assemble Grid Results & Targeted Grad-CAM
        grid_results = []
        cam_targets = [ClassifierOutputTarget(1)]

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

            # Generate Grad-CAM for CENTER tile or any tile with significant risk
            # (Skips expensive backpropagation on cold, zero-risk peripheral tiles)
            if lbl == "CENTER" or prob >= 0.35:
                try:
                    norm_tensor = transform(base_img).unsqueeze(0).to(device)
                    raw_np = np.array(base_img).astype(np.float32) / 255.0

                    grayscale_cam = cam_engine(input_tensor=norm_tensor, targets=cam_targets, aug_smooth=False, eigen_smooth=False)[0]
                    cam_image = show_cam_on_image(raw_np, grayscale_cam, use_rgb=True)
                    cam_pil = Image.fromarray(cam_image)
                    expl_b64 = pil_to_base64(cam_pil)
                except Exception as cam_err:
                    print(f"GradCAM fallback for {lbl}: {cam_err}")
                    expl_b64 = orig_b64
            else:
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

        # Explicit garbage collection to keep RAM < 300 MB on Render
        gc.collect()

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
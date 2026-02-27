import torch
import torch.nn as nn
from torchvision import transforms, models
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor
import os
import numpy as np
import cv2
import base64

# XAI Imports
from pytorch_grad_cam import GradCAMPlusPlus
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
COORD_OFFSET = 0.0031
WEIGHT_MATRIX = [
    [0.05, 0.10, 0.05],
    [0.10, 0.40, 0.10],
    [0.05, 0.10, 0.05]
]

# --- MODEL SETUP ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.mobilenet_v2(weights=None) # pretrained=False is deprecated
num_ftrs = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_ftrs, 2) 
model.load_state_dict(torch.load('best_wildfire_model_MobileNetV2.pth', map_location=device))
model.to(device)
model.eval()

# Grad-CAM Engine Setup
target_layer = [model.features[18]] # Last conv layer of MobileNetV2
cam_engine = GradCAMPlusPlus(model=model, target_layers=target_layer)

# Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# For XAI overlay, we need a simple [0,1] version of the image
raw_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def pil_to_base64(pil_img):
    """Helper to convert PIL image to base64 string for React"""
    buffered = BytesIO()
    pil_img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def process_point(args):
    lat, lng, weight, label = args
    print(f"DEBUG: [ {label} ] Starting processing...")
    try:
        url = f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/{lng},{lat},15,0/350x350?access_token={MAPBOX_TOKEN}&logo=false&attribution=false"
        resp = requests.get(url, timeout=10)
        
        if resp.status_code == 200:
            print(f"DEBUG: [ {label} ] Image fetched. Scaling to 224...")
            # Unify everything on the 224x224 input size
            full_img = Image.open(BytesIO(resp.content)).convert('RGB')
            base_img = full_img.resize((224, 224))
            
            # 1. Prepare Tensors
            img_tensor = transforms.ToTensor()(base_img).unsqueeze(0).to(device)
            img_normalized = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])(img_tensor)
            
            # For XAI overlay, we need [0,1] numpy version (224, 224, 3)
            raw_img_np = transforms.ToTensor()(base_img).permute(1, 2, 0).numpy()

            # 2. Run Inference
            print(f"DEBUG: [ {label} ] Model Inference...")
            with torch.no_grad():
                outputs = model(img_normalized)
                probs = torch.nn.functional.softmax(outputs[0], dim=0)
                high_risk_prob = float(probs[1].item())

            # 3. Generate Grad-CAM Overlay
            print(f"DEBUG: [ {label} ] Grad-CAM...")
            targets = [ClassifierOutputTarget(1)] 
            # Force everything to be serial and simple to avoid segmentation fault
            grayscale_cam = cam_engine(input_tensor=img_normalized, targets=targets, aug_smooth=False, eigen_smooth=False)[0]
            
            # Create RGB Heatmap overlay
            cam_image = show_cam_on_image(raw_img_np, grayscale_cam, use_rgb=True)
            cam_pil = Image.fromarray(cam_image)

            print(f"DEBUG: [ {label} ] Done.")
            return {
                "label": label,
                "individual_prob": round(high_risk_prob, 4),
                "weighted_contribution": round(high_risk_prob * weight, 4),
                "original_img": pil_to_base64(base_img),
                "explanation_img": pil_to_base64(cam_pil)
            }
        else:
            print(f"DEBUG: [ {label} ] Mapbox error: {resp.status_code}")
            return {"label": label, "error": f"Mapbox error: {resp.status_code}"}
    except Exception as e:
        print(f"DEBUG: [ {label} ] ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"label": label, "error": str(e)}

@app.route('/predict', methods=['POST'])
def predict():
    print("hello")
    try:
        data = request.json
        c_lat, c_lng = data.get('lat'), data.get('lng')
        
        tasks = []
        labels = ["NW", "N", "NE", "W", "CENTER", "E", "SW", "S", "SE"]
        idx = 0
        for i, lat_s in enumerate([1, 0, -1]):
            for j, lng_s in enumerate([-1, 0, 1]):
                tasks.append((
                    c_lat + (lat_s * COORD_OFFSET), 
                    c_lng + (lng_s * COORD_OFFSET), 
                    WEIGHT_MATRIX[i][j],
                    labels[idx]
                ))
                idx += 1

        with ThreadPoolExecutor(max_workers=1) as executor:
            grid_results = list(executor.map(process_point, tasks))

        total_score = sum(item.get('weighted_contribution', 0) for item in grid_results)

        if total_score > 0.85: res = "Critical Risk"
        elif total_score > 0.45: res = "High Risk"
        else: res = "Low Risk"

        return jsonify({
            "result": res,
            "total_probability": round(total_score, 4),
            "grid_data": grid_results, 
            "center_coords": {"lat": c_lat, "lng": c_lng}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))
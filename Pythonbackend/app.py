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
model = models.mobilenet_v2(pretrained=False)
num_ftrs = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_ftrs, 2) 
model.load_state_dict(torch.load('best_wildfire_model_MobileNetV2.pth', map_location=device))
model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def process_point(args):
    """Processes a single grid point and returns full metadata for React"""
    lat, lng, weight, label = args
    print(f"[SCANNING] Point: {label} at ({lat}, {lng})")
    
    try:
        # We still use Mapbox for the AI to analyze (best for forest detail)
        url = f"https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/{lng},{lat},15,0/350x350?access_token={MAPBOX_TOKEN}&logo=false&attribution=false"
        resp = requests.get(url, timeout=5)
        
        if resp.status_code == 200:
            img = Image.open(BytesIO(resp.content)).convert('RGB')
            img_t = transform(img).unsqueeze(0).to(device)
            
            with torch.no_grad():
                outputs = model(img_t)
                probs = torch.nn.functional.softmax(outputs[0], dim=0)
                high_risk_prob = float(probs[1].item())
                
            return {
                "label": label,
                "lat": lat,
                "lng": lng,
                "individual_prob": round(high_risk_prob, 4),
                "weighted_contribution": round(high_risk_prob * weight, 4),
                "weight_used": weight
            }
        else:
            return {"label": label, "error": "Mapbox error", "individual_prob": 0, "weighted_contribution": 0, "weight_used": weight}
    except Exception as e:
        return {"label": label, "error": str(e), "individual_prob": 0, "weighted_contribution": 0, "weight_used": weight}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        c_lat, c_lng = data.get('lat'), data.get('lng')
        
        # 1. Prepare 9 grid tasks
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

        # 2. Execute parallel scanning
        with ThreadPoolExecutor(max_workers=9) as executor:
            grid_results = list(executor.map(process_point, tasks))

        # 3. Calculate Final Weighted Score
        total_score = sum(item['weighted_contribution'] for item in grid_results)

        # 4. Determine Global Risk Label
        if total_score > 0.90: res = "Critical Risk"
        elif total_score > 0.50: res = "High Risk"
        else: res = "Low Risk"

        print(f"--- Analysis Complete: {res} ({total_score:.4f}) ---")

        return jsonify({
            "result": res,
            "total_probability": round(total_score, 4),
            "grid_data": grid_results, # All 9 photos' data for React
            "center_coords": {"lat": c_lat, "lng": c_lng}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))

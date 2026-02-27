import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import numpy as np
import cv2
import os

# XAI Imports
from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

print("Loading model...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.mobilenet_v2(weights=None)
num_ftrs = model.classifier[1].in_features
model.classifier[1] = nn.Linear(num_ftrs, 2) 
model.load_state_dict(torch.load('best_wildfire_model_MobileNetV2.pth', map_location=device))
model.to(device)
model.eval()

print("Setting up Grad-CAM...")
target_layer = [model.features[18]]
cam_engine = GradCAMPlusPlus(model=model, target_layers=target_layer)

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

raw_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def test_inference():
    print("Generating dummy image...")
    # Create a dummy image instead of Mapbox for testing
    dummy_img = Image.fromarray(np.uint8(np.random.rand(350, 350, 3) * 255))
    
    print("Preparing tensors...")
    img_t = transform(dummy_img).unsqueeze(0).to(device)
    raw_img_np = raw_transform(dummy_img).permute(1, 2, 0).numpy()

    print("Running Grad-CAM...")
    targets = [ClassifierOutputTarget(1)] 
    # Use aug_smooth=False, eigen_smooth=False to minimize complexity
    grayscale_cam = cam_engine(input_tensor=img_t, targets=targets, aug_smooth=False, eigen_smooth=False)[0]
    
    print("Showing CAM on image...")
    cam_image = show_cam_on_image(raw_img_np, grayscale_cam, use_rgb=True)
    print("Test finished successfully!")

if __name__ == "__main__":
    try:
        test_inference()
    except Exception as e:
        print(f"Error caught: {e}")

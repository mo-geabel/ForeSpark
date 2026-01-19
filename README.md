# 🌲 ForeSpark: AI-Powered Wildfire Risk Analysis

**ForeSpark** is a full-stack spatial intelligence platform that predicts wildfire risks using satellite imagery and Deep Learning. By combining a modern web interface with a custom AI engine, it provides real-time, 9-point spatial grid analysis to help detect environmental threats before they escalate.

---

## 🚀 System Architecture
ForeSpark is built on a **Tri-Service Microservice Architecture** to ensure clean separation of concerns and high-performance inference:

1.  **Frontend (React/Vite):** A high-end spatial dashboard using **Google Map** for real-time coordinate selection and risk visualization.
2.  **API Gateway (Node.js/Express):** Manages user authentication (JWT), scan history persistence (MongoDB), and handles the secure relay to the AI engine.
3.  **AI Engine (Python/Flask):** A dedicated inference server that pulls satellite snapshots via **Mapbox Static Images API** and processes them through a custom-trained **MobileNetV2** model.

---

## 🧠 AI & Spatial Intelligence
Unlike standard point-based analysis, ForeSpark uses a **9-Point Spatial Grid Strategy**:
* **The Method:** When a user selects a location, the AI analyzes the center point and 8 surrounding perimeter points.
* **Model:** MobileNetV2 (Transfer Learning) optimized for environmental feature detection.
* **Output:** A comprehensive risk verdict (High/Low) with a weighted confidence score.

[Image of a 9-point spatial grid overlay on a satellite map]

---
## 🛠️ Technology Stack

### 🖥️ Frontend
* **Web Dashboard:** React 18 powered by Vite for a high-performance, reactive user interface.
* **Spatial Visualization:** Mapbox GL & Mapbox Static API for high-resolution satellite imagery and interactive mapping.
* **Modern Styling:** Tailwind CSS and NativeWind for a sleek, consistent design language across all devices.

[Image of a professional technology stack diagram showing React, Node.js, and PyTorch icons]

### 🧠 Intelligence Engine (AI)
* **Core Framework:** PyTorch & Torchvision for robust deep learning and image processing.
* **Architecture:** MobileNetV2—custom-trained and optimized for terrain classification and feature extraction.
* **Microservice Server:** Flask (Python) specifically configured for lightweight, high-speed API inference.

### ⚙️ Backend & Infrastructure
* **API Gateway:** Node.js & Express.js managing the centralized RESTful API and service relay.
* **Data Persistence:** MongoDB Atlas (NoSQL) for scalable storage of spatial logs and user history.
* **Security:** JWT (JSON Web Tokens) for secure, stateless authentication across web and mobile.


---

## 📦 Installation & Setup

### 1. Clone the Project
```bash
git clone [https://github.com/mo-geabel/ForeSpark.git](https://github.com/mo-geabel/ForeSpark.git)
cd ForeSpark
```
### 2.Python AI Service Setup
```bash
cd Pythonbackend
pip install -r requirements.txt
python app.py 
# Service runs on http://localhost:5001
```
### 3. Node.js Backend Setup
```bash

cd backend
npm install
# Create a .env file with: 
# MONGO_URI, JWT_SECRET, MAPBOX_TOKEN, PYTHON_AI_URL
npm run dev 
# Service runs on http://localhost:5000
```
### 4. Frontend Web Setup
```bash

cd frontend
npm install
# Create a .env file with: 
#VITE_GOOGLE_MAPS_API_KEY, VITE_API_URL
npm run dev
```
## 📋 Key Features

### 🗺️ Interactive Spatial Analysis

* Click anywhere on the map to trigger a **deep-learning–powered terrain scan**
* Instantly analyzes environmental and geographical risk at the selected location

### 🔥 Grid Intelligence

* Evaluates **9 surrounding grid points** around the selected location
* Generates a comprehensive **risk heatmap** for improved spatial awareness

### 🛠️ Admin Logs & Monitoring

* Admin dashboard for viewing **global scan history**
* Monitor AI predictions and validate accuracy using real user feedback

### 🔁 Feedback Loop

* Users can **Like / Dislike** AI-generated verdicts
* Feedback is stored as **ground-truth data** for future model retraining and improvement

### 📊 CSV Reporting

* Export scan history, user feedback, and model performance metrics
* Useful for **environmental analysis, audits, and reporting**

### 📄 License
#### This project is licensed under the MIT License - see the LICENSE file for details.



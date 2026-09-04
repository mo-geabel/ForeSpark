FROM python:3.10-slim

# Install system libs required by opencv (libGL.so.1)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Force headless opencv AFTER grad-cam (which pulls in full opencv-python as a dep)
RUN pip install --no-cache-dir --force-reinstall opencv-python-headless==4.9.0.80

COPY . .

EXPOSE 5001

CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-5001} --timeout 120 --workers 1"]

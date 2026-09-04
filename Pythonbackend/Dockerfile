FROM python:3.10-slim

# Install system libs required by opencv (libGL.so.1)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Force headless opencv and strictly pin numpy==1.26.4 (NumPy 2.x breaks OpenCV ABI)
RUN pip uninstall -y opencv-python && \
    pip install --no-cache-dir --force-reinstall "opencv-python-headless==4.9.0.80" "numpy==1.26.4"

# Verify OpenCV and NumPy work before starting
RUN python -c "import cv2, numpy; print('Verified: cv2', cv2.__version__, 'numpy', numpy.__version__)"

COPY . .

EXPOSE 5001

CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-5001} --timeout 120 --workers 1"]

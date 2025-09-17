# syntax=docker/dockerfile:1

FROM python:3.11-slim AS base
WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install only runtime system dependencies needed by Pillow/torchvision
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt ./

# Install CPU-only PyTorch wheels explicitly, then the rest
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu \
       torch torchvision \
    && pip install --no-cache-dir -r requirements.txt

# Copy app source and model weights
COPY app.py ./
COPY model ./model
COPY utils ./utils
COPY vit_leaf_classifier.pth ./vit_leaf_classifier.pth

EXPOSE 8000
ENV FLASK_ENV=production

CMD ["python", "app.py"]

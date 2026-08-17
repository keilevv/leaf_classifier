# Leaf Classifier Training Process

Based on the logic found in `classifier/app/routes/retrain.py`, here is a step-by-step explanation of how the retraining process works for the machine learning models in your project.

## 1. Request Handling & Concurrency
- The endpoint `/retrain` receives a POST request with the specific model to train: `especies`, `hojas`, or `plantas`.
- The API immediately validates the request and ensures that no concurrent training is running for the same model (using a thread lock).
- The actual training process is spawned in a **background thread** (`train_thread`), allowing the API to respond immediately with a "Started" status without keeping the client waiting.

## 2. Cloudflare R2 Synchronization (Species Model Only)
- If the model being trained is `especies`, the system connects to Cloudflare R2 using your configured credentials.
- It automatically downloads any new, verified plant images from the Cloudflare bucket into the local `DATA_DIR/especies/train` directory before starting the training process.

## 3. Hardware Optimization & Batch Sizing
- The script detects available hardware (GPU vs. CPU).
- **GPU Optimization:** If a GPU is detected, it configures TensorFlow to use it efficiently by enabling "memory growth" and checking the available VRAM.
- **Dynamic Batch Sizing:** It calculates the optimal `batch_size` based on the available GPU VRAM (allocating about 60% of available memory for batches). If no VRAM data is available, it defaults to a conservative batch size of 64 for GPUs and 32 for CPUs.

## 4. Class Detection and Configuration Update
- The system scans the training directory (`train/`) to find all image folders. Each folder name represents a class.
- It detects if any new classes have been added or removed compared to the current configuration.
- The global configuration is updated with the detected classes and sorted alphabetically to ensure they match the `ImageDataGenerator` indices.

## 5. Model Loading and Architecture Adjustment
- The current pre-trained `.h5` model (MobileNetV2 based) is loaded from disk.
- It checks if the number of classes in the training folders matches the number of output nodes in the loaded model.
- **Dynamic Adjustment:** If there's a mismatch (e.g., a new species was added), the system drops the current output layer and attaches a new dense layer with the correct number of nodes:
  - For the `plantas` model, it uses a `sigmoid` activation function.
  - For `especies` and `hojas`, it uses a `softmax` activation function.

## 6. Image Treatment and Data Generators
Images are preprocessed using Keras `ImageDataGenerator`:
- **Rescaling:** Pixel values are normalized by dividing by 255 (`rescale=1./255`), which converts pixel values from [0, 255] to [0, 1].
- **Sizing:** All images are resized to `128x128` pixels (`target_size=(128, 128)`).
- **Validation Split:** 
  - If there are 10 or more total images across all classes, the system reserves 20% (`validation_split=0.2`) of the data for validation.
  - If there are fewer than 10 images, it skips validation and trains on 100% of the dataset to prevent crashes from lacking data.

## 7. Model Compilation and Training
- **Compilation:** The model is compiled using the `Adam` optimizer with a low learning rate of `1e-5` to fine-tune the weights gently. The loss function is `categorical_crossentropy` and it tracks `accuracy`.
- **Training (Fit):** The model is trained for exactly **5 epochs**.
- **OOM Protection:** If the system runs out of memory (OOM error) during training, it catches the error, automatically halves the `batch_size`, performs garbage collection, recompiles, and attempts to start the training again.

## 8. Versioning and Deployment
- Before the new model is saved, the previous model is backed up and versioned (e.g., `modelo_especies_v0001_20240101T120000.h5`). The system automatically keeps the last 3 versions.
- The newly trained model is saved over the active `.h5` file.
- Finally, the model is reloaded globally in memory (`reload_model`), meaning the `/predict` endpoint will immediately begin using the newly trained model without requiring a server restart.

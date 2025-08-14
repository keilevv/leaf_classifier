from flask import Flask, request, jsonify
from model.vit_model import LeafClassifier
from utils.image_utils import preprocess_image
import os

app = Flask(__name__)

# Define your label names
class_names = ['Elíptica', 'Imparipinnada', 'Lanceolada', 'Obovada', 'Ovada', 'Palmeada', 'Trifoliada']
classifier = LeafClassifier("vit_leaf_classifier.pth", class_names)

@app.route("/api/upload", methods=["POST"])
def classify_leaf():    
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        image_tensor = preprocess_image(file.read())
        label, confidence = classifier.predict(image_tensor)

        return jsonify({
            "classification": label,
            "confidence": round(confidence, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import threading
import os
from model.vit_model import predict


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
especies = tf.keras.models.load_model(os.path.join(BASE_DIR, "models/modelo_especies.h5"))
formas = tf.keras.models.load_model(os.path.join(BASE_DIR, "models/modelo_hojas.h5"))
plantas = tf.keras.models.load_model(os.path.join(BASE_DIR, "models/modelo_plantas.h5"))


PLANTS = [
    False, True
    ]

SHAPES = [
    'Eliptica', 'Imparipinnada', 'Lanceolada', 'Obovada', 'Ovada', 'Palmeada', 'Trifoliada'
    ]

SPECIES = [
    'yam_healthy', 'yam_deseased',
    'eggplant_healthy', 'eggplant_deseased',
    'cucumber_healthy', 'cucumber_deseased',
    'corn_healthy', 'corn_deseased',
    'cassava_healthy', 'cassava_deseased'
]

predict_lock = threading.Lock()

@app.route('/predict', methods=['POST'])
def predict_route():
    return predict(especies, formas, plantas, SPECIES, SHAPES, PLANTS, predict_lock)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
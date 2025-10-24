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
    'Eliptic', 'Imparipinnate', 'Lanceolate', 'Obovate', 'Ovate', 'Palmeate', 'Trifoliate'
    ]

SPECIES = [
    'manihot-esculenta_deseased', 'manihot-esculenta_healthy',  # cassava
    'zea-mays_deseased', 'zea-mays_healthy',                    # corn
    'cucumis-sativus_deseased', 'cucumis-sativus_healthy',      # cucumber
    'solanum-melongena_deseased', 'solanum-melongena_healthy',  # eggplant
    'discorea-alata-l_deseased', 'discorea-alata-l_healthy'     # yam
]

predict_lock = threading.Lock()

@app.route('/predict', methods=['POST'])
def predict_route():
    return predict(especies, formas, plantas, SPECIES, SHAPES, PLANTS, predict_lock)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
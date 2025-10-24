from flask import request, jsonify
import numpy as np
from utils.image_utils import preprocess_image
import tensorflow as tf

# @tf.function
def safe_predict(model, input_data):
    """Ejecución segura para modelos Keras/TensorFlow"""
    return model(input_data, training=False)

def predict(especies, formas, plantas, SPECIES, SHAPES, PLANTS, predict_lock):
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    image_bytes = image_file.read()
    input_data = preprocess_image(image_bytes)

    with predict_lock:
        pred1 = safe_predict(especies, input_data)[0].numpy()
        pred2 = safe_predict(formas, input_data)[0].numpy()
        pred3 = safe_predict(plantas, input_data)[0].numpy()

    species_idx = int(np.argmax(pred1))
    shape_idx = int(np.argmax(pred2))
    plant_idx = int(np.argmax(pred3))

    result = {
        'model1': {
            'class': species_idx,
            'class_name': SPECIES[species_idx],
            'probability': float(np.max(pred1))
        },
        'model2': {
            'class': shape_idx,
            'class_name': SHAPES[shape_idx],
            'probability': float(np.max(pred2))
        },
        'model3': {
            'class': plant_idx,
            'class_name': PLANTS[plant_idx],
            'probability': float(np.max(pred3))
        }
    }

    return jsonify(result)
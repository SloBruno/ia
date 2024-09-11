from flask import Flask, render_template, request, jsonify
import base64
import cv2
import numpy as np
from transformers import pipeline
from translate import Translator


image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

translator = Translator(to_lang="pt")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    data_url = request.json['image']
    
    header, encoded = data_url.split(",", 1)
    img_data = base64.b64decode(encoded)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    image_path = "captured_image.jpg"
    cv2.imwrite(image_path, img)
    
    description = image_to_text(image_path)[0]['generated_text']
    pt_description = translator.translate(description)
    
    return jsonify({'description': pt_description})

if __name__ == '__main__':
    app.run(debug=True)

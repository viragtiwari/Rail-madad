from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

from chat import send
from model.model import send_image_request

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  

@app.route('/api/chat', methods=['POST'])
def chat():
    if request.form.get('message'):
        user_message = request.form.get('message')
        bot_response = send(user_message)
        return jsonify({"response": bot_response})

    if 'files' in request.files:
        files = request.files.getlist('files')
        bot_responses = ""
        
        for file in files:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)

            bot_response = send_image_request(file_path)
            bot_responses += bot_response + "\n\n"
        
        return jsonify({"response": bot_responses})
        


if __name__ == "__main__":
    app.run(debug=True)

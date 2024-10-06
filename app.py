from flask import Flask, jsonify, request
from flask_cors import CORS
import os

from model.model import Model, TestModel

if os.getenv("TESTING") == "true":
    model = TestModel()
else:
    model = Model(os.getenv("CLAUDE_API_KEY"))

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  

@app.route('/api/chat', methods=['POST'])
def chat():
    if 'files' in request.files:
        files = request.files.getlist('files')
        bot_responses = ""
        
        for file in files:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)

            bot_response = model.analyse_image(file_path)
            bot_responses += bot_response + "\n\n"
        
        return jsonify({"response": bot_responses})
    
    if request.form.get('message'):
        user_message = request.form.get('message')
        
        bot_response = model.chat(user_message)
        
        if bot_response == "Your complaint has been registered successfully.":
            summary = model.chat("Summary")
            model.route(summary)
        
        
        return jsonify({"response": bot_response})

        


if __name__ == "__main__":
    app.run(debug=True)

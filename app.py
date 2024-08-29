from flask import Flask, jsonify, request
from flask_cors import CORS

from chat import send

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    bot_response = send(user_message)
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True)

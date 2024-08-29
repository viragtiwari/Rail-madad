from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    bot_response = "Fuck you bro"
    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import keyboard
import threading
import json
import os
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        key = data.get('key', '').lower()
        print(f"Received key from web app: {key}")
        
        # Use keyboard.write() for more reliable key simulation
        keyboard.write(key)
        print(f"Key {key} written successfully")
        
        return jsonify({
            "status": "success",
            "message": f"Key {key} pressed",
            "key": key
        }), 200
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    try:
        print("=== Game Launcher Server ===")
        print(f"Starting server on http://localhost:5001")
        print("Press Ctrl+C to exit")
        print("Ready to receive keystrokes...")
        
        app.run(host='localhost', port=5001, threaded=True)
        
    except Exception as e:
        print(f"Error starting server: {str(e)}")

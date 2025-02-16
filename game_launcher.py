
from flask import Flask, request, jsonify
from flask_cors import CORS
import keyboard
import time

app = Flask(__name__)
CORS(app)

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        key = data.get('key', '')
        print(f"Received key: {key}")  # Debug log
        
        # Force lower case and handle special keys
        key = key.lower()
        if key == 'escape':
            key = 'esc'
        elif key == ' ':
            key = 'space'
            
        # Simulate the key press
        keyboard.press_and_release(key)
        print(f"Pressed key: {key}")  # Debug log
        
        return jsonify({"status": "success", "key": key}), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("\n=== Keystroke Server ===")
    print("Starting server on http://localhost:5001")
    print("Ready to receive keystrokes...")
    app.run(host='localhost', port=5001, threaded=True)

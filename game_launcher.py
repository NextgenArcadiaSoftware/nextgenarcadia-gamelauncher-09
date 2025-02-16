
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
        print(f"Received keystroke: {key}")  # Debug log
        
        # Handle special keys and normalize input
        key = key.lower()
        if key == 'escape':
            key = 'esc'
        elif key == ' ':
            key = 'space'
        
        # Use press_and_release for more reliable key simulation
        keyboard.press_and_release(key)
        print(f"Successfully simulated key: {key}")  # Debug log
        
        return jsonify({
            "status": "success",
            "message": f"Key {key} processed",
            "key": key
        }), 200
        
    except Exception as e:
        print(f"Error processing keystroke: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("\n=== Game Launcher Server ===")
    print("Starting server on http://localhost:5001")
    print("Press Ctrl+C to exit")
    print("Waiting for keystrokes...\n")
    app.run(host='localhost', port=5001, threaded=True)

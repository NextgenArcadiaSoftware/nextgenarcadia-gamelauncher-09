
from flask import Flask, request, jsonify
from flask_cors import CORS
import keyboard
import threading
import json
import os

# Dictionary mapping game codes to their executable paths
GAMES = {
    "FNJ": r"C:\Program Files (x86)\Steam\steamapps\common\Fruit Ninja VR\FruitNinja.exe",
    "EAX": r"C:\Program Files (x86)\Steam\steamapps\common\Elven Assassin\ElvenAssassin.exe",
    "CBR": r"C:\Program Files (x86)\Steam\steamapps\common\Crisis Brigade 2\CrisisBrigade2.exe",
    "AIO": r"C:\Program Files (x86)\Steam\steamapps\common\All-In-One Sports VR\AIO_Sports.exe",
    "RPE": r"C:\Program Files (x86)\Steam\steamapps\common\Richie's Plank Experience\PlankExperience.exe",
    "IBC": r"C:\Program Files (x86)\Steam\steamapps\common\iB Cricket\iB Cricket.exe",
    "UDC": r"C:\Program Files (x86)\Steam\steamapps\common\Undead Citadel\UndeadCitadel.exe",
    "ARS": r"C:\Program Files (x86)\Steam\steamapps\common\Arizona Sunshine\ArizonaSunshine.exe",
    "SBS": r"C:\Program Files (x86)\Steam\steamapps\common\Subside\Subside.exe",
    "PVR": r"C:\Program Files (x86)\Steam\steamapps\common\Propagation VR\PropagationVR.exe"
}

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def on_key_event(event):
    print(f"Key Pressed: {event.name}")
    if event.name.lower() == "f":
        print("F key detected, ready to launch game")

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        key = data.get('key', '').lower()
        print(f"Received key from web app: {key}")
        
        # Simulate the key press
        keyboard.press_and_release(key)
        
        return jsonify({
            "status": "success",
            "message": f"Key {key} received and processed"
        }), 200
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    try:
        # Register the keyboard listener
        keyboard.on_press(on_key_event)
        
        print("=== Game Launcher Server ===")
        print(f"Starting server on http://localhost:5001")
        print("Press Ctrl+C to exit")
        
        # Run the Flask app
        app.run(host='localhost', port=5001, debug=True)
        
    except Exception as e:
        print(f"Error starting server: {str(e)}")

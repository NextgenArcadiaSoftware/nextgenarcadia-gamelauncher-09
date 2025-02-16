
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
# Configure CORS to allow all origins and methods
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

@app.before_request
def log_request_info():
    print('Headers: %s', request.headers)
    print('Body: %s', request.get_data())
    print('Route: %s', request.path)

def on_key_event(event):
    key = event.name.lower()
    print(f"Key detected: {key}")
    
    # Map keys to game codes
    key_to_game = {
        'f': 'FNJ',  # Fruit Ninja
        'c': 'CBR',  # Crisis Brigade
        's': 'SBS',  # Subside
        'p': 'PVR',  # Propagation
        'i': 'IBC',  # iB Cricket
        'a': 'ARS',  # Arizona Sunshine
        'u': 'UDC',  # Undead Citadel
        'e': 'EAX',  # Elven Assassin
        'r': 'RPE',  # Richie's Plank
        'v': 'AIO'   # All-in-One Sports
    }
    
    if key in key_to_game:
        game_code = key_to_game[key]
        print(f"Matched game code: {game_code}")

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        key = data.get('key', '').lower()
        print(f"Received key from web app: {key}")
        
        # Simulate the key press with a small delay to ensure proper registration
        keyboard.press_and_release(key)
        
        return jsonify({
            "status": "success",
            "message": f"Key {key} received and processed",
            "key": key
        }), 200
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return jsonify({"status": "Server is running"}), 200

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint to verify server is running"""
    print("Health check endpoint hit")
    if request.method == 'OPTIONS':
        # Manually set CORS headers for OPTIONS request
        response = jsonify({"status": "healthy"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response, 200
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    try:
        # Register the keyboard listener
        keyboard.on_press(on_key_event)
        
        print("=== Game Launcher Server ===")
        print("Starting server on http://localhost:5001")
        print("Key mappings:")
        print("F -> Fruit Ninja VR")
        print("C -> Crisis Brigade 2")
        print("S -> Subside")
        print("P -> Propagation VR")
        print("I -> iB Cricket")
        print("A -> Arizona Sunshine")
        print("U -> Undead Citadel")
        print("E -> Elven Assassin")
        print("R -> Richie's Plank")
        print("V -> All-in-One Sports VR")
        print("\nPress Ctrl+C to exit")
        
        # Run the Flask app with threaded=True for better handling of concurrent requests
        app.run(host='localhost', port=5001, debug=True, threaded=True)
        
    except Exception as e:
        print(f"Error starting server: {str(e)}")

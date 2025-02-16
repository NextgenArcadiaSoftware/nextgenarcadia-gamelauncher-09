
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import subprocess
import os
import time
import logging
import keyboard
from typing import Dict, Optional

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='game_launcher.log'
)
logger = logging.getLogger(__name__)

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

@app.route('/keypress', methods=['POST', 'OPTIONS'])
def handle_keypress():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "ok"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        print("Received keypress request") # Debug print
        data = request.get_json()
        
        if not data:
            print("No data received in request") # Debug print
            return jsonify({"error": "No data received"}), 400
        
        key = data.get('key', '').lower()
        print(f"Processing key: {key}") # Debug print
        
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

        # Simulate the key press
        print(f"Simulating keypress for: {key}") # Debug print
        keyboard.press_and_release(key)
        
        # Check if this key maps to a game code
        if key in key_to_game:
            game_code = key_to_game[key]
            print(f"Matched game code: {game_code}") # Debug print
        
        return jsonify({
            "status": "success",
            "message": f"Key {key} received and processed",
            "key": key
        }), 200
        
    except Exception as e:
        print(f"Error processing keypress: {str(e)}") # Debug print
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint to verify server is running"""
    print("Health check endpoint hit") # Debug print
    if request.method == 'OPTIONS':
        response = jsonify({"status": "healthy"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response, 200
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    print("\n=== Game Launcher Server ===")
    print("Server Configuration:")
    print("- Debug prints enabled")
    print("- Server running on: http://localhost:5001")
    print("\nStarting server...")
    
    app.run(host='localhost', port=5001, debug=True, threaded=True)

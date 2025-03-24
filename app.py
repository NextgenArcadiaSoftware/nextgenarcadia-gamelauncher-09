from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import subprocess
import os
import time
import logging
import keyboard
import requests
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

def notify_electron_app(command):
    """Send a command to the Electron app's HTTP server"""
    try:
        # First try the regular notification endpoint
        response = requests.post('http://localhost:5005', data=command, timeout=2)
        print(f"Sent {command} to Electron app, response: {response.status_code}")
        
        # For STOP_GAME commands, also hit the dedicated stop endpoint
        if command == "STOP_GAME":
            stop_response = requests.post('http://localhost:5006/stop', timeout=2)
            print(f"Sent stop command to dedicated endpoint, response: {stop_response.status_code}")
            
        return response.status_code == 200
    except Exception as e:
        print(f"Error sending command to Electron app: {str(e)}")
        return False

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
        
        # Special handling for STOP_GAME command
        if key == 'stop' or key == 'stop_game':
            print("STOP_GAME command received! Killing game...")
            notify_electron_app("STOP_GAME")
            return jsonify({
                "status": "success",
                "message": "STOP_GAME command processed"
            }), 200
        
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

# Add a new endpoint to handle STOP_GAME commands
@app.route('/stop', methods=['GET', 'POST'])
def stop_game():
    """Endpoint to handle STOP_GAME command"""
    print("STOP_GAME command received! Killing game...")
    
    # Forward the command to the Electron app
    notify_electron_app("STOP_GAME")
    
    return jsonify({
        "status": "success",
        "message": "Game stopping command processed"
    }), 200

if __name__ == '__main__':
    print("\n=== Game Launcher Server ===")
    print("Server Configuration:")
    print("- Debug prints enabled")
    print("- Server running on: http://localhost:5001")
    print("\nStarting server...")
    
    app.run(host='localhost', port=5001, debug=True, threaded=True)

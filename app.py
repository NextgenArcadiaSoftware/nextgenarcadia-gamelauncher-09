
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import subprocess
import os
import time
import logging
import keyboard
import requests
import json
from typing import Dict, Optional

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("GameLauncherApp")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

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

# Game name mapping for prettier logging and responses
GAME_NAMES = {
    "FNJ": "Fruit Ninja VR",
    "EAX": "Elven Assassin",
    "CBR": "Crisis Brigade 2",
    "AIO": "All-In-One Sports VR",
    "RPE": "Richie's Plank Experience",
    "IBC": "iB Cricket",
    "UDC": "Undead Citadel",
    "ARS": "Arizona Sunshine",
    "SBS": "Subside",
    "PVR": "Propagation VR"
}

@app.before_request
def log_request_info():
    logger.info(f"Request: {request.method} {request.path}")
    logger.debug(f"Headers: {request.headers}")
    if request.path != '/health':  # Don't log health check bodies
        logger.debug(f"Body: {request.get_data()}")

def notify_electron_app(command):
    """Send a command to the Electron app's HTTP server"""
    try:
        # First try the regular notification endpoint
        response = requests.post('http://localhost:5005', data=command, timeout=2)
        logger.info(f"Sent {command} to Electron app, response: {response.status_code}")
        
        # For STOP_GAME commands, also hit the dedicated stop endpoint
        if command == "STOP_GAME":
            stop_response = requests.post('http://localhost:5006/stop', timeout=2)
            logger.info(f"Sent stop command to dedicated endpoint, response: {stop_response.status_code}")
            
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Error sending command to Electron app: {str(e)}")
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
        logger.info("Received keypress request") 
        data = request.get_json()
        
        if not data:
            logger.warning("No data received in request")
            return jsonify({"error": "No data received"}), 400
        
        key = data.get('key', '').lower()
        command = data.get('command', f"KEY_{key.upper()}_PRESSED")
        game_name = data.get('gameName', '')
        
        logger.info(f"Processing key: {key} with command: {command}")
        
        # Map keys to game codes for special handling
        key_to_game = {
            'f': 'FNJ',  # Fruit Ninja
            'c': 'CBR',  # Crisis Brigade
            's': 'SBS',  # Subside
            'g': 'PVR',  # Propagation
            'i': 'IBC',  # iB Cricket
            'a': 'ARS',  # Arizona Sunshine
            'u': 'UDC',  # Undead Citadel
            'e': 'EAX',  # Elven Assassin
            'r': 'RPE',  # Richies Plank
            'v': 'AIO',  # All-in-One Sports
        }
        
        display_info = ""
        if key in key_to_game:
            game_code = key_to_game[key]
            game_title = GAME_NAMES.get(game_code, game_code)
            display_info = f" - Launching {game_title}"
        elif game_name:
            display_info = f" - For game: {game_name}"
        
        # Clean key message format
        received_message = f"{key.upper()} key received{display_info}"
        logger.info(received_message)
        
        # Special handling for STOP_GAME command
        if key == 'stop' or key == 'stop_game':
            logger.info("STOP_GAME command received! Killing game...")
            notify_electron_app("STOP_GAME")
            return jsonify({
                "status": "success",
                "message": "STOP_GAME command processed"
            }), 200
        
        # Simulate the key press
        logger.info(f"Simulating keypress for: {key}")
        keyboard.press_and_release(key)
        
        return jsonify({
            "status": "success", 
            "message": received_message,
            "key": key,
            "command": command
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing keypress: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/close', methods=['POST'])
def handle_close():
    logger.info("Close command received, terminating all games...")
    try:
        data = request.get_json()
        game_name = data.get('gameName', '') if data else ''
        
        if game_name:
            logger.info(f"Closing game: {game_name}")
        
        # Simulate the Alt+F4 key press
        keyboard.press_and_release('alt+f4')
        # Notify Electron app about the close command
        notify_electron_app("STOP_GAME")
        return jsonify({
            "status": "success", 
            "message": f"Close command received, terminating games{' for ' + game_name if game_name else ''}"
        }), 200
    except Exception as e:
        logger.error(f"Error processing close command: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint to verify server is running"""
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
    logger.info("STOP_GAME command received! Killing game...")
    
    # Forward the command to the Electron app
    notify_electron_app("STOP_GAME")
    
    return jsonify({
        "status": "success",
        "message": "Game stopping command processed"
    }), 200

if __name__ == '__main__':
    logger.info("\n=== Game Launcher Server ===")
    logger.info("Server Configuration:")
    logger.info("- Debug level logging enabled")
    logger.info("- Server running on: http://localhost:5001")
    logger.info("\nEndpoints:")
    logger.info("- POST /keypress - Send a key press")
    logger.info("- POST /close - Close the current game")
    logger.info("- GET /health - Check server health")
    logger.info("- POST /stop - Stop the current game")
    logger.info("\nStarting server...")
    
    app.run(host='localhost', port=5001, debug=True, threaded=True)

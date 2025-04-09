import sys
import codecs
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
    "PVR": r"C:\Program Files (x86)\Steam\steamapps\common\Propagation VR\PropagationVR.exe",
    "BTS": r"C:\Program Files (x86)\Steam\steamapps\common\Beat Saber\Beat Saber.exe",
    "RCL": r"C:\Program Files (x86)\Steam\steamapps\common\RollerCoaster Legends\RollerCoasterLegends.exe"
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
    "PVR": "Propagation VR",
    "BTS": "Beat Saber",
    "RCL": "RollerCoaster Legends"
}

# Track currently running games
active_processes = {}

# Ensure stdout and stderr use UTF-8 encoding
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.buffer)
sys.stderr = codecs.getwriter("utf-8")(sys.stderr.buffer)

@app.before_request
def log_request_info():
    logger.info(f"Request: {request.method} {request.path}")
    logger.debug(f"Headers: {request.headers}")
    if request.path != '/health':  # Don't log health check bodies
        try:
            # Try to decode as UTF-8
            body_data = request.get_data(as_text=True)
            logger.debug(f"Body: {body_data}")
        except UnicodeDecodeError:
            # In case of binary or non-UTF-8 data
            logger.debug("Body: [Binary data or non-UTF-8 encoding]")

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

def launch_game(game_code):
    """Launch a game by its code"""
    if game_code in GAMES:
        executable_path = GAMES[game_code]
        game_name = GAME_NAMES.get(game_code, game_code)
        
        # Format the log message like the example
        launch_message = f"[≡ƒÄ«] Launched: {executable_path}"
        logger.info(launch_message)
        
        try:
            # Launch the game and store the process
            process = subprocess.Popen([executable_path])
            process_name = os.path.basename(executable_path)
            active_processes[process_name] = process
            
            return {"status": "success", "message": launch_message}
        except Exception as e:
            error_message = f"[≡ƒöÑ] Error launching {game_name}: {str(e)}"
            logger.error(error_message)
            return {"status": "error", "message": error_message}
    else:
        return {"status": "error", "message": f"Unknown game code: {game_code}"}

def terminate_games():
    """Terminate all running games"""
    logger.info("[≡ƒÆÇ] Terminating all games...")
    
    # Try to close using Alt+F4 for any active window
    keyboard.press_and_release('alt+f4')
    
    # Terminate any tracked processes
    for name, process in list(active_processes.items()):
        try:
            process.terminate()
            logger.info(f"[≡ƒöÑ] Killed: {name}")
            del active_processes[name]
        except Exception as e:
            logger.error(f"Error terminating {name}: {str(e)}")
    
    logger.info("[≡ƒÆÇ] All games terminated.")
    return {"status": "success", "message": "[≡ƒÆÇ] All games terminated."}

@app.route('/keypress', methods=['POST', 'OPTIONS'])
def handle_keypress():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "ok"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Accept-Charset')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        logger.info("Received keypress request") 
        data = request.get_json(force=True)  # Force decoding as JSON
        
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
            'w': 'BTS',  # Beat Saber (new)
            'l': 'RCL',  # RollerCoaster Legends (new)
        }
        
        # Handle game launch
        if key in key_to_game:
            game_code = key_to_game[key]
            result = launch_game(game_code)
            response = jsonify(result)
            response.headers['Content-Type'] = 'application/json; charset=utf-8'
            return response, 200
        
        # Handle special STOP_GAME command
        elif key == 'stop' or key == 'stop_game' or key == 'x':
            result = terminate_games()
            notify_electron_app("STOP_GAME")
            response = jsonify(result)
            response.headers['Content-Type'] = 'application/json; charset=utf-8'
            return response, 200
        
        # Default behavior - just simulate the key press
        else:
            logger.info(f"[≡ƒå«] Simulating keypress for: {key}")
            keyboard.press_and_release(key)
            
            result = {
                "status": "success", 
                "message": f"[≡ƒå«] Key {key.upper()} pressed",
                "key": key,
                "command": command
            }
            response = jsonify(result)
            response.headers['Content-Type'] = 'application/json; charset=utf-8'
            return response, 200
        
    except Exception as e:
        logger.error(f"Error processing keypress: {str(e)}")
        response = jsonify({"error": str(e)})
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response, 500

@app.route('/close', methods=['POST'])
def handle_close():
    logger.info("[≡ƒÆÇ] Terminating all games...")
    try:
        data = request.get_json(force=True) if request.get_data() else {}
        game_name = data.get('gameName', '') if data else ''
        
        if game_name:
            logger.info(f"Closing game: {game_name}")
        
        result = terminate_games()
        notify_electron_app("STOP_GAME")
        response = jsonify(result)
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response, 200
    except Exception as e:
        logger.error(f"Error processing close command: {str(e)}")
        response = jsonify({"error": str(e)})
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response, 500

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint to verify server is running"""
    if request.method == 'OPTIONS':
        response = jsonify({"status": "healthy"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response, 200
    
    response = jsonify({"status": "healthy"})
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response, 200

@app.route('/stop', methods=['GET', 'POST'])
def stop_game():
    """Endpoint to handle STOP_GAME command"""
    logger.info("[≡ƒÆÇ] Terminating all games...")
    
    result = terminate_games()
    notify_electron_app("STOP_GAME")
    
    response = jsonify(result)
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response, 200

if __name__ == '__main__':
    logger.info("\n=== Game Launcher Server ===")
    logger.info("Server Configuration:")
    logger.info("- Debug level logging enabled")
    logger.info("- Server running on: http://localhost:5002")
    logger.info("\nEndpoints:")
    logger.info("- POST /keypress - Send a key press")
    logger.info("- POST /close - Close the current game")
    logger.info("- GET /health - Check server health")
    logger.info("- POST /stop - Stop the current game")
    logger.info("\nStarting server...")
    
    app.run(host='localhost', port=5002, debug=True, threaded=True)

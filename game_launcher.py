
from flask import Flask, request, jsonify
from flask_cors import CORS
import keyboard
import threading
import json
import os
import subprocess
import requests
import time
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("game_launcher.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("GameLauncher")

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
    "CRD": r"C:\Program Files (x86)\Steam\steamapps\common\Creed Rise to Glory\Creed.exe"
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
    "CRD": "Creed: Rise to Glory"
}

app = Flask(__name__)
# Configure CORS to allow all origins and methods
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

# Track currently running games
active_processes = {}

@app.before_request
def log_request_info():
    logger.info(f"Request: {request.method} {request.path}")
    logger.debug(f"Headers: {request.headers}")
    logger.debug(f"Body: {request.get_data()}")

def notify_electron_app(command):
    """Send a command to the Electron app's HTTP server"""
    try:
        # Send the command to the Electron app's HTTP listener
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

def on_key_event(event):
    key = event.name.lower()
    logger.info(f"Key detected: {key}")
    
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
        'r': 'RPE',  # Richies Plank
        'v': 'AIO',  # All-in-One Sports
        'g': 'CRD'   # Creed Rise to Glory
    }
    
    if key in key_to_game:
        game_code = key_to_game[key]
        launch_game(game_code)
    elif key == 'x':
        terminate_games()

# Add a new route to handle the STOP_GAME command
@app.route('/stop-game', methods=['POST'])
def stop_game():
    try:
        logger.info("[≡ƒÆÇ] Terminating all games...")
        
        result = terminate_games()
        notify_electron_app("STOP_GAME")
        
        return jsonify(result), 200
            
    except Exception as e:
        logger.error(f"Error processing stop game command: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add a dedicated endpoint for ending games via API
@app.route('/end-game', methods=['GET', 'POST'])
def end_game():
    try:
        logger.info("[≡ƒÆÇ] Terminating all games...")
        
        result = terminate_games()
        notify_electron_app("STOP_GAME")
        
        # Also simulate the 'stop' keypress for legacy support
        keyboard.press_and_release('stop')
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error processing end game command: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/keypress', methods=['POST', 'OPTIONS'])
def handle_keypress():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "ok"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    try:
        data = request.get_json()
        logger.info(f"Keypress data received: {data}")
        
        if not data or 'key' not in data:
            logger.warning("Key not provided in request")
            return jsonify({"error": "Key not provided"}), 400
        
        key = data['key'].lower()
        command = data.get('command', f"KEY_{key.upper()}_PRESSED")
        
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
        
        # Handle game launch
        if key in key_to_game:
            game_code = key_to_game[key]
            result = launch_game(game_code)
            return jsonify(result), 200
            
        # Handle special STOP_GAME command
        elif key == 'stop' or key == 'stop_game' or key == 'x':
            result = terminate_games()
            notify_electron_app("STOP_GAME")
            return jsonify(result), 200
            
        # Default behavior - just simulate the key press
        else:
            logger.info(f"[≡ƒå«] Simulating keypress for: {key}")
            keyboard.press_and_release(key)
            
            return jsonify({
                "status": "success", 
                "message": f"[≡ƒå«] Key {key.upper()} pressed",
                "key": key,
                "command": command
            }), 200
    except Exception as e:
        logger.error(f"Error processing keypress: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/close', methods=['POST'])
def handle_close():
    logger.info("[≡ƒÆÇ] Terminating all games...")
    try:
        result = terminate_games()
        notify_electron_app("STOP_GAME")
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error processing close command: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return jsonify({"status": "Server is running"}), 200

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    if request.method == 'OPTIONS':
        response = jsonify({"status": "healthy"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response, 200
    
    logger.debug("Health check endpoint accessed")
    return jsonify({"status": "Server is healthy"}), 200

if __name__ == "__main__":
    try:
        # Register the keyboard listener
        keyboard.on_press(on_key_event)
        
        logger.info("=== Game Launcher Server ===")
        logger.info("Starting server on http://localhost:5001")
        logger.info("Key mappings:")
        for k, code in {
            'F': 'Fruit Ninja VR',
            'C': 'Crisis Brigade 2',
            'S': 'Subside',
            'G': 'Propagation VR',
            'I': 'iB Cricket',
            'A': 'Arizona Sunshine',
            'U': 'Undead Citadel',
            'E': 'Elven Assassin',
            'R': 'Richie\'s Plank',
            'V': 'All-in-One Sports VR'
        }.items():
            logger.info(f"{k} -> {code}")
        
        logger.info("\nPress Ctrl+C to exit")
        logger.info("\nSpecial Commands:")
        logger.info("Alt+F4 -> Force close active application")
        logger.info("STOP_GAME -> End current game session")
        logger.info("API Endpoints:")
        logger.info("GET/POST /end-game -> End current game session via API")
        logger.info("POST /keypress -> Send keypress to system")
        logger.info("POST /close -> Close active game")
        logger.info("GET /health -> Check server health")
        
        # Run the Flask app with threaded=True for better handling of concurrent requests
        app.run(host='localhost', port=5001, debug=True, threaded=True)
        
    except Exception as e:
        logger.critical(f"Error starting server: {str(e)}")

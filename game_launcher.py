
from flask import Flask, request, jsonify
from flask_cors import CORS
import keyboard
import threading
import json
import os
import subprocess
import requests

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

# Dictionary for readable game names from keys
GAME_NAMES = {
    'f': 'Fruit Ninja VR',
    'c': 'Crisis Brigade 2',
    's': 'Subside',
    'p': 'Propagation VR',
    'i': 'iB Cricket',
    'a': 'Arizona Sunshine',
    'u': 'Undead Citadel',
    'e': 'Elven Assassin',
    'r': 'Richie\'s Plank Experience',
    'v': 'All-in-One Sports VR',
    'g': 'Creed Rise to Glory'
}

app = Flask(__name__)
# Configure CORS to allow all origins and methods
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})

@app.before_request
def log_request_info():
    print('Headers: %s', request.headers)
    print('Body: %s', request.get_data())
    print('Route: %s', request.path)

def notify_electron_app(command):
    """Send a command to the Electron app's HTTP server"""
    try:
        # Send the command to the Electron app's HTTP listener
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

def on_key_event(event):
    key = event.name.lower()
    game_name = GAME_NAMES.get(key, "Unknown Game")
    print(f"Key detected: {key} - Game: {game_name}")
    
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
        'v': 'AIO',  # All-in-One Sports
        'g': 'CRD'   # Creed Rise to Glory
    }
    
    if key in key_to_game:
        game_code = key_to_game[key]
        print(f"Matched game code: {game_code} for {GAME_NAMES.get(key)}")

# Add a new route to handle the STOP_GAME command
@app.route('/stop-game', methods=['POST'])
def stop_game():
    try:
        print("STOP_GAME command received! Killing game...")
        
        # Forward the command to the Electron app
        if notify_electron_app("STOP_GAME"):
            return jsonify({
                "status": "success", 
                "message": "Stop game command forwarded to Electron app"
            }), 200
        else:
            return jsonify({
                "status": "warning",
                "message": "Stop game command received but failed to notify Electron app"
            }), 200
            
    except Exception as e:
        print(f"Error processing stop game command: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Add a dedicated endpoint for ending games via API
@app.route('/end-game', methods=['GET', 'POST'])
def end_game():
    try:
        print("END_GAME command received via API! Ending game session...")
        
        # Send stop command to the Electron app
        notify_electron_app("STOP_GAME")
        
        # Also simulate the 'stop' keypress for legacy support
        keyboard.press_and_release('stop')
        
        return jsonify({
            "status": "success",
            "message": "Game end command processed successfully"
        }), 200
    except Exception as e:
        print(f"Error processing end game command: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    data = request.get_json()
    
    # Enhanced logging of the request payload
    print(f"Received keypress request: {data}")
    
    # Get the key from the payload or default values
    key = data.get('key', '').lower() if data and 'key' in data else None
    command = data.get('command', '') if data else ''
    game_name = data.get('game', '') if data else ''
    
    # Log rich information about what we're processing
    if key:
        mapped_game = GAME_NAMES.get(key, "Unknown Game")
        print(f"Simulating key press: {key} for game: {mapped_game if not game_name else game_name}")
        keyboard.press_and_release(key)
        return jsonify({
            "status": "success", 
            "message": f"Key '{key}' received and pressed successfully",
            "game": mapped_game if not game_name else game_name
        }), 200
    elif command == 'GAME_LAUNCH' and game_name:
        # Handle the GAME_LAUNCH command with explicit game name
        print(f"Game launch command received for: {game_name}")
        
        # Find the corresponding key for this game
        game_key = None
        for k, name in GAME_NAMES.items():
            if name.lower() == game_name.lower():
                game_key = k
                break
        
        if game_key:
            print(f"Found key {game_key} for game {game_name}, simulating keypress")
            keyboard.press_and_release(game_key)
            return jsonify({
                "status": "success", 
                "message": f"Game '{game_name}' launched successfully",
                "game": game_name
            }), 200
        else:
            print(f"No key mapping found for game: {game_name}")
            return jsonify({"error": f"No key mapping found for game: {game_name}"}), 400
    else:
        print("Invalid keypress request format")
        return jsonify({"error": "Key not provided"}), 400

@app.route('/close', methods=['POST'])
def handle_close():
    print("Close command received, terminating all games...")
    # Implement your game closing logic here
    try:
        # Simulate the X key press
        keyboard.press_and_release('alt+f4')
        # Notify Electron app about the close command
        notify_electron_app("STOP_GAME")
        return jsonify({
            "status": "success", 
            "message": "Close command received, terminating all games"
        }), 200
    except Exception as e:
        print(f"Error processing close command: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return jsonify({"status": "Server is running"}), 200

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    return jsonify({"status": "Server is healthy"}), 200

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
        print("G -> Creed Rise to Glory")
        print("\nPress Ctrl+C to exit")
        print("\nSpecial Commands:")
        print("Alt+F4 -> Force close active application")
        print("STOP_GAME -> End current game session")
        print("API Endpoints:")
        print("GET/POST /end-game -> End current game session via API")
        
        # Run the Flask app with threaded=True for better handling of concurrent requests
        app.run(host='localhost', port=5001, debug=True, threaded=True)
        
    except Exception as e:
        print(f"Error starting server: {str(e)}")

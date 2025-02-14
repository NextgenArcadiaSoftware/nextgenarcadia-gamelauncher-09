
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
CORS(app)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='game_launcher.log'
)
logger = logging.getLogger(__name__)

# Global variable to track the current game process
CURRENT_PROCESS: Optional[subprocess.Popen] = None
GAME_TIMER = None

def stop_current_game():
    global CURRENT_PROCESS
    if CURRENT_PROCESS:
        try:
            CURRENT_PROCESS.terminate()
            CURRENT_PROCESS = None
            logger.info("Game process terminated")
        except Exception as e:
            logger.error(f"Error terminating game: {str(e)}")

@app.route('/api/launch', methods=['POST'])
def launch_game():
    global CURRENT_PROCESS
    
    try:
        data = request.get_json()
        
        if not data:
            logger.error("No data provided in request")
            return jsonify({'error': 'No data provided'}), 400

        command = data.get('command')
        
        if command == 'stop_game':
            stop_current_game()
            return jsonify({'status': 'Game stopped successfully'}), 200
            
        path = data.get('path')
        if not path:
            logger.error("No path provided in request")
            return jsonify({'error': 'No path provided'}), 400
            
        # Stop any currently running game
        stop_current_game()
        
        # Launch the new game
        logger.info(f"Launching game: {path}")
        CURRENT_PROCESS = subprocess.Popen(path, shell=True)
        
        # Simulate keyboard input for the Python script
        keyboard.write('start_game')
        keyboard.press('enter')
        
        return jsonify({'status': 'Game launched successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error launching game: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("\n=== Game Launcher Server ===")
    print("\nServer Configuration:")
    print("- Logging enabled: check game_launcher.log for details")
    print("\nStarting server...")
    
    # Start the server
    app.run(host='0.0.0.0', port=8080)

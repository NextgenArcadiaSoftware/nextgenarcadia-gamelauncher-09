
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

@app.before_request
def log_request_info():
    logger.info(f'Headers: {request.headers}')
    logger.info(f'Body: {request.get_data()}')
    logger.info(f'Route: {request.path}')

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint to verify server is running"""
    logger.info("Health check endpoint hit")
    if request.method == 'OPTIONS':
        response = jsonify({"status": "healthy"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response, 200
    return jsonify({"status": "healthy"}), 200

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
        
        return jsonify({'status': 'Game launched successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error launching game: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        key = data.get('key', '').lower()
        logger.info(f"Received key from web app: {key}")
        
        # Simulate the key press
        keyboard.press_and_release(key)
        
        return jsonify({
            "status": "success",
            "message": f"Key {key} received and processed",
            "key": key
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

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
    print("- Server running on: http://localhost:5001")
    print("\nStarting server...")
    
    # Start the server
    app.run(host='localhost', port=5001, debug=True, threaded=True)

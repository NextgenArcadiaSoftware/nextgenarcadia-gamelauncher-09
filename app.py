
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import subprocess
import os
import time
import logging
from typing import List, Dict

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='game_launcher.log'
)
logger = logging.getLogger(__name__)

# Rate limiting configuration
RATE_LIMIT_SECONDS = 10  # Minimum seconds between game launches
last_launch_time = 0

# Whitelist of allowed games with their paths
# Add your actual game paths here
ALLOWED_GAMES: Dict[str, str] = {
    "Undead Citadel Demo": "C:\\Users\\User\\Desktop\\Undead Citadel Demo.url",
    "Pavlov VR": "C:\\Program Files (x86)\\Steam\\steamapps\\common\\All-In-One Sports VR\\AllInOneSports.exe",
    "Ghosts of Tabor": "C:\\Program Files\\Steam\\steamapps\\common\\Ghosts of Tabor\\GhostsOfTabor.exe",
    "Hard Bullet": "C:\\Program Files\\Steam\\steamapps\\common\\Hard Bullet\\Hard Bullet.exe",
    "Arizona Sunshine": "C:\\Program Files\\Steam\\steamapps\\common\\Arizona Sunshine\\ArizonaSunshine.exe",
    "Blade & Sorcery": "C:\\Program Files\\Steam\\steamapps\\common\\Blade & Sorcery\\BladeAndSorcery.exe"
}

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        global last_launch_time
        current_time = time.time()
        
        if current_time - last_launch_time < RATE_LIMIT_SECONDS:
            logger.warning(f"Rate limit exceeded - Request blocked")
            return jsonify({
                'error': f'Please wait {RATE_LIMIT_SECONDS} seconds between launching games'
            }), 429
            
        last_launch_time = current_time
        return f(*args, **kwargs)
    return decorated_function

def validate_game_path(path: str) -> bool:
    """Validate if the game path is in our whitelist"""
    return path in ALLOWED_GAMES.values()

@app.route('/api/launch', methods=['POST'])
@rate_limit
def launch_game():
    try:
        data = request.get_json()
        
        if not data or 'path' not in data:
            logger.error("No path provided in request")
            return jsonify({'error': 'No path provided'}), 400

        path = data.get('path')
        
        # Validate path against whitelist
        if not validate_game_path(path):
            logger.warning(f"Attempted to launch unauthorized game: {path}")
            return jsonify({'error': 'Unauthorized game path'}), 403
            
        # Check if file exists
        if not os.path.exists(path):
            logger.error(f"Game executable not found: {path}")
            return jsonify({'error': 'Game executable not found'}), 404
            
        # Launch the game
        logger.info(f"Launching game: {path}")
        subprocess.Popen([path], shell=True)
        
        return jsonify({'status': 'Game launched successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error launching game: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/games', methods=['GET'])
def list_games():
    """Endpoint to list all available games"""
    return jsonify({
        'games': [{'title': title, 'path': path} 
                 for title, path in ALLOWED_GAMES.items()]
    })

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Print startup information
    print("\n=== Game Launcher Server ===")
    print("Available games:")
    for title in ALLOWED_GAMES.keys():
        print(f"- {title}")
    print("\nServer Configuration:")
    print(f"- Rate limit: {RATE_LIMIT_SECONDS} seconds between launches")
    print("- Logging enabled: check game_launcher.log for details")
    print("\nStarting server...")
    
    # Start the server
    app.run(host='0.0.0.0', port=8080, debug=True)

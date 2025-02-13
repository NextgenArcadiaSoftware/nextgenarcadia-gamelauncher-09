
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/launch', methods=['POST'])
def launch_game():
    try:
        data = request.get_json()
        path = data.get('path')
        
        if not path:
            return jsonify({'error': 'No path provided'}), 400
            
        if not os.path.exists(path):
            return jsonify({'error': 'Game executable not found'}), 404
            
        # Launch the game using subprocess
        subprocess.Popen([path], shell=True)
        
        return jsonify({'status': 'Launched'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)


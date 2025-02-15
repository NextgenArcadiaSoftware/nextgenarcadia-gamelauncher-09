
import keyboard
import os
import http.server
import json
import threading
from flask import Flask, request
from flask_cors import CORS

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

PORT = 5001

def on_key_event(event):
    key = event.name
    print(f"Key Pressed: {key}")

    if key.lower() == "f":
        print("F key detected, ready to launch game")
        # The actual game launch will be triggered by the game code (e.g., FNJ, EAX)

# Listen for key presses globally
keyboard.on_press(on_key_event)

app = Flask(__name__)
CORS(app)

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    data = request.get_json()
    key = data.get('key', '').lower()
    print(f"Received key from web app: {key}")

    # Simulate the key press
    keyboard.press_and_release(key)

    return json.dumps({"status": "success", "message": f"Key {key} received"}), 200

def start_server():
    app.run(host='localhost', port=PORT)

if __name__ == "__main__":
    # Start the Flask server in a separate thread
    thread = threading.Thread(target=start_server)
    thread.daemon = True
    thread.start()

    print(f"Key listener started on port {PORT}")
    keyboard.wait()  # Keep the script running

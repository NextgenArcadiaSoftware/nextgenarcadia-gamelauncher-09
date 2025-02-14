
import keyboard
import time
import os
import json
import requests
from typing import Dict, Optional
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='game_launcher.log'
)
logger = logging.getLogger(__name__)

class GameLauncher:
    def __init__(self):
        self.current_game: Optional[str] = None
        self.game_paths: Dict[str, str] = {
            'Elven Assassin': r'C:\Program Files\Steam\steamapps\common\Elven Assassin\ElvenAssassin.exe',
            'Fruit Ninja VR': r'C:\Program Files\Steam\steamapps\common\Fruit Ninja VR\FruitNinja.exe',
            'Crisis Brigade 2 Reloaded': r'C:\Program Files\Steam\steamapps\common\Crisis Brigade 2\CrisisBrigade2.exe',
            'All-In-One Sports VR': r'C:\Program Files\Steam\steamapps\common\All-In-One Sports VR\AllInOneSportsVR.exe',
            'Richies Plank Experience': r'C:\Program Files\Steam\steamapps\common\Richie\'s Plank Experience\PlankExperience.exe',
            'iB Cricket': r'C:\Program Files\Steam\steamapps\common\iB Cricket\iB Cricket.exe',
            'Undead Citadel': r'C:\Program Files\Steam\steamapps\common\Undead Citadel\UndeadCitadel.exe',
            'Arizona Sunshine': r'C:\Program Files\Steam\steamapps\common\Arizona Sunshine\ArizonaSunshine.exe',
            'Subside': r'C:\Program Files\Steam\steamapps\common\Subside\Subside.exe',
            'Propagation VR': r'C:\Program Files\Steam\steamapps\common\Propagation VR\PropagationVR.exe'
        }
        
    def launch_game(self, game_title: str) -> bool:
        """
        Launch a game by its title
        """
        try:
            if game_title not in self.game_paths:
                logger.error(f"Game {game_title} not found in paths")
                return False
                
            path = self.game_paths[game_title]
            if not os.path.exists(path):
                logger.error(f"Game executable not found at path: {path}")
                return False
                
            # Stop any currently running game
            self.stop_current_game()
            
            # Launch the new game by sending a request to the Flask server
            response = requests.post('http://localhost:8080/api/launch', 
                json={'path': path})
                
            if response.status_code == 200:
                self.current_game = game_title
                logger.info(f"Successfully launched game: {game_title}")
                return True
            else:
                logger.error(f"Failed to launch game: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error launching game {game_title}: {str(e)}")
            return False
            
    def stop_current_game(self) -> bool:
        """
        Stop the currently running game
        """
        try:
            if self.current_game:
                response = requests.post('http://localhost:8080/api/launch',
                    json={'command': 'stop_game'})
                    
                if response.status_code == 200:
                    logger.info(f"Successfully stopped game: {self.current_game}")
                    self.current_game = None
                    return True
                else:
                    logger.error(f"Failed to stop game: {response.text}")
                    return False
            return True
            
        except Exception as e:
            logger.error(f"Error stopping game: {str(e)}")
            return False

def main():
    launcher = GameLauncher()
    print("\n=== VR Game Launcher ===")
    print("\nWaiting for game launch commands...")
    
    while True:
        try:
            # Wait for keyboard input
            event = keyboard.read_event(suppress=True)
            
            if event.event_type == keyboard.KEY_DOWN:
                if event.name == 'esc':
                    print("\nStopping current game...")
                    launcher.stop_current_game()
                    
                # You can add more keyboard shortcuts here
                
            time.sleep(0.1)  # Small delay to prevent high CPU usage
            
        except KeyboardInterrupt:
            print("\nExiting Game Launcher...")
            launcher.stop_current_game()
            break
        except Exception as e:
            logger.error(f"Error in main loop: {str(e)}")
            time.sleep(1)  # Delay before retrying

if __name__ == "__main__":
    main()

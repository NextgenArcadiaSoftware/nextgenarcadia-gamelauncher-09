
import subprocess
import time
import os
import logging
from typing import Dict, Optional
import keyboard
from supabase import create_client, Client

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='game_launcher.log'
)
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase: Client = create_client(
    "https://kucigyynsgjfymtzzwvs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2lneXluc2dqZnltdHp6d3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1Mjc2MjgsImV4cCI6MjA1NTEwMzYyOH0.lcAlKNHWkj8uId-oFU2lHeCHQZcLwaZSSlc3H5erTrA"
)

class GameLauncher:
    def __init__(self):
        self.current_process: Optional[subprocess.Popen] = None
        self.session_timer: Optional[float] = None
        self.session_duration = 8 * 60  # 8 minutes in seconds
        self.rfid_buffer = ""
        self.last_rfid_time = 0
        
        # Dictionary mapping trigger words to game paths and full names
        self.games: Dict[str, Dict[str, str]] = {
            'elven': {
                'path': r'C:\Program Files\Steam\steamapps\common\Elven Assassin\ElvenAssassin.exe',
                'name': 'Elven Assassin'
            },
            'fruit': {
                'path': r'C:\Program Files\Steam\steamapps\common\Fruit Ninja VR\FruitNinja.exe',
                'name': 'Fruit Ninja VR'
            },
            'crisis': {
                'path': r'C:\Program Files\Steam\steamapps\common\Crisis Brigade 2\CrisisBrigade2.exe',
                'name': 'Crisis Brigade 2 Reloaded'
            },
            'sports': {
                'path': r'C:\Program Files\Steam\steamapps\common\All-In-One Sports VR\AllInOneSportsVR.exe',
                'name': 'All-In-One Sports VR'
            },
            'plank': {
                'path': r'C:\Program Files\Steam\steamapps\common\Richie\'s Plank Experience\PlankExperience.exe',
                'name': 'Richies Plank Experience'
            },
            'cricket': {
                'path': r'C:\Program Files\Steam\steamapps\common\iB Cricket\iB Cricket.exe',
                'name': 'iB Cricket'
            },
            'undead': {
                'path': r'C:\Program Files\Steam\steamapps\common\Undead Citadel\UndeadCitadel.exe',
                'name': 'Undead Citadel'
            },
            'arizona': {
                'path': r'C:\Program Files\Steam\steamapps\common\Arizona Sunshine\ArizonaSunshine.exe',
                'name': 'Arizona Sunshine'
            },
            'subside': {
                'path': r'C:\Program Files\Steam\steamapps\common\Subside\Subside.exe',
                'name': 'Subside'
            },
            'propagation': {
                'path': r'C:\Program Files\Steam\steamapps\common\Propagation VR\PropagationVR.exe',
                'name': 'Propagation VR'
            }
        }

    async def get_trigger_word_from_rfid(self, rfid_code: str) -> Optional[str]:
        """
        Get the trigger word associated with an RFID code from the database
        """
        try:
            response = await supabase.table('rfid_game_mappings').select('trigger_word').eq('rfid_code', rfid_code).single().execute()
            if response.data:
                return response.data['trigger_word']
            return None
        except Exception as e:
            logger.error(f"Error getting trigger word for RFID {rfid_code}: {str(e)}")
            return None

    def launch_game(self, trigger_word: str) -> bool:
        """
        Launch a game using its trigger word
        """
        try:
            if trigger_word not in self.games:
                logger.error(f"Game trigger '{trigger_word}' not recognized")
                return False

            game_info = self.games[trigger_word]
            path = game_info['path']
            
            if not os.path.exists(path):
                logger.error(f"Game executable not found at path: {path}")
                return False

            # Stop any currently running game
            self.stop_current_game()

            # Launch the new game
            logger.info(f"Launching {game_info['name']}...")
            print(f"\nLaunching {game_info['name']}...")
            
            self.current_process = subprocess.Popen(path, shell=True)
            self.session_timer = time.time()
            
            logger.info(f"Successfully launched {game_info['name']}")
            print(f"Session will end in {self.session_duration // 60} minutes")
            return True

        except Exception as e:
            logger.error(f"Error launching game: {str(e)}")
            return False

    def stop_current_game(self) -> bool:
        """
        Stop the currently running game
        """
        try:
            if self.current_process:
                self.current_process.terminate()
                self.current_process = None
                self.session_timer = None
                logger.info("Game stopped successfully")
                print("\nGame stopped")
                return True
            return True

        except Exception as e:
            logger.error(f"Error stopping game: {str(e)}")
            return False

    def check_session_timeout(self) -> bool:
        """
        Check if the current session has timed out
        """
        if self.session_timer and self.current_process:
            elapsed_time = time.time() - self.session_timer
            if elapsed_time >= self.session_duration:
                print("\nSession time expired - stopping game...")
                self.stop_current_game()
                return True
        return False

    def handle_rfid_input(self, char: str) -> None:
        """
        Handle RFID card input character by character
        """
        current_time = time.time()
        
        # If more than 1 second has passed since last input, clear the buffer
        if current_time - self.last_rfid_time > 1:
            self.rfid_buffer = ""
            
        self.last_rfid_time = current_time
        
        # Add character to buffer
        if char.isalnum():  # Only accept alphanumeric characters
            self.rfid_buffer += char
            
        # Most RFID readers end with a return character
        if char == '\r' or char == '\n':
            if len(self.rfid_buffer) > 0:
                logger.info(f"RFID code read: {self.rfid_buffer}")
                trigger_word = self.get_trigger_word_from_rfid(self.rfid_buffer)
                if trigger_word:
                    self.launch_game(trigger_word)
                else:
                    logger.warning(f"No game associated with RFID code: {self.rfid_buffer}")
                self.rfid_buffer = ""

def main():
    launcher = GameLauncher()
    print("\n=== VR Game Launcher ===")
    print("\nAvailable trigger words:")
    for trigger, info in launcher.games.items():
        print(f"'{trigger}' for {info['name']}")
    print("\nPress 'esc' to stop the current game")
    print("Type 'exit' to quit the launcher")
    print("\nScanning for RFID cards...")

    while True:
        try:
            # Check for session timeout
            launcher.check_session_timeout()

            # Check for keyboard events
            event = keyboard.read_event(suppress=True)
            
            if event.event_type == keyboard.KEY_DOWN:
                if event.name == 'esc':
                    print("\nStopping current game...")
                    launcher.stop_current_game()
                elif event.name == 'enter':
                    command = keyboard.get_typed_strings(keyboard.get_hotkey_name())[0].lower().strip()
                    if command == 'exit':
                        break
                    elif command in launcher.games:
                        launcher.launch_game(command)
                    else:
                        launcher.handle_rfid_input(command)
                else:
                    # Handle RFID input character by character
                    launcher.handle_rfid_input(event.name)
                
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

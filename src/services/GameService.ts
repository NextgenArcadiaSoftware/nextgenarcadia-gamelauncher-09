
/**
 * GameService - Handles communication with the C++ game server
 */

// Default timeout for fetch requests
const DEFAULT_TIMEOUT = 5000;

// Base URL for the C++ server
const SERVER_URL = 'http://localhost:5001';

/**
 * Sends a keypress to the C++ server
 * @param key The key to send
 * @returns Promise with the server response
 */
export const sendKeyPress = async (key: string): Promise<any> => {
  console.log(`Sending key ${key} to game server`);
  
  try {
    const response = await fetch(`${SERVER_URL}/keypress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify({ key: key.toLowerCase() }),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT)
    });
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return {
        status: 204,
        message: `Successfully sent key ${key} to server`
      };
    }
    
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    
    // Ensure proper UTF-8 decoding
    const text = await response.text();
    const decodedText = new TextDecoder('utf-8').decode(new TextEncoder().encode(text));
    
    try {
      return JSON.parse(decodedText);
    } catch (e) {
      // If it's not JSON, return the text
      return { status: response.status, message: decodedText };
    }
  } catch (error) {
    console.error('Error sending keypress:', error);
    throw error;
  }
};

/**
 * Closes all running games
 * @param gameName Optional specific game to close
 * @returns Promise with the server response
 */
export const closeGames = async (gameName?: string): Promise<any> => {
  console.log(`Closing games ${gameName ? `(${gameName})` : ''}`);
  
  try {
    const payload = gameName ? { gameName } : {};
    
    const response = await fetch(`${SERVER_URL}/close`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT)
    });
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return {
        status: 204,
        message: `Successfully closed ${gameName || 'all games'}`
      };
    }
    
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    
    // Ensure proper UTF-8 decoding
    const text = await response.text();
    const decodedText = new TextDecoder('utf-8').decode(new TextEncoder().encode(text));
    
    try {
      return JSON.parse(decodedText);
    } catch (e) {
      // If it's not JSON, return the text
      return { status: response.status, message: decodedText };
    }
  } catch (error) {
    console.error('Error closing games:', error);
    throw error;
  }
};

/**
 * Checks the health of the game server
 * @returns Promise with boolean indicating if server is healthy
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SERVER_URL}/health`, {
      headers: { 'Accept-Charset': 'UTF-8' },
      signal: AbortSignal.timeout(2000)
    });
    
    return response.ok || response.status === 204 || response.status === 404;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

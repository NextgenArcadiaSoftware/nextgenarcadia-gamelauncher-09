
/**
 * GameService - Handles direct communication with the C++ game server
 */

// Default timeout for fetch requests
const DEFAULT_TIMEOUT = 5000;

// Base URL for the C++ server
const SERVER_URL = 'http://localhost:5001';

/**
 * Sends a keypress directly to the C++ server
 * @param key The key to send
 * @returns Promise with the server response
 */
export const sendKeyPress = async (key: string): Promise<any> => {
  console.log(`Sending key ${key} directly to C++ game server`);
  
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
        message: `Successfully sent key ${key} to C++ server`
      };
    }
    
    if (!response.ok) {
      throw new Error(`C++ server returned status: ${response.status}`);
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
    console.error('Error sending keypress to C++ server:', error);
    throw error;
  }
};

/**
 * Closes all running games by communicating directly with C++ server
 * @param gameName Optional specific game to close
 * @returns Promise with the server response
 */
export const closeGames = async (gameName?: string): Promise<any> => {
  console.log(`Closing games ${gameName ? `(${gameName})` : ''} - direct C++ server request`);
  
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
        message: `Successfully closed ${gameName || 'all games'} via C++ server`
      };
    }
    
    if (!response.ok) {
      throw new Error(`C++ server returned status: ${response.status}`);
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
    console.error('Error closing games via C++ server:', error);
    throw error;
  }
};

/**
 * Checks the health of the C++ game server directly
 * @returns Promise with boolean indicating if server is healthy
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SERVER_URL}/health`, {
      headers: { 'Accept-Charset': 'UTF-8' },
      signal: AbortSignal.timeout(2000)
    });
    
    // C++ server might return 404 for health endpoint but still be working
    return response.ok || response.status === 204 || response.status === 404;
  } catch (error) {
    console.error('C++ server health check failed:', error);
    return false;
  }
};

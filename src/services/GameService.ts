
/**
 * GameService - Handles direct communication with the C++ game server
 */

// Default timeout for fetch requests
const DEFAULT_TIMEOUT = 5000;

// Base URL for the C++ server
const SERVER_URL = 'http://localhost:5001';

// Max number of retries for failed requests
const MAX_RETRIES = 2;

// Delay between retries in milliseconds
const RETRY_DELAY = 1000;

/**
 * Sends a keypress directly to the C++ server
 * @param key The key to send
 * @param retries Number of retries attempted
 * @returns Promise with the server response
 */
export const sendKeyPress = async (key: string, retries = 0): Promise<any> => {
  console.log(`Sending key ${key} directly to C++ game server${retries > 0 ? ` (retry ${retries}/${MAX_RETRIES})` : ''}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    const response = await fetch(`${SERVER_URL}/keypress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify({ key: key.toLowerCase() }),
      signal: controller.signal,
      mode: 'cors', // Explicit CORS mode
      credentials: 'same-origin'
    });
    
    clearTimeout(timeoutId);
    
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
    
    // Implement retry logic
    if (retries < MAX_RETRIES && error.name !== 'AbortError') {
      console.log(`Retrying keypress in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return sendKeyPress(key, retries + 1);
    }
    
    // If all retries failed or it was an abort, throw the error
    throw error;
  }
};

/**
 * Closes all running games by communicating directly with C++ server
 * @param gameName Optional specific game to close
 * @param retries Number of retries attempted
 * @returns Promise with the server response
 */
export const closeGames = async (gameName?: string, retries = 0): Promise<any> => {
  console.log(`Closing games ${gameName ? `(${gameName})` : ''} - direct C++ server request${retries > 0 ? ` (retry ${retries}/${MAX_RETRIES})` : ''}`);
  
  try {
    const payload = gameName ? { gameName } : {};
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    const response = await fetch(`${SERVER_URL}/close`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      mode: 'cors', // Explicit CORS mode
      credentials: 'same-origin'
    });
    
    clearTimeout(timeoutId);
    
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
    
    // Implement retry logic
    if (retries < MAX_RETRIES && error.name !== 'AbortError') {
      console.log(`Retrying close command in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return closeGames(gameName, retries + 1);
    }
    
    throw error;
  }
};

/**
 * Checks the health of the C++ game server directly
 * @param retries Number of retries attempted
 * @returns Promise with boolean indicating if server is healthy
 */
export const checkServerHealth = async (retries = 0): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Shorter timeout for health checks
    
    const response = await fetch(`${SERVER_URL}/health`, {
      headers: { 'Accept-Charset': 'UTF-8' },
      signal: controller.signal,
      mode: 'cors', // Explicit CORS mode
      credentials: 'same-origin'
    });
    
    clearTimeout(timeoutId);
    
    // C++ server might return 404 for health endpoint but still be working
    return response.ok || response.status === 204 || response.status === 404;
  } catch (error) {
    console.error('C++ server health check failed:', error);
    
    // Implement retry logic for health checks
    if (retries < MAX_RETRIES && error.name !== 'AbortError') {
      console.log(`Retrying health check in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return checkServerHealth(retries + 1);
    }
    
    return false;
  }
};


/**
 * GameService - Handles direct communication with the C++ game server
 */

// Default timeout for fetch requests
const DEFAULT_TIMEOUT = 5000;

// Base URL for the C++ server
const SERVER_URL = 'http://localhost:5001';

// Max number of retries for failed requests
const MAX_RETRIES = 2;

// Retry delay in milliseconds
const RETRY_DELAY = 1000;

// Flag to reduce console error spam for health checks
let hasLoggedConnectionError = false;

// Flag to detect if we're running in preview mode (not localhost)
const IS_PREVIEW_MODE = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

/**
 * Custom fetch function with better error handling and CORS options
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise with the response
 */
async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Create controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.signal instanceof AbortSignal ? undefined : DEFAULT_TIMEOUT);

  try {
    // Set default headers for better CORS compatibility
    const headers = {
      ...(options.headers || {}),
      'Accept-Charset': 'UTF-8'
    };

    // Handle CORS differently based on environment
    let corsOptions: RequestInit;
    
    if (IS_PREVIEW_MODE) {
      // In preview mode, try with 'no-cors' mode first
      corsOptions = {
        ...options,
        headers,
        mode: 'no-cors' as RequestMode,
        credentials: 'same-origin' as RequestCredentials,
        signal: options.signal || controller.signal
      };
      
      // For health checks in no-cors mode, we can't read the response
      // so we'll consider any non-error response as successful
      if (url.includes('/health') && !options.method) {
        try {
          await fetch(url, corsOptions);
          // If we get here without an error, the server is likely running
          // Create a mock successful response
          return new Response(JSON.stringify({ status: "healthy" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          // If no-cors mode fails, we'll throw this error to be caught below
          throw error;
        }
      }
    }
    
    // For other requests or if not in preview mode
    corsOptions = {
      ...options,
      headers,
      mode: 'cors' as RequestMode,
      credentials: 'same-origin' as RequestCredentials,
      signal: options.signal || controller.signal
    };

    // Make the request
    const response = await fetch(url, corsOptions);
    
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Helper to decode text responses properly
 * @param response Fetch Response object
 * @returns Properly decoded text
 */
async function decodeResponse(response: Response): Promise<string> {
  // Handle 204 No Content responses
  if (response.status === 204) {
    return "Operation completed successfully with no content";
  }

  const text = await response.text();
  // Ensure proper UTF-8 decoding
  return new TextDecoder('utf-8').decode(new TextEncoder().encode(text));
}

/**
 * Process response into our standard format
 * @param response Fetch Response object
 * @param defaultMessage Default message to use for 204 responses
 * @returns Standardized response object
 */
async function processResponse(response: Response, defaultMessage: string): Promise<any> {
  // Handle 204 No Content responses
  if (response.status === 204) {
    return {
      status: 204,
      message: defaultMessage
    };
  }
  
  if (!response.ok) {
    throw new Error(`C++ server returned status: ${response.status}`);
  }
  
  // Decode the response
  const decodedText = await decodeResponse(response);
  
  // Try to parse as JSON
  try {
    return JSON.parse(decodedText);
  } catch (e) {
    // If it's not JSON, return the text
    return { status: response.status, message: decodedText };
  }
}

/**
 * Sends a keypress directly to the C++ server
 * @param key The key to send
 * @param retries Number of retries attempted
 * @returns Promise with the server response
 */
export const sendKeyPress = async (key: string, retries = 0): Promise<any> => {
  if (IS_PREVIEW_MODE && !retries) {
    console.log(`Preview mode detected. Note: C++ server communications will be simulated.`);
  }

  console.log(`Sending key ${key} directly to C++ game server${retries > 0 ? ` (retry ${retries}/${MAX_RETRIES})` : ''}`);
  
  try {
    const response = await safeFetch(`${SERVER_URL}/keypress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify({ key: key.toLowerCase() })
    });
    
    if (IS_PREVIEW_MODE && response.status === 0) {
      // In preview mode with no-cors, we can't read the response
      // so we'll simulate a successful response
      return {
        status: 200,
        message: `Simulated: Successfully sent key ${key} to C++ server (preview mode)`
      };
    }
    
    return await processResponse(response, `Successfully sent key ${key} to C++ server`);
  } catch (error) {
    console.error('Error sending keypress to C++ server:', error);
    
    // In preview mode, return a simulated success response for better UX
    if (IS_PREVIEW_MODE) {
      return {
        status: 200,
        message: `Simulated: Successfully sent key ${key} to C++ server (preview mode)`
      };
    }
    
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
    
    const response = await safeFetch(`${SERVER_URL}/close`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify(payload)
    });
    
    if (IS_PREVIEW_MODE && response.status === 0) {
      // In preview mode with no-cors, we can't read the response
      // so we'll simulate a successful response
      return {
        status: 200,
        message: `Simulated: Successfully closed ${gameName || 'all games'} (preview mode)`
      };
    }
    
    return await processResponse(response, `Successfully closed ${gameName || 'all games'} via C++ server`);
  } catch (error) {
    console.error('Error closing games via C++ server:', error);
    
    // In preview mode, return a simulated success response for better UX
    if (IS_PREVIEW_MODE) {
      return {
        status: 200,
        message: `Simulated: Successfully closed ${gameName || 'all games'} (preview mode)`
      };
    }
    
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
 * @param silent If true, suppresses console errors for expected connection failures
 * @returns Promise with boolean indicating if server is healthy
 */
export const checkServerHealth = async (retries = 0, silent = false): Promise<boolean> => {
  try {
    // Use a shorter timeout for health checks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await safeFetch(`${SERVER_URL}/health`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // In preview mode with no-cors, a status of 0 means we got an opaque response
    // which doesn't tell us much, but at least the request didn't fail
    if (IS_PREVIEW_MODE && response.status === 0) {
      if (!silent) {
        console.log("Preview mode detected, assuming C++ server is available for demo purposes");
      }
      return true;
    }
    
    // Reset the error flag when connection is successful
    if (hasLoggedConnectionError) {
      hasLoggedConnectionError = false;
      console.log("C++ server connection restored");
    }
    
    // C++ server might return 404 for health endpoint but still be working
    return response.ok || response.status === 204 || response.status === 404;
  } catch (error) {
    // Only log errors if we haven't already logged one recently and if not in silent mode
    if (!hasLoggedConnectionError && !silent) {
      console.error('C++ server health check failed:', error);
      hasLoggedConnectionError = true;
    }
    
    // In preview mode, we'll consider the server "healthy" for demo purposes
    if (IS_PREVIEW_MODE) {
      if (!silent && !hasLoggedConnectionError) {
        console.log("Preview mode detected, simulating C++ server availability for demo purposes");
      }
      return true;
    }
    
    // Implement retry logic for health checks
    if (retries < MAX_RETRIES && error.name !== 'AbortError') {
      if (!silent) console.log(`Retrying health check in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return checkServerHealth(retries + 1, silent);
    }
    
    return false;
  }
};

/**
 * Sends a direct command to launch a specific game by its code
 * @param gameCode The game code (e.g. 'f' for FruitNinja)
 * @returns Promise with the server response
 */
export const launchGameByCode = async (gameCode: string): Promise<any> => {
  console.log(`Launching game with code: ${gameCode}`);
  
  try {
    const response = await safeFetch(`${SERVER_URL}/keypress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify({ key: gameCode.toLowerCase() })
    });
    
    if (IS_PREVIEW_MODE && response.status === 0) {
      // In preview mode with no-cors, we can't read the response
      // so we'll simulate a successful response
      return {
        status: 200,
        message: `Simulated: Successfully launched game with code ${gameCode} (preview mode)`
      };
    }
    
    return await processResponse(response, `Successfully launched game with code ${gameCode}`);
  } catch (error) {
    console.error(`Error launching game with code ${gameCode}:`, error);
    
    // In preview mode, return a simulated success response for better UX
    if (IS_PREVIEW_MODE) {
      return {
        status: 200,
        message: `Simulated: Successfully launched game with code ${gameCode} (preview mode)`
      };
    }
    
    // If we exceed the maximum number of retries or it was an abort, throw the error
    throw error;
  }
};

/**
 * Helper mapping to translate game titles to their launch codes
 */
export const gameLaunchCodes: Record<string, string> = {
  "Fruit Ninja VR": "f",
  "Crisis Brigade 2 Reloaded": "c",
  "Subside": "s",
  "Richies Plank Experience": "p",
  "iB Cricket": "i",
  "Arizona Sunshine II": "a",
  "Undead Citadel": "u", 
  "Elven Assassin": "e",
  "RollerCoaster Legends": "r",
  "All-in-One Sports VR": "v",
  "Creed: Rise to Glory Championship Edition": "g",
  "Beat Saber": "w"
};


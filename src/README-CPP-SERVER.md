
# C++ Game Launcher Server Integration

This document explains how to set up and use the C++ game launcher server with the React front-end.

## Overview

The C++ server provides direct launching capabilities for VR games through a simple HTTP API. The React front-end communicates with this server to launch and close games.

## Setup Instructions

1. Compile the C++ server code provided (requires C++, Crow framework, and Windows SDK)
2. Run the compiled executable
3. The server will listen on `http://localhost:5001`
4. **IMPORTANT**: Make sure CORS is enabled in the server implementation (see CORS section below)

## API Endpoints

The C++ server provides the following endpoints:

### 1. `/keypress` (POST)

Launches a game based on the key sent.

**Request Format:**
```json
{
  "key": "f" 
}
```

Key mapping:
- `f`: Fruit Ninja VR
- `c`: Crisis Brigade 2
- `s`: Subside
- `p`: Richie's Plank Experience
- `i`: iB Cricket
- `a`: Arizona Sunshine
- `u`: Undead Citadel
- `e`: Elven Assassin
- `r`: RollerCoaster Legends
- `v`: All-in-One Sports VR
- `g`: Creed Rise to Glory
- `w`: Beat Saber

### 2. `/close` (POST)

Closes all running games.

**Request Format:**
```json
{}
```

Optionally, provide a game name:
```json
{
  "gameName": "Fruit Ninja VR"
}
```

### 3. `/health` (GET)

Health check endpoint to verify the server is running.

### 4. `/webhook/game-event` (POST)

Direct webhook to launch or close a specific game by name.

**Request Format:**
```json
{
  "event": "start",
  "game": "Fruit Ninja VR"
}
```

For stopping a game:
```json
{
  "event": "stop",
  "game": "Fruit Ninja VR"
}
```

Supported game names:
- "Fruit Ninja VR"
- "Crisis Brigade 2"
- "Subside"
- "Richie's Plank Experience"
- "iB Cricket"
- "Arizona Sunshine"
- "Undead Citadel"
- "Elven Assassin"
- "RollerCoaster Legends"
- "All-in-One Sports VR"
- "Creed Rise to Glory"
- "Beat Saber"

## CORS Configuration

### Why CORS Is Necessary

Cross-Origin Resource Sharing (CORS) headers are essential for the web application to communicate with the C++ server running locally. Without proper CORS configuration, browsers will block these requests for security reasons.

### Adding CORS Headers in C++

To enable CORS in your C++ server, add the following headers to your responses:

```cpp
// Add these headers to ALL responses from your server
response.set_header("Access-Control-Allow-Origin", "*");
response.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
response.set_header("Access-Control-Allow-Headers", "Content-Type, Accept-Charset");
```

### Handling OPTIONS Preflight Requests

Browsers send an OPTIONS request before making certain cross-origin requests. You must handle these specifically:

```cpp
CROW_ROUTE(app, "/keypress").methods("OPTIONS"_method)([](const crow::request&) {
    crow::response response;
    response.set_header("Access-Control-Allow-Origin", "*");
    response.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.set_header("Access-Control-Allow-Headers", "Content-Type, Accept-Charset");
    response.code = 204; // No content
    return response;
});

// Do the same for other endpoints
```

### Example for All Endpoints

```cpp
// For each endpoint in your C++ server, add an OPTIONS handler:
CROW_ROUTE(app, "/health").methods("OPTIONS"_method)([](const crow::request&) {
    crow::response response;
    response.set_header("Access-Control-Allow-Origin", "*");
    response.set_header("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.set_header("Access-Control-Allow-Headers", "Content-Type, Accept-Charset");
    response.code = 204; // No content
    return response;
});

CROW_ROUTE(app, "/close").methods("OPTIONS"_method)([](const crow::request&) {
    crow::response response;
    response.set_header("Access-Control-Allow-Origin", "*");
    response.set_header("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.set_header("Access-Control-Allow-Headers", "Content-Type, Accept-Charset");
    response.code = 204; // No content
    return response;
});
```

## Using in the React App

The React app is already configured to use this C++ server through the `GameService.ts` utility. All game launch pages will automatically attempt to connect to the C++ server and display its status.

If the C++ server is not available, the app will fall back to using Electron for game launching.

## Troubleshooting

### CORS Errors

If you see errors in the browser console like:

```
Access to fetch at 'http://localhost:5001/health' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present 
on the requested resource.
```

This means your C++ server is not correctly configured for CORS. Add the headers as described above.

### When Testing in Preview Mode

When using the Lovable preview environment (or any other non-localhost domain), the app will automatically switch to "Preview Mode" where it simulates C++ server interactions. This is normal behavior since the browser cannot connect to your local machine's services from a remote website.

For production use, the app should be running locally on the same machine as the C++ server.

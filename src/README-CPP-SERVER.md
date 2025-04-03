
# C++ Game Launcher Server Integration

This document explains how to set up and use the C++ game launcher server with the React front-end.

## Overview

The C++ server provides direct launching capabilities for VR games through a simple HTTP API. The React front-end communicates with this server to launch and close games.

## Setup Instructions

1. Compile the C++ server code provided (requires C++, Crow framework, and Windows SDK)
2. Run the compiled executable
3. The server will listen on `http://localhost:5001`
4. Make sure CORS is enabled in the server implementation

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

## Adding CORS Headers

To enable CORS in your C++ server, add the following headers to your responses:

```cpp
// Add these headers to all responses from your Crow server
response.set_header("Access-Control-Allow-Origin", "*");
response.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
response.set_header("Access-Control-Allow-Headers", "Content-Type, Accept-Charset");
```

For OPTIONS preflight requests, you need to handle them specifically:

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

## Using in the React App

The React app is already configured to use this C++ server through the `GameService.ts` utility. All game launch pages will automatically attempt to connect to the C++ server and display its status.

If the C++ server is not available, the app will fall back to using Electron for game launching.

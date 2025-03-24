
# Electron App Instructions

This document provides instructions for running and building the Electron application without modifying the package.json file.

## Running in Development Mode

To run the Electron app in development mode, use the following command:

```bash
node start-electron.js
```

This will:
1. Start the Vite development server
2. Wait for the server to be ready
3. Launch Electron pointing to the development server

## Building for Production

To build the Electron app for production distribution, use:

```bash
# First, build the React app
npm run build

# Then build the Electron app
node build-electron.js
```

The build process will:
1. Compile TypeScript files in the electron directory
2. Build the Electron app using electron-builder
3. Create distributables in the `release` directory

## Configurations

The Electron app is configured using the `electron-builder.json` file in the project root. This file contains settings for:
- Application ID and name
- Output directory
- Build targets (Windows, macOS, Linux)
- Installer options

## Using Python Services

The app relies on two Python services:
1. `app.py` - Handles key presses and other commands
2. `game_launcher.py` - Manages game launching functionality

Make sure these services are running before starting the Electron app.

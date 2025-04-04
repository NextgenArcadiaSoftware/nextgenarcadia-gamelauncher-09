
# VR Cricket Server

This is a C++ server application that serves as a bridge between the web interface and the VR Cricket game.

## Building

### Windows
1. Install CMake (3.10 or higher)
2. Open a command prompt in this directory
3. Run:
```
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

### Linux/macOS
1. Install CMake (3.10 or higher)
2. Open a terminal in this directory
3. Run:
```
mkdir build
cd build
cmake ..
make
```

## Running
Run the executable from the build directory:
- Windows: `build\Release\vr_cricket_server.exe`
- Linux/macOS: `build/vr_cricket_server`

The server will start on port 5001.

## Endpoints
- GET `/health` - Check server health
- POST `/launch` - Launch VR Cricket
- POST `/close` - Stop VR Cricket

## Integration with Web UI
This server is designed to work with the `/cpp-launcher` route in the web application.

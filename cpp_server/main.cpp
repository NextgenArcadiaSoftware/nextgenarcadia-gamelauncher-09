
#include <iostream>
#include <string>
#include <cstdlib>
#include <memory>
#include <utility>
#include <thread>
#include <chrono>

#ifdef _WIN32
#include <windows.h>
#define CRICKET_APP_PATH "C:\\Program Files (x86)\\Steam\\steamapps\\common\\iB Cricket\\iB Cricket.exe"
#else
#define CRICKET_APP_PATH "/usr/local/games/cricket/cricket.exe"  // Example path for non-Windows
#endif

#include "httplib.h"

// Process handle for the launched game
PROCESS_INFORMATION processInfo = {0};

bool launchCricketGame() {
    std::cout << "Launching VR Cricket game..." << std::endl;
    
#ifdef _WIN32
    STARTUPINFO startupInfo = {0};
    startupInfo.cb = sizeof(startupInfo);
    
    // Create the process
    if (!CreateProcess(
        CRICKET_APP_PATH,           // Application path
        NULL,                       // Command line arguments
        NULL,                       // Process security attributes
        NULL,                       // Thread security attributes
        FALSE,                      // Handle inheritance
        0,                          // Creation flags
        NULL,                       // Environment
        NULL,                       // Current directory
        &startupInfo,               // Startup info
        &processInfo                // Process information
    )) {
        std::cerr << "Failed to launch Cricket game. Error code: " << GetLastError() << std::endl;
        return false;
    }
    
    std::cout << "VR Cricket game launched successfully!" << std::endl;
    return true;
#else
    // For non-Windows platforms (simplified)
    std::string command = std::string("\"") + CRICKET_APP_PATH + "\"";
    int result = system(command.c_str());
    return (result == 0);
#endif
}

bool stopCricketGame() {
    std::cout << "Stopping VR Cricket game..." << std::endl;
    
#ifdef _WIN32
    if (processInfo.hProcess) {
        // Terminate the process
        if (TerminateProcess(processInfo.hProcess, 0)) {
            CloseHandle(processInfo.hProcess);
            CloseHandle(processInfo.hThread);
            processInfo = {0};
            std::cout << "VR Cricket game stopped successfully!" << std::endl;
            return true;
        } else {
            std::cerr << "Failed to terminate Cricket game. Error code: " << GetLastError() << std::endl;
            return false;
        }
    }
    return true; // No process to stop
#else
    // For non-Windows platforms (simplified)
    system("pkill -f cricket");
    return true;
#endif
}

int main() {
    std::cout << "=== VR Cricket Server ===" << std::endl;
    std::cout << "Starting server on port 5001..." << std::endl;
    
    httplib::Server server;
    
    // Configure CORS for all routes
    server.set_base_dir("./");
    server.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type, Accept-Charset"}
    });
    
    // Handle OPTIONS requests for CORS preflight
    server.Options("/(.*)", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Accept-Charset");
        res.status = 204; // No content needed for OPTIONS
    });
    
    // Health check endpoint
    server.Get("/health", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Content-Type", "application/json; charset=utf-8");
        res.set_content("{\"status\":\"healthy\",\"message\":\"VR Cricket server is running\"}", "application/json");
    });
    
    // Launch game endpoint
    server.Post("/launch", [](const httplib::Request& req, httplib::Response& res) {
        bool result = launchCricketGame();
        res.set_header("Content-Type", "application/json; charset=utf-8");
        
        if (result) {
            res.set_content("{\"status\":\"success\",\"message\":\"VR Cricket launched successfully\"}", "application/json");
        } else {
            res.set_content("{\"status\":\"error\",\"message\":\"Failed to launch VR Cricket\"}", "application/json");
            res.status = 500;
        }
    });
    
    // Close game endpoint
    server.Post("/close", [](const httplib::Request& req, httplib::Response& res) {
        bool result = stopCricketGame();
        res.set_header("Content-Type", "application/json; charset=utf-8");
        
        if (result) {
            res.set_content("{\"status\":\"success\",\"message\":\"VR Cricket stopped successfully\"}", "application/json");
        } else {
            res.set_content("{\"status\":\"error\",\"message\":\"Failed to stop VR Cricket\"}", "application/json");
            res.status = 500;
        }
    });
    
    // Start server
    std::cout << "Server running at http://localhost:5001" << std::endl;
    std::cout << "Endpoints:" << std::endl;
    std::cout << "  - GET /health - Check server health" << std::endl;
    std::cout << "  - POST /launch - Launch VR Cricket" << std::endl;
    std::cout << "  - POST /close - Stop VR Cricket" << std::endl;
    
    server.listen("0.0.0.0", 5001);
    
    return 0;
}

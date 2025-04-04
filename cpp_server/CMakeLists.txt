
cmake_minimum_required(VERSION 3.10)
project(vr_cricket_server)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add executable
add_executable(vr_cricket_server main.cpp)

# Windows-specific configuration
if(WIN32)
    target_link_libraries(vr_cricket_server ws2_32)
endif()

# Install target
install(TARGETS vr_cricket_server DESTINATION bin)

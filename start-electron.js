
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if we're in development mode or production mode
const isDev = process.env.NODE_ENV !== 'production';

console.log('Starting Electron app...');
console.log(`Mode: ${isDev ? 'Development' : 'Production'}`);

// If in development mode, we need to compile TypeScript files first
if (isDev) {
  console.log('Compiling TypeScript files for development...');
  exec('npx tsc -p electron/tsconfig.json', (error, stdout, stderr) => {
    if (error) {
      console.error('TypeScript compilation failed:', error);
      console.error(stderr);
      return;
    }
    
    console.log('TypeScript compilation successful');
    
    // Define the commands
    const commands = {
      dev: 'npx concurrently "npm run dev" "npx wait-on http://localhost:8080 && npx electron electron/main.js"',
      prod: 'npx electron .'
    };
    
    // Run the appropriate command
    const command = isDev ? commands.dev : commands.prod;
    console.log(`Executing: ${command}`);
    
    const child = exec(command);
    
    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    child.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    child.on('exit', (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  });
} else {
  // In production mode, just run Electron directly
  const command = 'npx electron .';
  console.log(`Executing: ${command}`);
  
  const child = exec(command);
  
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  child.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  child.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
}

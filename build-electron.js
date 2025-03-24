
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building Electron app...');

// Define the build command using electron-builder with the config file
const buildCommand = 'npx electron-builder --config electron-builder.json';

console.log(`Executing: ${buildCommand}`);

const child = exec(buildCommand);

child.stdout.on('data', (data) => {
  console.log(data.toString());
});

child.stderr.on('data', (data) => {
  console.error(data.toString());
});

child.on('exit', (code) => {
  console.log(`Build process exited with code ${code}`);
  if (code === 0) {
    console.log('Build completed successfully. The packaged application can be found in the "release" directory.');
  } else {
    console.error('Build failed. Please check the logs above for errors.');
  }
});

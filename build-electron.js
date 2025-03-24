
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building Electron app...');

// First, compile TypeScript files
console.log('Compiling TypeScript files...');
exec('npx tsc -p electron/tsconfig.json', (error, stdout, stderr) => {
  if (error) {
    console.error('TypeScript compilation failed:', error);
    console.error(stderr);
    return;
  }
  
  console.log('TypeScript compilation successful');
  console.log(stdout);
  
  // Verify that main.js exists
  const mainJsPath = path.join(process.cwd(), 'electron', 'main.js');
  if (!fs.existsSync(mainJsPath)) {
    console.error(`Error: ${mainJsPath} does not exist after TypeScript compilation`);
    console.error('Checking what files were generated:');
    const electronDir = path.join(process.cwd(), 'electron');
    if (fs.existsSync(electronDir)) {
      console.log('Files in electron directory:', fs.readdirSync(electronDir));
    } else {
      console.error('Electron directory does not exist!');
    }
    return;
  }
  
  console.log(`Verified: ${mainJsPath} exists`);
  
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
});

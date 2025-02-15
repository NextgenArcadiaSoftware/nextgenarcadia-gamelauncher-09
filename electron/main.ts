
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
    kiosk: true,
    fullscreen: true,
    autoHideMenuBar: true,
    frame: false,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('close', (e) => {
    e.preventDefault();
  });

  initRFIDReader();
}

function initRFIDReader() {
  const port = new SerialPort({
    path: 'COM3',
    baudRate: 9600,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  port.on('error', (err) => {
    console.error('Serial Port Error:', err);
  });

  parser.on('data', (data: string) => {
    if (data.trim()) {
      mainWindow.webContents.send('rfid-detected', data.trim());
    }
  });
}

app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('disable-frame-rate-limit');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle game launch requests
ipcMain.on('launch-game', (event, executablePath) => {
  console.log('Launching game:', executablePath);
  exec(executablePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error launching game: ${error}`);
      event.reply('launch-game-error', error.message);
      return;
    }
    event.reply('launch-game-success');
  });
});

// Add IPC handler for key press simulation
ipcMain.on('simulate-keypress', (event, key) => {
  console.log('Received key press in main process:', key);
  
  // Create a Python command to simulate the key press using the keyboard module
  const pythonScript = `
import keyboard
import time

# Press and hold the key
keyboard.press('${key}')
time.sleep(0.1)  # Hold for a short duration
keyboard.release('${key}')
  `;
  
  // Execute the Python script
  exec(`python -c "${pythonScript}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error simulating key press:', error);
      return;
    }
    console.log('Key press simulated successfully:', key);
  });
});

// Add IPC handler for exiting kiosk mode
ipcMain.on('exit-kiosk', () => {
  app.quit();
});

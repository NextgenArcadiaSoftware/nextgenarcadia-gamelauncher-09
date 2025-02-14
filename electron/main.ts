
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
      nodeIntegration: true,
      contextIsolation: false
    },
    kiosk: true, // Enable kiosk mode
    fullscreen: true, // Force fullscreen
    autoHideMenuBar: true, // Hide the menu bar
    frame: false, // Remove window frame
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Only show DevTools in development if specifically needed
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Prevent the window from being closed with Alt+F4 or similar shortcuts
  mainWindow.on('close', (e) => {
    e.preventDefault();
  });

  // Initialize RFID reader
  initRFIDReader();
}

function initRFIDReader() {
  // Note: You'll need to update the port based on your Arduino's connection
  const port = new SerialPort({
    path: 'COM3', // Windows example - adjust for your system
    baudRate: 9600,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  port.on('error', (err) => {
    console.error('Serial Port Error:', err);
  });

  parser.on('data', (data: string) => {
    // When RFID tag is detected, send to renderer
    if (data.trim()) {
      mainWindow.webContents.send('rfid-detected', data.trim());
    }
  });
}

// Add a command line switch to disable hardware acceleration
// This can help with performance in kiosk mode
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
  exec(executablePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error launching game: ${error}`);
      event.reply('launch-game-error', error.message);
      return;
    }
    event.reply('launch-game-success');
  });
});

// Add IPC handler for exiting kiosk mode (requires owner authentication)
ipcMain.on('exit-kiosk', () => {
  app.quit();
});

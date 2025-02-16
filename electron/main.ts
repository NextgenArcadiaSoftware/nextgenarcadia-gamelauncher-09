
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import fetch from 'node-fetch';

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

// Direct key press handler
ipcMain.on('simulate-keypress', async (event, key) => {
  console.log('Received key press in main process:', key);

  try {
    const response = await fetch('http://localhost:5001/keypress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Key press successful:', data);
  } catch (error) {
    console.error('Error sending key press:', error);
  }
});

// Add IPC handler for exiting kiosk mode
ipcMain.on('exit-kiosk', () => {
  app.quit();
});

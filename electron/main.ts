
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

async function sendKeyPressToServer(key: string) {
  try {
    console.log('Sending key press to Python server:', key);
    const response = await fetch('http://localhost:5001/keypress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Error sending key press to server:', error);
    throw error;
  }
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

// Add IPC handler for key press simulation
ipcMain.on('simulate-keypress', async (event, key) => {
  console.log('Received key press in main process:', key);

  try {
    const result = await sendKeyPressToServer(key);
    console.log('Key press simulation result:', result);
  } catch (error) {
    console.error('Failed to simulate key press:', error);
    
    // Fallback to direct Python script execution if HTTP request fails
    const pythonScript = `
import keyboard
keyboard.press_and_release('${key}')
    `;
    
    exec(`python -c "${pythonScript}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error in fallback key simulation:', error);
        return;
      }
      console.log('Fallback key simulation successful');
    });
  }
});

// Add IPC handler for exiting kiosk mode
ipcMain.on('exit-kiosk', () => {
  app.quit();
});

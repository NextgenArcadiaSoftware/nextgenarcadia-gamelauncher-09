import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import fetch from 'node-fetch';
import http from 'http';

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
  initExternalButtonListener();
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

function initExternalButtonListener() {
  const server = http.createServer((req, res) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        if (body.includes('STOP_GAME')) {
          console.log('STOP_GAME command received from Flask server');
          
          if (mainWindow) {
            mainWindow.webContents.send('external-button-pressed');
            console.log('Sent external-button-pressed event to window');
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success', message: 'STOP_GAME command received' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Invalid command' }));
        }
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Server error' }));
      }
    });
  });
  
  server.listen(5005, () => {
    console.log('External button listener server running on port 5005');
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
    console.log('Key press simulation response:', data);
  } catch (error) {
    console.error('Error sending key press to Python server:', error);
    
    const pythonScript = `
    import keyboard
    import time

    keyboard.press('${key}')
    time.sleep(0.1)
    keyboard.release('${key}')
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

ipcMain.on('exit-kiosk', () => {
  app.quit();
});

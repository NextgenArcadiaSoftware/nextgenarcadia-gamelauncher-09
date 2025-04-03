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
  initStopEndpoint();
  initWebhookEndpoint();
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

function initStopEndpoint() {
  const stopServer = http.createServer((req, res) => {
    if (req.url === '/stop' && req.method === 'POST') {
      console.log('Stop endpoint hit in Electron process');
      
      if (mainWindow) {
        mainWindow.webContents.send('external-button-pressed');
        console.log('Sent external-button-pressed event to renderer process');
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', message: 'Stop command received' }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  
  stopServer.listen(5006, () => {
    console.log('Stop endpoint server running on port 5006');
  });
}

function initWebhookEndpoint() {
  const webhookServer = http.createServer((req, res) => {
    if (req.url === '/webhook/stop-timer' && (req.method === 'POST' || req.method === 'GET')) {
      console.log('Webhook endpoint hit: stop-timer');
      
      let body = '';
      
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          console.log('Webhook payload:', payload);
          
          if (mainWindow) {
            mainWindow.webContents.send('webhook-stop-timer', payload);
            console.log('Sent webhook-stop-timer event to renderer process');
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            status: 'success', 
            message: 'Stop timer command received',
            timestamp: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Error processing webhook request:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            status: 'error', 
            message: 'Server error processing webhook'
          }));
        }
      });
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
    }
  });
  
  webhookServer.listen(5007, () => {
    console.log('Webhook server running on port 5007');
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
    const serverUrl = 'http://localhost:5001'; // Updated to port 5001
    
    // Send with the KEY_X_PRESSED format
    const response = await fetch(`${serverUrl}/keypress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        key, 
        command: `KEY_${key.toUpperCase()}_PRESSED` 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Key press simulation response:', data);
  } catch (error) {
    console.error('Error sending key press to C++ server:', error);
    
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

ipcMain.on('launch-steam-game', (event, steamUrl) => {
  console.log(`Launching game with Steam URL: ${steamUrl}`);
  
  try {
    // For Windows
    if (process.platform === 'win32') {
      exec(`start ${steamUrl}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error launching Steam game: ${error}`);
          return;
        }
        console.log('Steam game launched successfully');
      });
    } 
    // For macOS
    else if (process.platform === 'darwin') {
      exec(`open "${steamUrl}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error launching Steam game: ${error}`);
          return;
        }
        console.log('Steam game launched successfully');
      });
    } 
    // For Linux
    else if (process.platform === 'linux') {
      exec(`xdg-open "${steamUrl}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error launching Steam game: ${error}`);
          return;
        }
        console.log('Steam game launched successfully');
      });
    }
  } catch (error) {
    console.error('Error launching Steam game:', error);
  }
});

ipcMain.on('end-game', async (event) => {
  console.log('Received end-game command in main process');

  try {
    // Send request to the Python backend's end-game endpoint
    const response = await fetch('http://localhost:5001/end-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('End game command response:', data);
    
    // Also forward the stop timer event to the renderer
    if (mainWindow) {
      mainWindow.webContents.send('webhook-stop-timer', { source: 'end-game-button' });
    }
  } catch (error) {
    console.error('Error sending end-game command:', error);
    
    // Fallback: send stop command directly
    if (mainWindow) {
      mainWindow.webContents.send('webhook-stop-timer', { source: 'end-game-button-fallback' });
    }
  }
});

ipcMain.on('exit-kiosk', () => {
  app.quit();
});

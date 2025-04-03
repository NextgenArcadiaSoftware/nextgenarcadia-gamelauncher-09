import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';
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

  initExternalButtonListener();
  initStopEndpoint();
  initWebhookEndpoint();
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
    const serverUrl = 'http://localhost:5001';
    const endpoint = key.toLowerCase() === 'x' ? 'close' : 'keypress';
    
    // Simplified payload for C++ server
    const payload = key.toLowerCase() === 'x' ? 
      {} : 
      { key: key.toLowerCase() };
    
    console.log(`Sending to C++ server: ${endpoint}`, payload);
    
    const response = await fetch(`${serverUrl}/${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    });

    console.log('C++ server status:', response.status);
    
    // Special handling for 204 No Content responses
    if (response.status === 204) {
      const successMessage = key.toLowerCase() === 'x' ? 
        "Game close command successful" : 
        `Key ${key} sent successfully`;
      
      console.log(successMessage);
      
      // Forward the response to renderer
      if (mainWindow) {
        mainWindow.webContents.send('cpp-server-response', {
          key,
          status: response.status,
          response: successMessage
        });
      }
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text().then(text => 
      new TextDecoder('utf-8').decode(new TextEncoder().encode(text))
    );
    
    console.log('C++ server response:', text);
    
    // Forward the response to renderer
    if (mainWindow) {
      mainWindow.webContents.send('cpp-server-response', {
        key,
        status: response.status,
        response: text
      });
    }
  } catch (error) {
    console.error('Error sending key press to C++ server:', error);
    
    // Send a generic error event to renderer
    if (mainWindow) {
      mainWindow.webContents.send('cpp-server-error', {
        key,
        error: error.message
      });
    }
  }
});

ipcMain.on('launch-steam-game', (event, steamUrl) => {
  console.log(`Launching game with Steam URL: ${steamUrl}`);
  
  try {
    if (process.platform === 'win32') {
      exec(`start ${steamUrl}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error launching Steam game: ${error}`);
          return;
        }
        console.log('Steam game launched successfully');
      });
    } 
    else if (process.platform === 'darwin') {
      exec(`open "${steamUrl}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error launching Steam game: ${error}`);
          return;
        }
        console.log('Steam game launched successfully');
      });
    } 
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
    const response = await fetch('http://localhost:5001/close', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Charset': 'UTF-8'
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(5000)
    });

    console.log('End game command status:', response.status);
    
    // Handle 204 No Content responses
    let responseText = "Game close command successful";
    
    if (response.status !== 204) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      responseText = await response.text().then(text => 
        new TextDecoder('utf-8').decode(new TextEncoder().encode(text))
      );
    }
    
    console.log('End game command response:', responseText);
    
    if (mainWindow) {
      mainWindow.webContents.send('webhook-stop-timer', { 
        source: 'end-game-button',
        status: response.status,
        response: responseText 
      });
    }
  } catch (error) {
    console.error('Error sending end-game command:', error);
    
    if (mainWindow) {
      mainWindow.webContents.send('webhook-stop-timer', { 
        source: 'end-game-button-fallback',
        error: error.message
      });
    }
  }
});

ipcMain.on('exit-kiosk', () => {
  app.quit();
});

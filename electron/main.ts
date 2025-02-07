import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';

let mainWindow: BrowserWindow;
const AUTHORIZED_RFID = "0012176139"; // The authorized RFID number

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  try {
    initRFIDReader();
  } catch (err) {
    console.log('RFID reader initialization skipped - not available on this system');
  }
}

async function initRFIDReader() {
  try {
    const { SerialPort } = await import('serialport');
    const { ReadlineParser } = await import('@serialport/parser-readline');

    const port = new SerialPort({
      path: '/dev/tty.usbmodem1101',
      baudRate: 115200,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('error', (err) => {
      console.error('Serial Port Error:', err);
    });

    parser.on('data', (data: string) => {
      if (data.includes('UID Value:')) {
        const uid = data.split(':')[1]?.trim();
        if (uid) {
          const isAuthorized = uid === AUTHORIZED_RFID;
          mainWindow.webContents.send('rfid-detected', { uid, isAuthorized });
        }
      }
    });

    console.log('RFID reader initialized successfully');
  } catch (err) {
    console.log('RFID reader initialization failed:', err);
  }
}

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
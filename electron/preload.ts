
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => {
      // Whitelist of allowed channels
      const validChannels = [
        'simulate-keypress', 
        'exit-kiosk',
        'launch-steam-game',
        'end-game'
      ];
      
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      // Whitelist of allowed channels for receiving
      const validChannels = [
        'rfid-detected', 
        'external-button-pressed',
        'webhook-stop-timer'
      ];
      
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    removeAllListeners: (channel: string) => {
      // Whitelist of allowed channels for removing
      const validChannels = [
        'rfid-detected', 
        'external-button-pressed',
        'webhook-stop-timer'
      ];
      
      if (validChannels.includes(channel)) {
        ipcRenderer.removeAllListeners(channel);
      }
    }
  }
});

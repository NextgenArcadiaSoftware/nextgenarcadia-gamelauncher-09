
import { useState, useEffect } from 'react';

interface Settings {
  screensaverTimeout: number; // in seconds
  audioEnabled: boolean;
  darkMode: boolean;
  language: string;
}

const defaultSettings: Settings = {
  screensaverTimeout: 60, // 1 minute
  audioEnabled: true,
  darkMode: true,
  language: 'en'
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage when component mounts
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('arcadia-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      localStorage.setItem('arcadia-settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return { settings, updateSettings };
}

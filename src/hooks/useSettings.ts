import { useState, useEffect } from 'react';
import type { Settings, Theme } from '../types';
import { INITIAL_SETTINGS } from '../constants';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['zinc', 'dark'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setSettings(prev => ({ ...prev, theme: themes[nextIndex] }));
  };

  return { settings, setSettings, updateSettings, cycleTheme };
}

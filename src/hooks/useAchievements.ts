import { useState } from 'react';
import type { Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../constants';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const addCustomAchievement = (title: string, requirement: string, icon: string) => {
    const newAchievement: Achievement = {
      id: 'custom-' + Date.now(),
      title,
      description: title,
      requirement,
      icon,
      unlocked: false,
      isCustom: true,
      category: 'custom'
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  const toggleAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id) {
        const isUnlocking = !a.unlocked;
        return { ...a, unlocked: isUnlocking, unlockedAt: isUnlocking ? new Date().toISOString() : undefined };
      }
      return a;
    }));
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  return { achievements, setAchievements, addCustomAchievement, deleteAchievement, toggleAchievement, updateAchievement };
}

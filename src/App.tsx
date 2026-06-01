import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { TaskDifficulty, TaskPriority, Achievement, Stats, HistoryEntry, TaskGroup, BingoTile, Settings, ShopItem, User, GachaState, ShopHistoryEntry } from './types';
import { INITIAL_TASK_GROUPS, INITIAL_BINGO_TILES, INITIAL_ACHIEVEMENTS, INITIAL_STATS, INITIAL_SETTINGS, INITIAL_SHOP_ITEMS, DEFAULT_AVATAR } from './constants';
import type { Task } from './types';
import { getDrawsPerLevel } from './gachaUtils';
import { toDB, fromDB } from './lib/utils';
import { calculateXP } from './lib/gameLogic';
import { Modal, ConfirmDialog } from './components/Modal';
import { ToastProvider, useToast } from './components/Toast';
import { Layout } from './components/Layout';
import { LoginView } from './components/LoginView';
import { TodayView } from './components/TodayView';
import { TasksView } from './components/TasksView';
import { CalendarView } from './components/CalendarView';
import { AchievementsView } from './components/AchievementsView';
import { GachaView } from './components/GachaView';
import { ShopView } from './components/ShopView';
import { PomodoroView } from './components/PomodoroView';
import { SettingsView } from './components/SettingsView';
import { EditTaskEntryModal } from './components/EditTaskEntryModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ShopHistoryModal } from './components/ShopHistoryModal';
import { PurchaseSuccessModal } from './components/PurchaseSuccessModal';
import { GachaResultModal } from './components/GachaResultModal';
import { GachaHelpModal } from './components/GachaHelpModal';
import type { Theme } from './types';
import type { TimeRange } from './components/TimeRangeModal';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { useAchievements } from './hooks/useAchievements';
import { useTasks } from './hooks/useTasks';
import { useShop } from './hooks/useShop';
import { useGacha } from './hooks/useGacha';
import { useBingo } from './hooks/useBingo';
import { useHistory } from './hooks/useHistory';

export { calculateXP };

// --- Main App ---

function AppContent() {
  const { toast } = useToast();

  // UI state
  const [activeTab, setActiveTab] = useState('today');
  const [activeSubTab, setActiveSubTab] = useState('achievements');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'quarter' | 'year' | 'all'>('today');
  const [isTimeRangeModalOpen, setIsTimeRangeModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Stats (transitional — used by multiple hooks)
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);

  // Domain hooks
  const auth = useAuth();
  const settings = useSettings();
  const achievements = useAchievements();
  const tasks = useTasks();

  // Cross-domain hooks
  const shop = useShop({ user: auth.user, setUser: auth.setUser, setStats });
  const bingo = useBingo({ taskGroups: tasks.taskGroups, setActiveTab });
  const historyHook = useHistory({ user: auth.user, setBingoTiles: bingo.setBingoTiles });

  // Sound and haptic
  const playSound = (type: 'complete' | 'bingo' | 'levelUp') => {
    try {
      const sounds: Record<string, string> = {
        complete: '/sounds/complete.mp3',
        bingo: '/sounds/bingo.mp3',
        levelUp: '/sounds/levelup.mp3',
      };
      const audio = new Audio(sounds[type]);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}
  };

  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      const durations = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate?.(durations[intensity]);
    } catch {}
  };

  const checkBingo = (grid: BingoTile[][], r: number, c: number) => {
    const size = grid.length;
    let rowComplete = true, colComplete = true;
    let diag1Complete = r === c, diag2Complete = r + c === size - 1;

    for (let i = 0; i < size; i++) {
      if (!grid[r][i].completed) rowComplete = false;
      if (!grid[i][c].completed) colComplete = false;
      if (diag1Complete && !grid[i][i].completed) diag1Complete = false;
      if (diag2Complete && !grid[i][size - 1 - i].completed) diag2Complete = false;
    }

    return rowComplete || colComplete || diag1Complete || diag2Complete;
  };

  // Gacha hook (depends on addXPWithLevelUp and playSound/triggerHaptic)
  const gacha = useGacha({
    user: auth.user,
    setUser: auth.setUser,
    setStats,
    onAddXPWithLevelUp: addXPWithLevelUp,
    playSound,
    triggerHaptic,
  });

  // Cross-domain: XP with level up (used by toggleTile, deleteHistoryEntry, gacha draw)
  function addXPWithLevelUp(xpAmount: number, additionalStatsUpdate?: (prev: Stats) => Partial<Stats>) {
    if (!auth.user) return;

    let newXp = auth.user.xp + xpAmount;
    let newLevel = auth.user.level;
    let newNextLevelXp = auth.user.nextLevelXp;
    let newBalance = auth.user.balance + xpAmount;
    const oldLevel = auth.user.level;
    let newTitle = auth.user.title;

    while (newXp >= newNextLevelXp) {
      newXp -= newNextLevelXp;
      newLevel += 1;
      newNextLevelXp = 200;
      if (newLevel % 10 === 0) {
        if (newLevel === 10) newTitle = '资深玩家';
        else if (newLevel === 20) newTitle = '大师级';
        else if (newLevel === 30) newTitle = '传说级';
        else if (newLevel === 40) newTitle = '神话级';
        else if (newLevel === 50) newTitle = '不朽级';
        else if (newLevel > 50) newTitle = '超越不朽';
      }
      playSound('levelUp');
      triggerHaptic('heavy');
    }

    if (newLevel > oldLevel) {
      let additionalDraws = 0;
      for (let level = oldLevel + 1; level <= newLevel; level++) {
        additionalDraws += getDrawsPerLevel(level);
      }
      gacha.setGachaState(prev => ({
        ...prev,
        availableDraws: prev.availableDraws + additionalDraws,
        lastDrawLevel: newLevel
      }));
    }

    auth.setUser({ ...auth.user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance, title: newTitle });

    setStats(prev => ({
      ...prev,
      totalXp: prev.totalXp + xpAmount,
      ...(additionalStatsUpdate ? additionalStatsUpdate(prev) : {})
    }));
  }

  // Cross-domain: toggle tile (touches bingo, history, user, stats, gacha)
  const toggleTile = (r: number, c: number) => {
    const tile = bingo.bingoTiles[r][c];
    if (!tile) return;

    if (tile.completed) {
      // Uncheck tile
      const entryToRemove = historyHook.history.find(
        h => h.taskName === tile.taskName && h.completedAt && new Date(h.completedAt).toDateString() === new Date().toDateString()
      );

      if (entryToRemove) {
        historyHook.setHistory(prev => prev.filter(h => h.id !== entryToRemove.id));
        supabase.from('history').delete().eq('id', entryToRemove.id)
          .then(() => {}).then(null, (error: unknown) => console.error('Error deleting history entry:', error));
      }

      let xpToDeduct = tile.xpValue || 10;
      if (tile.isGolden) xpToDeduct *= 2;

      if (auth.user) {
        let newXp = auth.user.xp - xpToDeduct;
        let newLevel = auth.user.level;
        let newNextLevelXp = auth.user.nextLevelXp;
        let newBalance = Math.max(0, auth.user.balance - xpToDeduct);
        let newTitle = auth.user.title;

        if (newXp < 0) {
          if (newLevel > 1) {
            newLevel -= 1;
            if (newLevel <= 5) {
              const levelThresholds = [0, 50, 70, 90, 110, 130];
              newNextLevelXp = levelThresholds[newLevel];
            } else if (newLevel <= 24) {
              newNextLevelXp = Math.max(130, Math.floor(newNextLevelXp / 1.15));
            } else {
              newNextLevelXp = 2000;
            }
            if (newLevel < 10 && newTitle === '资深玩家') newTitle = undefined;
            else if (newLevel < 20 && newTitle === '大师级') newTitle = '资深玩家';
            else if (newLevel < 30 && newTitle === '传说级') newTitle = '大师级';
            else if (newLevel < 40 && newTitle === '神话级') newTitle = '传说级';
            else if (newLevel < 50 && newTitle === '不朽级') newTitle = '神话级';
            else if (newLevel < 51 && newTitle === '超越不朽') newTitle = '不朽级';
            newXp = newNextLevelXp + newXp;
          } else {
            newXp = 0;
          }
        }

        let gachaUpdate: Partial<GachaState> = {};
        if (newLevel < auth.user.level) {
          let drawsToRemove = 0;
          for (let level = newLevel + 1; level <= auth.user.level; level++) {
            drawsToRemove += getDrawsPerLevel(level);
          }
          gachaUpdate = {
            availableDraws: Math.max(0, gacha.gachaState.availableDraws - drawsToRemove),
            lastDrawLevel: Math.min(gacha.gachaState.lastDrawLevel, newLevel),
          };
          gacha.setGachaState(prev => ({ ...prev, ...gachaUpdate }));
        }

        const updatedUser = { ...auth.user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance, title: newTitle };
        auth.setUser(updatedUser);
        setStats(prev => ({ ...prev, totalXp: Math.max(0, prev.totalXp - xpToDeduct),
          bingosCount: Math.max(0, prev.bingosCount - 1),
        }));
      }

      bingo.setBingoTiles(prev => prev.map((row, ri) =>
        row.map((t, ci) => ri === r && ci === c ? { ...t, completed: false, completedAt: undefined } : t)
      ));
    } else {
      // Complete tile
      const completedAt = new Date().toISOString();
      const xp = (tile.xpValue || 10) * (tile.isGolden ? 2 : 1);

      const newEntry: HistoryEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        taskName: tile.taskName,
        completedAt,
        type: 'task',
        xpEarned: xp,
      };

      bingo.setBingoTiles(prev => prev.map((row, ri) =>
        row.map((t, ci) => ri === r && ci === c ? { ...t, completed: true, completedAt } : t)
      ));

      historyHook.setHistory(prev => [newEntry, ...prev]);
      addXPWithLevelUp(xp);

      if (checkBingo(bingo.bingoTiles, r, c)) {
        setStats(prev => ({ ...prev, bingosCount: prev.bingosCount + 1 }));
        playSound('bingo');
        triggerHaptic('heavy');
      }

      const allCompleted = bingo.bingoTiles.flat().every(t => t.completed || t === tile);
      if (allCompleted) {
        setStats(prev => ({ ...prev, fullHousesCount: prev.fullHousesCount + 1 }));
      }

      if (tile.isGolden) {
        setStats(prev => ({ ...prev, goldenTilesCompleted: prev.goldenTilesCompleted + 1 }));
      }

      const hour = new Date().getHours();
      if (hour < 7) setStats(prev => ({ ...prev, earlyBirdCount: prev.earlyBirdCount + 1 }));
      if (hour >= 23) setStats(prev => ({ ...prev, nightOwlCount: prev.nightOwlCount + 1 }));

      supabase.from('history').insert(toDB({ ...newEntry, user_id: auth.user?.id }))
        .then(() => {}).then(null, (error: unknown) => console.error('Error saving history entry:', error));

      playSound('complete');
      triggerHaptic('light');
    }
  };

  // Cross-domain: delete history entry
  const deleteHistoryEntry = (id: string) => {
    const entryToDelete = historyHook.history.find(h => h.id === id);
    if (!entryToDelete) return;

    historyHook.setHistory(prev => prev.filter(h => h.id !== id));

    if (auth.user) {
      supabase.from('history').delete().eq('id', id)
        .then(() => {}).then(null, (error: unknown) => console.error('Error deleting history entry:', error));
    }

    let xpToDeduct = 10;
    bingo.bingoTiles.forEach(row => row.forEach(tile => {
      if (tile.taskName === entryToDelete.taskName) {
        xpToDeduct = tile.xpValue || 10;
        if (tile.isGolden) xpToDeduct *= 2;
      }
    }));

    if (auth.user) {
      let newXp = auth.user.xp - xpToDeduct;
      let newLevel = auth.user.level;
      let newNextLevelXp = auth.user.nextLevelXp;
      let newBalance = Math.max(0, auth.user.balance - xpToDeduct);
      let newTitle = auth.user.title;

      if (newXp < 0) {
        if (newLevel > 1) {
          newLevel -= 1;
          if (newLevel <= 5) {
            const levelThresholds = [0, 50, 70, 90, 110, 130];
            newNextLevelXp = levelThresholds[newLevel];
          } else if (newLevel <= 24) {
            newNextLevelXp = Math.max(130, Math.floor(newNextLevelXp / 1.15));
          } else {
            newNextLevelXp = 2000;
          }
          if (newLevel < 10 && newTitle === '资深玩家') newTitle = undefined;
          else if (newLevel < 20 && newTitle === '大师级') newTitle = '资深玩家';
          else if (newLevel < 30 && newTitle === '传说级') newTitle = '大师级';
          else if (newLevel < 40 && newTitle === '神话级') newTitle = '传说级';
          else if (newLevel < 50 && newTitle === '不朽级') newTitle = '神话级';
          else if (newLevel < 51 && newTitle === '超越不朽') newTitle = '不朽级';
          newXp = newNextLevelXp + newXp;
        } else {
          newXp = 0;
        }
      }

      let gachaUpdate: Partial<GachaState> = {};
      if (newLevel < auth.user.level) {
        let drawsToRemove = 0;
        for (let level = newLevel + 1; level <= auth.user.level; level++) {
          drawsToRemove += getDrawsPerLevel(level);
        }
        gachaUpdate = {
          availableDraws: Math.max(0, gacha.gachaState.availableDraws - drawsToRemove),
          lastDrawLevel: Math.min(gacha.gachaState.lastDrawLevel, newLevel),
        };
        gacha.setGachaState(prev => ({ ...prev, ...gachaUpdate }));
      }

      const updatedUser = { ...auth.user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance, title: newTitle };
      auth.setUser(updatedUser);
      setStats(prev => {
        const updatedStats = { ...prev, totalXp: Math.max(0, prev.totalXp - xpToDeduct) };
        supabase.from('stats').upsert(toDB({ id: 'current-stats', user_id: auth.user!.id, ...updatedStats }))
          .then(() => {}).then(null, (error: unknown) => console.error('Error upserting stats:', error));
        return updatedStats;
      });

      supabase.from('users').upsert(toDB({ id: updatedUser.id, ...updatedUser }))
        .then(() => {}).then(null, (error: unknown) => console.error('Error upserting user:', error));
      if (Object.keys(gachaUpdate).length > 0) {
        supabase.from('gacha').upsert(toDB({ id: 'current-gacha', user_id: auth.user!.id, ...gacha.gachaState, ...gachaUpdate }))
          .then(() => {}).then(null, (error: unknown) => console.error('Error upserting gacha:', error));
      }
    }

    bingo.setBingoTiles(prev => prev.map(row => row.map(tile => {
      if (tile.taskName === entryToDelete.taskName && tile.completed) {
        return { ...tile, completed: false, completedAt: undefined };
      }
      return tile;
    })));
  };

  // Data export/import/clear
  const handleExportData = () => {
    const data = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      taskGroups: tasks.taskGroups,
      bingoTiles: bingo.bingoTiles,
      history: historyHook.history,
      achievements: achievements.achievements,
      stats,
      settings: settings.settings,
      gridSize: bingo.gridSize,
      shopItems: shop.shopItems,
      gachaState: gacha.gachaState,
      shopHistory: shop.shopHistory,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-bingo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.taskGroups) tasks.setTaskGroups(data.taskGroups);
        if (data.bingoTiles) bingo.setBingoTiles(data.bingoTiles);
        if (data.history) {
          historyHook.setHistory(data.history);
          if (auth.user) {
            const hWithUserId = data.history.map((h: HistoryEntry) => toDB({ ...h, user_id: auth.user!.id }));
            supabase.from('history').upsert(hWithUserId).then(null, (e: unknown) => console.error('Import history error:', e));
          }
        }
        if (data.achievements) achievements.setAchievements(data.achievements);
        if (data.stats) setStats(data.stats);
        if (data.settings) settings.setSettings(data.settings);
        if (data.gridSize) bingo.setGridSize(data.gridSize);
        if (data.shopItems) shop.setShopItems(data.shopItems);
        if (data.gachaState) gacha.setGachaState(data.gachaState);
        if (data.shopHistory) {
          shop.setShopHistory(data.shopHistory);
          if (auth.user) {
            const shWithUserId = data.shopHistory.map((h: ShopHistoryEntry) => toDB({ ...h, user_id: auth.user!.id }));
            supabase.from('shop_history').upsert(shWithUserId).then(null, (e: unknown) => console.error('Import shop history error:', e));
          }
        }
        toast('数据导入成功！', 'success');
      } catch (err) {
        console.error('Import error:', err);
        toast('导入失败，请检查文件格式', 'error');
      }
    };
    input.click();
  };

  const handleClearAllData = async () => {
    tasks.setTaskGroups(INITIAL_TASK_GROUPS);
    bingo.setBingoTiles(INITIAL_BINGO_TILES);
    historyHook.setHistory([]);
    achievements.setAchievements(INITIAL_ACHIEVEMENTS);
    setStats(INITIAL_STATS);
    settings.setSettings(INITIAL_SETTINGS);
    bingo.setGridSize(5);
    shop.setShopItems(INITIAL_SHOP_ITEMS);
    gacha.setGachaState({
      availableDraws: 0,
      lastDrawLevel: 1,
      consecutiveLowRewards: 0,
      consecutiveSameType: 0,
      history: [],
      lastFreeDrawDate: undefined,
    });
    shop.setShopHistory([]);
    if (auth.user) {
      const tables = ['task_groups', 'bingo_tiles', 'history', 'achievements', 'stats', 'settings', 'grid_size', 'shop_items', 'gacha', 'shop_history'];
      for (const table of tables) {
        supabase.from(table).delete().eq('user_id', auth.user.id)
          .then(() => {}).then(null, (error: unknown) => console.error(`Error clearing ${table}:`, error));
      }
    }
    setIsClearConfirmOpen(false);
  };

  // Login/logout wrappers
  const handleLogin = (userData: User) => {
    auth.login(userData);
    setActiveTab('today');
  };

  const handleLogout = () => {
    auth.logout(() => {
      tasks.setTaskGroups(INITIAL_TASK_GROUPS);
      bingo.setBingoTiles(INITIAL_BINGO_TILES);
      historyHook.setHistory([]);
      achievements.setAchievements(INITIAL_ACHIEVEMENTS);
      setStats(INITIAL_STATS);
      settings.setSettings(INITIAL_SETTINGS);
      bingo.setGridSize(5);
      shop.setShopItems(INITIAL_SHOP_ITEMS);
      gacha.setGachaState({
        availableDraws: 0, lastDrawLevel: 1,
        consecutiveLowRewards: 0, consecutiveSameType: 0,
        history: [], lastFreeDrawDate: undefined,
      });
      shop.setShopHistory([]);
    });
  };

  // Data loading
  useEffect(() => {
    const apiFetch = (path: string, method = 'GET', body?: unknown) => {
      const stored = window.localStorage.getItem('sb-ifqhbubjkgbfognvmonr-auth-token');
      const token = (() => { try { return stored ? JSON.parse(stored).access_token || '' : ''; } catch { return ''; } })();
      const headers: Record<string, string> = {
        'apikey': 'sb_publishable_4cvCbNm_2y7gxwOFxjlAMA_63DzT4Sy',
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const init: RequestInit = { method, headers };
      if (body && method !== 'GET') init.body = JSON.stringify(body);
      return fetch(`https://ifqhbubjkgbfognvmonr.supabase.co/rest/v1${path}`, init).then(r => {
        if (r.status === 201 || r.status === 204) return [];
        return r.json();
      });
    };

    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authUser = session?.user ?? null;

        if (!authUser) {
          auth.setUser(null);
          auth.setIsAuthLoading(false);
          return;
        }

        const userDataArr = await apiFetch(`/users?id=eq.${authUser.id}&select=*`);
        const userData = userDataArr?.[0];
        let loadedUser: User;
        if (!userData) {
          loadedUser = {
            id: authUser.id,
            username: authUser.email?.split('@')[0] || '用户',
            email: authUser.email || 'user@example.com',
            avatar: DEFAULT_AVATAR,
            joinedAt: authUser.created_at || new Date().toISOString(),
            level: 1, xp: 0, nextLevelXp: 200, balance: 0
          };
          await apiFetch('/users', 'POST', toDB(loadedUser));
        } else {
          loadedUser = fromDB<User>(userData);
          if (!loadedUser.avatar || loadedUser.avatar.includes('googleusercontent')) loadedUser.avatar = DEFAULT_AVATAR;
        }

        const [
          groupsRes, tilesRes, historyRes, achievementsRes,
          statsRes, settingsRes, gridSizeRes, shopItemsRes,
          gachaRes, shopHistoryRes
        ] = await Promise.allSettled([
          apiFetch(`/task_groups?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/bingo_tiles?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/history?user_id=eq.${authUser.id}&select=*&order=completedat.desc`),
          apiFetch(`/achievements?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/stats?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/settings?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/grid_size?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/shop_items?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/gacha?user_id=eq.${authUser.id}&select=*`),
          apiFetch(`/shop_history?user_id=eq.${authUser.id}&select=*&order=timestamp.desc`),
        ]);

        const val = <T,>(r: PromiseSettledResult<T>): T | undefined =>
          r.status === 'fulfilled' ? r.value : undefined;

        const groupsData = val(groupsRes);
        const tilesData = val(tilesRes);
        const historyData = val(historyRes);
        const achievementsData = val(achievementsRes);
        const statsData = val(statsRes);
        const settingsData = val(settingsRes);
        const gridSizeData = val(gridSizeRes);
        const shopItemsData = val(shopItemsRes);
        const gachaData = val(gachaRes);
        const shopHistoryData = val(shopHistoryRes);

        auth.setUser(loadedUser);
        if (groupsData?.length > 0) tasks.setTaskGroups(groupsData.map((g: Record<string, unknown>) => fromDB<TaskGroup>(g)));
        if (tilesData?.[0]?.grid) bingo.setBingoTiles(tilesData[0].grid);
        if (historyData?.length) historyHook.setHistory(historyData.map((h: Record<string, unknown>) => fromDB<HistoryEntry>(h)));
        if (achievementsData?.length) achievements.setAchievements(achievementsData.map((a: Record<string, unknown>) => fromDB<Achievement>(a)));
        if (statsData?.[0]) setStats(fromDB<Stats>(statsData[0]));
        if (settingsData?.[0]) settings.setSettings(fromDB<Settings>(settingsData[0]));
        if (gridSizeData?.[0]) bingo.setGridSize(gridSizeData[0].size);
        if (shopItemsData?.length) shop.setShopItems(shopItemsData.map((s: Record<string, unknown>) => fromDB<ShopItem>(s)));
        if (gachaData?.[0]) {
          const gs = fromDB<GachaState>(gachaData[0]);
          const today = new Date().toISOString().split('T')[0];
          if (gs.lastFreeDrawDate !== today) {
            gs.availableDraws = (gs.availableDraws || 0) + 1;
            gs.lastFreeDrawDate = today;
            supabase.from('gacha').upsert(toDB({ id: 'current-gacha', user_id: authUser.id, ...gs })).then(() => {}, e => console.error('Error saving daily free draw:', e));
          }
          gacha.setGachaState(gs);
        }
        if (shopHistoryData?.length) shop.setShopHistory(shopHistoryData.map((s: Record<string, unknown>) => fromDB<ShopHistoryEntry>(s)));

        auth.setIsAuthLoading(false);
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        auth.setIsAuthLoading(false);
      }
    };

    loadData();

    let initialLoadDone = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!initialLoadDone) { initialLoadDone = true; return; }
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const userDataArr = await apiFetch(`/users?id=eq.${session.user.id}&select=*`);
          const userData = userDataArr?.[0];
          if (!userData) {
            const newUser = {
              id: session.user.id,
              username: session.user.email?.split('@')[0] || '用户',
              email: session.user.email || 'user@example.com',
              avatar: DEFAULT_AVATAR,
              joinedAt: session.user.created_at || new Date().toISOString(),
              level: 1, xp: 0, nextLevelXp: 200, balance: 0
            };
            await apiFetch('/users', 'POST', toDB(newUser));
            auth.setUser(newUser);
          } else {
            const u = fromDB<User>(userData);
            if (!u.avatar || u.avatar.includes('googleusercontent')) u.avatar = DEFAULT_AVATAR;
            auth.setUser(u);
          }
        } catch (e) { console.error('Error in auth change:', e); }
      } else if (event === 'SIGNED_OUT') {
        auth.setUser(null);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // Auto-achievement detection
  useEffect(() => {
    if (!auth.user) return;
    const totalCompleted = historyHook.history.length;
    const uniqueDates = new Set(historyHook.history.map(h => new Date(h.completedAt).toDateString()));

    achievements.setAchievements(prev => prev.map(a => {
      if (a.unlocked) return a;
      let shouldUnlock = false;
      switch (a.id) {
        case 'a1': shouldUnlock = totalCompleted >= 1; break;
        case 'a2': shouldUnlock = uniqueDates.size >= 3; break;
        case 'a3': shouldUnlock = stats.bingosCount >= 10; break;
        case 'a4': shouldUnlock = stats.fullHousesCount >= 1; break;
        case 'a5': shouldUnlock = stats.totalXp >= 1000; break;
        case 'a6': shouldUnlock = stats.earlyBirdCount >= 1; break;
        case 'a7': shouldUnlock = stats.goldenTilesCompleted >= 5; break;
        case 'a8': shouldUnlock = stats.nightOwlCount >= 1; break;
        case 'a9': shouldUnlock = totalCompleted >= 50; break;
      }
      return shouldUnlock ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a;
    }));
  }, [auth.user, stats.totalCompleted, stats.bingosCount, stats.fullHousesCount, stats.totalXp, stats.earlyBirdCount, stats.goldenTilesCompleted, stats.nightOwlCount, historyHook.history.length]);

  // Stats computation
  useEffect(() => {
    const totalCompleted = historyHook.history.length;
    const uniqueDates = new Set(historyHook.history.map(h => new Date(h.completedAt).toDateString()));
    setStats(prev => ({ ...prev, totalCompleted, currentStreak: uniqueDates.size }));
  }, [historyHook.history]);

  // Persistence hooks
  useSupabaseSync('users', auth.user, { userId: auth.user?.id });
  useSupabaseSync('bingo_tiles', { grid: bingo.bingoTiles }, { userId: auth.user?.id, id: 'current-tiles' });
  useSupabaseSync('task_groups', tasks.taskGroups, { userId: auth.user?.id, idField: 'id' });
  useSupabaseSync('achievements', achievements.achievements, { userId: auth.user?.id, idField: 'id' });
  useSupabaseSync('stats', stats, { userId: auth.user?.id, id: 'current-stats' });
  useSupabaseSync('gacha', gacha.gachaState, { userId: auth.user?.id, id: 'current-gacha' });
  useSupabaseSync('settings', settings.settings, { userId: auth.user?.id, id: 'current-settings' });
  useSupabaseSync('grid_size', { size: bingo.gridSize }, { userId: auth.user?.id, id: 'current-grid-size' });
  useSupabaseSync('shop_items', shop.shopItems, { userId: auth.user?.id, idField: 'id' });

  // Theme sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.settings.theme);
  }, [settings.settings.theme]);

  if (auth.isAuthLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant shadow-sm">
            <svg className="w-12 h-12 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-primary tracking-[0.2em]">LIFE BINGO</h2>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} user={auth.user} onLoginClick={() => setActiveTab('login')} theme={settings.settings.theme}>
      <AnimatePresence mode="wait">
        {activeTab === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LoginView onLogin={handleLogin} />
          </motion.div>
        )}
        {activeTab === 'today' && (
          <motion.div
            key="today"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TodayView
              tiles={bingo.bingoTiles}
              onToggleTile={toggleTile}
              onShuffle={bingo.shuffleTiles}
              onReset={() => bingo.setIsResetConfirmOpen(true)}
              onPomodoro={() => setActiveTab('pomodoro')}
              onStats={() => {
                setActiveTab('achievements');
                setActiveSubTab('stats');
              }}
              onThemeClick={settings.cycleTheme}
              onUpdateTileNote={bingo.updateTileNote}
              showNoteModal={bingo.showNoteModal}
              setShowNoteModal={bingo.setShowNoteModal}
              selectedTile={bingo.selectedTile}
              setSelectedTile={bingo.setSelectedTile}
              noteText={bingo.noteText}
              setNoteText={bingo.setNoteText}
              handleLongPress={bingo.handleLongPress}
              handleSaveNote={bingo.handleSaveNote}
            />
          </motion.div>
        )}
        {activeTab === 'pomodoro' && (
          <motion.div
            key="pomodoro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PomodoroView
              onBack={() => setActiveTab('today')}
              user={auth.user}
              setUser={auth.setUser}
              stats={stats}
              setStats={setStats}
              history={historyHook.history}
              setHistory={historyHook.setHistory}
              bingoTiles={bingo.bingoTiles}
              playSound={playSound}
              triggerHaptic={triggerHaptic}
            />
          </motion.div>
        )}
        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TasksView
              groups={tasks.taskGroups}
              onToggleTask={tasks.toggleTask}
              onAddGroup={tasks.addGroup}
              onDeleteGroup={tasks.deleteGroup}
              onEditGroup={tasks.editGroup}
              onUpdateTask={tasks.updateTask}
              onAddTask={tasks.addTask}
              onDeleteTask={tasks.deleteTask}
              onApplyGroup={bingo.applyGroupToGrid}
              onApplyTask={bingo.applyTaskToGrid}
              onApplyMultipleTasks={bingo.applyMultipleTasksToGrid}
              gridSize={bingo.gridSize}
              onGridSizeChange={bingo.handleGridSizeChange}
              onShuffleTasks={tasks.shuffleTasks}
              onSortTasks={tasks.sortTasks}
              onToggleGroupTasks={tasks.toggleGroupTasks}
              bingoTiles={bingo.bingoTiles}
            />
          </motion.div>
        )}
        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CalendarView
              history={historyHook.history}
              onBackToToday={() => setActiveTab('today')}
              onDeleteEntry={deleteHistoryEntry}
              onEditEntry={historyHook.editHistoryEntry}
            />
          </motion.div>
        )}
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AchievementsView
              achievements={achievements.achievements}
              stats={stats}
              history={historyHook.history}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              isTimeRangeModalOpen={isTimeRangeModalOpen}
              setIsTimeRangeModalOpen={setIsTimeRangeModalOpen}
              onAddCustomAchievement={achievements.addCustomAchievement}
              onDeleteAchievement={achievements.deleteAchievement}
              onToggleAchievement={achievements.toggleAchievement}
              onUpdateAchievement={achievements.updateAchievement}
              initialViewMode={activeTab === 'achievements' && activeSubTab === 'stats' ? 'stats' : 'achievements'}
            />
          </motion.div>
        )}
        {activeTab === 'gacha' && (
          <motion.div
            key="gacha"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <GachaView
              userLevel={auth.user?.level || 1}
              gachaState={gacha.gachaState}
              onDraw={gacha.handleGachaDraw}
              onTabChange={setActiveTab}
              showHelp={gacha.showHelp}
              setShowHelp={gacha.setShowHelp}
            />
          </motion.div>
        )}
        {activeTab === 'shop' && (
          <motion.div
            key="shop"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ShopView
              items={shop.shopItems}
              userBalance={auth.user?.balance || 0}
              userLevel={auth.user?.level || 1}
              onBuyItem={shop.buyItem}
              onAddItem={shop.addShopItem}
              onUpdateItem={shop.updateShopItem}
              onDeleteItem={shop.deleteShopItem}
              onTabChange={setActiveTab}
              shopHistory={shop.shopHistory}
              showHistory={shop.showHistory}
              setShowHistory={shop.setShowHistory}
            />
          </motion.div>
        )}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SettingsView
              settings={settings.settings}
              onUpdateSettings={settings.updateSettings}
              user={auth.user}
              onLogout={handleLogout}
              onEditProfile={auth.handleEditProfile}
              isEditModalOpen={auth.isEditModalOpen}
              setIsEditModalOpen={auth.setIsEditModalOpen}
              editUsername={auth.editUsername}
              setEditUsername={auth.setEditUsername}
              editEmail={auth.editEmail}
              setEditEmail={auth.setEditEmail}
              editAvatar={auth.editAvatar}
              setEditAvatar={auth.setEditAvatar}
              onUpdateUser={auth.updateUser}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onClearAllData={() => setIsClearConfirmOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>

      <ConfirmDialog
        isOpen={bingo.isResetConfirmOpen}
        onClose={() => bingo.setIsResetConfirmOpen(false)}
        title="确认重置"
        message="确定要重置所有任务的完成状态吗？此操作无法撤销。"
        onConfirm={bingo.confirmReset}
      />

      <EditTaskEntryModal
        isOpen={historyHook.isEditTaskModalOpen && !!historyHook.editingEntry}
        onClose={() => historyHook.setIsEditTaskModalOpen(false)}
        entry={historyHook.editingEntry}
        editForm={historyHook.editForm}
        onFormChange={(updates: Partial<typeof historyHook.editForm>) => historyHook.setEditForm(prev => ({ ...prev, ...updates }))}
        onSave={() => historyHook.saveEditTask(toast)}
      />

      <EditProfileModal
        isOpen={auth.isEditModalOpen}
        onClose={() => auth.setIsEditModalOpen(false)}
        username={auth.editUsername}
        email={auth.editEmail}
        avatar={auth.editAvatar}
        isSaving={auth.isSaving}
        onUsernameChange={auth.setEditUsername}
        onEmailChange={auth.setEditEmail}
        onAvatarChange={auth.setEditAvatar}
        onSave={() => auth.handleSaveProfile(toast)}
      />

      <ShopHistoryModal
        isOpen={shop.showHistory}
        onClose={() => shop.setShowHistory(false)}
        history={shop.shopHistory}
      />

      <PurchaseSuccessModal
        isOpen={!!shop.purchasedItem}
        onClose={() => shop.setPurchasedItem(null)}
        item={shop.purchasedItem}
      />

      <GachaResultModal
        isOpen={gacha.showGachaResult && !!gacha.lastDrawResult}
        onClose={() => gacha.setShowGachaResult(false)}
        result={gacha.lastDrawResult}
      />

      <GachaHelpModal
        isOpen={gacha.showHelp}
        onClose={() => gacha.setShowHelp(false)}
      />

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        title="清除所有数据"
        message="此操作将永久删除你所有的任务、记录和设置，无法撤销。确定要继续吗？"
        onConfirm={handleClearAllData}
        variant="danger"
        icon={<Trash2 className="w-8 h-8 text-red-500" />}
      />

      <AnimatePresence>
        {bingo.showNoteModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => bingo.setShowNoteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-10 border border-outline-variant shadow-2xl space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tight uppercase">任务备注</h3>
                  <button onClick={() => bingo.setShowNoteModal(false)} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">任务名称</label>
                    <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold">
                      {bingo.selectedTile?.tile.taskName}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">备注信息</label>
                    <textarea
                      placeholder="请输入任务备注..."
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none h-32"
                      value={bingo.noteText}
                      onChange={(e) => bingo.setNoteText(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => bingo.setShowNoteModal(false)}
                    className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-semibold tracking-wide text-[11px]"
                  >
                    取消
                  </button>
                  <button
                    onClick={bingo.handleSaveNote}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-semibold tracking-wide text-[11px]"
                  >
                    保存备注
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
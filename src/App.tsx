import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X } from 'lucide-react';
import { supabase, migrateBase64Avatar } from './lib/supabase';
import { TaskDifficulty, TaskPriority, Achievement, Stats, HistoryEntry, TaskGroup, BingoTile, Settings, ShopItem, User, GachaState, ShopHistoryEntry } from './types';
import { INITIAL_TASK_GROUPS, INITIAL_BINGO_TILES, INITIAL_ACHIEVEMENTS, INITIAL_STATS, INITIAL_SETTINGS, INITIAL_SHOP_ITEMS, DEFAULT_AVATAR } from './constants';
import type { Task } from './types';
import { getTotalDrawsForLevel } from './gachaUtils';
import { toDB, fromDB } from './lib/utils';
import { calculateXP, getTitleForLevel, getNextLevelXp, XP_PER_LEVEL } from './lib/gameLogic';
import { logError } from './lib/utils';
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

// Helper: count consecutive days from the most recent activity date backwards.
// Streak is anchored to today or yesterday; breaks if gap > 1 day.
function calcConsecutiveDays(history: HistoryEntry[]): number {
  const dateSet = new Set(history.map(h => new Date(h.completedAt).toDateString()));
  if (dateSet.size === 0) return 0;

  const dates = [...dateSet]
    .map(d => new Date(d + 'T00:00:00'))
    .sort((a, b) => b.getTime() - a.getTime()); // descending

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecent = dates[0];
  // Streak must be anchored to today or yesterday
  if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diffDays = (dates[i - 1].getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// --- Main App ---

function AppContent() {
  const { toast } = useToast();

  // Recovery flow detection (password reset via email link)
  const initialRecoveryCheck = window.location.hash.includes('type=recovery');
  const [recoveryFlow, setRecoveryFlow] = useState(initialRecoveryCheck);
  const recoveryFlowRef = useRef(initialRecoveryCheck);
  useEffect(() => { recoveryFlowRef.current = recoveryFlow; }, [recoveryFlow]);

  // UI state
  const [activeTab, setActiveTab] = useState(initialRecoveryCheck ? 'login' : 'today');
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
      newNextLevelXp = XP_PER_LEVEL;
      if (newLevel % 10 === 0) {
        newTitle = getTitleForLevel(newLevel);
      }
      playSound('levelUp');
      triggerHaptic('heavy');
    }

    if (newLevel > oldLevel) {
      gacha.setGachaState(prev => ({
        ...prev,
        availableDraws: getTotalDrawsForLevel(newLevel) - (prev.totalDrawsSpent || 0),
      }));
    }

    auth.setUser({ ...auth.user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance, title: newTitle });

    setStats(prev => ({
      ...prev,
      totalXp: prev.totalXp + xpAmount,
      ...(additionalStatsUpdate ? additionalStatsUpdate(prev) : {})
    }));
  }

  // Shared XP deduction (used by toggleTile and deleteHistoryEntry)
  function applyXPDeduction(xpToDeduct: number, extraStatsUpdate?: (prev: Stats) => Partial<Stats>) {
    if (!auth.user) return;

    let newXp = auth.user.xp - xpToDeduct;
    let newLevel = auth.user.level;
    let newNextLevelXp = auth.user.nextLevelXp;
    let newBalance = Math.max(0, auth.user.balance - xpToDeduct);
    let newTitle = auth.user.title;

    if (newXp < 0) {
      if (newLevel > 1) {
        newLevel -= 1;
        newNextLevelXp = getNextLevelXp();
        newTitle = getTitleForLevel(newLevel);
        newXp = newNextLevelXp + newXp;
      } else {
        newXp = 0;
      }
    }

    if (newLevel < auth.user.level) {
      gacha.setGachaState(prev => ({
        ...prev,
        availableDraws: Math.max(0, getTotalDrawsForLevel(newLevel) - (prev.totalDrawsSpent || 0)),
      }));
    }

    auth.setUser({ ...auth.user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance, title: newTitle });
    setStats(prev => ({
      ...prev,
      totalXp: Math.max(0, prev.totalXp - xpToDeduct),
      ...(extraStatsUpdate ? extraStatsUpdate(prev) : {}),
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
          .then(null, logError('deleting history entry in toggleTile'));
      }

      let xpToDeduct = tile.xpValue || 10;
      if (tile.isGolden) xpToDeduct *= 2;

    applyXPDeduction(xpToDeduct, () => ({ bingosCount: Math.max(0, stats.bingosCount - 1) }));

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

      const newGrid = bingo.bingoTiles.map((row, ri) =>
        row.map((t, ci) => ri === r && ci === c ? { ...t, completed: true, completedAt } : t)
      );
      bingo.setBingoTiles(newGrid);

      historyHook.setHistory(prev => [newEntry, ...prev]);
      addXPWithLevelUp(xp);

      if (checkBingo(newGrid, r, c)) {
        setStats(prev => ({ ...prev, bingosCount: prev.bingosCount + 1 }));
        playSound('bingo');
        triggerHaptic('heavy');
      }

      const allCompleted = newGrid.flat().every(t => t.completed);
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
        .then(null, logError('saving history entry'));

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
        .then(null, logError('deleting history entry in deleteHistoryEntry'));
    }

    let xpToDeduct = 10;
    bingo.bingoTiles.forEach(row => row.forEach(tile => {
      if (tile.taskName === entryToDelete.taskName) {
        xpToDeduct = tile.xpValue || 10;
        if (tile.isGolden) xpToDeduct *= 2;
      }
    }));

    applyXPDeduction(xpToDeduct);

    if (auth.user) {
      supabase.from('stats').upsert(toDB({ id: 'current-stats', user_id: auth.user.id, ...stats }))
        .then(null, logError('upserting stats in deleteHistoryEntry'));
      supabase.from('users').upsert(toDB({ id: auth.user.id, ...auth.user }))
        .then(null, logError('upserting user in deleteHistoryEntry'));
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
            supabase.from('history').upsert(hWithUserId).then(null, logError('import history'));
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
            supabase.from('shop_history').upsert(shWithUserId).then(null, logError('import shop history'));
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

  const resetAllAppState = () => {
    tasks.setTaskGroups(INITIAL_TASK_GROUPS);
    bingo.setBingoTiles(INITIAL_BINGO_TILES);
    historyHook.setHistory([]);
    achievements.setAchievements(INITIAL_ACHIEVEMENTS);
    setStats(INITIAL_STATS);
    settings.setSettings(INITIAL_SETTINGS);
    bingo.setGridSize(5);
    shop.setShopItems(INITIAL_SHOP_ITEMS);
    gacha.setGachaState({
      availableDraws: 0, totalDrawsSpent: 0,
      consecutiveLowRewards: 0, consecutiveSameType: 0,
      history: [], lastFreeDrawDate: undefined, freeDrawUsed: false,
    });
    shop.setShopHistory([]);
  };

  const handleClearAllData = async () => {
    resetAllAppState();
    if (auth.user) {
      const tables = ['task_groups', 'bingo_tiles', 'history', 'achievements', 'stats', 'settings', 'grid_size', 'shop_items', 'gacha', 'shop_history'];
      for (const table of tables) {
        supabase.from(table).delete().eq('user_id', auth.user.id)
          .then(null, logError(`clearing ${table}`));
      }
    }
    setIsClearConfirmOpen(false);
  };

  // Logout wrapper
  const handleLogout = () => {
    auth.logout(resetAllAppState, () => Promise.all(flushRef.current.map(f => f())));
  };

  // Data loading
  useEffect(() => {
    const sf = <T,>(promise: PromiseLike<{ data: T }>) =>
      promise.then(({ data }) => data, () => undefined);

    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authUser = session?.user ?? null;

        if (!authUser) {
          console.log('🟡 [loadData] 无会话，显示登录页');
          auth.setUser(null);
          auth.setIsAuthLoading(false);
          return;
        }
        console.log('🟢 [loadData] 会话存在，开始加载数据:', authUser.email);

        const uid = authUser.id;
        const { data: userDataArr } = await supabase.from('users').select('id,username,email,joinedat,level,xp,nextlevelxp,balance,title').eq('id', uid);
        const userData = userDataArr?.[0];
        let loadedUser: User;
        if (!userData) {
          console.log('🟡 [loadData] 用户不在 users 表中，创建新用户:', uid);
          loadedUser = {
            id: uid,
            username: authUser.email?.split('@')[0] || '用户',
            email: authUser.email || 'user@example.com',
            avatar: DEFAULT_AVATAR,
            joinedAt: authUser.created_at || new Date().toISOString(),
            level: 1, xp: 0, nextLevelXp: XP_PER_LEVEL, balance: 0
          };
          supabase.from('users').insert(toDB(loadedUser))
            .then(() => console.log('🟢 [loadData] 新用户已插入 users 表'))
            .then(null, logError('inserting new user'));
        } else {
          console.log('🟢 [loadData] 用户已存在，加载数据:', uid);
          loadedUser = fromDB<User>(userData);
          const { data: avatarArr } = await supabase.from('users').select('avatar').eq('id', uid);
          const dbAvatar = avatarArr?.[0]?.avatar;
          if (dbAvatar && dbAvatar.startsWith('data:') && !dbAvatar.startsWith('data:image/svg')) {
            loadedUser.avatar = DEFAULT_AVATAR;
            migrateBase64Avatar(uid, dbAvatar).then(url => {
              supabase.from('users').update(toDB({ avatar: url })).eq('id', uid).then(null, logError('updating migrated avatar'));
              auth.setUser(prev => prev ? { ...prev, avatar: url } : null);
            }).catch(e => console.error('Avatar migration failed:', e));
          } else if (dbAvatar) {
            loadedUser.avatar = dbAvatar;
          } else {
            loadedUser.avatar = DEFAULT_AVATAR;
          }
        }

        const [
          groupsRes, tilesRes, historyRes, achievementsRes,
          statsRes, settingsRes, gridSizeRes, shopItemsRes,
          gachaRes, shopHistoryRes
        ] = await Promise.allSettled([
          sf(supabase.from('task_groups').select('*').eq('user_id', uid)),
          sf(supabase.from('bingo_tiles').select('*').eq('user_id', uid)),
          sf(supabase.from('history').select('*').eq('user_id', uid).order('completedat', { ascending: false })),
          sf(supabase.from('achievements').select('*').eq('user_id', uid)),
          sf(supabase.from('stats').select('*').eq('user_id', uid)),
          sf(supabase.from('settings').select('*').eq('user_id', uid)),
          sf(supabase.from('grid_size').select('*').eq('user_id', uid)),
          sf(supabase.from('shop_items').select('*').eq('user_id', uid)),
          sf(supabase.from('gacha').select('*').eq('user_id', uid)),
          sf(supabase.from('shop_history').select('*').eq('user_id', uid).order('timestamp', { ascending: false })),
        ]);

        const extractSettled = <T,>(r: PromiseSettledResult<T>): T | undefined =>
          r.status === 'fulfilled' ? r.value : undefined;

        const groupsData = extractSettled(groupsRes);
        const tilesData = extractSettled(tilesRes);
        const historyData = extractSettled(historyRes);
        const achievementsData = extractSettled(achievementsRes);
        const statsData = extractSettled(statsRes);
        const settingsData = extractSettled(settingsRes);
        const gridSizeData = extractSettled(gridSizeRes);
        const shopItemsData = extractSettled(shopItemsRes);
        const gachaData = extractSettled(gachaRes);
        const shopHistoryData = extractSettled(shopHistoryRes);

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
            gs.freeDrawUsed = false;
            supabase.from('gacha').upsert(toDB({ id: 'current-gacha', user_id: authUser.id, ...gs })).then(null, logError('saving daily free draw'));
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
      if (event === 'PASSWORD_RECOVERY') {
        setActiveTab('login');
        return;
      }
      if (event === 'SIGNED_IN' && session?.user) {
        if (recoveryFlowRef.current) return;
        window.location.reload();
      } else if (event === 'SIGNED_OUT') {
        auth.setUser(null);
        setRecoveryFlow(false);
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // Auto-achievement detection
  useEffect(() => {
    if (!auth.user) return;
    const totalCompleted = historyHook.history.length;
    const consecutiveDays = calcConsecutiveDays(historyHook.history);

    achievements.setAchievements(prev => prev.map(a => {
      if (a.unlocked) return a;
      let shouldUnlock = false;
      switch (a.id) {
        case 'a1': shouldUnlock = totalCompleted >= 1; break;
        case 'a2': shouldUnlock = consecutiveDays >= 3; break;
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
    const consecutiveDays = calcConsecutiveDays(historyHook.history);
    setStats(prev => ({ ...prev, totalCompleted, currentStreak: consecutiveDays }));
  }, [historyHook.history]);

  // Persistence hooks
  const prevUserRef = useRef<string>('');
  const userRef = useRef(auth.user);
  userRef.current = auth.user;
  useEffect(() => {
    if (!auth.user) return;
    const serialized = JSON.stringify(auth.user);
    if (serialized === prevUserRef.current) return;
    prevUserRef.current = serialized;
    supabase.from('users').upsert(toDB(auth.user)).then(null, logError('syncing user'));
  }, [auth.user]);

  const flushRef = useRef<Array<() => Promise<void>>>([]);
  flushRef.current = [];
  flushRef.current.push(() => {
    if (!userRef.current) return Promise.resolve();
    const serialized = JSON.stringify(userRef.current);
    if (serialized === prevUserRef.current) return Promise.resolve();
    prevUserRef.current = serialized;
    return supabase.from('users').upsert(toDB(userRef.current)).then(null, logError('flushing user'));
  });
  const s1 = useSupabaseSync('bingo_tiles', { grid: bingo.bingoTiles }, { userId: auth.user?.id, id: 'current-tiles' }); flushRef.current.push(s1.flush);
  const s2 = useSupabaseSync('task_groups', tasks.taskGroups, { userId: auth.user?.id, idField: 'id', currentIds: tasks.taskGroups.map(g => g.id) }); flushRef.current.push(s2.flush);
  const s3 = useSupabaseSync('achievements', achievements.achievements, { userId: auth.user?.id, idField: 'id', currentIds: achievements.achievements.map(a => a.id) }); flushRef.current.push(s3.flush);
  const s4 = useSupabaseSync('stats', stats, { userId: auth.user?.id, id: 'current-stats' }); flushRef.current.push(s4.flush);
  const s5 = useSupabaseSync('gacha', gacha.gachaState, { userId: auth.user?.id, id: 'current-gacha' }); flushRef.current.push(s5.flush);
  const s6 = useSupabaseSync('settings', settings.settings, { userId: auth.user?.id, id: 'current-settings' }); flushRef.current.push(s6.flush);
  const s7 = useSupabaseSync('grid_size', { size: bingo.gridSize }, { userId: auth.user?.id, id: 'current-grid-size' }); flushRef.current.push(s7.flush);
  const s8 = useSupabaseSync('shop_items', shop.shopItems, { userId: auth.user?.id, idField: 'id', currentIds: shop.shopItems.map(i => i.id) }); flushRef.current.push(s8.flush);

  if (auth.isAuthLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm">
            <svg className="w-10 h-10 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <Layout activeTab={activeTab} onTabChange={setActiveTab} user={auth.user} onLoginClick={() => setActiveTab('login')} settings={settings.settings}>
      <AnimatePresence mode="wait">
        {activeTab === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LoginView isRecoveryFlow={recoveryFlow} />
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
              settings={settings.settings}
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
              onSaveHistory={(entry) => {
                if (auth.user) {
                  supabase.from('history').insert(toDB({ ...entry, user_id: auth.user.id }))
                    .then(null, logError('saving pomodoro history'));
                }
              }}
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
        onAvatarFile={auth.setEditAvatarFile}
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

      {bingo.showNoteModal && createPortal(
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
            className="relative w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-2xl space-y-5"
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
                  <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3 text-sm font-bold">
                    {bingo.selectedTile?.tile.taskName}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">备注信息</label>
                  <textarea
                    placeholder="请输入任务备注..."
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3 text-sm font-bold outline-none resize-none h-32"
                    value={bingo.noteText}
                    onChange={(e) => bingo.setNoteText(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => bingo.setShowNoteModal(false)}
                  className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-2xl font-semibold tracking-wide text-[11px]"
                >
                  取消
                </button>
                <button
                  onClick={bingo.handleSaveNote}
                  className="flex-1 bg-primary text-on-primary py-3 rounded-2xl font-semibold tracking-wide text-[11px]"
                >
                  保存备注
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
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
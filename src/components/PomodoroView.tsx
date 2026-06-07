import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Settings2, Edit2, Focus, Coffee, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { ConfirmDialog } from './Modal';
import { PomodoroSettingsModal } from './PomodoroSettingsModal';
import { TaskSelectorBottomSheet } from './TaskSelectorBottomSheet';
import { XP_PER_LEVEL } from '../lib/gameLogic';
import type { User, Stats, HistoryEntry, BingoTile } from '../types';

export function PomodoroView({
  onBack, user, setUser, stats, setStats, history, setHistory, bingoTiles, playSound, triggerHaptic, onSaveHistory,
}: {
  onBack: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  stats: Stats;
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
  history: HistoryEntry[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
  bingoTiles: BingoTile[][];
  playSound: (type: 'complete' | 'bingo' | 'levelUp') => void;
  triggerHaptic: (intensity?: 'light' | 'medium' | 'heavy') => void;
  onSaveHistory: (entry: HistoryEntry) => void;
}) {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskSelectorOpen, setIsTaskSelectorOpen] = useState(false);
  const [isModeSwitchConfirmOpen, setIsModeSwitchConfirmOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'work' | 'shortBreak' | 'longBreak' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customDurations, setCustomDurations] = useState<{ work: number; shortBreak: number; longBreak: number }>(() => {
    const saved = localStorage.getItem('pomodoro-durations');
    return saved ? JSON.parse(saved) : { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
  });

  const durations = customDurations;

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) { interval = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000); }
    else if (timeLeft === 0) { setIsActive(false); handleSessionComplete(); }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => { localStorage.setItem('pomodoro-durations', JSON.stringify(customDurations)); }, [customDurations]);

  const handleDurationChange = (key: 'work' | 'shortBreak' | 'longBreak', value: number) => {
    setCustomDurations(prev => ({ ...prev, [key]: value * 60 }));
  };

  const saveSettings = () => { setIsSettingsOpen(false); setTimeLeft(durations[mode]); };

  const handleSessionComplete = () => {
    playSound('complete'); triggerHaptic('heavy');
    if (mode === 'work') {
      const xpReward = 20;
      if (user) {
        setUser(prev => {
          if (!prev) return prev;
          let newXp = prev.xp + xpReward;
          let newLevel = prev.level;
          let nextLevelXp = prev.nextLevelXp;
          let newTitle = prev.title;
          if (newXp >= nextLevelXp) {
            newXp -= nextLevelXp; newLevel += 1; nextLevelXp = XP_PER_LEVEL;
            if (newLevel % 10 === 0) {
              if (newLevel === 10) newTitle = '资深玩家';
              else if (newLevel === 20) newTitle = '大师级';
              else if (newLevel === 30) newTitle = '传说级';
              else if (newLevel === 40) newTitle = '神话级';
              else if (newLevel === 50) newTitle = '不朽级';
              else if (newLevel > 50) newTitle = '超越不朽';
            }
            playSound('levelUp');
          }
          return { ...prev, xp: newXp, level: newLevel, nextLevelXp, title: newTitle };
        });
      }
      setStats(prev => ({ ...prev, totalCompleted: prev.totalCompleted + 1, totalXp: prev.totalXp + xpReward }));
      const newEntry: HistoryEntry = { id: `pomo-${Date.now()}`, taskName: selectedTask || '专注会话', completedAt: new Date().toISOString(), xpEarned: xpReward, type: 'pomodoro', duration: durations.work / 60 };
      setHistory(prev => [newEntry, ...prev]);
      onSaveHistory(newEntry);
      setMode('shortBreak'); setTimeLeft(durations.shortBreak);
    } else {
      setMode('work'); setTimeLeft(durations.work);
    }
  };

  const formatTime = (seconds: number) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`; };
  const toggleTimer = () => { if (!isActive) triggerHaptic('light'); setIsActive(!isActive); };
  const resetTimer = () => { setIsActive(false); setTimeLeft(durations[mode]); triggerHaptic('medium'); };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    if (isActive) { setPendingMode(newMode); setIsModeSwitchConfirmOpen(true); }
    else { setMode(newMode); setTimeLeft(durations[newMode]); setIsActive(false); triggerHaptic('light'); }
  };

  const confirmModeSwitch = () => {
    if (pendingMode) { setMode(pendingMode); setTimeLeft(durations[pendingMode]); setIsActive(false); setIsModeSwitchConfirmOpen(false); setPendingMode(null); triggerHaptic('light'); }
  };

  const cancelModeSwitch = () => { setIsModeSwitchConfirmOpen(false); setPendingMode(null); };
  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  const sessionsToday = history.filter(h => h.type === 'pomodoro' && new Date(h.completedAt).toDateString() === new Date().toDateString()).length;
  const totalSessionsGoal = 4;
  const focusTimeToday = (sessionsToday * 25) / 60;
  const weeklyGoal = 24;
  const weeklyProgress = history.filter(h => h.type === 'pomodoro' && new Date(h.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length * 25 / 60;

  const allTasks = bingoTiles.flat().filter(t => !t.isFreeTile);

  return (
    <div className="space-y-5 pb-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-surface-container-low rounded-2xl text-on-surface-variant active:scale-90 transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <h1 className="font-headline font-black text-xl tracking-tight uppercase">专注进程</h1>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-surface-container-low rounded-2xl text-on-surface-variant active:scale-90 transition-all"><Settings2 className="w-5 h-5" /></button>
      </header>

      <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container border border-outline-variant p-5 rounded-2xl shadow-xl space-y-5">
        <div className="flex bg-surface-container p-2 rounded-3xl border border-outline-variant shadow-md gap-2">
          <button onClick={() => switchMode('work')} className={cn("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300", mode === 'work' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container-high")}>专注</button>
          <button onClick={() => switchMode('shortBreak')} className={cn("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300", mode === 'shortBreak' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container-high")}>短休</button>
          <button onClick={() => switchMode('longBreak')} className={cn("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300", mode === 'longBreak' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container-high")}>长休</button>
        </div>

        <motion.button onClick={() => setIsTaskSelectorOpen(true)} className="w-full bg-surface-container p-4 rounded-2xl text-left active:scale-[0.98] transition-all group shadow-md border border-outline-variant" whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
          <div className="flex justify-between items-center mb-3"><span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">当前任务</span><Edit2 className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" /></div>
          <h2 className="text-2xl font-black tracking-tight text-primary truncate">{selectedTask || '选择一个任务...'}</h2>
        </motion.button>

        <div className="relative flex items-center justify-center py-6">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ rotate: isActive ? 360 : 0 }} transition={{ duration: 60, repeat: isActive ? Infinity : 0, ease: "linear" }}><div className="w-2 h-10 bg-primary/20 rounded-full"></div></motion.div>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-container" />
              <motion.circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="282.7" animate={{ strokeDashoffset: 282.7 - (282.7 * progress) / 100 }} className="text-primary" strokeLinecap="round" transition={{ type: 'spring', bounce: 0, duration: 1 }} />
            </svg>
            <div className="flex flex-col items-center z-10">
              <span className="text-6xl font-black tracking-tighter tabular-nums text-on-surface">{formatTime(timeLeft)}</span>
              <motion.div className="flex items-center gap-2 mt-4 text-primary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {mode === 'work' ? <Focus className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{isActive ? (mode === 'work' ? '工作中' : '休息中') : '已暂停'}</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <motion.button onClick={toggleTimer} className={cn("flex-[1.5] py-4 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl", isActive ? "bg-surface-container text-on-surface-variant/60" : "bg-primary text-on-primary shadow-primary/30")} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}{isActive ? '暂停' : '开始'}
            </motion.button>
            <motion.button onClick={resetTimer} className="flex-1 bg-surface-container text-on-surface py-4 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}><RotateCcw className="w-6 h-6" />重置</motion.button>
          </div>
          <motion.button onClick={() => { setIsActive(false); setTimeLeft(durations[mode]); }} className="w-full py-3 rounded-3xl text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.3em] hover:text-on-surface-variant hover:bg-surface-container transition-all" whileTap={{ scale: 0.98 }}>放弃本次会话</motion.button>
        </div>

        <div className="space-y-5 pt-6 border-t border-outline-variant/50">
          <motion.div className="bg-surface-container p-4 rounded-2xl space-y-4 shadow-md border border-outline-variant" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex justify-between items-center"><span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">今日目标进度</span><span className="text-[10px] font-black text-primary uppercase tracking-widest">{Math.min(100, Math.round((focusTimeToday / 6) * 100))}%</span></div>
            <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (focusTimeToday / 6) * 100)}%` }} className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" transition={{ duration: 1 }} /></div>
            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest"><span>周目标 ({weeklyGoal}h)</span><span>已完成 {weeklyProgress.toFixed(1)}h</span></div>
          </motion.div>
          <div className="grid grid-cols-2 gap-5">
            <motion.div className="bg-surface-container p-4 rounded-2xl shadow-md border border-outline-variant" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest block mb-4">番茄钟历史</span>
              <div className="flex items-baseline gap-2 mb-3"><span className="text-2xl font-black tracking-tighter">{sessionsToday}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">/ {totalSessionsGoal} 组完成</span></div>
              <div className="flex gap-2">{[...Array(totalSessionsGoal)].map((_, i) => (<motion.div key={i} className={cn("h-2 flex-1 rounded-full transition-all duration-500", i < sessionsToday ? "bg-primary" : "bg-surface-container-high")} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.1 * i }} />))}</div>
            </motion.div>
            <motion.div className="bg-surface-container p-4 rounded-2xl shadow-md border border-outline-variant" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest block mb-4">今日专注时长</span>
              <div className="flex items-baseline gap-2 mb-3"><span className="text-2xl font-black tracking-tighter">{focusTimeToday.toFixed(1)}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">小时</span></div>
              <motion.div className="text-[10px] font-black text-primary uppercase tracking-widest" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: focusTimeToday > 0 ? Infinity : 0 }}>{focusTimeToday > 0 ? '+100% vs 昨天' : '开始专注吧'}</motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <PomodoroSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} durations={durations} onDurationChange={handleDurationChange} onSave={saveSettings} />
      <ConfirmDialog isOpen={isModeSwitchConfirmOpen} onClose={cancelModeSwitch} title="确认切换模式" message="当前番茄钟正在运行，切换模式将重置计时器。确定要继续吗？" onConfirm={confirmModeSwitch} icon={<Clock className="w-8 h-8 text-primary" />} />
      <TaskSelectorBottomSheet isOpen={isTaskSelectorOpen} onClose={() => setIsTaskSelectorOpen(false)} tasks={allTasks.map(t => ({ id: t.id, name: t.taskName, difficulty: t.difficulty, priority: t.priority, xpValue: t.xpValue }))} selectedTask={selectedTask || ''} onSelect={setSelectedTask} />
    </div>
  );
}

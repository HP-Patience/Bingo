import { useState } from 'react';
import { Zap, Flame, CheckCircle2, Timer, SettingsIcon, TrendingUp, Activity, Trophy, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TimeRangeModal, type TimeRange } from './TimeRangeModal';
import type { Stats, HistoryEntry } from '../types';

function getDurationMinutes(h: HistoryEntry): number {
  if (h.duration) return h.duration;
  if (h.type === 'pomodoro') return 25;
  return 5;
}

export function StatsView({ stats, history, timeRange, setTimeRange, isTimeRangeModalOpen, setIsTimeRangeModalOpen }: { stats: Stats, history: HistoryEntry[], timeRange: TimeRange, setTimeRange: (range: TimeRange) => void, isTimeRangeModalOpen: boolean, setIsTimeRangeModalOpen: (open: boolean) => void }) {
  const [currentDayOffset, setCurrentDayOffset] = useState(0);

  const getDateRange = (offset: number) => {
    const dates = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i) + offset);
      return d.toDateString();
    });
    return dates;
  };

  const last7Days = getDateRange(currentDayOffset);

  const getFilteredHistory = (range: TimeRange) => {
    const now = new Date();
    return history.filter(entry => {
      const entryDate = new Date(entry.completedAt);
      switch (range) {
        case 'today': return entryDate.toDateString() === now.toDateString();
        case 'week': { const ws = new Date(now); ws.setDate(now.getDate() - now.getDay()); return entryDate >= ws; }
        case 'quarter': { const qs = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1); return entryDate >= qs; }
        case 'year': return entryDate >= new Date(now.getFullYear(), 0, 1);
        case 'all': default: return true;
      }
    });
  };

  const getStatsByRange = (range: TimeRange) => {
    const filteredHistory = getFilteredHistory(range);
    const totalCompleted = filteredHistory.length;
    const totalXp = filteredHistory.reduce((acc, h) => acc + (h.xpEarned || 0), 0);
    const totalFocusMinutes = filteredHistory.reduce((total, h) => total + getDurationMinutes(h), 0);
    const hours = Math.floor(totalFocusMinutes / 60);
    const minutes = totalFocusMinutes % 60;
    return { totalCompleted, totalXp, hours, minutes, currentStreak: stats.currentStreak };
  };

  const rangeStats = getStatsByRange(timeRange);

  const xpData = last7Days.map(date => {
    const dayHistory = history.filter(h => new Date(h.completedAt).toDateString() === date);
    const xp = dayHistory.reduce((acc, h) => acc + (h.xpEarned || 0), 0);
    return { name: new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }), xp };
  });

  const pomoData = last7Days.map(date => {
    const dayHistory = history.filter(h => new Date(h.completedAt).toDateString() === date);
    const focusMinutes = dayHistory.reduce((total, h) => total + getDurationMinutes(h), 0);
    return { name: new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }), minutes: focusMinutes };
  });

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) { case 'today': return '今日'; case 'week': return '本周'; case 'quarter': return '本季度'; case 'year': return '本年度'; case 'all': return '总共'; default: return '今日'; }
  };

  return (
    <div className="space-y-5 pb-6">
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black uppercase tracking-widest">{getTimeRangeLabel(timeRange)}数据</h2>
          <button onClick={() => setIsTimeRangeModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-full shadow-sm hover:bg-surface-container-high transition-colors">
            <SettingsIcon className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold uppercase tracking-widest">时间范围</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-primary"><Zap className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">累计经验</span></div>
            <div className="flex items-baseline gap-1"><span className="text-3xl font-black tracking-tighter">{rangeStats.totalXp}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">XP</span></div>
          </div>
          <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-500"><Flame className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">当前连击</span></div>
            <div className="flex items-baseline gap-1"><span className="text-3xl font-black tracking-tighter">{rangeStats.currentStreak}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">天</span></div>
          </div>
          <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-500"><CheckCircle2 className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">已完任务</span></div>
            <div className="flex items-baseline gap-1"><span className="text-3xl font-black tracking-tighter">{rangeStats.totalCompleted}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">个</span></div>
          </div>
          <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-violet-500"><Timer className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">专注时长</span></div>
            <div className="flex items-baseline gap-1"><span className="text-3xl font-black tracking-tighter">{rangeStats.hours}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">h {rangeStats.minutes}m</span></div>
          </div>
        </div>
      </div>

      <section className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1"><h3 className="text-sm font-black uppercase tracking-widest">经验趋势</h3><p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">最近 7 天的 XP 获取情况</p></div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div className="h-48 w-full relative">
          <button onClick={() => setCurrentDayOffset(prev => prev - 1)} className="absolute left-[-30px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors z-10"><ChevronLeft className="w-4 h-4 text-primary" /></button>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-container-highest)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--on-surface-variant)' }} dy={10} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface-container-lowest)', borderRadius: '16px', border: '1px solid var(--outline-variant)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold', color: 'var(--on-surface)' }} />
              <Line type="monotone" dataKey="xp" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: 'var(--surface-container-lowest)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
          <button onClick={() => setCurrentDayOffset(prev => prev + 1)} className="absolute right-[-30px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors z-10"><ChevronRight className="w-4 h-4 text-primary" /></button>
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1"><h3 className="text-sm font-black uppercase tracking-widest">专注分布</h3><p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">每日专注时长记录</p></div>
          <Activity className="w-5 h-5 text-violet-500" />
        </div>
        <div className="h-48 w-full relative">
          <button onClick={() => setCurrentDayOffset(prev => prev - 1)} className="absolute left-[-27px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors z-10"><ChevronLeft className="w-4 h-4 text-violet-500" /></button>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pomoData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--on-surface-variant)' }} dy={10} />
              <YAxis hide />
              <Tooltip cursor={{ fill: 'var(--surface-container-low)' }} contentStyle={{ backgroundColor: 'var(--surface-container-lowest)', borderRadius: '16px', border: '1px solid var(--outline-variant)', fontSize: '10px', fontWeight: 'bold', color: 'var(--on-surface)' }} formatter={(value) => [`${value} 分钟`, '专注时长']} />
              <Bar dataKey="minutes" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={() => setCurrentDayOffset(prev => prev + 1)} className="absolute right-[-27px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors z-10"><ChevronRight className="w-4 h-4 text-violet-500" /></button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-500"><Trophy className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Bingo 连线</span></div>
          <div className="flex items-baseline gap-1"><span className="text-2xl font-black tracking-tighter">{stats.bingosCount}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">次</span></div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary"><Target className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">金色任务</span></div>
          <div className="flex items-baseline gap-1"><span className="text-2xl font-black tracking-tighter">{stats.goldenTilesCompleted}</span><span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">个</span></div>
        </div>
      </div>

      <TimeRangeModal isOpen={isTimeRangeModalOpen} onClose={() => setIsTimeRangeModalOpen(false)} timeRange={timeRange} onSelect={setTimeRange} />
    </div>
  );
}

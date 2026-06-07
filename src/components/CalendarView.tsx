import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CalendarIcon, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { CollapsibleHistorySection } from './CollapsibleHistorySection';
import type { HistoryEntry } from '../types';

export function CalendarView({ history, onBackToToday, onDeleteEntry, onEditEntry }: { history: HistoryEntry[], onBackToToday: () => void, onDeleteEntry: (id: string) => void, onEditEntry: (id: string) => void }) {
  const [subTab, setSubTab] = useState<'calendar' | 'history'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const getTasksForDate = (date: Date) => history.filter(entry => isSameDay(new Date(entry.completedAt), date));

  const selectedTasks = getTasksForDate(selectedDate);

  const getHeatmapColor = (date: Date) => {
    const count = getTasksForDate(date).length;
    if (count === 0) return 'bg-surface-container-low';
    if (count < 3) return 'bg-primary/20';
    if (count < 6) return 'bg-primary/40';
    if (count < 9) return 'bg-primary/70';
    return 'bg-primary';
  };

  const historyByDate = history.reduce((acc, entry) => {
    const dateStr = new Date(entry.completedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);

  const sortedHistoryDates = Object.keys(historyByDate).sort((a, b) => {
    const dateA = new Date(historyByDate[a][0].completedAt);
    const dateB = new Date(historyByDate[b][0].completedAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-5">
      <div className="flex bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant">
        <button onClick={() => setSubTab('calendar')} className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", subTab === 'calendar' ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface")}>
          日历
        </button>
        <button onClick={() => setSubTab('history')} className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", subTab === 'history' ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface")}>
          历史
        </button>
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'calendar' ? (
          <motion.div key="calendar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月</h1>
                  <p className="text-on-surface-variant text-sm font-medium">{history.length > 0 ? '状态火热！' : '开始记录你的第一天吧'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-90"><ChevronLeft className="w-6 h-6" /></button>
                  <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-90"><ChevronRight className="w-6 h-6" /></button>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant shadow-sm">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Info className="w-5 h-5 text-primary" />
                  <span className="font-bold text-sm">月度概览</span>
                </div>
                <div className="grid grid-cols-7 mb-4">
                  {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                    <span key={d} className="text-center text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, idx) => (
                    <div key={idx} onClick={() => day && setSelectedDate(day)} className={cn("aspect-square relative flex flex-col items-center justify-center text-sm font-bold cursor-pointer transition-all rounded-xl", !day && "invisible", day && isSameDay(day, selectedDate) && "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest", day && getHeatmapColor(day))}>
                      {day?.getDate().toString().padStart(2, '0')}
                      {day && isSameDay(day, new Date()) && <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-center">
                  <button onClick={onBackToToday} className="bg-surface-container-low text-primary px-6 py-2.5 rounded-full font-bold text-[11px] tracking-wider uppercase active:scale-95 transition-all flex items-center gap-2 border border-outline-variant">
                    <CalendarIcon className="w-4 h-4" /> 返回今天
                  </button>
                </div>
              </div>
            </section>
            <CollapsibleHistorySection dateStr={selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })} tasks={selectedTasks} defaultExpanded={true} onDeleteEntry={onDeleteEntry} onEditEntry={onEditEntry} />
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            {sortedHistoryDates.length > 0 ? (
              sortedHistoryDates.map(dateStr => (
                <CollapsibleHistorySection key={dateStr} dateStr={dateStr} tasks={historyByDate[dateStr]} defaultExpanded={false} onDeleteEntry={onDeleteEntry} onEditEntry={onEditEntry} />
              ))
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="inline-block p-6 rounded-full bg-surface-container-low text-on-surface-variant/20"><CalendarIcon className="w-10 h-10" /></div>
                <p className="text-on-surface-variant/40 font-bold text-sm">暂无历史记录</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

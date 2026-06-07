import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Timer, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { HistoryItem } from './HistoryItem';
import type { HistoryEntry } from '../types';

type CollapsibleHistorySectionProps = {
  dateStr: string;
  tasks: HistoryEntry[];
  defaultExpanded?: boolean;
  onDeleteEntry?: (id: string) => void;
  onEditEntry?: (id: string) => void;
  key?: string;
};

export function CollapsibleHistorySection({ dateStr, tasks, defaultExpanded = false, onDeleteEntry, onEditEntry }: CollapsibleHistorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group active:opacity-70 transition-all"
      >
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold">{dateStr}</h2>
          <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tasks.length} 任务完成
          </span>
        </div>
        <div className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-transform duration-300",
          isExpanded ? "rotate-180" : "rotate-0"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            {tasks.length > 0 ? (
              tasks.map(entry => (
                <HistoryItem
                  key={entry.id}
                  icon={entry.type === 'pomodoro' ? <Timer className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  title={entry.taskName + (entry.xpEarned ? ` (+${entry.xpEarned} XP)` : '')}
                  time={new Date(entry.completedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  duration={entry.duration}
                  onDelete={() => onDeleteEntry?.(entry.id)}
                  onEdit={() => onEditEntry?.(entry.id)}
                />
              ))
            ) : (
              <div className="text-center py-6 text-on-surface-variant/40 font-bold text-sm italic">
                这一天没有完成的任务记录
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

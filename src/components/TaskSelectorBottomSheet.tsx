import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { BottomSheet } from './Modal';
//  from '../types';

export function TaskSelectorBottomSheet({
  isOpen,
  onClose,
  tasks,
  selectedTask,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  tasks: { id: string; name: string; difficulty?: string; priority?: string; xpValue?: number }[];
  selectedTask: string;
  onSelect: (taskName: string) => void;
}) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="z-[110]">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tight uppercase text-on-surface">选择专注任务</h3>
          <motion.button
            onClick={onClose}
            className="p-3 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-low"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-4 pt-8">
          {tasks.map((task, index) => (
            <motion.button
              key={task.id}
              onClick={() => {
                onSelect(task.name);
                onClose();
              }}
              className={cn(
                "w-full p-8 rounded-2xl border text-left transition-all flex items-center justify-between group shadow-sm",
                selectedTask === task.name
                  ? "bg-primary/10 border-primary/30 shadow-primary/10"
                  : "bg-surface-container-low border-outline-variant hover:border-primary/40 hover:shadow-md"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-2">
                <span className="text-base font-black text-on-surface group-hover:text-primary transition-colors">{task.name}</span>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array((task.difficulty || 'easy') === 'hard' ? 3 : (task.difficulty || 'easy') === 'medium' ? 2 : 1)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-on-surface-variant/40"
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    (task.priority || 'medium') === 'high' ? "bg-red-500" : (task.priority || 'medium') === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                  <motion.span
                    className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    +{task.xpValue || 10} XP
                  </motion.span>
                </div>
              </div>
              {selectedTask === task.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-2 bg-primary/10 rounded-full"
                >
                  <div className="w-5 h-5 bg-primary rounded-full" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

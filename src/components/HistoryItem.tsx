import React from "react";
import { AlarmClock, Timer, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export function HistoryItem({ icon, title, time, duration, onDelete, onEdit }: { icon: React.ReactNode, title: string, time: string, duration?: number, onDelete?: () => void, onEdit?: () => void; key?: React.Key }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center justify-between shadow-sm active:bg-surface-container-low transition-colors group relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-surface-container-low text-primary flex items-center justify-center rounded-2xl">
          {icon}
        </div>
        <div>
          <p className="font-bold text-sm">{title}</p>
          <div className="text-on-surface-variant text-[11px] flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1">
              <AlarmClock className="w-3 h-3" /> {time}
            </span>
            {duration && duration > 0 && (
              <span className="flex items-center gap-1">
                <Timer className="w-3 h-3" /> {duration}分钟
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 relative z-20">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onEdit) onEdit();
            }}
            className="p-2 text-on-surface-variant/80 hover:text-blue-500 transition-colors cursor-pointer relative z-30"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onDelete) onDelete();
            }}
            className="p-2 text-on-surface-variant/80 hover:text-red-500 transition-colors cursor-pointer relative z-30"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
      </div>
    </div>
  );
}

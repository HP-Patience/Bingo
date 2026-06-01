import React from "react";
import { cn } from '../lib/utils';

export function SettingsButton({ icon, label, variant = 'default', onClick }: { icon: React.ReactNode, label: string, variant?: 'default' | 'danger', onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98] border shadow-sm",
        variant === 'danger'
          ? "bg-surface-container-lowest border-red-100 text-red-500 hover:bg-red-50"
          : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-low"
      )}
    >
      <span className="font-bold text-sm">{label}</span>
      <div className={cn(variant === 'danger' ? "text-red-400" : "text-on-surface-variant/60")}>
        {icon}
      </div>
    </button>
  );
}

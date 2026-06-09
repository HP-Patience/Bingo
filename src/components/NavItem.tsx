import React from "react";
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center px-1.5 py-1 rounded-xl transition-all duration-300 active:scale-90",
        isActive ? "bg-surface-container-low text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low/50"
      )}
    >
      <div className={cn("transition-all duration-300", isActive && "scale-110")}>
        {icon}
      </div>
      <span className="text-[9px] font-semibold mt-0.5 tracking-wide">{label}</span>
      {isActive && (
        <motion.div
          layoutId="nav-active"
          className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
        />
      )}
    </button>
  );
}

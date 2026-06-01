import React from "react";
export function ToolbarItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group active:scale-90 transition-all"
    >
      <div className="text-on-surface-variant group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-tighter">{label}</span>
    </button>
  );
}

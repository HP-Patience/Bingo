import React from "react";
export function ToolbarItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 group active:scale-90 transition-all"
    >
      <div className="text-on-surface-variant group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-on-surface-variant/70 uppercase tracking-tighter">{label}</span>
    </button>
  );
}

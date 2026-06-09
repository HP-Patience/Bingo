import React from "react";
export function ToolbarItem({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-0 group active:scale-90 transition-all rounded-lg px-2 py-1.5 min-w-0"
    >
      <div className="text-on-surface-variant group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-on-surface-variant/70 tracking-wide">{label}</span>
    </button>
  );
}

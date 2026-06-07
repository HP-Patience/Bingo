import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
};

export function Select({ value, onChange, options, className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const selected = options.find(o => o.value === value);

  const updatePosition = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuStyle({
      position: 'fixed',
      left: rect.left,
      top: rect.bottom + 4,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handle = () => updatePosition();
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
    };
  }, [isOpen, updatePosition]);

  const close = useCallback(() => {
    setIsOpen(false);
    btnRef.current?.blur();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[data-select-menu]')
      ) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  const toggle = () => {
    if (isOpen) { close(); return; }
    updatePosition();
    setIsOpen(true);
  };

  const selectOption = (v: string) => {
    onChange(v);
    close();
  };

  return (
    <div className={className}>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold flex items-center justify-between gap-2"
      >
        <span className="truncate">{selected?.label || value}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-on-surface-variant/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <motion.div
          data-select-menu
          initial={{ opacity: 0, y: -4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.96 }}
          transition={{ duration: 0.1 }}
          style={menuStyle}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl overflow-hidden"
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectOption(opt.value); }}
              className={`w-full px-5 py-3 text-sm font-bold text-left transition-colors ${
                opt.value === value
                  ? 'text-primary bg-surface-container-low'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </motion.div>,
        document.body
      )}
    </div>
  );
}

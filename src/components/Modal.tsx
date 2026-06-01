import React, { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** 底部按钮区域 */
  footer?: React.ReactNode;
  /** 点击遮罩是否关闭，默认 true */
  closeOnBackdrop?: boolean;
};

export function Modal({ isOpen, onClose, title, children, footer, closeOnBackdrop = true }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'Tab' && contentRef.current) {
      const focusable = contentRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            ref={contentRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-10 border border-outline-variant shadow-2xl space-y-8"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {(title || closeOnBackdrop) && (
              <div className="flex items-center justify-between">
                {title && <h3 className="text-xl font-black tracking-tight uppercase">{title}</h3>}
                <button
                  onClick={onClose}
                  className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="space-y-6">{children}</div>
            {footer && <div className="flex gap-3 pt-2">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** 'default' | 'danger' */
  variant?: 'default' | 'danger';
  icon?: React.ReactNode;
};

export function ConfirmDialog({
  isOpen, onClose, title, message,
  confirmLabel = '确认', cancelLabel = '取消',
  onConfirm, variant = 'default', icon
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdrop={false}>
      <div className="text-center space-y-2">
        {icon && (
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            variant === 'danger' ? 'bg-red-500/10' : 'bg-primary/10'
          }`}>
            {icon}
          </div>
        )}
        <h3 className="text-xl font-black tracking-tight uppercase">{title}</h3>
        <p className="text-on-surface-variant text-sm font-medium">{message}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
        >
          {cancelLabel}
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] ${
            variant === 'danger'
              ? 'bg-red-500 text-white'
              : 'bg-primary text-on-primary'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

/** 底部滑入面板 */
type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[3rem] p-8 border border-outline-variant shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

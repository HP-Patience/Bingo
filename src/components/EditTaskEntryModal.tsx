import { Modal } from './Modal';
import type { HistoryEntry } from '../types';

export function EditTaskEntryModal({
  isOpen,
  onClose,
  entry,
  editForm,
  onFormChange,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  entry: HistoryEntry | null;
  editForm: { time: string; duration: number; note: string };
  onFormChange: (updates: Partial<{ time: string; duration: number; note: string }>) => void;
  onSave: () => void;
}) {
  if (!entry) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑任务">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">任务名称</label>
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold">
            {entry.taskName}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">完成时间</label>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const timeStr = now.toTimeString().substring(0, 8);
                onFormChange({ time: timeStr });
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              现在
            </button>
          </div>
          <input
            type="time"
            step="1"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            value={editForm.time}
            onChange={(e) => onFormChange({ time: e.target.value })}
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">耗时 (分钟)</label>
          <input
            type="number"
            min="0"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            value={editForm.duration}
            onChange={(e) => onFormChange({ duration: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">备注</label>
          <textarea
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
            value={editForm.note}
            onChange={(e) => onFormChange({ note: e.target.value })}
            placeholder="添加任务备注..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-semibold tracking-wide text-[11px]"
        >
          取消
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-semibold tracking-wide text-[11px]"
        >
          保存
        </button>
      </div>
    </Modal>
  );
}

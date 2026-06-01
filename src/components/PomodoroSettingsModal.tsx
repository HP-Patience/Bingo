import { Modal } from './Modal';

export function PomodoroSettingsModal({
  isOpen,
  onClose,
  durations,
  onDurationChange,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  durations: { work: number; shortBreak: number; longBreak: number };
  onDurationChange: (type: 'work' | 'shortBreak' | 'longBreak', value: number) => void;
  onSave: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="番茄钟设置" className="z-[110]" contentClassName="max-w-md p-10 space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">专注时长 (分钟)</label>
          <input
            type="number"
            min="1"
            max="60"
            value={Math.round(durations.work / 60)}
            onChange={(e) => onDurationChange('work', parseInt(e.target.value) || 25)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">短休时长 (分钟)</label>
          <input
            type="number"
            min="1"
            max="30"
            value={Math.round(durations.shortBreak / 60)}
            onChange={(e) => onDurationChange('shortBreak', parseInt(e.target.value) || 5)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">长休时长 (分钟)</label>
          <input
            type="number"
            min="1"
            max="60"
            value={Math.round(durations.longBreak / 60)}
            onChange={(e) => onDurationChange('longBreak', parseInt(e.target.value) || 15)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-primary text-on-primary py-4 rounded-2xl font-semibold tracking-wide text-[11px]"
      >
        保存设置
      </button>
    </Modal>
  );
}

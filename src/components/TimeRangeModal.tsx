import { Modal } from './Modal';

export type TimeRange = 'today' | 'week' | 'quarter' | 'year' | 'all';

export function TimeRangeModal({
  isOpen,
  onClose,
  timeRange,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  timeRange: TimeRange;
  onSelect: (range: TimeRange) => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="选择时间范围">
      <div className="space-y-4">
        {([
          { value: 'today' as const, label: '今日' },
          { value: 'week' as const, label: '本周' },
          { value: 'quarter' as const, label: '本季度' },
          { value: 'year' as const, label: '本年度' },
          { value: 'all' as const, label: '总共' },
        ]).map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
            className={`w-full py-3.5 px-6 rounded-2xl text-left font-bold transition-colors ${
              timeRange === option.value
                ? 'bg-violet-100 text-violet-700'
                : 'bg-surface-container-low hover:bg-surface-container-high'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 px-6 rounded-2xl font-bold bg-surface-container-low hover:bg-surface-container-high transition-colors"
        >
          取消
        </button>
      </div>
    </Modal>
  );
}

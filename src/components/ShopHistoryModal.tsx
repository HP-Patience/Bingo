import { Modal } from './Modal';
import { ShopItemIcon } from './ShopItemIcon';
import type { ShopHistoryEntry } from '../types';

export function ShopHistoryModal({
  isOpen,
  onClose,
  history,
}: {
  isOpen: boolean;
  onClose: () => void;
  history: ShopHistoryEntry[];
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="购买记录" contentClassName="p-8 pt-4 space-y-4 max-h-[80vh] overflow-hidden">
      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-on-surface-variant font-medium">还没有购买记录</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center text-primary">
                  <ShopItemIcon name={entry.itemIcon} className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm">{entry.itemName}</span>
                  <p className="text-[10px] text-on-surface-variant font-medium">
                    {new Date(entry.timestamp).toLocaleString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-1">
                <span className="font-black text-lg text-secondary">
                  -{entry.cost}
                </span>
                <span className="text-[11px] font-semibold text-secondary/70">金币</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

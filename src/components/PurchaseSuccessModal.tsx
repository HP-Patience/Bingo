import { Modal } from './Modal';
import { ShopItemIcon } from './ShopItemIcon';
import type { ShopItem } from '../types';

export function PurchaseSuccessModal({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  item: ShopItem | null;
}) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="z-[1001]" contentClassName="p-8 text-center space-y-5">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2rem] flex items-center justify-center">
        <ShopItemIcon name={item.icon} className="w-12 h-12 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black tracking-tight">{item.name}</h3>
        <p className="text-sm text-on-surface-variant font-medium">{item.description}</p>
      </div>
      <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant">
        <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">购买成功!</p>
        <p className="text-secondary font-black text-3xl mt-1">-{item.cost}</p>
        <p className="text-on-surface-variant font-bold text-xs mt-1">金币</p>
      </div>
      <button
        onClick={onClose}
        className="w-full py-4 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-widest text-sm active:scale-95 transition-all"
      >
        太棒了
      </button>
    </Modal>
  );
}

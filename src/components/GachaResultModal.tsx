import { Zap, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { Modal } from './Modal';
import type { GachaHistoryEntry } from '../types';

export function GachaResultModal({
  isOpen,
  onClose,
  result,
}: {
  isOpen: boolean;
  onClose: () => void;
  result: GachaHistoryEntry | null;
}) {
  if (!result) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="z-[1001]" contentClassName="p-8 space-y-6">
      <div className="text-center space-y-5">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
          {result.reward.type === 'xp' ? (
            <Zap className="w-10 h-10 text-primary" />
          ) : (
            <Star className="w-10 h-10 text-amber-500" />
          )}
        </div>
        <div>
          <span className={cn(
            "inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3",
            result.reward.rarity === 'legendary' && "bg-yellow-500/15 text-yellow-500",
            result.reward.rarity === 'epic' && "bg-purple-500/15 text-purple-500",
            result.reward.rarity === 'rare' && "bg-blue-500/15 text-blue-500",
            result.reward.rarity === 'common' && "bg-gray-500/15 text-gray-500"
          )}>
            {result.reward.rarity === 'legendary' ? '传说' :
             result.reward.rarity === 'epic' ? '史诗' :
             result.reward.rarity === 'rare' ? '稀有' : '普通'}
          </span>
          <h3 className="text-xl font-black tracking-tight">恭喜获得</h3>
          <p className="text-[11px] text-on-surface-variant font-medium mt-1">{result.poolName}</p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 flex items-center justify-center gap-2">
          <div className={cn(
            "text-4xl font-extrabold tracking-tighter",
            result.reward.type === 'xp' ? 'text-primary' : 'text-amber-500'
          )}>
            +{result.actualValue}
          </div>
          <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            {result.reward.type === 'xp' ? '经验值' : '金币'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest bg-primary text-on-primary hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          确定
        </button>
      </div>
    </Modal>
  );
}

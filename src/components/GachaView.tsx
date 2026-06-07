import { cn } from '../lib/utils';
import { Zap, Circle, HelpCircle } from 'lucide-react';
import type { GachaState } from '../types';

export function GachaView({
  userLevel,
  gachaState,
  onDraw,
  onTabChange,
  showHelp,
  setShowHelp,
}: {
  userLevel: number;
  gachaState: GachaState;
  onDraw: () => void;
  onTabChange: (tab: string) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500';
      case 'epic': return 'text-purple-500';
      case 'rare': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '传说';
      case 'epic': return '史诗';
      case 'rare': return '稀有';
      default: return '普通';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant">
        <button onClick={() => onTabChange('shop')} className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", "text-on-surface-variant hover:text-on-surface")}>
          商店
        </button>
        <button className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", "bg-primary text-on-primary shadow-lg shadow-primary/20")}>
          抽奖
        </button>
      </div>

      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">抽奖奖池</p>
            <h3 className="text-3xl font-extrabold tracking-tighter text-primary mb-2">等级 {userLevel}</h3>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">可用抽奖次数</p>
              <div className="text-4xl font-extrabold tracking-tighter text-primary">{gachaState.availableDraws}</div>
              {gachaState.lastFreeDrawDate === new Date().toISOString().split('T')[0] && !gachaState.freeDrawUsed && gachaState.availableDraws > 0 && (
                <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">含今日免费</span>
              )}
            </div>

            <button onClick={onDraw} disabled={gachaState.availableDraws <= 0} className={cn("w-full py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg", gachaState.availableDraws > 0 ? "bg-primary text-on-primary hover:scale-[1.02] shadow-primary/30" : "bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed")}>
              {gachaState.availableDraws > 0 ? '🎁 开始抽奖' : '升级获取抽奖机会'}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold uppercase tracking-tight">抽奖记录</h2>
          <button onClick={() => setShowHelp(true)} className="p-2 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        {gachaState.history.length > 0 && (
          <div className="space-y-3">
            {gachaState.history.slice(0, 10).map((entry) => (
              <div key={entry.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center text-primary">
                    {entry.reward.type === 'xp' ? <Zap className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className={cn("text-[10px] font-bold uppercase", getRarityColor(entry.reward.rarity))}>{getRarityName(entry.reward.rarity)}</span>
                    <p className="text-[10px] text-on-surface-variant font-medium">{new Date(entry.timestamp).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-lg text-primary w-12 text-right tabular-nums">+{entry.actualValue}</span>
                  <span className="text-[10px] text-on-surface-variant font-bold w-7">{entry.reward.type === 'xp' ? 'XP' : '金币'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

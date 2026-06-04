import { Gift, TrendingUp, Shield, Award } from 'lucide-react';
import { Modal } from './Modal';

export function GachaHelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="抽奖机制说明"
      contentClassName="bg-surface rounded-3xl max-h-[70vh] flex flex-col !p-5 !space-y-2"
    >
      <div className="space-y-3">
        <div className="bg-surface-container-low rounded-2xl p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            抽奖奖池（全等级通用）
          </h3>
          <ul className="text-sm space-y-1 text-on-surface-variant">
            <li className="text-xs text-on-surface-variant/70 mb-2">普通60% / 稀有25% / 史诗10% / 传说5%</li>
            <li className="text-xs">🟢 普通：XP 30-50 / 金币 20-40</li>
            <li className="text-xs">🔵 稀有：XP 80-120 / 金币 65-100</li>
            <li className="text-xs">🟣 史诗：XP 200-300 / 金币 160-240</li>
            <li className="text-xs">🟡 传说：XP 500-800 / 金币 400-650</li>
          </ul>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            获取方式
          </h3>
          <ul className="text-sm space-y-1 text-on-surface-variant">
            <li>• 每升1级获得1次抽奖</li>
            <li>• 每日登录赠送1次免费抽奖</li>
          </ul>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            保底机制
          </h3>
          <ul className="text-sm space-y-1 text-on-surface-variant">
            <li>• 连续3次普通奖励 → 下次必中稀有及以上</li>
            <li>• 连续5次同类型奖励 → 下次必换另一种类型</li>
          </ul>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            奖励类型
          </h3>
          <ul className="text-sm space-y-1 text-on-surface-variant">
            <li>• 经验值（XP）：可用于升级</li>
            <li>• 金币：可在商店购买奖励</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

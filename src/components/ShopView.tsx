import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Settings2, Plus, Edit3, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { ShopItemIcon } from './ShopItemIcon';
import { Modal } from './Modal';
import type { ShopItem, ShopHistoryEntry } from '../types';

export function ShopView({
  items, userBalance, userLevel,
  onBuyItem, onAddItem, onUpdateItem, onDeleteItem,
  onTabChange, shopHistory, showHistory, setShowHistory,
}: {
  items: ShopItem[];
  userBalance: number;
  userLevel: number;
  onBuyItem: (item: ShopItem) => void;
  onAddItem: (item: Omit<ShopItem, 'id'>) => void;
  onUpdateItem: (item: ShopItem) => void;
  onDeleteItem: (id: string) => void;
  onTabChange: (tab: string) => void;
  shopHistory: ShopHistoryEntry[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}) {
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Omit<ShopItem, 'id'>>({ name: '', description: '', cost: 10, icon: 'sparkles', category: 'reward' });

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      onAddItem(newItem);
      setNewItem({ name: '', description: '', cost: 10, icon: 'sparkles', category: 'reward' });
      setIsAdding(false);
    }
  };

  const handleUpdateItem = () => {
    if (editingItem && editingItem.name.trim()) { onUpdateItem(editingItem); setEditingItem(null); }
  };

  return (
    <div className="space-y-10">
      <div className="flex bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant">
        <button className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", "bg-primary text-on-primary shadow-lg shadow-primary/20")}>商店</button>
        <button onClick={() => onTabChange('gacha')} className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", "text-on-surface-variant hover:text-on-surface")}>抽奖</button>
      </div>
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex justify-between items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">当前金币</p><h3 className="text-5xl font-extrabold tracking-tighter text-primary">{userBalance.toLocaleString()}</h3><p className="text-on-surface-variant font-bold text-sm mt-1">可使用金币</p></div>
          <div className="flex gap-2">
            <button onClick={() => setShowHistory(true)} className="p-4 rounded-2xl bg-surface-container-low text-on-surface-variant hover:text-primary transition-all active:scale-95" title="查看购买记录"><History className="w-6 h-6" /></button>
            <button onClick={() => setIsManageMode(!isManageMode)} className={cn("p-4 rounded-2xl transition-all active:scale-95", isManageMode ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant")}><Settings2 className="w-6 h-6" /></button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between min-h-[32px]">
          <AnimatePresence mode="wait">
            <motion.h2
              key={isManageMode ? 'manage' : 'shop'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-lg font-bold uppercase tracking-tight"
            >{isManageMode ? '管理商店' : '奖励商店'}</motion.h2>
          </AnimatePresence>
          <div className="min-h-[30px] flex items-center">
            <AnimatePresence mode="wait">
              {isManageMode && (
                <motion.button
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  onClick={() => setIsAdding(true)}
                  className="bg-primary text-on-primary px-3.5 py-1.5 rounded-full font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5"
                ><Plus className="w-3 h-3" /> 新增商品</motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {items.filter(item => !item.levelRequirement || userLevel >= item.levelRequirement).map(item => (
            <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0"><ShopItemIcon name={item.icon} className="w-7 h-7" /></div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    {item.levelRequirement && item.levelRequirement > 1 && <span className="text-[11px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold shrink-0">等级 {item.levelRequirement}+</span>}
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium line-clamp-2 max-w-[100px]">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 min-w-[76px] justify-end">
                <AnimatePresence mode="wait">
                  {isManageMode ? (
                    <motion.div
                      key="manage"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="flex items-center gap-2"
                    >
                      <button onClick={() => setEditingItem(item)} className="p-2 text-on-surface-variant/40 hover:text-primary transition-colors outline-none"><Edit3 className="w-5 h-5" /></button>
                      <button onClick={() => onDeleteItem(item.id)} className="p-2 text-on-surface-variant/40 hover:text-red-500 transition-colors outline-none"><Trash2 className="w-5 h-5" /></button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="buy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                      <button onClick={() => onBuyItem(item)} disabled={userBalance < item.cost} className={cn("px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95", userBalance >= item.cost ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed")}>{item.cost} 金币</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {(isAdding || editingItem) && (
          <Modal isOpen={true} onClose={() => { setIsAdding(false); setEditingItem(null); }} className="z-[100]" contentClassName="p-8 space-y-6">
            <h3 className="text-xl font-black tracking-tight uppercase">{isAdding ? '新增商品' : '编辑商品'}</h3>
            <div className="space-y-4">
              <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">商品名称</label><input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" value={isAdding ? newItem.name : editingItem?.name || ''} onChange={(e) => isAdding ? setNewItem({...newItem, name: e.target.value}) : setEditingItem(editingItem ? {...editingItem, name: e.target.value} : null)} /></div>
              <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">描述</label><input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" value={isAdding ? newItem.description : editingItem?.description || ''} onChange={(e) => isAdding ? setNewItem({...newItem, description: e.target.value}) : setEditingItem(editingItem ? {...editingItem, description: e.target.value} : null)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">价格 (金币)</label><input type="number" className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" value={isAdding ? newItem.cost : editingItem?.cost || 0} onChange={(e) => isAdding ? setNewItem({...newItem, cost: parseInt(e.target.value)}) : setEditingItem(editingItem ? {...editingItem, cost: parseInt(e.target.value)} : null)} /></div>
                <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">图标</label><select className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none" value={isAdding ? newItem.icon : editingItem?.icon || 'sparkles'} onChange={(e) => isAdding ? setNewItem({...newItem, icon: e.target.value}) : setEditingItem(editingItem ? {...editingItem, icon: e.target.value} : null)}><option value="cookie">饼干</option><option value="film">电影</option><option value="gamepad-2">游戏</option><option value="heart">爱心</option><option value="book-open">书籍</option><option value="sparkles">闪耀</option></select></div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setIsAdding(false); setEditingItem(null); }} className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-semibold tracking-wide text-[11px]">取消</button>
              <button onClick={isAdding ? handleAddItem : handleUpdateItem} className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-semibold tracking-wide text-[11px]">保存</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

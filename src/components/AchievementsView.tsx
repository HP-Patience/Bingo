import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PlusCircle, CalendarIcon, Edit3, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { AchievementIcon } from './AchievementIcon';
import { StatsView } from './StatsView';
import { Modal } from './Modal';
import type { Achievement, Stats, HistoryEntry } from '../types';
import type { TimeRange } from './TimeRangeModal';

export function AchievementsView({
  achievements, stats, history,
  timeRange, setTimeRange, isTimeRangeModalOpen, setIsTimeRangeModalOpen,
  onAddCustomAchievement, onDeleteAchievement, onToggleAchievement, onUpdateAchievement,
  initialViewMode,
}: {
  achievements: Achievement[];
  stats: Stats;
  history: HistoryEntry[];
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  isTimeRangeModalOpen: boolean;
  setIsTimeRangeModalOpen: (open: boolean) => void;
  onAddCustomAchievement: (title: string, requirement: string, icon: string) => void;
  onDeleteAchievement: (id: string) => void;
  onToggleAchievement: (id: string) => void;
  onUpdateAchievement: (id: string, updates: Partial<Achievement>) => void;
  initialViewMode?: 'achievements' | 'stats';
}) {
  const [viewMode, setViewMode] = useState<'achievements' | 'stats'>(initialViewMode || 'achievements');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customRequirement, setCustomRequirement] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editRequirement, setEditRequirement] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const handleAddCustom = () => {
    if (customTitle.trim() && customRequirement.trim()) {
      onAddCustomAchievement(customTitle.trim(), customRequirement.trim(), 'star');
      setCustomTitle(''); setCustomRequirement(''); setIsAddingCustom(false);
    }
  };

  const handleStartEdit = (achievement: Achievement) => {
    setEditTitle(achievement.title); setEditRequirement(achievement.requirement || ''); setEditIcon(achievement.icon); setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedAchievement && editTitle.trim()) {
      onUpdateAchievement(selectedAchievement.id, { title: editTitle.trim(), requirement: editRequirement.trim(), icon: editIcon });
      setSelectedAchievement({ ...selectedAchievement, title: editTitle.trim(), requirement: editRequirement.trim(), icon: editIcon });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (selectedAchievement) { onDeleteAchievement(selectedAchievement.id); setSelectedAchievement(null); setIsEditing(false); }
  };

  const handleToggle = () => {
    if (selectedAchievement) { onToggleAchievement(selectedAchievement.id); setSelectedAchievement({ ...selectedAchievement, unlocked: !selectedAchievement.unlocked }); }
  };

  const coreAchievements = achievements.filter(a => !a.isCustom);
  const customAchievements = achievements.filter(a => a.isCustom);
  const availableIcons = ['star', 'zap', 'alarm-clock', 'trophy', 'egg', 'focus', 'sun', 'moon', 'heart', 'sparkles', 'cookie', 'film', 'gamepad-2', 'book-open'];

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="flex bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant">
          <button onClick={() => setViewMode('achievements')} className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", viewMode === 'achievements' ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface")}>成就</button>
          <button onClick={() => setViewMode('stats')} className={cn("flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all", viewMode === 'stats' ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface")}>统计信息</button>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {viewMode === 'achievements' ? (
          <motion.div key="achievements" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-tight">核心成就</h2>
                <div className="bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant"><span className="text-[10px] font-bold text-on-surface-variant">已解锁 {coreAchievements.filter(a => a.unlocked).length} / {coreAchievements.length}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {coreAchievements.map(achievement => (
                  <button key={achievement.id} onClick={() => setSelectedAchievement(achievement)} className={cn("flex flex-col items-center gap-3 transition-all active:scale-95", !achievement.unlocked && "opacity-30")}>
                    <div className={cn("w-full aspect-square rounded-[1.5rem] flex flex-col items-center justify-center relative transition-all p-3", achievement.unlocked ? "bg-surface-container-lowest border border-outline-variant shadow-sm" : "bg-surface-container-low border border-outline-variant/50")}>
                      <AchievementIcon name={achievement.icon} className="w-10 h-10 text-primary mb-2" />
                      {achievement.level && <div className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">等级 {achievement.level}</div>}
                      <span className="text-[11px] text-on-surface-variant/60 text-center leading-tight px-1">{achievement.description}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-center leading-tight px-1">{achievement.title}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-tight">自定义成就</h2>
                <div className="bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant"><span className="text-[10px] font-bold text-on-surface-variant">已达成 {customAchievements.filter(a => a.unlocked).length} / {customAchievements.length}</span></div>
              </div>
              {customAchievements.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {customAchievements.map(achievement => (
                    <button key={achievement.id} onClick={() => { setSelectedAchievement(achievement); setIsEditing(false); }} className={cn("flex flex-col items-center gap-3 transition-all active:scale-95", !achievement.unlocked && "opacity-30")}>
                      <div className={cn("w-full aspect-square rounded-[1.5rem] flex flex-col items-center justify-center relative transition-all p-3", achievement.unlocked ? "bg-surface-container-lowest border border-outline-variant shadow-sm" : "bg-surface-container-low border border-outline-variant/50")}>
                        <AchievementIcon name={achievement.icon} className="w-10 h-10 text-primary mb-2" />
                        <span className="text-[11px] text-on-surface-variant/60 text-center leading-tight px-1">{achievement.requirement || achievement.description}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-center leading-tight px-1">{achievement.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-surface-container-low/30 rounded-3xl border-2 border-dashed border-outline-variant"><p className="text-on-surface-variant/40 font-bold text-sm italic">暂无自定义成就</p></div>
              )}

              <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-10 text-center space-y-8 relative overflow-hidden">
                <div className="space-y-3"><h3 className="text-2xl font-extrabold tracking-tight uppercase">定义你的成就</h3><p className="text-on-surface-variant text-sm px-6 font-medium">为你的独特个人胜利创建自定义徽章。</p></div>
                {!isAddingCustom ? (
                  <button onClick={() => setIsAddingCustom(true)} className="w-full bg-primary text-on-primary py-5 rounded-2xl font-semibold tracking-wide text-[11px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-primary/20"><PlusCircle className="w-5 h-5" /> 创建自定义成就</button>
                ) : (
                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">成就名称</label><input type="text" placeholder="成就名称..." className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} autoFocus /></div>
                    <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">获得条件</label><input type="text" placeholder="获得条件 (例如: 连续3天早起)..." className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" value={customRequirement} onChange={(e) => setCustomRequirement(e.target.value)} /></div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setIsAddingCustom(false)} className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-semibold tracking-wide text-[11px]">取消</button>
                      <button onClick={handleAddCustom} className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-semibold tracking-wide text-[11px]">创建</button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="stats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <StatsView stats={stats} history={history} timeRange={timeRange} setTimeRange={setTimeRange} isTimeRangeModalOpen={isTimeRangeModalOpen} setIsTimeRangeModalOpen={setIsTimeRangeModalOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAchievement && (
          <Modal isOpen={true} onClose={() => { setSelectedAchievement(null); setIsEditing(false); }} className="z-[100]">
            {isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tight uppercase">编辑自定义成就</h3>
                  <button onClick={() => setIsEditing(false)} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">图标</label>
                    <div className="flex flex-wrap gap-2 p-2 bg-surface-container-low rounded-2xl border border-outline-variant max-h-32 overflow-y-auto">
                      {availableIcons.map(iconName => (
                        <button key={iconName} onClick={() => setEditIcon(iconName)} className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", editIcon === iconName ? "bg-primary text-on-primary" : "hover:bg-surface-container-highest text-on-surface-variant")}>
                          <AchievementIcon name={iconName} className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">成就名称</label><input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">获得条件</label><input type="text" className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" value={editRequirement} onChange={(e) => setEditRequirement(e.target.value)} /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setIsEditing(false)} className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-semibold tracking-wide text-[11px]">取消</button>
                  <button onClick={handleSaveEdit} className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-semibold tracking-wide text-[11px]">保存</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 bg-primary/10 rounded-[2rem] flex items-center justify-center"><AchievementIcon name={selectedAchievement.icon} className="w-16 h-16 text-primary" /></div>
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black tracking-tight uppercase">{selectedAchievement.title}</h3>
                    <p className="text-on-surface-variant font-medium text-sm leading-relaxed">{selectedAchievement.description}</p>
                    {selectedAchievement.requirement && <p className="text-primary font-bold text-xs uppercase tracking-widest">条件: {selectedAchievement.requirement}</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
                    <div className="flex justify-between items-center mb-3"><span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">解锁进度</span><span className="text-[10px] font-bold text-primary">{selectedAchievement.unlocked ? '100%' : '0%'}</span></div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-1000" style={{ width: selectedAchievement.unlocked ? '100%' : '0%' }} /></div>
                  </div>
                  {selectedAchievement.unlockedAt && <div className="flex items-center gap-3 px-2"><CalendarIcon className="w-4 h-4 text-on-surface-variant" /><span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">解锁于 {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}</span></div>}
                </div>
                <div className="space-y-3">
                  {selectedAchievement.isCustom && (
                    <div className="flex gap-3">
                      <button onClick={handleToggle} className={cn("flex-1 py-4 rounded-2xl font-semibold tracking-wide text-[11px] active:scale-95 transition-all", selectedAchievement.unlocked ? "bg-surface-container-low text-on-surface" : "bg-primary text-on-primary shadow-lg shadow-primary/20")}>{selectedAchievement.unlocked ? '取消达成' : '标记达成'}</button>
                      <button onClick={() => handleStartEdit(selectedAchievement)} className="bg-surface-container-low text-on-surface p-4 rounded-2xl active:scale-95 transition-all"><Edit3 className="w-5 h-5" /></button>
                      <button onClick={handleDelete} className="bg-red-500/10 text-red-500 p-4 rounded-2xl active:scale-95 transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  )}
                  <button onClick={() => setSelectedAchievement(null)} className="w-full bg-surface-container-low text-on-surface py-4 rounded-2xl font-semibold tracking-wide text-[11px] active:scale-95 transition-all">关闭</button>
                </div>
              </>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { TaskDifficulty, TaskPriority } from './types';

const calculateXP = (difficulty: TaskDifficulty, priority: TaskPriority): number => {
  const baseXP = difficulty === 'hard' ? 30 : difficulty === 'medium' ? 20 : 10;
  const priorityBonus = priority === 'high' ? 10 : priority === 'medium' ? 5 : 0;
  return baseXP + priorityBonus;
};
import { 
  Grid, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Trophy, 
  Settings as SettingsIcon,
  Bolt,
  PlusCircle,
  FolderPlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Droplets,
  Dumbbell,
  BookOpen,
  CheckCircle2,
  Shuffle,
  SortAsc,
  X,
  Palette,
  Database,
  FileUp,
  FileDown,
  Trash2,
  LayoutGrid,
  Zap,
  Moon,
  Sun,
  Star,
  AlarmClock,
  Egg,
  Focus,
  Edit2,
  Edit3,
  Settings2,
  Plus,
  LogOut,
  UserCircle,
  Mail,
  Info,
  ShoppingBag,
  Cookie,
  Film,
  Gamepad2,
  Heart,
  Sparkles,
  Timer,
  Play,
  Pause,
  RotateCcw,
  BarChart2,
  Clock,
  Coffee,
  TrendingUp,
  Activity,
  PieChart,
  Target,
  Flame,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { cn } from './lib/utils';
import { 
  INITIAL_TASK_GROUPS, 
  INITIAL_BINGO_TILES, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_STATS, 
  INITIAL_SETTINGS,
  INITIAL_SHOP_ITEMS
} from './constants';
import { TaskGroup, BingoTile, Achievement, Stats, Settings, Theme, HistoryEntry, User, ShopItem, Task } from './types';

// --- Components ---

const Layout = ({ children, activeTab, onTabChange, user, onLoginClick, theme }: { children: React.ReactNode, activeTab: string, onTabChange: (tab: string) => void, user: User | null, onLoginClick: () => void, theme: Theme }) => {
  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto relative overflow-hidden" data-theme={theme}>
      {/* Top App Bar */}
      <header className="fixed top-0 w-full max-w-md z-50 glass border-b border-outline-variant">
        <div className="flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-2 text-primary active:scale-95 transition-all cursor-pointer">
            <Bolt className="w-5 h-5" />
            <span className="font-headline font-bold text-lg uppercase tracking-tight">Life Bingo</span>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-primary uppercase tracking-tighter">LV.{user.level}</span>
                  <div className="w-16 h-1.5 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/30">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-primary">
                  <Zap className="w-3 h-3 fill-primary" />
                  <span className="text-[10px] font-black tracking-tighter">{user.balance}</span>
                </div>
                <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-widest">余额</span>
              </div>
              <button 
                onClick={() => onTabChange('settings')}
                className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-primary/20 active:opacity-70 transition-all cursor-pointer shadow-sm"
              >
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale-[0.2]"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="text-xs font-bold text-primary hover:underline"
            >
              登录/注册
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 glass border-t border-outline-variant rounded-t-[2rem] shadow-2xl">
        <div className="flex justify-around items-center px-4 py-3 pb-8">
          <NavItem 
            icon={<Grid className="w-6 h-6" />} 
            label="今日" 
            isActive={activeTab === 'today'} 
            onClick={() => onTabChange('today')} 
          />
          <NavItem 
            icon={<CheckSquare className="w-6 h-6" />} 
            label="任务" 
            isActive={activeTab === 'tasks'} 
            onClick={() => onTabChange('tasks')} 
          />
          <NavItem 
            icon={<CalendarIcon className="w-6 h-6" />} 
            label="日历" 
            isActive={activeTab === 'calendar'} 
            onClick={() => onTabChange('calendar')} 
          />
          <NavItem 
            icon={<Trophy className="w-6 h-6" />} 
            label="成就" 
            isActive={activeTab === 'achievements'} 
            onClick={() => onTabChange('achievements')} 
          />
          <NavItem 
            icon={<ShoppingBag className="w-6 h-6" />} 
            label="商店" 
            isActive={activeTab === 'shop'} 
            onClick={() => onTabChange('shop')} 
          />
          <NavItem 
            icon={<SettingsIcon className="w-6 h-6" />} 
            label="设置" 
            isActive={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')} 
          />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300 active:scale-90",
        isActive ? "bg-surface-container-low text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low/50"
      )}
    >
      <div className={cn("transition-all duration-300", isActive && "scale-110")}>
        {icon}
      </div>
      <span className="text-[10px] font-bold mt-1 tracking-wider">{label}</span>
      {isActive && (
        <motion.div 
          layoutId="nav-active"
          className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
        />
      )}
    </button>
  );
};

// --- Views ---

const LoginView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    onLogin({
      id: 'user-1',
      username: email.split('@')[0] || '用户',
      email: email || 'user@example.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8z5ltSb7aT8aRGkjwccNY_49vMFNUXiUt1hzVSdx-4j9zQuJeIThqhE-6cdEB42iPpabeiGihMyI7k6-k-SHOvMyPxCTT37ctTLd9ylfCUBWjmiwF06ZQ3r_uuSf1HDo2XIyN3wTA0sq6AsSYT-JYazsKPSyOdhXO4I8PBwEYhBjXVEbJoiSk3cTaxl7aye97QnblO-97kV_hnuu6aaRgGeZsMHa3-wXFzgZrpyZczKEcEbLazmwgZO0K3MarE25AJC7ZgguR4GLU',
      joinedAt: new Date().toISOString(),
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      balance: 0
    });
  };

  return (
    <div className="space-y-10 py-10">
      <div className="text-center space-y-4">
        <div className="inline-block p-6 rounded-full bg-primary/10 text-primary mb-4">
          <Bolt className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tighter uppercase">{isLogin ? '欢迎回来' : '开启新征程'}</h2>
        <p className="text-on-surface-variant font-bold tracking-widest text-xs uppercase">记录你的每一份成长</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="bg-surface-container-low rounded-3xl p-1 border border-outline-variant flex">
            <button 
              type="button"
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-3 text-xs font-bold rounded-2xl transition-all",
                isLogin ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
              )}
            >
              登录
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-3 text-xs font-bold rounded-2xl transition-all",
                !isLogin ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
              )}
            >
              注册
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Mail className="w-5 h-5 text-on-surface-variant" />
              <input 
                type="email" 
                placeholder="邮箱地址" 
                className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Bolt className="w-5 h-5 text-on-surface-variant" />
              <input 
                type="password" 
                placeholder="密码" 
                className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-primary text-on-primary py-5 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          {isLogin ? '立即登录' : '创建账号'}
        </button>

        <div className="text-center">
          <button type="button" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            忘记密码？
          </button>
        </div>
      </form>
    </div>
  );
};

const TodayView = ({ tiles, onToggleTile, onShuffle, onReset, onPomodoro, onStats, onThemeClick, onUpdateTileNote }: { tiles: BingoTile[][], onToggleTile: (r: number, c: number) => void, onShuffle: () => void, onReset: () => void, onPomodoro: () => void, onStats: () => void, onThemeClick: () => void, onUpdateTileNote: (r: number, c: number, note: string) => void }) => {
  const completedCount = tiles.flat().filter(t => t.completed).length;
  const totalCount = tiles.flat().length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ r: number, c: number, tile: BingoTile } | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleLongPress = (r: number, c: number, tile: BingoTile) => {
    setSelectedTile({ r, c, tile });
    setNoteText(tile.note || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (selectedTile) {
      onUpdateTileNote(selectedTile.r, selectedTile.c, noteText);
      setShowNoteModal(false);
      setSelectedTile(null);
      setNoteText('');
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="font-headline font-extrabold text-5xl tracking-tighter leading-none">已完成 {progress}%</h2>
        <p className="text-on-surface-variant font-bold tracking-widest text-xs uppercase">做得很棒！继续加油！</p>
        <div className="mt-4 h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary"
          />
        </div>
      </section>

      <div className={cn(
        "grid gap-2",
        tiles.length === 3 && "grid-cols-3",
        tiles.length === 4 && "grid-cols-4",
        tiles.length === 5 && "grid-cols-5",
        tiles.length === 6 && "grid-cols-6"
      )}>
        {tiles.map((row, rIdx) => (
          row.map((tile, cIdx) => (
            <button
              key={tile.id}
              onClick={() => onToggleTile(rIdx, cIdx)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(rIdx, cIdx, tile);
              }}
              className={cn(
                "aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center text-[10px] font-bold leading-tight transition-all active:scale-90 relative overflow-hidden",
                tile.completed 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest",
                tile.isFreeTile && "font-black uppercase italic",
                tile.isGolden && !tile.completed && "ring-2 ring-amber-400 ring-offset-2 ring-offset-surface shadow-lg shadow-amber-400/20"
              )}
            >
              {tile.isGolden && (
                <div className="absolute top-1 right-1">
                  <Star className={cn("w-3 h-3", tile.completed ? "text-on-primary" : "text-amber-400")} />
                </div>
              )}
              <span className="z-10">{tile.taskName}</span>
              {!tile.completed && (
                <div className="mt-1 flex items-center gap-1 opacity-40 whitespace-nowrap">
                  <div className="flex gap-0.5">
                    {[...Array(tile.difficulty === 'hard' ? 3 : tile.difficulty === 'medium' ? 2 : 1)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-current" />
                    ))}
                  </div>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    tile.priority === 'high' ? "bg-red-500" : tile.priority === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                  <span className="text-[9px] font-bold">+{tile.xpValue || 10} XP</span>
                </div>
              )}
              {tile.note && (
                <div className="absolute bottom-1 left-1 right-1 text-[8px] text-center text-on-surface/60 truncate">
                  备注: {tile.note}
                </div>
              )}
            </button>
          ))
        ))}
      </div>

      <div className="flex justify-between items-center bg-surface-container-low border border-outline-variant p-4 rounded-3xl shadow-sm">
        <ToolbarItem icon={<Shuffle className="w-5 h-5" />} label="洗牌" onClick={onShuffle} />
        <ToolbarItem icon={<Timer className="w-5 h-5" />} label="番茄钟" onClick={onPomodoro} />
        <ToolbarItem icon={<BarChart2 className="w-5 h-5" />} label="统计" onClick={onStats} />
        <ToolbarItem icon={<Bolt className="w-5 h-5" />} label="重置" onClick={onReset} />
        <ToolbarItem icon={<Palette className="w-5 h-5" />} label="主题" onClick={onThemeClick} />
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNoteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-10 border border-outline-variant shadow-2xl space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tight uppercase">任务备注</h3>
                  <button onClick={() => setShowNoteModal(false)} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">任务名称</label>
                    <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold">
                      {selectedTile?.tile.taskName}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">备注信息</label>
                    <textarea 
                      placeholder="请输入任务备注..." 
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none h-32"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowNoteModal(false)}
                    className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleSaveNote}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                  >
                    保存备注
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToolbarItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1 group active:scale-90 transition-all"
  >
    <div className="text-on-surface-variant group-hover:text-primary transition-colors">
      {icon}
    </div>
    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">{label}</span>
  </button>
);

const TaskEditModal = ({ 
  task, 
  onClose, 
  onSave,
  isNew = false
}: { 
  task: Task, 
  onClose: () => void, 
  onSave: (updates: Partial<Task>) => void,
  isNew?: boolean
}) => {
  const [name, setName] = useState(task.name);
  const [difficulty, setDifficulty] = useState(task.difficulty);
  const [priority, setPriority] = useState(task.priority);
  const [tags, setTags] = useState(task.tags?.join(', ') || '');

  const handleSave = () => {
    onSave({
      name: name.trim(),
      difficulty,
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      xpValue: calculateXP(difficulty, priority)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-8 border border-outline-variant shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight uppercase">{isNew ? '新建任务' : '编辑任务'}</h3>
          <button onClick={onClose} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">任务名称</label>
            <input 
              type="text" 
              className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">标签 (逗号分隔)</label>
            <input 
              type="text" 
              className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="例如: 工作, 健身, 学习"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">难度</label>
              <select 
                className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
              >
                <option value="easy">简单 (10 XP)</option>
                <option value="medium">中等 (20 XP)</option>
                <option value="hard">困难 (30 XP)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">优先级</label>
              <select 
                className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={onClose}
            className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
          >
            保存
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TasksView = ({ 
  groups, 
  onToggleTask, 
  onAddGroup, 
  onDeleteGroup, 
  onEditGroup,
  onUpdateTask,
  onAddTask, 
  onDeleteTask, 
  onApplyGroup,
  onApplyTask,
  onApplyMultipleTasks,
  gridSize,
  onGridSizeChange,
  onShuffleTasks,
  onSortTasks,
  onToggleGroupTasks,
  bingoTiles
}: { 
  groups: TaskGroup[], 
  onToggleTask: (groupId: string, taskId: string) => void,
  onAddGroup: (name: string) => void,
  onDeleteGroup: (groupId: string) => void,
  onEditGroup: (groupId: string, name: string) => void,
  onUpdateTask: (groupId: string, taskId: string, updates: Partial<Task>) => void,
  onAddTask: (groupId: string, name: string, updates?: Partial<Task>) => void,
  onDeleteTask: (groupId: string, taskId: string) => void,
  onApplyGroup: (groupId: string) => void,
  onApplyTask: (task: Task) => void,
  onApplyMultipleTasks: (tasks: Task[]) => void,
  gridSize: number,
  onGridSizeChange: (size: number) => void,
  onShuffleTasks: () => void,
  onSortTasks: () => void,
  onToggleGroupTasks: (groupId: string, completed: boolean) => void,
  bingoTiles: BingoTile[][]
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [newTaskNames, setNewTaskNames] = useState<Record<string, string>>({});
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editingTask, setEditingTask] = useState<{ groupId: string, task: Task } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'notes'>('tasks');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [deleteMode, setDeleteMode] = useState<Set<string>>(new Set());
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      onAddGroup(newGroupName.trim());
      setNewGroupName('');
    }
  };

  const handleAddTask = (groupId: string) => {
    const name = newTaskNames[groupId];
    const newTask: Task = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name?.trim() || '',
      completed: false,
      difficulty: 'easy',
      priority: 'medium'
    };
    setEditingTask({ groupId, task: newTask, isNew: true });
  };

  const startEditing = (group: TaskGroup) => {
    setEditingGroupId(group.id);
    setEditName(group.name);
  };

  const saveEdit = () => {
    if (editingGroupId && editName.trim()) {
      onEditGroup(editingGroupId, editName.trim());
      setEditingGroupId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <button 
          onClick={() => setActiveSubTab('tasks')}
          className={cn(
            "flex-1 py-3 px-2 rounded-2xl font-bold transition-all text-sm",
            activeSubTab === 'tasks' ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          )}
        >
          任务页
        </button>
        <button 
          onClick={() => setActiveSubTab('notes')}
          className={cn(
            "flex-1 py-3 px-2 rounded-2xl font-bold transition-all text-sm",
            activeSubTab === 'notes' ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          )}
        >
          笔记页
        </button>
      </div>

      {activeSubTab === 'tasks' && (
        <>
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface-variant tracking-wider uppercase">格子大小</h3>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map(size => (
                <button 
                  key={size}
                  onClick={() => onGridSizeChange(size)}
                  className={cn(
                    "flex-1 py-3 px-2 rounded-2xl font-bold transition-all",
                    gridSize === size ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  )}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-6 py-2">
            <button 
              onClick={onShuffleTasks}
              className="text-sm font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Shuffle className="w-4 h-4" /> 随机
            </button>
            <button 
              onClick={onSortTasks}
              className="text-sm font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors"
            >
              <SortAsc className="w-4 h-4" /> 排序
            </button>
          </div>

          <div className="space-y-10">
        {groups.map(group => {
          const allSelected = group.tasks.length > 0 && group.tasks.every(t => selectedTaskIds.has(t.id));
          return (
            <div key={group.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {editingGroupId === group.id ? (
                    <input 
                      autoFocus
                      className="bg-surface-container-low border-none rounded-lg px-2 py-1 text-xl font-extrabold tracking-tight focus:ring-1 focus:ring-primary w-32"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    />
                  ) : (
                    <span className="text-xl font-extrabold tracking-tight">{group.name}</span>
                  )}
                  <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-1">{group.tasks.length} 任务</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      const allTasks = groups.flatMap(g => g.tasks);
                      const selectedTasks = allTasks.filter(task => selectedTaskIds.has(task.id));
                      if (selectedTasks.length > 0) {
                        if (selectedTasks.length === 1) {
                          onApplyTask(selectedTasks[0]);
                        } else {
                          onApplyMultipleTasks(selectedTasks);
                        }
                      } else {
                        onApplyGroup(group.id);
                      }
                    }}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold hover:bg-primary/20 transition-colors"
                  >
                    应用
                  </button>
                  <button 
                    onClick={() => startEditing(group)}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeletingGroupId(group.id)}
                    className="p-2 text-on-surface-variant hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="添加任务..."
                  className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-1 focus:ring-primary"
                  value={newTaskNames[group.id] || ''}
                  onChange={(e) => setNewTaskNames(prev => ({ ...prev, [group.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask(group.id)}
                />
                <button 
                  onClick={() => handleAddTask(group.id)}
                  className="bg-primary/10 text-primary p-2 rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    const newSelected = new Set(selectedTaskIds);
                    if (allSelected) {
                      group.tasks.forEach(t => newSelected.delete(t.id));
                    } else {
                      group.tasks.forEach(t => newSelected.add(t.id));
                    }
                    setSelectedTaskIds(newSelected);
                  }}
                  className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 px-3"
                >
                  {allSelected ? <X className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}
                  {allSelected ? '取消' : '全选'}
                </button>
                <button 
                  onClick={() => {
                    if (deleteMode.has(group.id)) {
                      const newMode = new Set(deleteMode);
                      newMode.delete(group.id);
                      setDeleteMode(newMode);
                    } else {
                      setDeleteMode(new Set([...deleteMode, group.id]));
                    }
                  }}
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    deleteMode.has(group.id) 
                      ? "bg-red-500 text-white" 
                      : "text-on-surface-variant hover:text-red-500 hover:bg-red-500/10"
                  )}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {group.tasks.map(task => {
                  const isSelected = selectedTaskIds.has(task.id);
                  const isDeleteMode = deleteMode.has(group.id);
                  const toggleTask = () => {
                    if (isDeleteMode) {
                      onDeleteTask(group.id, task.id);
                    } else {
                      const newSelected = new Set(selectedTaskIds);
                      if (isSelected) {
                        newSelected.delete(task.id);
                      } else {
                        newSelected.add(task.id);
                      }
                      setSelectedTaskIds(newSelected);
                    }
                  };
                  return (
                  <div key={task.id} className="group relative">
                    <button 
                      onClick={toggleTask}
                      onMouseDown={() => {
                        if (!isDeleteMode) {
                          const timer = setTimeout(() => {
                            setEditingTask({ groupId: group.id, task });
                          }, 500);
                          setLongPressTimer(timer);
                        }
                      }}
                      onMouseUp={() => {
                        if (longPressTimer) {
                          clearTimeout(longPressTimer);
                          setLongPressTimer(null);
                        }
                      }}
                      onMouseLeave={() => {
                        if (longPressTimer) {
                          clearTimeout(longPressTimer);
                          setLongPressTimer(null);
                        }
                      }}
                      onTouchStart={() => {
                        if (!isDeleteMode) {
                          const timer = setTimeout(() => {
                            setEditingTask({ groupId: group.id, task });
                          }, 500);
                          setLongPressTimer(timer);
                        }
                      }}
                      onTouchEnd={() => {
                        if (longPressTimer) {
                          clearTimeout(longPressTimer);
                          setLongPressTimer(null);
                        }
                      }}
                      className={cn(
                        "px-3 py-2 rounded-xl font-bold text-xs flex flex-col items-start gap-1 transition-all cursor-pointer active:scale-95",
                        isSelected && !isDeleteMode ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
                        isDeleteMode && "cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        {task.name}
                      </div>
                      <div className="flex items-center gap-2 opacity-60">
                        <div className="flex gap-0.5">
                          {[...Array(task.difficulty === 'hard' ? 3 : task.difficulty === 'medium' ? 2 : 1)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-current" />
                          ))}
                        </div>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          task.priority === 'high' ? "bg-red-500" : task.priority === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                        )} />
                        <span className="text-[10px] font-bold">+{task.xpValue || 10} XP</span>
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex gap-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[8px] uppercase tracking-tighter opacity-80">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                    {!isDeleteMode ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(group.id, task.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(group.id, task.id);
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 pt-6">
        <div className="bg-surface-container-lowest rounded-2xl p-4 flex items-center border border-outline-variant transition-all hover:border-primary/40">
          <input 
            className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/40 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="添加一个新组别" 
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
          />
          <button 
            onClick={handleAddGroup}
            className="text-primary p-2 rounded-full hover:bg-primary/10 active:scale-90 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={handleAddGroup}
          className="w-full bg-surface-container-low text-on-surface-variant py-5 rounded-3xl font-extrabold flex items-center justify-center gap-3 hover:bg-surface-container-high hover:border-primary/40 transition-all border-2 border-dashed border-outline-variant"
        >
          <FolderPlus className="w-6 h-6" />
          新建分组
        </button>
      </div>

      <AnimatePresence>
        {editingTask && (
          <TaskEditModal 
            task={editingTask.task}
            isNew={(editingTask as any).isNew}
            onClose={() => {
              setEditingTask(null);
              if ((editingTask as any).isNew) {
                setNewTaskNames(prev => ({ ...prev, [editingTask.groupId]: '' }));
              }
            }}
            onSave={(updates) => {
              if ((editingTask as any).isNew) {
                onAddTask(editingTask.groupId, updates.name || editingTask.task.name, updates);
              } else {
                onUpdateTask(editingTask.groupId, editingTask.task.id, updates);
              }
              setEditingTask(null);
              setNewTaskNames(prev => ({ ...prev, [editingTask.groupId]: '' }));
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingGroupId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingGroupId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-10 border border-outline-variant shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black tracking-tight uppercase">确认删除</h3>
                <p className="text-on-surface-variant text-sm font-bold">确定要删除这个组别吗？此操作无法撤销。</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingGroupId(null)}
                  className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    onDeleteGroup(deletingGroupId);
                    setDeletingGroupId(null);
                  }}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                >
                  删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}

      {activeSubTab === 'notes' && (
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface-variant tracking-wider uppercase">任务备注</h3>
            <p className="text-on-surface-variant text-sm">查看任务的备注信息</p>
          </section>

          <div className="space-y-6">
            {(() => {
              // 按日期分组任务
              const notesByDate: Record<string, BingoTile[]> = {};
              bingoTiles.flat().forEach(tile => {
                if (tile.note) {
                  const date = tile.noteTimestamp 
                    ? new Date(tile.noteTimestamp).toLocaleDateString('zh-CN') 
                    : new Date().toLocaleDateString('zh-CN');
                  if (!notesByDate[date]) {
                    notesByDate[date] = [];
                  }
                  notesByDate[date].push(tile);
                }
              });

              // 按日期排序
              const sortedDates = Object.keys(notesByDate).sort((a, b) => {
                return new Date(b).getTime() - new Date(a).getTime();
              });

              if (sortedDates.length === 0) {
                return (
                  <div className="text-center py-10 text-on-surface-variant/40 font-bold text-sm italic">
                    暂无任务备注信息
                  </div>
                );
              }

              return sortedDates.map(date => (
                <CollapsibleNotesSection 
                  key={date}
                  dateStr={date}
                  notes={notesByDate[date]}
                />
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

const CollapsibleHistorySection = ({ dateStr, tasks, defaultExpanded = false, onDeleteEntry }: { dateStr: string, tasks: HistoryEntry[], defaultExpanded?: boolean, key?: string, onDeleteEntry?: (id: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="space-y-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group active:opacity-70 transition-all"
      >
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold">{dateStr}</h2>
          <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase opacity-60">
            {tasks.length} 任务完成
          </span>
        </div>
        <div className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-transform duration-300",
          isExpanded ? "rotate-180" : "rotate-0"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            {tasks.length > 0 ? (
              tasks.map(entry => (
                <HistoryItem 
                  key={entry.id} 
                  icon={entry.type === 'pomodoro' ? <Timer className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />} 
                  title={entry.taskName + (entry.xpEarned ? ` (+${entry.xpEarned} XP)` : '')} 
                  time={new Date(entry.completedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} 
                  onDelete={() => onDeleteEntry?.(entry.id)}
                />
              ))
            ) : (
              <div className="text-center py-10 text-on-surface-variant/40 font-bold text-sm italic">
                这一天没有完成的任务记录
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const CollapsibleNotesSection = ({ dateStr, notes }: { dateStr: string, notes: BingoTile[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="space-y-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group active:opacity-70 transition-all"
      >
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold">{dateStr}</h2>
          <span className="text-on-surface-variant text-[10px] font-bold tracking-widest uppercase opacity-60">
            {notes.length} 条备注
          </span>
        </div>
        <div className={cn(
          "w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-transform duration-300",
          isExpanded ? "rotate-180" : "rotate-0"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            {notes.length > 0 ? (
              notes.map(note => (
                <div key={note.id} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant">
                  <div className="flex items-start justify-between space-y-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface">{note.taskName}</h4>
                      <p className="text-on-surface-variant text-sm mt-2">{note.note}</p>
                      {note.noteTimestamp && (
                        <p className="text-on-surface-variant/60 text-[10px] mt-2">
                          备注时间: {new Date(note.noteTimestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    <div className={cn(
                      "w-3 h-3 rounded-full mt-1",
                      note.completed ? "bg-primary" : "bg-surface-container-high"
                    )} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-on-surface-variant/40 font-bold text-sm italic">
                这一天没有备注信息
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const CalendarView = ({ history, onBackToToday, onDeleteEntry }: { history: HistoryEntry[], onBackToToday: () => void, onDeleteEntry: (id: string) => void }) => {
  const [subTab, setSubTab] = useState<'calendar' | 'history'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // 直接从1号开始，不添加空白天数
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getTasksForDate = (date: Date) => {
    return history.filter(entry => isSameDay(new Date(entry.completedAt), date));
  };

  const selectedTasks = getTasksForDate(selectedDate);

  // Heatmap logic
  const getHeatmapColor = (date: Date) => {
    const count = getTasksForDate(date).length;
    if (count === 0) return 'bg-surface-container-low';
    if (count < 3) return 'bg-primary/20';
    if (count < 6) return 'bg-primary/40';
    if (count < 9) return 'bg-primary/70';
    return 'bg-primary';
  };

  const historyByDate = history.reduce((acc, entry) => {
    const dateStr = new Date(entry.completedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);

  const sortedHistoryDates = Object.keys(historyByDate).sort((a, b) => {
    const dateA = new Date(historyByDate[a][0].completedAt);
    const dateB = new Date(historyByDate[b][0].completedAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-8">
      {/* Sub-tabs */}
      <div className="flex bg-surface-container-low p-1 rounded-2xl border border-outline-variant">
        <button 
          onClick={() => setSubTab('calendar')}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
            subTab === 'calendar' ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          日历
        </button>
        <button 
          onClick={() => setSubTab('history')}
          className={cn(
            "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
            subTab === 'history' ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          历史
        </button>
      </div>

      {subTab === 'calendar' ? (
        <div className="space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                </h1>
                <p className="text-on-surface-variant text-sm font-medium">
                  {history.length > 0 ? '状态火热！' : '开始记录你的第一天吧'}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={prevMonth}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextMonth}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-6 px-2">
                <Info className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">月度概览</span>
              </div>
              <div className="grid grid-cols-7 mb-6">
                {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                  <span key={d} className="text-center text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => day && setSelectedDate(day)}
                    className={cn(
                      "h-12 relative flex flex-col items-center justify-center text-sm font-bold cursor-pointer transition-all rounded-xl",
                      !day && "invisible",
                      day && isSameDay(day, selectedDate) && "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest",
                      day && getHeatmapColor(day)
                    )}
                  >
                    {day?.getDate().toString().padStart(2, '0')}
                    {day && isSameDay(day, new Date()) && (
                      <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={onBackToToday}
                  className="bg-surface-container-low text-primary px-6 py-2.5 rounded-full font-bold text-[11px] tracking-wider uppercase active:scale-95 transition-all flex items-center gap-2 border border-outline-variant"
                >
                  <CalendarIcon className="w-4 h-4" /> 返回今天
                </button>
              </div>
            </div>
          </section>

            <CollapsibleHistorySection 
              dateStr={selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
              tasks={selectedTasks}
              defaultExpanded={true}
              onDeleteEntry={onDeleteEntry}
            />
        </div>
      ) : (
        <div className="space-y-10">
          {sortedHistoryDates.length > 0 ? (
            sortedHistoryDates.map(dateStr => (
              <CollapsibleHistorySection 
                key={dateStr}
                dateStr={dateStr}
                tasks={historyByDate[dateStr]}
                defaultExpanded={false}
                onDeleteEntry={onDeleteEntry}
              />
            ))
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="inline-block p-6 rounded-full bg-surface-container-low text-on-surface-variant/20">
                <CalendarIcon className="w-12 h-12" />
              </div>
              <p className="text-on-surface-variant/40 font-bold text-sm">暂无历史记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HistoryItem = ({ icon, title, time, onDelete }: { icon: React.ReactNode, title: string, time: string, key?: string, onDelete?: () => void }) => (
  <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-[1.5rem] flex items-center justify-between shadow-sm active:bg-surface-container-low transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-surface-container-low text-primary flex items-center justify-center rounded-2xl">
        {icon}
      </div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-on-surface-variant text-[11px] flex items-center gap-1 font-medium">
          <AlarmClock className="w-3 h-3" /> {time}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 text-on-surface-variant/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
      <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
    </div>
  </div>
);

const StatsView = ({ stats, history }: { stats: Stats, history: HistoryEntry[] }) => {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  }).reverse();

  const xpData = last7Days.map(date => {
    const dayHistory = history.filter(h => new Date(h.completedAt).toDateString() === date);
    const xp = dayHistory.reduce((acc, h) => acc + (h.xpEarned || 0), 0);
    return { 
      name: new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }), 
      xp 
    };
  });

  const pomoData = last7Days.map(date => {
    const pomoCount = history.filter(h => 
      h.type === 'pomodoro' && 
      new Date(h.completedAt).toDateString() === date
    ).length;
    return { 
      name: new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }), 
      sessions: pomoCount 
    };
  });

  const totalFocusMinutes = history
    .filter(h => h.type === 'pomodoro')
    .length * 25;
  
  const hours = Math.floor(totalFocusMinutes / 60);
  const minutes = totalFocusMinutes % 60;

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">累计经验</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tighter">{stats.totalXp}</span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">XP</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-500">
            <Flame className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">当前连击</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tighter">{stats.currentStreak}</span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">天</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">已完任务</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tighter">{stats.totalCompleted}</span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">个</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-violet-500">
            <Timer className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">专注时长</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tighter">{hours}</span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">h {minutes}m</span>
          </div>
        </div>
      </div>

      <section className="bg-surface-container-lowest border border-outline-variant p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest">经验趋势</h3>
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">最近 7 天的 XP 获取情况</p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="xp" 
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest">专注分布</h3>
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">每日番茄钟完成组数</p>
          </div>
          <Activity className="w-5 h-5 text-violet-500" />
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pomoData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="sessions" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Bingo 连线</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter">{stats.bingosCount}</span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">次</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">金色任务</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter">{stats.goldenTilesCompleted}</span>
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">个</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementsView = ({ 
  achievements, 
  stats, 
  history,
  onAddCustomAchievement,
  onDeleteAchievement,
  onToggleAchievement,
  onUpdateAchievement,
  initialViewMode
}: { 
  achievements: Achievement[], 
  stats: Stats, 
  history: HistoryEntry[],
  onAddCustomAchievement: (title: string, requirement: string, icon: string) => void,
  onDeleteAchievement: (id: string) => void,
  onToggleAchievement: (id: string) => void,
  onUpdateAchievement: (id: string, updates: Partial<Achievement>) => void,
  initialViewMode?: 'achievements' | 'stats'
}) => {
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
      setCustomTitle('');
      setCustomRequirement('');
      setIsAddingCustom(false);
    }
  };

  const handleStartEdit = (achievement: Achievement) => {
    setEditTitle(achievement.title);
    setEditRequirement(achievement.requirement || '');
    setEditIcon(achievement.icon);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedAchievement && editTitle.trim()) {
      onUpdateAchievement(selectedAchievement.id, {
        title: editTitle.trim(),
        requirement: editRequirement.trim(),
        icon: editIcon
      });
      setSelectedAchievement({
        ...selectedAchievement,
        title: editTitle.trim(),
        requirement: editRequirement.trim(),
        icon: editIcon
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (selectedAchievement) {
      onDeleteAchievement(selectedAchievement.id);
      setSelectedAchievement(null);
      setIsEditing(false);
    }
  };

  const handleToggle = () => {
    if (selectedAchievement) {
      onToggleAchievement(selectedAchievement.id);
      setSelectedAchievement({
        ...selectedAchievement,
        unlocked: !selectedAchievement.unlocked
      });
    }
  };

  const coreAchievements = achievements.filter(a => !a.isCustom);
  const customAchievements = achievements.filter(a => a.isCustom);

  const availableIcons = ['star', 'zap', 'alarm-clock', 'trophy', 'egg', 'focus', 'sun', 'moon', 'heart', 'sparkles', 'cookie', 'film', 'gamepad-2', 'book-open'];

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight uppercase">荣誉殿堂</h2>
          <button 
            onClick={() => setViewMode(viewMode === 'achievements' ? 'stats' : 'achievements')}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20 transition-all active:scale-95"
          >
            {viewMode === 'achievements' ? '查看统计' : '查看成就'}
          </button>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {viewMode === 'achievements' ? (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-10"
          >
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-tight">核心成就</h2>
                <div className="bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant">
                  <span className="text-[10px] font-bold text-on-surface-variant">已解锁 {coreAchievements.filter(a => a.unlocked).length} / {coreAchievements.length}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {coreAchievements.map(achievement => (
                  <button 
                    key={achievement.id} 
                    onClick={() => setSelectedAchievement(achievement)}
                    className={cn("flex flex-col items-center gap-3 transition-all active:scale-95", !achievement.unlocked && "opacity-30")}
                  >
                    <div className={cn(
                      "w-full aspect-square rounded-[1.5rem] flex flex-col items-center justify-center relative transition-all p-3",
                      achievement.unlocked ? "bg-surface-container-lowest border border-outline-variant shadow-sm" : "bg-surface-container-low border border-outline-variant/50"
                    )}>
                      <AchievementIcon name={achievement.icon} className="w-10 h-10 text-primary mb-2" />
                      {achievement.level && (
                        <div className="absolute -top-2 -right-2 bg-primary text-on-primary text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                          等级 {achievement.level}
                        </div>
                      )}

                      <span className="text-[9px] text-on-surface-variant/60 text-center leading-tight px-1">{achievement.description}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-center leading-tight px-1">{achievement.title}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-tight">自定义成就</h2>
                <div className="bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant">
                  <span className="text-[10px] font-bold text-on-surface-variant">已达成 {customAchievements.filter(a => a.unlocked).length} / {customAchievements.length}</span>
                </div>
              </div>
              
              {customAchievements.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {customAchievements.map(achievement => (
                    <button 
                      key={achievement.id} 
                      onClick={() => {
                        setSelectedAchievement(achievement);
                        setIsEditing(false);
                      }}
                      className={cn("flex flex-col items-center gap-3 transition-all active:scale-95", !achievement.unlocked && "opacity-30")}
                    >
                      <div className={cn(
                        "w-full aspect-square rounded-[1.5rem] flex flex-col items-center justify-center relative transition-all p-3",
                        achievement.unlocked ? "bg-surface-container-lowest border border-outline-variant shadow-sm" : "bg-surface-container-low border border-outline-variant/50"
                      )}>
                        <AchievementIcon name={achievement.icon} className="w-10 h-10 text-primary mb-2" />

                        <span className="text-[9px] text-on-surface-variant/60 text-center leading-tight px-1">{achievement.requirement || achievement.description}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-center leading-tight px-1">{achievement.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-surface-container-low/30 rounded-3xl border-2 border-dashed border-outline-variant">
                  <p className="text-on-surface-variant/40 font-bold text-sm italic">暂无自定义成就</p>
                </div>
              )}
              
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-10 text-center space-y-8 relative overflow-hidden">
                <div className="space-y-3">
                  <h3 className="text-2xl font-extrabold tracking-tight uppercase">定义你的荣耀</h3>
                  <p className="text-on-surface-variant text-sm px-6 font-medium">为你的独特个人胜利创建自定义徽章。</p>
                </div>
                {!isAddingCustom ? (
                  <button 
                    onClick={() => setIsAddingCustom(true)}
                    className="w-full bg-primary text-on-primary py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    <PlusCircle className="w-5 h-5" /> 创建自定义成就
                  </button>
                ) : (
                  <div className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">成就名称</label>
                      <input 
                        type="text" 
                        placeholder="成就名称..." 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">获得条件</label>
                      <input 
                        type="text" 
                        placeholder="获得条件 (例如: 连续3天早起)..." 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        value={customRequirement}
                        onChange={(e) => setCustomRequirement(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setIsAddingCustom(false)}
                        className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleAddCustom}
                        className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                      >
                        创建
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StatsView stats={stats} history={history} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedAchievement(null);
                setIsEditing(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-10 border border-outline-variant shadow-2xl space-y-8"
            >
              {isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight uppercase">编辑自定义成就</h3>
                    <button onClick={() => setIsEditing(false)} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">图标</label>
                      <div className="flex flex-wrap gap-2 p-2 bg-surface-container-low rounded-2xl border border-outline-variant max-h-32 overflow-y-auto">
                        {availableIcons.map(iconName => (
                          <button 
                            key={iconName}
                            onClick={() => setEditIcon(iconName)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                              editIcon === iconName ? "bg-primary text-on-primary" : "hover:bg-surface-container-highest text-on-surface-variant"
                            )}
                          >
                            <AchievementIcon name={iconName} className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">成就名称</label>
                      <input 
                        type="text" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">获得条件</label>
                      <input 
                        type="text" 
                        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                        value={editRequirement}
                        onChange={(e) => setEditRequirement(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-32 h-32 bg-primary/10 rounded-[2rem] flex items-center justify-center">
                      <AchievementIcon name={selectedAchievement.icon} className="w-16 h-16 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-3xl font-black tracking-tight uppercase">{selectedAchievement.title}</h3>
                      <p className="text-on-surface-variant font-medium text-sm leading-relaxed">{selectedAchievement.description}</p>
                      {selectedAchievement.requirement && (
                        <p className="text-primary font-bold text-xs uppercase tracking-widest">条件: {selectedAchievement.requirement}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">解锁进度</span>
                        <span className="text-[10px] font-bold text-primary">{selectedAchievement.unlocked ? '100%' : '0%'}</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000" 
                          style={{ width: selectedAchievement.unlocked ? '100%' : '0%' }}
                        />
                      </div>
                    </div>
                    {selectedAchievement.unlockedAt && (
                      <div className="flex items-center gap-3 px-2">
                        <CalendarIcon className="w-4 h-4 text-on-surface-variant" />
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                          解锁于 {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedAchievement.isCustom && (
                      <div className="flex gap-3">
                        <button 
                          onClick={handleToggle}
                          className={cn(
                            "flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all",
                            selectedAchievement.unlocked ? "bg-surface-container-low text-on-surface" : "bg-primary text-on-primary shadow-lg shadow-primary/20"
                          )}
                        >
                          {selectedAchievement.unlocked ? '取消达成' : '标记达成'}
                        </button>
                        <button 
                          onClick={() => handleStartEdit(selectedAchievement)}
                          className="bg-surface-container-low text-on-surface p-4 rounded-2xl active:scale-95 transition-all"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleDelete}
                          className="bg-red-500/10 text-red-500 p-4 rounded-2xl active:scale-95 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={() => setSelectedAchievement(null)}
                      className="w-full bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                    >
                      关闭
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopView = ({ 
  items, 
  userBalance, 
  onBuyItem,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}: { 
  items: ShopItem[], 
  userBalance: number, 
  onBuyItem: (item: ShopItem) => void,
  onAddItem: (item: Omit<ShopItem, 'id'>) => void,
  onUpdateItem: (item: ShopItem) => void,
  onDeleteItem: (id: string) => void
}) => {
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newItem, setNewItem] = useState<Omit<ShopItem, 'id'>>({
    name: '',
    description: '',
    cost: 10,
    icon: 'sparkles',
    category: 'reward'
  });

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      onAddItem(newItem);
      setNewItem({ name: '', description: '', cost: 10, icon: 'sparkles', category: 'reward' });
      setIsAdding(false);
    }
  };

  const handleUpdateItem = () => {
    if (editingItem && editingItem.name.trim()) {
      onUpdateItem(editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-10">
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">当前余额</p>
            <h3 className="text-5xl font-extrabold tracking-tighter text-primary">{userBalance.toLocaleString()}</h3>
            <p className="text-on-surface-variant font-bold text-sm mt-1">Spendable XP</p>
          </div>
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            className={cn(
              "p-4 rounded-2xl transition-all active:scale-95",
              isManageMode ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
            )}
          >
            <Settings2 className="w-6 h-6" />
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold uppercase tracking-tight">{isManageMode ? '管理商店' : '奖励商店'}</h2>
          {isManageMode && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
            >
              <Plus className="w-3 h-3" /> 新增商品
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <div 
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <ShopItemIcon name={item.icon} className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium">{item.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isManageMode ? (
                  <>
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="p-2 text-on-surface-variant/40 hover:text-primary transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 text-on-surface-variant/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => onBuyItem(item)}
                    disabled={userBalance < item.cost}
                    className={cn(
                      "px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                      userBalance >= item.cost 
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                        : "bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed"
                    )}
                  >
                    {item.cost} XP
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {(isAdding || editingItem) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setEditingItem(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-8 border border-outline-variant shadow-2xl space-y-6"
            >
              <h3 className="text-xl font-black tracking-tight uppercase">
                {isAdding ? '新增商品' : '编辑商品'}
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">商品名称</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    value={isAdding ? newItem.name : editingItem?.name || ''}
                    onChange={(e) => isAdding ? setNewItem({...newItem, name: e.target.value}) : setEditingItem(editingItem ? {...editingItem, name: e.target.value} : null)}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">描述</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    value={isAdding ? newItem.description : editingItem?.description || ''}
                    onChange={(e) => isAdding ? setNewItem({...newItem, description: e.target.value}) : setEditingItem(editingItem ? {...editingItem, description: e.target.value} : null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">价格 (XP)</label>
                    <input 
                      type="number" 
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      value={isAdding ? newItem.cost : editingItem?.cost || 0}
                      onChange={(e) => isAdding ? setNewItem({...newItem, cost: parseInt(e.target.value)}) : setEditingItem(editingItem ? {...editingItem, cost: parseInt(e.target.value)} : null)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">图标</label>
                    <select 
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                      value={isAdding ? newItem.icon : editingItem?.icon || 'sparkles'}
                      onChange={(e) => isAdding ? setNewItem({...newItem, icon: e.target.value}) : setEditingItem(editingItem ? {...editingItem, icon: e.target.value} : null)}
                    >
                      <option value="cookie">饼干</option>
                      <option value="film">电影</option>
                      <option value="gamepad-2">游戏</option>
                      <option value="heart">爱心</option>
                      <option value="book-open">书籍</option>
                      <option value="sparkles">闪耀</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => { setIsAdding(false); setEditingItem(null); }}
                  className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                >
                  取消
                </button>
                <button 
                  onClick={isAdding ? handleAddItem : handleUpdateItem}
                  className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopItemIcon = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'cookie': return <Cookie className={className} />;
    case 'film': return <Film className={className} />;
    case 'gamepad-2': return <Gamepad2 className={className} />;
    case 'heart': return <Heart className={className} />;
    case 'book-open': return <BookOpen className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    default: return <ShoppingBag className={className} />;
  }
};

const AchievementIcon = ({ name, className }: { name: string, className?: string }) => {
  switch (name) {
    case 'egg': return <Egg className={className} />;
    case 'alarm-clock': return <AlarmClock className={className} />;
    case 'zap': return <Zap className={className} />;
    case 'moon': return <Moon className={className} />;
    case 'focus': return <Focus className={className} />;
    case 'sun': return <Sun className={className} />;
    default: return <Trophy className={className} />;
  }
};

const PomodoroView = ({ 
  onBack, 
  user, 
  setUser, 
  stats, 
  setStats, 
  history, 
  setHistory, 
  bingoTiles,
  playSound,
  triggerHaptic
}: { 
  onBack: () => void,
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  stats: Stats,
  setStats: React.Dispatch<React.SetStateAction<Stats>>,
  history: HistoryEntry[],
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>,
  bingoTiles: BingoTile[][],
  playSound: (type: 'complete' | 'bingo' | 'levelUp') => void,
  triggerHaptic: (intensity?: 'light' | 'medium' | 'heavy') => void
}) => {
  const [mode, setMode] = React.useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  const [isTaskSelectorOpen, setIsTaskSelectorOpen] = React.useState(false);

  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  React.useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    playSound('complete');
    triggerHaptic('heavy');

    if (mode === 'work') {
      // Award XP
      const xpReward = 20;
      if (user) {
        setUser(prev => {
          if (!prev) return prev;
          let newXp = prev.xp + xpReward;
          let newLevel = prev.level;
          let nextLevelXp = prev.nextLevelXp;

          if (newXp >= nextLevelXp) {
            newXp -= nextLevelXp;
            newLevel += 1;
            nextLevelXp = Math.floor(nextLevelXp * 1.5);
            playSound('levelUp');
          }

          return { ...prev, xp: newXp, level: newLevel, nextLevelXp };
        });
      }

      // Update stats
      setStats(prev => ({
        ...prev,
        totalCompleted: prev.totalCompleted + 1,
        totalXp: prev.totalXp + xpReward
      }));

      // Add to history
      const newEntry: HistoryEntry = {
        id: `pomo-${Date.now()}`,
        taskName: selectedTask || '专注会话',
        completedAt: new Date().toISOString(),
        xpEarned: xpReward,
        type: 'pomodoro'
      };
      setHistory(prev => [newEntry, ...prev]);

      // Switch to break
      setMode('shortBreak');
      setTimeLeft(durations.shortBreak);
    } else {
      // Break complete, switch back to work
      setMode('work');
      setTimeLeft(durations.work);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isActive) triggerHaptic('light');
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durations[mode]);
    triggerHaptic('medium');
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsActive(false);
    triggerHaptic('light');
  };

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  // Calculate stats from real data
  const sessionsToday = history.filter(h => 
    h.type === 'pomodoro' && 
    new Date(h.completedAt).toDateString() === new Date().toDateString()
  ).length;
  
  const totalSessionsGoal = 4;
  const focusTimeToday = (sessionsToday * 25) / 60; // Simplified
  const weeklyGoal = 24;
  const weeklyProgress = history.filter(h => 
    h.type === 'pomodoro' && 
    new Date(h.completedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length * 25 / 60;

  const allTasks = bingoTiles.flat().filter(t => !t.isFreeTile);

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-3 bg-surface-container-low rounded-2xl text-on-surface-variant active:scale-90 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-headline font-black text-xl tracking-tight uppercase">专注进程</h1>

      </header>

      {/* Mode Selector */}
      <div className="flex bg-surface-container-low p-1 rounded-3xl border border-outline-variant">
        <button 
          onClick={() => switchMode('work')}
          className={cn(
            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            mode === 'work' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container-highest"
          )}
        >
          专注
        </button>
        <button 
          onClick={() => switchMode('shortBreak')}
          className={cn(
            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            mode === 'shortBreak' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container-highest"
          )}
        >
          短休
        </button>
        <button 
          onClick={() => switchMode('longBreak')}
          className={cn(
            "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            mode === 'longBreak' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:bg-surface-container-highest"
          )}
        >
          长休
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setIsTaskSelectorOpen(true)}
          className="col-span-2 bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm text-left active:scale-[0.98] transition-all group"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">当前任务</span>
            <Edit2 className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-primary truncate">
            {selectedTask || '选择一个任务...'}
          </h2>
        </button>
        
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm flex flex-col justify-between aspect-square">
          <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest block mb-4">番茄钟历史</span>
          <div>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-black tracking-tighter">{sessionsToday}</span>
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">/ {totalSessionsGoal} 组完成</span>
            </div>
            <div className="flex gap-1.5">
              {[...Array(totalSessionsGoal)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-500",
                    i < sessionsToday ? "bg-primary" : "bg-surface-container-high"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[2rem] shadow-sm flex flex-col justify-between aspect-square">
          <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest block mb-4">今日专注时长</span>
          <div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-black tracking-tighter">{focusTimeToday.toFixed(1)}</span>
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">小时</span>
            </div>
            <div className="text-[10px] font-black text-primary uppercase tracking-widest">
              {focusTimeToday > 0 ? '+100% vs 昨天' : '开始专注吧'}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center py-6">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              className="text-surface-container-low"
            />
            <motion.circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeDasharray="282.7"
              animate={{ strokeDashoffset: 282.7 - (282.7 * progress) / 100 }}
              className="text-primary"
              strokeLinecap="round"
              transition={{ type: 'spring', bounce: 0, duration: 1 }}
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <span className="text-7xl font-black tracking-tighter tabular-nums text-on-surface">
              {formatTime(timeLeft)}
            </span>
            <div className="flex items-center gap-2 mt-3 text-primary">
              {mode === 'work' ? <Focus className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isActive ? (mode === 'work' ? '工作中' : '休息中') : '已暂停'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-[2.5rem] shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">今日目标进度</span>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            {Math.min(100, Math.round((focusTimeToday / 6) * 100))}%
          </span>
        </div>
        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (focusTimeToday / 6) * 100)}%` }}
            className="h-full bg-primary rounded-full" 
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
          <span>周目标 ({weeklyGoal}h)</span>
          <span>已完成 {weeklyProgress.toFixed(1)}h</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <button 
            onClick={toggleTimer}
            className={cn(
              "flex-[1.5] py-6 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl",
              isActive ? "bg-surface-container-high text-on-surface-variant/40" : "bg-primary text-on-primary shadow-primary/20 active:scale-95"
            )}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? '暂停' : '开始'}
          </button>
          <button 
            onClick={resetTimer}
            className="flex-1 bg-surface-container-high text-on-surface py-6 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        </div>
        <button 
          onClick={() => {
            setIsActive(false);
            setTimeLeft(durations[mode]);
          }}
          className="w-full py-4 text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em] hover:text-red-500 transition-colors"
        >
          放弃本次会话
        </button>
      </div>

      {/* Task Selector Modal */}
      <AnimatePresence>
        {isTaskSelectorOpen && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTaskSelectorOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[3rem] p-10 border-t border-outline-variant shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight uppercase">选择专注任务</h3>
                <button onClick={() => setIsTaskSelectorOpen(false)} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {allTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task.taskName);
                      setIsTaskSelectorOpen(false);
                    }}
                    className={cn(
                      "w-full p-6 rounded-2xl border text-left transition-all flex items-center justify-between group",
                      selectedTask === task.taskName 
                        ? "bg-primary/5 border-primary" 
                        : "bg-surface-container-low border-outline-variant hover:border-primary/50"
                    )}
                  >
                    <div className="space-y-1">
                      <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{task.taskName}</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(task.difficulty === 'hard' ? 3 : task.difficulty === 'medium' ? 2 : 1)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-primary/30" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-primary/60">+{task.xpValue || 10} XP</span>
                      </div>
                    </div>
                    {selectedTask === task.taskName && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsView = ({ settings, onUpdateSettings, user, onLogout, onUpdateUser }: { settings: Settings, onUpdateSettings: (s: Partial<Settings>) => void, user: User | null, onLogout: () => void, onUpdateUser: (updates: Partial<User>) => void }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  
  const themes: { name: Theme, color: string }[] = [
    { name: 'zinc', color: '#6f797a' },
    { name: 'slate', color: '#475569' },
    { name: 'gray', color: '#4b5563' },
    { name: 'blue', color: '#2563eb' },
    { name: 'rose', color: '#e11d48' },
    { name: 'amber', color: '#d97706' },
    { name: 'emerald', color: '#059669' },
    { name: 'violet', color: '#7c3aed' },
    { name: 'dark', color: '#1a1a1a' },
  ];

  const handleEditProfile = () => {
    if (user) {
      setEditUsername(user.username);
      setEditEmail(user.email);
      setEditAvatar(user.avatar);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      onUpdateUser({
        username: editUsername.trim(),
        email: editEmail.trim(),
        avatar: editAvatar.trim()
      });
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-10">
      {user && (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-primary/20">
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xl font-black tracking-tight">{user.username}</h2>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest opacity-60">{user.email}</p>
            </div>
            <button 
              onClick={handleEditProfile}
              className="ml-auto text-primary p-2 hover:bg-primary/10 rounded-full transition-all"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant">
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">加入时间</p>
              <p className="text-xs font-bold">{new Date(user.joinedAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant">
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">账号状态</p>
              <p className="text-xs font-bold text-primary">高级会员</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full bg-red-50 text-red-500 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4" /> 退出登录
          </button>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-4 px-2">
          <Palette className="w-5 h-5 text-on-surface-variant" />
          <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">主题 (Theme)</h2>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant grid grid-cols-5 gap-4 shadow-sm">
          {themes.map((t, i) => (
            <button 
              key={i}
              onClick={() => onUpdateSettings({ theme: t.name })}
              className={cn(
                "w-10 h-10 rounded-full flex-shrink-0 transition-all active:scale-90 border-2",
                settings.theme === t.name ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-surface" : "border-transparent opacity-60 hover:opacity-100"
              )}
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Database className="w-5 h-5 text-on-surface-variant" />
          <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">数据管理 (Data)</h2>
        </div>
        <div className="space-y-3">
          <SettingsButton icon={<FileUp className="w-4 h-4" />} label="导出数据" />
          <SettingsButton icon={<FileDown className="w-4 h-4" />} label="导入数据" />
          <SettingsButton 
            icon={<Trash2 className="w-4 h-4" />} 
            label="清除所有数据" 
            variant="danger" 
          />
        </div>
      </section>

      <footer className="pt-10 pb-16 text-center space-y-8">
        <div className="inline-block p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant shadow-sm">
          <LayoutGrid className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-primary tracking-[0.2em] mb-1">LIFE BINGO</h3>
          <p className="text-on-surface-variant text-xs font-bold tracking-widest opacity-60 uppercase">版本 2.4.0 (极简优化)</p>
        </div>
        <div className="space-y-1 opacity-30">
          <p className="text-[10px] uppercase font-black tracking-[0.3em]">ICP 备案号: 2023000456-1</p>
          <p className="text-[10px] uppercase font-black tracking-[0.3em]">© 2024 Zenith Grid Labs</p>
        </div>
      </footer>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-8 border border-outline-variant shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight uppercase">编辑个人信息</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={editAvatar} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="avatar-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditAvatar(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label 
                    htmlFor="avatar-upload"
                    className="bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    选择图片
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">用户名</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">邮箱地址</label>
                  <input 
                    type="email" 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">头像 URL (可选)</label>
                  <input 
                    type="url" 
                    placeholder="输入头像图片链接" 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsButton = ({ icon, label, variant = 'default' }: { icon: React.ReactNode, label: string, variant?: 'default' | 'danger' }) => (
  <button className={cn(
    "w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98] border shadow-sm",
    variant === 'danger' 
      ? "bg-surface-container-lowest border-red-100 text-red-500 hover:bg-red-50" 
      : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-low"
  )}>
    <span className="font-bold text-sm">{label}</span>
    <div className={cn(variant === 'danger' ? "text-red-400" : "text-on-surface-variant/60")}>
      {icon}
    </div>
  </button>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [activeSubTab, setActiveSubTab] = useState('achievements');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('life-bingo-user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            ...parsed,
            level: parsed.level || 1,
            xp: parsed.xp || 0,
            nextLevelXp: parsed.nextLevelXp || 100,
            balance: parsed.balance || 0
          };
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return null;
  });
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(() => {
    const saved = localStorage.getItem('life-bingo-groups');
    return saved ? JSON.parse(saved) : INITIAL_TASK_GROUPS;
  });
  const [bingoTiles, setBingoTiles] = useState<BingoTile[][]>(() => {
    const saved = localStorage.getItem('life-bingo-tiles');
    return saved ? JSON.parse(saved) : INITIAL_BINGO_TILES;
  });
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('life-bingo-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('life-bingo-achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('life-bingo-stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('life-bingo-settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  const [gridSize, setGridSize] = useState(() => {
    const saved = localStorage.getItem('life-bingo-grid-size');
    return saved ? parseInt(saved) : 5;
  });
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('life-bingo-shop-items');
    return saved ? JSON.parse(saved) : INITIAL_SHOP_ITEMS;
  });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-user', JSON.stringify(user));
  }, [user]);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-groups', JSON.stringify(taskGroups));
  }, [taskGroups]);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-tiles', JSON.stringify(bingoTiles));
  }, [bingoTiles]);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-history', JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-achievements', JSON.stringify(achievements));
  }, [achievements]);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-stats', JSON.stringify(stats));
  }, [stats]);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-shop-items', JSON.stringify(shopItems));
  }, [shopItems]);

  React.useEffect(() => {
    localStorage.setItem('life-bingo-grid-size', gridSize.toString());
  }, [gridSize]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Update stats dynamically
  React.useEffect(() => {
    const totalCompleted = history.length;
    const uniqueDates = new Set(history.map(h => new Date(h.completedAt).toDateString()));
    const currentStreak = uniqueDates.size; // Simple streak logic
    
    setStats(prev => ({
      ...prev,
      totalCompleted,
      currentStreak,
      bingosCount: Math.floor(totalCompleted / 5) // Mock bingo count
    }));
  }, [history]);

  // Check for achievements
  React.useEffect(() => {
    if (!user) return;

    setAchievements(prev => {
      let changed = false;
      const next = prev.map(achievement => {
        if (achievement.unlocked) return achievement;

        let unlocked = false;
        switch (achievement.id) {
          case 'a1': unlocked = stats.totalCompleted >= 1; break;
          case 'a2': unlocked = stats.currentStreak >= 3; break;
          case 'a3': unlocked = stats.bingosCount >= 10; break;
          case 'a4': unlocked = stats.fullHousesCount >= 1; break;
          case 'a5': unlocked = stats.totalXp >= 1000; break;
          case 'a6': unlocked = stats.earlyBirdCount >= 1; break;
          case 'a7': unlocked = stats.goldenTilesCompleted >= 5; break;
          case 'a8': unlocked = stats.totalSpent >= 500; break;
          case 'a9': unlocked = stats.totalCompleted >= 100; break;
        }

        if (unlocked) {
          changed = true;
          return { ...achievement, unlocked: true };
        }
        return achievement;
      });
      return changed ? next : prev;
    });
  }, [user, stats]);

  const playSound = (type: 'complete' | 'bingo' | 'levelUp') => {
    try {
      const sounds = {
        complete: '../2000-preview.mp3',
        bingo: '../2018-preview.mp3',
        levelUp: '../2019-preview.mp3'
      };
      const audio = new Audio(sounds[type]);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (error) {
      // 忽略音频加载错误，不影响应用其他功能
      console.log('Audio playback error:', error);
    }
  };


  const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50, 30, 50]
      };
      window.navigator.vibrate(patterns[intensity]);
    }
  };

  const checkBingo = (grid: BingoTile[][], r: number, c: number) => {
    const size = grid.length;
    // Row
    if (grid[r].every(t => t.completed)) return true;
    // Col
    if (grid.every(row => row[c].completed)) return true;
    // Diagonals
    if (r === c && grid.every((row, i) => row[i].completed)) return true;
    if (r + c === size - 1 && grid.every((row, i) => row[size - 1 - i].completed)) return true;
    return false;
  };

  const toggleTile = (r: number, c: number) => {
    const now = new Date().toISOString();
    const tile = bingoTiles[r][c];
    const isCompleting = !tile.completed;
    
    const newTiles = bingoTiles.map((row, rIdx) => 
      row.map((t, cIdx) => {
        if (rIdx === r && cIdx === c) {
          return { ...t, completed: isCompleting, completedAt: isCompleting ? now : undefined };
        }
        return t;
      })
    );
    setBingoTiles(newTiles);

    let xpChange = tile.xpValue || 10;
    if (tile.isGolden) xpChange *= 2;

    if (isCompleting) {
      // Add to history
      const newEntry: HistoryEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        taskName: tile.taskName,
        completedAt: now,
        type: 'task',
        xpEarned: xpChange
      };
      setHistory(prev => [...prev, newEntry]);
      
      if (user) {
        let newXp = user.xp + xpChange;
        let newLevel = user.level;
        let newNextLevelXp = user.nextLevelXp;
        let newBalance = user.balance + xpChange;
        
        while (newXp >= newNextLevelXp) {
          newXp -= newNextLevelXp;
          newLevel += 1;
          newNextLevelXp = Math.floor(newNextLevelXp * 1.2);
          playSound('levelUp');
          triggerHaptic('heavy');
        }
        
        setUser({ ...user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance });
        
        const isEarlyBird = new Date().getHours() < 7;
        setStats(prev => ({ 
          ...prev, 
          totalXp: prev.totalXp + xpChange,
          totalCompleted: prev.totalCompleted + 1,
          goldenTilesCompleted: prev.goldenTilesCompleted + (tile.isGolden ? 1 : 0),
          earlyBirdCount: prev.earlyBirdCount + (isEarlyBird ? 1 : 0)
        }));
      }

      playSound('complete');
      triggerHaptic('light');

      // Check for Bingo
      if (checkBingo(newTiles, r, c)) {
        playSound('bingo');
        triggerHaptic('medium');
        setStats(prev => ({ ...prev, bingosCount: prev.bingosCount + 1 }));
      }

      // Check for Full House
      const isFullHouse = newTiles.every(row => row.every(t => t.completed));
      if (isFullHouse) {
        playSound('bingo');
        triggerHaptic('heavy');
        setStats(prev => ({ ...prev, fullHousesCount: prev.fullHousesCount + 1 }));
      }
    } else {
      // Remove from history (latest one for this task)
      setHistory(prev => {
        const lastIdx = [...prev].reverse().findIndex(h => h.taskName === tile.taskName);
        if (lastIdx !== -1) {
          const actualIdx = prev.length - 1 - lastIdx;
          return prev.filter((_, i) => i !== actualIdx);
        }
        return prev;
      });

      // Deduct XP and Balance
      if (user) {
        let newXp = user.xp - xpChange;
        let newLevel = user.level;
        let newNextLevelXp = user.nextLevelXp;
        let newBalance = Math.max(0, user.balance - xpChange);

        if (newXp < 0) {
          if (newLevel > 1) {
            newLevel -= 1;
            newNextLevelXp = Math.max(100, Math.floor(newNextLevelXp / 1.2));
            newXp = newNextLevelXp + newXp;
          } else {
            newXp = 0;
          }
        }

        setUser({ ...user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance });
        
        const isEarlyBird = tile.completedAt ? new Date(tile.completedAt).getHours() < 7 : false;
        setStats(prev => ({ 
          ...prev, 
          totalXp: Math.max(0, prev.totalXp - xpChange),
          totalCompleted: Math.max(0, prev.totalCompleted - 1),
          goldenTilesCompleted: Math.max(0, prev.goldenTilesCompleted - (tile.isGolden ? 1 : 0)),
          earlyBirdCount: Math.max(0, prev.earlyBirdCount - (isEarlyBird ? 1 : 0))
        }));
      }
    }
  };

  const deleteHistoryEntry = (id: string) => {
    const entryToDelete = history.find(h => h.id === id);
    if (!entryToDelete) return;

    setHistory(prev => prev.filter(h => h.id !== id));

    // Find the tile to get its XP value
    let xpToDeduct = 10;
    bingoTiles.forEach(row => row.forEach(tile => {
      if (tile.taskName === entryToDelete.taskName) {
        xpToDeduct = tile.xpValue || 10;
        if (tile.isGolden) xpToDeduct *= 2;
      }
    }));

    // Deduct XP
    if (user) {
      let newXp = user.xp - xpToDeduct;
      let newLevel = user.level;
      let newNextLevelXp = user.nextLevelXp;
      let newBalance = Math.max(0, user.balance - xpToDeduct);

      if (newXp < 0) {
        if (newLevel > 1) {
          newLevel -= 1;
          newNextLevelXp = Math.max(100, Math.floor(newNextLevelXp / 1.2));
          newXp = newNextLevelXp + newXp;
        } else {
          newXp = 0;
        }
      }
      setUser({ ...user, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp, balance: newBalance });
      setStats(prev => ({ ...prev, totalXp: Math.max(0, prev.totalXp - xpToDeduct) }));
    }

    // If it's a task from today, uncheck it
    setBingoTiles(prev => prev.map(row => row.map(tile => {
      if (tile.taskName === entryToDelete.taskName && tile.completed) {
        return { ...tile, completed: false, completedAt: undefined };
      }
      return tile;
    })));
  };

  const buyItem = (item: ShopItem) => {
    if (!user || user.balance < item.cost) return;

    setUser({ ...user, balance: user.balance - item.cost });
    playSound('complete');
    triggerHaptic('medium');
    
    // Track shop achievement
    setStats(prev => ({ ...prev, totalSpent: prev.totalSpent + item.cost }));
    
    // In a real app, we'd add this to a "Purchased Items" list
    alert(`成功购买: ${item.name}！快去享受吧~`);
  };

  const addCustomAchievement = (title: string, requirement: string, icon: string) => {
    const newAchievement: Achievement = {
      id: 'custom-' + Date.now(),
      title,
      description: title,
      requirement,
      icon,
      unlocked: false,
      isCustom: true,
      category: 'custom'
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  const toggleAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === id) {
        const isUnlocking = !a.unlocked;
        if (isUnlocking) {
          playSound('bingo');
          triggerHaptic('heavy');
        }
        return { ...a, unlocked: isUnlocking, unlockedAt: isUnlocking ? new Date().toISOString() : undefined };
      }
      return a;
    }));
  };

  const addShopItem = (item: Omit<ShopItem, 'id'>) => {
    const newItem: ShopItem = {
      ...item,
      id: 'shop-' + Date.now()
    };
    setShopItems(prev => [...prev, newItem]);
  };

  const updateShopItem = (item: ShopItem) => {
    setShopItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteShopItem = (id: string) => {
    setShopItems(prev => prev.filter(i => i.id !== id));
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const login = (userData: User) => {
    setUser(userData);
    setActiveTab('today');
  };

  const logout = () => {
    setUser(null);
    setActiveTab('today');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const toggleTask = (groupId: string, taskId: string) => {
    setTaskGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: group.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return group;
    }));
  };

  const addGroup = (name: string) => {
    const newGroup: TaskGroup = {
      id: Date.now().toString(),
      name,
      tasks: []
    };
    setTaskGroups(prev => [...prev, newGroup]);
  };

  const deleteGroup = (groupId: string) => {
    setTaskGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const editGroup = (groupId: string, name: string) => {
    setTaskGroups(prev => prev.map(g => g.id === groupId ? { ...g, name } : g));
  };

  const updateTask = (groupId: string, taskId: string, updates: Partial<Task>) => {
    setTaskGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: group.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      return group;
    }));
  };

  const addTask = (groupId: string, name: string, updates?: Partial<Task>) => {
    const newTask: Task = { 
      id: Date.now().toString(), 
      name, 
      completed: false,
      difficulty: 'easy',
      priority: 'medium',
      xpValue: 10,
      ...updates
    };
    setTaskGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, tasks: [...g.tasks, newTask] };
      }
      return g;
    }));
  };

  const deleteTask = (groupId: string, taskId: string) => {
    setTaskGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, tasks: g.tasks.filter(t => t.id !== taskId) };
      }
      return g;
    }));
  };

  const shuffleTasks = () => {
    setTaskGroups(prev => prev.map(group => ({
      ...group,
      tasks: [...group.tasks].sort(() => Math.random() - 0.5)
    })));
  };

  const clearAllTasks = () => {
    setTaskGroups(prev => prev.map(group => ({
      ...group,
      tasks: group.tasks.map(t => ({ ...t, completed: false }))
    })));
  };

  const sortTasks = () => {
    setTaskGroups(prev => prev.map(group => ({
      ...group,
      tasks: [...group.tasks].sort((a, b) => a.name.localeCompare(b.name))
    })));
  };

  const toggleGroupTasks = (groupId: string, completed: boolean) => {
    setTaskGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          tasks: g.tasks.map(t => ({ ...t, completed }))
        };
      }
      return g;
    }));
  };

  const applyGroupToGrid = (groupId: string) => {
    const group = taskGroups.find(g => g.id === groupId);
    if (!group) return;

    const tasks = group.tasks;
    const newTiles = bingoTiles.map(row => row.map(tile => ({ ...tile })));
    
    // 根据格子大小确定金色格子的数量范围
    let goldenMin = 0, goldenMax = 0;
    if (gridSize === 3) {
      goldenMin = 0; goldenMax = 1;
    } else if (gridSize === 4) {
      goldenMin = 1; goldenMax = 2;
    } else if (gridSize === 5) {
      goldenMin = 2; goldenMax = 3;
    } else if (gridSize === 6) {
      goldenMin = 3; goldenMax = 4;
    }
    
    // 随机选择实际的金色格子数量
    const goldenCount = Math.floor(Math.random() * (goldenMax - goldenMin + 1)) + goldenMin;
    
    // 创建所有格子的位置列表
    const allPositions: { r: number; c: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        allPositions.push({ r, c });
      }
    }
    
    // 随机选择金色格子的位置
    const goldenPositions = new Set<string>();
    while (goldenPositions.size < goldenCount && allPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPositions.length);
      const pos = allPositions[randomIndex];
      goldenPositions.add(`${pos.r},${pos.c}`);
      allPositions.splice(randomIndex, 1);
    }
    
    let taskIdx = 0;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const isGolden = goldenPositions.has(`${r},${c}`);
        if (taskIdx < tasks.length) {
          const task = tasks[taskIdx];
          const taskDifficulty = task.difficulty || 'easy';
          const taskPriority = task.priority || 'medium';
          newTiles[r][c] = {
            ...newTiles[r][c],
            taskName: task.name,
            completed: false,
            difficulty: taskDifficulty,
            priority: taskPriority,
            xpValue: task.xpValue || calculateXP(taskDifficulty, taskPriority),
            isGolden: isGolden,
            isFreeTile: false
          };
          taskIdx++;
        } else {
          newTiles[r][c] = {
            ...newTiles[r][c],
            taskName: '新任务',
            completed: false,
            difficulty: 'easy',
            priority: 'medium',
            xpValue: calculateXP('easy', 'medium'),
            isGolden: false,
            isFreeTile: false
          };
        }
      }
    }
    setBingoTiles(newTiles);
    setActiveTab('today');
  };

  const applyTaskToGrid = (task: Task) => {
    const newTiles = bingoTiles.map(row => row.map(tile => ({ ...tile })));
    
    let foundEmptyTile = false;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!newTiles[r][c].completed && !foundEmptyTile) {
          const taskDifficulty = task.difficulty || 'easy';
          const taskPriority = task.priority || 'medium';
          newTiles[r][c] = {
            ...newTiles[r][c],
            taskName: task.name,
            completed: false,
            difficulty: taskDifficulty,
            priority: taskPriority,
            xpValue: task.xpValue || calculateXP(taskDifficulty, taskPriority),
            isGolden: false,
            isFreeTile: false
          };
          foundEmptyTile = true;
          break;
        }
      }
      if (foundEmptyTile) break;
    }
    
    setBingoTiles(newTiles);
    setActiveTab('today');
  };

  const applyMultipleTasksToGrid = (tasks: Task[]) => {
    const newTiles = bingoTiles.map(row => row.map(tile => ({ ...tile })));
    
    let taskIdx = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!newTiles[r][c].completed && taskIdx < tasks.length) {
          const task = tasks[taskIdx];
          const taskDifficulty = task.difficulty || 'easy';
          const taskPriority = task.priority || 'medium';
          newTiles[r][c] = {
            ...newTiles[r][c],
            taskName: task.name,
            completed: false,
            difficulty: taskDifficulty,
            priority: taskPriority,
            xpValue: task.xpValue || calculateXP(taskDifficulty, taskPriority),
            isGolden: false,
            isFreeTile: false
          };
          taskIdx++;
        }
      }
    }
    
    setBingoTiles(newTiles);
    setActiveTab('today');
  };

  const shuffleTiles = () => {
    const tiles = bingoTiles.flat();
    // 保存任务的完成状态
    const taskStatusMap = new Map();
    tiles.forEach(tile => {
      taskStatusMap.set(tile.taskName, {
        completed: tile.completed,
        completedAt: tile.completedAt
      });
    });
    
    // 打乱任务顺序
    const shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);
    
    // 恢复任务的完成状态
    const newTiles = [];
    for (let i = 0; i < bingoTiles.length; i++) {
      const row = [];
      for (let j = 0; j < bingoTiles[i].length; j++) {
        const tile = shuffledTiles[i * bingoTiles[i].length + j];
        const status = taskStatusMap.get(tile.taskName);
        row.push({
          ...tile,
          completed: status ? status.completed : false,
          completedAt: status ? status.completedAt : undefined
        });
      }
      newTiles.push(row);
    }
    
    setBingoTiles(newTiles);
  };

  const resetTiles = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    const newTiles = bingoTiles.map(row => row.map(tile => ({
      ...tile,
      completed: false
    })));
    setBingoTiles(newTiles);
    setIsResetConfirmOpen(false);
  };

  const updateTileNote = (r: number, c: number, note: string) => {
    setBingoTiles(prev => prev.map((row, rowIndex) => 
      row.map((tile, colIndex) => 
        rowIndex === r && colIndex === c 
          ? { ...tile, note, noteTimestamp: new Date().toISOString() } 
          : tile
      )
    ));
  };

  const handleGridSizeChange = (size: number) => {
    setGridSize(size);
    const newTiles: BingoTile[][] = [];
    const now = Date.now();
    for (let r = 0; r < size; r++) {
      const row: BingoTile[] = [];
      for (let c = 0; c < size; c++) {
        row.push({
          id: `b-${r}-${c}-${now}-${Math.random().toString(36).substr(2, 9)}`,
          taskName: '新任务',
          completed: false,
          isFreeTile: false
        });
      }
      newTiles.push(row);
    }
    setBingoTiles(newTiles);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['zinc', 'slate', 'gray', 'blue', 'rose', 'amber', 'emerald', 'violet', 'dark'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setSettings(prev => ({ ...prev, theme: themes[nextIndex] }));
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user} onLoginClick={() => setActiveTab('login')} theme={settings.theme}>
      <AnimatePresence mode="wait">
        {activeTab === 'login' && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LoginView onLogin={login} />
          </motion.div>
        )}
        {activeTab === 'today' && (
          <motion.div 
            key="today"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TodayView 
              tiles={bingoTiles} 
              onToggleTile={toggleTile} 
              onShuffle={shuffleTiles}
              onReset={resetTiles}
              onPomodoro={() => setActiveTab('pomodoro')}
              onStats={() => {
                setActiveTab('achievements');
                setActiveSubTab('stats');
              }}
              onThemeClick={cycleTheme}
              onUpdateTileNote={updateTileNote}
            />
          </motion.div>
        )}
        {activeTab === 'pomodoro' && (
          <motion.div 
            key="pomodoro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PomodoroView 
              onBack={() => setActiveTab('today')} 
              user={user}
              setUser={setUser}
              stats={stats}
              setStats={setStats}
              history={history}
              setHistory={setHistory}
              bingoTiles={bingoTiles}
              playSound={playSound}
              triggerHaptic={triggerHaptic}
            />
          </motion.div>
        )}
        {activeTab === 'tasks' && (
          <motion.div 
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TasksView 
              groups={taskGroups} 
              onToggleTask={toggleTask} 
              onAddGroup={addGroup}
              onDeleteGroup={deleteGroup}
              onEditGroup={editGroup}
              onUpdateTask={updateTask}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onApplyGroup={applyGroupToGrid}
              onApplyTask={applyTaskToGrid}
              onApplyMultipleTasks={applyMultipleTasksToGrid}
              gridSize={gridSize}
              onGridSizeChange={handleGridSizeChange}
              onShuffleTasks={shuffleTasks}
              onSortTasks={sortTasks}
              onToggleGroupTasks={toggleGroupTasks}
              bingoTiles={bingoTiles}
            />
          </motion.div>
        )}
        {activeTab === 'calendar' && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CalendarView 
              history={history} 
              onBackToToday={() => setActiveTab('today')} 
              onDeleteEntry={deleteHistoryEntry}
            />
          </motion.div>
        )}
        {activeTab === 'achievements' && (
          <motion.div 
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AchievementsView 
              achievements={achievements}
              stats={stats}
              history={history}
              onAddCustomAchievement={addCustomAchievement}
              onDeleteAchievement={deleteAchievement}
              onToggleAchievement={toggleAchievement}
              onUpdateAchievement={updateAchievement}
              initialViewMode={activeTab === 'achievements' && activeSubTab === 'stats' ? 'stats' : 'achievements'}
            />
          </motion.div>
        )}
        {activeTab === 'shop' && (
          <motion.div 
            key="shop"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ShopView 
              items={shopItems} 
              userBalance={user?.balance || 0} 
              onBuyItem={buyItem}
              onAddItem={addShopItem}
              onUpdateItem={updateShopItem}
              onDeleteItem={deleteShopItem}
            />
          </motion.div>
        )}
        {activeTab === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SettingsView 
              settings={settings} 
              onUpdateSettings={updateSettings} 
              user={user}
              onLogout={logout}
              onUpdateUser={updateUser}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetConfirmOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-surface-container-lowest rounded-[3rem] p-10 border border-outline-variant shadow-2xl space-y-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black tracking-tight uppercase">确认重置</h3>
                  <button onClick={() => setIsResetConfirmOpen(false)} className="p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-on-surface-variant text-sm font-medium">
                    确定要重置所有任务的完成状态吗？此操作无法撤销。
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                  >
                    取消
                  </button>
                  <button 
                    onClick={confirmReset}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                  >
                    确认重置
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

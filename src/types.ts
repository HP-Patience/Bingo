export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  name: string;
  completed: boolean;
  difficulty?: TaskDifficulty;
  priority?: TaskPriority;
  xpValue?: number;
  tags?: string[];
};

export type TaskGroup = {
  id: string;
  name: string;
  tasks: Task[];
};

export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export type BingoTile = {
  id: string;
  taskName: string;
  completed: boolean;
  completedAt?: string;
  isFreeTile?: boolean;
  difficulty?: TaskDifficulty;
  priority?: TaskPriority;
  isGolden?: boolean;
  xpValue?: number;
  note?: string;
  noteTimestamp?: string;
};

export type HistoryEntry = {
  id: string;
  taskName: string;
  completedAt: string;
  type?: 'task' | 'pomodoro';
  xpEarned?: number;
  duration?: number; // 任务耗时（分钟）
};

export type BingoGrid = BingoTile[][];

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  level?: number;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: string;
  category?: 'daily' | 'streak' | 'total' | 'special' | 'custom';
  isCustom?: boolean;
  requirement?: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  joinedAt: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  balance: number; // Spendable XP
  title?: string; // 等级头衔
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'snack' | 'entertainment' | 'fitness' | 'other';
  levelRequirement?: number; // 解锁等级要求
};

export type Stats = {
  totalCompleted: number;
  currentStreak: number;
  onTimeRate: number;
  bingosCount: number;
  mostProductiveDay: string;
  totalXp: number;
  fullHousesCount: number;
  goldenTilesCompleted: number;
  earlyBirdCount: number;
  nightOwlCount: number;
  totalSpent: number;
};

export type Theme = 'zinc' | 'slate' | 'gray' | 'blue' | 'rose' | 'amber' | 'emerald' | 'violet' | 'dark';

export type Settings = {
  theme: Theme;
};

export type GachaRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type GachaReward = {
  id: string;
  type: 'xp' | 'balance';
  value: number;
  valueMin: number;
  valueMax: number;
  rarity: GachaRarity;
  probability: number;
};

export type GachaPool = {
  id: string;
  name: string;
  levelRequirement: number;
  rewards: GachaReward[];
};

export type GachaHistoryEntry = {
  id: string;
  poolId: string;
  poolName: string;
  reward: GachaReward;
  actualValue: number;
  level: number;
  timestamp: string;
};

export type ShopHistoryEntry = {
  id: string;
  itemId: string;
  itemName: string;
  itemIcon: string;
  cost: number;
  level: number;
  timestamp: string;
};

export type GachaState = {
  availableDraws: number;
  lastDrawLevel: number;
  consecutiveLowRewards: number;
  consecutiveSameType: number;
  lastRewardType?: 'xp' | 'balance';
  history: GachaHistoryEntry[];
};

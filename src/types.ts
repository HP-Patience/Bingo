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
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'snack' | 'entertainment' | 'fitness' | 'other';
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
  totalSpent: number;
};

export type Theme = 'zinc' | 'slate' | 'gray' | 'blue' | 'rose' | 'amber' | 'emerald' | 'violet' | 'dark';

export type Settings = {
  theme: Theme;
};

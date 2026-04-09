-- 创建用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL DEFAULT '用户',
  email TEXT NOT NULL DEFAULT 'user@example.com',
  avatar TEXT NOT NULL DEFAULT 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8z5ltSb7aT8aRGkjwccNY_49vMFNUXiUt1hzVSdx-4j9zQuJeIThqhE-6cdEB42iPpabeiGihMyI7k6-k-SHOvMyPxCTT37ctTLd9ylfCUBWjmiwF06ZQ3r_uuSf1HDo2XIyN3wTA0sq6AsSYT-JYazsKPSyOdhXO4I8PBwEYhBjXVEbJoiSk3cTaxl7aye97QnblO-97kV_hnuu6aaRgGeZsMHa3-wXFzgZrpyZczKEcEbLazmwgZO0K3MarE25AJC7ZgguR4GLU',
  joinedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  nextLevelXp INTEGER NOT NULL DEFAULT 50,
  balance INTEGER NOT NULL DEFAULT 0,
  title TEXT DEFAULT NULL
);

-- 创建任务组表
CREATE TABLE task_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'
);

-- 创建宾果格子表
CREATE TABLE bingo_tiles (
  id TEXT PRIMARY KEY,
  grid JSONB NOT NULL DEFAULT '[]'
);

-- 创建历史记录表
CREATE TABLE history (
  id TEXT PRIMARY KEY,
  taskName TEXT NOT NULL,
  completedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL DEFAULT 'task',
  xpEarned INTEGER NOT NULL DEFAULT 0
);

-- 创建成就表
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked BOOLEAN NOT NULL DEFAULT false,
  unlockedAt TIMESTAMP DEFAULT NULL
);

-- 创建统计表
CREATE TABLE stats (
  id TEXT PRIMARY KEY,
  totalCompleted INTEGER NOT NULL DEFAULT 0,
  currentStreak INTEGER NOT NULL DEFAULT 0,
  bingosCount INTEGER NOT NULL DEFAULT 0,
  fullHousesCount INTEGER NOT NULL DEFAULT 0,
  totalXp INTEGER NOT NULL DEFAULT 0,
  earlyBirdCount INTEGER NOT NULL DEFAULT 0,
  goldenTilesCompleted INTEGER NOT NULL DEFAULT 0,
  nightOwlCount INTEGER NOT NULL DEFAULT 0
);

-- 创建设置表
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  theme TEXT NOT NULL DEFAULT 'zinc'
);

-- 创建网格大小表
CREATE TABLE grid_size (
  id TEXT PRIMARY KEY,
  size INTEGER NOT NULL DEFAULT 5
);

-- 创建商店物品表
CREATE TABLE shop_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'consumable',
  effect TEXT DEFAULT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  unlocked BOOLEAN NOT NULL DEFAULT false
);

-- 创建抽奖状态表
CREATE TABLE gacha (
  id TEXT PRIMARY KEY,
  availableDraws INTEGER NOT NULL DEFAULT 0,
  lastDrawLevel INTEGER NOT NULL DEFAULT 1,
  consecutiveLowRewards INTEGER NOT NULL DEFAULT 0,
  consecutiveSameType INTEGER NOT NULL DEFAULT 0,
  history JSONB NOT NULL DEFAULT '[]'
);

-- 创建商店历史表
CREATE TABLE shop_history (
  id TEXT PRIMARY KEY,
  itemId TEXT NOT NULL,
  itemName TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
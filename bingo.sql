-- 数据迁移：重命名旧列名以匹配新 schema（幂等，已重命名的会被跳过）
DO $$ BEGIN
  ALTER TABLE achievements RENAME COLUMN name TO title;
EXCEPTION WHEN others THEN END $$;
DO $$ BEGIN
  ALTER TABLE shop_items RENAME COLUMN price TO cost;
EXCEPTION WHEN others THEN END $$;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL DEFAULT '用户',
  email TEXT NOT NULL DEFAULT 'user@example.com',
  avatar TEXT NOT NULL DEFAULT '',
  joinedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  nextLevelXp INTEGER NOT NULL DEFAULT 50,
  balance INTEGER NOT NULL DEFAULT 0,
  title TEXT DEFAULT NULL
);

-- 创建任务组表
CREATE TABLE IF NOT EXISTS task_groups (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT 'folder',
  tasks JSONB NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, user_id)
);

-- 创建宾果格子表
CREATE TABLE IF NOT EXISTS bingo_tiles (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  grid JSONB NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, user_id)
);

-- 创建历史记录表
CREATE TABLE IF NOT EXISTS history (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  taskName TEXT NOT NULL,
  completedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL DEFAULT 'task',
  xpEarned INTEGER NOT NULL DEFAULT 0,
  duration INTEGER DEFAULT NULL,
  note TEXT DEFAULT NULL,
  noteTimestamp TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (id, user_id)
);

-- 创建成就表
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked BOOLEAN NOT NULL DEFAULT false,
  unlockedAt TIMESTAMP DEFAULT NULL,
  level INTEGER DEFAULT NULL,
  progress INTEGER DEFAULT NULL,
  maxProgress INTEGER DEFAULT NULL,
  category TEXT DEFAULT NULL,
  isCustom BOOLEAN DEFAULT false,
  requirement TEXT DEFAULT NULL,
  PRIMARY KEY (id, user_id)
);

-- 创建统计表
CREATE TABLE IF NOT EXISTS stats (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  totalCompleted INTEGER NOT NULL DEFAULT 0,
  currentStreak INTEGER NOT NULL DEFAULT 0,
  bingosCount INTEGER NOT NULL DEFAULT 0,
  fullHousesCount INTEGER NOT NULL DEFAULT 0,
  totalXp INTEGER NOT NULL DEFAULT 0,
  earlyBirdCount INTEGER NOT NULL DEFAULT 0,
  goldenTilesCompleted INTEGER NOT NULL DEFAULT 0,
  nightOwlCount INTEGER NOT NULL DEFAULT 0,
  onTimeRate INTEGER DEFAULT 100,
  mostProductiveDay TEXT DEFAULT NULL,
  totalSpent INTEGER DEFAULT 0,
  PRIMARY KEY (id, user_id)
);

-- 创建设置表
CREATE TABLE IF NOT EXISTS settings (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  theme TEXT NOT NULL DEFAULT 'zinc',
  showCellDetails BOOLEAN NOT NULL DEFAULT true,
  showAvatarEffect BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (id, user_id)
);

-- 迁移：为已有 settings 表添加 showCellDetails 列
DO $$ BEGIN
  ALTER TABLE settings ADD COLUMN showCellDetails BOOLEAN NOT NULL DEFAULT true;
EXCEPTION WHEN others THEN END $$;

-- 迁移：为已有 settings 表添加 showAvatarEffect 列
DO $$ BEGIN
  ALTER TABLE settings ADD COLUMN showAvatarEffect BOOLEAN NOT NULL DEFAULT true;
EXCEPTION WHEN others THEN END $$;

-- 创建网格大小表
CREATE TABLE IF NOT EXISTS grid_size (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  size INTEGER NOT NULL DEFAULT 5,
  PRIMARY KEY (id, user_id)
);

-- 创建商店物品表
CREATE TABLE IF NOT EXISTS shop_items (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cost INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'consumable',
  category TEXT DEFAULT 'other',
  levelRequirement INTEGER DEFAULT 1,
  effect TEXT DEFAULT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common',
  unlocked BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id, user_id)
);

-- 创建抽奖状态表
CREATE TABLE IF NOT EXISTS gacha (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  availableDraws INTEGER NOT NULL DEFAULT 0,
  totalDrawsSpent INTEGER NOT NULL DEFAULT 0,
  consecutiveLowRewards INTEGER NOT NULL DEFAULT 0,
  consecutiveSameType INTEGER NOT NULL DEFAULT 0,
  lastRewardType TEXT DEFAULT NULL,
  history JSONB NOT NULL DEFAULT '[]',
  lastFreeDrawDate TEXT DEFAULT NULL,
  freeDrawUsed BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (id, user_id)
);

-- 创建商店历史表
CREATE TABLE IF NOT EXISTS shop_history (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  itemId TEXT NOT NULL,
  itemName TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  itemIcon TEXT DEFAULT NULL,
  level INTEGER DEFAULT NULL,
  cost INTEGER DEFAULT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

-- ========== RLS Policies: 用户只能访问自己的数据 ==========

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE bingo_tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid_size ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gacha ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_history ENABLE ROW LEVEL SECURITY;

-- users 表：id 就是 auth.uid()
DROP POLICY IF EXISTS "users_manage_own" ON users;
CREATE POLICY "users_manage_own" ON users FOR ALL
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- 其余表：通过 user_id 关联，显式 USING + WITH CHECK
DROP POLICY IF EXISTS "task_groups_own" ON task_groups;
CREATE POLICY "task_groups_own" ON task_groups FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "bingo_tiles_own" ON bingo_tiles;
CREATE POLICY "bingo_tiles_own" ON bingo_tiles FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "history_own" ON history;
CREATE POLICY "history_own" ON history FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "achievements_own" ON achievements;
CREATE POLICY "achievements_own" ON achievements FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "stats_own" ON stats;
CREATE POLICY "stats_own" ON stats FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "settings_own" ON settings;
CREATE POLICY "settings_own" ON settings FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "grid_size_own" ON grid_size;
CREATE POLICY "grid_size_own" ON grid_size FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "shop_items_own" ON shop_items;
CREATE POLICY "shop_items_own" ON shop_items FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "gacha_own" ON gacha;
CREATE POLICY "gacha_own" ON gacha FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "shop_history_own" ON shop_history;
CREATE POLICY "shop_history_own" ON shop_history FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

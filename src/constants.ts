import { TaskGroup, BingoTile, Achievement, Stats, Settings, ShopItem, GachaReward, GachaPool } from './types';

export const INITIAL_TASK_GROUPS: TaskGroup[] = [
  {
    id: 'default',
    name: '默认任务池',
    tasks: [
      { id: 'd1', name: '晨起一杯温水', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
      { id: 'd2', name: '整理床铺', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
      { id: 'd3', name: '冥想 5 分钟', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
      { id: 'd4', name: '阅读 15 分钟', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
      { id: 'd5', name: '深蹲 20 次', completed: false, difficulty: 'medium', priority: 'low', xpValue: 20 },
      { id: 'd6', name: '写下 3 件感恩的事', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
      { id: 'd7', name: '清理电脑桌面', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
      { id: 'd8', name: '学习 10 个新单词', completed: false, difficulty: 'medium', priority: 'high', xpValue: 30 },
      { id: 'd9', name: '不喝含糖饮料', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
      { id: 'd10', name: '整理今日待办', completed: false, difficulty: 'easy', priority: 'high', xpValue: 20 },
      { id: 'd11', name: '给绿植浇水', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
      { id: 'd12', name: '午后散步 10 分钟', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
      { id: 'd13', name: '听一首纯音乐', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
      { id: 'd14', name: '整理房间 10 分钟', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
      { id: 'd15', name: '练习书法/手绘', completed: false, difficulty: 'medium', priority: 'low', xpValue: 20 },
      { id: 'd16', name: '复盘今日工作', completed: false, difficulty: 'medium', priority: 'high', xpValue: 30 },
      { id: 'd17', name: '睡前拉伸', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
      { id: 'd18', name: '记录一笔开支', completed: false, difficulty: 'easy', priority: 'high', xpValue: 20 },
      { id: 'd19', name: '吃一份水果', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
      { id: 'd20', name: '清理手机相册', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
      { id: 'd21', name: '尝试一道新菜', completed: false, difficulty: 'hard', priority: 'low', xpValue: 30 },
      { id: 'd22', name: '深度思考 10 分钟', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
      { id: 'd23', name: '早睡 30 分钟', completed: false, difficulty: 'medium', priority: 'high', xpValue: 30 },
      { id: 'd24', name: '整理书架', completed: false, difficulty: 'medium', priority: 'low', xpValue: 20 },
      { id: 'd25', name: '给远方朋友发消息', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
    ],
  },
  {
    id: '1',
    name: '健康生活',
    tasks: [
      { id: '1-1', name: '统计学', completed: false, difficulty: 'hard', priority: 'high', xpValue: 40 },
      { id: '1-2', name: '无氧', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
      { id: '1-3', name: '有氧', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
      { id: '1-4', name: '蛋白饮', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
      { id: '1-5', name: '伸展运动', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
      { id: '1-6', name: '阅读 30min', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
      { id: '1-7', name: '冥想', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
      { id: '1-8', name: '早睡', completed: false, difficulty: 'medium', priority: 'high', xpValue: 30 },
    ],
  },
];

export const INITIAL_BINGO_TILES: BingoTile[][] = [
  [
    { id: 'b1-1', taskName: '晨起一杯温水', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
    { id: 'b1-2', taskName: '整理床铺', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
    { id: 'b1-3', taskName: '冥想 5 分钟', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
    { id: 'b1-4', taskName: '阅读 15 分钟', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
    { id: 'b1-5', taskName: '深蹲 20 次', completed: false, difficulty: 'medium', priority: 'low', xpValue: 20 },
  ],
  [
    { id: 'b2-1', taskName: '写下 3 件感恩的事', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
    { id: 'b2-2', taskName: '清理电脑桌面', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
    { id: 'b2-3', taskName: '学习 10 个新单词', completed: false, difficulty: 'medium', priority: 'high', xpValue: 30, isGolden: true },
    { id: 'b2-4', taskName: '不喝含糖饮料', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
    { id: 'b2-5', taskName: '整理今日待办', completed: false, difficulty: 'easy', priority: 'high', xpValue: 20 },
  ],
  [
    { id: 'b3-1', taskName: '给绿植浇水', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
    { id: 'b3-2', taskName: '午后散步 10 分钟', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
    { id: 'b3-3', taskName: '听一首纯音乐', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
    { id: 'b3-4', taskName: '整理房间 10 分钟', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
    { id: 'b3-5', taskName: '练习书法/手绘', completed: false, difficulty: 'medium', priority: 'low', xpValue: 20 },
  ],
  [
    { id: 'b4-1', taskName: '复盘今日工作', completed: false, difficulty: 'medium', priority: 'high', xpValue: 30 },
    { id: 'b4-2', taskName: '睡前拉伸', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
    { id: 'b4-3', taskName: '记录一笔开支', completed: false, difficulty: 'easy', priority: 'high', xpValue: 20 },
    { id: 'b4-4', taskName: '吃一份水果', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
    { id: 'b4-5', taskName: '清理手机相册', completed: false, difficulty: 'easy', priority: 'low', xpValue: 10 },
  ],
  [
    { id: 'b5-1', taskName: '尝试一道新菜', completed: false, difficulty: 'hard', priority: 'low', xpValue: 30 },
    { id: 'b5-2', taskName: '深度思考 10 分钟', completed: false, difficulty: 'medium', priority: 'medium', xpValue: 25 },
    { id: 'b5-3', taskName: '早睡 30 分钟', completed: false, difficulty: 'medium', priority: 'high', xpValue: 30 },
    { id: 'b5-4', taskName: '整理书架', completed: false, difficulty: 'medium', priority: 'low', xpValue: 20 },
    { id: 'b5-5', taskName: '给远方朋友发消息', completed: false, difficulty: 'easy', priority: 'medium', xpValue: 15 },
  ],
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '初露锋芒', description: '完成你的第一个任务', icon: 'zap', unlocked: false },
  { id: 'a2', title: '坚持不懈', description: '连续 3 天完成任务', icon: 'alarm-clock', unlocked: false },
  { id: 'a3', title: 'Bingo 达人', description: '达成 10 次 Bingo 连线', icon: 'trophy', unlocked: false },
  { id: 'a4', title: '全勤标兵', description: '完成一次完整的 5x5 棋盘', icon: 'egg', unlocked: false },
  { id: 'a5', title: '经验专家', description: '累计获得 1000 XP', icon: 'zap', unlocked: false },
  { id: 'a6', title: '早起鸟', description: '在早晨 7 点前完成任务', icon: 'sun', unlocked: false },
  { id: 'a7', title: '金牌选手', description: '完成 5 个金色格子任务', icon: 'star', unlocked: false },
  { id: 'a8', title: '夜猫子', description: '在晚上 11 点后完成任务', icon: 'moon', unlocked: false },
  { id: 'a9', title: '任务大师', description: '完成 50 个任务', icon: 'trophy', unlocked: false },
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  { id: 's1', name: '美味零食', description: '奖励自己一包薯片或巧克力', cost: 100, icon: 'cookie', category: 'snack', levelRequirement: 1 },
  { id: 's2', name: '电影之夜', description: '看一场期待已久的电影', cost: 300, icon: 'film', category: 'entertainment', levelRequirement: 1 },
  { id: 's3', name: '游戏时间', description: '畅玩 1 小时电子游戏', cost: 200, icon: 'gamepad-2', category: 'entertainment', levelRequirement: 1 },
  { id: 's4', name: '户外约会', description: '和心爱的人出去走走', cost: 500, icon: 'heart', category: 'entertainment', levelRequirement: 1 },
  { id: 's5', name: '深度阅读', description: '静心阅读 1 小时', cost: 150, icon: 'book-open', category: 'fitness', levelRequirement: 1 },
  { id: 's6', name: '按摩放松', description: '缓解一天的疲劳', cost: 800, icon: 'sparkles', category: 'other', levelRequirement: 1 },
  // 30级专属奖励
  { id: 's7', name: '豪华度假', description: '享受一次豪华度假', cost: 5000, icon: 'airplane', category: 'entertainment', levelRequirement: 30 },
  { id: 's8', name: '高级装备', description: '购买高级健身装备', cost: 3000, icon: 'dumbbell', category: 'fitness', levelRequirement: 30 },
  { id: 's9', name: '私人教练', description: '聘请私人教练', cost: 8000, icon: 'user', category: 'fitness', levelRequirement: 30 },
  { id: 's10', name: '豪华晚餐', description: '享用豪华晚餐', cost: 2000, icon: 'utensils', category: 'snack', levelRequirement: 30 },
  { id: 's11', name: 'VIP体验', description: '享受VIP服务', cost: 10000, icon: 'crown', category: 'other', levelRequirement: 30 },
];

// 30级专属奖励池
export const VIP_SHOP_ITEMS: ShopItem[] = [
  { id: 'v1', name: '豪华度假', description: '享受一次豪华度假', cost: 5000, icon: 'airplane', category: 'entertainment' },
  { id: 'v2', name: '高级装备', description: '购买高级健身装备', cost: 3000, icon: 'dumbbell', category: 'fitness' },
  { id: 'v3', name: '私人教练', description: '聘请私人教练', cost: 8000, icon: 'user', category: 'fitness' },
  { id: 'v4', name: '豪华晚餐', description: '享用豪华晚餐', cost: 2000, icon: 'utensils', category: 'snack' },
  { id: 'v5', name: 'VIP体验', description: '享受VIP服务', cost: 10000, icon: 'crown', category: 'other' },
];

export const INITIAL_STATS: Stats = {
  totalCompleted: 0,
  currentStreak: 0,
  onTimeRate: 100,
  bingosCount: 0,
  mostProductiveDay: '-',
  totalXp: 0,
  fullHousesCount: 0,
  goldenTilesCompleted: 0,
  earlyBirdCount: 0,
  nightOwlCount: 0,
  totalSpent: 0,
};

export const INITIAL_SETTINGS: Settings = {
  theme: 'zinc',
};

// 初级奖池（1-5级）
export const GACHA_POOL_BEGINNER: GachaPool = {
  id: 'beginner',
  name: '新手奖池',
  levelRequirement: 1,
  rewards: [
    { id: 'b1', type: 'xp', value: 0, valueMin: 30, valueMax: 60, rarity: 'common', probability: 35 },
    { id: 'b2', type: 'xp', value: 0, valueMin: 60, valueMax: 100, rarity: 'rare', probability: 15 },
    { id: 'b3', type: 'balance', value: 0, valueMin: 24, valueMax: 48, rarity: 'common', probability: 35 },
    { id: 'b4', type: 'balance', value: 0, valueMin: 48, valueMax: 80, rarity: 'rare', probability: 15 },
  ],
};

// 中级奖池（6-15级）
export const GACHA_POOL_INTERMEDIATE: GachaPool = {
  id: 'intermediate',
  name: '进阶奖池',
  levelRequirement: 6,
  rewards: [
    { id: 'i1', type: 'xp', value: 0, valueMin: 120, valueMax: 200, rarity: 'common', probability: 32.5 },
    { id: 'i2', type: 'xp', value: 0, valueMin: 200, valueMax: 350, rarity: 'rare', probability: 17.5 },
    { id: 'i3', type: 'balance', value: 0, valueMin: 96, valueMax: 160, rarity: 'common', probability: 32.5 },
    { id: 'i4', type: 'balance', value: 0, valueMin: 160, valueMax: 280, rarity: 'rare', probability: 17.5 },
  ],
};

// 高级奖池（16-29级）
export const GACHA_POOL_ADVANCED: GachaPool = {
  id: 'advanced',
  name: '高级奖池',
  levelRequirement: 16,
  rewards: [
    { id: 'a1', type: 'xp', value: 0, valueMin: 600, valueMax: 900, rarity: 'common', probability: 32.5 },
    { id: 'a2', type: 'xp', value: 0, valueMin: 900, valueMax: 1400, rarity: 'rare', probability: 17.5 },
    { id: 'a3', type: 'balance', value: 0, valueMin: 480, valueMax: 720, rarity: 'common', probability: 32.5 },
    { id: 'a4', type: 'balance', value: 0, valueMin: 720, valueMax: 1120, rarity: 'rare', probability: 17.5 },
  ],
};

// 传说奖池（30级及以上）
export const GACHA_POOL_LEGENDARY: GachaPool = {
  id: 'legendary',
  name: '传说奖池',
  levelRequirement: 30,
  rewards: [
    { id: 'l1', type: 'xp', value: 0, valueMin: 1200, valueMax: 1800, rarity: 'common', probability: 27.5 },
    { id: 'l2', type: 'xp', value: 0, valueMin: 1800, valueMax: 3000, rarity: 'rare', probability: 22.5 },
    { id: 'l3', type: 'balance', value: 0, valueMin: 960, valueMax: 1440, rarity: 'common', probability: 27.5 },
    { id: 'l4', type: 'balance', value: 0, valueMin: 1440, valueMax: 2400, rarity: 'rare', probability: 22.5 },
  ],
};

// 所有奖池
export const ALL_GACHA_POOLS: GachaPool[] = [
  GACHA_POOL_BEGINNER,
  GACHA_POOL_INTERMEDIATE,
  GACHA_POOL_ADVANCED,
  GACHA_POOL_LEGENDARY,
];

// 抽奖频率规则
export const GACHA_FREQUENCY = {
  '1-5': 1, // 每1级抽1次
  '6-15': 1, // 每1级抽1次
  '16-29': 2, // 每2级抽1次
  '30+': 2, // 每2级抽1次
};

// 保底机制
export const GACHA_GUARANTEE = {
  consecutiveLowRewards: 3, // 连续3次低奖励后保底中高
  consecutiveSameType: 5, // 连续5次同类型后必换类型
};

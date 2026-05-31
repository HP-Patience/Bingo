import { TaskGroup, BingoTile, Achievement, Stats, Settings, ShopItem, GachaReward, GachaPool } from './types';

export const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%236f797a'/><text x='50' y='68' text-anchor='middle' font-size='48'>👤</text></svg>");

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

// 固定奖池（全等级通用） 比例 普通60% 稀有25% 史诗10% 传说5%
export const GACHA_POOL: GachaPool = {
  id: 'fixed',
  name: '抽奖奖池',
  levelRequirement: 1,
  rewards: [
    { id: 'f1', type: 'xp', value: 0, valueMin: 30, valueMax: 50, rarity: 'common', probability: 30 },
    { id: 'f2', type: 'xp', value: 0, valueMin: 80, valueMax: 120, rarity: 'rare', probability: 12.5 },
    { id: 'f3', type: 'xp', value: 0, valueMin: 200, valueMax: 300, rarity: 'epic', probability: 5 },
    { id: 'f4', type: 'xp', value: 0, valueMin: 500, valueMax: 800, rarity: 'legendary', probability: 2.5 },
    { id: 'f5', type: 'balance', value: 0, valueMin: 20, valueMax: 40, rarity: 'common', probability: 30 },
    { id: 'f6', type: 'balance', value: 0, valueMin: 65, valueMax: 100, rarity: 'rare', probability: 12.5 },
    { id: 'f7', type: 'balance', value: 0, valueMin: 160, valueMax: 240, rarity: 'epic', probability: 5 },
    { id: 'f8', type: 'balance', value: 0, valueMin: 400, valueMax: 650, rarity: 'legendary', probability: 2.5 },
  ],
};

// 所有奖池
export const ALL_GACHA_POOLS: GachaPool[] = [GACHA_POOL];

// 抽奖频率规则
export const GACHA_FREQUENCY = {
  '1-5': 1,
  '6-15': 1,
  '16-29': 1,
  '30+': 1,
};

// 保底机制
export const GACHA_GUARANTEE = {
  consecutiveLowRewards: 3, // 连续3次低奖励后保底中高
  consecutiveSameType: 5, // 连续5次同类型后必换类型
};

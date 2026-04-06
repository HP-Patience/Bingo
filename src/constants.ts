import { TaskGroup, BingoTile, Achievement, Stats, Settings, ShopItem } from './types';

export const INITIAL_TASK_GROUPS: TaskGroup[] = [
  {
    id: 'default',
    name: '默认任务池 (25)',
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
      { id: '1-1', name: '统计学', completed: true, difficulty: 'hard', priority: 'high', xpValue: 40 },
      { id: '1-2', name: '无氧', completed: true, difficulty: 'medium', priority: 'medium', xpValue: 25 },
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
    { id: 'b1-1', taskName: '喝咖啡', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b1-2', taskName: '吃药', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b1-3', taskName: '蛋白饮', completed: false, difficulty: 'medium', xpValue: 20 },
    { id: 'b1-4', taskName: '喝水', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b1-5', taskName: '阅读5分钟', completed: false, difficulty: 'easy', xpValue: 10 },
  ],
  [
    { id: 'b2-1', taskName: '遛狗', completed: false, difficulty: 'medium', xpValue: 20 },
    { id: 'b2-2', taskName: '整理床铺', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b2-3', taskName: '日记', completed: false, difficulty: 'medium', xpValue: 20, isGolden: true },
    { id: 'b2-4', taskName: '查收信件', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b2-5', taskName: '拉伸', completed: false, difficulty: 'medium', xpValue: 20 },
  ],
  [
    { id: 'b3-1', taskName: '护肤', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b3-2', taskName: '吃水果', completed: false, difficulty: 'easy', xpValue: 10 },
    { id: 'b3-3', taskName: '自由格', completed: true, isFreeTile: true, xpValue: 5 },
    { id: 'b3-4', taskName: '给妈妈打电话', completed: false, difficulty: 'medium', xpValue: 20 },
    { id: 'b3-5', taskName: '洗碗', completed: true, difficulty: 'medium', xpValue: 20 },
  ],
  [
    { id: 'b4-1', taskName: '洗澡', completed: false, difficulty: 'easy', xpValue: 10 },
    { id: 'b4-2', taskName: '维他命', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b4-3', taskName: '邮件', completed: false, difficulty: 'medium', xpValue: 20 },
    { id: 'b4-4', taskName: '付账单', completed: true, difficulty: 'hard', xpValue: 50 },
    { id: 'b4-5', taskName: '洗衣服', completed: false, difficulty: 'medium', xpValue: 20 },
  ],
  [
    { id: 'b5-1', taskName: '健康零食', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b5-2', taskName: '整理书桌', completed: false, difficulty: 'medium', xpValue: 20 },
    { id: 'b5-3', taskName: '不喝苏打水', completed: true, difficulty: 'easy', xpValue: 10 },
    { id: 'b5-4', taskName: '浇花', completed: false, difficulty: 'easy', xpValue: 10 },
    { id: 'b5-5', taskName: '计划明天', completed: false, difficulty: 'medium', xpValue: 20 },
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
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  { id: 's1', name: '美味零食', description: '奖励自己一包薯片或巧克力', cost: 100, icon: 'cookie', category: 'snack' },
  { id: 's2', name: '电影之夜', description: '看一场期待已久的电影', cost: 300, icon: 'film', category: 'entertainment' },
  { id: 's3', name: '游戏时间', description: '畅玩 1 小时电子游戏', cost: 200, icon: 'gamepad-2', category: 'entertainment' },
  { id: 's4', name: '户外约会', description: '和心爱的人出去走走', cost: 500, icon: 'heart', category: 'entertainment' },
  { id: 's5', name: '深度阅读', description: '静心阅读 1 小时', cost: 150, icon: 'book-open', category: 'fitness' },
  { id: 's6', name: '按摩放松', description: '缓解一天的疲劳', cost: 800, icon: 'sparkles', category: 'other' },
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
  totalSpent: 0,
};

export const INITIAL_SETTINGS: Settings = {
  theme: 'zinc',
};

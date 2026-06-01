import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logError(context: string) {
  return (error: unknown) => console.error(`Error ${context}:`, error);
}

// Supabase 数据库列名全部小写（PostgreSQL 折叠未引用的标识符），
// 但应用代码使用 camelCase。这些函数在 API 边界做双向转换。

const LOWER_TO_CAMEL: Record<string, string> = {};

// 所有应用中可能的 camelCase 键名，用于构建反向映射
const CAMEL_KEYS = [
  'joinedAt', 'nextLevelXp',
  'taskName', 'completedAt', 'xpEarned', 'noteTimestamp',
  'unlockedAt', 'maxProgress', 'isCustom',
  'totalCompleted', 'currentStreak', 'onTimeRate', 'bingosCount',
  'mostProductiveDay', 'totalXp', 'fullHousesCount', 'goldenTilesCompleted',
  'earlyBirdCount', 'nightOwlCount', 'totalSpent',
  'itemId', 'itemName', 'itemIcon',
  'availableDraws', 'lastDrawLevel', 'consecutiveLowRewards',
  'consecutiveSameType', 'lastRewardType',
  'levelRequirement', 'lastFreeDrawDate',
];
for (const key of CAMEL_KEYS) {
  LOWER_TO_CAMEL[key.toLowerCase()] = key;
}

// 将对象键名转为全小写（写入 Supabase 时使用）
export function toDB<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[k.toLowerCase()] = v;
  }
  return result;
}

// 将对象键名从全小写转为 camelCase（从 Supabase 读取时使用）
export function fromDB<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[LOWER_TO_CAMEL[k] || k] = v;
  }
  return result as T;
}
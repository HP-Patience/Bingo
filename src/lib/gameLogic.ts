import type { TaskDifficulty, TaskPriority } from '../types';

export const XP_PER_LEVEL = 200;

export function calculateXP(difficulty: TaskDifficulty, priority: TaskPriority): number {
  let baseXP = 10;
  switch (difficulty) {
    case 'easy': baseXP = 10; break;
    case 'medium': baseXP = 20; break;
    case 'hard': baseXP = 30; break;
  }
  switch (priority) {
    case 'low': break;
    case 'medium': baseXP += 5; break;
    case 'high': baseXP += 10; break;
  }
  return baseXP;
}

export function getTitleForLevel(level: number): string | undefined {
  if (level >= 50) return '超越不朽';
  if (level >= 40) return '神话级';
  if (level >= 30) return '传说级';
  if (level >= 20) return '大师级';
  if (level >= 10) return '资深玩家';
  return undefined;
}

export function getNextLevelXp(): number {
  return XP_PER_LEVEL;
}

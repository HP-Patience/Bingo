import type { TaskDifficulty, TaskPriority } from '../types';

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

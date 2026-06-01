import { GachaPool, GachaReward, GachaState, GachaRarity, GachaHistoryEntry } from './types';
import { GACHA_POOL, GACHA_DRAWS_PER_LEVEL, GACHA_GUARANTEE } from './constants';

export const getDrawsPerLevel = (level: number): number => {
  // 低等级每级 1 次，高等级（20级+）每级 2 次
  if (level >= 20) return 2;
  return 1;
};

export const drawReward = (pool: GachaPool, gachaState: GachaState): { reward: GachaReward; actualValue: number; newState: GachaState } => {
  let rewards = [...pool.rewards];
  
  if (gachaState.consecutiveLowRewards >= GACHA_GUARANTEE.consecutiveLowRewards) {
    rewards = pool.rewards.filter(r => r.rarity === 'rare' || r.rarity === 'epic' || r.rarity === 'legendary');
  }
  
  if (gachaState.consecutiveSameType >= GACHA_GUARANTEE.consecutiveSameType && gachaState.lastRewardType) {
    const otherType = gachaState.lastRewardType === 'xp' ? 'balance' : 'xp';
    const otherTypeRewards = rewards.filter(r => r.type === otherType);
    if (otherTypeRewards.length > 0) {
      rewards = otherTypeRewards;
    }
  }
  
  const totalProbability = rewards.reduce((sum, r) => sum + r.probability, 0);
  let random = Math.random() * totalProbability;
  
  let selectedReward: GachaReward = rewards[0];
  for (const reward of rewards) {
    random -= reward.probability;
    if (random <= 0) {
      selectedReward = reward;
      break;
    }
  }
  
  const actualValue = Math.floor(Math.random() * (selectedReward.valueMax - selectedReward.valueMin + 1)) + selectedReward.valueMin;
  
  let newConsecutiveLow = selectedReward.rarity === 'common' ? gachaState.consecutiveLowRewards + 1 : 0;
  let newConsecutiveSameType = gachaState.lastRewardType === selectedReward.type ? gachaState.consecutiveSameType + 1 : 1;
  
  const newState: GachaState = {
    ...gachaState,
    consecutiveLowRewards: newConsecutiveLow,
    consecutiveSameType: newConsecutiveSameType,
    lastRewardType: selectedReward.type,
  };
  
  return { reward: selectedReward, actualValue, newState };
};

export const addDrawHistory = (state: GachaState, entry: GachaHistoryEntry): GachaState => {
  return {
    ...state,
    history: [entry, ...state.history].slice(0, 50),
  };
};

export const calculateAvailableDraws = (currentLevel: number, lastDrawLevel: number): number => {
  let available = 0;
  for (let level = lastDrawLevel + 1; level <= currentLevel; level++) {
    available += getDrawsPerLevel(level);
  }
  return available;
};

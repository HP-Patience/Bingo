import { useState } from 'react';
import { GACHA_POOL } from '../constants';
import { drawReward, addDrawHistory } from '../gachaUtils';
import React from 'react';
import type { GachaState, GachaReward, User, Stats } from '../types';

type UseGachaDeps = {
  user: User | null;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
  onAddXPWithLevelUp: (xp: number, extraStats?: (prev: Stats) => Partial<Stats>) => void;
  playSound: (type: string) => void;
  triggerHaptic: (intensity?: string) => void;
};

export function useGacha({ user, setUser, onAddXPWithLevelUp, playSound, triggerHaptic }: UseGachaDeps) {
  const [gachaState, setGachaState] = useState<GachaState>({
    availableDraws: 0,
    totalDrawsSpent: 0,
    consecutiveLowRewards: 0,
    consecutiveSameType: 0,
    history: [],
    lastFreeDrawDate: undefined,
    freeDrawUsed: false,
  });
  const [showGachaResult, setShowGachaResult] = useState(false);
  const [lastDrawResult, setLastDrawResult] = useState<{
    reward: GachaReward;
    actualValue: number;
    poolName: string;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleGachaDraw = () => {
    if (!user || gachaState.availableDraws <= 0) return;

    const pool = GACHA_POOL;
    const { reward, actualValue, newState } = drawReward(pool, gachaState);

    const newGachaState = addDrawHistory(newState, {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      poolId: pool.id,
      poolName: pool.name,
      reward,
      actualValue,
      level: user.level,
      timestamp: new Date().toISOString(),
    });
    newGachaState.availableDraws = newGachaState.availableDraws - 1;
    newGachaState.totalDrawsSpent = (newGachaState.totalDrawsSpent || 0) + 1;
    if (newGachaState.lastFreeDrawDate === new Date().toISOString().split('T')[0] && !newGachaState.freeDrawUsed) {
      newGachaState.freeDrawUsed = true;
    }
    setGachaState(newGachaState);

    if (reward.type === 'xp') {
      onAddXPWithLevelUp(actualValue);
    } else {
      setUser({ ...user, balance: user.balance + actualValue });
    }

    playSound('levelUp');
    triggerHaptic('medium');
    setLastDrawResult({ reward, actualValue, poolName: pool.name });
    setShowGachaResult(true);
  };

  return {
    gachaState, setGachaState,
    showGachaResult, setShowGachaResult,
    lastDrawResult, setLastDrawResult,
    showHelp, setShowHelp,
    handleGachaDraw,
  };
}

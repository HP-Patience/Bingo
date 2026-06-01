import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toDB, logError } from '../lib/utils';
import React from 'react';
import type { ShopItem, ShopHistoryEntry, User, Stats } from '../types';
import { INITIAL_SHOP_ITEMS } from '../constants';

type UseShopDeps = {
  user: User | null;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  setStats: React.Dispatch<React.SetStateAction<Stats>>;
};

export function useShop({ user, setUser, setStats }: UseShopDeps) {
  const [shopItems, setShopItems] = useState<ShopItem[]>(INITIAL_SHOP_ITEMS);
  const [shopHistory, setShopHistory] = useState<ShopHistoryEntry[]>([]);
  const [purchasedItem, setPurchasedItem] = useState<ShopItem | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const buyItem = (item: ShopItem) => {
    if (!user || user.balance < item.cost) return;

    setUser({ ...user, balance: user.balance - item.cost });
    setStats(prev => ({ ...prev, totalSpent: prev.totalSpent + item.cost }));

    const historyEntry: ShopHistoryEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      itemId: item.id,
      itemName: item.name,
      itemIcon: item.icon,
      cost: item.cost,
      level: user.level,
      timestamp: new Date().toISOString(),
    };
    setShopHistory(prev => [historyEntry, ...prev]);

    supabase
      .from('shop_history')
      .insert(toDB({ ...historyEntry, price: item.cost, user_id: user.id }))
      .then(null, logError('saving shop history'));

    setPurchasedItem(item);
  };

  const addShopItem = (item: Omit<ShopItem, 'id'>) => {
    const newItem: ShopItem = { ...item, id: 'shop-' + Date.now() };
    setShopItems(prev => [...prev, newItem]);
  };

  const updateShopItem = (item: ShopItem) => {
    setShopItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteShopItem = (id: string) => {
    setShopItems(prev => prev.filter(i => i.id !== id));
  };

  return {
    shopItems, setShopItems,
    shopHistory, setShopHistory,
    purchasedItem, setPurchasedItem,
    showHistory, setShowHistory,
    buyItem, addShopItem, updateShopItem, deleteShopItem,
  };
}

import React from "react";
import { Bolt, Zap, Grid, CheckSquare, CalendarIcon, Trophy, ShoppingBag, SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { NavItem } from './NavItem';
import type { User, Theme } from '../types';

export function Layout({ children, activeTab, onTabChange, user, onLoginClick, theme }: { children: React.ReactNode, activeTab: string, onTabChange: (tab: string) => void, user: User | null, onLoginClick: () => void, theme: Theme }) {
  return (
    <div className="min-h-screen pb-32 max-w-md mx-auto relative overflow-hidden" data-theme={theme}>
      {/* Top App Bar */}
      <header className="fixed top-0 w-full max-w-md z-50 glass border-b border-outline-variant">
        <div className="flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-2 text-primary active:scale-95 transition-all cursor-pointer">
            <Bolt className="w-4 h-4" />
            <span className="font-headline font-semibold text-sm uppercase tracking-tight">Life Bingo</span>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-primary uppercase tracking-tighter">LV.{user.level}</span>
                  <div className="w-16 h-1.5 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low/50 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3 fill-primary" />
                <span className="text-[10px] font-bold tracking-tight">{user.balance}</span>
                <span className="text-[10px] font-semibold text-on-surface-variant/50 whitespace-nowrap flex-shrink-0">金币</span>
              </div>
              <button
                onClick={() => onTabChange('settings')}
                className="w-10 h-10 rounded-lg overflow-hidden border-2 border-primary/20 active:opacity-70 transition-all cursor-pointer shadow-sm"
              >
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover grayscale-[0.2]"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-xs font-bold text-primary hover:underline"
            >
              登录/注册
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 glass border-t border-outline-variant rounded-t-[2rem] shadow-2xl">
        <div className="flex justify-around items-center px-3 py-3">
          <NavItem icon={<Grid className="w-5 h-5" />} label="今日" isActive={activeTab === 'today'} onClick={() => onTabChange('today')} />
          <NavItem icon={<CheckSquare className="w-5 h-5" />} label="任务" isActive={activeTab === 'tasks'} onClick={() => onTabChange('tasks')} />
          <NavItem icon={<CalendarIcon className="w-5 h-5" />} label="日历" isActive={activeTab === 'calendar'} onClick={() => onTabChange('calendar')} />
          <NavItem icon={<Trophy className="w-5 h-5" />} label="成就" isActive={activeTab === 'achievements'} onClick={() => onTabChange('achievements')} />
          <NavItem icon={<ShoppingBag className="w-5 h-5" />} label="商店" isActive={activeTab === 'shop'} onClick={() => onTabChange('shop')} />
          <NavItem icon={<SettingsIcon className="w-5 h-5" />} label="设置" isActive={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
        </div>
      </nav>
    </div>
  );
}

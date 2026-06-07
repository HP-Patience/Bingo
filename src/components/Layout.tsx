import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from 'react-dom';
import { Bolt, Zap, Grid, CheckSquare, CalendarIcon, Trophy, ShoppingBag, SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { NavItem } from './NavItem';
import type { User, Settings } from '../types';

function LayoutAvatar({ user, settings, onTabChange }: { user: User; settings: Settings; onTabChange: (tab: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showMotto, setShowMotto] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLButtonElement>(null);
  const [savedRect, setSavedRect] = useState<DOMRect | null>(null);

  const handleClose = useCallback(() => {
    setExpanded(false);
    setFlipped(false);
    setShowMotto(false);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, handleClose]);

  useEffect(() => {
    if (!expanded) return;
    const t1 = setTimeout(() => setFlipped(true), 600);
    const t2 = setTimeout(() => setShowMotto(true), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [expanded]);

  if (!settings.showAvatarEffect) {
    return (
      <button
        onClick={() => onTabChange('settings')}
        className="w-10 h-10 rounded-lg overflow-hidden border-2 border-primary/20 active:opacity-70 transition-all cursor-pointer shadow-sm"
      >
        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
      </button>
    );
  }

  const tiltStyle = {
    transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: 'transform 0.15s ease-out',
  };

  const MOTTO = "Step by step, win the game";

  const offsetX = savedRect ? (savedRect.left + savedRect.width / 2) - window.innerWidth / 2 : 0;
  const offsetY = savedRect ? (savedRect.top + savedRect.height / 2) - window.innerHeight / 2 : 0;
  const expandedSize = 'min(340px, 75vw)';

  return (
    <>
      <button
        ref={cardRef}
        onClick={() => {
          const rect = cardRef.current?.getBoundingClientRect();
          setSavedRect(rect || null);
          setExpanded(true);
        }}
        className="w-10 h-10 rounded-lg overflow-hidden border-2 border-primary/20 active:opacity-70 transition-all cursor-pointer shadow-sm"
        style={tiltStyle}
        onMouseMove={(e) => {
          const el = cardRef.current;
          if (!el || expanded) return;
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 });
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        onTouchMove={(e) => {
          const el = cardRef.current;
          if (!el || expanded) return;
          const rect = el.getBoundingClientRect();
          const touch = e.touches[0];
          const x = (touch.clientX - rect.left) / rect.width;
          const y = (touch.clientY - rect.top) / rect.height;
          setTilt({ x: (y - 0.5) * -12, y: (x - 0.5) * 12 });
        }}
        onTouchEnd={() => setTilt({ x: 0, y: 0 })}
      >
        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover grayscale-[0.2]" referrerPolicy="no-referrer" />
      </button>

      {expanded && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center"
          onClick={handleClose}
        >
          {/* Card flies from original position to center, then flips */}
          <motion.div
            initial={{
              width: savedRect?.width ?? 40,
              height: savedRect?.height ?? 40,
              x: offsetX,
              y: offsetY,
              borderRadius: '0.5rem',
            }}
            animate={{
              width: expandedSize,
              height: expandedSize,
              x: 0,
              y: 0,
              borderRadius: '1.25rem',
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="shadow-2xl border-2 border-white/10 cursor-default"
            style={{ transformStyle: 'preserve-3d' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front face — avatar */}
              <div
                className="w-full h-full rounded-[1.25rem] overflow-hidden"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              {/* Back face — user info */}
              <div
                className="absolute inset-0 w-full h-full rounded-[1.25rem] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-4 shadow-lg">
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-white text-xl font-black tracking-tight mb-1">{user.username}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white/60 text-xs font-bold">LV.{user.level}</span>
                  {user.title && (
                    <>
                      <span className="text-white/20">·</span>
                      <span className="text-primary/80 text-xs font-bold">{user.title}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-white/40 text-[10px] font-semibold tracking-widest">
                  <Zap className="w-3 h-3 fill-white/40" />
                  <span>{user.xp} / {user.nextLevelXp} XP</span>
                </div>
                <p className="text-white/20 text-[10px] mt-6 tracking-wider">点击任意位置关闭</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Motto — absolute below centered card */}
          {showMotto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
              style={{ top: `calc(50% + ${expandedSize} / 2 + 24px)` }}
            >
              <p className="text-white/70 text-base tracking-[0.25em] font-light whitespace-nowrap">
                {MOTTO.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.15 }}
                    className="inline-block"
                  >
                    {char === ' ' ? ' ' : char}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          )}
        </motion.div>,
        document.body
      )}
    </>
  );
}

export function Layout({ children, activeTab, onTabChange, user, onLoginClick, settings }: { children: React.ReactNode, activeTab: string, onTabChange: (tab: string) => void, user: User | null, onLoginClick: () => void, settings: Settings }) {
  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative overflow-hidden" data-theme={settings.theme}>
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
              <LayoutAvatar user={user} settings={settings} onTabChange={onTabChange} />
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
      <main className="pt-20 px-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-50 glass border-t border-outline-variant rounded-t-[2rem] shadow-2xl">
        <div className="flex justify-around items-center px-2 py-2">
          <NavItem icon={<Grid className="w-4 h-4" />} label="今日" isActive={activeTab === 'today'} onClick={() => onTabChange('today')} />
          <NavItem icon={<CheckSquare className="w-4 h-4" />} label="任务" isActive={activeTab === 'tasks'} onClick={() => onTabChange('tasks')} />
          <NavItem icon={<CalendarIcon className="w-4 h-4" />} label="日历" isActive={activeTab === 'calendar'} onClick={() => onTabChange('calendar')} />
          <NavItem icon={<Trophy className="w-4 h-4" />} label="成就" isActive={activeTab === 'achievements'} onClick={() => onTabChange('achievements')} />
          <NavItem icon={<ShoppingBag className="w-4 h-4" />} label="商店" isActive={activeTab === 'shop'} onClick={() => onTabChange('shop')} />
          <NavItem icon={<SettingsIcon className="w-4 h-4" />} label="设置" isActive={activeTab === 'settings'} onClick={() => onTabChange('settings')} />
        </div>
      </nav>
    </div>
  );
}

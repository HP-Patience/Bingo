import React from "react";
import { useState } from 'react';
import { Bolt, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { DEFAULT_AVATAR } from '../constants';
import { XP_PER_LEVEL } from '../lib/gameLogic';
import type { User } from '../types';

export function LoginView({ onLogin }: { onLogin: (user: User) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError('请先验证您的邮箱地址，然后再登录');
          } else {
            throw error;
          }
        } else if (data.user) {
          onLogin({
            id: data.user.id,
            username: data.user.email?.split('@')[0] || '用户',
            email: data.user.email || 'user@example.com',
            avatar: data.user.user_metadata?.avatar || DEFAULT_AVATAR,
            joinedAt: data.user.created_at || new Date().toISOString(),
            level: 1,
            xp: 0,
            nextLevelXp: XP_PER_LEVEL,
            balance: 0
          });
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            emailRedirectTo: import.meta.env.VITE_SITE_URL || 'https://www.life-bingo.xyz'
          }
        });

        if (error) {
          throw error;
        }

        setSuccessMessage('注册成功！请检查您的邮箱并点击验证链接以完成注册。');
        setEmail('');
        setPassword('');
        setIsLogin(true);
      }
    } catch (error: any) {
      setError(error.message || '操作失败，请重试');
      console.error('Login/Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        throw error;
      }

      setSuccessMessage('验证邮件已重新发送，请检查您的邮箱');
    } catch (error: any) {
      setError(error.message || '发送邮件失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 py-10">
      <div className="text-center space-y-4">
        <div className="inline-block p-6 rounded-full bg-primary/10 text-primary mb-4">
          <Bolt className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tighter uppercase">{isLogin ? '欢迎回来' : '开启新征程'}</h2>
        <p className="text-on-surface-variant font-bold tracking-widest text-xs uppercase">记录你的每一份成长</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="bg-surface-container-low rounded-3xl p-1 border border-outline-variant flex">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-3 text-xs font-bold rounded-2xl transition-all",
                isLogin ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
              )}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-3 text-xs font-bold rounded-2xl transition-all",
                !isLogin ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant"
              )}
            >
              注册
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm font-bold text-green-600">
              {successMessage}
            </div>
          )}

          <div className="space-y-3">
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Mail className="w-5 h-5 text-on-surface-variant" />
              <input
                type="email"
                placeholder="邮箱地址"
                className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Bolt className="w-5 h-5 text-on-surface-variant" />
              <input
                type="password"
                placeholder="密码"
                className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-on-primary py-5 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
          disabled={loading}
        >
          {loading ? '处理中...' : (isLogin ? '立即登录' : '创建账号')}
        </button>

        <div className="text-center space-y-3">
          <button type="button" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            忘记密码？
          </button>

          {isLogin && error && error.includes('验证') && (
            <div>
              <button
                type="button"
                onClick={resendVerificationEmail}
                disabled={loading}
                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loading ? '发送中...' : '重新发送验证邮件'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

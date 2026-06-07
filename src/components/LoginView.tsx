import React, { useState } from 'react';
import { Bolt, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [name, domain] = email.split('@');
  return `${name[0]}***@${domain}`;
}

function translateAuthError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return '邮箱或密码错误';
  if (msg.includes('Email not confirmed')) return '请先验证您的邮箱地址，然后再登录';
  if (msg.includes('User already registered')) return '该邮箱已被注册';
  if (msg.includes('Password should be at least 6')) return '密码长度至少为6位';
  if (msg.includes('Rate limit exceeded') || msg.includes('Too many requests')) return '操作过于频繁，请稍后再试';
  if (msg.includes('Invalid email') || msg.includes('invalid format')) return '邮箱格式不正确';
  if (msg.includes('Email link is invalid') || msg.includes('has expired')) return '验证链接已失效或过期';
  if (msg.includes('New password should be different')) return '新密码不能与旧密码相同';
  if (msg.includes('Provider is not enabled')) return '该社交登录方式暂未开启';
  if (msg.includes('Signups not allowed')) return '注册功能暂未开放';
  return msg;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/>
    </svg>
  );
}

interface LoginViewProps {
  isRecoveryFlow?: boolean;
}

export function LoginView({ isRecoveryFlow }: LoginViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password reset states
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(isRecoveryFlow || false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const redirectUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  // ---------- Login / Register ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(translateAuthError(error.message));
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;

        setSuccessMessage(`注册成功！验证邮件已发送至 ${maskEmail(email)}，请检查邮箱并点击验证链接完成注册。`);
        setEmail('');
        setPassword('');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(translateAuthError(err.message));
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Resend verification email ----------
  const resendVerificationEmail = async () => {
    if (!email) { setError('请输入邮箱地址'); return; }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      setSuccessMessage(`验证邮件已重新发送至 ${maskEmail(email)}，请检查您的邮箱`);
    } catch (err: any) {
      setError(translateAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------- Forgot password (send reset email) ----------
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('请输入邮箱地址'); return; }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
      if (error) throw error;
      setSuccessMessage(`密码重置邮件已发送至 ${maskEmail(email)}，请检查您的邮箱`);
    } catch (err: any) {
      setError(translateAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------- Update password after recovery ----------
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword.length < 6) { setError('密码长度至少为6位'); return; }
    if (newPassword !== confirmPassword) { setError('两次输入的密码不一致'); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setSuccessMessage('密码已成功更新，请重新登录');
      setShowNewPasswordForm(false);
      setIsLogin(true);
      setNewPassword('');
      setConfirmPassword('');
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(translateAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------- Social login ----------
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectUrl },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(translateAuthError(err.message));
      setLoading(false);
    }
  };

  // ========== Recovery: new password form ==========
  if (showNewPasswordForm) {
    return (
      <div className="space-y-10 py-10">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-primary/10 text-primary mb-4">
            <Lock className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter uppercase">设置新密码</h2>
          <p className="text-on-surface-variant font-bold tracking-widest text-xs uppercase">输入您的新密码</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm font-bold text-red-600">{error}</div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm font-bold text-green-600">{successMessage}</div>
          )}

          <div className="space-y-3">
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Lock className="w-5 h-5 text-on-surface-variant" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="新密码"
                className="bg-transparent border-none outline-none focus:ring-0 text-sm font-bold w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required disabled={loading} minLength={6}
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0" tabIndex={-1}>
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Lock className="w-5 h-5 text-on-surface-variant" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="确认新密码"
                className="bg-transparent border-none outline-none focus:ring-0 text-sm font-bold w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required disabled={loading} minLength={6}
              />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-primary text-on-primary py-5 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
            disabled={loading}
          >
            {loading ? '处理中...' : '更新密码'}
          </button>
        </form>
      </div>
    );
  }

  // ========== Forgot password: send reset email ==========
  if (isResetPassword) {
    return (
      <div className="space-y-10 py-10">
        <div className="text-center space-y-4">
          <div className="inline-block p-6 rounded-full bg-primary/10 text-primary mb-4">
            <Lock className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter uppercase">重置密码</h2>
          <p className="text-on-surface-variant font-bold tracking-widest text-xs uppercase">输入邮箱地址，我们将发送重置链接</p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm font-bold text-red-600">{error}</div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm font-bold text-green-600">{successMessage}</div>
          )}

          <div className="space-y-3">
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Mail className="w-5 h-5 text-on-surface-variant" />
              <input type="email" placeholder="邮箱地址"
                className="bg-transparent border-none outline-none focus:ring-0 text-sm font-bold w-full"
                value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-primary text-on-primary py-5 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
            disabled={loading}
          >
            {loading ? '发送中...' : '发送重置链接'}
          </button>

          <div className="text-center">
            <button type="button"
              onClick={() => { setIsResetPassword(false); setError(''); setSuccessMessage(''); }}
              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />返回登录
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ========== Main login / register form ==========
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
          {/* Tab switch: login / register */}
          <div className="bg-surface-container-low rounded-3xl p-1 border border-outline-variant flex">
            <button type="button" onClick={() => setIsLogin(true)}
              className={cn('flex-1 py-3 text-xs font-bold rounded-2xl transition-all',
                isLogin ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant')}>
              登录
            </button>
            <button type="button" onClick={() => setIsLogin(false)}
              className={cn('flex-1 py-3 text-xs font-bold rounded-2xl transition-all',
                !isLogin ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant')}>
              注册
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm font-bold text-red-600">{error}</div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-sm font-bold text-green-600">{successMessage}</div>
          )}

          {/* Email + Password inputs */}
          <div className="space-y-3">
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Mail className="w-5 h-5 text-on-surface-variant" />
              <input type="email" placeholder="邮箱地址"
                className="bg-transparent border-none outline-none focus:ring-0 text-sm font-bold w-full"
                value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 flex items-center gap-3">
              <Bolt className="w-5 h-5 text-on-surface-variant" />
              <input type={showPassword ? 'text' : 'password'} placeholder="密码"
                className="bg-transparent border-none outline-none focus:ring-0 text-sm font-bold w-full"
                value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0" tabIndex={-1}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button type="submit"
          className="w-full bg-primary text-on-primary py-5 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 active:scale-95 transition-all"
          disabled={loading}
        >
          {loading ? '处理中...' : (isLogin ? '立即登录' : '创建账号')}
        </button>

        {/* Forgot password + resend verification */}
        <div className="text-center space-y-4">
          <button type="button"
            onClick={() => { setIsResetPassword(true); setError(''); setSuccessMessage(''); }}
            className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            忘记密码？
          </button>

          {isLogin && error && error.includes('验证') && (
            <div>
              <button type="button" onClick={resendVerificationEmail} disabled={loading}
                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50">
                {loading ? '发送中...' : '重新发送验证邮件'}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Social login divider + buttons */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/40" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            或使用社交账号
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button type="button" onClick={() => handleSocialLogin('google')} disabled={loading}
          className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3.5 flex items-center justify-center gap-3 text-sm font-bold hover:bg-surface-container transition-all disabled:opacity-50">
          <GoogleIcon />
          <span>使用 Google 登录</span>
        </button>
        <button type="button" onClick={() => handleSocialLogin('github')} disabled={loading}
          className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3.5 flex items-center justify-center gap-3 text-sm font-bold hover:bg-surface-container transition-all disabled:opacity-50">
          <GitHubIcon />
          <span>使用 GitHub 登录</span>
        </button>
      </div>
    </div>
  );
}

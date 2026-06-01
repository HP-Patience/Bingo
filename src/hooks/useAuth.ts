import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toDB } from '../lib/utils';
import type { User } from '../types';
import { DEFAULT_AVATAR } from '../constants';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async (resetAllState: () => void) => {
    try {
      setUser(null);
      resetAllState();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.reload();
    }
  };

  const handleEditProfile = () => {
    if (user) {
      setEditUsername(user.username);
      setEditEmail(user.email);
      setEditAvatar(user.avatar);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveProfile = async (toast: (msg: string, type?: 'success' | 'error' | 'info') => void) => {
    if (!user || isSaving) return;
    setIsSaving(true);
    const updatedUser = {
      ...user,
      username: editUsername.trim(),
      email: editEmail.trim(),
      avatar: editAvatar.trim() || DEFAULT_AVATAR,
    };
    setUser(updatedUser);
    try {
      await supabase
        .from('users')
        .upsert(toDB({ id: updatedUser.id, ...updatedUser }));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving profile to Supabase:', error);
      toast('保存失败，请重试', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user, setUser, isAuthLoading, setIsAuthLoading,
    isEditModalOpen, setIsEditModalOpen,
    isSaving, editUsername, setEditUsername,
    editEmail, setEditEmail, editAvatar, setEditAvatar,
    updateUser, login, logout,
    handleEditProfile, handleSaveProfile,
  };
}

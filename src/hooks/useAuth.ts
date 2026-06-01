import { useState } from 'react';
import { supabase, uploadAvatar } from '../lib/supabase';
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
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);

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
      setEditAvatarFile(null);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveProfile = async (toast: (msg: string, type?: 'success' | 'error' | 'info') => void) => {
    if (!user || isSaving) return;
    setIsSaving(true);
    let avatarUrl = editAvatar.trim() || DEFAULT_AVATAR;
    if (editAvatarFile) {
      try {
        avatarUrl = await uploadAvatar(user.id, editAvatarFile);
      } catch (e) {
        console.error('Avatar upload failed:', e);
        toast('头像上传失败，请重试', 'error');
        setIsSaving(false);
        return;
      }
    }
    const updatedUser = {
      ...user,
      username: editUsername.trim(),
      email: editEmail.trim(),
      avatar: avatarUrl,
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
    editAvatarFile, setEditAvatarFile,
    updateUser, login, logout,
    handleEditProfile, handleSaveProfile,
  };
}

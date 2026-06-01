import { cn } from '../lib/utils';
import { Palette, Database, FileUp, FileDown, Trash2, Edit2, LogOut, LayoutGrid } from 'lucide-react';
import { SettingsButton } from './SettingsButton';
import type { Settings, User, Theme } from '../types';

export function SettingsView({ settings, onUpdateSettings, user, onLogout, onEditProfile, isEditModalOpen, setIsEditModalOpen, editUsername, setEditUsername, editEmail, setEditEmail, editAvatar, setEditAvatar, onUpdateUser, onExportData, onImportData, onClearAllData }: { settings: Settings, onUpdateSettings: (s: Partial<Settings>) => void, user: User | null, onLogout: () => void, onEditProfile: () => void, isEditModalOpen: boolean, setIsEditModalOpen: (open: boolean) => void, editUsername: string, setEditUsername: (username: string) => void, editEmail: string, setEditEmail: (email: string) => void, editAvatar: string, setEditAvatar: (avatar: string) => void, onUpdateUser: (updates: Partial<User>) => void, onExportData: () => void, onImportData: () => void, onClearAllData: () => void }) {
  const themes: { name: Theme, color: string }[] = [
    { name: 'zinc', color: '#6f797a' },
    { name: 'dark', color: '#1a1a1a' },
  ];

  const handleEditProfile = () => {
    if (user) {
      setEditUsername(user.username);
      setEditEmail(user.email);
      setEditAvatar(user.avatar);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveProfile = () => {
    if (user) {
      onUpdateUser({ username: editUsername.trim(), email: editEmail.trim(), avatar: editAvatar.trim() });
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-10">
      {user && (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-primary/20">
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">{user.username}</h2>
                {user.title && <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">{user.title}</span>}
              </div>
              <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest opacity-60">{user.email}</p>
            </div>
            <button onClick={handleEditProfile} className="ml-auto text-primary p-2 hover:bg-primary/10 rounded-full transition-all"><Edit2 className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant">
              <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">加入时间</p>
              <p className="text-xs font-bold">{new Date(user.joinedAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant">
              <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">账号状态</p>
              <p className="text-xs font-bold text-primary">高级会员</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full bg-red-50 text-red-500 py-3.5 rounded-xl font-semibold tracking-wide text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all">
            <LogOut className="w-4 h-4" /> 退出登录
          </button>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-4 px-2">
          <Palette className="w-5 h-5 text-on-surface-variant" />
          <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">主题 (Theme)</h2>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant grid grid-cols-5 gap-4 shadow-sm">
          {themes.map((t, i) => (
            <button key={i} onClick={() => onUpdateSettings({ theme: t.name })} className={cn("w-10 h-10 rounded-full flex-shrink-0 transition-all active:scale-90 border-2", settings.theme === t.name ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-surface" : "border-transparent opacity-60 hover:opacity-100")} style={{ backgroundColor: t.color }} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Database className="w-5 h-5 text-on-surface-variant" />
          <h2 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">数据管理 (Data)</h2>
        </div>
        <div className="space-y-3">
          <SettingsButton icon={<FileUp className="w-4 h-4" />} label="导出数据" onClick={onExportData} />
          <SettingsButton icon={<FileDown className="w-4 h-4" />} label="导入数据" onClick={onImportData} />
          <SettingsButton icon={<Trash2 className="w-4 h-4" />} label="清除所有数据" variant="danger" onClick={onClearAllData} />
        </div>
      </section>

      <footer className="pt-10 pb-16 text-center space-y-8">
        <div className="inline-block p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant shadow-sm"><LayoutGrid className="w-10 h-10 text-primary" /></div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-primary tracking-[0.2em] mb-1">LIFE BINGO</h3>
          <p className="text-on-surface-variant text-xs font-bold tracking-widest opacity-60 uppercase">版本 2.4.0 (极简优化)</p>
        </div>
        <div className="space-y-1 opacity-30">
          <p className="text-[10px] uppercase font-black tracking-[0.3em]">ICP 备案号: 2023000456-1</p>
          <p className="text-[10px] uppercase font-black tracking-[0.3em]">© 2024 Zenith Grid Labs</p>
        </div>
      </footer>
    </div>
  );
}

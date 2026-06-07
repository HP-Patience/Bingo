import { Modal } from './Modal';

export function EditProfileModal({
  isOpen,
  onClose,
  username,
  email,
  avatar,
  isSaving,
  onUsernameChange,
  onEmailChange,
  onAvatarChange,
  onAvatarFile,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  email: string;
  avatar: string;
  isSaving: boolean;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAvatarChange: (value: string) => void;
  onAvatarFile: (file: File | null) => void;
  onSave: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑个人信息" contentClassName="p-8 space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
            <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onAvatarFile(file);
                const reader = new FileReader();
                reader.onload = (event) => {
                  onAvatarChange(event.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label
            htmlFor="avatar-upload"
            className="bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors cursor-pointer inline-block"
          >
            选择图片
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">用户名</label>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:outline-none"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">邮箱地址</label>
          <input
            type="email"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:outline-none"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">头像 URL (可选)</label>
          <input
            type="url"
            placeholder="输入头像图片链接"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:outline-none"
            value={avatar}
            onChange={(e) => onAvatarChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 bg-surface-container-low text-on-surface py-3 rounded-2xl font-semibold tracking-wide text-[11px]"
        >
          取消
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 bg-primary text-on-primary py-3 rounded-2xl font-semibold tracking-wide text-[11px] disabled:opacity-50"
        >
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
    </Modal>
  );
}

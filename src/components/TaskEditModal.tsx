import { useState } from 'react';
import { Modal } from './Modal';
import type { Task, TaskDifficulty, TaskPriority } from '../types';

function calculateXP(difficulty: TaskDifficulty, priority: TaskPriority): number {
  let base = 0;
  switch (difficulty) {
    case 'easy': base = 10; break;
    case 'medium': base = 20; break;
    case 'hard': base = 30; break;
  }
  switch (priority) {
    case 'low': break;
    case 'medium': base += 5; break;
    case 'high': base += 10; break;
  }
  return base;
}

export function TaskEditModal({
  task,
  onClose,
  onSave,
  isNew = false,
}: {
  task: Task;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
  isNew?: boolean;
}) {
  const [name, setName] = useState(task.name);
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(task.difficulty);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [tags, setTags] = useState(task.tags?.join(', ') || '');

  const handleSave = () => {
    onSave({
      name: name.trim(),
      difficulty,
      priority,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      xpValue: calculateXP(difficulty, priority),
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={isNew ? '新建任务' : '编辑任务'} contentClassName="p-8 space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">任务名称</label>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">标签 (逗号分隔)</label>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="例如: 工作, 健身, 学习"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">难度</label>
            <select
              className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
            >
              <option value="easy">简单 (10 XP)</option>
              <option value="medium">中等 (20 XP)</option>
              <option value="hard">困难 (30 XP)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">优先级</label>
            <select
              className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 bg-surface-container-low text-on-surface py-4 rounded-2xl font-semibold tracking-wide text-[11px]"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-semibold tracking-wide text-[11px]"
        >
          保存
        </button>
      </div>
    </Modal>
  );
}

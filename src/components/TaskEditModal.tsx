import { useState } from 'react';
import { Modal } from './Modal';
import { Select } from './Select';
import type { Task, TaskDifficulty, TaskPriority } from '../types';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: '简单 (10 XP)' },
  { value: 'medium', label: '中等 (20 XP)' },
  { value: 'hard', label: '困难 (30 XP)' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
];

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
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">标签 (逗号分隔)</label>
          <input
            type="text"
            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:outline-none"
            placeholder="例如: 工作, 健身, 学习"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">难度</label>
            <Select
              value={difficulty}
              onChange={(v) => setDifficulty(v as TaskDifficulty)}
              options={DIFFICULTY_OPTIONS}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-on-surface-variant px-1">优先级</label>
            <Select
              value={priority}
              onChange={(v) => setPriority(v as TaskPriority)}
              options={PRIORITY_OPTIONS}
            />
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

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, SortAsc, ChevronDown, ChevronRight, Plus, X, CheckSquare, Trash2, PlusCircle, FolderPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { TaskEditModal } from './TaskEditModal';
import { ConfirmDialog } from './Modal';
import type { TaskGroup, Task, BingoTile } from '../types';

export function TasksView({
  groups, onToggleTask, onAddGroup, onDeleteGroup, onEditGroup,
  onUpdateTask, onAddTask, onDeleteTask, onApplyGroup, onApplyTask, onApplyMultipleTasks,
  gridSize, onGridSizeChange, onShuffleTasks, onSortTasks, onToggleGroupTasks, bingoTiles,
}: {
  groups: TaskGroup[];
  onToggleTask: (groupId: string, taskId: string) => void;
  onAddGroup: (name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onEditGroup: (groupId: string, name: string) => void;
  onUpdateTask: (groupId: string, taskId: string, updates: Partial<Task>) => void;
  onAddTask: (groupId: string, name: string, updates?: Partial<Task>) => void;
  onDeleteTask: (groupId: string, taskId: string) => void;
  onApplyGroup: (groupId: string) => void;
  onApplyTask: (task: Task) => void;
  onApplyMultipleTasks: (tasks: Task[]) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  onShuffleTasks: () => void;
  onSortTasks: () => void;
  onToggleGroupTasks: (groupId: string, completed: boolean) => void;
  bingoTiles: BingoTile[][];
}) {
  const [newGroupName, setNewGroupName] = useState('');
  const [newTaskNames, setNewTaskNames] = useState<Record<string, string>>({});
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editingTask, setEditingTask] = useState<{ groupId: string, task: Task, isNew?: boolean } | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [deleteMode, setDeleteMode] = useState<Set<string>>(new Set());
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const handleAddGroup = () => {
    if (newGroupName.trim()) { onAddGroup(newGroupName.trim()); setNewGroupName(''); }
  };

  const handleAddTask = (groupId: string) => {
    const name = newTaskNames[groupId];
    const newTask: Task = { id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, name: name?.trim() || '', completed: false, difficulty: 'easy', priority: 'medium' };
    setEditingTask({ groupId, task: newTask, isNew: true });
  };

  const startEditing = (group: TaskGroup) => { setEditingGroupId(group.id); setEditName(group.name); };
  const saveEdit = () => { if (editingGroupId && editName.trim()) { onEditGroup(editingGroupId, editName.trim()); setEditingGroupId(null); } };

  const toggleGroupExpanded = (groupId: string) => setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-on-surface-variant tracking-wide">格子大小</h3>
          <div className="flex gap-2">
            {[3, 4, 5, 6].map(size => (
              <button key={size} onClick={() => onGridSizeChange(size)} className={cn("flex-1 py-3 px-2 rounded-2xl font-bold transition-all", gridSize === size ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high")}>{size}x{size}</button>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-6 py-2 my-2">
          <button onClick={onShuffleTasks} className="text-sm font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors"><Shuffle className="w-4 h-4" /> 随机</button>
          <button onClick={onSortTasks} className="text-sm font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors"><SortAsc className="w-4 h-4" /> 排序</button>
        </div>

        <div className="space-y-6">
          {groups.map(group => {
            const allSelected = group.tasks.length > 0 && group.tasks.every(t => selectedTaskIds.has(t.id));
            return (
              <div key={group.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleGroupExpanded(group.id)} className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                      {expandedGroups[group.id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    {editingGroupId === group.id ? (
                      <input autoFocus className="bg-surface-container-low border-none rounded-lg px-2 py-1 text-xl font-extrabold tracking-tight focus:outline-none w-32" value={editName} onChange={(e) => setEditName(e.target.value)} onBlur={saveEdit} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                    ) : (
                      <span className="text-xl font-extrabold tracking-tight cursor-pointer hover:text-primary transition-colors" onClick={() => startEditing(group)}>{group.name}</span>
                    )}
                    <span className="text-[10px] font-semibold text-on-surface-variant/50 tracking-wide mt-1">{group.tasks.length} 任务</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => {
                      const allTasks = groups.flatMap(g => g.tasks);
                      const selectedTasks = allTasks.filter(task => selectedTaskIds.has(task.id));
                      if (selectedTasks.length > 0) { if (selectedTasks.length === 1) { onApplyTask(selectedTasks[0]); } else { onApplyMultipleTasks(selectedTasks); } }
                      else { onApplyGroup(group.id); }
                    }} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold hover:bg-primary/20 transition-colors">应用</button>
                    <button onClick={() => setDeletingGroupId(group.id)} className="p-2 text-on-surface-variant hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {expandedGroups[group.id] && (
                  <>
                    <div className="flex items-center w-full overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <input type="text" placeholder="添加任务..." className="min-w-0 bg-surface-container-low border-none rounded-xl px-4 py-2 text-sm font-medium focus:outline-none" value={newTaskNames[group.id] || ''} onChange={(e) => setNewTaskNames(prev => ({ ...prev, [group.id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && handleAddTask(group.id)} />
                        <button onClick={() => handleAddTask(group.id)} className="bg-primary/10 text-primary p-2 rounded-xl hover:bg-primary/20 transition-colors flex-shrink-0"><Plus className="w-5 h-5" /></button>
                      </div>
                      <div className="flex items-center ml-auto flex-shrink-0">
                        <button onClick={() => { const newSelected = new Set(selectedTaskIds); if (allSelected) { group.tasks.forEach(t => newSelected.delete(t.id)); } else { group.tasks.forEach(t => newSelected.add(t.id)); } setSelectedTaskIds(newSelected); }} className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 px-3">
                          {allSelected ? <X className="w-3 h-3" /> : <CheckSquare className="w-3 h-3" />}{allSelected ? '取消' : '全选'}
                        </button>
                        <button onClick={() => { if (deleteMode.has(group.id)) { const newMode = new Set(deleteMode); newMode.delete(group.id); setDeleteMode(newMode); } else { setDeleteMode(new Set([...deleteMode, group.id])); } }} className="p-2 text-on-surface-variant hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {group.tasks.map(task => {
                        const isSelected = selectedTaskIds.has(task.id);
                        const isDeleteMode = deleteMode.has(group.id);
                        const toggleTask = () => { if (isDeleteMode) { onDeleteTask(group.id, task.id); } else { const newSelected = new Set(selectedTaskIds); if (isSelected) { newSelected.delete(task.id); } else { newSelected.add(task.id); } setSelectedTaskIds(newSelected); } };
                        return (
                          <div key={task.id} className="group relative">
                            <button onClick={toggleTask}
                              onMouseDown={() => { if (!isDeleteMode) { const timer = setTimeout(() => { setEditingTask({ groupId: group.id, task }); }, 500); setLongPressTimer(timer); } }}
                              onMouseUp={() => { if (longPressTimer) { clearTimeout(longPressTimer); setLongPressTimer(null); } }}
                              onMouseLeave={() => { if (longPressTimer) { clearTimeout(longPressTimer); setLongPressTimer(null); } }}
                              onTouchStart={() => { if (!isDeleteMode) { const timer = setTimeout(() => { setEditingTask({ groupId: group.id, task }); }, 500); setLongPressTimer(timer); } }}
                              onTouchEnd={() => { if (longPressTimer) { clearTimeout(longPressTimer); setLongPressTimer(null); } }}
                              className={cn("px-3 py-2 rounded-xl font-bold text-xs flex flex-col items-start gap-1 transition-all cursor-pointer active:scale-95", isSelected && !isDeleteMode ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest", isDeleteMode && "cursor-pointer")}>
                              <div className="flex items-center gap-1.5">{task.name}</div>
                              <div className="flex items-center gap-2 opacity-60">
                                <div className="flex gap-0.5">{[...Array(task.difficulty === 'hard' ? 3 : task.difficulty === 'medium' ? 2 : 1)].map((_, i) => (<div key={i} className="w-1 h-1 rounded-full bg-current" />))}</div>
                                <div className={cn("w-1.5 h-1.5 rounded-full", task.priority === 'high' ? "bg-red-500" : task.priority === 'medium' ? "bg-amber-500" : "bg-emerald-500")} />
                                <span className="text-[10px] font-bold">+{task.xpValue || 10} XP</span>
                                {task.tags && task.tags.length > 0 && <div className="flex gap-1">{task.tags.slice(0, 2).map(tag => (<span key={tag} className="text-[10px] uppercase tracking-tighter opacity-80">#{tag}</span>))}</div>}
                              </div>
                            </button>
                            {!isDeleteMode ? (
                              <button onClick={(e) => { e.stopPropagation(); onDeleteTask(group.id, task.id); }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"><X className="w-3 h-3" /></button>
                            ) : (
                              <button onClick={(e) => { e.stopPropagation(); onDeleteTask(group.id, task.id); }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm z-10"><X className="w-3 h-3" /></button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4 pt-6">
          <div className="bg-surface-container-lowest rounded-2xl p-4 flex items-center border border-outline-variant transition-all hover:border-primary/40">
            <input className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/40 font-medium focus:outline-none transition-all" placeholder="添加一个新组别" type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()} />
            <button onClick={handleAddGroup} className="text-primary p-2 rounded-full hover:bg-primary/10 active:scale-90 transition-all"><PlusCircle className="w-5 h-5" /></button>
          </div>
          <button onClick={handleAddGroup} className="w-full bg-surface-container-low text-on-surface-variant py-3 rounded-3xl font-extrabold flex items-center justify-center gap-3 hover:bg-surface-container-high hover:border-primary/40 transition-all border-2 border-dashed border-outline-variant"><FolderPlus className="w-6 h-6" />新建分组</button>
        </div>

        <AnimatePresence>
          {editingTask && (
            <TaskEditModal task={editingTask.task} isNew={editingTask.isNew}
              onClose={() => { setEditingTask(null); if (editingTask.isNew) { setNewTaskNames(prev => ({ ...prev, [editingTask.groupId]: '' })); } }}
              onSave={(updates) => {
                if (editingTask.isNew) { onAddTask(editingTask.groupId, updates.name || editingTask.task.name, updates); }
                else { onUpdateTask(editingTask.groupId, editingTask.task.id, updates); }
                setEditingTask(null); setNewTaskNames(prev => ({ ...prev, [editingTask.groupId]: '' }));
              }}
            />
          )}
        </AnimatePresence>

        <ConfirmDialog isOpen={!!deletingGroupId} onClose={() => setDeletingGroupId(null)} title="确认删除" message="确定要删除这个组别吗？此操作无法撤销。" onConfirm={() => { onDeleteGroup(deletingGroupId!); setDeletingGroupId(null); }} variant="danger" icon={<Trash2 className="w-8 h-8 text-red-500" />} />
      </div>
    </div>
  );
}

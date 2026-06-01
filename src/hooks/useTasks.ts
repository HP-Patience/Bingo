import { useState } from 'react';
import type { Task, TaskGroup } from '../types';
import { INITIAL_TASK_GROUPS } from '../constants';

export function useTasks() {
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(INITIAL_TASK_GROUPS);

  const toggleTask = (groupId: string, taskId: string) => {
    setTaskGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: group.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return group;
    }));
  };

  const addGroup = (name: string) => {
    const newGroup: TaskGroup = { id: Date.now().toString(), name, tasks: [] };
    setTaskGroups(prev => [...prev, newGroup]);
  };

  const deleteGroup = (groupId: string) => {
    setTaskGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const editGroup = (groupId: string, name: string) => {
    setTaskGroups(prev => prev.map(g => g.id === groupId ? { ...g, name } : g));
  };

  const updateTask = (groupId: string, taskId: string, updates: Partial<Task>) => {
    setTaskGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return { ...group, tasks: group.tasks.map(task => task.id === taskId ? { ...task, ...updates } : task) };
      }
      return group;
    }));
  };

  const addTask = (groupId: string, name: string, updates?: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(), name, completed: false,
      difficulty: 'easy', priority: 'medium', xpValue: 10, ...updates
    };
    setTaskGroups(prev => prev.map(g => {
      if (g.id === groupId) return { ...g, tasks: [...g.tasks, newTask] };
      return g;
    }));
  };

  const deleteTask = (groupId: string, taskId: string) => {
    setTaskGroups(prev => prev.map(g => {
      if (g.id === groupId) return { ...g, tasks: g.tasks.filter(t => t.id !== taskId) };
      return g;
    }));
  };

  const shuffleTasks = () => {
    setTaskGroups(prev => prev.map(group => ({
      ...group, tasks: [...group.tasks].sort(() => Math.random() - 0.5)
    })));
  };

  const clearAllTasks = () => {
    setTaskGroups(prev => prev.map(group => ({
      ...group, tasks: group.tasks.map(t => ({ ...t, completed: false }))
    })));
  };

  const sortTasks = () => {
    setTaskGroups(prev => prev.map(group => ({
      ...group, tasks: [...group.tasks].sort((a, b) => a.name.localeCompare(b.name))
    })));
  };

  const toggleGroupTasks = (groupId: string, completed: boolean) => {
    setTaskGroups(prev => prev.map(g => {
      if (g.id === groupId) return { ...g, tasks: g.tasks.map(t => ({ ...t, completed })) };
      return g;
    }));
  };

  const getGroupTaskIds = (groupId: string): string[] => {
    const group = taskGroups.find(g => g.id === groupId);
    return group ? group.tasks.map(t => t.id) : [];
  };

  return {
    taskGroups, setTaskGroups,
    toggleTask, addGroup, deleteGroup, editGroup,
    updateTask, addTask, deleteTask,
    shuffleTasks, clearAllTasks, sortTasks, toggleGroupTasks,
    getGroupTaskIds,
  };
}

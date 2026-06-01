import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toDB } from '../lib/utils';
import React from 'react';
import type { HistoryEntry, BingoTile } from '../types';

type UseHistoryDeps = {
  user: { id: string } | null;
  setBingoTiles: React.Dispatch<React.SetStateAction<BingoTile[][]>>;
};

export function useHistory({ user, setBingoTiles }: UseHistoryDeps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HistoryEntry | null>(null);
  const [editForm, setEditForm] = useState({ time: '', duration: 0, note: '' });

  const editHistoryEntry = (id: string) => {
    const entry = history.find(h => h.id === id);
    if (!entry) return;
    const d = new Date(entry.completedAt);
    setEditingEntry(entry);
    setEditForm({
      time: d.toTimeString().substring(0, 8),
      duration: entry.duration || 0,
      note: entry.note || ''
    });
    setIsEditTaskModalOpen(true);
  };

  const saveEditTask = (toast: (msg: string, type?: string) => void) => {
    if (!editingEntry) return;
    const { time, duration, note } = editForm;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const durationMinutes = parseInt(String(duration));

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || hours > 23 || minutes < 0 || minutes > 59 ||
        seconds < 0 || seconds > 59 || isNaN(durationMinutes) || durationMinutes < 0) {
      toast('请检查时间格式（例如 14:30:00）和耗时（分钟），确保数值有效', 'error');
      return;
    }

    const currentDate = new Date(editingEntry.completedAt);
    const updatedDate = new Date(currentDate);
    updatedDate.setHours(hours, minutes, seconds, 0);

    const updatedEntry: HistoryEntry = {
      ...editingEntry,
      completedAt: updatedDate.toISOString(),
      duration: durationMinutes > 0 ? durationMinutes : undefined,
      note,
      noteTimestamp: note ? new Date().toISOString() : undefined
    };

    setHistory(prev => prev.map(h => h.id === editingEntry.id ? updatedEntry : h));

    setBingoTiles(prev => prev.map(row => row.map(tile => {
      if (tile.taskName === updatedEntry.taskName) {
        return { ...tile, note: updatedEntry.note, noteTimestamp: updatedEntry.noteTimestamp };
      }
      return tile;
    })));

    if (user) {
      supabase.from('history').update(toDB({
        user_id: user.id,
        taskName: updatedEntry.taskName,
        completedAt: updatedEntry.completedAt,
        type: updatedEntry.type,
        xpEarned: updatedEntry.xpEarned,
        duration: updatedEntry.duration,
        note: updatedEntry.note,
        noteTimestamp: updatedEntry.noteTimestamp,
      })).eq('id', updatedEntry.id)
        .then(() => {})
        .then(null, (error: unknown) => console.error('Error updating history entry:', error));
    }

    setIsEditTaskModalOpen(false);
    setEditingEntry(null);
  };

  return {
    history, setHistory,
    isEditTaskModalOpen, setIsEditTaskModalOpen,
    editingEntry, setEditingEntry,
    editForm, setEditForm,
    editHistoryEntry, saveEditTask,
  };
}

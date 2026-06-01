import { useState } from 'react';
import type { BingoTile, Task, TaskGroup } from '../types';
import { INITIAL_BINGO_TILES } from '../constants';
import { calculateXP } from '../lib/gameLogic';

type UseBingoDeps = {
  taskGroups: TaskGroup[];
  setActiveTab: (tab: string) => void;
};

export function useBingo({ taskGroups, setActiveTab }: UseBingoDeps) {
  const [bingoTiles, setBingoTiles] = useState<BingoTile[][]>(INITIAL_BINGO_TILES);
  const [gridSize, setGridSize] = useState(5);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{ r: number; c: number; tile: BingoTile } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const setActiveTabToToday = () => setActiveTab('today');

  const fillTileFromTask = (tile: BingoTile, task: Task, overrides?: Partial<BingoTile>) => {
    const difficulty = task.difficulty || 'easy';
    const priority = task.priority || 'medium';
    return {
      ...tile,
      taskName: task.name, completed: false,
      difficulty, priority,
      xpValue: task.xpValue || calculateXP(difficulty, priority),
      isGolden: false, isFreeTile: false,
      ...overrides,
    };
  };

  const applyGroupToGrid = (groupId: string) => {
    const group = taskGroups.find(g => g.id === groupId);
    if (!group) return;

    const tasks = group.tasks;
    const newTiles = bingoTiles.map(row => row.map(tile => ({ ...tile })));

    let goldenMin = 0, goldenMax = 0;
    if (gridSize === 3) { goldenMin = 0; goldenMax = 1; }
    else if (gridSize === 4) { goldenMin = 1; goldenMax = 2; }
    else if (gridSize === 5) { goldenMin = 2; goldenMax = 3; }
    else if (gridSize === 6) { goldenMin = 3; goldenMax = 4; }

    const goldenCount = Math.floor(Math.random() * (goldenMax - goldenMin + 1)) + goldenMin;

    const allPositions: { r: number; c: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) allPositions.push({ r, c });
    }

    const goldenPositions = new Set<string>();
    while (goldenPositions.size < goldenCount && allPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPositions.length);
      const pos = allPositions[randomIndex];
      goldenPositions.add(`${pos.r},${pos.c}`);
      allPositions.splice(randomIndex, 1);
    }

    let taskIdx = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const isGolden = goldenPositions.has(`${r},${c}`);
        if (taskIdx < tasks.length) {
          newTiles[r][c] = fillTileFromTask(newTiles[r][c], tasks[taskIdx], { isGolden });
          taskIdx++;
        } else {
          newTiles[r][c] = {
            ...newTiles[r][c],
            taskName: '新任务', completed: false,
            difficulty: 'easy', priority: 'medium',
            xpValue: calculateXP('easy', 'medium'),
            isGolden: false, isFreeTile: false
          };
        }
      }
    }
    setBingoTiles(newTiles);
    setActiveTabToToday();
  };

  const applyTaskToGrid = (task: Task) => {
    const newTiles = bingoTiles.map(row => row.map(tile => ({ ...tile })));
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!newTiles[r][c].completed) {
          newTiles[r][c] = fillTileFromTask(newTiles[r][c], task);
          setBingoTiles(newTiles);
          setActiveTabToToday();
          return;
        }
      }
    }
  };

  const applyMultipleTasksToGrid = (tasks: Task[]) => {
    const newTiles = bingoTiles.map(row => row.map(tile => ({ ...tile })));
    let taskIdx = 0;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!newTiles[r][c].completed && taskIdx < tasks.length) {
          newTiles[r][c] = fillTileFromTask(newTiles[r][c], tasks[taskIdx]);
          taskIdx++;
        }
      }
    }
    setBingoTiles(newTiles);
    setActiveTabToToday();
  };

  const shuffleTiles = () => {
    const tiles = bingoTiles.flat();
    const taskStatusMap = new Map<string, { completed: boolean; completedAt?: string }>();
    tiles.forEach(tile => {
      taskStatusMap.set(tile.taskName, { completed: tile.completed, completedAt: tile.completedAt });
    });
    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    const newTiles: BingoTile[][] = [];
    for (let i = 0; i < bingoTiles.length; i++) {
      const row: BingoTile[] = [];
      for (let j = 0; j < bingoTiles[i].length; j++) {
        const tile = shuffled[i * bingoTiles[i].length + j];
        const status = taskStatusMap.get(tile.taskName);
        row.push({ ...tile, completed: status ? status.completed : false, completedAt: status ? status.completedAt : undefined });
      }
      newTiles.push(row);
    }
    setBingoTiles(newTiles);
  };

  const confirmReset = () => {
    setBingoTiles(prev => prev.map(row => row.map(tile => ({ ...tile, completed: false }))));
    setIsResetConfirmOpen(false);
  };

  const handleGridSizeChange = (size: number) => {
    const newTiles: BingoTile[][] = [];
    for (let r = 0; r < size; r++) {
      const row: BingoTile[] = [];
      for (let c = 0; c < size; c++) {
        row.push({
          id: `tile-${r}-${c}-${Date.now()}`,
          taskName: '新任务',
          completed: false,
          difficulty: 'easy',
          priority: 'medium',
          xpValue: calculateXP('easy', 'medium'),
          isGolden: false,
          isFreeTile: false,
        });
      }
      newTiles.push(row);
    }
    setBingoTiles(newTiles);
    setGridSize(size);
  };

  const updateTileNote = (r: number, c: number, note: string) => {
    setBingoTiles(prev => prev.map((row, ri) =>
      row.map((tile, ci) =>
        ri === r && ci === c
          ? { ...tile, note, noteTimestamp: note ? new Date().toISOString() : undefined }
          : tile
      )
    ));
  };

  const handleLongPress = (r: number, c: number, tile: BingoTile) => {
    setSelectedTile({ r, c, tile });
    setNoteText(tile.note || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (selectedTile) {
      updateTileNote(selectedTile.r, selectedTile.c, noteText);
    }
    setShowNoteModal(false);
    setSelectedTile(null);
    setNoteText('');
  };

  return {
    bingoTiles, setBingoTiles,
    gridSize, setGridSize,
    isResetConfirmOpen, setIsResetConfirmOpen,
    selectedTile, setSelectedTile,
    noteText, setNoteText,
    showNoteModal, setShowNoteModal,
    applyGroupToGrid, applyTaskToGrid, applyMultipleTasksToGrid,
    shuffleTiles, confirmReset, handleGridSizeChange,
    updateTileNote, handleLongPress, handleSaveNote,
  };
}

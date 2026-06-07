import { motion } from 'motion/react';
import { Shuffle, Timer, BarChart2, Bolt, Palette, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { ToolbarItem } from './ToolbarItem';
import type { BingoTile, Settings } from '../types';

export function TodayView({ tiles, onToggleTile, onShuffle, onReset, onPomodoro, onStats, onThemeClick, onUpdateTileNote, showNoteModal, setShowNoteModal, selectedTile, setSelectedTile, noteText, setNoteText, handleLongPress, handleSaveNote, settings }: {
  tiles: BingoTile[][];
  onToggleTile: (r: number, c: number) => void;
  onShuffle: () => void;
  onReset: () => void;
  onPomodoro: () => void;
  onStats: () => void;
  onThemeClick: () => void;
  onUpdateTileNote: (r: number, c: number, note: string) => void;
  showNoteModal: boolean;
  setShowNoteModal: (show: boolean) => void;
  selectedTile: { r: number, c: number, tile: BingoTile } | null;
  setSelectedTile: (tile: { r: number, c: number, tile: BingoTile } | null) => void;
  noteText: string;
  setNoteText: (text: string) => void;
  handleLongPress: (r: number, c: number, tile: BingoTile) => void;
  handleSaveNote: () => void;
  settings: Settings;
}) {
  const completedCount = tiles.flat().filter(t => t.completed).length;
  const totalCount = tiles.flat().length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8">
      <section className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>
          <span className="text-xs font-semibold text-on-surface-variant tabular-nums min-w-[3ch] text-right">{progress}%</span>
        </div>
        <p className="text-on-surface-variant/60 text-[10px] font-medium tracking-wide">
          {progress === 0 && '新的一天，开始吧！'}
          {progress >= 1 && progress <= 25 && '千里之行，始于足下'}
          {progress >= 26 && progress <= 50 && '坚持就是胜利！'}
          {progress >= 51 && progress <= 75 && '你做得很棒！'}
          {progress >= 76 && progress <= 99 && '胜利在望！'}
          {progress === 100 && '完美！全部完成！'}
        </p>
      </section>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-3 shadow-sm mt-4">
        <div className={cn(
        "grid gap-1",
        tiles.length === 3 && "grid-cols-3",
        tiles.length === 4 && "grid-cols-4",
        tiles.length === 5 && "grid-cols-5",
        tiles.length === 6 && "grid-cols-6"
      )}>
        {tiles.map((row, rIdx) => (
          row.map((tile, cIdx) => (
            <button
              key={tile.id}
              onClick={() => onToggleTile(rIdx, cIdx)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress(rIdx, cIdx, tile);
              }}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-between p-1.5 text-center text-[10px] font-bold leading-tight transition-all active:scale-90 relative overflow-hidden",
                tile.completed
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest",
                tile.isFreeTile && "font-black uppercase italic",
                tile.isGolden && !tile.completed && "ring-2 ring-amber-400 ring-offset-2 ring-offset-surface shadow-lg shadow-amber-400/20"
              )}
            >
              {tile.isGolden && (
                <div className="absolute top-1 right-1">
                  <Star className={cn("w-3 h-3", tile.completed ? "text-on-primary" : "text-amber-400")} />
                </div>
              )}
              {tile.note && (
                <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-blue-300" />
              )}
              <div className="flex-1 flex items-center justify-center">
                <span className="z-10 line-clamp-2 break-all">{tile.taskName}</span>
              </div>
              {!tile.completed && settings.showCellDetails && (
                <div className="w-full flex items-center justify-center gap-1 opacity-40 whitespace-nowrap text-[10px]">
                  <div className="flex gap-0.5 items-center flex-shrink-0" aria-label={`难度：${tile.difficulty === 'hard' ? '困难' : tile.difficulty === 'medium' ? '中等' : '简单'}`} title={`难度：${tile.difficulty === 'hard' ? '困难' : tile.difficulty === 'medium' ? '中等' : '简单'}`}>
                    {[...Array(tile.difficulty === 'hard' ? 3 : tile.difficulty === 'medium' ? 2 : 1)].map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-current" />
                    ))}
                  </div>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    tile.priority === 'high' ? "bg-red-500" : tile.priority === 'medium' ? "bg-amber-500" : "bg-emerald-500"
                  )} aria-label={`优先级：${tile.priority === 'high' ? '高' : tile.priority === 'medium' ? '中' : '低'}`} title={`优先级：${tile.priority === 'high' ? '高' : tile.priority === 'medium' ? '中' : '低'}`} />
                  <span className="font-bold flex-shrink-0">+{tile.xpValue || 10}</span>
                </div>
              )}
            </button>
          ))
        ))}
      </div>
      </div>

      <div className="flex justify-between items-center bg-surface-container-low border border-outline-variant px-3 py-2 rounded-2xl shadow-sm mt-4">
        <ToolbarItem icon={<Shuffle className="w-4 h-4" />} label="洗牌" onClick={onShuffle} />
        <ToolbarItem icon={<Timer className="w-4 h-4" />} label="番茄钟" onClick={onPomodoro} />
        <ToolbarItem icon={<BarChart2 className="w-4 h-4" />} label="统计" onClick={onStats} />
        <ToolbarItem icon={<Bolt className="w-4 h-4" />} label="重置" onClick={onReset} />
        <ToolbarItem icon={<Palette className="w-4 h-4" />} label="主题" onClick={onThemeClick} />
      </div>
    </div>
  );
}

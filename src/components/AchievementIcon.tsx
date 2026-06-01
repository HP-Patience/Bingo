import { Egg, AlarmClock, Zap, Moon, Focus, Sun, Star, Trophy, Heart, Sparkles, Cookie, Film, Gamepad2, BookOpen } from 'lucide-react';

export function AchievementIcon({ name, className }: { name: string, className?: string }) {
  switch (name) {
    case 'egg': return <Egg className={className} />;
    case 'alarm-clock': return <AlarmClock className={className} />;
    case 'zap': return <Zap className={className} />;
    case 'moon': return <Moon className={className} />;
    case 'focus': return <Focus className={className} />;
    case 'sun': return <Sun className={className} />;
    case 'star': return <Star className={className} />;
    case 'trophy': return <Trophy className={className} />;
    case 'heart': return <Heart className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'cookie': return <Cookie className={className} />;
    case 'film': return <Film className={className} />;
    case 'gamepad-2': return <Gamepad2 className={className} />;
    case 'book-open': return <BookOpen className={className} />;
    default: return <Trophy className={className} />;
  }
}

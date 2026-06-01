import { Cookie, Film, Gamepad2, Heart, BookOpen, Sparkles, ShoppingBag } from 'lucide-react';

export function ShopItemIcon({ name, className }: { name: string, className?: string }) {
  switch (name) {
    case 'cookie': return <Cookie className={className} />;
    case 'film': return <Film className={className} />;
    case 'gamepad-2': return <Gamepad2 className={className} />;
    case 'heart': return <Heart className={className} />;
    case 'book-open': return <BookOpen className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    default: return <ShoppingBag className={className} />;
  }
}

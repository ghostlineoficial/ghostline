import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingProps {
  value: number; // 0–5, aceita decimal
  count?: number; // número de avaliações, opcional
  size?: 'sm' | 'md';
}

export function Rating({ value, count, size = 'sm' }: RatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <div
      role="img"
      aria-label={`Avaliação: ${value} de 5 estrelas${count ? `, ${count} avaliações` : ''}`}
      className="flex items-center gap-1.5"
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(value);
          return (
            <Star
              key={i}
              className={cn(starSize, filled ? 'fill-warning text-warning' : 'text-border')}
            />
          );
        })}
      </div>
      {count !== undefined && <span className="text-caption text-muted">({count})</span>}
    </div>
  );
}

import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

interface PriceDisplayProps {
  priceCents: number;
  compareAtCents?: number; // preço "de", riscado — se maior que priceCents
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-body-sm',
  md: 'text-body',
  lg: 'text-h4',
};

export function PriceDisplay({ priceCents, compareAtCents, size = 'md' }: PriceDisplayProps) {
  const hasDiscount = compareAtCents && compareAtCents > priceCents;

  return (
    <div className="flex items-baseline gap-2">
      <span className={cn('font-mono text-foreground', sizeStyles[size])}>
        {formatCurrency(priceCents)}
      </span>
      {hasDiscount && (
        <span className="font-mono text-caption text-muted line-through">
          {formatCurrency(compareAtCents)}
        </span>
      )}
    </div>
  );
}

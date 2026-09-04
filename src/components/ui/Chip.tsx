import { type ButtonHTMLAttributes } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onRemove?: () => void;
}

/**
 * Chip — diferente do Badge: é interativo (clicável) e pode ter um "x" pra remover.
 * Uso típico: filtros selecionados no Shop, tags de categoria clicáveis.
 */
export function Chip({ active, onRemove, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-body-sm transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'border-primary bg-primary/15 text-primary'
          : 'border-border bg-transparent text-foreground hover:border-foreground/30',
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="Remover"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
        </span>
      )}
    </button>
  );
}

import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 2 | 3 | 4 | 6 | 8;
}

const colsStyles: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2 md:grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-6',
};

const gapStyles: Record<number, string> = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
};

/** Grid — sempre 2 colunas no mobile por padrão, escala pro valor de `cols` a partir de md. */
export function Grid({ cols = 3, gap = 6, className, ...props }: GridProps) {
  return (
    <div className={cn('grid', colsStyles[cols], gapStyles[gap], className)} {...props} />
  );
}

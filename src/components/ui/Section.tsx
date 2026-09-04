import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type SectionBackground = 'transparent' | 'surface' | 'card';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tight?: boolean; // usa metade do padding vertical padrão
  background?: SectionBackground;
}

const bgStyles: Record<SectionBackground, string> = {
  transparent: 'bg-transparent',
  surface: 'bg-surface',
  card: 'bg-card',
};

/** Section — espaçamento vertical e background consistentes entre blocos de página. */
export function Section({ tight, background = 'transparent', className, ...props }: SectionProps) {
  return (
    <section
      className={cn(tight ? 'py-12' : 'py-section', bgStyles[background], className)}
      {...props}
    />
  );
}

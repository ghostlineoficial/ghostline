import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'live';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneStyles: Record<Tone, string> = {
  default: 'bg-white/5 text-muted',
  primary: 'bg-primary/15 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  live: 'bg-danger/15 text-danger',
};

/** Badge — rótulo curto e não-interativo (status, categoria). Ver Chip para versões clicáveis/removíveis. */
export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 font-mono text-caption uppercase tracking-wide2',
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}

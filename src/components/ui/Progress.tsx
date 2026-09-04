'use client';

import * as RadixProgress from '@radix-ui/react-progress';
import { cn } from '@/utils/cn';

interface ProgressProps {
  value: number; // 0–100
  label?: string;
  className?: string;
}

export function Progress({ value, label, className }: ProgressProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className="text-caption uppercase text-muted">{label}</span>}
      <RadixProgress.Root
        value={value}
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
      >
        <RadixProgress.Indicator
          className="h-full bg-primary transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </RadixProgress.Root>
    </div>
  );
}

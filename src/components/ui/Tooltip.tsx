'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/** Provider único deve envolver o app — ver providers/TooltipProvider.tsx */
export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={300}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={8}
          className={cn(
            'z-50 rounded-sm border border-border bg-surface px-3 py-1.5 text-caption text-foreground shadow-md',
            'data-[state=delayed-open]:animate-fade-in',
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-surface" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

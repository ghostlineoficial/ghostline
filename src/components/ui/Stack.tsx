import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
}

const gapStyles: Record<number, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
};

/** Stack — flex-col com espaçamento consistente da escala de tokens. */
export function Stack({ gap = 4, className, ...props }: StackProps) {
  return <div className={cn('flex flex-col', gapStyles[gap], className)} {...props} />;
}

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
}

const alignStyles = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
const justifyStyles = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' };

/** Flex — flex-row com controle de align/justify/wrap. */
export function Flex({
  gap = 4,
  align = 'center',
  justify = 'start',
  wrap,
  className,
  ...props
}: FlexProps) {
  return (
    <div
      className={cn(
        'flex flex-row',
        gapStyles[gap],
        alignStyles[align],
        justifyStyles[justify],
        wrap && 'flex-wrap',
        className,
      )}
      {...props}
    />
  );
}

'use client';

import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '@/utils/cn';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-8 w-8 text-caption',
  md: 'h-11 w-11 text-body-sm',
  lg: 'h-16 w-16 text-body',
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  return (
    <RadixAvatar.Root
      className={cn(
        'inline-flex select-none items-center justify-center overflow-hidden rounded-full bg-card border border-border',
        sizeStyles[size],
        className,
      )}
    >
      <RadixAvatar.Image src={src} alt={name} className="h-full w-full object-cover" />
      <RadixAvatar.Fallback className="font-mono text-muted" delayMs={300}>
        {getInitials(name)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}

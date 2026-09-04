'use client';

import * as RadixTabs from '@radix-ui/react-tabs';
import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ items, defaultValue, value, onValueChange }: TabsProps) {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onValueChange}
    >
      <RadixTabs.List className="flex gap-6 border-b border-border">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'relative pb-3 font-mono text-caption uppercase tracking-wide2 text-muted transition-colors',
              'outline-none focus-visible:text-foreground',
              'data-[state=active]:text-foreground',
              'after:absolute after:-bottom-px after:left-0 after:h-px after:w-full after:scale-x-0 after:bg-primary after:transition-transform',
              'data-[state=active]:after:scale-x-100',
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="pt-6 animate-fade-in">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}

'use client';

import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface DropdownItem {
  label: string;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
}

export function Dropdown({ trigger, items, align = 'end' }: DropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align={align}
          sideOffset={8}
          className="z-50 min-w-[180px] rounded-md border border-border bg-surface p-1 shadow-lg animate-scale-in"
        >
          {items.map((item) => (
            <RadixDropdown.Item
              key={item.label}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={cn(
                'flex h-10 cursor-pointer select-none items-center rounded-sm px-3 text-body-sm outline-none',
                'data-[highlighted]:bg-white/5',
                'data-[disabled]:opacity-40 data-[disabled]:pointer-events-none',
                item.danger ? 'text-danger' : 'text-foreground',
              )}
            >
              {item.label}
            </RadixDropdown.Item>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

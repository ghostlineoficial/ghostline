'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

/** Select — wrapper estilizado sobre Radix Select. Teclado e ARIA vêm de fábrica. */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Selecionar',
  label,
  disabled,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-caption uppercase text-muted">{label}</span>}
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          className={cn(
            'flex h-11 items-center justify-between gap-2 rounded-md border border-border bg-card px-4 text-body text-foreground',
            'outline-none transition-colors data-[placeholder]:text-muted/60',
            'focus:border-primary focus:ring-1 focus:ring-primary',
            'disabled:opacity-40 disabled:pointer-events-none',
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-muted" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 overflow-hidden rounded-md border border-border bg-surface shadow-lg"
            position="popper"
            sideOffset={6}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex h-10 cursor-pointer select-none items-center rounded-sm px-8 text-body-sm text-foreground outline-none',
                    'data-[highlighted]:bg-white/5 data-[disabled]:opacity-40 data-[disabled]:pointer-events-none',
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4 text-primary" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}

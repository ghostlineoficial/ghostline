'use client';

import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { useId } from 'react';
import { cn } from '@/utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
}: RadioGroupProps) {
  const groupId = useId();

  return (
    <RadixRadioGroup.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      className={cn('flex gap-4', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
    >
      {options.map((option) => {
        const itemId = `${groupId}-${option.value}`;
        return (
          <div key={option.value} className="flex items-center gap-3">
            <RadixRadioGroup.Item
              id={itemId}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card',
                'data-[state=checked]:border-primary',
                'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'disabled:opacity-40 disabled:pointer-events-none',
              )}
            >
              <RadixRadioGroup.Indicator className="h-2.5 w-2.5 rounded-full bg-primary" />
            </RadixRadioGroup.Item>
            <label htmlFor={itemId} className="text-body-sm text-foreground select-none">
              {option.label}
            </label>
          </div>
        );
      })}
    </RadixRadioGroup.Root>
  );
}

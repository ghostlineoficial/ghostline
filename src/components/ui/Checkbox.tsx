'use client';

import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/utils/cn';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
}: CheckboxProps) {
  const id = useId();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-sm border border-border bg-card',
          'transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-40 disabled:pointer-events-none',
        )}
      >
        <RadixCheckbox.Indicator>
          <Check className="h-3.5 w-3.5 text-foreground" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label htmlFor={id} className="text-body-sm text-foreground select-none">
          {label}
        </label>
      )}
    </div>
  );
}

'use client';

import * as RadixSwitch from '@radix-ui/react-switch';
import { useId } from 'react';
import { cn } from '@/utils/cn';

interface SwitchProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Switch — usado tanto para "Switch" quanto para "Toggle" no Design System.
 * Decisão: Switch e Toggle resolvem o mesmo problema de interface (estado
 * binário on/off imediato); mantê-los como um único componente evita duas
 * APIs para o mesmo padrão visual.
 */
export function Switch({ label, checked, defaultChecked, onCheckedChange, disabled }: SwitchProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <RadixSwitch.Root
        id={id}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'relative h-6 w-11 rounded-full bg-border transition-colors',
          'data-[state=checked]:bg-primary',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-40 disabled:pointer-events-none',
        )}
      >
        <RadixSwitch.Thumb
          className={cn(
            'block h-5 w-5 translate-x-0.5 rounded-full bg-foreground transition-transform',
            'data-[state=checked]:translate-x-[22px]',
          )}
        />
      </RadixSwitch.Root>
      {label && (
        <label htmlFor={id} className="text-body-sm text-foreground select-none">
          {label}
        </label>
      )}
    </div>
  );
}

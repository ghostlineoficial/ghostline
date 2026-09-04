'use client';

import { Minus, Plus } from 'lucide-react';
import { IconButton } from './IconButton';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

/** QuantityStepper — genérico, reutilizável em qualquer contexto de quantidade (produto, futuro carrinho). */
export function QuantityStepper({ value, onChange, min = 1, max = 99 }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border">
      <IconButton
        icon={<Minus className="h-3.5 w-3.5" />}
        label="Diminuir quantidade"
        size="sm"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      />
      <span className="w-8 text-center font-mono text-body-sm text-foreground" aria-live="polite">
        {value}
      </span>
      <IconButton
        icon={<Plus className="h-3.5 w-3.5" />}
        label="Aumentar quantidade"
        size="sm"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      />
    </div>
  );
}

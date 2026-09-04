'use client';

import { Chip } from './Chip';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

/** FilterGroup — grupo de Chips com seleção múltipla. Uso: sidebar de filtros do Shop. */
export function FilterGroup({ label, options, selected, onChange }: FilterGroupProps) {
  function toggle(value: string) {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption uppercase text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option.value}
            active={selected.includes(option.value)}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

'use client';

import { Search, X } from 'lucide-react';
import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'h-11 w-full rounded-full border border-border bg-card pl-11 pr-10 text-body-sm text-foreground placeholder:text-muted/60',
            'outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary',
            className,
          )}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            aria-label="Limpar busca"
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

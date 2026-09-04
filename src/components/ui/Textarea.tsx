import { type TextareaHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const areaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={areaId} className="text-caption uppercase text-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${areaId}-error` : hint ? `${areaId}-hint` : undefined}
          className={cn(
            'resize-none rounded-md border bg-card px-4 py-3 text-body text-foreground placeholder:text-muted/60',
            'transition-colors duration-150 outline-none',
            'focus:border-primary focus:ring-1 focus:ring-primary',
            'disabled:opacity-40 disabled:pointer-events-none',
            error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${areaId}-error`} className="text-body-sm text-danger">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${areaId}-hint`} className="text-body-sm text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

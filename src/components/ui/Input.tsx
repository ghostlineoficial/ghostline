import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
}

/**
 * Input — estados: normal / focus / error / success / disabled.
 * `error` tem prioridade visual sobre `success`.
 * Sempre associa label via htmlFor/id (mesmo quando label não é passado,
 * usa aria-label a partir do placeholder pra não quebrar leitores de tela).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, hint, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-caption uppercase text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'h-11 rounded-md border bg-card px-4 text-body text-foreground placeholder:text-muted/60',
            'transition-colors duration-150 outline-none',
            'focus:border-primary focus:ring-1 focus:ring-primary',
            'disabled:opacity-40 disabled:pointer-events-none',
            error
              ? 'border-danger focus:border-danger focus:ring-danger'
              : success
                ? 'border-success focus:border-success focus:ring-success'
                : 'border-border',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-body-sm text-danger">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-body-sm text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

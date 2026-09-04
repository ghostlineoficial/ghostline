import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { ButtonVariant } from './Button';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string; // obrigatório — vira aria-label, IconButton nunca tem texto visível
  variant?: Extract<ButtonVariant, 'ghost' | 'outline' | 'primary' | 'danger'>;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const variantStyles = {
  ghost: 'bg-transparent hover:bg-white/5 text-foreground',
  outline: 'border border-white/20 hover:border-white/40 text-foreground',
  primary: 'bg-primary hover:bg-primary-hover text-foreground',
  danger: 'bg-transparent hover:bg-danger/10 text-danger',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = 'ghost', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-40 disabled:pointer-events-none',
          sizeStyles[size],
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

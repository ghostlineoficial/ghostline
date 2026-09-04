import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'danger'
  | 'success'
  | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-foreground hover:bg-primary-hover',
  secondary: 'bg-card text-foreground border border-border hover:border-foreground/30',
  ghost: 'bg-transparent text-foreground hover:bg-white/5',
  outline: 'bg-transparent border border-white/20 text-foreground hover:border-white/40',
  danger: 'bg-danger text-foreground hover:brightness-110',
  success: 'bg-success text-foreground hover:brightness-110',
  link: 'bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-body-sm rounded-full',
  md: 'h-11 px-6 text-body-sm rounded-full',
  lg: 'h-14 px-8 text-body rounded-full',
  icon: 'h-11 w-11 rounded-full',
};

/**
 * Button — componente base de ação do Design System.
 * Estados: default, hover, focus-visible, disabled, loading.
 * `loading` desabilita o botão e mostra um spinner no lugar do conteúdo à esquerda.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide2 uppercase transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-40 disabled:pointer-events-none',
          variantStyles[variant],
          variant !== 'link' && sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

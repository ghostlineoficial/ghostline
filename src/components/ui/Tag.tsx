import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

/**
 * Tag — rótulo estático (ex: "STREETWEAR", "LIMITED"). Nunca clicável.
 * Diferença pro Badge: Tag usa tipografia mono/uppercase de marca,
 * Badge é neutro e serve pra status de sistema (sucesso/erro/etc).
 */
export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center border border-border px-3 py-1 font-mono text-caption uppercase tracking-wide3 text-muted',
        className,
      )}
      {...props}
    />
  );
}

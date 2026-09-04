import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes condicionalmente e resolve conflitos do Tailwind.
 * Uso: cn('px-4', condition && 'px-8') -> resolve pro último px- aplicado
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type ContainerSize = 'sm' | 'md' | 'lg' | 'full';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',    // conteúdo de leitura — texto, formulário
  md: 'max-w-5xl',    // conteúdo intermediário — perfil, checkout
  lg: 'max-w-7xl',    // padrão — grids de produto, seções de página
  full: 'max-w-none', // edge-to-edge — hero em vídeo, banner de drop
};

/** Container — largura máxima e padding lateral consistentes. Default `lg` (era o único tamanho antes desta fase). */
export function Container({ size = 'lg', className, ...props }: ContainerProps) {
  return <div className={cn('mx-auto w-full px-6', sizeStyles[size], className)} {...props} />;
}

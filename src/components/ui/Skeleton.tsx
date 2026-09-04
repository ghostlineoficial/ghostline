import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

/** Skeleton — placeholder de carregamento. Combine com aspect-ratio/w/h via className. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Carregando conteúdo"
      className={cn(
        'rounded-md bg-gradient-to-r from-card via-border to-card bg-[length:200%_100%] animate-shimmer',
        className,
      )}
    />
  );
}

/** Preset comum: skeleton de ProductCard, pra usar em grids enquanto os dados carregam. */
export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

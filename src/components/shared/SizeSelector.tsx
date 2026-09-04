import { cn } from '@/utils/cn';
import { PRODUCT_SIZES, type ProductVariant } from '@/types/product';

interface SizeSelectorProps {
  variants: ProductVariant[]; // já filtradas pela cor selecionada
  selectedSize: string | null;
  onSelect: (size: string) => void;
}

/** SizeSelector — reutilizável em qualquer contexto de escolha de tamanho (produto, quick-view futuro). */
export function SizeSelector({ variants, selectedSize, onSelect }: SizeSelectorProps) {
  const bySize = new Map(variants.map((v) => [v.size, v]));

  return (
    <div role="radiogroup" aria-label="Tamanho" className="flex flex-wrap gap-2">
      {PRODUCT_SIZES.map((size) => {
        const variant = bySize.get(size);
        const available = !!variant && variant.stock > 0;
        const active = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!available}
            onClick={() => onSelect(size)}
            title={!available ? `${size} — esgotado` : `${size} — ${variant.stock} em estoque`}
            className={cn(
              'flex h-11 min-w-11 items-center justify-center rounded-md border px-3 font-mono text-body-sm transition-colors',
              'outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              !available && 'cursor-not-allowed border-border text-muted/40 line-through',
              available && active && 'border-primary bg-primary/15 text-primary',
              available && !active && 'border-border text-foreground hover:border-foreground/40',
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

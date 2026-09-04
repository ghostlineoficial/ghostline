'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { PriceDisplay } from './PriceDisplay';
import { ProductBadge } from './ProductBadge';
import { FavoriteButton } from './FavoriteButton';
import type { Product } from '@/types/product';

interface ShopProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

/**
 * ShopProductCard — NÃO é uma alteração do `ProductCard` (Design
 * System, fora do escopo pra editar). É um card mais rico só pro grid
 * da Shop: hover-swap frente↔costas, múltiplos badges simultâneos,
 * favorito e Quick View. Reaproveita `PriceDisplay`/`ProductBadge`/
 * `FavoriteButton` por baixo — não duplica a lógica desses três.
 */
export function ShopProductCard({ product, onQuickView }: ShopProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const primaryImage = product.images[0];
  const secondaryImage =
    product.images.find((i) => i.type === 'hover') ?? product.images.find((i) => i.type === 'costas');

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const hasDiscount = !!product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.priceCents / product.compareAtPriceCents!) * 100)
    : 0;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition-all duration-300 group-hover:border-white/30 group-hover:shadow-2xl">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
              style={{ opacity: hovered && secondaryImage ? 0 : 1 }}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt=""
              fill
              className="object-cover transition-opacity duration-300"
              style={{ opacity: hovered ? 1 : 0 }}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {totalStock === 0 && <ProductBadge kind="sold-out" />}
            {product.isNew && <ProductBadge kind="new" />}
            {hasDiscount && <ProductBadge kind="discount" discountPercent={discountPercent} />}
            {product.dropId && <ProductBadge kind="limited" />}
          </div>

          <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <FavoriteButton productName={product.name} />
          </div>

          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <IconButton
              icon={<Eye className="h-4 w-4" />}
              label="Visualização rápida"
              variant="outline"
              className="w-full rounded-md border-white/20 bg-background/70 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
  {product.name}
</h3>
          <PriceDisplay priceCents={product.priceCents} compareAtCents={product.compareAtPriceCents} size="sm" />
        </div>
      </Link>
    </div>
  );
}

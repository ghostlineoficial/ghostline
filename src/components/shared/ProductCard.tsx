import Image from 'next/image';
import Link from 'next/link';
import { PriceDisplay } from './PriceDisplay';
import { ProductBadge } from './ProductBadge';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  compareAtCents?: number;
  badge?: 'new' | 'sold-out' | 'discount' | 'limited';
  discountPercent?: number;
}

export function ProductCard({ product, compareAtCents, badge, discountPercent }: ProductCardProps) {
  const coverImage = product.images[0];

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card">
        {coverImage && (
          <Image
            src={coverImage.url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        )}
        {badge && (
          <div className="absolute left-3 top-3">
            <ProductBadge kind={badge} discountPercent={discountPercent} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-body-sm text-foreground">{product.name}</p>
        <PriceDisplay priceCents={product.priceCents} compareAtCents={compareAtCents} size="sm" />
      </div>
    </Link>
  );
}

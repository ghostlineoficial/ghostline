'use client';

import { useState } from 'react';
import { Grid } from '@/components/ui/Grid';
import { RevealGroup, RevealItem } from '@/components/layout/Reveal';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchX } from 'lucide-react';
import { ShopProductCard } from './ShopProductCard';
import { QuickViewModal } from './QuickViewModal';
import type { Product } from '@/types/product';
import type { GridCols } from '@/lib/shop-filters';

interface ShopProductGridProps {
  products: Product[];
  cols: GridCols;
}

/** ShopProductGrid — dono do estado "qual produto está no Quick View agora". Client Component por causa disso e do hover dos cards. */
export function ShopProductGrid({ products, cols }: ShopProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-8 w-8" />}
        title="Nenhum produto encontrado"
        description="Tente ajustar ou limpar os filtros aplicados."
        action={{ label: 'Limpar filtros', onClick: () => (window.location.href = '/shop') }}
      />
    );
  }

  return (
    <>
      <RevealGroup>
        <Grid cols={cols} gap={6}>
          {products.map((product) => (
            <RevealItem key={product.id}>
              <ShopProductCard product={product} onQuickView={setQuickViewProduct} />
            </RevealItem>
          ))}
        </Grid>
      </RevealGroup>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}

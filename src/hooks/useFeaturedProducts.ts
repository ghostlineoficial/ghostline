import { unstable_cache } from 'next/cache';
import { ProductService } from '@/services/product.service';
import type { Product } from '@/types/product';

/** useFeaturedProducts — mesma natureza de useProducts (ver esse arquivo pra rationale completa). */
export const useFeaturedProducts = unstable_cache(
  async (limit = 8): Promise<Product[]> => ProductService.getFeaturedProducts(limit),
  ['featured-products'],
  { revalidate: 60, tags: ['products'] },
);

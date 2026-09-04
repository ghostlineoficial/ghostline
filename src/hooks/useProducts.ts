import { unstable_cache } from 'next/cache';
import { ProductService, type ProductFilters } from '@/services/product.service';
import type { Product } from '@/types/product';

/**
 * useProducts — NÃO é um hook React com estado (sem useState/useEffect).
 * É uma função de acesso a dado pensada pra ser usada com `await` dentro
 * de Server Components, seguindo a convenção de nome pedida nesta fase.
 * Performance > idiomatismo de nome aqui: "Server Components sempre que
 * possível" (requisito desta fase) significa que a maior parte dos dados
 * nunca deveria passar por um hook client-side com useState/useEffect —
 * isso geraria um loading state e uma requisição no browser que um
 * `await` no servidor evita completamente.
 *
 * Se um Client Component precisar disso no futuro (ex: filtro de Shop
 * interativo), a forma certa é um hook client de verdade (SWR/React
 * Query) chamando uma Route Handler que usa este mesmo ProductService
 * por baixo — não duplicar a query, só trocar a camada de transporte.
 *
 * `unstable_cache` dá o cache+revalidate pedido: 60s de janela, e a tag
 * "products" permite invalidar sob demanda (`revalidateTag('products')`)
 * assim que o catálogo mudar via admin, sem esperar o timeout.
 */
export const useProducts = unstable_cache(
  async (filters: ProductFilters = {}): Promise<Product[]> => ProductService.getProducts(filters),
  ['products'],
  { revalidate: 60, tags: ['products'] },
);

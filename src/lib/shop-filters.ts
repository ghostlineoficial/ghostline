import type { Product } from '@/types/product';

/**
 * Filtro/ordenação/paginação da Shop. NENHUMA função aqui acessa
 * Supabase ou Service — recebem o array já retornado por
 * `ProductService.getProducts()` e refinam em memória. Existe porque
 * `ProductFilters` (em product.service.ts) só suporta categoria/drop/
 * coleção/destaque — cor, tamanho, preço, disponibilidade e a maior
 * parte das ordenações não têm suporte na query do Supabase hoje, e
 * esta fase proíbe alterar Services. Se o catálogo crescer pra
 * centenas de produtos, o próximo passo natural é mover esse filtro
 * pra dentro do `ProductService` (query real, com paginação no banco)
 * — troca mecânica, esta camada já isola exatamente o que mudaria.
 */

export const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'mais-vendidos', label: 'Mais vendidos' },
  { value: 'populares', label: 'Mais populares' },
  { value: 'destaques', label: 'Destaques' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export const GRID_COLS = [2, 3, 4] as const;
export type GridCols = (typeof GRID_COLS)[number];

export const PAGE_SIZE = 12;

export interface ShopFilterState {
  category?: string;
  drop?: string;
  collection?: string;
  colors: string[];
  sizes: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly: boolean;
  newOnly: boolean;
  featuredOnly: boolean;
  q: string;
  sort: SortValue;
  page: number;
  cols: GridCols;
}

type SearchParamsShape = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseShopSearchParams(params: SearchParamsShape): ShopFilterState {
  const sortRaw = first(params.ordenar);
  const sort = (SORT_OPTIONS.find((o) => o.value === sortRaw)?.value ?? 'recentes') as SortValue;
  const colsRaw = Number(first(params.cols));
  const cols = (GRID_COLS.includes(colsRaw as GridCols) ? colsRaw : 3) as GridCols;

  return {
    category: first(params.categoria),
    drop: first(params.drop),
    collection: first(params.colecao),
    colors: (first(params.cor) ?? '').split(',').filter(Boolean),
    sizes: (first(params.tamanho) ?? '').split(',').filter(Boolean),
    priceMin: first(params.precoMin) ? Number(first(params.precoMin)) : undefined,
    priceMax: first(params.precoMax) ? Number(first(params.precoMax)) : undefined,
    inStockOnly: first(params.disponivel) === '1',
    newOnly: first(params.novo) === '1',
    featuredOnly: first(params.destaque) === '1',
    q: first(params.q) ?? '',
    sort,
    page: Math.max(1, Number(first(params.page)) || 1),
    cols,
  };
}

/** Refinamento em memória — cor, tamanho, preço, disponibilidade, novidade e busca textual. */
export function applyShopFilters(products: Product[], filters: ShopFilterState): Product[] {
  return products.filter((product) => {
    if (filters.colors.length > 0) {
      const productColors = new Set(product.variants.map((v) => v.color));
      if (!filters.colors.some((c) => productColors.has(c))) return false;
    }

    if (filters.sizes.length > 0) {
      const productSizes = new Set(product.variants.filter((v) => v.stock > 0).map((v) => v.size));
      if (!filters.sizes.some((s) => productSizes.has(s))) return false;
    }

    if (filters.priceMin !== undefined && product.priceCents < filters.priceMin * 100) return false;
    if (filters.priceMax !== undefined && product.priceCents > filters.priceMax * 100) return false;

    if (filters.inStockOnly) {
      const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
      if (totalStock === 0) return false;
    }

    if (filters.newOnly && !product.isNew) return false;
    if (filters.featuredOnly && !product.featured) return false;

    if (filters.q.trim()) {
      const needle = filters.q.trim().toLowerCase();
      if (!product.name.toLowerCase().includes(needle) && !product.description?.toLowerCase().includes(needle)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * "mais-vendidos" e "populares" ainda não têm dado real (nenhuma tabela
 * de vendas/pageviews agregada é consultada por ProductService hoje) —
 * usam a mesma ordem de "destaques" como aproximação razoável, não uma
 * métrica inventada. Trocar isso por dado real é só substituir este
 * `case`, o resto da página não muda.
 */
export function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'menor-preco':
      return sorted.sort((a, b) => a.priceCents - b.priceCents);
    case 'maior-preco':
      return sorted.sort((a, b) => b.priceCents - a.priceCents);
    case 'destaques':
    case 'mais-vendidos':
    case 'populares':
      return sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    case 'recentes':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  }
}

export function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), totalPages };
}

/** Cores/tamanhos disponíveis no conjunto de produtos atual — pra montar os filtros dinamicamente, nunca hardcoded. */
export function extractAvailableColors(products: Product[]): string[] {
  return [...new Set(products.flatMap((p) => p.variants.map((v) => v.color)))];
}

export function extractAvailableSizes(products: Product[]): string[] {
  return [...new Set(products.flatMap((p) => p.variants.filter((v) => v.stock > 0).map((v) => v.size)))];
}

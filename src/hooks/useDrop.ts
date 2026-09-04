import { unstable_cache } from 'next/cache';
import { DropService } from '@/services/drop.service';
import type { Drop } from '@/types/product';

/**
 * useDrop — mesma natureza de useProducts (ver esse arquivo pra
 * rationale completa). Sem slug, retorna o drop ativo (`live`) —
 * é o caso mais comum (Home, banner principal).
 */
export const useDrop = unstable_cache(
  async (slug?: string): Promise<Drop | null> =>
    slug ? DropService.getDropBySlug(slug) : DropService.getActiveDrop(),
  ['drop'],
  { revalidate: 60, tags: ['drops'] },
);

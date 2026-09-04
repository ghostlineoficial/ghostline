import { unstable_cache } from 'next/cache';
import { BannerService } from '@/services/banner.service';
import type { Banner } from '@/types/product';

/**
 * useBanner — mesma natureza de useProducts (ver esse arquivo pra
 * rationale completa). `key` segue a convenção do BannerService:
 * "home", "drop:<slug>" ou "collection:<slug>".
 */
export const useBanner = unstable_cache(
  async (key: string): Promise<Banner | null> => BannerService.getBanner(`banner:${key}`),
  ['banner'],
  { revalidate: 300, tags: ['banners'] },
);

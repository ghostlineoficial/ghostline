import { createClient } from '@/lib/supabase/server';
import type { Banner } from '@/types/product';

/**
 * BannerService — único lugar que lê banners. Não existe uma tabela
 * `banners` própria (fora do escopo desta fase — proibido alterar o
 * banco). Em vez disso, cada banner é uma linha em `settings`
 * (key/value jsonb, tabela que já existe e foi desenhada exatamente
 * pra configuração que muda de formato) com chave convencionada:
 *
 *   banner:home                    → banner principal do site
 *   banner:drop:<slug-do-drop>     → banner do drop (desktop + mobile)
 *   banner:collection:<slug>       → banner da coleção
 *
 * O valor jsonb segue sempre o formato `Banner` (desktopUrl, mobileUrl,
 * alt, href). `desktopUrl`/`mobileUrl` cobrem os 4 pedidos da fase
 * (Principal, Mobile, Desktop, Coleção, Drop) com uma única forma.
 */

interface SettingRow {
  key: string;
  value: Banner;
}

async function getBannerByKey(key: string): Promise<Banner | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('settings').select('key, value').eq('key', key).maybeSingle();

  if (error) throw new Error(`BannerService.getBannerByKey(${key}): ${error.message}`);
  if (!data) return null;
  return (data as SettingRow).value;
}

export const BannerService = {
  /** Banner principal da Home. */
  async getHomeBanner(): Promise<Banner | null> {
    return getBannerByKey('banner:home');
  },

  /** Banner de um Drop específico, pela slug do drop. */
  async getDropBanner(dropSlug: string): Promise<Banner | null> {
    return getBannerByKey(`banner:drop:${dropSlug}`);
  },

  /** Banner de uma Coleção específica, pela slug da coleção. */
  async getCollectionBanner(collectionSlug: string): Promise<Banner | null> {
    return getBannerByKey(`banner:collection:${collectionSlug}`);
  },

  /** Genérico — usar quando a chave não se encaixa nos três casos acima. */
  async getBanner(key: string): Promise<Banner | null> {
    return getBannerByKey(key);
  },
};

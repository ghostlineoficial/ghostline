import { createClient } from '@/lib/supabase/server';
import type { Drop } from '@/types/product';
import { ProductService } from './product.service';

/**
 * DropService — único lugar que consulta a tabela `drops`. O sistema
 * nunca assume que existe só um drop: `getActiveDrop()` pega o que
 * está com status `live` agora, mas `getDrops()` lista todos (upcoming/
 * live/ended) pra qualquer tela de histórico de drops.
 */

interface DropRow {
  id: string;
  name: string;
  slug: string;
  starts_at: string;
  ends_at: string | null;
  status: 'upcoming' | 'live' | 'ended';
  story: string | null;
  trailer_url: string | null;
}

function mapDrop(row: DropRow): Omit<Drop, 'products'> {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? '',
    status: row.status,
    story: row.story ?? undefined,
    trailerUrl: row.trailer_url ?? undefined,
  };
}

export const DropService = {
  /** Todos os drops, mais recente primeiro. */
  async getDrops(): Promise<Omit<Drop, 'products'>[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('drops')
      .select('id, name, slug, starts_at, ends_at, status, story, trailer_url')
      .order('starts_at', { ascending: false });

    if (error) throw new Error(`DropService.getDrops: ${error.message}`);
    return (data as DropRow[]).map(mapDrop);
  },

  /** Um drop pela slug, já com os produtos carregados (via ProductService — nunca duplica a query aqui). */
  async getDropBySlug(slug: string): Promise<Drop | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('drops')
      .select('id, name, slug, starts_at, ends_at, status, story, trailer_url')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`DropService.getDropBySlug: ${error.message}`);
    }

    const products = await ProductService.getProductsByDropSlug(slug);
    return { ...mapDrop(data as DropRow), products };
  },

  /** O drop ativo agora (status `live`). Retorna null se nenhum drop estiver ao vivo. */
  async getActiveDrop(): Promise<Drop | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('drops')
      .select('id, name, slug, starts_at, ends_at, status, story, trailer_url')
      .eq('status', 'live')
      .order('starts_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`DropService.getActiveDrop: ${error.message}`);
    if (!data) return null;

    const products = await ProductService.getProductsByDropSlug(data.slug);
    return { ...mapDrop(data as DropRow), products };
  },
};

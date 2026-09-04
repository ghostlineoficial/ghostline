import { ProductService } from '@/services/product.service';
import { ProductCard } from './ProductCard';
import { SectionTitle } from './SectionTitle';
import { Grid } from '@/components/ui/Grid';
import { RevealGroup, RevealItem } from '@/components/layout/Reveal';

interface RelatedProductsProps {
  currentProductId: string;
  categorySlug: string;
  dropSlug?: string;
}

/**
 * RelatedProducts — Server Component assíncrono, pensado pra entrar num
 * `<Suspense>` na página de produto (não bloqueia o resto da página
 * enquanto busca). Prioriza produtos do mesmo Drop; se não houver o
 * suficiente, completa com a mesma categoria — nunca acessa o Supabase
 * direto, só `ProductService`, com os filtros que já existiam desde a
 * Fase 06 (nenhum Service alterado).
 */
export async function RelatedProducts({ currentProductId, categorySlug, dropSlug }: RelatedProductsProps) {
  const byDrop = dropSlug ? await ProductService.getProducts({ dropSlug }) : [];
  const byCategory = await ProductService.getProducts({ categorySlug });

  const merged = [...byDrop, ...byCategory].filter((p) => p.id !== currentProductId);
  const seen = new Set<string>();
  const related = merged.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true))).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div>
      <SectionTitle eyebrow="Combina com" title="Você também vai gostar" className="mb-10" />
      <RevealGroup>
        <Grid cols={4} gap={6}>
          {related.map((product) => (
            <RevealItem key={product.id}>
              <ProductCard product={product} />
            </RevealItem>
          ))}
        </Grid>
      </RevealGroup>
    </div>
  );
}

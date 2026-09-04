import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductService } from '@/services/product.service';
import { buildProductMetadata, buildProductJsonLd } from '@/lib/seo';
import { genericSpecs, genericMeasurements, productFaq } from '@/lib/product-content';

import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Grid } from '@/components/ui/Grid';
import { Divider } from '@/components/ui/Divider';
import { Accordion } from '@/components/ui/Accordion';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/layout/Reveal';

import {
  ProductSelectionProvider,
  ProductGalleryConnected,
  ProductOptionsConnected,
} from '@/components/shared/ProductSelection';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { ProductBadge } from '@/components/shared/ProductBadge';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { MeasurementsTable } from '@/components/shared/MeasurementsTable';
import { ReviewsSummary } from '@/components/shared/ReviewsSummary';
import { RelatedProducts } from '@/components/shared/RelatedProducts';
import { SplitFeature } from '@/components/shared/SplitFeature';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cor?: string; tamanho?: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) return {};

  return buildProductMetadata(product);
}

function categoryLabel(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const { cor, tamanho } = await searchParams;

  const product = await ProductService.getProductBySlug(slug);

  console.log('==============================');
  console.log('PRODUTO');
  console.log(product);
  console.log('IMAGENS');
  console.log(product?.images);
  console.log('==============================');

  if (!product) notFound();

  const jsonLd = buildProductJsonLd(product);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const hasDiscount =
    !!product.compareAtPriceCents &&
    product.compareAtPriceCents > product.priceCents;

  const discountPercent = hasDiscount
    ? Math.round(
        (1 - product.priceCents / product.compareAtPriceCents!) * 100,
      )
    : 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <Section tight>
        <Container>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              {
                label: categoryLabel(product.category),
                href: `/shop?categoria=${product.category}`,
              },
              { label: product.name },
            ]}
          />
        </Container>
      </Section>

      <Section tight>
        <Container>
          <ProductSelectionProvider product={product} initialColor={cor} initialSize={tamanho}>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <ProductGalleryConnected />
            </Reveal>

            <Reveal className="flex flex-col gap-6">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {totalStock === 0 && <ProductBadge kind="sold-out" />}
                  {product.isNew && <ProductBadge kind="new" />}
                  {hasDiscount && (
                    <ProductBadge
                      kind="discount"
                      discountPercent={discountPercent}
                    />
                  )}
                  {product.dropId && <ProductBadge kind="limited" />}
                </div>

                <h1 className="font-display text-h1 uppercase leading-[0.95] text-foreground">
                  {product.name}
                </h1>

                {product.dropId && (
                  <p className="mt-2 text-body-sm text-muted">
                    Parte de um drop de edição limitada.
                  </p>
                )}

                <div className="mt-5">
                  <PriceDisplay
                    priceCents={product.priceCents}
                    compareAtCents={product.compareAtPriceCents}
                    size="lg"
                  />
                </div>

                {product.description && (
                  <p className="mt-5 max-w-md text-body-sm text-muted">
                    {product.description}
                  </p>
                )}
              </div>

              <Divider />

              <ProductOptionsConnected />
            </Reveal>
          </div>
          </ProductSelectionProvider>
        </Container>
      </Section>

      <Section background="surface">
        <Container size="md">
          <Reveal>
            <Accordion
              type="single"
              items={[
                {
                  value: 'descricao',
                  title: 'Descrição',
                  content: (
                    <div className="flex flex-col gap-2">
                      <p>
                        {product.description ||
                          'Sem descrição cadastrada para este produto.'}
                      </p>
                    </div>
                  ),
                },
                {
                  value: 'especificacoes',
                  title: 'Especificações',
                  content: (
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                      {genericSpecs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex justify-between border-b border-border/60 pb-2"
                        >
                          <dt className="text-muted">{spec.label}</dt>
                          <dd className="text-foreground">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                },
                {
                  value: 'medidas',
                  title: 'Tabela de Medidas',
                  content: <MeasurementsTable rows={genericMeasurements} />,
                },
                ...productFaq.map((item) => ({
                  value: item.value,
                  title: item.title,
                  content: <p>{item.content}</p>,
                })),
              ]}
            />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SplitFeature
              imageSrc={
                product.images[0]?.url ??
                '/images/ghost-studio-mockup.svg'
              }
              imageAlt="Ghost Studio"
              eyebrow="Ghost Studio"
              title="Gostou desta peça? Personalize agora."
              description="Escolha a cor, a arte, o texto, a fonte. Monte a sua versão desta peça e veja o render antes de comprar."
              cta={{
                label: 'Abrir Ghost Studio',
                href: '/ghost-studio',
              }}
              imageSide="right"
            />
          </Reveal>
        </Container>
      </Section>

      <Section tight background="surface">
        <Container>
          <Suspense
            fallback={
              <Grid cols={4} gap={6}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="aspect-[3/4] w-full"
                  />
                ))}
              </Grid>
            }
          >
            <RelatedProducts
              currentProductId={product.id}
              categorySlug={product.category}
            />
          </Suspense>
        </Container>
      </Section>

      <Section tight>
        <Container size="md">
          <Reveal>
            <SectionTitle
              eyebrow="Avaliações"
              title="O que dizem sobre essa peça"
              className="mb-8"
            />
            <ReviewsSummary />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
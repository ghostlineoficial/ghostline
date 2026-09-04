import type { Metadata } from 'next';
import { ProductService } from '@/services/product.service';
import { BannerService } from '@/services/banner.service';
import { buildShopMetadata, buildShopJsonLd } from '@/lib/seo';
import {
  parseShopSearchParams,
  applyShopFilters,
  sortProducts,
  paginate,
  extractAvailableColors,
  extractAvailableSizes,
  PAGE_SIZE,
} from '@/lib/shop-filters';
import { mockCategories, mockDrops, mockCollections } from '@/lib/mock/catalog';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Newsletter } from '@/components/shared/Newsletter';
import { ShopHero } from '@/components/shared/ShopHero';
import { ShopToolbar } from '@/components/shared/ShopToolbar';
import { ShopFilters } from '@/components/shared/ShopFilters';
import { ShopSearch } from '@/components/shared/ShopSearch';
import { ShopProductGrid } from '@/components/shared/ShopProductGrid';
import { ShopPagination } from '@/components/shared/ShopPagination';

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const filters = parseShopSearchParams(sp);

  const title =
    (filters.drop &&
      mockDrops.find((d) => d.slug === filters.drop)?.name) ||
    (filters.category &&
      mockCategories.find((c) => c.slug === filters.category)?.name) ||
    (filters.collection &&
      mockCollections.find((c) => c.slug === filters.collection)?.name) ||
    undefined;

  const params = new URLSearchParams();

  if (filters.category) {
    params.set('categoria', filters.category);
  }

  if (filters.drop) {
    params.set('drop', filters.drop);
  }

  if (filters.collection) {
    params.set('colecao', filters.collection);
  }

  const canonicalPath = `/shop${
    params.toString() ? `?${params.toString()}` : ''
  }`;

  return buildShopMetadata({
    title,
    canonicalPath,
  });
}

/*
 |----------------------------------------------------------
 | BANNERS DAS CATEGORIAS
 |----------------------------------------------------------
*/

const categoryBanners: Record<string, string> = {
  oversized: '/images/banners/category-oversized-banner.png',
  casacos: '/images/banners/category-casacos-banner.png',

  // Vamos adicionar quando os banners estiverem prontos:
  // 'dry-fit': '/images/banners/category-dryfit-banner.png',
  // colecoes: '/images/banners/category-colecoes-banner.png',
};

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const sp = await searchParams;
  const filters = parseShopSearchParams(sp);

  /*
   |----------------------------------------------------------
   | BUSCA BANNER PADRÃO + PRODUTOS
   |----------------------------------------------------------
  */

  const [defaultBanner, serviceFiltered] = await Promise.all([
    filters.drop
      ? BannerService.getDropBanner(filters.drop)
      : filters.collection
        ? BannerService.getCollectionBanner(filters.collection)
        : BannerService.getHomeBanner(),

    ProductService.getProducts({
      categorySlug: filters.category,
      dropSlug: filters.drop,
      collectionSlug: filters.collection,
      featuredOnly: filters.featuredOnly || undefined,
    }),
  ]);

  /*
   |----------------------------------------------------------
   | BANNER DA CATEGORIA
   |----------------------------------------------------------
  */

  const categoryBannerImage =
    filters.category && categoryBanners[filters.category];

  const banner = categoryBannerImage
    ? {
        ...defaultBanner,
        desktopUrl: categoryBannerImage,
        mobileUrl: categoryBannerImage,
      }
    : defaultBanner;

  /*
   |----------------------------------------------------------
   | FILTROS
   |----------------------------------------------------------
  */

  const availableColors =
    extractAvailableColors(serviceFiltered);

  const availableSizes =
    extractAvailableSizes(serviceFiltered);

  const refined =
    applyShopFilters(serviceFiltered, filters);

  const sorted =
    sortProducts(refined, filters.sort);

  const {
    items: pageItems,
    totalPages,
  } = paginate(
    sorted,
    filters.page,
    PAGE_SIZE
  );

  /*
   |----------------------------------------------------------
   | TÍTULO DO BANNER
   |----------------------------------------------------------
  */

  const heroTitle =
    (filters.drop &&
      mockDrops.find((d) => d.slug === filters.drop)?.name) ||
    (filters.category &&
      mockCategories.find((c) => c.slug === filters.category)?.name) ||
    (filters.collection &&
      mockCollections.find((c) => c.slug === filters.collection)?.name) ||
    'Shop';

  /*
   |----------------------------------------------------------
   | DESCRIÇÃO DO BANNER
   |----------------------------------------------------------
  */

  const heroSubtitle =
    (filters.drop &&
      mockDrops.find((d) => d.slug === filters.drop)?.story) ||
    (filters.collection &&
      mockCollections.find((c) => c.slug === filters.collection)
        ?.description) ||
    'Coleção completa Ghostline — streetwear premium, além dos limites.';

  /*
   |----------------------------------------------------------
   | SEO
   |----------------------------------------------------------
  */

  const jsonLd = buildShopJsonLd({
    title: heroTitle,
    canonicalPath: '/shop',
    productUrls: sorted
      .slice(0, 20)
      .map((p) => `/shop/${p.slug}`),
  });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* BANNER */}
      <ShopHero
        banner={banner}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      {/* PRODUTOS */}
      <Section tight>
        <Container>
          <div className="mb-8 max-w-md">
            <ShopSearch />
          </div>

          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">

            <aside className="hidden lg:block">
              <ShopFilters
                availableColors={availableColors}
                availableSizes={availableSizes}
              />
            </aside>

            <div>
              <ShopToolbar
                totalCount={sorted.length}
                sort={filters.sort}
                cols={filters.cols}
                availableColors={availableColors}
                availableSizes={availableSizes}
              />

              <div className="mt-8">
                <ShopProductGrid
                  products={pageItems}
                  cols={filters.cols}
                />
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <ShopPagination
                    page={filters.page}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* NEWSLETTER */}
      <Section background="surface">
        <Container size="sm">
          <Newsletter
            title="Não perca o próximo Drop"
            description="Cadastre seu e-mail e receba acesso antecipado antes de todo mundo."
          />
        </Container>
      </Section>
    </>
  );
}
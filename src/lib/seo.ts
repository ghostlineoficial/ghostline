import type { Metadata } from 'next';
import type { Product, Drop } from '@/types/product';

/**
 * Helpers de SEO centralizados. Mesma lógica que já está inline em
 * `app/(marketing)/page.tsx` (metadata/OG/Twitter/JSON-LD), extraída
 * aqui pra ser reutilizada pelas páginas de produto e de drop quando
 * existirem — sem repetir a montagem de metadata em cada uma.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ghostline.com.br';
export { SITE_URL };

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildProductMetadata(product: Product): Metadata {
  const url = absoluteUrl(`/shop/${product.slug}`);
  const image = product.images[0]?.url;
  const title = `${product.name} — Ghostline`;
  const description = product.description || 'Streetwear premium Ghostline — Beyond the Limits.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Ghostline',
      images: image ? [{ url: absoluteUrl(image), width: 1000, height: 1250 }] : undefined,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

export function buildProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((img) => absoluteUrl(img.url)),
    sku: product.variants[0]?.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: (product.priceCents / 100).toFixed(2),
      availability: product.variants.some((v) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/shop/${product.slug}`),
    },
  };
}

export function buildDropMetadata(drop: Drop): Metadata {
  const url = absoluteUrl(`/drops/${drop.slug}`);
  const title = `${drop.name} — Ghostline`;
  const description = drop.story || 'Edição limitada Ghostline.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Ghostline',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Metadata da Shop — adicionada na Fase 08 (Shop Premium Experience).
 * `title`/`description` variam conforme filtro ativo (categoria/drop),
 * pra cada combinação indexável ter um título coerente em vez de todas
 * as URLs de filtro competindo pelo mesmo <title>.
 */
export function buildShopMetadata(opts: { title?: string; canonicalPath: string }): Metadata {
  const url = absoluteUrl(opts.canonicalPath);
  const title = opts.title ? `${opts.title} — Ghostline` : 'Shop — Ghostline';
  const description = 'Streetwear premium Ghostline. Coleção completa e drops de edição limitada.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Ghostline',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function buildShopJsonLd(opts: { title: string; canonicalPath: string; productUrls: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.title,
    url: absoluteUrl(opts.canonicalPath),
    hasPart: opts.productUrls.map((path) => ({ '@type': 'Product', url: absoluteUrl(path) })),
  };
}

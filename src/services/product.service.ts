import { createClient } from '@/lib/supabase/server';
import { resolveImageColor } from '@/lib/product-media';
import {
  mockProducts,
  oversizedProducts,
} from '@/lib/mock/catalog';

import {
  PRODUCT_IMAGE_TYPE_ORDER,
  type Product,
  type ProductImage,
  type ProductVariant,
} from '@/types/product';

const NEW_THRESHOLD_DAYS = 14;

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  active: boolean;
  featured: boolean;
  created_at: string;
  category_id: string | null;
  collection_id: string | null;
  drop_id: string | null;
  weight_grams: number | null;

  categories:
    | {
        slug: string;
      }
    | {
        slug: string;
      }[]
    | null;

  product_images: {
    id: string;
    url: string;
    position: number;
    is_primary: boolean;
  }[];

  product_variants: {
    id: string;
    color: string | null;
    size: string | null;
    sku: string;
    stock: number;
  }[];
}

function isNew(
  createdAt?: string,
): boolean {
  if (!createdAt) {
    return false;
  }

  const ageMs =
    Date.now() -
    new Date(createdAt).getTime();

  return (
    ageMs <=
    NEW_THRESHOLD_DAYS *
      24 *
      60 *
      60 *
      1000
  );
}

function getCategorySlug(
  categories: ProductRow['categories'],
): string {
  if (!categories) {
    return '';
  }

  if (Array.isArray(categories)) {
    return categories[0]?.slug ?? '';
  }

  return categories.slug ?? '';
}

function mapVariants(
  productId: string,
  rows: ProductRow['product_variants'],
): ProductVariant[] {
  return rows.map((row) => ({
    id: row.id,
    productId,
    color: row.color ?? '',
    size: row.size ?? '',
    stock: row.stock,
    sku: row.sku,
  }));
}

function mapImages(
  productId: string,
  rows: ProductRow['product_images'],
  knownColors: string[],
): ProductImage[] {
  return [...rows]
    .sort(
      (a, b) =>
        a.position - b.position,
    )
    .map((row, i) => ({
      id: row.id,
      productId,
      url: row.url,
      order: row.position,
      isPrimary: row.is_primary,
      type:
        PRODUCT_IMAGE_TYPE_ORDER[i] ??
        'detalhe',
      color: resolveImageColor(
        undefined,
        row.url,
        knownColors,
      ),
    }));
}

function mapProduct(
  row: ProductRow,
): Product {
  const variants = mapVariants(
    row.id,
    row.product_variants ?? [],
  );

  const knownColors = [
    ...new Set(
      variants
        .map(
          (variant) =>
            variant.color,
        )
        .filter(Boolean),
    ),
  ];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description:
      row.description ?? '',
    priceCents:
      row.price_cents,
    compareAtPriceCents:
      row.compare_at_price_cents ??
      undefined,
    category:
      getCategorySlug(
        row.categories,
      ),
    categoryId:
      row.category_id ?? undefined,
    collectionId:
      row.collection_id ??
      undefined,
    dropId:
      row.drop_id ?? undefined,
    weightGrams:
      row.weight_grams ??
      undefined,
    active: row.active,
    featured: row.featured,
    isNew: isNew(
      row.created_at,
    ),
    createdAt:
      row.created_at,
    images: mapImages(
      row.id,
      row.product_images ?? [],
      knownColors,
    ),
    variants,
  };
}

function prepareLocalProduct(
  product: Product,
): Product {
  return {
    ...product,
    isNew: isNew(
      product.createdAt,
    ),
    images: [
      ...product.images,
    ].sort(
      (a, b) =>
        a.order - b.order,
    ),
  };
}

const PRODUCT_SELECT = `
id,
name,
slug,
description,
price_cents,
compare_at_price_cents,
active,
featured,
created_at,
category_id,
collection_id,
drop_id,
weight_grams,
categories (
  slug
),
product_images (
  id,
  url,
  position,
  is_primary
),
product_variants (
  id,
  color,
  size,
  sku,
  stock
)
`;

export interface ProductFilters {
  categorySlug?: string;
  dropSlug?: string;
  collectionSlug?: string;
  featuredOnly?: boolean;
}

export const ProductService = {
  async getProducts(
    filters: ProductFilters = {},
  ): Promise<Product[]> {
    if (
      filters.categorySlug ===
        'oversized' &&
      !filters.dropSlug &&
      !filters.collectionSlug
    ) {
      return oversizedProducts
        .filter(
          (product) =>
            product.active,
        )
        .filter((product) =>
          filters.featuredOnly
            ? product.featured
            : true,
        )
        .map(
          prepareLocalProduct,
        );
    }

    const supabase =
      await createClient();

    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('active', true);

    if (filters.categorySlug) {
      const {
        data: category,
      } = await supabase
        .from('categories')
        .select('id')
        .eq(
          'slug',
          filters.categorySlug,
        )
        .single();

      if (!category) {
        return [];
      }

      query = query.eq(
        'category_id',
        category.id,
      );
    }

    if (
      filters.featuredOnly
    ) {
      query = query.eq(
        'featured',
        true,
      );
    }

    if (filters.dropSlug) {
      const {
        data: drop,
      } = await supabase
        .from('drops')
        .select('id')
        .eq(
          'slug',
          filters.dropSlug,
        )
        .single();

      if (!drop) {
        return [];
      }

      query = query.eq(
        'drop_id',
        drop.id,
      );
    }

    if (
      filters.collectionSlug
    ) {
      const {
        data: collection,
      } = await supabase
        .from('collections')
        .select('id')
        .eq(
          'slug',
          filters.collectionSlug,
        )
        .single();

      if (!collection) {
        return [];
      }

      query = query.eq(
        'collection_id',
        collection.id,
      );
    }

    const {
      data,
      error,
    } = await query.order(
      'created_at',
      {
        ascending: false,
      },
    );

    if (error) {
      throw new Error(
        `ProductService.getProducts: ${error.message}`,
      );
    }

    return (
      (data ?? []) as unknown as ProductRow[]
    ).map(mapProduct);
  },

  async getFeaturedProducts(
    limit = 8,
  ): Promise<Product[]> {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('active', true)
      .eq('featured', true)
      .order(
        'created_at',
        {
          ascending: false,
        },
      )
      .limit(limit);

    if (error) {
      throw new Error(
        `ProductService.getFeaturedProducts: ${error.message}`,
      );
    }

    return (
      (data ?? []) as unknown as ProductRow[]
    ).map(mapProduct);
  },

  async getProductBySlug(
    slug: string,
  ): Promise<Product | null> {
    const oversizedProduct =
      oversizedProducts.find(
        (product) =>
          product.slug ===
            slug &&
          product.active,
      );

    if (oversizedProduct) {
      return prepareLocalProduct(
        oversizedProduct,
      );
    }

    const dropProduct =
      mockProducts.find(
        (product) =>
          product.slug ===
            slug &&
          product.active,
      );

    if (dropProduct) {
      return prepareLocalProduct(
        dropProduct,
      );
    }

    const supabase =
      await createClient();

    const {
      data,
      error,
    } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .single();

    if (error) {
      if (
        error.code ===
        'PGRST116'
      ) {
        return null;
      }

      throw new Error(
        `ProductService.getProductBySlug: ${error.message}`,
      );
    }

    return mapProduct(
      data as unknown as ProductRow,
    );
  },

  async getProductsByDropSlug(
    dropSlug: string,
  ): Promise<Product[]> {
    if (
      dropSlug === 'drop-01'
    ) {
      return mockProducts
        .filter(
          (product) =>
            product.active &&
            product.dropId ===
              'drop-01',
        )
        .map(
          prepareLocalProduct,
        );
    }

    return ProductService.getProducts(
      {
        dropSlug,
      },
    );
  },
};
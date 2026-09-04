// ============================================================
// Tipos do catálogo. Extensão aditiva sobre o que já existia —
// nenhum campo usado por componentes existentes (ProductCard,
// DropCard, home-content.ts) foi removido ou teve o tipo alterado.
// Tudo novo é opcional, exatamente pra não quebrar quem já consome
// estes tipos.
// ============================================================

/** Tamanhos suportados hoje. Novos tamanhos = adicionar aqui, nada mais muda. */
export type ProductSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
export const PRODUCT_SIZES: ProductSize[] = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

/**
 * Tipo semântico da imagem. A tabela `product_images` no banco não tem
 * uma coluna própria pra isso (ver CATALOG.md, seção "Limitação
 * conhecida") — por ora o tipo é derivado pela ORDEM (`position`) em
 * que a imagem foi cadastrada, seguindo esta sequência fixa:
 */
export type ProductImageType =
  | 'principal'
  | 'frente'
  | 'costas'
  | 'detalhe'
  | 'lifestyle'
  | 'hover'
  | 'banner';

export const PRODUCT_IMAGE_TYPE_ORDER: ProductImageType[] = [
  'principal',
  'frente',
  'costas',
  'detalhe',
  'lifestyle',
  'hover',
  'banner',
];

export interface ProductVariant {
  id: string;
  productId: string;
  size: ProductSize | string; // string também aceito — não trava em tamanho fora da lista padrão
  color: string;
  stock: number;
  sku: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  order: number;
  isPrimary?: boolean;
  /** Derivado por convenção de posição em ProductService.mapImages — ver nota acima. */
  type?: ProductImageType;
  /**
   * Cor da variante à qual esta imagem pertence.
   * Ausente/`undefined` = compartilhada entre todas as cores (detalhe, lifestyle).
   * Opcional de propósito: produtos sem fotos por cor continuam iguais.
   */
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  /** Preço "de", riscado — presente só quando há promoção ativa. */
  compareAtPriceCents?: number;
  category: string;
  categoryId?: string;
  collectionId?: string;
  dropId?: string;
  weightGrams?: number;
  /** Status de publicação do produto (true = visível na loja). */
  active: boolean;
  featured?: boolean;
  /** Computado a partir de `createdAt` em ProductService — não é uma coluna no banco. */
  isNew?: boolean;
  createdAt?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  bannerUrl?: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface Drop {
  id: string;
  name: string;
  slug: string;
  startsAt: string;
  endsAt: string;
  status: 'upcoming' | 'live' | 'ended';
  story?: string;
  trailerUrl?: string;
  products: Product[];
}

/** Banner dinâmico — ver BannerService. Guardado na tabela `settings`, não em coluna própria. */
export interface Banner {
  desktopUrl: string;
  mobileUrl?: string;
  alt?: string;
  href?: string;
}

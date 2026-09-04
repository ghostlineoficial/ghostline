import type {
  Product,
  ProductImage,
  Category,
  Collection,
  Drop,
  Banner,
} from '@/types/product';

import { PRODUCT_SIZES } from '@/types/product';

/**
 * Catálogo temporário da GHOSTLINE.
 * Estrutura preparada para posteriormente ser substituída
 * pelos dados reais vindos do Supabase.
 */

// ==========================================================
// CATEGORIAS
// ==========================================================

export const mockCategories: Category[] = [
  {
    id: 'cat-oversized',
    name: 'Oversized',
    slug: 'oversized',
    imageUrl: '/images/category-oversized.svg',
  },
  {
    id: 'cat-moletom',
    name: 'Moletom',
    slug: 'moletom',
    imageUrl: '/images/category-moletom.svg',
  },
  {
    id: 'cat-casacos',
    name: 'Casacos',
    slug: 'casacos',
    imageUrl: '/images/category-casacos.svg',
  },
  {
    id: 'cat-colecoes',
    name: 'Coleções',
    slug: 'colecoes',
    imageUrl: '/images/category-colecoes.svg',
  },
];

// ==========================================================
// COLEÇÕES
// ==========================================================

export const mockCollections: Collection[] = [
  {
    id: 'col-essentials',
    name: 'Essentials',
    slug: 'essentials',
    bannerUrl: '/images/collection-essentials-banner.svg',
    description:
      'A base do guarda-roupa Ghostline — peças atemporais fora da lógica de drop.',
    status: 'published',
  },
];

// ==========================================================
// DROPS
// ==========================================================

const now = new Date();

const days = (n: number) =>
  new Date(now.getTime() + n * 24 * 60 * 60 * 1000).toISOString();

export const mockDrops: Omit<Drop, 'products'>[] = [
  {
    id: 'drop-01',
    name: 'DROP 01',
    slug: 'drop-01',
    story:
      'O primeiro sinal. Oito peças, edição limitada — quando acabar, não volta.',

    // EDIÇÃO 01 — BEYOND THE LIMITS
    // 01/09/2026 até 01/12/2026

    startsAt: '2026-09-01T00:00:00-03:00',
    endsAt: '2026-12-01T00:00:00-03:00',

    // Mantido LIVE durante o desenvolvimento.
    status: 'live',
  },

  {
    id: 'drop-02',
    name: 'DROP 02',
    slug: 'drop-02',
    story: 'Próxima transmissão. Em preparação.',
    startsAt: days(20),
    endsAt: days(27),
    status: 'upcoming',
  },

  {
    id: 'drop-03',
    name: 'DROP 03',
    slug: 'drop-03',
    story: 'Ainda além do horizonte.',
    startsAt: days(45),
    endsAt: days(52),
    status: 'upcoming',
  },

  {
    id: 'drop-limited',
    name: 'DROP LIMITED',
    slug: 'drop-limited',
    story: 'Peças únicas, sem reposição. Já encerrado.',
    startsAt: days(-60),
    endsAt: days(-53),
    status: 'ended',
  },
];

// ==========================================================
// BANNERS
// ==========================================================

export const mockBanners: Record<string, Banner> = {
  'banner:home': {
    desktopUrl: '/images/home-banner-desktop.svg',
    mobileUrl: '/images/home-banner-mobile.svg',
    alt: 'Ghostline — Beyond the Limits',
    href: '/shop',
  },

  'banner:drop:drop-01': {
    desktopUrl: '/images/drop-01-banner-desktop.png',
    mobileUrl: '/images/drop-01-banner-mobile.svg',
    alt: 'Drop 01 — Beyond The Limits',
    href: '/drops/drop-01',
  },

  'banner:drop:drop-02': {
    desktopUrl: '/images/drop-02-banner-desktop.svg',
    mobileUrl: '/images/drop-02-banner-mobile.svg',
    alt: 'Drop 02',
    href: '/drops/drop-02',
  },

  'banner:drop:drop-03': {
    desktopUrl: '/images/drop-03-banner-desktop.svg',
    mobileUrl: '/images/drop-03-banner-mobile.svg',
    alt: 'Drop 03',
    href: '/drops/drop-03',
  },

  'banner:drop:drop-limited': {
    desktopUrl: '/images/drop-limited-banner-desktop.svg',
    mobileUrl: '/images/drop-limited-banner-mobile.svg',
    alt: 'Drop Limited',
    href: '/drops/drop-limited',
  },

  'banner:collection:essentials': {
    desktopUrl: '/images/collection-essentials-banner.svg',
    alt: 'Essentials',
    href: '/shop?colecao=essentials',
  },
};

// ==========================================================
// CONFIGURAÇÕES DOS PRODUTOS
// ==========================================================

// ==========================================================
// PRODUTO 01 / 08 — VOID ASCENSION
// ==========================================================

const produto01Images: ProductImage[] = [
  {
    id: 'prod-001-img-03',
    productId: 'prod-001',
    url: '/images/products/drop-01/produto-01/03-estampa.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-001-img-01',
    productId: 'prod-001',
    url: '/images/products/drop-01/produto-01/01-frente.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-001-img-02',
    productId: 'prod-001',
    url: '/images/products/drop-01/produto-01/02-costas.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-001-img-04',
    productId: 'prod-001',
    url: '/images/products/drop-01/produto-01/04-logo-tecido.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-001-img-05',
    productId: 'prod-001',
    url: '/images/products/drop-01/produto-01/05-flatlay.png',
    order: 4,
    isPrimary: false,
  },
];

// ==========================================================
// PRODUTO 02 / 08 — PINK EMPIRE
// ==========================================================

const produto02Images: ProductImage[] = [
  {
    id: 'prod-002-img-01',
    productId: 'prod-002',
    url: '/images/products/drop-01/produto-02/01-flatlay.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-002-img-02',
    productId: 'prod-002',
    url: '/images/products/drop-01/produto-02/02-estampa.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-002-img-03',
    productId: 'prod-002',
    url: '/images/products/drop-01/produto-02/03-logo-tecido.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-002-img-04',
    productId: 'prod-002',
    url: '/images/products/drop-01/produto-02/04-modelo-costas.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-002-img-05',
    productId: 'prod-002',
    url: '/images/products/drop-01/produto-02/05-modelo-frente.png',
    order: 4,
    isPrimary: false,
  },
];

// ==========================================================
// PRODUTO 03 / 08 — NEON ABDUCTION
// ==========================================================

const produto03Images: ProductImage[] = [
  {
    id: 'prod-003-img-02',
    productId: 'prod-003',
    url: '/images/products/drop-01/produto-03/02-estampa.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-003-img-01',
    productId: 'prod-003',
    url: '/images/products/drop-01/produto-03/01-flatlay.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-003-img-03',
    productId: 'prod-003',
    url: '/images/products/drop-01/produto-03/03-frente-modelo.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-003-img-04',
    productId: 'prod-003',
    url: '/images/products/drop-01/produto-03/04-costas-modelo.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-003-img-05',
    productId: 'prod-003',
    url: '/images/products/drop-01/produto-03/05-logo-tecido.png',
    order: 4,
    isPrimary: false,
  },
];

// ==========================================================
// PRODUTO 04 / 08 — PHARAOH'S REVENGE
// ==========================================================

const produto04Images: ProductImage[] = [
  {
    id: 'prod-004-img-05',
    productId: 'prod-004',
    url: '/images/products/drop-01/produto-04/05-estampa.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-004-img-01',
    productId: 'prod-004',
    url: '/images/products/drop-01/produto-04/01-modelo-costas.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-004-img-02',
    productId: 'prod-004',
    url: '/images/products/drop-01/produto-04/02-modelo-frente.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-004-img-03',
    productId: 'prod-004',
    url: '/images/products/drop-01/produto-04/03-logo-tecido.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-004-img-04',
    productId: 'prod-004',
    url: '/images/products/drop-01/produto-04/04-flatlay.png',
    order: 4,
    isPrimary: false,
  },
];

// ==========================================================
// PRODUTO 05 / 08 — ETERNAL ROSE
// ==========================================================

const produto05Images: ProductImage[] = [
  // FOTO 04 = CAPA PRINCIPAL
  {
    id: 'prod-005-img-04',
    productId: 'prod-005',
    url: '/images/products/drop-01/produto-05/04-estampa-zoom.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-005-img-01',
    productId: 'prod-005',
    url: '/images/products/drop-01/produto-05/01-modelo-costas.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-005-img-02',
    productId: 'prod-005',
    url: '/images/products/drop-01/produto-05/02-estampa-tecido.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-005-img-03',
    productId: 'prod-005',
    url: '/images/products/drop-01/produto-05/03-flatlay.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-005-img-05',
    productId: 'prod-005',
    url: '/images/products/drop-01/produto-05/05-modelo-frente.png',
    order: 4,
    isPrimary: false,
  },
];


// ==========================================================
// PRODUTO 06 / 08 — SILENT WAR
// ==========================================================

const produto06Images: ProductImage[] = [
  {
    id: 'prod-006-img-02',
    productId: 'prod-006',
    url: '/images/products/drop-01/produto-06/02-estampa-zoom.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-006-img-01',
    productId: 'prod-006',
    url: '/images/products/drop-01/produto-06/01-flatlay.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-006-img-03',
    productId: 'prod-006',
    url: '/images/products/drop-01/produto-06/03-logo-tecido.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-006-img-04',
    productId: 'prod-006',
    url: '/images/products/drop-01/produto-06/04-modelo-costas.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-006-img-05',
    productId: 'prod-006',
    url: '/images/products/drop-01/produto-06/05-modelo-frente.png',
    order: 4,
    isPrimary: false,
  },
];

// ==========================================================
// PRODUTO 07 / 08 — ECLIPSE
// ==========================================================

const produto07Images: ProductImage[] = [
  {
    id: 'prod-007-img-05',
    productId: 'prod-007',
    url: '/images/products/drop-01/produto-07/05-estampa-zoom.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-007-img-01',
    productId: 'prod-007',
    url: '/images/products/drop-01/produto-07/01-flatlay.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-007-img-02',
    productId: 'prod-007',
    url: '/images/products/drop-01/produto-07/02-modelo-frente.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-007-img-03',
    productId: 'prod-007',
    url: '/images/products/drop-01/produto-07/03-modelo-costas.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-007-img-04',
    productId: 'prod-007',
    url: '/images/products/drop-01/produto-07/04-logo-tecido.png',
    order: 4,
    isPrimary: false,
  },
];

// ==========================================================
// PRODUTO 08 / 08 — LAST BREATH
// ==========================================================

const produto08Images: ProductImage[] = [
  {
    id: 'prod-008-img-04',
    productId: 'prod-008',
    url: '/images/products/drop-01/produto-08/04-estampa-zoom.png',
    order: 0,
    isPrimary: true,
  },
  {
    id: 'prod-008-img-01',
    productId: 'prod-008',
    url: '/images/products/drop-01/produto-08/01-frente.png',
    order: 1,
    isPrimary: false,
  },
  {
    id: 'prod-008-img-02',
    productId: 'prod-008',
    url: '/images/products/drop-01/produto-08/02-costas.png',
    order: 2,
    isPrimary: false,
  },
  {
    id: 'prod-008-img-03',
    productId: 'prod-008',
    url: '/images/products/drop-01/produto-08/03-logo-frente.png',
    order: 3,
    isPrimary: false,
  },
  {
    id: 'prod-008-img-05',
    productId: 'prod-008',
    url: '/images/products/drop-01/produto-08/05-flat-lay.png',
    order: 4,
    isPrimary: false,
  },
];

const createdAtBase = '2026-09-01T00:00:00-03:00';

// ==========================================================
// PRODUTOS DO DROP I
// ==========================================================

export const mockProducts: Product[] = [
  // 01 / 08 — VOID ASCENSION
  {
    id: 'prod-001',
    name: 'VOID ASCENSION',
    slug: 'void-ascension',
    description:
      'VOID ASCENSION representa a passagem além dos próprios limites. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.',
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto01Images,
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-001-Preta-${size}`,
      productId: 'prod-001',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-VA01-PR-${size}`,
    })),
  },

  // 02 / 08 — PINK EMPIRE
  {
    id: 'prod-002',
    name: 'PINK EMPIRE',
    slug: 'pink-empire',
    description:
      'PINK EMPIRE transforma irreverência, luxo e atitude em uma peça de presença máxima. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.',
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto02Images,
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-002-Preta-${size}`,
      productId: 'prod-002',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-PE02-PR-${size}`,
    })),
  },

  // 03 / 08 — NEON ABDUCTION
  {
    id: 'prod-003',
    name: 'NEON ABDUCTION',
    slug: 'neon-abduction',
    description:
      'NEON ABDUCTION transforma o desconhecido em uma explosão de cor e identidade. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.',
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto03Images,
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-003-Preta-${size}`,
      productId: 'prod-003',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-NA03-PR-${size}`,
    })),
  },

  // 04 / 08 — PHARAOH'S REVENGE
  {
    id: 'prod-004',
    name: "PHARAOH'S REVENGE",
    slug: 'pharaohs-revenge',
    description:
      "PHARAOH'S REVENGE une poder ancestral, mistério e a estética sombria da GHOSTLINE. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.",
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto04Images,
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-004-Preta-${size}`,
      productId: 'prod-004',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-PR04-PR-${size}`,
    })),
  },

  // 05 / 08 — ETERNAL ROSE
  {
    id: 'prod-005',
    name: 'ETERNAL ROSE',
    slug: 'eternal-rose',
    description:
      'ETERNAL ROSE representa a beleza que permanece além do tempo. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.',
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto05Images,

    // ETERNAL ROSE — SOMENTE PRETA
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-005-Preta-${size}`,
      productId: 'prod-005',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-ER05-PR-${size}`,
    })),
  },

  // 06 / 08 — SILENT WAR
  {
    id: 'prod-006',
    name: 'SILENT WAR',
    slug: 'silent-war',
    description:
      'SILENT WAR traduz força, tensão e atitude em uma peça criada para quem não precisa fazer barulho para marcar presença. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.',
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto06Images,
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-006-Preta-${size}`,
      productId: 'prod-006',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-SW06-PR-${size}`,
    })),
  },

  // 07 / 08 — ECLIPSE
  {
    id: 'prod-007',
    name: 'ECLIPSE',
    slug: 'eclipse',
    description:
      'ECLIPSE nasce do encontro entre sombra, contraste e presença. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.',
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto07Images,
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-007-Preta-${size}`,
      productId: 'prod-007',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-EC07-PR-${size}`,
    })),
  },

  // 08 / 08 — LAST BREATH
  {
    id: 'prod-008',
    name: 'LAST BREATH',
    slug: 'last-breath',
    description:
      'LAST BREATH encerra a primeira edição com uma composição intensa, viva e impossível de ignorar. Produzida em Malha Peruana 100% algodão, com Suedine Premium e modelagem Oversized Fit. O tecido encorpado oferece toque macio, estrutura superior e um caimento perfeito que valoriza o shape sem limitar os movimentos. Acabamento premium e estampa de alta definição. Parte da Edição 01 — Beyond The Limits. Quando esta edição terminar, esta arte deixa o catálogo.',
    priceCents: 13499,
    category: 'oversized',
    categoryId: 'cat-oversized',
    dropId: 'drop-01',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: createdAtBase,
    images: produto08Images,
    variants: PRODUCT_SIZES.map((size) => ({
      id: `prod-008-Preta-${size}`,
      productId: 'prod-008',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-LB08-PR-${size}`,
    })),
  },
];

// ==========================================================
// LINHA OVERSIZED — FORA DO DROP
// ==========================================================

export const oversizedProducts: Product[] = [
  {
    id: 'oversized-majin-strength',
    name: 'OVERSIZED GHOST TEE',
    slug: 'oversized-ghost-tee',
    description:
      'Camiseta Oversized GHOSTLINE com estampa exclusiva inspirada em força e atitude. Disponível nas cores Preta e Branca.',
    priceCents: 9999,
    category: 'oversized',
    categoryId: 'cat-oversized',
    weightGrams: 280,
    active: true,
    featured: true,
    createdAt: '2026-08-30T00:00:00-03:00',
    images: [
      {
        id: 'majin-front-black',
        productId: 'oversized-majin-strength',
        url: '/images/products/majin-strength/front-black.jpeg',
        order: 1,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'majin-back-black',
        productId: 'oversized-majin-strength',
        url: '/images/products/majin-strength/back-black.jpeg',
        order: 1,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'majin-detail',
        productId: 'oversized-majin-strength',
        url: '/images/products/majin-strength/detail.jpeg',
        order: 2,
        isPrimary: false,
      },
      {
        id: 'majin-front-white',
        productId: 'oversized-majin-strength',
        url: '/images/products/majin-strength/front-white.jpeg',
        order: 3,
        isPrimary: false,
        color: 'Branca',
      },
      {
        id: 'majin-back-white',
        productId: 'oversized-majin-strength',
        url: '/images/products/majin-strength/back-white.jpeg',
        order: 4,
        isPrimary: false,
        color: 'Branca',
      },
      {
        id: 'majin-flat-white',
        productId: 'oversized-majin-strength',
        url: '/images/products/majin-strength/flat-white.jpeg',
        order: 0,
        isPrimary: true,
        color: 'Branca',
      },
    ],
    variants: ['Preta', 'Branca'].flatMap((color) =>
      ['M', 'G', 'GG', 'XGG'].map((size) => ({
        id: `oversized-majin-strength-${color}-${size}`,
        productId: 'oversized-majin-strength',
        color,
        size,
        stock: 12,
        sku: `GH-MAJIN-${color === 'Preta' ? 'PR' : 'BR'}-${size}`,
      })),
    ),
  },
  {
    id: 'oversized-001',
    name: 'GHOSTLINE STRENGTH',
    slug: 'ghostline-strength',
    description:
      'Camiseta Oversized GHOSTLINE em modelagem ampla, desenvolvida para unir conforto, presença e identidade streetwear. Estampa exclusiva nas costas e logo GHOSTLINE no peito.',
    priceCents: 9999,
    category: 'oversized',
    categoryId: 'cat-oversized',
    weightGrams: 280,
    active: true,
    featured: false,
    createdAt: '2026-08-30T00:00:00-03:00',
    images: [
      {
        id: 'oversized-001-img-04',
        productId: 'oversized-001',
        url: '/images/products/camiseta-01/04-estampa-costas.png',
        order: 0,
        isPrimary: true,
        color: 'Preta',
      },
      {
        id: 'oversized-001-img-01',
        productId: 'oversized-001',
        url: '/images/products/camiseta-01/01-frente.png',
        order: 1,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-001-img-02',
        productId: 'oversized-001',
        url: '/images/products/camiseta-01/02-costas.png',
        order: 2,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-001-img-03',
        productId: 'oversized-001',
        url: '/images/products/camiseta-01/03-logo-frente.png',
        order: 3,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-001-img-05',
        productId: 'oversized-001',
        url: '/images/products/camiseta-01/05-detalhes.png',
        order: 4,
        isPrimary: false,
        color: 'Preta',
      },
    ],
    variants: ['M', 'G', 'GG', 'XGG'].map((size) => ({
      id: `oversized-001-Preta-${size}`,
      productId: 'oversized-001',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-OS01-PR-${size}`,
    })),
  },
  {
    id: 'oversized-002',
    name: 'GHOSTLINE GYM BROS',
    slug: 'ghostline-gym-bros',
    description:
      'Camiseta Oversized GHOSTLINE GYM BROS em modelagem ampla, criada para unir treino, atitude e identidade streetwear. Estampa exclusiva GYM BROS e visual marcante GHOSTLINE.',
    priceCents: 9999,
    category: 'oversized',
    categoryId: 'cat-oversized',
    weightGrams: 280,
    active: true,
    featured: false,
    createdAt: '2026-09-02T00:00:00-03:00',
    images: [
      {
        id: 'oversized-002-img-01',
        productId: 'oversized-002',
        url: '/images/products/camiseta-02/01-estampa.jpeg',
        order: 0,
        isPrimary: true,
        color: 'Preta',
      },
      {
        id: 'oversized-002-img-02',
        productId: 'oversized-002',
        url: '/images/products/camiseta-02/02-frente.jpeg',
        order: 1,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-002-img-03',
        productId: 'oversized-002',
        url: '/images/products/camiseta-02/03-costas.jpeg',
        order: 2,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-002-img-04',
        productId: 'oversized-002',
        url: '/images/products/camiseta-02/04-frente-detalhe.jpeg',
        order: 3,
        isPrimary: false,
        color: 'Preta',
      },
    ],
    variants: ['M', 'G', 'GG', 'XGG'].map((size) => ({
      id: `oversized-002-Preta-${size}`,
      productId: 'oversized-002',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-OS02-PR-${size}`,
    })),
  },

  {
    id: 'oversized-003',
    name: 'GHOSTLINE FREE ELF',
    slug: 'ghostline-free-elf',
    description:
      'Camiseta Oversized GHOSTLINE FREE ELF em modelagem ampla, unindo força, irreverência e identidade streetwear. Arte exclusiva em preto, vermelho e tons de cinza com presença marcante GHOSTLINE.',
    priceCents: 9999,
    category: 'oversized',
    categoryId: 'cat-oversized',
    weightGrams: 280,
    active: true,
    featured: false,
    createdAt: '2026-09-02T00:00:00-03:00',
    images: [
      {
        id: 'oversized-003-img-01',
        productId: 'oversized-003',
        url: '/images/products/camiseta-03/01-estampa.jpeg',
        order: 0,
        isPrimary: true,
        color: 'Preta',
      },
      {
        id: 'oversized-003-img-02',
        productId: 'oversized-003',
        url: '/images/products/camiseta-03/02-frente.jpeg',
        order: 1,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-003-img-03',
        productId: 'oversized-003',
        url: '/images/products/camiseta-03/03-flatlay.jpeg',
        order: 2,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-003-img-04',
        productId: 'oversized-003',
        url: '/images/products/camiseta-03/04-costas.jpeg',
        order: 3,
        isPrimary: false,
        color: 'Preta',
      },
    ],
    variants: ['M', 'G', 'GG', 'XGG'].map((size) => ({
      id: `oversized-003-Preta-${size}`,
      productId: 'oversized-003',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-OS03-PR-${size}`,
    })),
  },


  {
    id: 'oversized-004',
    name: 'GHOSTLINE PURPLE ASCENSION',
    slug: 'ghostline-purple-ascension',
    description:
      'Camiseta Oversized GHOSTLINE PURPLE ASCENSION em modelagem ampla, criada para unir evolução, força e identidade streetwear. Arte exclusiva em roxo com visual intenso e presença marcante GHOSTLINE.',
    priceCents: 9999,
    category: 'oversized',
    categoryId: 'cat-oversized',
    weightGrams: 280,
    active: true,
    featured: false,
    createdAt: '2026-09-02T00:00:00-03:00',
    images: [
      { id: 'oversized-004-img-03', productId: 'oversized-004', url: '/images/products/camiseta-04/03-estampa-costas.jpeg', order: 0, isPrimary: true, color: 'Preta' },
      { id: 'oversized-004-img-01', productId: 'oversized-004', url: '/images/products/camiseta-04/01-logo-frente.jpeg', order: 1, isPrimary: false, color: 'Preta' },
      { id: 'oversized-004-img-02', productId: 'oversized-004', url: '/images/products/camiseta-04/02-flat-costas.jpeg', order: 2, isPrimary: false, color: 'Preta' },
      { id: 'oversized-004-img-04', productId: 'oversized-004', url: '/images/products/camiseta-04/04-modelo-frente.jpeg', order: 3, isPrimary: false, color: 'Preta' },
      { id: 'oversized-004-img-05', productId: 'oversized-004', url: '/images/products/camiseta-04/05-modelo-costas.jpeg', order: 4, isPrimary: false, color: 'Preta' },
    ],
    variants: ['M', 'G', 'GG', 'XGG'].map((size) => ({
      id: `oversized-004-Preta-${size}`,
      productId: 'oversized-004',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-OS04-PR-${size}`,
    })),
  },


  {
    id: 'oversized-005',
    name: 'GHOSTLINE IRON WILL',
    slug: 'ghostline-iron-will',
    description:
      'Camiseta Oversized GHOSTLINE IRON WILL em modelagem ampla, criada para representar força, coragem e disciplina. Arte exclusiva com estética intensa GHOSTLINE e presença marcante streetwear.',
    priceCents: 9999,
    category: 'oversized',
    categoryId: 'cat-oversized',
    weightGrams: 280,
    active: true,
    featured: false,
    createdAt: '2026-09-02T00:00:00-03:00',
    images: [
      {
        id: 'oversized-005-img-04',
        productId: 'oversized-005',
        url: '/images/products/camiseta-05/04-estampa-costas.jpeg',
        order: 0,
        isPrimary: true,
        color: 'Preta',
      },
      {
        id: 'oversized-005-img-01',
        productId: 'oversized-005',
        url: '/images/products/camiseta-05/01-frente.jpeg',
        order: 1,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-005-img-02',
        productId: 'oversized-005',
        url: '/images/products/camiseta-05/02-costas.jpeg',
        order: 2,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-005-img-03',
        productId: 'oversized-005',
        url: '/images/products/camiseta-05/03-logo-frente.jpeg',
        order: 3,
        isPrimary: false,
        color: 'Preta',
      },
      {
        id: 'oversized-005-img-05',
        productId: 'oversized-005',
        url: '/images/products/camiseta-05/05-flat-lay.jpeg',
        order: 4,
        isPrimary: false,
        color: 'Preta',
      },
    ],
    variants: ['M', 'G', 'GG', 'XGG'].map((size) => ({
      id: `oversized-005-Preta-${size}`,
      productId: 'oversized-005',
      color: 'Preta',
      size,
      stock: 12,
      sku: `GH-OS05-PR-${size}`,
    })),
  },

];


import type { Product } from '@/types/product';

export const products: Product[] = [
  // =========================================================
  // MAJIN STRENGTH
  // ÚNICA OVERSIZED COM PRETA + BRANCA
  // =========================================================
  {
    id: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',

    name: 'Oversized Ghost Tee',

    slug: 'oversized-ghost-tee',

    description:
      'Camiseta oversized 100% algodão, modelagem ampla e estampa frente e costas.',

    priceCents: 9999,

    category: 'oversized',

    active: true,

    featured: true,

    images: [
      {
        id: '1',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        url: '/images/products/majin-strength/front-black.jpeg',
        order: 0,
        isPrimary: true,
        color: 'Preta',
      },
      {
        id: '2',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        url: '/images/products/majin-strength/back-black.jpeg',
        order: 1,
        color: 'Preta',
      },
      {
        id: '3',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        url: '/images/products/majin-strength/front-white.jpeg',
        order: 2,
        color: 'Branca',
      },
      {
        id: '4',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        url: '/images/products/majin-strength/back-white.jpeg',
        order: 3,
        color: 'Branca',
      },
      {
        id: '5',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        url: '/images/products/majin-strength/flat-white.jpeg',
        order: 4,
        color: 'Branca',
      },
      {
        id: '6',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        url: '/images/products/majin-strength/detail.jpeg',
        order: 5,
      },
    ],

    variants: [
      {
        id: '1',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        size: 'P',
        color: 'Preta',
        stock: 999,
        sku: 'GH-OVERSIZED-P',
      },
      {
        id: '2',
        productId: '725fe09a-872f-4cf1-ae4f-7f9dff16ccec',
        size: 'P',
        color: 'Branca',
        stock: 999,
        sku: 'GH-OVERSIZED-W',
      },
    ],
  },

  // =========================================================
  // CAMISETA 01 — GHOSTLINE STRENGTH
  // SOMENTE PRETA
  // =========================================================
  {
    id: 'ghostline-camiseta-01',

    name: 'Ghostline Strength',

    slug: 'ghostline-strength',

    description:
      'Camiseta oversized preta GHOSTLINE com estampa exclusiva nas costas. Uma peça inspirada em disciplina, foco e constância.',

    priceCents: 9999,

    category: 'oversized',

    active: true,

    featured: true,

    images: [
      // CAPA
      {
        id: 'camiseta-01-image-04',
        productId: 'ghostline-camiseta-01',
        url: '/images/products/camiseta-01/04-estampa-costas.png',
        order: 0,
        isPrimary: true,
        color: 'Preta',
      },

      // MODELO DE FRENTE
      {
        id: 'camiseta-01-image-01',
        productId: 'ghostline-camiseta-01',
        url: '/images/products/camiseta-01/01-frente.png',
        order: 1,
        color: 'Preta',
      },

      // MODELO DE COSTAS
      {
        id: 'camiseta-01-image-02',
        productId: 'ghostline-camiseta-01',
        url: '/images/products/camiseta-01/02-costas.png',
        order: 2,
        color: 'Preta',
      },

      // LOGO DA FRENTE
      {
        id: 'camiseta-01-image-03',
        productId: 'ghostline-camiseta-01',
        url: '/images/products/camiseta-01/03-logo-frente.png',
        order: 3,
        color: 'Preta',
      },

      // DETALHES
      {
        id: 'camiseta-01-image-05',
        productId: 'ghostline-camiseta-01',
        url: '/images/products/camiseta-01/05-detalhes.png',
        order: 4,
        color: 'Preta',
      },
    ],

    variants: [
      {
        id: 'camiseta-01-m',
        productId: 'ghostline-camiseta-01',
        size: 'M',
        color: 'Preta',
        stock: 999,
        sku: 'GH-STRENGTH-M',
      },
      {
        id: 'camiseta-01-g',
        productId: 'ghostline-camiseta-01',
        size: 'G',
        color: 'Preta',
        stock: 999,
        sku: 'GH-STRENGTH-G',
      },
      {
        id: 'camiseta-01-gg',
        productId: 'ghostline-camiseta-01',
        size: 'GG',
        color: 'Preta',
        stock: 999,
        sku: 'GH-STRENGTH-GG',
      },
      {
        id: 'camiseta-01-xgg',
        productId: 'ghostline-camiseta-01',
        size: 'XGG',
        color: 'Preta',
        stock: 999,
        sku: 'GH-STRENGTH-XGG',
      },
    ],
  },
];
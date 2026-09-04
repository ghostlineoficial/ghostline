import type { Drop } from '@/types/product';
import { products } from './products';

export const currentDrop: Drop = {
  id: 'drop-001',
  name: 'DROP I — Beyond The Limits',
  slug: 'drop-01',
  startsAt: new Date().toISOString(),
  endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  status: 'live',
  products,
};

export const categories = [
  {
    name: 'Oversized',
    slug: 'oversized',
    image: '/images/category-oversized.png',
    comingSoon: false,
  },
  {
    name: 'Casacos',
    slug: 'casacos',
    image: '/images/category-casacos.png',
    comingSoon: false,
  },
  {
    name: 'Dry Fit',
    slug: 'dry-fit',
    image: '/images/category-dryfit.png',
    comingSoon: true,
  },
  {
    name: 'Coleções',
    slug: 'colecoes',
    image: '/images/category-colecoes.png',
    comingSoon: true,
  },
] as const;

/*
 |----------------------------------------------------------
 | PRODUTOS DA HOME
 |----------------------------------------------------------
*/

export const featuredProducts = products;

/*
 |----------------------------------------------------------
 | GALERIA
 |----------------------------------------------------------
*/

export const galleryItems = [
  {
    id: '1',
    image: '/images/products/majin-strength/detail.jpeg',
    caption: 'Majin Strength',
  },
  {
    id: '2',
    image: '/images/products/majin-strength/back-black.jpeg',
    caption: 'Ghostline',
  },
  {
    id: '3',
    image: '/images/products/majin-strength/front-white.jpeg',
    caption: 'Oversized',
  },
];

/*
 |----------------------------------------------------------
 | INSTAGRAM
 |----------------------------------------------------------
*/

export const instagramItems = [
  {
    id: '1',
    image: '/images/products/majin-strength/front-black.jpeg',
  },
  {
    id: '2',
    image: '/images/products/majin-strength/back-black.jpeg',
  },
  {
    id: '3',
    image: '/images/products/majin-strength/front-white.jpeg',
  },
  {
    id: '4',
    image: '/images/products/majin-strength/back-white.jpeg',
  },
];

/*
 |----------------------------------------------------------
 | GHOST SOCIETY
 |----------------------------------------------------------
*/

export const societyBenefits = [
  {
    title: 'Drops Antecipados',
    description:
      'Receba acesso às novas coleções antes da abertura oficial.',
  },
  {
    title: 'Produtos Exclusivos',
    description:
      'Peças limitadas disponíveis apenas para membros da Ghost Society.',
  },
  {
    title: 'Comunidade',
    description:
      'Faça parte da comunidade oficial da GHOSTLINE.',
  },
] as const;
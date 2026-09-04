import type { MeasurementRow } from '@/components/shared/MeasurementsTable';

/**
 * Especificações técnicas, tabela de medidas e FAQ da página de produto.
 *
 * IMPORTANTE — isto NÃO é dado de catálogo (não é como `lib/mock/catalog.ts`,
 * que é o que a migration 0009 insere no Supabase). Malha, gramatura,
 * composição etc. não têm coluna em `products` — o schema aprovado só tem
 * `description` (texto livre). Adicionar essas colunas seria alterar o
 * banco, fora do escopo desta fase (ver CATALOG.md, "Limitação conhecida",
 * pra o mesmo tipo de gap já registrado sobre tipo de imagem).
 *
 * Por ora, um conjunto genérico é aplicado a todo produto. Quando o banco
 * puder mudar, isso deixa de existir aqui e passa a vir do
 * `ProductService`, sem alterar a página — ela já lê essas seções como
 * blocos separados.
 */

export const genericSpecs = [
  { label: 'Malha', value: 'Moletom flanelado 320 g/m²' },
  { label: 'Gramatura', value: '320 g/m²' },
  { label: 'Composição', value: '80% algodão, 20% poliéster' },
  { label: 'Estampa', value: 'Serigrafia' },
  { label: 'Tipo de impressão', value: 'Silk screen alta densidade' },
  { label: 'Modelagem', value: 'Oversized' },
  { label: 'País', value: 'Brasil' },
  { label: 'Marca', value: 'Ghostline' },
] as const;

export const genericMeasurements: MeasurementRow[] = [
  { size: 'PP', chestCm: 104, lengthCm: 68, sleeveCm: 21 },
  { size: 'P', chestCm: 110, lengthCm: 70, sleeveCm: 22 },
  { size: 'M', chestCm: 116, lengthCm: 72, sleeveCm: 23 },
  { size: 'G', chestCm: 122, lengthCm: 74, sleeveCm: 24 },
  { size: 'GG', chestCm: 128, lengthCm: 76, sleeveCm: 25 },
  { size: 'XGG', chestCm: 134, lengthCm: 78, sleeveCm: 26 },
];

export const productFaq = [
  {
    value: 'entrega',
    title: 'Entrega',
    content:
      'Enviamos pra todo o Brasil. Prazo estimado exibido no checkout, calculado pelo CEP antes da finalização da compra.',
  },
  {
    value: 'troca',
    title: 'Troca',
    content:
      'Até 30 dias corridos após o recebimento, peça sem uso e com etiqueta. Solicitação feita direto pela área de pedidos.',
  },
  {
    value: 'lavagem',
    title: 'Lavagem',
    content:
      'Lavar à máquina em água fria, do avesso, com cores semelhantes. Não usar alvejante. Secar à sombra.',
  },
  {
    value: 'garantia',
    title: 'Garantia',
    content:
      'Cobertura contra defeito de fabricação por 90 dias a partir da compra, conforme o Código de Defesa do Consumidor.',
  },
] as const;

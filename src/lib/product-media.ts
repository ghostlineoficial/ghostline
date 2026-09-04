import type {
  Product,
  ProductImage,
  ProductVariant,
} from '@/types/product';

/**
 * Aliases de tokens encontrados no filename/URL → nomes canônicos em
 * português.
 *
 * Exemplo:
 * front-black.jpeg → Preta
 * front-white.jpeg → Branca
 */
const COLOR_ALIASES: Record<string, string[]> = {
  black: ['preta', 'preto'],
  preta: ['black', 'preto'],
  preto: ['black', 'preta'],
  white: ['branca', 'branco'],
  branca: ['white', 'branco'],
  branco: ['white', 'branca'],
  gray: ['cinza', 'grey'],
  grey: ['cinza', 'gray'],
  cinza: ['gray', 'grey'],
};

/**
 * Separa o nome do arquivo em tokens.
 *
 * Exemplo:
 * /images/front-black.jpeg
 * vira:
 * ['front', 'black']
 */
function filenameTokens(
  url: string,
): string[] {
  const filename =
    url.split('/').pop() ?? url;

  const withoutQuery =
    filename.split('?')[0] ?? filename;

  const withoutExt =
    withoutQuery.replace(/\.[^.]+$/, '');

  return withoutExt
    .split(/[-_\s]+/)
    .map((token) =>
      token.toLowerCase(),
    )
    .filter(Boolean);
}

/**
 * Verifica se um token do nome do arquivo
 * corresponde a uma cor do produto.
 */
function colorsMatch(
  token: string,
  color: string,
): boolean {
  const colorKey =
    color.toLowerCase();

  if (token === colorKey) {
    return true;
  }

  const aliases =
    COLOR_ALIASES[token] ?? [];

  return aliases.includes(
    colorKey,
  );
}

/**
 * Retorna as cores existentes nas variantes
 * e informa se possuem estoque.
 */
export function getAvailableColors(
  variants: ProductVariant[],
): {
  color: string;
  available: boolean;
}[] {
  const map =
    new Map<string, number>();

  for (const variant of variants) {
    if (!variant.color) {
      continue;
    }

    map.set(
      variant.color,
      (map.get(variant.color) ?? 0) +
        variant.stock,
    );
  }

  return [...map.entries()].map(
    ([color, totalStock]) => ({
      color,
      available:
        totalStock > 0,
    }),
  );
}

/**
 * Define a cor selecionada inicialmente.
 */
export function getDefaultColor(
  product: Product,
  initialColor?: string,
): string {
  const colors =
    getAvailableColors(
      product.variants,
    );

  return (
    colors.find(
      (item) =>
        item.color === initialColor,
    )?.color ??
    colors.find(
      (item) =>
        item.available,
    )?.color ??
    colors[0]?.color ??
    ''
  );
}

/**
 * Tenta descobrir a cor da imagem
 * através do nome do arquivo.
 */
export function inferColorFromImageUrl(
  url: string,
  knownColors: string[],
): string | undefined {
  if (
    !url ||
    knownColors.length === 0
  ) {
    return undefined;
  }

  const tokens =
    filenameTokens(url);

  for (const token of tokens) {
    const match =
      knownColors.find(
        (color) =>
          colorsMatch(
            token,
            color,
          ),
      );

    if (match) {
      return match;
    }
  }

  return undefined;
}

/**
 * Resolve a cor de uma imagem.
 *
 * Primeiro usa a cor cadastrada diretamente.
 * Caso não exista, tenta descobrir pelo filename.
 */
export function resolveImageColor(
  explicitColor:
    | string
    | null
    | undefined,
  url: string,
  knownColors: string[],
): string | undefined {
  const fromDb =
    explicitColor?.trim();

  if (fromDb) {
    const canonical =
      knownColors.find(
        (color) =>
          color.toLowerCase() ===
          fromDb.toLowerCase(),
      );

    return canonical ?? fromDb;
  }

  return inferColorFromImageUrl(
    url,
    knownColors,
  );
}

/**
 * Adiciona informação de cor às imagens
 * quando for possível identificá-la.
 */
export function tagImagesWithColor(
  images: ProductImage[],
  knownColors: string[],
): ProductImage[] {
  return images.map(
    (image) => ({
      ...image,
      color:
        image.color ??
        inferColorFromImageUrl(
          image.url,
          knownColors,
        ),
    }),
  );
}

/**
 * Retorna as imagens que serão exibidas
 * na galeria da página do produto.
 *
 * IMPORTANTE:
 *
 * A galeria agora mantém TODAS as imagens
 * cadastradas visíveis.
 *
 * Isso permite que produtos com duas cores,
 * como a Majin, exibam:
 *
 * - frente preta
 * - costas preta
 * - detalhe
 * - frente branca
 * - costas branca
 * - flat branca
 *
 * A seleção de cor continua sendo usada
 * normalmente para escolher a variante
 * que será comprada.
 */
export function getImagesForColor(
  images: ProductImage[],
  color: string,
): ProductImage[] {
  void color;

  if (images.length === 0) {
    return images;
  }

  return [...images].sort(
    (
      a: ProductImage,
      b: ProductImage,
    ) => {
      if (
        a.isPrimary &&
        !b.isPrimary
      ) {
        return -1;
      }

      if (
        !a.isPrimary &&
        b.isPrimary
      ) {
        return 1;
      }

      return (
        a.order -
        b.order
      );
    },
  );
}
'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ProductGallery } from './ProductGallery';
import { ProductOptions } from './ProductOptions';
import { getAvailableColors, getDefaultColor, getImagesForColor, tagImagesWithColor } from '@/lib/product-media';
import type { Product, ProductImage } from '@/types/product';

interface ProductSelectionContextValue {
  product: Product;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  galleryImages: ProductImage[];
  initialSize?: string;
}

const ProductSelectionContext = createContext<ProductSelectionContextValue | null>(null);

function useProductSelection() {
  const ctx = useContext(ProductSelectionContext);
  if (!ctx) {
    throw new Error('useProductSelection deve ser usado dentro de ProductSelectionProvider');
  }
  return ctx;
}

interface ProductSelectionProviderProps {
  product: Product;
  initialColor?: string;
  initialSize?: string;
  children: ReactNode;
}

/**
 * Dono único da cor selecionada. Galeria e opções leem daqui — tamanho
 * continua interno ao ProductOptions e não altera imagens.
 */
export function ProductSelectionProvider({
  product,
  initialColor,
  initialSize,
  children,
}: ProductSelectionProviderProps) {
  const [selectedColor, setSelectedColor] = useState(() => getDefaultColor(product, initialColor));

  const taggedImages = useMemo(() => {
    const knownColors = getAvailableColors(product.variants).map((item) => item.color);
    return tagImagesWithColor(product.images, knownColors);
  }, [product.images, product.variants]);

  const galleryImages = useMemo(
    () => getImagesForColor(taggedImages, selectedColor),
    [taggedImages, selectedColor],
  );

  const value = useMemo(
    () => ({
      product,
      selectedColor,
      setSelectedColor,
      galleryImages,
      initialSize,
    }),
    [product, selectedColor, galleryImages, initialSize],
  );

  return <ProductSelectionContext.Provider value={value}>{children}</ProductSelectionContext.Provider>;
}

export function ProductGalleryConnected() {
  const { product, galleryImages, selectedColor } = useProductSelection();

  return (
    <ProductGallery
      key={selectedColor}
      images={galleryImages}
      productName={product.name}
    />
  );
}

export function ProductOptionsConnected() {
  const { product, selectedColor, setSelectedColor, initialSize } = useProductSelection();

  return (
    <ProductOptions
      product={product}
      selectedColor={selectedColor}
      onColorChange={setSelectedColor}
      initialSize={initialSize}
    />
  );
}

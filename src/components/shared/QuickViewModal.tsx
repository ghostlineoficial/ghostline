'use client';

import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Maximize2 } from 'lucide-react';
import {
  ProductSelectionProvider,
  ProductGalleryConnected,
  ProductOptionsConnected,
} from './ProductSelection';
import type { Product } from '@/types/product';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  if (!product) return null;

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" />

        <Dialog.Content
          className="
            fixed
            left-1/2
            top-1/2
            z-[9999]
            w-[95vw]
            max-w-5xl
            max-h-[90vh]
            overflow-y-auto
            -translate-x-1/2
            -translate-y-1/2
            rounded-xl
            border
            border-border
            bg-background
            p-8
            shadow-2xl
            outline-none
          "
        >
          <Dialog.Title className="sr-only">
            {product.name}
          </Dialog.Title>

          <Dialog.Close className="absolute right-4 top-4">
            <X />
          </Dialog.Close>

          <ProductSelectionProvider key={product.id} product={product}>
          <div className="grid md:grid-cols-2 gap-10">
            <ProductGalleryConnected />

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                {product.name}
              </h2>

              <ProductOptionsConnected />

              <Link
                href={`/shop/${product.slug}`}
                className="inline-flex items-center gap-2"
              >
                <Maximize2 size={16} />
                Ver página completa
              </Link>
            </div>
          </div>
          </ProductSelectionProvider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
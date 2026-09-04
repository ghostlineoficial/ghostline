'use client';

import { useEffect, useState, useRef, type TouchEvent } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { overlayFade, scaleIn } from '@/lib/motion';
import { cn } from '@/utils/cn';
import type { ProductImage } from '@/types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

/**
 * ProductGallery — usa Radix Dialog diretamente (não o `Dialog` do
 * Design System) porque o lightbox precisa ocupar a tela quase inteira
 * e o `Dialog` existente é deliberadamente limitado a `max-w-md` pra
 * modais de conteúdo curto. Criar essa variante aqui evita alterar um
 * componente já aprovado só pra um caso de uso muito específico.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const gallerySignature = images.map((image) => image.id).join('|');

  useEffect(() => {
    setActiveIndex(0);
  }, [gallerySignature]);

  const active = images[activeIndex] ?? images[0];
  const count = images.length;

  function go(delta: number) {
    setActiveIndex((i) => (i + delta + count) % count);
  }

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(deltaX) > 40) go(deltaX < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  if (!active) return null;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            aria-label={`Ver imagem ${i + 1} de ${productName}`}
            aria-current={i === activeIndex}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors md:w-full',
              i === activeIndex ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>

      <div
        className="group relative flex-1 cursor-zoom-in overflow-hidden rounded-lg bg-card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={active.url}
            alt={`${productName} — imagem ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur-sm">
          <ZoomIn className="h-4 w-4" aria-hidden />
        </div>
      </div>

      <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <AnimatePresence>
          {lightboxOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  variants={overlayFade}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-4 z-50 flex items-center justify-center outline-none md:inset-16"
                >
                  <Dialog.Title className="sr-only">{`${productName} — galeria de imagens`}</Dialog.Title>

                  <Dialog.Close
                    aria-label="Fechar"
                    className="absolute right-0 top-0 rounded-full p-2 text-foreground hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Dialog.Close>

                  <button
                    type="button"
                    aria-label="Imagem anterior"
                    onClick={() => go(-1)}
                    className="absolute left-0 z-10 rounded-full p-2 text-foreground hover:bg-white/10 md:-left-12"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <div className="relative h-full w-full">
                    <Image
                      src={active.url}
                      alt={`${productName} — imagem ${activeIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="90vw"
                    />
                  </div>

                  <button
                    type="button"
                    aria-label="Próxima imagem"
                    onClick={() => go(1)}
                    className="absolute right-0 z-10 rounded-full p-2 text-foreground hover:bg-white/10 md:-right-12"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}

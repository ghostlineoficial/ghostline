'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayFade, slideFromRight } from '@/lib/motion';
import { cn } from '@/utils/cn';

interface DrawerProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
  /** Ocupa 100% da largura da tela — usado pelo menu mobile fullscreen. Default: false (largura padrão max-w-md). */
  fullscreen?: boolean;
}

/** Drawer — painel lateral. Uso típico: carrinho, filtros no mobile. */
export function Drawer({ trigger, open, onOpenChange, title, children, footer, side = 'right', fullscreen = false }: DrawerProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild forceMount>
              <motion.div
                variants={overlayFade}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </RadixDialog.Overlay>
            <RadixDialog.Content asChild forceMount>
              <motion.div
                variants={slideFromRight}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  'fixed top-0 z-50 flex h-full flex-col border-border bg-surface shadow-lg outline-none',
                  fullscreen ? 'w-screen max-w-none' : 'w-[92vw] max-w-md',
                  side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
                )}
              >
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                  <RadixDialog.Title className="text-h4 text-foreground">{title}</RadixDialog.Title>
                  <RadixDialog.Close
                    aria-label="Fechar"
                    className="rounded-full p-1 text-muted hover:bg-white/5 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </RadixDialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

                {footer && <div className="border-t border-border px-6 py-5">{footer}</div>}
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
}

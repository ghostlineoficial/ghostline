'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayFade, scaleIn } from '@/lib/motion';

interface DialogProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Dialog — usado tanto para "Dialog" quanto "Modal" (mesmo padrão de
 * interface: conteúdo centralizado sobre overlay). Ver Drawer para a
 * variante lateral (usada no carrinho, por exemplo).
 */
export function Dialog({ trigger, open, onOpenChange, title, description, children, footer }: DialogProps) {
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
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 shadow-lg outline-none"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <RadixDialog.Title className="text-h4 text-foreground">{title}</RadixDialog.Title>
                    {description && (
                      <RadixDialog.Description className="mt-1 text-body-sm text-muted">
                        {description}
                      </RadixDialog.Description>
                    )}
                  </div>
                  <RadixDialog.Close
                    aria-label="Fechar"
                    className="rounded-full p-1 text-muted hover:bg-white/5 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </RadixDialog.Close>
                </div>

                <div className="mt-4">{children}</div>

                {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
}

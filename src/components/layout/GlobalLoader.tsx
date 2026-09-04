'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@/components/ui/Spinner';

/**
 * GlobalLoader — overlay de tela cheia. Uso: operações bloqueantes
 * raras (ex: processando checkout). NÃO usar pra transição de rota
 * normal — isso é o PageLoader (barra fina no topo).
 */
export function GlobalLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <Spinner size="lg" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

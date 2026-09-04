'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { pageTransition } from '@/lib/motion';

/**
 * PageTransition — envolve `children` em cada layout que precisa de
 * fade+slide entre rotas. `key={pathname}` é o que faz o AnimatePresence
 * perceber que mudou de página e disparar exit/enter.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

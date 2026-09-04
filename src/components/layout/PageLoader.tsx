'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * PageLoader — barra fina no topo, estilo YouTube/GitHub. Dispara
 * visualmente a cada troca de pathname; como o Next App Router não
 * expõe um evento nativo de "navegação em andamento" pra Client
 * Components, isso simula a barra pela duração da própria transição
 * de página (fica sincronizada com o PageTransition).
 */
export function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
          className="fixed left-0 top-0 z-[300] h-0.5 w-full bg-primary"
        />
      )}
    </AnimatePresence>
  );
}

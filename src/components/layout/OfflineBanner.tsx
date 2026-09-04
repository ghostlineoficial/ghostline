'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/** OfflineBanner — faixa fina no topo, não bloqueia a interface (diferente de OfflineState, que é tela cheia). */
export function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -40 }}
          animate={{ y: 0 }}
          exit={{ y: -40 }}
          className="fixed left-0 top-0 z-[300] flex w-full items-center justify-center gap-2 bg-danger py-2 text-caption text-foreground"
        >
          <WifiOff className="h-3.5 w-3.5" />
          Você está offline
        </motion.div>
      )}
    </AnimatePresence>
  );
}

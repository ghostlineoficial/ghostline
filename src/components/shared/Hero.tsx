'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">

      {/* Background */}
      <div className="absolute inset-0">
        
        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-background" />

        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[180px]" />
      </div>

      {/* Conteúdo */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 flex max-w-6xl flex-col items-center px-6 text-center"
      >
        <p className="mb-6 text-xs font-semibold uppercase tracking-[10px] text-zinc-400">
  PREMIUM STREETWEAR
</p>

        <h1 className="text-6xl font-black uppercase leading-none text-white md:text-8xl">
          Beyond
          <br />
          The Limits
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-8 text-zinc-300 md:text-xl">
  Moda criada para quem transforma disciplina em identidade.
  Inspirada no universo streetwear, academia e cultura contemporânea.
</p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/shop">
            <Button size="lg">
              Comprar Agora
            </Button>
          </Link>

          <Link href="/drops">
            <Button
              variant="outline"
              size="lg"
            >
              Ver Drops
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Scroll */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ChevronDown
          size={28}
          className="text-white/70"
        />
      </motion.div>

    </section>
  );
}
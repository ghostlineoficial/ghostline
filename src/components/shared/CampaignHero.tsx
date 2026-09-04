'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CampaignHeroProps {
  backgroundSrc: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export function CampaignHero({
  backgroundSrc,
  eyebrow = 'GHOSTLINE',
  primaryCta,
  secondaryCta,
}: CampaignHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '8%'],
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.65],
    [1, 0],
  );

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[850px] overflow-hidden bg-black"
    >
      {/* Banner */}

      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0"
      >
        <Image
          src={backgroundSrc}
          alt="Ghostline Banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />

      {/* Glow Roxo */}

      <div className="absolute left-[34%] top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-violet-700/20 blur-[170px]" />

      {/* Conteúdo */}

      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex h-full items-center"
      >
        <div className="mx-auto w-full max-w-7xl px-8 lg:px-28">

          <div className="max-w-xl">

            <p className="mb-6 text-sm font-semibold uppercase tracking-[9px] text-violet-400">
              {eyebrow}
            </p>

            <h1 className="font-display text-6xl font-black uppercase leading-[0.9] text-white lg:text-8xl">
              STREETWEAR
              <br />
              ALÉM DOS
              <br />
              LIMITES
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-9 text-zinc-300">
              Peças premium inspiradas em anime,
              academia e cultura streetwear.
              Criadas para quem vive disciplina,
              evolução e identidade.
            </p>

            <div className="mt-12 flex gap-5">

              <a href={primaryCta.href}>
                <Button
                  size="lg"
                  className="rounded-full px-10 py-7 text-base"
                >
                  EXPLORAR SHOP
                </Button>
              </a>

              {secondaryCta && (
                <a href={secondaryCta.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-10 py-7 text-base"
                  >
                    PERSONALIZAR
                  </Button>
                </a>
              )}

            </div>

          </div>

        </div>
      </motion.div>

      {/* Indicador */}

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
      >
        <ChevronDown
          size={30}
          className="text-white/70"
        />
      </motion.div>

    </section>
  );
}
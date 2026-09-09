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
      className="relative min-h-[100svh] overflow-hidden bg-black lg:h-screen lg:min-h-[850px]"
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
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10 lg:from-black/70 lg:via-black/35 lg:to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 lg:to-black/70" />

      {/* Glow Roxo */}
      <div className="absolute left-[34%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-violet-700/20 blur-[120px] sm:h-[550px] sm:w-[550px] lg:h-[700px] lg:w-[700px] lg:blur-[170px]" />

      {/* Conteúdo */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex min-h-[100svh] items-center lg:h-full lg:min-h-0"
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-28 lg:py-0">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[6px] text-violet-400 sm:mb-6 sm:text-sm sm:tracking-[9px]">
              {eyebrow}
            </p>

            <h1 className="font-display text-[clamp(3rem,14vw,4.5rem)] font-black uppercase leading-[0.88] text-white lg:text-8xl">
              STREETWEAR
              <br />
              ALÉM DOS
              <br />
              LIMITES
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-zinc-300 sm:mt-8 sm:text-lg sm:leading-9">
              Peças premium inspiradas em anime,
              academia e cultura streetwear.
              Criadas para quem vive disciplina,
              evolução e identidade.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4 lg:mt-12 lg:gap-5">
              <a
                href={primaryCta.href}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full rounded-full px-6 py-6 text-sm sm:w-auto sm:px-8 sm:text-base lg:px-10 lg:py-7"
                >
                  {primaryCta.label}
                </Button>
              </a>

              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full px-6 py-6 text-sm sm:w-auto sm:px-8 sm:text-base lg:px-10 lg:py-7"
                  >
                    {secondaryCta.label}
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
        className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 sm:bottom-8"
      >
        <ChevronDown
          size={30}
          className="text-white/70"
        />
      </motion.div>
    </section>
  );
}
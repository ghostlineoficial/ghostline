'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import type { Banner } from '@/types/product';

interface ShopHeroProps {
  banner: Banner | null;
  title: string;
  subtitle?: string;
}

export function ShopHero({
  banner,
  title,
  subtitle,
}: ShopHeroProps) {
  const isOversized =
    title.toLowerCase().includes('oversized');

  const handleDetails = () => {
    if (!isOversized) {
      return;
    }

    const details =
      document.getElementById('oversized-details');

    details?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <div className="relative flex h-[46vh] min-h-[320px] items-end overflow-hidden bg-card md:h-[56vh]">
        {banner && (
          <>
            <Image
              src={banner.desktopUrl}
              alt={banner.alt ?? title}
              fill
              priority
              className="hidden object-cover md:block"
              sizes="100vw"
            />

            <Image
              src={
                banner.mobileUrl ??
                banner.desktopUrl
              }
              alt={banner.alt ?? title}
              fill
              priority
              className="object-cover md:hidden"
              sizes="100vw"
            />
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="relative z-10 w-full px-6 pb-10 md:px-12 md:pb-14">
          <h1 className="font-display text-h1 uppercase leading-[0.95] text-foreground">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 max-w-md text-body-sm text-muted md:text-body">
              {subtitle}
            </p>
          )}

          {banner?.href && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={handleDetails}
            >
              Ver detalhes
            </Button>
          )}
        </div>
      </div>

      {isOversized && (
        <section
          id="oversized-details"
          className="scroll-mt-24 border-b border-border bg-background px-6 py-16 md:px-12 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              GHOSTLINE PREMIUM
            </p>

            <h2 className="font-display text-3xl uppercase text-foreground md:text-5xl">
              Oversized Premium
            </h2>

            <p className="mt-6 max-w-3xl text-body leading-relaxed text-muted">
              Desenvolvida em Malha Peruana
              Suedine Premium 40.1, 100% algodão.
              Uma construção encorpada e
              confortável, com modelagem oversized
              e caimento pensado para valorizar o
              shape sem perder a essência solta do
              streetwear.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                '100% Algodão',
                'Malha Peruana',
                'Suedine Premium 40.1',
                'Oversized Fit',
                'Caimento Estruturado',
                'Toque Premium',
              ].map((item) => (
                <span
                  key={item}
                  className="border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
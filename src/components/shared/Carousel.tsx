'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { type ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode[];
  itemClassName?: string;
}

/**
 * Carousel — scroll horizontal nativo com scroll-snap (sem lib extra,
 * mais leve e mais acessível que reimplementar swipe/drag na mão).
 * Setas apenas empurram o scroll; o teclado/touch já funciona nativamente.
 */
export function Carousel({ children, itemClassName }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <div key={i} className={itemClassName ?? 'w-[80%] shrink-0 snap-start md:w-[32%]'}>
            {child}
          </div>
        ))}
      </div>

      <div className="mt-4 hidden justify-end gap-2 md:flex">
        <IconButton
          icon={<ChevronLeft className="h-4 w-4" />}
          label="Anterior"
          variant="outline"
          size="sm"
          onClick={() => scrollBy(-1)}
        />
        <IconButton
          icon={<ChevronRight className="h-4 w-4" />}
          label="Próximo"
          variant="outline"
          size="sm"
          onClick={() => scrollBy(1)}
        />
      </div>
    </div>
  );
}

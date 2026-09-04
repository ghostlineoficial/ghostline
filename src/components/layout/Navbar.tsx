'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { Container } from '@/components/ui/Container';
import { useUIStore } from '@/store/ui';
import { cn } from '@/utils/cn';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/drops', label: 'Drops' },
  { href: '/ghost-studio', label: 'Ghost Studio' },
  { href: '/community', label: 'Community' },
  { href: '/ghost-society', label: 'Ghost Society' },
  { href: '/support', label: 'Support' },
] as const;

interface NavbarProps {
  /**
   * true = Navbar começa transparente sobre um Hero e ganha fundo ao
   * rolar (usado no MarketingLayout). false = sempre com fundo sólido,
   * pra páginas sem hero full-bleed embaixo dela (Shop, Member, Profile).
   */
  transparentAtTop?: boolean;
}

export function Navbar({ transparentAtTop = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(!transparentAtTop);
  const { scrollY } = useScroll();
  const { openCart, openWishlist, openSearch, openMobileMenu } = useUIStore();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!transparentAtTop) return;
    setScrolled(latest > 40);
  });

  useEffect(() => {
    if (transparentAtTop) setScrolled(window.scrollY > 40);
  }, [transparentAtTop]);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? 'rgba(5,5,5,0.85)' : 'rgba(5,5,5,0)',
        borderColor: scrolled ? 'rgba(36,36,36,1)' : 'rgba(36,36,36,0)',
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('sticky top-0 z-40 border-b backdrop-blur-md')}
    >
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-wide3 text-foreground">
            GHOSTLINE
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wide2 text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <IconButton
              icon={<Search className="h-[18px] w-[18px]" />}
              label="Buscar"
              onClick={openSearch}
              className="hidden sm:inline-flex"
            />
            <IconButton
              icon={<Heart className="h-[18px] w-[18px]" />}
              label="Favoritos"
              onClick={openWishlist}
              className="hidden sm:inline-flex"
            />
            <Link href="/profile">
              <IconButton
                icon={<User className="h-[18px] w-[18px]" />}
                label="Perfil"
                className="hidden sm:inline-flex"
              />
            </Link>
            <IconButton
              icon={<ShoppingBag className="h-[18px] w-[18px]" />}
              label="Carrinho"
              onClick={openCart}
            />
            <IconButton
              icon={<Menu className="h-[18px] w-[18px]" />}
              label="Abrir menu"
              onClick={openMobileMenu}
              className="lg:hidden"
            />
          </div>
        </div>
      </Container>
    </motion.header>
  );
}

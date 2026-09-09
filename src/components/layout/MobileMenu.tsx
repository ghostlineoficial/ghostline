'use client';

import Link from 'next/link';
import { Search, Heart, User } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { useUIStore } from '@/store/ui';

const LINKS = [
  { href: '/drops', label: 'Drops' },
  { href: '/ghost-studio', label: 'Ghost Studio' },
  { href: '/community', label: 'Community' },
  { href: '/ghost-society', label: 'Ghost Society' },
  { href: '/support', label: 'Support' },
] as const;

/** MobileMenu — Drawer lateral fullscreen com a navegação principal. Mesma base do CartDrawer/WishlistDrawer. */
export function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu, openSearch, openWishlist } = useUIStore();

  return (
    <Drawer
      open={mobileMenuOpen}
      onOpenChange={(open) => !open && closeMobileMenu()}
      title="Menu"
      fullscreen
    >
      <nav className="flex flex-col">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobileMenu}
            className="border-b border-border py-5 font-display text-h4 uppercase text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 flex flex-col gap-1">
        <button
          onClick={() => {
            closeMobileMenu();
            openSearch();
          }}
          className="flex items-center gap-3 py-3 text-body-sm text-muted"
        >
          <Search className="h-4 w-4" /> Buscar
        </button>

        <button
          onClick={() => {
            closeMobileMenu();
            openWishlist();
          }}
          className="flex items-center gap-3 py-3 text-body-sm text-muted"
        >
          <Heart className="h-4 w-4" /> Favoritos
        </button>

        <Link
          href="/profile"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 py-3 text-body-sm text-muted"
        >
          <User className="h-4 w-4" /> Perfil
        </Link>
      </div>
    </Drawer>
  );
}
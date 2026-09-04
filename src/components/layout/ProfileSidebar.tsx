'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';

const LINKS = [
  { href: '/profile', label: 'Visão geral' },
  { href: '/profile/orders', label: 'Pedidos' },
  { href: '/profile/addresses', label: 'Endereços' },
  { href: '/profile/settings', label: 'Configurações' },
] as const;

/** ProfileSidebar — navegação da área de conta. Usado só pelo ProfileLayout. */
export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border py-4 lg:w-52 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:py-0 lg:pr-6">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'whitespace-nowrap rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide2 transition-colors lg:rounded-md',
              active ? 'bg-primary/15 text-primary' : 'text-muted hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

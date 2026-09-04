'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Zap,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/drops', label: 'Drops', icon: Zap },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
] as const;

/** AdminSidebar — navegação fixa do painel. Usado só pelo AdminLayout. */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="px-6 py-6">
        <Link href="/admin" className="font-display text-lg tracking-wide3 text-foreground">
          GHOSTLINE
        </Link>
        <p className="mt-0.5 font-mono text-caption uppercase tracking-wide2 text-muted">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {LINKS.map((link) => {
          const active = link.href === '/admin' ? pathname === link.href : pathname?.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-body-sm transition-colors',
                active ? 'bg-primary/15 text-primary' : 'text-muted hover:bg-white/5 hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

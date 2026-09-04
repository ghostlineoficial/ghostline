import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { PageTransition } from '@/components/layout/PageTransition';

/**
 * AdminLayout — deliberadamente NÃO reusa Navbar/Footer de marketing.
 * Painel interno é uma ferramenta de trabalho, não uma vitrine — sidebar
 * fixa em vez de navegação horizontal, sem Newsletter/rodapé
 * institucional, densidade de informação maior. Ainda assim, 100%
 * construído com os primitivos do Design System (Container, IconButton,
 * etc.), só a composição estrutural é diferente.
 */
export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-8 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}

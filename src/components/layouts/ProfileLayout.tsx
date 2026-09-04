import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Container } from '@/components/ui/Container';
import { ProfileSidebar } from '@/components/layout/ProfileSidebar';
import { PageTransition } from '@/components/layout/PageTransition';

/**
 * ProfileLayout — área de conta (pedidos, endereços, configurações).
 * Decisão: sem Footer aqui — é uma área "de aplicativo", não de loja;
 * Newsletter/links institucionais no rodapé não fazem sentido em cada
 * tela de pedido. `Container size="md"` porque essas telas são mais
 * estreitas (formulários, listas), não grids largos de produto.
 */
export function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        <Container size="md" className="flex flex-col gap-8 py-10 lg:flex-row">
          <ProfileSidebar />
          <div className="flex-1">
            <PageTransition>{children}</PageTransition>
          </div>
        </Container>
      </main>
    </>
  );
}

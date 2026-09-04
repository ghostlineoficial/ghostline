import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { MemberSidebar } from '@/components/layout/MemberSidebar';
import { PageTransition } from '@/components/layout/PageTransition';

/**
 * MemberLayout — Ghost Studio, Community, Ghost Society: as três áreas
 * que giram em torno de engajamento/membro logado. Compartilham a
 * `MemberSidebar` (navegação entre elas) em vez de cada uma reimplementar
 * seu próprio sub-menu.
 */
export function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        <Container className="flex flex-col gap-8 py-10 lg:flex-row">
          <MemberSidebar />
          <div className="flex-1">
            <PageTransition>{children}</PageTransition>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

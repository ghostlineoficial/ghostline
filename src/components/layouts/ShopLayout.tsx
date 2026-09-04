import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { PageTransition } from '@/components/layout/PageTransition';

/**
 * ShopLayout — Shop, Drops, página de produto, carrinho. Sem hero
 * full-bleed embaixo da Navbar (listagem de produto começa logo no
 * topo), então ela já nasce com fundo sólido. `Container` padrão
 * `lg` envolve o conteúdo — grids de produto usam essa largura.
 */
export function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        <Container className="py-10">
          <PageTransition>{children}</PageTransition>
        </Container>
      </main>
      <Footer />
    </>
  );
}

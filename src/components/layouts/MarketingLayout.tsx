import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';

/**
 * MarketingLayout — páginas públicas com hero full-bleed (Home, About,
 * Support). Navbar começa transparente e ganha fundo ao rolar, pra não
 * competir visualmente com o hero. Ver ShopLayout para a variante sem
 * hero (Navbar sempre sólida).
 */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar transparentAtTop />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}

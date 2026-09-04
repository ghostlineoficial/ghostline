import type { Metadata } from 'next';
import { Anton, Inter, Space_Grotesk } from 'next/font/google';
import { TooltipProvider } from '@/providers/TooltipProvider';
import { Toaster } from '@/components/ui/Toast';
import { PageLoader } from '@/components/layout/PageLoader';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WishlistDrawer } from '@/components/layout/WishlistDrawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import './globals.css';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'GHOSTLINE — Beyond the Limits',
  description:
    'Streetwear premium. Identidade, pertencimento, disciplina, evolução.',
};

/**
 * Layout principal (raiz). Deliberadamente NÃO monta Navbar/Footer aqui
 * — isso mudou nesta fase. Motivo: AdminLayout não pode ter a Navbar de
 * marketing, ProfileLayout não tem Footer. Cada um dos 5 layouts
 * (Marketing/Shop/Member/Profile/Admin, em src/components/layouts/)
 * decide seu próprio chrome. O que fica aqui é só o que é
 * verdadeiramente global: fontes, providers, overlays (busca, carrinho,
 * favoritos, menu mobile — que existem em cima de qualquer layout) e os
 * indicadores de loading/offline.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body>
        <TooltipProvider>
          <OfflineBanner />
          <PageLoader />

          {children}

          <MobileMenu />
          <CartDrawer />
          <WishlistDrawer />
          <SearchOverlay />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}

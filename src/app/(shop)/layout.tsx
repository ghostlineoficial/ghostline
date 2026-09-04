import type { ReactNode } from 'react';
import { ShopLayout } from '@/components/layouts/ShopLayout';

// Grupo de rotas reservado pra Shop, Drops e página de produto.
// Nenhum page.tsx criado nesta fase — só o layout que essas rotas
// vão usar quando forem implementadas.
export default function Layout({ children }: { children: ReactNode }) {
  return <ShopLayout>{children}</ShopLayout>;
}

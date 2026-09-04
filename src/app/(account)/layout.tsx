import type { ReactNode } from 'react';
import { ProfileLayout } from '@/components/layouts/ProfileLayout';

// Grupo de rotas reservado pra Profile (pedidos, endereços, configurações).
// Nenhum page.tsx criado nesta fase.
export default function Layout({ children }: { children: ReactNode }) {
  return <ProfileLayout>{children}</ProfileLayout>;
}

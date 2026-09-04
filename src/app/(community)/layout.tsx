import type { ReactNode } from 'react';
import { MemberLayout } from '@/components/layouts/MemberLayout';

// Grupo de rotas reservado pra Ghost Studio, Community e Ghost Society.
// Nenhum page.tsx criado nesta fase.
export default function Layout({ children }: { children: ReactNode }) {
  return <MemberLayout>{children}</MemberLayout>;
}

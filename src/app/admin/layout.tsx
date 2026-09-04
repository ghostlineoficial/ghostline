import type { ReactNode } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';

// Rota /admin. Nenhum page.tsx (dashboard) criado nesta fase — só o
// layout que o painel administrativo vai usar.
export default function Layout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

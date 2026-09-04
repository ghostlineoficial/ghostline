import { NotFoundState } from '@/components/shared/ErrorStates';

// Convenção obrigatória do Next.js (App Router) — não é uma "página" de
// produto, é o arquivo que o framework renderiza automaticamente pra
// qualquer rota que não existe. Sem ele, 404 cairia no HTML genérico do Next.
export default function NotFound() {
  return <NotFoundState />;
}

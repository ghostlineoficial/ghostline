'use client';

import { useEffect } from 'react';
import { ServerErrorState } from '@/components/shared/ErrorStates';

// Convenção obrigatória do Next.js (App Router) — error boundary automático
// de cada segmento de rota. Precisa ser Client Component. Não é uma página.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return <ServerErrorState onRetry={reset} />;
}

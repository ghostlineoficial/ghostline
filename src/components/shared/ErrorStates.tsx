import Link from 'next/link';
import { Ghost, ServerCrash, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StateProps {
  onRetry?: () => void;
}

/** NotFoundState — usado por app/not-found.tsx. Reutiliza o padrão visual de EmptyState/ErrorState. */
export function NotFoundState() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <Ghost className="h-10 w-10 text-muted" />
      <div>
        <p className="font-display text-h1 uppercase text-foreground">404</p>
        <p className="mt-2 text-body-sm text-muted">Essa página não existe além dos limites.</p>
      </div>
      <Link href="/">
        <Button variant="outline">Voltar pra Home</Button>
      </Link>
    </div>
  );
}

/** ServerErrorState — usado por app/error.tsx (error boundary do Next). */
export function ServerErrorState({ onRetry }: StateProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <ServerCrash className="h-10 w-10 text-danger" />
      <div>
        <p className="font-display text-h1 uppercase text-foreground">500</p>
        <p className="mt-2 text-body-sm text-muted">Algo quebrou do nosso lado. Já fomos avisados.</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

/** OfflineState — mostrado quando o navegador perde conexão (ver hooks/useOnlineStatus). */
export function OfflineState() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <WifiOff className="h-10 w-10 text-muted" />
      <div>
        <p className="font-display text-h2 uppercase text-foreground">Sem conexão</p>
        <p className="mt-2 text-body-sm text-muted">Verifique sua internet e tente novamente.</p>
      </div>
    </div>
  );
}

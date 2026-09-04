import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Não foi possível carregar esse conteúdo. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <AlertTriangle className="h-8 w-8 text-danger" />
      <div>
        <p className="text-h4 text-foreground">{title}</p>
        <p className="mt-2 max-w-sm text-body-sm text-muted">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

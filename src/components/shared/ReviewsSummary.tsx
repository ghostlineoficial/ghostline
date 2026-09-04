import { MessageSquare } from 'lucide-react';
import { Rating } from '@/components/ui/Rating';
import { EmptyState } from '@/components/ui/EmptyState';

interface ReviewsSummaryProps {
  averageRating?: number;
  totalReviews?: number;
}

/**
 * ReviewsSummary — só estrutura visual, por instrução explícita desta
 * fase ("ainda sem integração"). O schema de `reviews`/`review_images`
 * já existe (Fase 02), mas nenhum ReviewService foi criado — quando
 * existir, essa é a única peça que precisa trocar de fonte de dado.
 */
export function ReviewsSummary({ averageRating = 0, totalReviews = 0 }: ReviewsSummaryProps) {
  if (totalReviews === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-8 w-8" />}
        title="Nenhuma avaliação ainda"
        description="Seja a primeira pessoa a avaliar essa peça depois da compra."
      />
    );
  }

  return (
    <div className="flex items-center gap-4">
      <p className="font-display text-h2 text-foreground">{averageRating.toFixed(1)}</p>
      <div>
        <Rating value={averageRating} size="md" />
        <p className="mt-1 text-body-sm text-muted">{totalReviews} avaliações</p>
      </div>
    </div>
  );
}

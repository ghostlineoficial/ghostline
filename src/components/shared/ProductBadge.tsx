import { Badge } from '@/components/ui/Badge';

type ProductBadgeKind = 'new' | 'sold-out' | 'discount' | 'limited';

interface ProductBadgeProps {
  kind: ProductBadgeKind;
  discountPercent?: number; // obrigatório quando kind === 'discount'
}

/** ProductBadge — variações de Badge com semântica fixa de e-commerce. */
export function ProductBadge({ kind, discountPercent }: ProductBadgeProps) {
  switch (kind) {
    case 'new':
      return <Badge tone="primary">Novo</Badge>;
    case 'sold-out':
      return <Badge tone="default">Esgotado</Badge>;
    case 'limited':
      return <Badge tone="warning">Edição limitada</Badge>;
    case 'discount':
      return <Badge tone="success">-{discountPercent}%</Badge>;
  }
}

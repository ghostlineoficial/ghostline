import { Sparkles } from 'lucide-react';

interface BenefitItemProps {
  title: string;
  description: string;
}

/** BenefitItem — item de lista de benefícios, reutilizável em qualquer seção de "o que você ganha" (planos, programas). */
export function BenefitItem({ title, description }: BenefitItemProps) {
  return (
    <div>
      <Sparkles className="h-5 w-5 text-primary" aria-hidden />
      <p className="mt-4 font-display text-h4 uppercase text-foreground">{title}</p>
      <p className="mt-2 text-body-sm text-muted">{description}</p>
    </div>
  );
}

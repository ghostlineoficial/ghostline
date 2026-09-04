'use client';

import { Share2 } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { useToast } from '@/components/ui/Toast';

interface ShareButtonProps {
  title: string;
  url: string;
}

/** ShareButton — genérico, reutilizável em qualquer página compartilhável (produto, drop, perfil público). */
export function ShareButton({ title, url }: ShareButtonProps) {
  const push = useToast((s) => s.push);

  async function share() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // usuário cancelou o share nativo — não é erro, não faz nada
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      push({ tone: 'success', title: 'Link copiado', description: url });
    } catch {
      push({ tone: 'danger', title: 'Não foi possível copiar o link' });
    }
  }

  return (
    <IconButton icon={<Share2 className="h-4 w-4" />} label="Compartilhar" variant="outline" size="lg" onClick={share} />
  );
}

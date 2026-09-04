'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

interface FavoriteButtonProps {
  productName: string;
}

/**
 * FavoriteButton — hoje só visual (toggle local + toast). A Wishlist
 * real (persistir no Supabase, refletir no WishlistDrawer) é lógica de
 * uma fase futura de conta/usuário — este componente já nasce no lugar
 * certo pra receber isso depois sem mudar de posição na página.
 * Reutilizável em qualquer card/página de produto.
 */
export function FavoriteButton({ productName }: FavoriteButtonProps) {
  const [active, setActive] = useState(false);
  const push = useToast((s) => s.push);

  function toggle() {
    const next = !active;
    setActive(next);
    push({
      tone: 'success',
      title: next ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      description: productName,
    });
  }

  return (
    <IconButton
      icon={<Heart className={cn('h-4 w-4', active && 'fill-primary text-primary')} />}
      label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      variant="outline"
      size="lg"
      onClick={toggle}
    />
  );
}

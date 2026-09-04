'use client';

import { Heart } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUIStore } from '@/store/ui';

/** WishlistDrawer — mesmo padrão estrutural do CartDrawer. Lógica real fica em features/wishlist. */
export function WishlistDrawer() {
  const { wishlistOpen, closeWishlist } = useUIStore();

  return (
    <Drawer open={wishlistOpen} onOpenChange={(open) => !open && closeWishlist()} title="Favoritos">
      <EmptyState
        icon={<Heart className="h-8 w-8" />}
        title="Nenhum favorito ainda"
        description="Toque no coração de um produto pra salvar aqui."
      />
    </Drawer>
  );
}

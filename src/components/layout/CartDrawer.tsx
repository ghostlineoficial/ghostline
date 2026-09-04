'use client';

import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUIStore } from '@/store/ui';
import { useCartStore } from '@/store/cart';

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceCents / 100);
}

export function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity,
  );
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity,
  );

  const subtotalCents = items.reduce(
    (total, item) =>
      total + item.priceCents * item.quantity,
    0,
  );

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <Drawer
      open={cartOpen}
      onOpenChange={(open) => !open && closeCart()}
      title={`Carrinho${totalItems > 0 ? ` (${totalItems})` : ''}`}
      footer={
        items.length > 0 ? (
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-muted">
                Subtotal
              </span>

              <span className="text-lg font-semibold">
                {formatPrice(subtotalCents)}
              </span>
            </div>

            <Button className="w-full">
              Finalizar compra
            </Button>
          </div>
        ) : (
          <Button className="w-full" disabled>
            Finalizar compra
          </Button>
        )
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Seu carrinho está vazio"
          description="Os produtos que você adicionar aparecem aqui."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b border-border pb-6"
            >
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-muted" />
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-caption text-muted">
                      {item.color} • {item.size}
                    </p>

                    <p className="mt-1 text-caption text-muted">
                      SKU {item.sku}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-muted transition-colors hover:text-danger"
                    aria-label={`Remover ${item.name} do carrinho`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <div className="flex items-center overflow-hidden rounded-md border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="flex h-8 min-w-8 items-center justify-center px-2 text-sm">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      disabled={
                        item.quantity >= item.stock
                      }
                      className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="font-semibold">
                    {formatPrice(
                      item.priceCents * item.quantity,
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <p className="text-caption text-muted">
            Frete e descontos serão calculados na finalização.
          </p>
        </div>
      )}
    </Drawer>
  );
}
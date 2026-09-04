import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  color: string;
  size: string;
  priceCents: number;
  quantity: number;
  stock: number;
  sku: string;
}

interface CartStore {
  items: CartItem[];

  addItem: (...args: [CartItem]) => void;
  removeItem: (...args: [string]) => void;
  increaseQuantity: (...args: [string]) => void;
  decreaseQuantity: (...args: [string]) => void;
  setQuantity: (...args: [string, number]) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getSubtotalCents: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.id === item.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      quantity: Math.min(
                        cartItem.quantity + item.quantity,
                        cartItem.stock,
                      ),
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.id !== id,
          ),
        }));
      },

      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + 1,
                    item.stock,
                  ),
                }
              : item,
          ),
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      setQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity: Math.min(
                      Math.max(quantity, 0),
                      item.stock,
                    ),
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => {
        set({
          items: [],
        });
      },

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) =>
            total + item.quantity,
          0,
        );
      },

      getSubtotalCents: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            item.priceCents * item.quantity,
          0,
        );
      },
    }),
    {
      name: 'ghostline-cart',
    },
  ),
);
import { create } from 'zustand';

interface UIStore {
  cartOpen: boolean;
  wishlistOpen: boolean;
  searchOpen: boolean;
  mobileMenuOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  closeAll: () => void;
}

/**
 * Estado de UI global (não é estado de negócio — carrinho/wishlist
 * reais vivem em features/cart e features/wishlist). Isso aqui só
 * controla "esse painel está aberto ou fechado", pra qualquer botão
 * em qualquer lugar do app poder abrir o carrinho, por exemplo, sem
 * prop-drilling.
 */
export const useUIStore = create<UIStore>((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,

  openCart: () => set({ cartOpen: true, wishlistOpen: false, searchOpen: false, mobileMenuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openWishlist: () => set({ wishlistOpen: true, cartOpen: false, searchOpen: false, mobileMenuOpen: false }),
  closeWishlist: () => set({ wishlistOpen: false }),
  openSearch: () => set({ searchOpen: true, cartOpen: false, wishlistOpen: false, mobileMenuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  openMobileMenu: () => set({ mobileMenuOpen: true, cartOpen: false, wishlistOpen: false, searchOpen: false }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  closeAll: () => set({ cartOpen: false, wishlistOpen: false, searchOpen: false, mobileMenuOpen: false }),
}));

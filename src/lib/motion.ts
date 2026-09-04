import type { Variants, Transition } from 'framer-motion';

/**
 * Padrões de movimento do Design System Ghostline.
 * Regra: nunca exagerar. Durações curtas (150–400ms), easing suave,
 * deslocamentos pequenos (8–24px). Movimento comunica hierarquia,
 * não decora.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const transitionFast: Transition = { duration: 0.15, ease: EASE };
export const transitionBase: Transition = { duration: 0.25, ease: EASE };
export const transitionSlow: Transition = { duration: 0.4, ease: EASE };

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionBase },
  exit: { opacity: 0, transition: transitionFast },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
  exit: { opacity: 0, y: 8, transition: transitionFast },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
  exit: { opacity: 0, y: -8, transition: transitionFast },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: transitionBase },
  exit: { opacity: 1, x: 32, transition: transitionFast },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitionBase },
  exit: { opacity: 0, scale: 0.98, transition: transitionFast },
};

/** Overlay de fundo pra Dialog/Drawer/Modal */
export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionBase },
  exit: { opacity: 0, transition: transitionFast },
};

/** Hover de cards — leve elevação, nunca "pulo" */
export const cardHover = {
  rest: { y: 0, transition: transitionFast },
  hover: { y: -4, transition: transitionFast },
};

/** Transição de página — fade + leve slide, usado em templates de rota */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transitionSlow },
  exit: { opacity: 0, y: -8, transition: transitionBase },
};

/** Stagger pra listas/grids que entram em sequência (ex: grid de produtos) */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

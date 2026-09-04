'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { slideUp, staggerContainer } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reveal — anima o filho pra dentro quando entra na viewport.
 * `once: true` = a animação só roda na primeira vez (não refaz ao
 * rolar pra cima e voltar), evitando um efeito "piscante" irritante.
 */
export function Reveal({ children, className }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={slideUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** RevealGroup — versão com stagger, pra listas/grids (ex: grid de produtos entrando em sequência). */
export function RevealGroup({ children, className }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** RevealItem — usado dentro de RevealGroup em cada filho individual. */
export function RevealItem({ children, className }: RevealProps) {
  return (
    <motion.div variants={slideUp} className={className}>
      {children}
    </motion.div>
  );
}

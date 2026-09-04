import { motion, type HTMLMotionProps } from 'framer-motion';
import { cardHover } from '@/lib/motion';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
}

/**
 * Card — base visual reutilizada por ProductCard, DropCard, ProfileCard,
 * GalleryCard, CommentCard. Nunca usar diretamente numa página; sempre
 * compor um card especializado a partir dela.
 */
export function Card({
  hoverable = true,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover={hoverable ? 'hover' : undefined}
      variants={cardHover}
      className={cn(
        'rounded-lg border border-border bg-card p-5 transition-shadow',
        hoverable && 'hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
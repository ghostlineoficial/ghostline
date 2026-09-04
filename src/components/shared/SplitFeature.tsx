import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

interface SplitFeatureProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  badge?: string;
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  imageSide?: 'left' | 'right';
}

export function SplitFeature({
  imageSrc,
  imageAlt,
  eyebrow,
  badge,
  title,
  description,
  cta,
  imageSide = 'left',
}: SplitFeatureProps) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div
        className={cn(
          'relative aspect-[4/5] overflow-hidden rounded-lg',
          imageSide === 'right' && 'md:order-2',
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>

      <div
        className={cn(
          imageSide === 'right' && 'md:order-1',
        )}
      >
        {badge && (
          <div className="mb-4">
            <Badge tone="live">
              {badge}
            </Badge>
          </div>
        )}

        {eyebrow && (
          <p className="mb-3 font-mono text-caption uppercase tracking-wide3 text-primary">
            {eyebrow}
          </p>
        )}

        <h2 className="font-display text-h2 uppercase leading-[0.95] text-foreground">
          {title}
        </h2>

        <p className="mt-5 max-w-md text-body-sm text-muted">
          {description}
        </p>

        <a
          href={cta.href}
          className="mt-8 inline-block"
        >
          <Button size="lg">
            {cta.label}
          </Button>
        </a>
      </div>
    </div>
  );
}
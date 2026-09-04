import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import type { Drop } from '@/types/product';

interface DropCardProps {
  drop: Drop;
  coverUrl: string;
}

const statusLabel: Record<Drop['status'], string> = {
  upcoming: 'Em breve',
  live: 'Ao vivo',
  ended: 'Encerrado',
};

/** DropCard — não implementa o countdown em si (isso é lógica de features/drops), só exibe o status. */
export function DropCard({ drop, coverUrl }: DropCardProps) {
  return (
    <Link href={`/drops/${drop.slug}`} className="group relative block overflow-hidden rounded-lg">
      <div className="relative aspect-[4/5]">
        <Image
          src={coverUrl}
          alt={drop.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Badge tone={drop.status === 'live' ? 'live' : 'default'}>{statusLabel[drop.status]}</Badge>
        <p className="mt-3 font-display text-h3 uppercase text-foreground">{drop.name}</p>
      </div>
    </Link>
  );
}

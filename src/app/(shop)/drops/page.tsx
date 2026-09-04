import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DropCard } from '@/components/shared/DropCard';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { mockBanners, mockDrops, mockProducts } from '@/lib/mock/catalog';
import type { Drop } from '@/types/product';

export default function DropsPage() {
  const drops: Drop[] = mockDrops.map((drop) => ({
    ...drop,
    products: mockProducts.filter((product) => product.dropId === drop.id),
  }));

  return (
    <Section>
      <Container>
        <SectionTitle eyebrow="Drops" title="Coleções que marcam fases" className="mb-10" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {drops.map((drop) => (
            <DropCard
              key={drop.id}
              drop={drop}
              coverUrl={mockBanners[`banner:drop:${drop.slug}`]?.desktopUrl ?? '/images/drop-current.svg'}
            />
          ))}
        </div>
        <div className="mt-10">
          <Link href="/shop"><Button variant="outline">Ver todos os produtos</Button></Link>
        </div>
      </Container>
    </Section>
  );
}

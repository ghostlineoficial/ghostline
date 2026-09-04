import type { Metadata } from 'next';
import Link from 'next/link';
import { CampaignHero } from '@/components/shared/CampaignHero';
import { SplitFeature } from '@/components/shared/SplitFeature';
import { CategoryCard } from '@/components/shared/CategoryCard';
import { Manifesto } from '@/components/shared/Manifesto';
import { BenefitItem } from '@/components/shared/BenefitItem';
import { ProductCard } from '@/components/shared/ProductCard';
import { GalleryCard } from '@/components/shared/GalleryCard';
import { Newsletter } from '@/components/shared/Newsletter';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Grid } from '@/components/ui/Grid';
import { Button } from '@/components/ui/Button';
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from '@/components/layout/Reveal';
import {
  currentDrop,
  categories,
  featuredProducts,
  galleryItems,
  instagramItems,
  societyBenefits,
} from '@/lib/mock/home-content';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://ghostline.com.br';

export const metadata: Metadata = {
  title: 'GHOSTLINE — Beyond the Limits',

  description:
    'Streetwear premium para quem vive academia, anime, games e cultura streetwear. Drops limitados, customização no Ghost Studio e a comunidade Ghost Society.',

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: 'GHOSTLINE — Beyond the Limits',

    description:
      'Streetwear premium. Identidade, pertencimento, disciplina, evolução.',

    url: SITE_URL,

    siteName: 'Ghostline',

    images: [
      {
        url: `${SITE_URL}/images/banners/hero.png`,
        width: 1920,
        height: 1080,
      },
    ],

    locale: 'pt_BR',

    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'GHOSTLINE — Beyond the Limits',

    description:
      'Streetwear premium. Identidade, pertencimento, disciplina, evolução.',

    images: [
      `${SITE_URL}/images/banners/hero.png`,
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ghostline',
  url: SITE_URL,
  slogan: 'Beyond the Limits',
  sameAs: [
    'https://www.instagram.com/ghostlineoficial/',
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* HERO */}
      <CampaignHero
        backgroundSrc="/images/banners/hero.png"
        eyebrow="Ghostline"
        title="Beyond the limits"
        subtitle="Identidade. Pertencimento. Disciplina. Evolução. Streetwear premium pra quem vive academia, anime e cultura gamer."
        primaryCta={{
          label: 'Explore Collection',
          href: '/shop',
        }}
        secondaryCta={{
          label: 'Open Ghost Studio',
          href: '/ghost-studio',
        }}
      />

      {/* DROP */}
      <Section>
        <Container>
          <Reveal>
            <SplitFeature
              imageSrc="/images/drop-01-cover.png"
              imageAlt={currentDrop.name}
              badge="Ao vivo"
              eyebrow="Drop atual"
              title={currentDrop.name}
              description="Edição limitada, estoque restrito. Quando acabar, não volta — essa é a lógica de todo drop Ghostline."
              cta={{
                label: 'Explore Drop',
                href: '/drops/drop-01',
              }}
            />
          </Reveal>
        </Container>
      </Section>

      {/* CATEGORIAS */}
      <Section tight>
        <Container>
          <Reveal>
            <SectionTitle
              eyebrow="Categorias"
              title="Encontre seu estilo"
            />
          </Reveal>

          <RevealGroup>
            <Grid cols={4} gap={4}>
              {categories.map((category) => (
                <RevealItem key={category.slug}>
                  <CategoryCard
                    name={category.name}
                    href={
                      category.comingSoon
                        ? undefined
                        : `/shop?categoria=${category.slug}`
                    }
                    imageSrc={category.image}
                    comingSoon={category.comingSoon}
                  />
                </RevealItem>
              ))}
            </Grid>
          </RevealGroup>
        </Container>
      </Section>

      {/* MANIFESTO */}
      <Section background="surface">
        <Container>
          <Reveal>
            <Manifesto
              headline="Streetwear não é sobre roupa."
              text="É sobre quem você decide ser quando ninguém está olhando. Disciplina, identidade e a coragem de ir além dos limites — isso é Ghostline."
              imageSrc="/images/manifesto-ghostline.png"
            />
          </Reveal>
        </Container>
      </Section>

      {/* GHOST STUDIO */}
      <Section>
        <Container>
          <Reveal>
            <SplitFeature
              imageSrc="/images/ghost-studio-banner.png"
              imageAlt="Ghost Studio — Customize sua peça"
              eyebrow="Ghost Studio"
              title="Sua peça, sua regra"
              description="Escolha a cor, a arte, o texto, a fonte. Monte a peça do seu jeito e veja o render antes de comprar."
              cta={{
                label: 'Create Your Own',
                href: '/ghost-studio',
              }}
              imageSide="right"
            />
          </Reveal>
        </Container>
      </Section>

      {/* PRODUTOS */}
      <Section tight>
        <Container>
          <Reveal>
            <SectionTitle
              eyebrow="Shop"
              title="Em destaque"
            />
          </Reveal>

          <RevealGroup>
            <Grid cols={4} gap={6}>
              {featuredProducts.map((product, i) => (
                <RevealItem key={product.id}>
                  <ProductCard
                    product={product}
                    badge={
                      i < 2
                        ? 'new'
                        : undefined
                    }
                  />
                </RevealItem>
              ))}
            </Grid>
          </RevealGroup>
        </Container>
      </Section>

      {/* GHOST SOCIETY */}
      <Section background="surface">
        <Container>
          <Reveal>
            <SectionTitle
              eyebrow="Ghost Society"
              title="Acesso além dos limites"
              align="center"
            />
          </Reveal>

          <RevealGroup>
            <Grid cols={3} gap={8}>
              {societyBenefits.map((benefit) => (
                <RevealItem key={benefit.title}>
                  <BenefitItem
                    title={benefit.title}
                    description={benefit.description}
                  />
                </RevealItem>
              ))}
            </Grid>
          </RevealGroup>

          <Reveal className="mt-14 flex justify-center">
            <Link href="/ghost-society">
              <Button size="lg">
                Join Now
              </Button>
            </Link>
          </Reveal>
        </Container>
      </Section>

      {/* GALERIA */}
      <Section tight>
        <Container>
          <Reveal>
            <SectionTitle
              eyebrow="Ghost Gallery"
              title="Direto dos clientes"
            />
          </Reveal>

          <RevealGroup>
            <Grid cols={3} gap={4}>
              {galleryItems.map((item) => (
                <RevealItem key={item.id}>
                  <GalleryCard
                    imageUrl={item.image}
                    caption={item.caption}
                    aspect="square"
                  />
                </RevealItem>
              ))}
            </Grid>
          </RevealGroup>
        </Container>
      </Section>

      {/* INSTAGRAM */}
      <Section tight>
        <Container>
          <Reveal className="mb-10 flex flex-col items-center gap-4 text-center">
            <SectionTitle
              eyebrow="Instagram"
              title="@ghostlineoficial"
              align="center"
            />

            <a
              href="https://www.instagram.com/ghostlineoficial/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                Seguir no Instagram
              </Button>
            </a>
          </Reveal>

          <RevealGroup>
            <Grid cols={6} gap={3}>
              {instagramItems.map((item) => (
                <RevealItem key={item.id}>
                  <GalleryCard
                    imageUrl={item.image}
                    aspect="square"
                  />
                </RevealItem>
              ))}
            </Grid>
          </RevealGroup>
        </Container>
      </Section>

      {/* NEWSLETTER */}
      <Section background="surface">
        <Container size="sm">
          <Reveal>
            <Newsletter />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
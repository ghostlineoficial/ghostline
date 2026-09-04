import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DropCountdown } from '@/components/shared/DropCountdown';
import { ProductCard } from '@/components/shared/ProductCard';

import { mockDrops, mockProducts } from '@/lib/mock/catalog';

export default async function DropPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const drop = mockDrops.find((item) => item.slug === slug);

  if (!drop) {
    notFound();
  }

  const related = mockProducts.filter(
    (product) => product.dropId === drop.id
  );

  return (
    <>
      {/* =====================================================
          HERO — DROP I
      ====================================================== */}

      <Section>
        <Container>
          <div className="grid items-center gap-10 border-b border-white/10 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">

            {/* LADO ESQUERDO */}

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
                Edição limitada
              </p>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">
                Drop I
              </p>

              <h1 className="max-w-xl text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Beyond
                <br />
                The Limits
              </h1>

              <div className="mt-6 h-[2px] w-20 bg-violet-500" />

              <p className="mt-7 max-w-xl text-sm leading-7 text-muted sm:text-base">
                O primeiro capítulo de uma nova era.
                <br />
                8 artes exclusivas. 8 peças que não se repetem.
                <br />
                Disponíveis por tempo limitado.
              </p>

              {/* INFORMAÇÕES */}

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xl font-semibold text-white">
                    8
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/45">
                    Peças
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xl font-semibold text-white">
                    3 meses
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/45">
                    Duração
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xl font-semibold text-white">
                    Única
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/45">
                    Não retorna
                  </p>
                </div>
              </div>
            </div>

            {/* LADO DIREITO — BANNER OFICIAL */}

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/images/drop-01-banner-desktop.png"
                  alt="GHOSTLINE — DROP I — Beyond The Limits"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* CRONÔMETRO */}

            <div className="lg:col-span-2">
              <DropCountdown endsAt={drop.endsAt} />
            </div>

          </div>
        </Container>
      </Section>

      {/* =====================================================
          PRODUTOS — 8 ARTES DIFERENTES
      ====================================================== */}

      <Section>
        <Container>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                Edição 01
              </p>

              <h2 className="mt-2 text-2xl font-semibold uppercase text-white sm:text-3xl">
                As 8 peças da edição
              </h2>

              <p className="mt-2 text-sm text-muted">
                Cada peça possui uma arte exclusiva. Escolha a sua.
              </p>
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Quantidades limitadas
            </p>

          </div>

          {related.length > 0 ? (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {related.map((product, index) => (

                <div key={product.id}>

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-xs font-semibold tracking-[0.18em] text-white/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                      Limited
                    </span>

                  </div>

                  <ProductCard product={product} />

                </div>

              ))}

            </div>

          ) : (

            <p className="rounded-xl border border-border bg-card p-8 text-muted">
              Este drop ainda não possui produtos publicados.
            </p>

          )}

          {/* INFORMAÇÕES FINAIS */}

          <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">

            <div>
              <p className="text-sm font-semibold uppercase text-white">
                Edição limitada
              </p>

              <p className="mt-2 text-xs leading-5 text-white/45">
                Apenas 8 artes disponíveis durante esta edição.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase text-white">
                Não retorna
              </p>

              <p className="mt-2 text-xs leading-5 text-white/45">
                Quando a edição termina, as artes deixam o catálogo.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase text-white">
                Próxima edição
              </p>

              <p className="mt-2 text-xs leading-5 text-white/45">
                Uma nova seleção de 8 artes assume o lugar da edição atual.
              </p>
            </div>

          </div>

          <div className="mt-10">
            <Link href="/shop">
              <Button>Explorar Shop</Button>
            </Link>
          </div>

        </Container>
      </Section>
    </>
  );
}
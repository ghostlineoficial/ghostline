import Image from 'next/image';

interface ManifestoProps {
  headline: string;
  text: string;
  imageSrc: string;
}

export function Manifesto({
  headline,
  text,
  imageSrc,
}: ManifestoProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">

      {/* Luz de fundo */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[180px]" />

      <div className="relative grid items-center gap-16 p-8 lg:grid-cols-2 lg:p-16">

        <div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[8px] text-violet-400">
            MANIFESTO
          </p>

          <h2 className="font-display text-5xl font-black uppercase leading-none text-white lg:text-7xl">
            {headline}
          </h2>

          <div className="mt-8 h-[2px] w-24 rounded-full bg-violet-500" />

          <p className="mt-8 max-w-xl text-lg leading-9 text-zinc-300">
            {text}
          </p>

          <div className="mt-10">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[4px] text-violet-300">
              BEYOND THE LIMITS
            </span>
          </div>

        </div>

        <div className="relative">

          <div className="overflow-hidden rounded-3xl border border-white/10">

            <Image
              src={imageSrc}
              alt="Manifesto Ghostline"
              width={900}
              height={1200}
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />

          </div>

        </div>

      </div>

    </section>
  );
}
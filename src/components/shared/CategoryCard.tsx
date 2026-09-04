import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  href?: string;
  imageSrc: string;
  comingSoon?: boolean;
}

/** CategoryCard — usado no grid de categorias da Home. */
export function CategoryCard({
  name,
  href,
  imageSrc,
  comingSoon = false,
}: CategoryCardProps) {
  const content = (
    <>
      <Image
        src={imageSrc}
        alt={name}
        fill
        className={`object-cover transition-transform duration-700 ease-out ${
          comingSoon ? 'opacity-50' : 'group-hover:scale-110'
        }`}
        sizes="(min-width: 768px) 25vw, 50vw"
      />

      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          comingSoon
            ? 'bg-black/60'
            : 'bg-black/35 group-hover:bg-black/55'
        }`}
      />

      {comingSoon && (
        <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
            Em breve
          </span>
        </div>
      )}

      <div className="absolute inset-0 flex items-end p-5">
        <div>
          <p className="font-display text-h4 uppercase tracking-wide2 text-foreground">
            {name}
          </p>

          {comingSoon && (
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">
              Nova categoria
            </p>
          )}
        </div>
      </div>
    </>
  );

  if (comingSoon || !href) {
    return (
      <div
        className="relative block aspect-[3/4] cursor-default overflow-hidden rounded-lg"
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      className="group relative block aspect-[3/4] overflow-hidden rounded-lg"
    >
      {content}
    </a>
  );
}
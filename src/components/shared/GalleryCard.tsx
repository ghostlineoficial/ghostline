import Image from 'next/image';

interface GalleryCardProps {
  imageUrl: string;
  caption?: string;
  aspect?: 'square' | 'portrait' | 'landscape';
}

const aspectStyles = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
};

/** GalleryCard — usado no Ghost Studio (editorial) e Community (posts de usuários). */
export function GalleryCard({ imageUrl, caption, aspect = 'portrait' }: GalleryCardProps) {
  return (
    <figure className="group overflow-hidden rounded-lg">
      <div className={`relative ${aspectStyles[aspect]}`}>
        <Image
          src={imageUrl}
          alt={caption ?? ''}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-body-sm text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

import { cn } from '@/utils/cn';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  align = 'left',
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        align === 'center' && 'text-center',
        'mb-12',
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-5 text-xs font-semibold uppercase tracking-[8px] text-violet-400">
          {eyebrow}
        </p>
      )}

      <h2
        className="
          font-display
          text-4xl
          font-black
          uppercase
          leading-none
          tracking-[3px]
          text-white
          md:text-6xl
        "
      >
        {title}
      </h2>

      <div
        className={cn(
          "mt-6 h-[2px] w-20 rounded-full bg-violet-500",
          align === "center" && "mx-auto",
        )}
      />
    </div>
  );
}
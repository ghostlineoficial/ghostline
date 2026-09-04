import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string; // omitir no último item (página atual)
}

export function Breadcrumb({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 font-mono text-caption uppercase tracking-wide2 text-muted">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="flex items-center gap-2"
          >
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <span
                aria-current="page"
                className="text-foreground"
              >
                {item.label}
              </span>
            )}

            {i < items.length - 1 && (
              <ChevronRight className="h-3 w-3" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
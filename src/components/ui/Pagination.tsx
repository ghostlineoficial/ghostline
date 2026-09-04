'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { IconButton } from './IconButton';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageRange(page: number, totalPages: number): (number | 'ellipsis')[] {
  const range: (number | 'ellipsis')[] = [];
  const window = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      range.push(i);
    } else if (range[range.length - 1] !== 'ellipsis') {
      range.push('ellipsis');
    }
  }
  return range;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = getPageRange(page, totalPages);

  return (
    <nav aria-label="Paginação" className="flex items-center justify-center gap-2">
      <IconButton
        icon={<ChevronLeft className="h-4 w-4" />}
        label="Página anterior"
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      />

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onPageChange(p)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-body-sm transition-colors',
              p === page ? 'bg-primary text-foreground' : 'text-muted hover:text-foreground',
            )}
          >
            {p}
          </button>
        ),
      )}

      <IconButton
        icon={<ChevronRight className="h-4 w-4" />}
        label="Próxima página"
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  );
}

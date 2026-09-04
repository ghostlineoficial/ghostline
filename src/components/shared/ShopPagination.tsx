'use client';

import {
  usePathname,
  useSearchParams,
} from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';

interface ShopPaginationProps {
  page: number;
  totalPages: number;
}

/**
 * ShopPagination — fininho: só liga a `Pagination`
 * (Design System, controlada) à URL (`?page=`).
 */
export function ShopPagination({
  page,
  totalPages,
}: ShopPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handlePageChange(next: number) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set('page', String(next));

    window.history.pushState(
      window.history.state,
      '',
      `${pathname}?${params.toString()}`,
    );
  }

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
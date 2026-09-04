'use client';

import {
  useEffect,
  useState,
} from 'react';
import {
  usePathname,
  useSearchParams,
} from 'next/navigation';
import { SearchInput } from '@/components/ui/SearchInput';

/**
 * ShopSearch — debounce de 400ms antes de escrever na URL.
 * Atualiza o parâmetro ?q= sem recarregar a página.
 */
export function ShopSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get('q') ?? '',
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString(),
      );

      if (value.trim()) {
        params.set('q', value.trim());
      } else {
        params.delete('q');
      }

      params.delete('page');

      const query = params.toString();

      const newUrl = query
        ? `${pathname}?${query}`
        : pathname;

      window.history.replaceState(
        null,
        '',
        newUrl,
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 400);

    return () => clearTimeout(handle);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <SearchInput
      value={value}
      onChange={(e) =>
        setValue(e.target.value)
      }
      onClear={() => setValue('')}
      placeholder="Buscar produtos..."
      aria-label="Buscar produtos"
    />
  );
}
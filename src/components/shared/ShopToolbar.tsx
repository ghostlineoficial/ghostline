'use client';

import { useState } from 'react';
import {
  usePathname,
  useSearchParams,
} from 'next/navigation';
import {
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { IconButton } from '@/components/ui/IconButton';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { ShopFilters } from './ShopFilters';
import {
  SORT_OPTIONS,
  GRID_COLS,
  type SortValue,
  type GridCols,
} from '@/lib/shop-filters';

interface ShopToolbarProps {
  totalCount: number;
  sort: SortValue;
  cols: GridCols;
  availableColors: string[];
  availableSizes: string[];
}

/**
 * ShopToolbar — contagem + ordenação + densidade do grid,
 * e o gatilho do Drawer de filtros no mobile
 * (reaproveita o mesmo `ShopFilters` do painel desktop).
 */
export function ShopToolbar({
  totalCount,
  sort,
  cols,
  availableColors,
  availableSizes,
}: ShopToolbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] =
    useState(false);

  function updateParam(
    key: string,
    value: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set(key, value);
    params.delete('page');

    const query = params.toString();

    window.history.replaceState(
      window.history.state,
      '',
      query
        ? `${pathname}?${query}`
        : pathname,
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <p className="text-body-sm text-muted">
        {totalCount} produto
        {totalCount !== 1 ? 's' : ''}
      </p>

      <div className="flex items-center gap-3">
        <Select
          options={[...SORT_OPTIONS]}
          value={sort}
          onValueChange={(v) =>
            updateParam('ordenar', v)
          }
          placeholder="Ordenar"
        />

        <div className="hidden items-center gap-1 border-l border-border pl-3 md:flex">
          {GRID_COLS.map((n) => (
            <IconButton
              key={n}
              icon={
                <LayoutGrid className="h-4 w-4" />
              }
              label={`Ver em ${n} colunas`}
              variant={
                cols === n
                  ? 'primary'
                  : 'ghost'
              }
              size="sm"
              onClick={() =>
                updateParam(
                  'cols',
                  String(n),
                )
              }
            />
          ))}
        </div>

        <div className="md:hidden">
          <IconButton
            icon={
              <SlidersHorizontal className="h-4 w-4" />
            }
            label="Abrir filtros"
            variant="outline"
            onClick={() =>
              setFiltersOpen(true)
            }
          />
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title="Filtros"
        footer={
          <Button
            className="w-full"
            onClick={() =>
              setFiltersOpen(false)
            }
          >
            Ver resultados
          </Button>
        }
      >
        <ShopFilters
          availableColors={
            availableColors
          }
          availableSizes={
            availableSizes
          }
        />
      </Drawer>
    </div>
  );
}
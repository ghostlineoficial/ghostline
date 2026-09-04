'use client';

import {
  usePathname,
  useSearchParams,
} from 'next/navigation';

import { FilterGroup } from '@/components/ui/FilterGroup';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

import { PRODUCT_SIZES } from '@/types/product';
import {
  mockCollections,
} from '@/lib/mock/catalog';

interface ShopFiltersProps {
  availableColors: string[];
  availableSizes: string[];
}

export function ShopFilters({
  availableSizes,
}: ShopFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function replaceUrl(url: string) {
    window.history.replaceState(
      window.history.state,
      '',
      url,
    );
  }

  function updateParam(
    key: string,
    value: string | null,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete('page');

    const query = params.toString();

    replaceUrl(
      query
        ? `${pathname}?${query}`
        : pathname,
    );
  }

  const selectedSizes = (
    searchParams.get('tamanho') ?? ''
  )
    .split(',')
    .filter(Boolean);

  /*
   * =========================================================
   * CATEGORIAS VISÍVEIS NA LOJA
   * =========================================================
   *
   * Dry Fit e Coleções ainda não estão disponíveis.
   * Elas aparecem apenas como "Em breve".
   *
   * Moletom foi removido.
   */

  const categoryOptions = [
    {
      value: 'all',
      label: 'Todas',
    },
    {
      value: 'oversized',
      label: 'Oversized',
    },
    {
      value: 'casacos',
      label: 'Casacos',
    },
    {
      value: 'dry-fit-coming-soon',
      label: 'Dry Fit — Em breve',
    },
    {
      value: 'colecoes-coming-soon',
      label: 'Coleções — Em breve',
    },
  ];

  /*
   * =========================================================
   * DROPS VISÍVEIS
   * =========================================================
   *
   * Drop 02, Drop 03 e Drop Limited continuam existindo
   * no projeto, mas ficam escondidos do filtro por enquanto.
   */

  const dropOptions = [
    {
      value: 'all',
      label: 'Todos',
    },
    {
      value: 'drop-01',
      label: 'DROP 01',
    },
  ];

  function handleCategoryChange(
    value: string,
  ) {
    /*
     * Dry Fit e Coleções aparecem na lista,
     * mas ainda não podem ser acessadas.
     */
    if (
      value === 'dry-fit-coming-soon' ||
      value === 'colecoes-coming-soon'
    ) {
      return;
    }

    updateParam(
      'categoria',
      value === 'all' ? null : value,
    );
  }

  return (
    <div className="flex flex-col gap-8">

      {/* CATEGORIA */}
      <Select
        label="Categoria"
        placeholder="Todas as categorias"
        options={categoryOptions}
        value={
          searchParams.get('categoria') ??
          'all'
        }
        onValueChange={
          handleCategoryChange
        }
      />

      {/* DROP */}
      <Select
        label="Drop"
        placeholder="Todos os drops"
        options={dropOptions}
        value={
          searchParams.get('drop') ??
          'all'
        }
        onValueChange={(value) =>
          updateParam(
            'drop',
            value === 'all'
              ? null
              : value,
          )
        }
      />

      {/* COLEÇÃO */}
      <Select
        label="Coleção"
        placeholder="Todas as coleções"
        options={[
          {
            value: 'all',
            label: 'Todas',
          },
          ...mockCollections.map(
            (collection) => ({
              value: collection.slug,
              label: collection.name,
            }),
          ),
        ]}
        value={
          searchParams.get('colecao') ??
          'all'
        }
        onValueChange={(value) =>
          updateParam(
            'colecao',
            value === 'all'
              ? null
              : value,
          )
        }
      />

      <Divider />

      {/*
       * =====================================================
       * FILTRO DE COR REMOVIDO
       * =====================================================
       *
       * Não mostramos mais:
       * Preta
       * Branca
       * Cinza
       */}

      {/* TAMANHO */}
      <FilterGroup
        label="Tamanho"
        options={PRODUCT_SIZES.filter(
          (size) =>
            availableSizes.includes(size),
        ).map((size) => ({
          value: size,
          label: size,
        }))}
        selected={selectedSizes}
        onChange={(next) =>
          updateParam(
            'tamanho',
            next.length
              ? next.join(',')
              : null,
          )
        }
      />

      <Divider />

      {/* PREÇO */}
      <div>
        <p className="mb-3 text-caption uppercase text-muted">
          Faixa de preço (R$)
        </p>

        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={0}
            placeholder="Mín."
            defaultValue={
              searchParams.get(
                'precoMin',
              ) ?? ''
            }
            onBlur={(event) =>
              updateParam(
                'precoMin',
                event.target.value ||
                  null,
              )
            }
            className="w-24"
          />

          <span className="text-muted">
            —
          </span>

          <Input
            type="number"
            min={0}
            placeholder="Máx."
            defaultValue={
              searchParams.get(
                'precoMax',
              ) ?? ''
            }
            onBlur={(event) =>
              updateParam(
                'precoMax',
                event.target.value ||
                  null,
              )
            }
            className="w-24"
          />
        </div>
      </div>

      <Divider />

      {/* OUTROS FILTROS */}
      <div className="flex flex-col gap-4">
        <Switch
          label="Somente disponíveis"
          checked={
            searchParams.get(
              'disponivel',
            ) === '1'
          }
          onCheckedChange={(
            checked,
          ) =>
            updateParam(
              'disponivel',
              checked ? '1' : null,
            )
          }
        />

        <Switch
          label="Novidades"
          checked={
            searchParams.get(
              'novo',
            ) === '1'
          }
          onCheckedChange={(
            checked,
          ) =>
            updateParam(
              'novo',
              checked ? '1' : null,
            )
          }
        />

        <Switch
          label="Destaques"
          checked={
            searchParams.get(
              'destaque',
            ) === '1'
          }
          onCheckedChange={(
            checked,
          ) =>
            updateParam(
              'destaque',
              checked ? '1' : null,
            )
          }
        />
      </div>

      {/* LIMPAR FILTROS */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          replaceUrl(pathname)
        }
      >
        Limpar todos os filtros
      </Button>
    </div>
  );
}
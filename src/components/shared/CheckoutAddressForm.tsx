'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CheckoutAddress {
  recipientName: string;
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CheckoutAddressFormProps {
  onContinue: (
    address: CheckoutAddress,
  ) => void;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

const initialAddress: CheckoutAddress = {
  recipientName: '',
  postalCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

export function CheckoutAddressForm({
  onContinue,
}: CheckoutAddressFormProps) {
  const [address, setAddress] =
    useState<CheckoutAddress>(
      initialAddress,
    );

  const [cepLoading, setCepLoading] =
    useState(false);

  const [cepError, setCepError] =
    useState<string | null>(null);

  function updateField(
    field: keyof CheckoutAddress,
    value: string,
  ) {
    setAddress((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function formatCep(value: string) {
    const numbers = value
      .replace(/\D/g, '')
      .slice(0, 8);

    if (numbers.length <= 5) {
      return numbers;
    }

    return `${numbers.slice(
      0,
      5,
    )}-${numbers.slice(5)}`;
  }

  async function searchCep() {
    const cep = address.postalCode.replace(
      /\D/g,
      '',
    );

    if (cep.length !== 8) {
      setCepError(
        'Informe um CEP válido com 8 números.',
      );
      return;
    }

    try {
      setCepLoading(true);
      setCepError(null);

      const response = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`,
      );

      if (!response.ok) {
        throw new Error(
          'Não foi possível consultar o CEP.',
        );
      }

      const data =
        (await response.json()) as ViaCepResponse;

      if (data.erro) {
        setCepError(
          'CEP não encontrado.',
        );
        return;
      }

      setAddress((current) => ({
        ...current,

        postalCode:
          data.cep ??
          current.postalCode,

        street:
          data.logradouro ??
          current.street,

        complement:
          current.complement,

        neighborhood:
          data.bairro ??
          current.neighborhood,

        city:
          data.localidade ??
          current.city,

        state:
          data.uf ??
          current.state,
      }));
    } catch (error) {
      console.error(
        'Erro ao consultar CEP:',
        error,
      );

      setCepError(
        'Não foi possível consultar o CEP. Você pode preencher o endereço manualmente.',
      );
    } finally {
      setCepLoading(false);
    }
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const recipientName =
      address.recipientName.trim();

    const postalCode =
      address.postalCode
        .replace(/\D/g, '')
        .trim();

    const street =
      address.street.trim();

    const number =
      address.number.trim();

    const neighborhood =
      address.neighborhood.trim();

    const city =
      address.city.trim();

    const state =
      address.state
        .trim()
        .toUpperCase();

    if (
      !recipientName ||
      postalCode.length !== 8 ||
      !street ||
      !number ||
      !neighborhood ||
      !city ||
      state.length !== 2
    ) {
      setCepError(
        'Preencha todos os campos obrigatórios do endereço.',
      );
      return;
    }

    setCepError(null);

    onContinue({
      recipientName,
      postalCode,
      street,
      number,
      complement:
        address.complement.trim(),
      neighborhood,
      city,
      state,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <p className="font-medium text-foreground">
            Endereço de entrega
          </p>

          <p className="text-xs text-muted">
            Informe onde você deseja
            receber seu pedido.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="checkout-recipient"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Nome de quem vai receber *
        </label>

        <input
          id="checkout-recipient"
          type="text"
          value={address.recipientName}
          onChange={(event) =>
            updateField(
              'recipientName',
              event.target.value,
            )
          }
          placeholder="Nome completo"
          autoComplete="name"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="checkout-postal-code"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          CEP *
        </label>

        <div className="flex gap-2">
          <input
            id="checkout-postal-code"
            type="text"
            inputMode="numeric"
            value={address.postalCode}
            onChange={(event) => {
              setCepError(null);

              updateField(
                'postalCode',
                formatCep(
                  event.target.value,
                ),
              );
            }}
            onBlur={() => {
              const cep =
                address.postalCode.replace(
                  /\D/g,
                  '',
                );

              if (cep.length === 8) {
                void searchCep();
              }
            }}
            placeholder="00000-000"
            autoComplete="postal-code"
            className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
          />

          <Button
            type="button"
            variant="secondary"
            onClick={searchCep}
            disabled={cepLoading}
          >
            {cepLoading
              ? 'Buscando...'
              : 'Buscar CEP'}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="checkout-street"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Rua / Avenida *
        </label>

        <input
          id="checkout-street"
          type="text"
          value={address.street}
          onChange={(event) =>
            updateField(
              'street',
              event.target.value,
            )
          }
          placeholder="Rua ou avenida"
          autoComplete="address-line1"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="checkout-number"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Número *
          </label>

          <input
            id="checkout-number"
            type="text"
            value={address.number}
            onChange={(event) =>
              updateField(
                'number',
                event.target.value,
              )
            }
            placeholder="123"
            autoComplete="address-line2"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
          />
        </div>

        <div>
          <label
            htmlFor="checkout-complement"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Complemento
          </label>

          <input
            id="checkout-complement"
            type="text"
            value={address.complement}
            onChange={(event) =>
              updateField(
                'complement',
                event.target.value,
              )
            }
            placeholder="Apto, bloco..."
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="checkout-neighborhood"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Bairro *
        </label>

        <input
          id="checkout-neighborhood"
          type="text"
          value={address.neighborhood}
          onChange={(event) =>
            updateField(
              'neighborhood',
              event.target.value,
            )
          }
          placeholder="Bairro"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_100px]">
        <div>
          <label
            htmlFor="checkout-city"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Cidade *
          </label>

          <input
            id="checkout-city"
            type="text"
            value={address.city}
            onChange={(event) =>
              updateField(
                'city',
                event.target.value,
              )
            }
            placeholder="Cidade"
            autoComplete="address-level2"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
          />
        </div>

        <div>
          <label
            htmlFor="checkout-state"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            UF *
          </label>

          <input
            id="checkout-state"
            type="text"
            maxLength={2}
            value={address.state}
            onChange={(event) =>
              updateField(
                'state',
                event.target.value.toUpperCase(),
              )
            }
            placeholder="RJ"
            autoComplete="address-level1"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 uppercase text-foreground outline-none transition placeholder:text-muted focus:border-foreground"
          />
        </div>
      </div>

      {cepError && (
        <div className="mt-4 rounded-xl border border-danger/30 bg-danger/5 p-3">
          <p className="text-sm text-danger">
            {cepError}
          </p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={cepLoading}
      >
        Continuar para pagamento
      </Button>

      <p className="mt-3 text-center text-xs text-muted">
        Confira o endereço antes de
        continuar.
      </p>
    </form>
  );
}
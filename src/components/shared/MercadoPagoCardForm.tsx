'use client';

import { useEffect, useState } from 'react';
import {
  CardPayment,
  initMercadoPago,
} from '@mercadopago/sdk-react';

type MercadoPagoCardFormProps = {
  amount: number;
  onSubmit: (formData: any) => Promise<void>;
};

let mercadoPagoInitialized = false;

export function MercadoPagoCardForm({
  amount,
  onSubmit,
}: MercadoPagoCardFormProps) {
  const [ready, setReady] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    const publicKey =
      process.env
        .NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

    if (!publicKey) {
      setErrorMessage(
        'Chave pública do Mercado Pago não configurada.',
      );
      return;
    }

    try {
      if (!mercadoPagoInitialized) {
        initMercadoPago(publicKey, {
          locale: 'pt-BR',
        });

        mercadoPagoInitialized = true;
      }

      setReady(true);
    } catch (error) {
      console.error(
        'Erro ao inicializar Mercado Pago:',
        error,
      );

      setErrorMessage(
        'Não foi possível carregar o pagamento com cartão.',
      );
    }
  }, []);

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
        <p className="text-sm text-danger">
          {errorMessage}
        </p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm text-muted">
          Carregando pagamento com cartão...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <CardPayment
        initialization={{
          amount,
        }}
        customization={{
          visual: {
            style: {
              theme: 'default',
            },
          },
        }}
        onSubmit={async (formData) => {
          try {
            setErrorMessage(null);

            await onSubmit(formData);
          } catch (error) {
            console.error(
              'Erro ao processar cartão:',
              error,
            );

            setErrorMessage(
              error instanceof Error
                ? error.message
                : 'Não foi possível processar o pagamento.',
            );

            throw error;
          }
        }}
        onReady={() => {
          setErrorMessage(null);
        }}
        onError={(error) => {
          console.error(
            'Erro no formulário do Mercado Pago:',
            error,
          );
        }}
      />
    </div>
  );
}
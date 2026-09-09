import { NextRequest, NextResponse } from 'next/server';
import { WebhookSignatureValidator } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabase/admin';

type MercadoPagoWebhookBody = {
  action?: string;
  type?: string;
  data?: {
    id?: string | number;
  };
};

type MercadoPagoOrder = {
  id?: string | number;
  status?: string;
  external_reference?: string;
  transactions?: {
    payments?: Array<{
      id?: string | number;
      status?: string;
    }>;
  };
};

function mapOrderStatus(
  mercadoPagoStatus?: string,
): string | null {
  switch (mercadoPagoStatus) {
    case 'processed':
      return 'paid';

    case 'cancelled':
    case 'canceled':
      return 'cancelled';

    case 'refunded':
      return 'refunded';

    default:
      return null;
  }
}

function mapPaymentStatus(
  mercadoPagoStatus?: string,
): string {
  switch (mercadoPagoStatus) {
    case 'approved':
    case 'processed':
      return 'approved';

    case 'rejected':
    case 'failed':
    case 'cancelled':
    case 'canceled':
      return 'rejected';

    case 'refunded':
      return 'refunded';

    case 'charged_back':
    case 'chargeback':
      return 'chargeback';

    default:
      return 'pending';
  }
}

export async function POST(
  req: NextRequest,
) {
  try {
    const accessToken =
      process.env.MERCADO_PAGO_ACCESS_TOKEN;

    const webhookSecret =
      process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    if (!accessToken) {
      console.error(
        'MERCADO_PAGO_ACCESS_TOKEN não configurado.',
      );

      return NextResponse.json(
        {
          error:
            'Configuração do Mercado Pago ausente.',
        },
        {
          status: 500,
        },
      );
    }

    if (!webhookSecret) {
      console.error(
        'MERCADO_PAGO_WEBHOOK_SECRET não configurado.',
      );

      return NextResponse.json(
        {
          error:
            'Assinatura do webhook não configurada.',
        },
        {
          status: 500,
        },
      );
    }

    const body =
      (await req.json()) as MercadoPagoWebhookBody;

    const xSignature =
      req.headers.get('x-signature');

    const xRequestId =
      req.headers.get('x-request-id');

    const dataId =
      body.data?.id?.toString() ??
      req.nextUrl.searchParams.get('data.id') ??
      req.nextUrl.searchParams.get('id');

    if (
      !xSignature ||
      !xRequestId ||
      !dataId
    ) {
      console.error(
        'Webhook sem dados necessários para validar assinatura.',
      );

      return NextResponse.json(
        {
          error:
            'Webhook inválido.',
        },
        {
          status: 401,
        },
      );
    }

    try {
      WebhookSignatureValidator.validate({
        xSignature,
        xRequestId,
        dataId,
        secret: webhookSecret,
      });
    } catch (error) {
      console.error(
        'Assinatura inválida no webhook do Mercado Pago:',
        error,
      );

      return NextResponse.json(
        {
          error:
            'Assinatura inválida.',
        },
        {
          status: 401,
        },
      );
    }

    if (
      body.type !== 'order' &&
      !body.action?.startsWith('order.')
    ) {
      return NextResponse.json({
        received: true,
        ignored: true,
      });
    }

    const mercadoPagoResponse =
      await fetch(
        `https://api.mercadopago.com/v1/orders/${encodeURIComponent(
          dataId,
        )}`,
        {
          method: 'GET',
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        },
      );

    if (!mercadoPagoResponse.ok) {
      const errorText =
        await mercadoPagoResponse.text();

      console.error(
        'Erro ao consultar Order no Mercado Pago:',
        mercadoPagoResponse.status,
        errorText,
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível consultar o pedido.',
        },
        {
          status: 502,
        },
      );
    }

    const mercadoPagoOrder =
      (await mercadoPagoResponse.json()) as MercadoPagoOrder;

    const internalOrderId =
      mercadoPagoOrder.external_reference;

    if (!internalOrderId) {
      console.error(
        'Order do Mercado Pago sem external_reference.',
      );

      return NextResponse.json(
        {
          error:
            'Pedido sem referência interna.',
        },
        {
          status: 422,
        },
      );
    }

    const mercadoPagoPayment =
      mercadoPagoOrder.transactions
        ?.payments?.[0];

    const paymentStatus =
      mapPaymentStatus(
        mercadoPagoPayment?.status ??
          mercadoPagoOrder.status,
      );

    const orderStatus =
      mapOrderStatus(
        mercadoPagoOrder.status,
      );

    const paymentUpdate: {
      status: string;
      provider_payload: MercadoPagoOrder;
      provider_payment_id?: string;
    } = {
      status: paymentStatus,
      provider_payload: mercadoPagoOrder,
    };

    if (mercadoPagoPayment?.id) {
      paymentUpdate.provider_payment_id =
        mercadoPagoPayment.id.toString();
    }

    const {
      error: paymentUpdateError,
    } = await supabaseAdmin
      .from('payments')
      .update(paymentUpdate)
      .eq('order_id', internalOrderId);

    if (paymentUpdateError) {
      console.error(
        'Erro ao atualizar pagamento no Supabase:',
        paymentUpdateError,
      );

      return NextResponse.json(
        {
          error:
            'Erro ao atualizar pagamento.',
        },
        {
          status: 500,
        },
      );
    }

    if (orderStatus) {
      const {
        error: orderUpdateError,
      } = await supabaseAdmin
        .from('orders')
        .update({
          status: orderStatus,
        })
        .eq('id', internalOrderId);

      if (orderUpdateError) {
        console.error(
          'Erro ao atualizar pedido no Supabase:',
          orderUpdateError,
        );

        return NextResponse.json(
          {
            error:
              'Erro ao atualizar pedido.',
          },
          {
            status: 500,
          },
        );
      }
    }

    console.log(
      'Webhook Mercado Pago processado:',
      {
        mercadoPagoOrderId:
          mercadoPagoOrder.id,
        internalOrderId,
        mercadoPagoStatus:
          mercadoPagoOrder.status,
        paymentStatus,
        orderStatus,
      },
    );

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      'Erro no webhook do Mercado Pago:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Erro ao processar webhook.',
      },
      {
        status: 500,
      },
    );
  }
}
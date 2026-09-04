import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const accessToken =
      process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            'MERCADO_PAGO_ACCESS_TOKEN não configurado.',
        },
        {
          status: 500,
        },
      );
    }

    // =========================
    // USUÁRIO AUTENTICADO
    // =========================

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            'Você precisa estar logado para finalizar a compra.',
        },
        {
          status: 401,
        },
      );
    }

    // =========================
    // PROFILE
    // =========================

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        'Erro ao localizar profile:',
        profileError,
      );

      return NextResponse.json(
        {
          error:
            'Perfil do cliente não encontrado.',
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // DADOS RECEBIDOS
    // =========================

    const body = await req.json();

    const price = Number(body.price);

    const payerEmail = String(
      body.email ?? user.email ?? '',
    ).trim();

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          error:
            'Valor do pagamento inválido.',
        },
        {
          status: 400,
        },
      );
    }

    if (!payerEmail) {
      return NextResponse.json(
        {
          error:
            'E-mail do comprador é obrigatório para o Pix.',
        },
        {
          status: 400,
        },
      );
    }

    const totalCents =
      Math.round(price * 100);

    const orderNumber =
      `GHOST-${Date.now()}`;

    // =========================
    // CRIA PEDIDO NO SUPABASE
    // =========================

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from('orders')
      .insert({
        order_number:
          orderNumber,

        profile_id:
          profile.id,

        status:
          'pending_payment',

        subtotal_cents:
          totalCents,

        discount_cents:
          0,

        shipping_cents:
          0,

        total_cents:
          totalCents,
      })
      .select('id, order_number')
      .single();

    if (orderError || !order) {
      console.error(
        'Erro ao criar pedido:',
        orderError,
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível registrar o pedido.',
        },
        {
          status: 500,
        },
      );
    }

    // =========================
    // MERCADO PAGO
    // =========================

    const externalReference =
      order.id;

    const mercadoPagoResponse =
      await fetch(
        'https://api.mercadopago.com/v1/orders',
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${accessToken}`,

            Accept:
              'application/json',

            'Content-Type':
              'application/json',

            'X-Idempotency-Key':
              randomUUID(),
          },

          body: JSON.stringify({
            type: 'online',

            total_amount:
              price.toFixed(2),

            external_reference:
              externalReference,

            processing_mode:
              'automatic',

            transactions: {
              payments: [
                {
                  amount:
                    price.toFixed(2),

                  payment_method: {
                    id: 'pix',

                    type:
                      'bank_transfer',
                  },
                },
              ],
            },

            payer: {
              email:
                payerEmail,

              first_name:
                payerEmail.endsWith(
                  '@testuser.com',
                )
                  ? 'APRO'
                  : undefined,
            },
          }),
        },
      );

    const responseText =
      await mercadoPagoResponse.text();

    let data: any = {};

    try {
      data = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      data = {
        rawResponse:
          responseText,
      };
    }

    // =========================
    // ERRO MERCADO PAGO
    // =========================

    if (!mercadoPagoResponse.ok) {
      console.error(
        'Mercado Pago:',
        JSON.stringify(
          {
            status:
              mercadoPagoResponse.status,

            statusText:
              mercadoPagoResponse.statusText,

            data,
          },
          null,
          2,
        ),
      );

      return NextResponse.json(
        {
          error:
            'Erro ao criar pagamento Pix.',

          mercadoPagoStatus:
            mercadoPagoResponse.status,

          details:
            data,
        },
        {
          status:
            mercadoPagoResponse.status,
        },
      );
    }

    const payment =
      data.transactions
        ?.payments?.[0];

    // =========================
    // REGISTRA PAGAMENTO
    // =========================

    const providerPaymentId =
      payment?.id
        ? String(payment.id)
        : data.id
          ? String(data.id)
          : null;

    const {
      error: paymentError,
    } = await supabase
      .from('payments')
      .insert({
        order_id:
          order.id,

        method:
          'pix',

        status:
          'pending',

        installments:
          1,

        amount_cents:
          totalCents,

        provider:
          'mercado_pago',

        provider_payment_id:
          providerPaymentId,

        provider_payload:
          data,
      });

    if (paymentError) {
      console.error(
        'Erro ao registrar pagamento:',
        paymentError,
      );
    }

    // =========================
    // RESPOSTA PARA O SITE
    // =========================

    return NextResponse.json({
      internalOrderId:
        order.id,

      orderNumber:
        order.order_number,

      mercadoPagoOrderId:
        data.id ?? null,

      status:
        payment?.status ??
        data.status ??
        null,

      statusDetail:
        payment?.status_detail ??
        data.status_detail ??
        null,

      qrCode:
        payment?.payment_method
          ?.qr_code ?? null,

      qrCodeBase64:
        payment?.payment_method
          ?.qr_code_base64 ?? null,

      ticketUrl:
        payment?.payment_method
          ?.ticket_url ?? null,

      externalReference,
    });
  } catch (error) {
    console.error(
      'Erro ao criar Pix:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Erro interno ao criar pagamento Pix.',
      },
      {
        status: 500,
      },
    );
  }
}
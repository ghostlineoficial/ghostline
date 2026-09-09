import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import {
  mockProducts,
  oversizedProducts,
} from '@/lib/mock/catalog';

type PaymentMethod = 'pix' | 'card';

type CardData = {
  token?: string;
  paymentMethodId?: string;
  paymentTypeId?: string;
  installments?: number;
  email?: string;
  identificationType?: string;
  identificationNumber?: string;
};

type ShippingAddressData = {
  recipientName?: string;
  postalCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
};

function mapInitialPaymentStatus(
  status?: string,
): string {
  switch (status) {
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

    const productId = String(
      body.productId ?? '',
    ).trim();

    const variantId = String(
      body.variantId ?? '',
    ).trim();

    const quantity = Number(
      body.quantity,
    );

    const paymentMethod =
      String(
        body.paymentMethod ?? 'pix',
      ).trim() as PaymentMethod;

    const card =
      (body.card ?? {}) as CardData;

    const shippingAddress =
      (body.shippingAddress ??
        {}) as ShippingAddressData;

    const payerEmail = String(
      card.email ??
        body.email ??
        user.email ??
        '',
    ).trim();

    // =========================
    // VALIDAÇÃO PRODUTO
    // =========================

    if (!productId) {
      return NextResponse.json(
        {
          error:
            'Produto não informado.',
        },
        {
          status: 400,
        },
      );
    }

    if (!variantId) {
      return NextResponse.json(
        {
          error:
            'Variação do produto não informada.',
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        {
          error:
            'Quantidade inválida.',
        },
        {
          status: 400,
        },
      );
    }

    if (
      paymentMethod !== 'pix' &&
      paymentMethod !== 'card'
    ) {
      return NextResponse.json(
        {
          error:
            'Forma de pagamento inválida.',
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
            'E-mail do comprador é obrigatório.',
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // ENDEREÇO DE ENTREGA
    // =========================

    const recipientName = String(
      shippingAddress.recipientName ?? '',
    ).trim();

    const postalCode = String(
      shippingAddress.postalCode ?? '',
    )
      .replace(/\D/g, '')
      .trim();

    const street = String(
      shippingAddress.street ?? '',
    ).trim();

    const addressNumber = String(
      shippingAddress.number ?? '',
    ).trim();

    const complement = String(
      shippingAddress.complement ?? '',
    ).trim();

    const neighborhood = String(
      shippingAddress.neighborhood ?? '',
    ).trim();

    const city = String(
      shippingAddress.city ?? '',
    ).trim();

    const state = String(
      shippingAddress.state ?? '',
    )
      .trim()
      .toUpperCase();

    if (!recipientName) {
      return NextResponse.json(
        {
          error:
            'Nome do destinatário é obrigatório.',
        },
        {
          status: 400,
        },
      );
    }

    if (postalCode.length !== 8) {
      return NextResponse.json(
        {
          error:
            'CEP de entrega inválido.',
        },
        {
          status: 400,
        },
      );
    }

    if (
      !street ||
      !addressNumber ||
      !neighborhood ||
      !city ||
      state.length !== 2
    ) {
      return NextResponse.json(
        {
          error:
            'Endereço de entrega incompleto.',
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // VALIDAÇÃO DO CARTÃO
    // =========================

    if (paymentMethod === 'card') {
      if (
        !card.token ||
        !card.paymentMethodId
      ) {
        return NextResponse.json(
          {
            error:
              'Dados do cartão incompletos.',
          },
          {
            status: 400,
          },
        );
      }

      if (
        !Number.isInteger(
          Number(card.installments),
        ) ||
        Number(card.installments) < 1
      ) {
        return NextResponse.json(
          {
            error:
              'Número de parcelas inválido.',
          },
          {
            status: 400,
          },
        );
      }

      if (
        card.paymentTypeId &&
        card.paymentTypeId !==
          'credit_card' &&
        card.paymentTypeId !==
          'debit_card'
      ) {
        return NextResponse.json(
          {
            error:
              'Tipo de cartão inválido.',
          },
          {
            status: 400,
          },
        );
      }
    }

    // =========================
    // CATÁLOGO OFICIAL
    // =========================

    const catalog = [
      ...mockProducts,
      ...oversizedProducts,
    ];

    const product =
      catalog.find(
        (item) =>
          item.id === productId,
      );

    if (!product || !product.active) {
      return NextResponse.json(
        {
          error:
            'Produto não encontrado ou indisponível.',
        },
        {
          status: 400,
        },
      );
    }

    const variant =
      product.variants.find(
        (item) =>
          item.id === variantId,
      );

    if (!variant) {
      return NextResponse.json(
        {
          error:
            'Variação do produto inválida.',
        },
        {
          status: 400,
        },
      );
    }

    if (variant.stock < quantity) {
      return NextResponse.json(
        {
          error:
            'Quantidade solicitada indisponível em estoque.',
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // PREÇO DEFINIDO NO SERVIDOR
    // =========================

    const unitPriceCents =
      product.priceCents;

    const totalCents =
      unitPriceCents * quantity;

    const price =
      totalCents / 100;

    const orderNumber =
      `GHOST-${Date.now()}`;

    // =========================
    // SALVA ENDEREÇO
    // =========================

    const {
      data: savedAddress,
      error: addressError,
    } = await supabase
      .from('addresses')
      .insert({
        profile_id:
          profile.id,

        label:
          'Entrega',

        recipient_name:
          recipientName,

        street,

        number:
          addressNumber,

        complement:
          complement || null,

        neighborhood,

        city,

        state,

        postal_code:
          postalCode,

        country:
          'BR',

        is_default:
          false,
      })
      .select('id')
      .single();

    if (
      addressError ||
      !savedAddress
    ) {
      console.error(
        'Erro ao salvar endereço:',
        addressError,
      );

      return NextResponse.json(
        {
          error:
            'Não foi possível salvar o endereço de entrega.',
        },
        {
          status: 500,
        },
      );
    }

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

        shipping_address_id:
          savedAddress.id,

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
      .select(
        'id, order_number',
      )
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
    // PAYMENT METHOD
    // =========================

    const mercadoPagoPaymentMethod =
      paymentMethod === 'pix'
        ? {
            id: 'pix',
            type: 'bank_transfer',
          }
        : {
            id:
              card.paymentMethodId!,

            type:
              card.paymentTypeId ===
              'debit_card'
                ? 'debit_card'
                : 'credit_card',

            token:
              card.token!,

            installments:
              Number(
                card.installments,
              ),
          };

    // =========================
    // PAYER
    // =========================

    const payer: {
      email: string;
      first_name?: string;
      identification?: {
        type: string;
        number: string;
      };
    } = {
      email:
        payerEmail,
    };

    if (
      payerEmail.endsWith(
        '@testuser.com',
      )
    ) {
      payer.first_name =
        'APRO';
    }

    if (
      card.identificationType &&
      card.identificationNumber
    ) {
      payer.identification = {
        type:
          card.identificationType,

        number:
          card.identificationNumber,
      };
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

                  payment_method:
                    mercadoPagoPaymentMethod,
                },
              ],
            },

            payer,
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
            paymentMethod === 'pix'
              ? 'Erro ao criar pagamento Pix.'
              : 'Erro ao processar pagamento com cartão.',

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
    // STATUS INICIAL
    // =========================

    const providerStatus =
      payment?.status ??
      data.status ??
      null;

    const initialPaymentStatus =
      mapInitialPaymentStatus(
        providerStatus,
      );

    // =========================
    // REGISTRA PAGAMENTO
    // =========================

    const providerPaymentId =
      payment?.id
        ? String(payment.id)
        : data.id
          ? String(data.id)
          : null;

    const installments =
      paymentMethod === 'card'
        ? Number(
            card.installments,
          )
        : 1;

    const {
      error: paymentError,
    } = await supabase
      .from('payments')
      .insert({
        order_id:
          order.id,

        method:
          paymentMethod === 'pix'
            ? 'pix'
            : 'card',

        status:
          initialPaymentStatus,

        installments,

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
    // CARTÃO APROVADO
    // =========================

    if (
      paymentMethod === 'card' &&
      (
        providerStatus ===
          'approved' ||
        providerStatus ===
          'processed' ||
        data.status ===
          'processed'
      )
    ) {
      const {
        error: paidOrderError,
      } = await supabase
        .from('orders')
        .update({
          status: 'paid',
        })
        .eq(
          'id',
          order.id,
        );

      if (paidOrderError) {
        console.error(
          'Erro ao marcar pedido como pago:',
          paidOrderError,
        );
      }
    }

    // =========================
    // RESPOSTA
    // =========================

    return NextResponse.json({
      paymentMethod,

      internalOrderId:
        order.id,

      orderNumber:
        order.order_number,

      shippingAddressId:
        savedAddress.id,

      mercadoPagoOrderId:
        data.id ?? null,

      status:
        providerStatus,

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
      'Erro ao criar pagamento:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Erro interno ao criar pagamento.',
      },
      {
        status: 500,
      },
    );
  }
}
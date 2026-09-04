import { createClient } from '@/lib/supabase/server';

export interface CreateOrderData {
  orderNumber?: string;
  profileId?: string | null;
  shippingAddressId?: string | null;
  status?: string;
  subtotalCents?: number;
  discountCents?: number;
  shippingCents?: number;
  totalCents?: number;
}

export async function createOrder(
  data: CreateOrderData,
) {
  const supabase = await createClient();

  const subtotalCents =
    data.subtotalCents ?? 0;

  const discountCents =
    data.discountCents ?? 0;

  const shippingCents =
    data.shippingCents ?? 0;

  const totalCents =
    data.totalCents ??
    subtotalCents -
      discountCents +
      shippingCents;

  const orderNumber =
    data.orderNumber ??
    `GHOST-${Date.now()}`;

  const { data: order, error } =
    await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        profile_id:
          data.profileId ?? null,
        shipping_address_id:
          data.shippingAddressId ?? null,
        status:
          data.status ??
          'pending_payment',
        subtotal_cents:
          subtotalCents,
        discount_cents:
          discountCents,
        shipping_cents:
          shippingCents,
        total_cents:
          totalCents,
      })
      .select()
      .single();

  if (error) {
    console.error(
      'Erro ao salvar pedido:',
      error,
    );

    throw error;
  }

  return order;
}
-- ============================================================
-- 0004: COMÉRCIO
-- ============================================================

-- ---------- Carrinho ----------
-- Um carrinho ativo por usuário. cart_items separado de cart
-- (em vez de um array/jsonb) pra permitir FK real pra variant,
-- constraints de quantidade, e updates parciais sem reescrever
-- o carrinho inteiro.

create table carts (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null unique references profiles(id) on delete cascade,
  updated_at    timestamptz not null default now()
);

create table cart_items (
  id            uuid primary key default gen_random_uuid(),
  cart_id       uuid not null references carts(id) on delete cascade,
  variant_id    uuid not null references product_variants(id) on delete cascade,
  quantity      integer not null check (quantity > 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (cart_id, variant_id)
);

create index idx_cart_items_cart on cart_items (cart_id);

-- ---------- Cupons ----------
-- Definido antes de orders porque orders referencia coupon_id.

create table coupons (
  id                uuid primary key default gen_random_uuid(),
  code              text not null unique,
  type              coupon_type not null,
  value             numeric(10,2) not null,   -- percentual (0-100) ou centavos, conforme `type`
  usage_limit       integer,                    -- null = ilimitado
  usage_count       integer not null default 0,
  expires_at        timestamptz,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),

  constraint coupon_value_valid check (value >= 0)
);

create index idx_coupons_code on coupons (code) where active = true;

-- ---------- Pedidos ----------
create table orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text not null unique,      -- ex: "GH-2026-00001", gerado na aplicação/trigger
  profile_id        uuid not null references profiles(id) on delete restrict,
  shipping_address_id uuid references addresses(id) on delete set null,
  status            order_status not null default 'pending_payment',
  coupon_id         uuid references coupons(id) on delete set null,
  subtotal_cents    integer not null check (subtotal_cents >= 0),
  discount_cents    integer not null default 0 check (discount_cents >= 0),
  shipping_cents    integer not null default 0 check (shipping_cents >= 0),
  total_cents       integer not null check (total_cents >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- profile_id usa ON DELETE RESTRICT: nunca apagar histórico de pedidos
-- junto com o usuário. Se a conta for removida, o processo de
-- anonimização deve ser explícito, não um cascade acidental.

create index idx_orders_profile on orders (profile_id, created_at desc);
create index idx_orders_status on orders (status);
create index idx_orders_number on orders (order_number);

-- ---------- Itens do pedido ----------
-- Preço é copiado no momento da compra (price_cents_at_purchase),
-- nunca lido de products em tempo real — produto pode mudar de
-- preço depois, o pedido não pode.

create table order_items (
  id                      uuid primary key default gen_random_uuid(),
  order_id                uuid not null references orders(id) on delete cascade,
  variant_id              uuid not null references product_variants(id) on delete restrict,
  quantity                integer not null check (quantity > 0),
  price_cents_at_purchase integer not null check (price_cents_at_purchase >= 0),
  subtotal_cents          integer not null check (subtotal_cents >= 0)
);

create index idx_order_items_order on order_items (order_id);
create index idx_order_items_variant on order_items (variant_id);

-- ---------- Pagamentos ----------
-- 1 pedido pode ter mais de uma tentativa de pagamento (ex: PIX
-- expirado, tenta cartão em seguida) — por isso é tabela própria
-- e não colunas dentro de orders.

create table payments (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references orders(id) on delete cascade,
  method            payment_method not null,
  status            payment_status not null default 'pending',
  installments      integer not null default 1 check (installments between 1 and 12),
  amount_cents      integer not null check (amount_cents >= 0),
  provider           text not null default 'mercado_pago',
  provider_payment_id text,                     -- id retornado pelo Mercado Pago
  provider_payload    jsonb,                     -- resposta bruta, útil pra auditoria/debug
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_payments_order on payments (order_id);
create index idx_payments_provider_id on payments (provider_payment_id);
create index idx_payments_status on payments (status);

-- ---------- Webhook log (Mercado Pago) ----------
-- Guardar todo evento recebido, mesmo duplicado — dedupe é feito
-- por provider_event_id. Essencial pra reprocessar em caso de bug
-- de webhook sem depender só do estado atual do provider.

create table payment_webhook_events (
  id                  uuid primary key default gen_random_uuid(),
  provider            text not null default 'mercado_pago',
  provider_event_id   text not null,
  payment_id          uuid references payments(id) on delete set null,
  payload             jsonb not null,
  processed_at        timestamptz,
  created_at          timestamptz not null default now(),

  unique (provider, provider_event_id)
);

-- ---------- triggers ----------
create trigger trg_carts_updated_at before update on carts for each row execute function set_updated_at();
create trigger trg_cart_items_updated_at before update on cart_items for each row execute function set_updated_at();
create trigger trg_orders_updated_at before update on orders for each row execute function set_updated_at();
create trigger trg_payments_updated_at before update on payments for each row execute function set_updated_at();

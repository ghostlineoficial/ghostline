-- ============================================================
-- 0001: EXTENSÕES E ENUMS
-- ============================================================
-- Base pra todo o resto do schema. Enums em vez de texto livre
-- pra status: menos espaço em disco, validação no banco (não só
-- na aplicação), e queries de filtro mais rápidas por não
-- depender de comparação de string.

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- busca fuzzy (nome de produto, username)
create extension if not exists "unaccent";       -- busca ignorando acento

-- ---------- Papéis de administração ----------
create type admin_role as enum ('admin', 'editor', 'moderator');

-- ---------- Status genéricos ----------
create type content_status as enum ('draft', 'published', 'archived');
create type drop_status as enum ('upcoming', 'live', 'ended');
create type moderation_status as enum ('pending', 'approved', 'rejected');

-- ---------- Comércio ----------
create type order_status as enum (
  'pending_payment',
  'paid',
  'in_production',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);
create type payment_status as enum ('pending', 'approved', 'rejected', 'refunded', 'chargeback');
create type payment_method as enum ('pix', 'credit_card', 'debit_card', 'boleto');
create type coupon_type as enum ('percentage', 'fixed_amount', 'free_shipping');

-- ---------- Ghost Studio ----------
create type studio_project_status as enum ('draft', 'submitted', 'in_production', 'completed', 'cancelled');

-- ---------- Ghost Society ----------
create type membership_plan as enum ('free', 'silver', 'gold', 'black');
create type membership_status as enum ('active', 'past_due', 'cancelled', 'expired');

-- ---------- Notificações ----------
create type notification_type as enum (
  'order_update', 'drop_alert', 'community', 'system', 'promotion'
);

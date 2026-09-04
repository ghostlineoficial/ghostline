-- ============================================================
-- 0002: PERFIS E ENDEREÇOS
-- ============================================================
-- profiles estende auth.users (gerenciado pelo Supabase Auth).
-- Nunca duplicamos email/senha aqui — isso já vive em auth.users.
-- 1:1 com auth.users via user_id, mas a PK própria (id) permite
-- trocar essa relação no futuro sem quebrar FKs de outras tabelas
-- que apontam pra profiles.

create table profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references auth.users(id) on delete cascade,
  username        text not null unique,
  first_name      text,
  last_name       text,
  bio             text,
  avatar_url      text,
  instagram       text,
  tiktok          text,
  youtube         text,
  country         text,
  city            text,
  phone           text,
  birth_date      date,
  ghost_rank      integer not null default 0,        -- pontuação de gamificação/engajamento
  is_premium      boolean not null default false,      -- flag rápida, evita join com memberships na maioria das leituras
  premium_expires_at timestamptz,
  admin_role      admin_role,                          -- null = usuário comum
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint username_format check (username ~ '^[a-z0-9_.]{3,30}$')
);

create index idx_profiles_username_trgm on profiles using gin (username gin_trgm_ops);
create index idx_profiles_admin_role on profiles (admin_role) where admin_role is not null;

comment on table profiles is 'Extensão de auth.users. admin_role null = usuário comum; separação de privilégio vive aqui, não numa tabela paralela, pra evitar joins extras em toda checagem de permissão.';

-- ---------- Endereços ----------
-- Um usuário pode ter vários endereços; um é o padrão de envio.

create table addresses (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  label         text,                 -- "Casa", "Trabalho"
  recipient_name text not null,
  street        text not null,
  number        text not null,
  complement    text,
  neighborhood  text not null,
  city          text not null,
  state         text not null,
  postal_code   text not null,
  country       text not null default 'BR',
  is_default    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_addresses_profile on addresses (profile_id);

-- Garante um único endereço padrão por usuário
create unique index idx_addresses_one_default_per_profile
  on addresses (profile_id)
  where is_default = true;

-- ---------- updated_at automático ----------
-- Função reaproveitada por praticamente toda tabela do schema.

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger trg_addresses_updated_at
  before update on addresses
  for each row execute function set_updated_at();

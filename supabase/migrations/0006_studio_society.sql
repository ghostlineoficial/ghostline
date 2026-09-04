-- ============================================================
-- 0006: GHOST STUDIO E GHOST SOCIETY
-- ============================================================

-- ---------- Uploads ----------
-- Tabela genérica de arquivo enviado pelo usuário — referenciada
-- por studio_projects (arte enviada) e potencialmente outras
-- features futuras (avatar, review images), sem duplicar lógica
-- de storage em cada uma.

create table uploads (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  url           text not null,
  file_type     text not null,        -- mime type
  size_bytes    integer,
  created_at    timestamptz not null default now()
);

create index idx_uploads_profile on uploads (profile_id, created_at desc);

-- ---------- Ghost Studio ----------
-- Projeto de customização: usuário monta a própria peça (cor,
-- arte, texto, posicionamento) antes de comprar.

create table studio_projects (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  product_id      uuid not null references products(id) on delete restrict,
  color           text,
  art_upload_id   uuid references uploads(id) on delete set null,
  custom_text     text,
  font            text,
  placement_front boolean not null default false,
  placement_back  boolean not null default false,
  placement_sleeve boolean not null default false,
  model_3d_url    text,               -- render gerado a partir da configuração
  status          studio_project_status not null default 'draft',
  price_cents     integer check (price_cents >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_studio_projects_profile on studio_projects (profile_id, created_at desc);
create index idx_studio_projects_status on studio_projects (status);

-- ---------- Ghost Society: Membership ----------
create table memberships (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null unique references profiles(id) on delete cascade,
  plan              membership_plan not null default 'free',
  status            membership_status not null default 'active',
  started_at        timestamptz not null default now(),
  expires_at        timestamptz,
  cancelled_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_memberships_status on memberships (status);
create index idx_memberships_expires on memberships (expires_at) where status = 'active';

comment on table memberships is 'Fonte de verdade do plano. profiles.is_premium/premium_expires_at é uma cópia rápida sincronizada por trigger, pra evitar join em toda checagem de acesso a conteúdo.';

-- Sincroniza o flag rápido em profiles sempre que a membership muda
create or replace function sync_profile_premium_flag()
returns trigger as $$
begin
  update profiles
  set is_premium = (new.status = 'active' and new.plan <> 'free'),
      premium_expires_at = new.expires_at
  where id = new.profile_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_membership_sync_profile
  after insert or update on memberships
  for each row execute function sync_profile_premium_flag();

-- ---------- Benefícios por plano ----------
-- Tabela separada em vez de coluna jsonb em memberships: permite
-- listar/filtrar benefícios e reaproveitar entre planos sem
-- duplicar texto.

create table membership_benefits (
  id            uuid primary key default gen_random_uuid(),
  plan          membership_plan not null,
  title         text not null,
  description   text,
  position      integer not null default 0
);

create index idx_membership_benefits_plan on membership_benefits (plan);

-- ---------- Conteúdo premium ----------
create table premium_content (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  content_type  text not null check (content_type in ('course', 'wallpaper', 'making_of', 'download', 'video')),
  category      text,
  file_url      text,
  video_url     text,
  min_plan      membership_plan not null default 'silver',  -- plano mínimo necessário pra acessar
  status        content_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_premium_content_slug on premium_content (slug);
create index idx_premium_content_type on premium_content (content_type);
create index idx_premium_content_status on premium_content (status);

-- ---------- triggers ----------
create trigger trg_studio_projects_updated_at before update on studio_projects for each row execute function set_updated_at();
create trigger trg_memberships_updated_at before update on memberships for each row execute function set_updated_at();
create trigger trg_premium_content_updated_at before update on premium_content for each row execute function set_updated_at();

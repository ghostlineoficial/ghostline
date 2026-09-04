-- ============================================================
-- 0007: SISTEMA
-- ============================================================

-- ---------- Notificações ----------
create table notifications (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  type          notification_type not null,
  title         text not null,
  message       text not null,
  link_url      text,
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index idx_notifications_profile_unread on notifications (profile_id, created_at desc) where read_at is null;
create index idx_notifications_profile on notifications (profile_id, created_at desc);

-- ---------- Configurações ----------
-- Chave-valor tipado em jsonb: configurações da plataforma mudam
-- de formato com frequência (ex: adicionar um novo campo de frete)
-- e não vale a pena migration pra cada uma. Uma única linha por
-- chave, nunca uma tabela gigante de settings soltas.

create table settings (
  key           text primary key,
  value         jsonb not null,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references profiles(id) on delete set null
);

create trigger trg_settings_updated_at before update on settings for each row execute function set_updated_at();

-- ---------- Logs de auditoria ----------
-- Toda ação administrativa relevante (mudança de pedido, criação/
-- edição de produto, moderação de conteúdo, mudança de permissão)
-- passa por aqui. Nunca editável nem removível pela aplicação —
-- ver policy em 0008 (somente INSERT permitido, nunca UPDATE/DELETE).

create table audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_id      uuid references profiles(id) on delete set null,
  action        text not null,          -- ex: "order.status_changed", "product.updated"
  target_type   text not null,          -- ex: "order", "product", "profile"
  target_id     uuid,
  metadata      jsonb,                  -- diff antes/depois, contexto adicional
  created_at    timestamptz not null default now()
);

create index idx_audit_logs_actor on audit_logs (actor_id, created_at desc);
create index idx_audit_logs_target on audit_logs (target_type, target_id);
create index idx_audit_logs_created on audit_logs (created_at desc);

comment on table audit_logs is 'Somente-inserção. Em escala, particionar por mês (created_at) — ver DATABASE.md, seção Performance.';

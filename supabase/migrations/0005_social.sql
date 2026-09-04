-- ============================================================
-- 0005: SOCIAL
-- ============================================================

-- ---------- Favoritos (Wishlist) ----------
create table wishlist_items (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  product_id    uuid not null references products(id) on delete cascade,
  created_at    timestamptz not null default now(),

  unique (profile_id, product_id)
);

create index idx_wishlist_profile on wishlist_items (profile_id);

-- ---------- Comentários (em produtos) ----------
create table comments (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  product_id    uuid not null references products(id) on delete cascade,
  parent_id     uuid references comments(id) on delete cascade,  -- respostas
  content       text not null,
  likes_count   integer not null default 0,       -- contador desnormalizado, mantido por trigger em likes
  status        moderation_status not null default 'approved',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_comments_product on comments (product_id, created_at desc);
create index idx_comments_parent on comments (parent_id);
create index idx_comments_status on comments (status);

-- ---------- Avaliações ----------
-- Separado de comments: review é 1 por (usuário, produto), tem
-- nota obrigatória e só pode ser feita por quem comprou (regra
-- aplicada na policy de INSERT, ver 0008).

create table reviews (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  product_id    uuid not null references products(id) on delete cascade,
  order_item_id uuid references order_items(id) on delete set null,  -- prova de compra
  rating        smallint not null check (rating between 1 and 5),
  comment       text,
  status        moderation_status not null default 'approved',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (profile_id, product_id)
);

create table review_images (
  id            uuid primary key default gen_random_uuid(),
  review_id     uuid not null references reviews(id) on delete cascade,
  url           text not null,
  position      integer not null default 0
);

create index idx_reviews_product on reviews (product_id);
create index idx_reviews_status on reviews (status);
create index idx_review_images_review on review_images (review_id);

-- ---------- Posts da comunidade ----------
create table community_posts (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  content         text,
  image_url       text,
  likes_count     integer not null default 0,
  comments_count  integer not null default 0,
  shares_count    integer not null default 0,
  status          moderation_status not null default 'approved',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_community_posts_profile on community_posts (profile_id, created_at desc);
create index idx_community_posts_created on community_posts (created_at desc);
create index idx_community_posts_status on community_posts (status);

create table community_post_comments (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references community_posts(id) on delete cascade,
  profile_id    uuid not null references profiles(id) on delete cascade,
  content       text not null,
  created_at    timestamptz not null default now()
);

create index idx_post_comments_post on community_post_comments (post_id, created_at);

-- ---------- Curtidas ----------
-- Tabela polimórfica única em vez de likes_comments/likes_posts/
-- likes_gallery separadas: mesma estrutura pra tudo que pode ser
-- curtido, um índice único garante 1 curtida por usuário por alvo.

create table likes (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  target_type     text not null check (target_type in ('comment', 'community_post', 'gallery_item', 'review')),
  target_id       uuid not null,
  created_at      timestamptz not null default now(),

  unique (profile_id, target_type, target_id)
);

create index idx_likes_target on likes (target_type, target_id);

-- ---------- Seguidores ----------
create table followers (
  follower_id     uuid not null references profiles(id) on delete cascade,
  following_id    uuid not null references profiles(id) on delete cascade,
  created_at      timestamptz not null default now(),

  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id <> following_id)
);

create index idx_followers_following on followers (following_id);

-- ---------- Ghost Gallery ----------
-- Fotos de clientes usando produtos — distinta de community_posts
-- porque sempre referencia um produto específico e entra num fluxo
-- de curadoria/aprovação antes de aparecer publicamente.

create table gallery_items (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  product_id      uuid references products(id) on delete set null,
  image_url       text not null,
  caption         text,
  likes_count     integer not null default 0,
  status          moderation_status not null default 'pending',
  created_at      timestamptz not null default now()
);

create index idx_gallery_product on gallery_items (product_id);
create index idx_gallery_status on gallery_items (status, created_at desc);

-- ---------- triggers ----------
create trigger trg_comments_updated_at before update on comments for each row execute function set_updated_at();
create trigger trg_reviews_updated_at before update on reviews for each row execute function set_updated_at();
create trigger trg_community_posts_updated_at before update on community_posts for each row execute function set_updated_at();

-- Mantém likes_count sincronizado sem precisar de count(*) em toda leitura
create or replace function sync_likes_count()
returns trigger as $$
declare
  delta integer := case when tg_op = 'INSERT' then 1 else -1 end;
  row_record record;
  target record;
begin
  row_record := coalesce(new, old);

  if row_record.target_type = 'comment' then
    update comments set likes_count = likes_count + delta where id = row_record.target_id;
  elsif row_record.target_type = 'community_post' then
    update community_posts set likes_count = likes_count + delta where id = row_record.target_id;
  elsif row_record.target_type = 'gallery_item' then
    update gallery_items set likes_count = likes_count + delta where id = row_record.target_id;
  end if;

  return row_record;
end;
$$ language plpgsql;

create trigger trg_likes_sync_insert after insert on likes for each row execute function sync_likes_count();
create trigger trg_likes_sync_delete after delete on likes for each row execute function sync_likes_count();

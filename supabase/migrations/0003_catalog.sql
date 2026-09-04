-- ============================================================
-- 0003: CATÁLOGO
-- ============================================================

-- ---------- Categorias ----------
create table categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text,
  image_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_categories_slug on categories (slug);

-- ---------- Coleções ----------
create table collections (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  banner_url    text,
  description   text,
  status        content_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_collections_slug on collections (slug);
create index idx_collections_status on collections (status);

-- ---------- Drops ----------
create table drops (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  trailer_url     text,
  story           text,
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  status          drop_status not null default 'upcoming',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint drop_dates_valid check (ends_at is null or ends_at > starts_at)
);

create index idx_drops_slug on drops (slug);
create index idx_drops_status_starts on drops (status, starts_at);

-- ---------- Produtos ----------
create table products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text not null unique,
  description         text,
  category_id         uuid references categories(id) on delete set null,
  collection_id       uuid references collections(id) on delete set null,
  drop_id             uuid references drops(id) on delete set null,
  price_cents         integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents is null or compare_at_price_cents >= price_cents),
  stock               integer not null default 0 check (stock >= 0),  -- total agregado; estoque real vive em product_variants quando há variação
  weight_grams        integer,
  height_cm           numeric(6,2),
  width_cm            numeric(6,2),
  length_cm           numeric(6,2),
  active              boolean not null default true,
  featured            boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_products_slug on products (slug);
create index idx_products_category on products (category_id);
create index idx_products_collection on products (collection_id);
create index idx_products_drop on products (drop_id);
create index idx_products_active_featured on products (active, featured);
create index idx_products_name_trgm on products using gin (name gin_trgm_ops);

comment on column products.stock is 'Estoque agregado, usado apenas quando o produto não tem variantes. Quando há variantes, a fonte de verdade é product_variants.stock — nunca somar os dois.';

-- ---------- Variantes ----------
create table product_variants (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products(id) on delete cascade,
  color         text,
  size          text,
  sku           text not null unique,
  stock         integer not null default 0 check (stock >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (product_id, color, size)
);

create index idx_variants_product on product_variants (product_id);
create index idx_variants_sku on product_variants (sku);

-- ---------- Imagens ----------
create table product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products(id) on delete cascade,
  url           text not null,
  position      integer not null default 0,
  is_primary    boolean not null default false,
  created_at    timestamptz not null default now()
);

create index idx_product_images_product on product_images (product_id, position);

-- Garante uma única imagem principal por produto
create unique index idx_product_images_one_primary
  on product_images (product_id)
  where is_primary = true;

-- ---------- triggers de updated_at ----------
create trigger trg_categories_updated_at before update on categories for each row execute function set_updated_at();
create trigger trg_collections_updated_at before update on collections for each row execute function set_updated_at();
create trigger trg_drops_updated_at before update on drops for each row execute function set_updated_at();
create trigger trg_products_updated_at before update on products for each row execute function set_updated_at();
create trigger trg_variants_updated_at before update on product_variants for each row execute function set_updated_at();

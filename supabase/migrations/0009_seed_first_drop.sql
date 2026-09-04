-- ============================================================
-- 0009: SEED — PRIMEIRO DROP DA GHOSTLINE
-- ============================================================
-- Popula as tabelas já existentes com o conteúdo de
-- src/lib/mock/catalog.ts. NENHUM `create table`/`alter table` aqui —
-- só `insert`, exatamente porque esta fase proíbe alterar o banco.
-- Idempotente: pode rodar mais de uma vez sem duplicar (on conflict).

-- ---------- Categorias ----------
insert into categories (name, slug, image_url) values
  ('Oversized', 'oversized', '/images/category-oversized.svg'),
  ('Moletom',   'moletom',   '/images/category-moletom.svg'),
  ('Casacos',   'casacos',   '/images/category-casacos.svg'),
  ('Coleções',  'colecoes',  '/images/category-colecoes.svg')
on conflict (slug) do nothing;

-- ---------- Coleção ----------
insert into collections (name, slug, banner_url, description, status) values
  (
    'Essentials',
    'essentials',
    '/images/collection-essentials-banner.svg',
    'A base do guarda-roupa Ghostline — peças atemporais fora da lógica de drop.',
    'published'
  )
on conflict (slug) do nothing;

-- ---------- Drops ----------
-- 4 cadastrados de propósito — o sistema nunca deve depender de um único drop.
insert into drops (name, slug, story, starts_at, ends_at, status) values
  ('DROP 01',      'drop-01',      'O primeiro sinal. Oito peças, edição limitada — quando acabar, não volta.', now() - interval '2 days',  now() + interval '5 days',  'live'),
  ('DROP 02',      'drop-02',      'Próxima transmissão. Em preparação.',                                      now() + interval '20 days', now() + interval '27 days', 'upcoming'),
  ('DROP 03',      'drop-03',      'Ainda além do horizonte.',                                                  now() + interval '45 days', now() + interval '52 days', 'upcoming'),
  ('DROP LIMITED', 'drop-limited', 'Peças únicas, sem reposição. Já encerrado.',                                now() - interval '60 days', now() - interval '53 days', 'ended')
on conflict (slug) do nothing;

-- ---------- Produtos (exatamente 8, todos do DROP 01) ----------
insert into products (
  name, slug, description, category_id, drop_id,
  price_cents, compare_at_price_cents, weight_grams, active, featured
)
select
  v.name, v.slug, v.description, c.id, d.id,
  v.price_cents, v.compare_at_price_cents, v.weight_grams, true, v.featured
from (
  values
    ('Oversized Ghost Tee',        'oversized-ghost-tee',        'Camiseta oversized 100% algodão pesado, estampa frente e costas.',        'oversized', 24900, null::int, 280, true),
    ('Moletom Beyond Limits',      'moletom-beyond-limits',      'Moletom canguru, forro felpado, bordado no peito.',                        'moletom',   34900, 39900,     520, true),
    ('Moletom Ghost Signal',       'moletom-ghost-signal',       'Moletom fechado, capuz duplo, estampa refletiva.',                         'moletom',   37900, null,      540, false),
    ('Casaco Dark Tech',           'casaco-dark-tech',           'Corta-vento técnico, bolsos utilitários, capuz removível.',                'casacos',   54900, null,      610, true),
    ('Oversized Anime Print',      'oversized-anime-print',      'Camiseta oversized com arte exclusiva inspirada em anime, edição do drop.', 'oversized', 26900, null,      285, false),
    ('Jaqueta Corta-Vento Ghost',  'jaqueta-corta-vento-ghost',  'Jaqueta leve, impermeável, dobra e guarda no próprio bolso.',              'casacos',   44900, 49900,     390, false),
    ('Camiseta Streetwear Base',   'camiseta-streetwear-base',   'Camiseta básica premium, corte reto, logo discreto na manga.',            'oversized', 19900, null,      220, false),
    ('Moletom Zip Discipline',     'moletom-zip-discipline',     'Moletom com zíper full, bolso canguru duplo, punho canelado.',             'moletom',   39900, null,      560, false)
) as v(name, slug, description, category_slug, price_cents, compare_at_price_cents, weight_grams, featured)
join categories c on c.slug = v.category_slug
cross join (select id from drops where slug = 'drop-01') d
on conflict (slug) do nothing;

-- ---------- Imagens (7 por produto: principal/frente/costas/detalhe/lifestyle/hover/banner) ----------
-- `position` 0..6 é o que define o tipo na leitura (ver PRODUCT_IMAGE_TYPE_ORDER
-- em src/types/product.ts) — position 0 = principal = is_primary.
-- Placeholder: mesma imagem em todos os slots por produto; trocar a url
-- de cada `position` por fotos reais de cada ângulo quando existirem.
insert into product_images (product_id, url, position, is_primary)
select p.id, '/images/' || v.image_seed, s.position, (s.position = 0)
from (
  values
    ('oversized-ghost-tee',       'product-01.svg'),
    ('moletom-beyond-limits',     'product-02.svg'),
    ('moletom-ghost-signal',      'product-03.svg'),
    ('casaco-dark-tech',          'product-04.svg'),
    ('oversized-anime-print',     'product-05.svg'),
    ('jaqueta-corta-vento-ghost', 'product-06.svg'),
    ('camiseta-streetwear-base',  'product-07.svg'),
    ('moletom-zip-discipline',    'product-08.svg')
) as v(slug, image_seed)
join products p on p.slug = v.slug
cross join generate_series(0, 6) as s(position)
where not exists (
  select 1 from product_images pi where pi.product_id = p.id
);

-- ---------- Variantes (3 cores × 6 tamanhos = 18 por produto) ----------
-- SKU usa o slug completo do produto pra garantir unicidade global
-- (constraint `sku` é `unique` na tabela toda, não só por produto).
insert into product_variants (product_id, color, size, sku, stock)
select
  p.id,
  colr.color,
  sz.size,
  'GH-' || upper(p.slug) || '-' || upper(left(colr.color, 2)) || '-' || sz.size,
  12
from products p
join drops d on d.id = p.drop_id and d.slug = 'drop-01'
cross join (values ('Preta'), ('Branca'), ('Cinza')) as colr(color)
cross join (values ('PP'), ('P'), ('M'), ('G'), ('GG'), ('XGG')) as sz(size)
on conflict (sku) do nothing;

-- ---------- Banners (via `settings`, ver BannerService) ----------
insert into settings (key, value) values
  ('banner:home', jsonb_build_object(
    'desktopUrl', '/images/home-banner-desktop.svg',
    'mobileUrl',  '/images/home-banner-mobile.svg',
    'alt', 'Ghostline — Beyond the Limits',
    'href', '/shop'
  )),
  ('banner:drop:drop-01', jsonb_build_object(
    'desktopUrl', '/images/drop-01-banner-desktop.svg',
    'mobileUrl',  '/images/drop-01-banner-mobile.svg',
    'alt', 'Drop 01',
    'href', '/drops/drop-01'
  )),
  ('banner:drop:drop-02', jsonb_build_object(
    'desktopUrl', '/images/drop-02-banner-desktop.svg',
    'mobileUrl',  '/images/drop-02-banner-mobile.svg',
    'alt', 'Drop 02',
    'href', '/drops/drop-02'
  )),
  ('banner:drop:drop-03', jsonb_build_object(
    'desktopUrl', '/images/drop-03-banner-desktop.svg',
    'mobileUrl',  '/images/drop-03-banner-mobile.svg',
    'alt', 'Drop 03',
    'href', '/drops/drop-03'
  )),
  ('banner:drop:drop-limited', jsonb_build_object(
    'desktopUrl', '/images/drop-limited-banner-desktop.svg',
    'mobileUrl',  '/images/drop-limited-banner-mobile.svg',
    'alt', 'Drop Limited',
    'href', '/drops/drop-limited'
  )),
  ('banner:collection:essentials', jsonb_build_object(
    'desktopUrl', '/images/collection-essentials-banner.svg',
    'alt', 'Essentials',
    'href', '/shop?colecao=essentials'
  ))
on conflict (key) do update set value = excluded.value;

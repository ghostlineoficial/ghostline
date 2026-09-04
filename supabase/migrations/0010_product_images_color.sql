-- ============================================================
-- 0010: product_images.color — associação opcional imagem ↔ cor
-- ============================================================
-- Nullable de propósito: NULL = imagem compartilhada (detalhe, lifestyle).
-- Produtos já cadastrados continuam válidos sem backfill.

alter table product_images
  add column if not exists color text;

comment on column product_images.color is
  'Cor da variante à qual a imagem pertence. NULL = compartilhada entre todas as cores.';

create index if not exists idx_product_images_product_color
  on product_images (product_id, color);

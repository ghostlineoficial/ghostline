-- ============================================================
-- 0008: ROW LEVEL SECURITY E POLICIES
-- ============================================================
-- Princípio geral: por padrão, ninguém acessa nada. Cada tabela
-- tem RLS habilitado e só as policies abaixo abrem acesso.
-- auth.uid() é o usuário autenticado atual (Supabase Auth).

-- ---------- Funções auxiliares ----------
-- SECURITY DEFINER: a função enxerga profiles mesmo que a policy
-- de profiles não libere leitura direta pro usuário checando outro
-- usuário. Evita recursão de policy (profiles checando profiles).

create or replace function current_profile_id()
returns uuid
language sql stable security definer
as $$
  select id from profiles where user_id = auth.uid();
$$;

create or replace function is_admin()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from profiles
    where user_id = auth.uid() and admin_role = 'admin'
  );
$$;

create or replace function is_staff()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from profiles
    where user_id = auth.uid() and admin_role is not null
  );
$$;

-- ============================================================
-- PROFILES
-- ============================================================
alter table profiles enable row level security;

create policy "profiles_select_public" on profiles
  for select using (true);  -- perfil público (username, bio, avatar) é sempre legível

create policy "profiles_update_own" on profiles
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid() and admin_role is not distinct from admin_role); -- usuário não pode elevar o próprio admin_role

create policy "profiles_insert_own" on profiles
  for insert with check (user_id = auth.uid());

create policy "profiles_admin_full_access" on profiles
  for all using (is_admin());

-- ============================================================
-- ADDRESSES
-- ============================================================
alter table addresses enable row level security;

create policy "addresses_owner_full_access" on addresses
  for all using (profile_id = current_profile_id());

create policy "addresses_admin_read" on addresses
  for select using (is_staff());

-- ============================================================
-- CATÁLOGO (categories, collections, drops, products, variants, images)
-- Leitura pública sempre (é loja); escrita só admin/editor.
-- ============================================================
alter table categories enable row level security;
alter table collections enable row level security;
alter table drops enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;

create policy "categories_public_read" on categories for select using (true);
create policy "collections_public_read" on collections for select using (status = 'published' or is_staff());
create policy "drops_public_read" on drops for select using (true);
create policy "products_public_read" on products for select using (active or is_staff());
create policy "variants_public_read" on product_variants for select using (true);
create policy "images_public_read" on product_images for select using (true);

create policy "categories_staff_write" on categories for all using (is_staff());
create policy "collections_staff_write" on collections for all using (is_staff());
create policy "drops_staff_write" on drops for all using (is_staff());
create policy "products_staff_write" on products for all using (is_staff());
create policy "variants_staff_write" on product_variants for all using (is_staff());
create policy "images_staff_write" on product_images for all using (is_staff());

-- ============================================================
-- CARRINHO
-- ============================================================
alter table carts enable row level security;
alter table cart_items enable row level security;

create policy "carts_owner_full_access" on carts
  for all using (profile_id = current_profile_id());

create policy "cart_items_owner_full_access" on cart_items
  for all using (
    cart_id in (select id from carts where profile_id = current_profile_id())
  );

-- ============================================================
-- CUPONS
-- ============================================================
alter table coupons enable row level security;

create policy "coupons_public_read_active" on coupons
  for select using (active and (expires_at is null or expires_at > now()));

create policy "coupons_staff_write" on coupons for all using (is_staff());

-- ============================================================
-- PEDIDOS
-- ============================================================
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payments enable row level security;
alter table payment_webhook_events enable row level security;

create policy "orders_owner_read" on orders
  for select using (profile_id = current_profile_id());

create policy "orders_owner_insert" on orders
  for insert with check (profile_id = current_profile_id());

-- Atualização de pedido (status, etc.) é feita via service role
-- (webhook/admin), nunca diretamente pelo cliente — por isso não
-- existe policy de UPDATE pro dono aqui.

create policy "orders_staff_full_access" on orders for all using (is_staff());

create policy "order_items_owner_read" on order_items
  for select using (
    order_id in (select id from orders where profile_id = current_profile_id())
  );

create policy "order_items_staff_full_access" on order_items for all using (is_staff());

create policy "payments_owner_read" on payments
  for select using (
    order_id in (select id from orders where profile_id = current_profile_id())
  );

create policy "payments_staff_full_access" on payments for all using (is_staff());

-- Webhook events: nunca acessível via client, só service role (que
-- ignora RLS por padrão) e staff pra debug.
create policy "webhook_events_staff_read" on payment_webhook_events
  for select using (is_staff());

-- ============================================================
-- WISHLIST
-- ============================================================
alter table wishlist_items enable row level security;

create policy "wishlist_owner_full_access" on wishlist_items
  for all using (profile_id = current_profile_id());

-- ============================================================
-- COMENTÁRIOS E AVALIAÇÕES
-- ============================================================
alter table comments enable row level security;
alter table reviews enable row level security;
alter table review_images enable row level security;

create policy "comments_public_read" on comments
  for select using (status = 'approved' or profile_id = current_profile_id() or is_staff());

create policy "comments_owner_insert" on comments
  for insert with check (profile_id = current_profile_id());

create policy "comments_owner_update" on comments
  for update using (profile_id = current_profile_id());

create policy "comments_owner_delete" on comments
  for delete using (profile_id = current_profile_id());

create policy "comments_staff_moderate" on comments
  for all using (is_staff());

create policy "reviews_public_read" on reviews
  for select using (status = 'approved' or profile_id = current_profile_id() or is_staff());

create policy "reviews_owner_insert" on reviews
  for insert with check (
    profile_id = current_profile_id()
    -- prova de compra: order_item precisa existir e pertencer ao usuário
    and (
      order_item_id is null or order_item_id in (
        select oi.id from order_items oi
        join orders o on o.id = oi.order_id
        where o.profile_id = current_profile_id()
      )
    )
  );

create policy "reviews_owner_update" on reviews
  for update using (profile_id = current_profile_id());

create policy "reviews_staff_moderate" on reviews
  for all using (is_staff());

create policy "review_images_public_read" on review_images for select using (true);
create policy "review_images_owner_write" on review_images
  for all using (
    review_id in (select id from reviews where profile_id = current_profile_id())
  );

-- ============================================================
-- COMUNIDADE
-- ============================================================
alter table community_posts enable row level security;
alter table community_post_comments enable row level security;
alter table likes enable row level security;
alter table followers enable row level security;
alter table gallery_items enable row level security;

create policy "community_posts_public_read" on community_posts
  for select using (status = 'approved' or profile_id = current_profile_id() or is_staff());

create policy "community_posts_owner_insert" on community_posts
  for insert with check (profile_id = current_profile_id());

create policy "community_posts_owner_update" on community_posts
  for update using (profile_id = current_profile_id());

create policy "community_posts_owner_delete" on community_posts
  for delete using (profile_id = current_profile_id());

create policy "community_posts_staff_moderate" on community_posts
  for all using (is_staff());

create policy "post_comments_public_read" on community_post_comments for select using (true);
create policy "post_comments_owner_insert" on community_post_comments
  for insert with check (profile_id = current_profile_id());
create policy "post_comments_owner_delete" on community_post_comments
  for delete using (profile_id = current_profile_id());

create policy "likes_public_read" on likes for select using (true);
create policy "likes_owner_insert" on likes
  for insert with check (profile_id = current_profile_id());
create policy "likes_owner_delete" on likes
  for delete using (profile_id = current_profile_id());

create policy "followers_public_read" on followers for select using (true);
create policy "followers_owner_insert" on followers
  for insert with check (follower_id = current_profile_id());
create policy "followers_owner_delete" on followers
  for delete using (follower_id = current_profile_id());

create policy "gallery_public_read_approved" on gallery_items
  for select using (status = 'approved' or profile_id = current_profile_id() or is_staff());
create policy "gallery_owner_insert" on gallery_items
  for insert with check (profile_id = current_profile_id());
create policy "gallery_staff_moderate" on gallery_items
  for all using (is_staff());

-- ============================================================
-- GHOST STUDIO
-- ============================================================
alter table uploads enable row level security;
alter table studio_projects enable row level security;

create policy "uploads_owner_full_access" on uploads
  for all using (profile_id = current_profile_id());
create policy "uploads_staff_read" on uploads for select using (is_staff());

create policy "studio_projects_owner_full_access" on studio_projects
  for all using (profile_id = current_profile_id());
create policy "studio_projects_staff_full_access" on studio_projects
  for all using (is_staff());

-- ============================================================
-- GHOST SOCIETY
-- ============================================================
alter table memberships enable row level security;
alter table membership_benefits enable row level security;
alter table premium_content enable row level security;

create policy "memberships_owner_read" on memberships
  for select using (profile_id = current_profile_id());
create policy "memberships_staff_full_access" on memberships
  for all using (is_staff());

create policy "membership_benefits_public_read" on membership_benefits for select using (true);
create policy "membership_benefits_staff_write" on membership_benefits for all using (is_staff());

create policy "premium_content_read_by_plan" on premium_content
  for select using (
    status = 'published'
    and (
      is_staff()
      or exists (
        select 1 from memberships m
        where m.profile_id = current_profile_id()
          and m.status = 'active'
          -- hierarquia simples: free < silver < gold < black
          and (
            case m.plan when 'free' then 0 when 'silver' then 1 when 'gold' then 2 when 'black' then 3 end
            >=
            case premium_content.min_plan when 'free' then 0 when 'silver' then 1 when 'gold' then 2 when 'black' then 3 end
          )
      )
    )
  );
create policy "premium_content_staff_write" on premium_content for all using (is_staff());

-- ============================================================
-- SISTEMA
-- ============================================================
alter table notifications enable row level security;
alter table settings enable row level security;
alter table audit_logs enable row level security;

create policy "notifications_owner_full_access" on notifications
  for all using (profile_id = current_profile_id());

create policy "settings_public_read" on settings for select using (true);
create policy "settings_staff_write" on settings for all using (is_staff());

-- audit_logs: leitura só staff; ESCRITA nunca vem do client —
-- toda inserção acontece via service role dentro de triggers/RPCs,
-- por isso não existe policy de insert pro usuário comum aqui.
create policy "audit_logs_staff_read" on audit_logs for select using (is_staff());

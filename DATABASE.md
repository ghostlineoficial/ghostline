# Ghostline — Arquitetura de Banco de Dados

PostgreSQL via Supabase. 9 migrations em `supabase/migrations/`, aplicadas
em ordem (`0001` → `0008`). Este documento explica o schema completo.

---

## 1. Diagrama textual

```
auth.users (Supabase Auth)
  └── profiles (1:1)
        ├── addresses (1:N)
        ├── carts (1:1) ── cart_items (1:N) ──► product_variants
        ├── orders (1:N)
        │     ├── order_items (1:N) ──► product_variants
        │     ├── payments (1:N) ──► payment_webhook_events (1:N)
        │     └── shipping_address_id ──► addresses
        ├── wishlist_items (1:N) ──► products
        ├── comments (1:N, self-referencing via parent_id) ──► products
        ├── reviews (1:N, unique por produto) ──► products, order_items
        │     └── review_images (1:N)
        ├── community_posts (1:N)
        │     └── community_post_comments (1:N)
        ├── likes (1:N, polimórfica → comment | community_post | gallery_item | review)
        ├── followers (N:N, self-referencing: follower_id ↔ following_id)
        ├── gallery_items (1:N) ──► products
        ├── uploads (1:N)
        ├── studio_projects (1:N) ──► products, uploads
        ├── memberships (1:1)
        ├── notifications (1:N)
        └── audit_logs (referenciada como actor_id)

products
  ├── category_id ──► categories (N:1)
  ├── collection_id ──► collections (N:1)
  ├── drop_id ──► drops (N:1)
  ├── product_variants (1:N)
  └── product_images (1:N)

coupons ──► orders (N:1, opcional)
membership_benefits ──► agrupada por membership_plan (enum, não FK)
premium_content ──► acesso controlado por min_plan (enum) x memberships.plan
settings ──► chave-valor global, sem relacionamento
```

---

## 2. Tabelas — o que cada uma resolve

### Autenticação e identidade
- **`auth.users`** (gerenciada pelo Supabase, não recriada aqui) — email, senha
  hash, provedores OAuth (Google), sessões e refresh tokens já vêm prontos do
  Supabase Auth. Login por Google e por e-mail, recuperação de senha e
  renovação de sessão são todos recursos nativos — não precisam de tabela
  própria.
- **`profiles`** — todo o resto do usuário (username, bio, redes sociais,
  ghost_rank, flag de premium). Nunca duplica email/senha. `admin_role`
  (admin/editor/moderator, nullable) vive aqui — é o que separa usuário
  comum de administrador, checado via as funções `is_admin()`/`is_staff()`
  usadas em quase toda policy.
- **`addresses`** — N endereços por usuário, com um marcado como padrão
  (garantido por índice único parcial, não por lógica de aplicação).

### Catálogo
- **`categories`**, **`collections`**, **`drops`** — três formas diferentes
  de agrupar produto: categoria é permanente (ex: "Moletons"), coleção é
  editorial (ex: "Verão 26"), drop é limitado no tempo (tem `starts_at`/
  `ends_at`/`status`). Produto pode pertencer a uma de cada, opcionalmente.
- **`products`** — dados centrais. `stock` só é usado quando o produto não
  tem variante; quando tem, a verdade é `product_variants.stock` (documentado
  via `comment on column`).
- **`product_variants`** — cor/tamanho/SKU/estoque. `unique(product_id,
  color, size)` impede duplicata.
- **`product_images`** — N imagens por produto, ordenadas por `position`,
  com no máximo uma `is_primary = true` (índice único parcial).

### Comércio
- **`carts` / `cart_items`** — carrinho normalizado em vez de JSON: permite
  FK real pra variante (não deixa adicionar um SKU inexistente) e updates
  parciais de quantidade sem reescrever o carrinho inteiro.
- **`orders`** — snapshot financeiro do pedido (subtotal/desconto/frete/
  total em centavos). `profile_id` usa `ON DELETE RESTRICT` — histórico de
  compra nunca some junto com a conta.
- **`order_items`** — preço é **copiado no momento da compra**
  (`price_cents_at_purchase`). Nunca lido de `products` depois — produto
  muda de preço, pedido não.
- **`payments`** — 1 pedido pode ter N tentativas de pagamento (PIX expira,
  tenta cartão depois). Guarda `provider_payload` (resposta bruta do
  Mercado Pago) pra debug sem depender de re-consultar a API deles.
- **`payment_webhook_events`** — todo evento de webhook é persistido antes
  de processado, deduplicado por `(provider, provider_event_id)`. Permite
  reprocessar em caso de bug sem depender só do estado atual no provedor.
- **`coupons`** — percentual, valor fixo ou frete grátis (`coupon_type`
  enum), com limite de uso e expiração.

### Social
- **`wishlist_items`** — favoritos, simples N:N entre profile e product.
- **`comments`** — comentários em produto, com `parent_id` self-referencing
  pra permitir respostas (thread de 1 nível é suficiente pro caso de uso;
  se precisar de árvore completa, trocar por `path`/`ltree` no futuro).
- **`reviews`** — nota + comentário, **1 por (usuário, produto)**, com
  `order_item_id` como prova de compra (policy de INSERT valida que o
  order_item pertence ao usuário — ver seção de segurança).
- **`community_posts`**, **`community_post_comments`** — feed social geral,
  sem vínculo obrigatório com produto (diferente de `comments`).
- **`likes`** — **tabela polimórfica única** (`target_type` + `target_id`)
  em vez de `likes_comments`/`likes_posts`/`likes_gallery` separadas. Um
  índice único `(profile_id, target_type, target_id)` garante uma curtida
  por usuário por alvo; triggers mantêm `likes_count` sincronizado nas
  tabelas-alvo sem precisar de `count(*)` em toda leitura.
- **`followers`** — N:N self-referencing em `profiles`, PK composta
  `(follower_id, following_id)`, `check` impede seguir a si mesmo.
- **`gallery_items`** (Ghost Gallery) — fotos de cliente com produto
  associado, fluxo de moderação (`status`) antes de aparecer publicamente.
  Separada de `community_posts` porque sempre referencia produto e tem
  curadoria — regra de negócio diferente.

### Ghost Studio
- **`uploads`** — arquivo genérico enviado pelo usuário (arte, etc.),
  reaproveitável por qualquer feature futura que precise de upload, não só
  Studio.
- **`studio_projects`** — configuração de customização (cor, arte, texto,
  fonte, posicionamento frente/costas/manga, render 3D, status, preço).

### Ghost Society
- **`memberships`** — fonte de verdade do plano (free/silver/gold/black) e
  status (active/past_due/cancelled/expired). Uma trigger sincroniza
  `profiles.is_premium`/`premium_expires_at` automaticamente — esses dois
  campos em `profiles` são só uma cópia rápida pra evitar join em toda
  checagem de acesso.
- **`membership_benefits`** — benefícios por plano, tabela própria (não
  jsonb) pra permitir listar/filtrar/reordenar.
- **`premium_content`** — curso/wallpaper/making of/download/vídeo, com
  `min_plan` definindo o nível mínimo de acesso. A policy de leitura
  compara a hierarquia dos planos (free < silver < gold < black).

### Sistema
- **`notifications`** — título, mensagem, link, `read_at` nullable (não-lida
  = null). Índice parcial só nas não-lidas, que é a query mais frequente
  (badge de contador).
- **`settings`** — chave-valor tipado em `jsonb`. Configuração da
  plataforma muda de formato com frequência; uma tabela genérica evita
  migration a cada novo campo de configuração.
- **`audit_logs`** — toda ação administrativa relevante. Somente-inserção
  por design (policy não permite update/delete pro client; ver segurança).

---

## 3. Relacionamentos e Foreign Keys — estratégia de `ON DELETE`

| Relação | Estratégia | Por quê |
|---|---|---|
| `addresses.profile_id` → profiles | `CASCADE` | Endereço não faz sentido sem o dono |
| `orders.profile_id` → profiles | `RESTRICT` | Histórico financeiro nunca desaparece com a conta |
| `order_items.variant_id` → product_variants | `RESTRICT` | Não pode apagar uma variante que já foi vendida |
| `products.category_id/collection_id/drop_id` | `SET NULL` | Produto sobrevive à remoção do agrupador |
| `comments.parent_id` → comments | `CASCADE` | Apagar o comentário-pai remove as respostas |
| `reviews.order_item_id` → order_items | `SET NULL` | Perde só a prova de compra, mantém a avaliação |
| `studio_projects.product_id` → products | `RESTRICT` | Preserva projetos já configurados/comprados |
| `followers` (ambas as colunas) → profiles | `CASCADE` | Relação social não sobrevive à conta apagada |

Regra geral: **CASCADE só quando o registro filho não tem significado sem o
pai** (endereço, resposta de comentário, item de carrinho). Tudo que tem
valor histórico ou financeiro usa `RESTRICT` ou `SET NULL`.

---

## 4. Índices — o que cobre cada um

- **Toda FK tem índice** — Postgres não cria isso automaticamente, e sem
  índice todo `JOIN`/`DELETE CASCADE` faz sequential scan.
- **Índices parciais** (`WHERE status = 'active'`, `WHERE read_at IS NULL`,
  `WHERE is_default = true`) — menores que um índice completo, mais rápidos,
  porque cobrem só as linhas realmente consultadas com frequência.
- **`gin_trgm_ops`** em `products.name` e `profiles.username` — busca por
  substring/fuzzy (`ILIKE '%termo%'`) que normalmente forçaria sequential
  scan passa a usar índice.
- **Índices compostos** (`orders(profile_id, created_at desc)`,
  `comments(product_id, created_at desc)`) — cobrem o padrão de acesso real:
  "pedidos do usuário, mais recentes primeiro", não índices genéricos por
  coluna isolada.
- **Únicos parciais** (`product_images` com 1 primary, `addresses` com 1
  default) — a regra de negócio "só um X marcado" é garantida pelo banco,
  não confiada à aplicação.

---

## 5. Performance — estratégias

1. **Preço nunca é recalculado a partir de `products` em pedido antigo** —
   `order_items.price_cents_at_purchase` evita join + lógica de "qual era o
   preço na época".
2. **Contadores desnormalizados com trigger** (`likes_count`,
   `comments_count`, `shares_count`) — ler o contador é O(1); sem isso,
   toda tela de feed faria `count(*)` em `likes` pra cada post exibido.
3. **`profiles.is_premium` como cache do estado de `memberships`** — checagem
   de acesso a conteúdo premium não depende de join em toda request.
4. **Particionamento futuro de `audit_logs` e `payment_webhook_events`** —
   ambas são tabelas somente-inserção que crescem indefinidamente. Não
   particionadas nesta fase (não vale a pena com poucos milhões de linhas),
   mas o desenho já é compatível: particionar por `created_at` (mensal) é
   uma migration que não muda a aplicação, só o armazenamento físico.
5. **`carts`/`cart_items` normalizado** em vez de jsonb — permite update de
   1 item sem reescrever o carrinho inteiro, e valida a FK da variante no
   banco (não deixa adicionar produto inexistente por bug no client).
6. **Read replicas (Supabase suporta via connection pooling/PgBouncer)** —
   leituras pesadas de catálogo (Shop, Drops) podem ir pra replica quando o
   tráfego justificar; nenhuma tabela aqui foi desenhada de um jeito que
   impeça isso (sem sequences fora do padrão, sem triggers que dependam de
   ordem de execução entre nós).
7. **Materialized view candidata**: um "feed" combinado de
   `community_posts` + `gallery_items` ordenado por engajamento é uma
   consulta cara se rodada ao vivo em escala — quando o tráfego justificar,
   vira materialized view refrescada periodicamente, sem mudar o schema
   base.

---

## 6. Segurança — estratégias

1. **RLS habilitado em 100% das tabelas** (migration `0008`). Por padrão,
   sem policy, ninguém lê nem escreve nada — cada acesso é uma concessão
   explícita, nunca um esquecimento de bloqueio.
2. **Separação admin/usuário nunca é uma tabela paralela** — é o campo
   `profiles.admin_role` (nullable enum), checado via `is_admin()`/
   `is_staff()` (funções `SECURITY DEFINER`, evitam recursão de policy).
   Um usuário não consegue se auto-promover: a policy de `UPDATE` em
   `profiles` explicitamente proíbe alterar o próprio `admin_role`.
3. **Prova de compra em `reviews`** — a policy de INSERT verifica que
   `order_item_id` (quando informado) pertence a um pedido do próprio
   usuário. Não dá pra forjar uma avaliação "verificada" via API.
4. **`audit_logs` é somente-leitura pro staff, e a aplicação nunca insere
   nela via client** — inserção acontece só via service role (backend/RPC),
   então mesmo um admin comprometido no client não consegue apagar o
   próprio rastro.
5. **`payment_webhook_events`** não tem nenhuma policy de escrita pro
   client — só o service role (que ignora RLS) grava ali, a partir do
   endpoint de webhook do Mercado Pago.
6. **Preço e estoque nunca são confiáveis vindos do client** — toda
   validação de preço em `order_items` e checagem de estoque em
   `product_variants` deve acontecer em uma function/RPC no banco (ou
   Edge Function) antes do insert, não confiar no valor enviado pelo
   frontend. (Constraint `check` garante não-negativo, mas a regra de
   "preço bate com o catálogo" é lógica de aplicação/RPC, não RLS.)
7. **`current_profile_id()` como padrão em toda policy "dono"** — centraliza
   a tradução `auth.uid() → profiles.id` numa função só; se a relação entre
   `auth.users` e `profiles` mudar um dia, é um ponto de ajuste, não 30.

---

## 7. Escalabilidade — pensando em milhões de usuários

1. **UUID como chave primária em toda tabela** — permite gerar IDs no
   client/edge sem round-trip ao banco, e evita contenção de sequence
   incremental sob escrita concorrente pesada (padrão comum em bancos
   distribuídos/multi-region).
2. **Nenhuma tabela depende de ordem de criação global** — sem `serial`
   incremental como identificador de negócio; `order_number` é gerado
   separadamente (aplicação/trigger), pensado pra eventualmente vir de um
   gerador distribuído se o volume exigir.
3. **Separação clara entre dado "quente" e "frio"**: `profiles` (lido o
   tempo todo) fica enxuto; dados de baixa frequência de leitura
   (`membership_benefits`, `settings`) ficam em tabelas pequenas e
   separadas, não incham a tabela principal.
4. **Enums no lugar de texto livre pra status** — menor no disco, mais
   rápido pra comparar/indexar, e o Postgres já impede um status inválido
   sem precisar de `check` complexo.
5. **Nenhum campo de "estoque global" contando produto E variante ao mesmo
   tempo** — evita double-counting e race condition de estoque quando dois
   pedidos concorrentes competem pela mesma unidade (a atualização de
   estoque deve usar `UPDATE ... WHERE stock >= quantity` atômico dentro de
   uma function, não leitura-depois-escrita no client).
6. **Design pronto pra sharding lógico por período**, quando necessário:
   `orders`, `audit_logs`, `notifications` e `payment_webhook_events` são
   as maiores candidatas a particionamento por `created_at` — todas já
   filtram por esse campo nos índices mais usados, então particionar não
   muda nenhuma query existente.
7. **RPCs/Edge Functions absorvem lógica de negócio pesada** (cálculo de
   frete, validação de cupom, checkout) — o banco fica responsável por
   consistência e regras estruturais (constraints, RLS), não por lógica de
   aplicação que tende a mudar com frequência.

---

## 8. O que fica pra próxima fase (fora do escopo desta)

Por instrução explícita, esta fase cobriu **somente** banco de dados —
nenhuma tela, componente ou lógica de aplicação foi tocada.

Pendente pra quando for autorizado:
- Functions/RPCs de checkout (validação de estoque + preço + criação de
  order atômica)
- Edge Function de webhook do Mercado Pago (grava em
  `payment_webhook_events`, processa, atualiza `payments`/`orders`)
- Seed inicial de `categories`/`settings`
- Geração de `order_number` (function ou sequence dedicada)

Aguardando próxima instrução.

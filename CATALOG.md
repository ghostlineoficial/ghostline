# Ghostline — Catálogo (Fase 06: Primeiro Drop)

Esta fase preparou a plataforma pra receber o **DROP 01** (8 produtos) sem
criar Shop, Checkout ou Carrinho. Só a estrutura de dados, os Services que
falam com o Supabase, e os hooks de leitura.

## Como o dado flui

```
Componente (Server Component, futuro Shop/produto/Home)
   │  nunca chama Supabase diretamente
   ▼
hooks (useProducts, useFeaturedProducts, useDrop, useBanner)
   │  só adicionam cache/revalidate (Next unstable_cache) por cima do Service
   ▼
Services (ProductService, DropService, BannerService)
   │  único lugar que monta queries Supabase
   ▼
Supabase (tabelas já existentes desde a Fase 02 — nenhuma alterada)
```

Nenhum componente tem uma linha de dado fixo. O que existe hoje como
"temporário" (`src/lib/mock/catalog.ts`) não é lido por nenhum componente —
é a fonte que a migration `0009_seed_first_drop.sql` insere **dentro do
Supabase de verdade**. Ou seja: mesmo o dado de demonstração já passa pelo
banco, exatamente como a fase exigiu ("todos devem ser carregados através
do banco").

---

## 1. Onde cadastrar novos produtos

Hoje (antes de existir um admin): direto no Supabase, seguindo o padrão do
seed em `supabase/migrations/0009_seed_first_drop.sql`. Um produto precisa
de 3 inserções, nessa ordem:

1. **`products`** — nome, slug, descrição, `category_id`, `drop_id` (ou
   `collection_id`), preço, preço promocional, peso, `active`, `featured`.
2. **`product_images`** — até 7 linhas (`position` 0 a 6), seguindo a ordem
   fixa: `0` principal, `1` frente, `2` costas, `3` detalhe, `4` lifestyle,
   `5` hover, `6` banner. Só `position = 0` deve ter `is_primary = true`.
3. **`product_variants`** — uma linha por combinação de cor × tamanho (hoje
   3 cores × 6 tamanhos = 18 linhas por produto), cada uma com seu próprio
   `stock` e um `sku` único.

Quando o **Admin** (fora do escopo até agora) existir, esse cadastro deixa
de ser SQL manual e vira um formulário — mas vai gravar exatamente nessas
mesmas 3 tabelas, sem mudar nada do que já foi construído aqui.

## 2. Onde cadastrar banners

Não existe tabela `banners` própria — foi uma decisão desta fase pra não
alterar o banco. Banners vivem na tabela `settings` (já existente desde a
Fase 02), uma linha por banner, com chave convencionada:

```
banner:home                    → banner principal do site
banner:drop:<slug-do-drop>     → banner de um drop específico
banner:collection:<slug>       → banner de uma coleção
```

O valor é um jsonb `{ desktopUrl, mobileUrl, alt, href }` — isso cobre
Principal/Mobile/Desktop/Coleção/Drop com uma única forma, em vez de 5
campos separados. Pra cadastrar um novo, é um `insert`/`upsert` em
`settings` seguindo esse formato (ver os exemplos no fim da migration
`0009`) — o `BannerService` lê pela chave, então funciona assim que a linha
existir.

## 3. Como adicionar um novo Drop

1. `insert into drops (name, slug, story, starts_at, ends_at, status) values (...)`.
2. Cadastrar os produtos desse drop com `drop_id` apontando pra ele (passo
   1 da seção de produtos acima).
3. (Opcional) cadastrar o banner do drop em `settings`, chave
   `banner:drop:<slug>`.

`DropService.getActiveDrop()` sempre pega o que estiver com `status =
'live'` — não existe nenhum lugar do código assumindo que só existe um
drop (o seed já cadastra 4: `drop-01` live, `drop-02`/`drop-03` upcoming,
`drop-limited` ended, exatamente pra provar isso).

## 4. Como adicionar uma nova coleção

`insert into collections (name, slug, banner_url, description, status)` —
depois é só apontar `collection_id` nos produtos que pertencem a ela.
Coleção e Drop são independentes: um produto pode ter só `drop_id`, só
`collection_id`, os dois, ou nenhum.

## 5. Como substituir os dados temporários pelos reais

1. **Conectar o projeto Supabase de verdade** — preencher
   `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env.local`
   (ver `.env.example`) e rodar as migrations `0001` a `0009` nele. Nesse
   momento o "dado temporário" já É o dado do Drop 01 — a migration 0009
   pode continuar rodando como seed de ambiente novo, ou ser apagada
   quando o Drop 01 real for cadastrado por cima.
2. **Cadastrar produtos reais**: ou via SQL direto (seção 1), ou — quando o
   Admin existir — pelo painel. Em ambos os casos, nenhum código muda:
   `ProductService` já lê da tabela `products` de verdade, não do mock.
3. **Apagar/ignorar `src/lib/mock/catalog.ts`** quando o catálogo real
   estiver completo — ele não é importado por nenhum componente, só existe
   como referência de formato. Removê-lo não quebra nada.
4. **Gerar tipos reais do Supabase** (`supabase gen types typescript`) pra
   substituir as interfaces `ProductRow`/`DropRow`/`SettingRow` manuais
   dentro dos Services — isso é uma melhoria de tipagem, não uma mudança de
   arquitetura (os Services continuam sendo o único ponto de acesso).

---

## Limitação conhecida (documentada de propósito)

O "tipo" de cada imagem (`principal`/`frente`/`costas`/`detalhe`/
`lifestyle`/`hover`/`banner`) **não é uma coluna** em `product_images` —
é derivado pela posição (`position` 0 a 6) em `ProductService.mapImages`.
Funciona bem pro caso de uso atual (sempre 7 imagens, sempre nessa ordem),
mas se um produto precisar de, por exemplo, 2 imagens de detalhe e nenhuma
lifestyle, esse esquema quebra. Resolver isso direito exigiria uma coluna
`image_type` em `product_images` — o que é uma alteração de banco, fora do
escopo desta fase. Fica registrado aqui pra próxima vez que o banco for
mexido.

## O que NÃO foi criado nesta fase (por instrução explícita)

Shop, Checkout, Carrinho, página de produto, painel Admin de cadastro.
Só a estrutura de catálogo (Services, hooks, tipos, seed). Aguardando
próxima instrução.

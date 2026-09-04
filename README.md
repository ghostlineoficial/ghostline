# GHOSTLINE

Plataforma premium de streetwear — Next.js 15, TypeScript, Supabase, TailwindCSS, Framer Motion, Three.js, Mercado Pago.

## Setup

```bash
npm install
cp .env.example .env.local   # preencher com as chaves do Supabase e Mercado Pago
npm run dev
```

Abra `http://localhost:3000`.

## O que já está implementado (Fase 2)

- Estrutura de pastas feature-based completa
- Configuração de Tailwind com a paleta e tipografia da marca
- Clientes Supabase (browser + server) e middleware de proteção de rotas
  (`/profile`, `/admin`, com checagem de role para admin)
- Componentes base: `Button`, `Badge`, `Navbar`, `Footer`, `Hero`,
  `SectionTitle`, `ProductCard`
- Layout raiz com as 3 fontes da marca (Anton, Inter, Space Grotesk)
- Home inicial com Hero animado (Framer Motion)
- Tipos globais de `Product`, `ProductVariant`, `ProductImage`, `Drop`

## O que falta (próximas fases)

1. **Banco de dados** — criar as tabelas no Supabase (schema descrito no
   planejamento) e ativar RLS por tabela
2. **Auth** — páginas `/login` e `/register`, fluxo de recuperação de senha
3. **Shop** — listagem, filtros, página de produto com seletor de variante
4. **Drops** — countdown, lógica de estoque limitado, status
   upcoming/live/ended
5. **Carrinho** — store global (Zustand) + drawer lateral
6. **Checkout** — integração Mercado Pago (checkout transparente ou redirect)
7. **Ghost Studio / Community** — páginas editoriais e feed de posts
8. **Admin** — CRUD de produtos, pedidos, drops
9. **Camada 3D** — componente Three.js lazy-loaded para o background do Hero

## Convenções

- Componentes de `components/` nunca importam de `features/`
- Um componente só sobe de `features/x/components` para `components/shared`
  quando pelo menos 2 features diferentes precisam dele
- Preços sempre em centavos (inteiro) no banco — formatação só na camada de UI
  (`utils/formatCurrency.ts`)
- Server Components por padrão; `'use client'` só onde há interatividade real

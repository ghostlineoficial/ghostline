# Ghostline Design System

Sistema de interface reutilizável da plataforma Ghostline. Nenhum componente
aqui foi pensado pra uma página específica — todos servem qualquer parte do
produto (Home, Shop, Drops, Ghost Studio, Community, Ghost Society, Profile,
Admin).

## Onde está tudo

```
src/
├── lib/
│   └── motion.ts              # Variantes de animação (Framer Motion)
├── providers/
│   └── TooltipProvider.tsx    # Provider global, montado no layout raiz
├── components/
│   ├── ui/                    # Primitivos — átomos e moléculas simples
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Switch.tsx
│   │   ├── Badge.tsx
│   │   ├── Chip.tsx
│   │   ├── Tag.tsx
│   │   ├── Avatar.tsx
│   │   ├── Divider.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tabs.tsx
│   │   ├── Accordion.tsx
│   │   ├── Dialog.tsx
│   │   ├── Drawer.tsx
│   │   ├── Toast.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Progress.tsx
│   │   ├── Pagination.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── Rating.tsx
│   │   ├── SearchInput.tsx
│   │   ├── FilterGroup.tsx
│   │   ├── Container.tsx
│   │   ├── Grid.tsx
│   │   ├── Stack.tsx           # também exporta Flex
│   │   └── Section.tsx
│   ├── shared/                 # Compostos — combinam primitivos de ui/
│   │   ├── Card.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── ProductBadge.tsx
│   │   ├── ProductCard.tsx
│   │   ├── DropCard.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── GalleryCard.tsx
│   │   ├── CommentCard.tsx
│   │   ├── Carousel.tsx
│   │   ├── Newsletter.tsx
│   │   ├── Hero.tsx
│   │   └── SectionTitle.tsx
│   └── layout/                 # Casca da aplicação
│       ├── Navbar.tsx
│       └── Footer.tsx
```

## Tokens (fonte única de verdade: `tailwind.config.ts`)

**Cores** — usar sempre como classe Tailwind (`bg-primary`, `text-danger`),
nunca hex direto no componente:
`background` `surface` `card` `border` `foreground` `muted` `primary` /
`primary-hover` `success` `warning` `danger`

**Tipografia** — classes `text-display-xl`, `text-h1` até `text-h4`,
`text-body-lg`, `text-body`, `text-body-sm`, `text-caption`. Cada uma já
define line-height e letter-spacing corretos — não sobrescrever isso
manualmente no componente.

**Espaçamento** — escala 4/8/12/16/20/24/32/40/48/64/80/96/128, mapeada
pros números do Tailwind (`p-4` = 16px, `gap-6` = 24px, etc.) mais o token
`section` (128px) pra padding vertical de seções.

**Radius** — `rounded-sm` (6px) `rounded-md` (10px) `rounded-lg` (16px)
`rounded-xl` (24px) `rounded-full`.

**Sombra** — `shadow-sm` `shadow-md` `shadow-lg` `shadow-glow` (a última é
pra estados de destaque com a cor primária, usar com moderação).

**Animação** — nunca importar Framer Motion direto num componente de página;
usar as variantes prontas de `src/lib/motion.ts` (`fade`, `slideUp`,
`slideDown`, `slideFromRight`, `scaleIn`, `overlayFade`, `cardHover`,
`pageTransition`, `staggerContainer`).

## Como reutilizar

Importar sempre pelo alias, nunca por caminho relativo:

```tsx
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/shared/ProductCard';
```

Exemplo de composição (card de produto com badge de desconto dentro de um Grid):

```tsx
import { Grid } from '@/components/ui/Grid';
import { ProductCard } from '@/components/shared/ProductCard';

<Grid cols={4} gap={6}>
  {products.map((p) => (
    <ProductCard key={p.id} product={p} badge="discount" discountPercent={20} />
  ))}
</Grid>
```

Componentes com overlay (Dialog, Drawer, Toast, Tooltip) já vêm animados
via Framer Motion por dentro — não é preciso envolver com `<motion.div>`
externamente.

## Dependências adicionadas nesta fase

- `@radix-ui/react-dialog`, `-dropdown-menu`, `-tabs`, `-accordion`,
  `-tooltip`, `-checkbox`, `-radio-group`, `-switch`, `-select`,
  `-avatar`, `-progress`, `-toast`, `-slot`

Motivo: são componentes onde acessibilidade (foco, ARIA, navegação por
teclado, comportamento de screen reader) é difícil de acertar reimplementando
do zero, e errar isso é o tipo de detalhe que separa uma interface amadora
de uma "nível Apple/Stripe/Linear". Radix resolve o comportamento sem
impor nenhum estilo visual — todo o CSS aplicado é nosso, via Tailwind e os
tokens acima. Não é um framework de UI, é uma camada de comportamento.

`zustand` (já era dependência da stack, agora também usado internamente
pelo `Toast.tsx` pra manter a fila de toasts globalmente).

## Decisões de design

1. **Switch cobre "Switch" e "Toggle".** São o mesmo padrão de interface
   (estado binário, mudança imediata); duas APIs pro mesmo componente
   geraria inconsistência.

2. **Dialog cobre "Dialog" e "Modal".** Mesma lógica — overlay + conteúdo
   centralizado. A variante lateral é o `Drawer`, que é estruturalmente
   diferente (entra pela lateral, ocupa a altura da tela) e por isso é um
   componente à parte.

3. **Badge vs. Chip vs. Tag** — os três parecem parecidos mas resolvem
   coisas diferentes: `Badge` é estático e comunica *status de sistema*
   (sucesso, erro, "novo", "ao vivo"); `Chip` é *interativo* (clicável,
   removível — usado em filtros); `Tag` é estático mas de *marca/categoria*,
   com tipografia mono que remete à identidade visual da Ghostline. Usar
   o errado quebra a leitura semântica da interface.

4. **Card é uma base, não um componente final.** `ProductCard`, `DropCard`,
   `ProfileCard`, `CommentCard` compõem a partir dela. Isso garante que
   qualquer ajuste visual futuro (padding, radius, sombra de hover) se
   propaga pra todos os cards de uma vez, em um lugar só.

5. **Carousel usa scroll nativo com scroll-snap**, não uma lib de slider.
   Mais leve, funciona com touch/teclado de graça, e evita mais uma
   dependência só pra reimplementar o que o browser já faz.

6. **Cores diretas nunca aparecem em componentes** — tudo referencia token
   do Tailwind. Se a marca decidir mudar o roxo primário amanhã, é uma
   linha no `tailwind.config.ts`, não uma busca-e-substitui em 40 arquivos.

7. **Sombras são discretas de propósito** (blur alto, opacidade baixa,
   sem cor saturada exceto `shadow-glow`) — visual premium é mais sobre
   espaço em branco e contraste do que sobre efeitos.

## Acessibilidade — o que já vem resolvido

- Todo componente interativo tem `focus-visible:ring-2` com a cor
  primária — navegação por teclado sempre visível.
- Componentes Radix (Dialog, Drawer, Dropdown, Tabs, Accordion, Select,
  Checkbox, Radio, Switch, Tooltip, Toast) já implementam roving focus,
  ARIA roles/states corretos e fechamento via Esc onde faz sentido.
- `IconButton` exige `label` como prop obrigatória — impossível criar um
  botão de ícone sem texto acessível.
- `Input`/`Textarea` sempre associam label ao campo via `htmlFor`/`id`, e
  erros são anunciados via `aria-describedby` + `aria-invalid`.
- `Rating` expõe o valor como texto via `aria-label`, já que estrelas
  visuais não são lidas por screen readers.

## O que NÃO foi construído nesta fase (por instrução explícita)

Nenhuma página — Home, Shop, Drops, Ghost Studio, Community, Ghost
Society, Profile, Admin continuam não implementadas. Este pacote é só o
Design System. `layout.tsx` foi tocado apenas para registrar os dois
providers globais (`TooltipProvider`, `Toaster`) — sem isso, Tooltip e
Toast não funcionam em nenhuma página futura.

Aguardando instrução pra avançar.

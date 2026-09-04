# Correções aplicadas nesta versão

- Corrigida a falha 500 causada por funções de Server Component passadas para o componente client da newsletter.
- Newsletter agora funciona em modo demonstração sem exigir backend configurado.
- Criadas rotas navegáveis para Drops, Ghost Studio, Community, Ghost Society, Sobre, Suporte e Login.
- Criadas páginas básicas para Perfil e Painel Administrativo.
- Middleware ajustado para permitir visualização local quando as variáveis do Supabase ainda não estiverem configuradas.
- Mantidas intactas as páginas Home, Shop e Produto já existentes.

## Para executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

# Consorcio CRM

Aplicação completa em `Next.js` para consultores:

- login autenticado
- cadastro e acompanhamento de clientes
- registro de follow-ups
- simulador persistido em banco
- geração de PDF no backend
- estrutura pronta para deploy no Railway com PostgreSQL

## Módulos implementados

- autenticação de consultores
- dashboard com visão geral
- clientes com status, contato e próximo follow-up
- interações de acompanhamento
- simulações vinculadas a clientes
- PDF comercial gerado no backend

## Ambiente local

1. Copie `.env.example` para `.env`.
2. Preencha `DATABASE_URL` e `AUTH_SECRET`.
3. Gere o client do Prisma.
4. Suba o schema no banco.
5. Rode o app.

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Abra `http://localhost:3000`.

## Deploy no Railway

1. Crie um serviço `PostgreSQL` no Railway.
2. Crie um serviço para esta aplicação.
3. Configure as variáveis:
   - `DATABASE_URL`
   - `AUTH_SECRET`
4. O arquivo `railway.json` já está configurado para:
   - build com `npm install && npm run build`
   - start com `npm run db:push && npm start`

## Estrutura principal

- `app/login` e `app/setup`: acesso inicial
- `app/dashboard`: área autenticada
- `app/api`: rotas de auth, clientes, interações e simulações
- `prisma/schema.prisma`: banco PostgreSQL
- `lib/auth.js`: sessão e autenticação
- `lib/simulator.js`: regras do simulador
- `lib/report-pdf.js`: PDF no backend

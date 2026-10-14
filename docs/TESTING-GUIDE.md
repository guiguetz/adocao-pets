# Roteiro de Testes — Epic e01 (Setup)

## Pré-requisitos

1. **Google OAuth** configurado (para login funcionar)
2. **DATABASE_URL** no `.env` (Prisma Postgres)
3. **AUTH_SECRET** no `.env` (pode usar qualquer string em dev)

## Testes Manuais

### 1. Login com Google

1. Acesse `/auth/login`
2. Clique em "Entrar com Google"
3. Faça login com sua conta Google
4. Verifique se redireciona para `/admin`

### 2. Dashboard Admin

1. Após login, veja se seu nome aparece no header
2. Clique em "Sair"
3. Verifique se volta para a página inicial

### 3. Proteção de Rotas

1. Sem estar logado, acesse `/admin`
2. Verifique se redireciona para `/auth/login`
3. Faça login e verifique se acessa `/admin`

### 4. Seed Data (desenvolvimento)

```bash
# Rodar seed (precisa de banco acessível)
pnpm prisma db seed
```

**Dados criados:**

- 2 ONGs: "Amigos dos Animais", "Patinhas Felizes"
- 2 Admins: Maria Silva, João Santos
- 4 Pets (2 por ONG)

### 5. Banco de Dados

```bash
# Verificar tabelas criadas
pnpm prisma studio
```

**Tabelas esperadas:**

- `organizations`
- `users`
- `accounts` (Auth.js)
- `sessions` (Auth.js)
- `verification_tokens` (Auth.js)
- `pets`

## Deploy na Vercel

### 1. Merge o PR

```bash
gh pr merge 2 --squash
```

### 2. Configurar na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório `adocao-pets`
3. Configure as Environment Variables:
   ```
   DATABASE_URL=postgres://... (Prisma Postgres)
   AUTH_SECRET=<gere com: openssl rand -base64 32>
   AUTH_GOOGLE_ID=<seu-google-client-id>
   AUTH_GOOGLE_SECRET=<seu-google-client-secret>
   NEXT_PUBLIC_APP_URL=https://adocao-pets.vercel.app
   ```
4. Deploy!

### 3. Configurar Google OAuth para Produção

1. Acesse [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Crie um novo OAuth 2.0 Client ID
3. Adicione os Redirect URIs:
   ```
   https://adocao-pets.vercel.app/api/auth/callback/google
   ```
4. Copie o Client ID e Secret para as envs da Vercel

## Troubleshooting

### Erro "Can't reach database"

- Verifique se DATABASE_URL está correta
- Prisma Postgres pode ter restrição de IP

### Erro "OAuth error"

- Verifique AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET
- Confirme os Redirect URIs no Google Console

### Middleware não funciona

- Verifique se `src/middleware.ts` está na raiz de `src/`
- Cheque se o matcher está correto

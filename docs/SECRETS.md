# GitHub Actions Secrets

Este documento lista os secrets necessários para o CI/CD do projeto.

## Secrets Obrigatórios

| Secret               | Descrição                     | Onde obter                                                                |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`       | URL de conexão PostgreSQL     | Seu provedor de banco (Supabase, Neon, etc.)                              |
| `AUTH_SECRET`        | Chave secreta do Auth.js      | `openssl rand -base64 32`                                                 |
| `AUTH_GOOGLE_ID`     | Client ID do Google OAuth     | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `AUTH_GOOGLE_SECRET` | Client Secret do Google OAuth | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |

## Variáveis de Ambiente (GitHub Variables)

| Variable              | Descrição        | Valor padrão            |
| --------------------- | ---------------- | ----------------------- |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação | `http://localhost:3000` |

## Como Configurar

### 1. Acesse o GitHub do repositório

```
Settings → Secrets and variables → Actions
```

### 2. Adicione os Secrets

Clique em **"New repository secret"** e adicione cada um:

```
Name: DATABASE_URL
Value: postgresql://user:password@host:5432/adocao_pets
```

```
Name: AUTH_SECRET
Value: <gere com `openssl rand -base64 32`>
```

```
Name: AUTH_GOOGLE_ID
Value: <seu-google-client-id>
```

```
Name: AUTH_GOOGLE_SECRET
Value: <seu-google-client-secret>
```

### 3. Adicione as Variables (opcional)

Clique em **"New repository variable"**:

```
Name: NEXT_PUBLIC_APP_URL
Value: https://adocaopets.com.br
```

## Para Desenvolvimento Local

Crie um arquivo `.env` na raiz do projeto (nunca commitado):

```bash
cp .env.example .env
# Edite com seus valores reais
```

## CI - Banco de Testes

O CI já configura automaticamente um PostgreSQL para testes de integração.
O `AUTH_SECRET` de teste é gerado automaticamente no workflow.

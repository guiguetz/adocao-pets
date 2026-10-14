# Adoção de Pets

Plataforma open-source de adoção, apadrinhamento e resgate animal.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon) com Prisma
- **Auth:** Auth.js com Google
- **Tests:** Vitest (unit/integration) + Playwright (E2E/visual)
- **CI/CD:** GitHub Actions + Vercel

## Pré-requisitos

- Node.js >= 22 (ver `.nvmrc`)
- pnpm >= 9
- PostgreSQL (local ou Neon)

## Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar migrations
pnpm db:migrate

# Seed do banco
pnpm db:seed

# Iniciar bigpowers
npx bigpowers init

# Rodar verificação completa
pnpm verify
```

## Comandos

| Comando                 | Descrição                                              |
| ----------------------- | ------------------------------------------------------ |
| `pnpm dev`              | Servidor de desenvolvimento                            |
| `pnpm build`            | Build de produção                                      |
| `pnpm start`            | Servidor de produção                                   |
| `pnpm test:unit`        | Testes unitários                                       |
| `pnpm test:integration` | Testes de integração                                   |
| `pnpm test:e2e`         | Testes E2E                                             |
| `pnpm verify`           | Verificação completa (lint + typecheck + test + build) |

## Estrutura

```
src/
├── app/          # Next.js App Router
├── components/   # Componentes React
├── server/       # Lógica do servidor
│   └── db/       # Repositórios e acesso ao banco
└── modules/      # Módulos feature-based
tests/
├── integration/  # Testes de integração
├── e2e/          # Testes E2E
└── visual/       # Testes visuais
specs/            # Documentação do bigpowers
```

## Contribuição

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## Licença

MIT

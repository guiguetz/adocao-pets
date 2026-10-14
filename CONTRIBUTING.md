# Contribuindo

## Fluxo de trabalho

1. Criar issue descrevendo a mudança
2. Criar branch `<tipo>/<número>-<slug>` (ex: `feat/123-add-login`)
3. Implementar com commits Conventional Commits
4. Rodar `pnpm verify` antes de push
5. Abrir PR com `Closes #<issue>`
6. Aguardar CI verde e revisão

## Commits

Formato: `<type>(<scope>): <description>`

Tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`

Escopos: `auth`, `orgs`, `pets`, `discovery`, `queue`, `scheduling`, `ci`, `deps`, `docs`

## Hooks

Os hooks locais rodam automaticamente:

- **pre-commit:** Prettier + ESLint nos arquivos alterados
- **commit-msg:** Valida formato Conventional Commits
- **pre-push:** Valida branch e roda `pnpm verify:fast`

**IMPORTANTE:** `--no-verify` é proibido. O CI bloqueia merge de qualquer forma.

## Verificação

```bash
pnpm verify       # Verificação completa
pnpm verify:fast  # Verificação rápida (typecheck + unit)
```

## Regras

- Não faça push direto na `main`
- Não force push em branch compartilhada
- Não adicione `Co-authored-by` ou atribuição a IA
- Issues são criadas apenas por `tools/sync-issues.ts`
- Todo acesso ao banco passa por `src/server/db/`
- Valide toda entrada externa com Zod
- Testes para toda nova função e correção de bug

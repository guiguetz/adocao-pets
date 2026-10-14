# Prompt de implementação — Repositório, CI e automações

Oct 11, 2026 · @Guilherme

## 1. Missão e escopo

Implemente a infraestrutura de desenvolvimento do repositório do app de adoção de pets: estrutura de pastas, guidelines para agentes, hooks locais, CI no GitHub Actions, proteção de branch, automação do GitHub Project e a ponte entre o planejamento do bigpowers (specs/) e as issues do GitHub. Não implemente funcionalidades do produto; elas estão no documento "Prompt inicial — App de adoção de pets (Codevida)".

O objetivo é que nenhum código chegue à `main` sem passar pelas mesmas verificações, seja escrito por uma pessoa ou por um agente, e que issues, PRs e cards do Project andem sozinhos.

**Premissas**

- A stack vem do documento do produto: Next.js, TypeScript e Tailwind; PostgreSQL (Neon) com Prisma; Auth.js com Google; Vitest e Playwright.
- Repositório único (sem monorepo), com pnpm como gerenciador de pacotes. Node fixado em `.nvmrc` e no campo `engines` do `package.json`.
- Desenvolvimento solo ou em time pequeno, com agentes de IA (Pi com bigpowers) escrevendo parte do código.
- Hospedagem em Vercel com PostgreSQL gerenciado.

**Como trabalhar**

1. Leia o documento inteiro e responda com um plano curto, seguindo a ordem da seção 14.
2. Se faltar informação (por exemplo, o arquivo de guideline do dono), não invente: crie o arquivo com marcação `TODO` e registre a pendência na descrição do PR.
3. Entregue por etapas, cada uma em um PR próprio. Antes de tornar um check obrigatório, prove que ele funciona abrindo um PR de teste que o faz falhar de propósito.
4. Use apenas ações e ferramentas mantidas ativamente. Fixe a versão major mais recente de cada GitHub Action e deixe o Dependabot atualizá-las.
5. Escreva documentação em português do Brasil; identificadores de código, nomes de branch e mensagens de commit em inglês.

## 2. Estrutura do repositório

Crie exatamente esta estrutura; arquivos sem conteúdo definido neste documento entram com um esqueleto mínimo e um `TODO`.

```
.
├── AGENTS.md                 # regras para qualquer agente; aponta para CONVENTIONS.md
├── CLAUDE.md                 # importa o AGENTS.md
├── CONVENTIONS.md            # guideline de código, git, teste e nomenclatura (do dono)
├── PRODUCT.md  DESIGN.md     # gerados pelo Impeccable (/impeccable init e document)
├── README.md  CONTRIBUTING.md
├── package.json  pnpm-lock.yaml  .nvmrc  .env.example
├── eslint.config.mjs  tsconfig.json  commitlint.config.js
├── vitest.config.ts  playwright.config.ts  lighthouserc.js
├── .husky/                   # pre-commit, commit-msg, pre-push
├── .github/
│   ├── workflows/            # ci.yml  security.yml  pr-hygiene.yml
│   │                         # project-automation.yml  visual-baseline.yml  sync-issues.yml
│   ├── ISSUE_TEMPLATE/       # bug.yml  feature.yml  task.yml  config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
├── .impeccable/              # config.json, design.json, surfaces/, critique/ versionados
├── .pi/ ou .agents/          # skills instaladas (bigpowers, impeccable)
├── specs/                    # cockpit do bigpowers: state.yaml, release-plan.yaml, epics/,
│                             # product/ (escopo e visão), adr/ (decisões), metrics/
├── docs/
│   ├── product-spec.md       # o prompt inicial do produto, com requisitos numerados (R-001...)
│   └── runbooks/
├── src/                      # app; testes unitários ao lado do código (*.test.ts)
├── prisma/  (ou drizzle/)    # schema e migrations
├── tests/
│   ├── integration/          # banco real, inclui isolamento entre entidades
│   ├── e2e/                  # specs Playwright, fixtures e helper de login de teste
│   └── visual/               # specs e snapshots de regressão visual
├── tools/                    # seed, banco de teste, check-branch.sh, sync-issues e check-traceability
└── scripts                   # link criado por `npx bigpowers init`; não versionar
```

**Regras**

- Testes unitários ficam ao lado do código; integração, e2e e visuais ficam em `tests/`.
- `.env.example` lista toda variável usada, sem valores reais. Nenhum segredo entra no repositório.
- `CLAUDE.md` importa o `AGENTS.md`, para existir uma única fonte de regras. Se o `seed-conventions` do bigpowers gerar conteúdo próprio nesses arquivos, mescle sem duplicar regras e sem sobrescrever o que o dono escreveu (seção 4).
- `scripts/` pertence ao bigpowers: o `npx bigpowers init` cria ali um link simbólico para os scripts do pacote e recusa uma pasta existente. Por isso o código do projeto fica em `tools/`, o link `scripts` entra no `.gitignore` e o `README` manda rodar `npx bigpowers init` depois do `pnpm install`.
- `specs/` é a memória do bigpowers (estado, plano, épicos, ADRs e métricas) e é versionada; a única exceção possível está na seção 15.

## 3. Fluxo de trabalho

O fluxo é trunk-based: a `main` está sempre pronta para deploy e todo trabalho entra por PR curto, vinculado a uma issue.

**Branches e commits**

- Nome da branch: `<tipo>/<número-da-issue>-<slug>`, com tipos `feat`, `fix`, `chore`, `docs`, `refactor`, `test` e `ci`. O `kickoff-branch` do bigpowers cria a branch e o worktree com esse nome (regra registrada no `CONVENTIONS.md`); fora do bigpowers, use `gh issue develop <n> --checkout`. O vínculo com a issue vem sempre do `Closes #<issue>` no PR.
- Commits seguem Conventional Commits, validados por commitlint. Escopos permitidos: `auth`, `orgs`, `pets`, `discovery`, `queue`, `scheduling`, `ci`, `deps`, `docs`.
- Nunca faça push direto na `main` nem force push em branch compartilhada.

**Pull requests**

- Título no formato Conventional Commits, porque o merge é squash e o título vira a mensagem final.
- O corpo preenche o template e inclui `Closes #<issue>`, para o vínculo e o fechamento automáticos.
- Abra como rascunho (draft) enquanto o trabalho não está pronto. Os checks pesados (e2e, visual, acessibilidade) só rodam fora do rascunho (seção 7).
- Mantenha o PR pequeno; acima de 400 linhas alteradas o PR ganha o rótulo `size/L` como aviso, sem bloquear.
- Merge somente por squash, com exclusão automática da branch após o merge.

**Issues e rótulos**

- Uma issue por story do bigpowers, criada pelo script `sync:issues` a partir de `specs/epics/` (seção 11), com critérios de aceite em lista de tarefas e o milestone da fase correspondente (`fase-0` a `fase-4`, do documento do produto). Issues avulsas (bug, tarefa de infraestrutura) usam os templates da seção 12.
- Rótulos de tipo (`feature`, `bug`, `chore`, `docs`) e de área (`auth`, `orgs`, `pets`, `discovery`, `queue`, `scheduling`, `infra`, `design`).

**Quando o autor é um agente**

1. Segue o ciclo do bigpowers (seção 4): o `kickoff-branch` cria a branch e o worktree da story.
2. Roda `pnpm verify` (seção 6) antes de cada push; esse é o comando `verify:` das tarefas.
3. Abre o PR com o template preenchido, descrevendo o que foi testado e o que ficou de fora, e só segue para o merge depois que o dono validar o comportamento no `verify-work`.

**Paralelismo (no máximo 2 stories)**

Paralelize pela ordem abaixo, do mais seguro ao mais arriscado, e só passe ao próximo degrau depois de provar o anterior com uma story real.

1. **Pipeline com revisor.** Enquanto uma story espera o seu aceite no `verify-work`, outra sessão do Pi constrói a próxima. O aceite acontece no preview do PR (Vercel com branch de banco do Neon), e o `request-review` dispara um revisor com contexto limpo antes de você validar.
2. **Stories que podem rodar juntas.** Cada story em `specs/epics/` declara `touches` (pastas e módulos), `depends_on` (IDs de stories) e `migrations` (verdadeiro ou falso), como convenção do projeto registrada em ADR. O script `tools/ready-stories.ts` lê `specs/epics/` e `specs/execution-status.yaml` e lista as stories prontas: dependências concluídas, `touches` sem sobreposição com as em andamento e no máximo uma story com migration por vez. Ele recusa a lista quando já há 2 stories em andamento.
3. **Worktrees em paralelo.** Uma sessão do Pi (tmux) por story, cada uma em seu worktree. O `kickoff-branch` parte da raiz do repositório principal, com a branch padrão limpa e o Preflight verde. Depois, `tools/worktree-up.sh <story-id>` cria a branch de banco do Neon (`neonctl`), escreve o `.env.local` do worktree com essa conexão e uma porta própria para `next start` e Playwright, e abre a janela do tmux. `tools/worktree-down.sh <story-id>` remove a branch de banco e imprime os comandos de limpeza do worktree, sem executá-los.
4. **Subagentes dentro de uma story.** O Pi já tem a extensão de subagentes, então o `dispatch-agents` pode ser usado dentro de uma story, só para tarefas independentes: sem arquivos nem estado em comum, e migrations e configurações contam como estado. Cada subagente recebe um briefing com `in_scope`, `out_of_bounds` e `verify`; o disjuntor abre após 3 falhas e há no máximo 3 ciclos. O agente principal integra o resultado e roda `pnpm verify`.

**Cuidados do paralelismo**

- O `state.yaml` diverge em cada worktree. Use `release-branch --squash-state` e não comite estados intermediários.
- O lock por story em `specs/agent-locks.yaml` vale por cópia do repositório, então a coordenação entre worktrees é feita pelo `ready-stories`, não por ele.
- O `kickoff-branch` usa o slug da tarefa como nome da pasta e da branch, e o padrão `<tipo>/<número>-<slug>` tem barra. Na primeira story em paralelo, teste e registre a solução em ADR (por exemplo, pasta `../<número>-<slug>` com a branch criada pelo script).
- O `kickoff-branch` oferece comitar `specs/` sujo na `main` local; recuse, porque a `main` local não recebe commits diretos.

## 4. Guideline e agentes

A guideline do dono vive em arquivos versionados que os agentes leem antes de agir; o que for regra mecânica vira lint, hook ou check, porque instrução em texto não bloqueia nada.

**Arquivos de regras**

- `AGENTS.md`: stack, comandos (`pnpm verify`), fluxo de branch e PR, e as proibições. Entre elas: não usar `--no-verify`, não alterar workflows, rulesets ou segredos sem pedido explícito, não commitar segredos e escrever toda interface em pt-BR.
- `CONVENTIONS.md`: padrões de código, teste e nomenclatura do dono. Se o dono não fornecer o conteúdo, crie o arquivo com as seções vazias e `TODO`; não invente regras além das deste documento e do documento do produto.
- `CLAUDE.md`: apenas a importação de `AGENTS.md`.

**bigpowers (Pi)**

- É um pacote de skills e metodologia que orienta o agente; ele não bloqueia push. Instale com `pi install npm:bigpowers` (ou `npx bigpowers@latest setup`) e documente o comando no `README`.
- Pacotes do Pi executam código e influenciam o comportamento do agente: revise o pacote antes de instalar e registre a versão usada.
- Peça ao agente que rode a skill `using-bigpowers` uma vez, para ele conhecer o ciclo de trabalho e quando chamar cada skill.

**Impeccable**

- Na raiz do projeto, rode `npx impeccable install` com escopo de projeto e os provedores efetivamente usados (por exemplo `pi` e `claude`). Aceite a instalação do hook de design.
- Rode `/impeccable init` para gerar o `PRODUCT.md`, usando o documento do produto como fonte de público, propósito e restrições. Rode `/impeccable document` assim que existirem componentes, para gerar o `DESIGN.md`.
- Adicione ao `.gitignore` o bloco recomendado pela documentação do Impeccable (entre os marcadores `impeccable-ignore-start` e `impeccable-ignore-end`). Mantenha versionados `config.json`, `live/config.json`, `design.json`, `surfaces/*.md` e `critique/*.md`.
- Qualquer regra do detector ignorada vai em `.impeccable/config.json`, sempre com o motivo registrado.
- Antes de abrir PR que altere interface, o agente roda `/impeccable audit` e `/impeccable critique`, salva o relatório em `.impeccable/critique/` e linka no PR. Esses comandos usam LLM e não são checks obrigatórios.

**Ciclo do bigpowers neste repositório**

- O documento do produto (`docs/product-spec.md`) é a entrada da fase 1 do `orchestrate-project`; as fases 1 a 3 geram `specs/release-plan.yaml` e `specs/epics/`, com as stories e as tarefas `[BCP N]` e `verify:`.
- Para construir uma story, chame o `build-epic`: ele conduz o ciclo de uma story e é chamado pelo `orchestrate-project` na fase 4. Por padrão executa um passo por chamada; peça execução completa quando quiser. Os passos de kickoff, TDD, verificação e release dependem da sua participação ou do estado da branch. A versão atual da skill começa com um passo 0 de modelagem de ameaças (`security-review`).
- Rode `seed-conventions` uma vez, antes de editar `CONVENTIONS.md`, `CLAUDE.md` e `AGENTS.md`. Ele cria arquivos próprios; mescle o resultado com o conteúdo deste documento sem sobrescrever o que o dono escreveu.
- Integração por PR: use o modo padrão do `release-branch` (`gh pr create`), nunca o perfil `solo-git` nem o `land-branch.sh`, que pulariam o ruleset e o CI.
- Registre no `CONVENTIONS.md` as regras de git (nome de branch `<tipo>/<número-da-issue>-<slug>`, Conventional Commits e `Closes #<issue>` no PR), que é onde o bigpowers espera encontrá-las.
- Todo `verify:` de tarefa usa os scripts do projeto (`pnpm verify`, `pnpm test:unit`). Na primeira rodada do `audit-code`, confirme qual comando de conformidade ele usa neste projeto e registre a resposta em um ADR; o gate de 94% não pode ser rebaixado.
- O `verify-work` (validação de comportamento) e a confirmação do `release-branch` são do dono: o agente para e espera.

**Decisões sobre o `CONVENTIONS.md` do bigpowers**

- `workflow_mode`: o seed cria `specs/state.yaml` com `workflow_mode: solo-git`, que pula o PR. Troque para `team-pr` logo depois do `seed-conventions`. O job `static` do CI falha se o valor não for `team-pr`.
- As regras do projeto ficam fora dos blocos `<!-- BEGIN bigpowers:… -->` e `<!-- END bigpowers:… -->` do `AGENTS.md`; o bigpowers só reescreve o que está dentro dos blocos. O `CLAUDE.md` gerado é um link para o `AGENTS.md`.
- Rastreabilidade: toda story tem a tag `story: eNNsNN` em código ou teste. O job `story-trace` do CI instala o bigpowers na versão fixada, roda `npx bigpowers init` e depois `bash scripts/trace-stories.sh --strict`.
- Limites de tamanho: arquivos de até 300 linhas e funções de até 40, aplicados pelo ESLint (`max-lines` e `max-lines-per-function`). Isso substitui a regra do modelo de 4 a 20 linhas por função.
- Atribuição: mantenha a regra do modelo que proíbe `Co-authored-by` e qualquer rodapé que atribua código a agente de IA.
- Issues: mantenha a regra de que agentes não criam issues nem chamam a API REST do GitHub. Acrescente a exceção: `tools/sync-issues.ts` é ferramenta do dono, usa o `gh`, e só o dono ou o CI o executam.
- Estilo: o `AGENTS.md` e o `CONVENTIONS.md` ficam em inglês, com linhas imperativas de até 20 palavras e vocabulário diretivo (MUST, NEVER), porque é isso que o validador do bigpowers espera. O job `static` roda `validate-agentic-ste.sh --strict` nos dois arquivos, se o script existir na versão instalada.

**Seção do app para o `CONVENTIONS.md`**

Cole este bloco no `CONVENTIONS.md` depois do conteúdo gerado pelo `seed-conventions`.

```markdown
## App rules

### Git
- MUST name branches `<type>/<issue-number>-<slug>`.
- MUST write Conventional Commits. Allowed scopes: auth, orgs, pets, discovery, queue, scheduling, ci, deps, docs.
- MUST open a PR for every change. MUST include `Closes #<issue>` in the PR body.
- MUST keep `workflow_mode: team-pr` in `specs/state.yaml`.
- NEVER push to `main`. NEVER use `--no-verify`.
- NEVER add `Co-authored-by` or any AI attribution footer to commits.
- NEVER create GitHub issues from agents. Only `tools/sync-issues.ts`, run by the owner or CI, creates issues.

### Commands
- Preflight is `pnpm verify`. It MUST pass before the kickoff, develop, and verify steps.
- `pnpm verify:fast` runs typecheck, related unit tests, and the design detector.

### Architecture
- MUST access the database only through `src/server/db/`. Every query MUST filter by `organization_id`.
- MUST check authorization on the server for every route and action.
- NEVER trust roles or entity ids sent by the client.
- MUST validate all external input with Zod at the boundary.
- MUST keep migrations compatible with the previous app version: expand, migrate, then contract.

### Code style
- Files MUST NOT exceed 300 lines. Functions MUST NOT exceed 40 lines. ESLint enforces both.
- MUST use explicit types. NEVER use `any`.
- MUST use early returns. MUST NOT nest conditionals deeper than two levels.
- MUST extract magic strings and numbers into named constants.
- Exception messages MUST include the offending value, the expected shape, and a remediation hint.

### Tests
- MUST add a test for every new function and a regression test for every bug fix.
- MUST add a tenant-isolation test for every new query or route that touches organization data.
- MUST tag each story with `story: eNNsNN` in implementing code or tests.
- NEVER skip a test without a written ambiguity note.
- NEVER use fixed waits in e2e tests. Use role and label selectors.

### UI and accessibility
- MUST write all user-facing text in pt-BR.
- MUST meet WCAG 2.1 AA. Every swipe gesture MUST have a keyboard-reachable button.
- MUST follow the `DESIGN.md` tokens. MUST run `/impeccable audit` before opening a UI PR.

### Privacy
- NEVER log phone numbers, e-mail addresses, or screening answers.
- NEVER put real personal data in fixtures or seeds.
- MUST show contact data only to users the flow authorizes.

### Never do
- NEVER edit skill files installed by bigpowers or Impeccable. Update them with their installers.
- NEVER change workflows, rulesets, or secrets unless the owner asks.
- NEVER mark a story done before the owner confirms behavior in `verify-work`.
```

Acrescente também estas regras de paralelismo ao bloco anterior:

```markdown
### Parallel work
- MUST declare `touches`, `depends_on`, and `migrations` for every story in its epic file.
- MUST NOT run two stories at once when their `touches` overlap.
- MUST NOT run two stories with migrations at the same time.
- MUST limit work in progress to two stories.
- MUST give each worktree its own Neon branch, port, and `.env.local`.
- MUST use `release-branch --squash-state`. NEVER commit intermediate `chore(state)` commits.
- MUST dispatch subagents only for tasks that share no files or state.
```

## 5. Hooks locais

Os hooks dão feedback rápido antes do commit e do push, mas podem ser pulados, então o CI repete tudo e é o gate de verdade.

| Hook | O que roda | Meta de tempo |
| --- | --- | --- |
| `pre-commit` | `lint-staged`: Prettier e ESLint com correção nos arquivos em stage | até 10 s |
| `commit-msg` | `commitlint` na mensagem | instantâneo |
| `pre-push` | `tools/check-branch.sh` e `pnpm verify:fast` | até 60 s |

`tools/check-branch.sh` falha o push quando:

- a branch é `main` ou não segue `<tipo>/<número>-<slug>`;
- algum commit de `origin/main..HEAD` não passa no commitlint;
- existem arquivos de segredo ou `.env` versionados.

`pnpm verify:fast` roda typecheck, testes unitários dos arquivos alterados (`vitest related`) e `npx impeccable detect` nos arquivos de interface alterados.

**Regras da guideline que viram lint**

- `no-restricted-imports`: o cliente do ORM só pode ser importado dentro de `src/server/db/`. Todo acesso a dados passa por funções com escopo de entidade (`organization_id`), para proteger o isolamento entre instituições.
- `no-console` em `src/`, exceto no logger do projeto.
- `eslint-plugin-jsx-a11y` no conjunto estrito.
- `max-lines` (300 linhas por arquivo) e `max-lines-per-function` (40 linhas por função), ignorando linhas em branco e comentários.

**Instalação**

- Husky configurado pelo script `prepare` do `package.json`, para os hooks existirem após `pnpm install`.
- Documente no `CONTRIBUTING.md` que `--no-verify` é proibido; o CI bloqueia o merge de qualquer forma.

## 6. Scripts e ferramentas

Os mesmos scripts rodam no terminal, nos hooks e no CI, para o resultado local ser igual ao do GitHub.

| Script | O que faz |
| --- | --- |
| `dev`, `build`, `start` | Ciclo normal do Next.js |
| `format`, `format:check` | Prettier (escrita e verificação) |
| `lint` | ESLint com a configuração flat do projeto |
| `typecheck` | `tsc --noEmit` |
| `test:unit` | Vitest, com cobertura |
| `test:integration` | Vitest contra um PostgreSQL real, incluindo isolamento entre entidades |
| `test:e2e` | Playwright, specs de `tests/e2e/` |
| `test:a11y` | Specs Playwright marcadas `@a11y`, com axe |
| `test:visual` | Specs Playwright de `tests/visual/` com `toHaveScreenshot` |
| `design:detect` | `npx impeccable detect --json src/`, com saída salva em arquivo |
| `db:migrate`, `db:seed`, `db:test:reset` | Migrations, seed (Codevida, super admin e pets fictícios) e banco de teste limpo |
| `verify:fast` | `typecheck`, testes unitários dos arquivos alterados e `design:detect` nos arquivos de interface alterados |
| `verify` | `format:check`, `lint`, `typecheck`, `test:unit`, `test:integration`, `design:detect` e `build` |
| `verify:full` | Tudo de `verify`, mais test:lighthouse, `test:e2e`, `test:a11y` e `test:visual` |
| sync:issues | Cria e atualiza no GitHub as issues das stories de specs/epics/ e as adiciona ao Project; aceita --dry-run (seção 11) |
| check:trace | Falha se um requisito numerado de docs/product-spec.md não aparece em nenhuma story, ou se uma story cita um requisito que não existe (seção 11); roda no job static do CI |
| test:lighthouse | Lighthouse CI (lhci autorun) nas páginas públicas, com as metas da seção 9 |

**Ferramentas fixas**

- pnpm, ESLint, Prettier, Vitest, Playwright, `@axe-core/playwright`, commitlint, Husky e lint-staged.
- `verify` é o que o agente roda antes do push. `verify:full` é o equivalente local do CI completo e roda sob demanda, porque é lento.

## 7. Workflows do GitHub Actions

Seis workflows cobrem validação, segurança, higiene do PR, Project, atualização de snapshots e sincronização de issues; o `ci.yml` é o principal e tem um job final que concentra o resultado.

| Workflow | Gatilho | Para que serve |
| --- | --- | --- |
| `ci.yml` | `pull_request` (abertura, novos commits, reabertura e saída de rascunho) e `push` na `main` | Valida o código |
| `security.yml` | PR, push na `main` e agenda semanal | Dependências, análise estática e segredos |
| `pr-hygiene.yml` | `pull_request` | Título, vínculo com issue, nome da branch e rótulo de tamanho |
| `project-automation.yml` | Eventos de issue e PR | Move os cards do Project (seção 11) |
| `visual-baseline.yml` | `workflow_dispatch` e rótulo `update-snapshots` | Regera snapshots visuais no runner Linux e faz commit na branch do PR |
| sync-issues.yml | push na main com mudanças em specs/, e workflow\_dispatch | Cria e atualiza as issues das stories (seção 11) |

**Jobs do `ci.yml`**

1. `static`: `format:check`, `lint` e `typecheck`. Roda em todo PR, inclusive rascunho. Executa também a checagem de rastreabilidade (seção 11), confere que specs/state.yaml tem workflow\_mode: team-pr e valida o AGENTS.md e o CONVENTIONS.md com validate-agentic-ste.sh --strict (seção 4).
2. `unit`: Vitest com cobertura mínima de 80% em `src/domain` (regras de negócio).
3. `integration`: container de serviço PostgreSQL, migrations aplicadas e testes de integração.
4. `migrations`: confere que schema e migrations estão em sincronia e que as migrations aplicam em banco vazio.
5. `build`: `next build`.
6. `design-detect`: `pnpm design:detect`. Falha em saída 1 (alvo não escaneado) e em saída 2 (achados). Anexa o JSON como artefato.
7. `story-trace`: instala o bigpowers na versão fixada, roda `npx bigpowers init` e `bash scripts/trace-stories.sh --strict`. Falha se alguma story não tiver a tag `story: eNNsNN` no código ou nos testes.
8. `e2e`: depende de `build`, com Postgres e seed. Viewport de celular como padrão e um smoke test em desktop. Pulado em rascunho.
9. `a11y`: specs `@a11y` nas telas-chave. Pulado em rascunho.
10. `visual`: specs de regressão visual. Pulado em rascunho.
11. `lighthouse`: `lhci autorun` contra o build de produção, nas páginas públicas e com as metas da seção 9. Depende de `build`. Pulado em rascunho.
12. `ci-ok`: depende de todos, roda sempre (`if: always()`) e falha se qualquer job falhou ou foi cancelado; jobs pulados por rascunho ou por filtro de caminho contam como sucesso. **Este é o único check obrigatório no ruleset.**

**Regras comuns a todos os workflows**

- `permissions` mínimas: `contents: read` por padrão, elevadas só no job que precisa.
- `concurrency` por PR com cancelamento do run anterior (nunca na `main`) e `timeout-minutes` em todo job.
- Cache do store do pnpm via `actions/setup-node` e cache dos navegadores do Playwright pela chave do lockfile. Node lido de `.nvmrc`.
- Relatório do Playwright, traces, cobertura e JSON do detector sobem como artefatos com retenção de 7 dias.
- Filtro de caminho feito dentro do workflow (por exemplo com `dorny/paths-filter`), nunca em `on.paths`, para o check obrigatório não ficar pendente. Mudança só em `docs/` pula `e2e`, `a11y` e `visual`.
- Nunca use `pull_request_target` para executar código de PR, e nenhum segredo fica disponível para forks. Como o repositório é público, os workflows que usam segredos (project-automation, sync-issues e visual-baseline) só rodam para PRs e branches do próprio repositório, nunca de forks.
- Commits feitos com o `GITHUB_TOKEN` não disparam novos workflows. No `visual-baseline.yml`, use o token de um GitHub App para que o CI rode de novo depois do commit dos snapshots.

**Jobs do `security.yml`**

- Revisão de dependências no PR (`actions/dependency-review-action`).
- CodeQL para JavaScript e TypeScript (repositório público, sem custo).
- Secret scanning com push protection ligado nas configurações do repositório, mais gitleaks no CI como segunda camada.
- `pnpm audit --prod` semanal, sem bloquear PRs, abrindo issue quando houver vulnerabilidade alta.

## 8. Estratégia de testes

Os testes protegem primeiro o que mais machuca se quebrar: isolamento entre entidades, permissões, estados da fila e reserva de horários. Escreva cada teste junto com a fase do produto que o exige.

| Camada | Ferramenta | O que cobre | Onde |
| --- | --- | --- | --- |
| Unitário | Vitest | Máquinas de estado (vínculo, pet, interesse, agendamento), regras de fila e prazos, validações Zod | Ao lado do código |
| Integração | Vitest com PostgreSQL real | Repositórios, migrations, transações (sem reserva dupla), autorização | `tests/integration/` |
| Isolamento entre entidades | Vitest com PostgreSQL real | Para cada rota e consulta de painel, um usuário da entidade A tenta ler ou alterar dados da B e recebe 403 ou 404 | `tests/integration/tenancy/` |
| E2E | Playwright | Fluxos críticos abaixo | `tests/e2e/` |
| Acessibilidade | Playwright com axe | Telas-chave (seção 9) | `tests/e2e/`, marcadas `@a11y` |
| Regressão visual | Playwright `toHaveScreenshot` | Telas-chave em celular e desktop | `tests/visual/` |

**Fluxos E2E obrigatórios**

1. Visitante vê o feed em cards e em lista e aplica filtros.
2. Login (simulado) e preenchimento do perfil complementar.
3. Pedido de vínculo, aprovação pelo super admin e publicação de um pet pelo representante.
4. Interessado toca em "Quero adotar", responde à triagem e entra na fila; o representante o chama; o interessado aceita.
5. Dois usuários disputam a última vaga de uma visita e só um consegue reservar.
6. Conclusão da adoção: o pet vira `adotado` e a fila é encerrada.
7. Pessoa física publica anúncios e é barrada ao tentar o quarto.

**Login e dados de teste**

- O login do Google nunca é chamado no CI. Habilite um provider de credenciais de teste do Auth.js apenas quando `NODE_ENV=test` e uma variável secreta estiver presente. Um teste garante que esse provider não existe no build de produção.
- Gere um `storageState` por papel no `globalSetup`: visitante, interessado, pessoa física, representante da entidade A, representante da entidade B, admin e super admin.
- O seed de teste é determinístico e cria duas entidades (A e B) para os testes de isolamento. Nenhum dado pessoal real entra em fixtures.

**Regras contra testes instáveis**

- Nada de `waitForTimeout`; use seletores por papel e rótulo (`getByRole`, `getByLabel`), que também reforçam a acessibilidade.
- Controle o relógio (`page.clock`) nos testes de prazo de 48 horas e de agenda.
- Cada worker usa banco limpo ou dados com prefixo único; nenhum teste depende da ordem de execução.
- No CI, 1 retry no e2e e trace na primeira repetição.

**Regressão visual**

- Gere e compare snapshots só no runner Linux do CI, com fontes locais, animações desligadas e imagens de fixture.
- Viewports 390x844 (celular) e 1280x800 (desktop), com `maxDiffPixelRatio` de 0,01.
- Telas: cards, lista, detalhe do pet, painel da fila e agenda.
- Snapshot muda só pelo `visual-baseline.yml`, e o PR precisa justificar a mudança no template.

## 9. Acessibilidade e design como checks

Quatro checks automáticos barram regressões de acessibilidade, de design e de desempenho, e uma checagem manual cobre o que automação não alcança.

**Checks automáticos**

- **axe no Playwright:** roda nas telas-chave com as tags `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa`. Violações `serious` e `critical` falham o job; as demais aparecem no resumo do run como aviso.
- **ESLint `jsx-a11y`** no conjunto estrito (seção 5).
- **Detector do Impeccable** no job `design-detect` (seção 7). Supressões só em `.impeccable/config.json` ou com `impeccable-disable` inline, sempre com o motivo escrito.

**Telas e estados cobertos pelo axe**

- Home em cards e em lista, detalhe do pet, login e perfil complementar, formulário de pet, painel da fila e agenda.
- Também estados de erro e diálogos abertos, não só a tela inicial.

**Testes específicos de teclado e gestos**

- Todo gesto dos cards (curtir, pular, abrir, desfazer) tem botão equivalente alcançável por teclado.
- O foco fica visível e toda foto tem texto alternativo com o nome do pet.

**Checagem manual (itens no template de PR para mudanças de interface)**

- Passada rápida com leitor de tela (VoiceOver ou TalkBack) no fluxo de cards.
- Zoom de 200% sem perda de conteúdo e respeito a `prefers-reduced-motion`.
- Relatório de `/impeccable audit` e `/impeccable critique` linkado no PR (seção 4).

A ferramenta automática encontra só parte dos problemas, e o próprio Impeccable avisa que uma varredura limpa não prova qualidade visual nem acessibilidade; por isso a checagem manual existe.

**Lighthouse CI (páginas públicas)**

- Roda no job `lighthouse` do `ci.yml` (seção 7), fora do rascunho, com `@lhci/cli` (`lhci autorun`) contra o build de produção (`next start`) com o seed de teste, usando o Chrome já instalado no runner.
- Páginas medidas: home em cards, home em lista, detalhe de um pet do seed e a página pública de uma entidade (`/e/<slug>`). Telas com login ficam de fora; o axe cobre o painel.
- Configuração em `lighthouserc.js`: perfil de celular (o padrão do Lighthouse), 3 execuções por página com a mediana, e relatórios gravados em arquivo e anexados ao run como artefato. Nada é enviado a armazenamento público.
- Metas, alinhadas aos requisitos do documento do produto: acessibilidade mínima de 95 e SEO mínimo de 90 (erro); LCP abaixo de 2,5 s, desempenho e boas práticas mínimos de 90 (aviso).
- Nas duas primeiras semanas, colete a linha de base com os avisos; depois promova LCP e desempenho a erro, ajustando os limites ao que o runner consegue medir de forma estável.
- O resumo do run lista as notas por página. O Lighthouse mede nota e desempenho; o axe continua sendo quem encontra violações específicas, inclusive nas telas autenticadas.

## 10. Proteção de branch e segurança

Um ruleset na `main` torna os checks obrigatórios para todo mundo, inclusive agentes e o próprio dono.

**Ruleset da `main`**

- PR obrigatório. Aprovações: 0 se o desenvolvimento for solo, 1 se houver time; descartar aprovações antigas após novos commits e exigir conversas resolvidas.
- Checks obrigatórios: `CI OK` (job agregador da seção 7), o check de título do `pr-hygiene.yml` e a revisão de dependências do `security.yml`.
- Exigir que a branch esteja atualizada com a `main` antes do merge.
- Histórico linear, bloqueio de force push e de exclusão da branch.
- Lista de bypass vazia. Qualquer exceção de emergência fica documentada em `docs/runbooks/`.

**Configurações do repositório**

- Merge somente por squash (desligue merge commit e rebase), exclusão automática da branch e auto-merge habilitado.
- Token padrão do Actions com permissão só de leitura; aprovação manual para workflows de PRs de forks.
- Dependabot alerts e security updates ligados; secret scanning com push protection e relatos privados de vulnerabilidade (todos disponíveis, porque o repositório é público).

**CODEOWNERS**

- `*` pertence ao dono. Mudanças em `.github/`, `prisma/` (ou `drizzle/`) e `src/server/db/` exigem revisão do dono quando houver time.

**Dependabot (`dependabot.yml`)**

- Ecossistemas `npm` e `github-actions`, atualização semanal, no máximo 5 PRs abertos.
- Agrupe atualizações minor e patch em um único PR. Sem auto-merge no início; os PRs passam pelo mesmo CI.

**Acesso dos agentes**

- Agentes usam um token de escopo restrito a este repositório (contents, pull requests e issues com escrita), sem permissão de administração.
- Nenhum agente altera rulesets, segredos ou workflows sem pedido explícito do dono (regra também no `AGENTS.md`).

## 11. Automação do GitHub Project

O Project reflete o estado real do trabalho: cada evento de issue ou PR move o card sem ninguém arrastar. Primeiro ligue tudo que as automações nativas cobrem; só escreva Action para o que sobrar.

**Campos do Project**

- `Status` (seleção única): `Todo`, `In progress`, `In review`, `Done`.
- `Fase`: `fase-0` a `fase-4`. `Área`: as mesmas áreas dos rótulos. `Prioridade`: `P0`, `P1`, `P2`.
- Views: quadro por `Status` filtrado pela fase atual, tabela com tudo e roadmap por milestone.

**Eventos e status resultante**

| Evento | Status do card | Como |
| --- | --- | --- |
| Issue ou PR do repositório criado | `Todo` | Nativo: auto-add e "item adicionado" |
| Issue atribuída ou branch criada com o padrão \<tipo>/\<n>-\<slug> | `In progress` | Action |
| PR aberto como rascunho | `In progress` (PR e issue vinculada) | Action |
| PR marcado como pronto para review | `In review` (PR e issue vinculada) | Action |
| Review pede mudanças ou PR volta a rascunho | `In progress` | Nativo, se disponível; senão Action |
| PR mergeado | `Done` | Nativo (ligado por padrão) |
| Issue fechada (inclusive via `Closes #n`) | `Done` | Nativo (ligado por padrão) |
| Issue reaberta | `Todo` | Nativo |
| Item em `Done` há mais de 14 dias | Arquivado | Nativo: auto-archive |

**`project-automation.yml`**

- Gatilhos: `issues` (aberta, atribuída, reaberta), `pull_request` (aberta, pronta para review, convertida em rascunho, reaberta) e `pull_request_review` (enviado), além da criação de branch (create), de onde o número da issue é lido pelo nome da branch (\<tipo>/\<n>-\<slug>).
- O `GITHUB_TOKEN` padrão não edita Projects v2. Use o token de um GitHub App com permissão de leitura e escrita em Projects (`actions/create-github-app-token`), guardado em `PROJECT_APP_ID` e `PROJECT_APP_PRIVATE_KEY`; um PAT de escopo mínimo é a alternativa.
- Altere o campo com a mutation GraphQL `updateProjectV2ItemFieldValue` (ou `gh project item-edit`). Resolva os IDs do campo e das opções pelo nome em tempo de execução; não deixe IDs fixos no arquivo.
- Para PRs, leia as issues vinculadas (`closingIssuesReferences`) e mova o card delas junto com o do PR.
- Se o item ainda não estiver no Project, adicione antes de mudar o status. O workflow é idempotente: rodar duas vezes dá o mesmo resultado.
- Não é check obrigatório: falha no workflow gera anotação, mas não bloqueia merge.

**Teste**

- Documente e execute um roteiro: criar issue, criar branch com `gh issue develop`, abrir PR como rascunho, marcá-lo como pronto, pedir mudanças, aprovar e fazer merge. Confira o status do card de issue e de PR em cada passo.

**Ponte `specs/` → issues (`tools/sync-issues.ts`)**

O bigpowers guarda o plano em `specs/` e não cria issues; esta ponte as cria, para o Project refletir o plano.

- Entrada: `specs/release-plan.yaml` e `specs/epics/` (um `epic.yaml` por épico). Cada story vira uma issue; cada épico vira uma issue-pai com as stories como sub-issues, ou um rótulo `epic:<nome>` se o recurso não estiver disponível.
- Identidade: o ID da story (por exemplo `e01s01`, o mesmo usado em `specs/execution-status.yaml`) vai num comentário HTML no corpo da issue (`<!-- bp-story: e01s01 -->`). O script procura esse marcador antes de criar; rodar duas vezes não duplica.
- Conteúdo: título da story, tarefas `[BCP N]` como lista de tarefas, comandos `verify:` como critérios de aceite, requisitos cobertos (R-001…) e link para o arquivo do épico.
- Metadados: milestone da fase, rótulos de área e tipo, e os campos `Fase`, `Área` e `Prioridade` do Project (a prioridade segue a ordem do plano). A issue é adicionada ao Project.
- Mudança de plano: se a story mudar em `specs/` (por exemplo, via `change-request`), o script atualiza título, corpo e campos da issue aberta. Issue fechada não é reaberta, e story removida do plano gera comentário e rótulo `obsoleta`, sem apagar nada.
- Execução: manual com `pnpm sync:issues` (use `--dry-run` para ver o que mudaria) logo depois do `plan-work`, e automática pelo `sync-issues.yml` quando `specs/` muda na `main`. Usa o token do GitHub App, com escrita em issues e Projects, e fala com o GitHub só pelo gh. Só o dono e o CI executam o script; agentes não criam issues.
- Sentido único: `specs/` manda, e edições manuais no corpo da issue são sobrescritas. O `Status` do card é do Project, e o script nunca o altera.

**Rastreabilidade requisito → story (`tools/check-traceability.ts`)**

- O agente numera cada requisito do `docs/product-spec.md` com um ID estável (R-001, R-002…) uma única vez, e o dono revisa. IDs nunca são reaproveitados.
- Cada story lista os requisitos que cobre em um campo `covers` (convenção do projeto, registrada em ADR), por exemplo `covers: [R-001, R-007]`.
- O script falha quando um requisito não aparece em nenhuma story ou quando uma story cita um ID que não existe. Roda no job `static` do CI e antes do `sync:issues`.
- O bigpowers já gera `specs/traceability-matrix.json` e `specs/TRACEABILITY_LATEST.md` (script `trace-stories.sh`, antes do `release-branch`). Aproveite esses arquivos e acrescente só a checagem requisito → story, sem duplicar a matriz.
- Mudou o documento do produto? Rode `change-request` ou refaça o `plan-work`; a checagem mostra o que ficou sem cobertura.

## 12. Templates e documentação

Templates de issue e de PR transformam a guideline em campos e checklists que o autor, humano ou agente, preenche.

**Issue forms (`.github/ISSUE_TEMPLATE/`)**

- `bug.yml`: o que aconteceu, passos para reproduzir, resultado esperado, ambiente e evidências. Rótulo `bug`.
- `feature.yml`: problema, proposta, critérios de aceite em lista de tarefas, fase e área (listas suspensas).
- `task.yml`: objetivo, critérios de aceite, fase e área.
- `config.yml`: `blank_issues_enabled: false`.

**`PULL_REQUEST_TEMPLATE.md`**

- Resumo e `Closes #<issue>`.
- Como testei: comandos executados e capturas de tela quando houver mudança visual.
- Checklist:
  - `pnpm verify` passou localmente.
  - Testes novos ou atualizados para toda regra de negócio alterada.
  - Mudança que toca dados verifica o isolamento entre entidades.
  - Mudança de interface: capturas em celular e desktop, relatório do Impeccable linkado e passada manual de acessibilidade.
  - Snapshots visuais alterados estão justificados.
  - Migrations incluídas e compatíveis com a versão anterior do app.
  - Nenhum segredo nem dado pessoal real.
  - Documentação atualizada.

**Documentos do repositório**

- `README.md`: o que é o projeto, stack, pré-requisitos, passo a passo local (Node via `.nvmrc`, `pnpm install`, `.env`, banco, seed), comandos principais, estrutura de pastas, instalação das skills (bigpowers, com o npx bigpowers init, e Impeccable) e link para `docs/product-spec.md`.
- `CONTRIBUTING.md`: fluxo da seção 3, hooks, proibição de `--no-verify`, como rodar `verify` e `verify:full`, como atualizar snapshots visuais.
- `SECURITY.md`: como relatar vulnerabilidades em privado.
- `specs/adr/`: modelo (contexto, decisão, consequências) e quatro ADRs iniciais: stack, multi-tenancy por `organization_id`, login exclusivo com Google e estratégia de testes.
- `docs/runbooks/`: rollback de deploy, restauração de backup e bypass de emergência do ruleset.

## 13. Ambientes, deploy e segredos

Há três ambientes, local, preview e produção, e nenhum deles compartilha banco ou segredos com outro.

**Ambientes**

- **Local:** Postgres em contêiner ou banco de desenvolvimento, `.env` local e seed fictício. Com stories em paralelo, cada worktree usa sua própria branch de banco do Neon (seção 3).
- **Preview:** um deploy por PR na Vercel, com banco de preview separado (branch de banco, se o provedor oferecer) e seed fictício. O link do preview aparece no PR.
- **Produção:** deploy automático ao entrar na `main`. Como o ruleset exige `CI OK` antes do merge, o que chega à `main` já passou nos checks.

**Migrations**

- Aplicadas pelo pipeline de deploy antes de a nova versão receber tráfego, com `migrate deploy` (nunca `reset` em produção).
- Sempre compatíveis com a versão anterior do app (expandir, migrar, só depois contrair), para o rollback funcionar.

**Segredos**

| Segredo | Onde fica | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Vercel (por ambiente) e Actions (banco do CI, efêmero) | Conexão com o PostgreSQL |
| `AUTH_SECRET` | Vercel (por ambiente) | Assinatura de sessão do Auth.js |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Vercel (por ambiente) | Login com Google |
| Chaves de armazenamento e e-mail | Vercel (por ambiente) | Fotos, comprovantes e notificações |
| `SENTRY_DSN` e token de source maps | Vercel e Actions | Monitoramento de erros |
| `PROJECT_APP_ID`, `PROJECT_APP_PRIVATE_KEY` | Actions | Automação do Project (seção 11) |
| `AUTH_TEST_MODE` | Somente CI e local | Login de teste; nunca definido em produção |

**Login do Google fora de produção**

- O Google não aceita curinga nas URIs de redirecionamento. Registre as URIs de local e de produção, e use um domínio estável de staging para os previews.

**Operação**

- Sentry com release marcada pelo SHA do commit e source maps enviados pelo CI na `main`.
- Backup diário do banco pelo provedor, com restauração testada a cada trimestre e descrita em `docs/runbooks/`.
- Rollback: reverter para o deploy anterior na Vercel, o que só é seguro por causa da regra de migrations compatíveis.

## 14. Ordem de implementação e critérios de aceite

Implemente em 13 etapas, cada uma em um PR próprio, e só comece a etapa seguinte depois do merge da anterior. Até a etapa 5 o ruleset ainda não existe, então esses PRs entram sem checks obrigatórios; da etapa 5 em diante toda mudança segue o fluxo completo.

| Etapa | Entrega | Critério de aceite |
| --- | --- | --- |
| 1. Fundação | Esqueleto Next.js com TypeScript, pnpm, `.nvmrc`, ESLint, Prettier, estrutura de pastas, `README`, `CONTRIBUTING`, `AGENTS.md`, `CONVENTIONS.md` (com `TODO`), templates e `CODEOWNERS` | `pnpm install && pnpm verify` roda do zero em máquina limpa |
| 2. Hooks | Husky, lint-staged, commitlint e `check-branch.sh` | Commit com mensagem inválida, push na `main` e branch fora do padrão são barrados |
| 3. CI base | `ci.yml` com `static`, `unit`, `build` e `ci-ok`, com cache e concorrência | PR de teste com erro de lint deixa `CI OK` vermelho; PR correto passa |
| 4. Banco e integração | Container PostgreSQL, migrations, jobs `migrations` e `integration`, primeiro teste de isolamento | O teste de isolamento falha quando o filtro por entidade é removido de propósito |
| 5. Ruleset e segurança | Ruleset da `main`, squash, Dependabot, `security.yml` e `pr-hygiene.yml` | Push direto na `main` e merge com `CI OK` vermelho são bloqueados; título de PR inválido falha |
| 6. Agentes e design | bigpowers (setup, init e seed-conventions, mesclando os arquivos existentes) e Impeccable instalados, `PRODUCT.md`, bloco do `.gitignore`, job story-trace, a seção do app no CONVENTIONS.md, workflow\_mode team-pr e job `design-detect` | PR de teste com um padrão que o detector acusa falha o job; story sem tag falha o story-trace e workflow\_mode diferente de team-pr falha o static |
| 7. E2E | Playwright, login de teste, `storageState` por papel, seed de teste e job `e2e` com o fluxo do feed público | Job verde em PR pronto, pulado em rascunho; teste prova que o login de teste não existe no build de produção |
| 8. Acessibilidade, visual e desempenho | Jobs `a11y` e `visual`, lighthouse (com lighthouserc.js) e o `visual-baseline.yml` | Violação `serious` introduzida de propósito falha o `a11y`; mudança visual falha o `visual` e é resolvida pelo workflow de baseline; nota de acessibilidade abaixo de 95 falha o job lighthouse |
| 9. Project | Campos, automações nativas, `project-automation.yml`, GitHub App, sincronização de issues (sync-issues) e checagem de rastreabilidade | O roteiro de teste da seção 11 produz o status esperado em cada passo; rodar a sincronização duas vezes não duplica issues, e um requisito sem story falha a checagem |
| 10. Deploy | Vercel (preview e produção), migrations no pipeline, Sentry e runbooks | PR gera preview com banco de preview; merge publica em produção; rollback testado uma vez |
| 11. Piloto | orchestrate-project sobre docs/product-spec.md (fases 1 a 3), sync:issues e uma story completa conduzida pelo build-epic | Issues e cards criados a partir dos épicos; a story percorre o ciclo do bigpowers e chega à main por PR com CI OK verde; o card termina em Done |
| 12. Paralelismo | tools/ready-stories.ts, tools/worktree-up.sh e worktree-down.sh, campos touches, depends\_on e migrations nas stories e limite de 2 stories em andamento | Duas stories independentes do piloto rodam em worktrees paralelos, cada uma com sua branch de banco, e chegam à main por PR sem conflito de estado; o ready-stories recusa a terceira |
| 13. Fechamento | ADRs iniciais, revisão do `CONTRIBUTING` e checklist final | Todos os checks da seção 10 estão obrigatórios e a lista de pendências está atualizada |

**Entrega final**

- Um relatório curto com o que foi feito, como acionar e testar cada check, e o que ficou pendente. Entregue na descrição do último PR e em `docs/runbooks/handoff.md`.

## 15. Fora de escopo, decisões e pontos em aberto

Deixe de fora o que não é preciso para o primeiro ciclo. As decisões fechadas valem como regra; os itens marcados como padrão ou pendentes seguem o padrão indicado até o dono responder.

**Fora de escopo agora**

- **Archon:** motor de workflows para agentes de código. Reavalie depois que o CI estiver sólido e houver interesse em transformar issue em PR automaticamente. Se for adotado, os PRs dele passam pelo mesmo CI e pelas mesmas regras, e ele não recebe permissão de administração.
- Merge queue, notificações em Slack ou Discord, monorepo e testes e2e contra o ambiente de preview.

**Decisões e pontos em aberto**

| Ponto | Estado | Decisão ou padrão |
| --- | --- | --- |
| Repositório público ou privado? | Fechado | Público. CodeQL, secret scanning com push protection e Actions sem custo de minutos ficam disponíveis. Segredo e dado pessoal nunca entram no repositório, e workflows com segredo não rodam para PRs de forks |
| Project em conta pessoal ou organização? | Fechado | Conta pessoal, com token de GitHub App |
| Solo ou time? | Fechado | Solo com agentes: 0 aprovações no ruleset e `CODEOWNERS` pronto para ligar |
| Prisma ou Drizzle? | Fechado | Prisma |
| Provedor de banco | Fechado | Neon, com branch de banco por PR |
| Idioma dos commits | Fechado | Inglês |
| `specs/state.yaml` e `specs/metrics/` no git? | Fechado | Sim, `specs/` inteira é versionada; revisar se o `state.yaml` gerar conflitos entre branches |
| Ferramentas de agente | Fechado | Só o Pi: instalar bigpowers e Impeccable apenas para ele; o `CLAUDE.md` gerado pelo seed é um link para o `AGENTS.md` |
| `workflow_mode` | Fechado | `team-pr` em `specs/state.yaml`; o job `static` falha com outro valor |
| Tags `story: eNNsNN` e `trace-stories.sh --strict` | Fechado | Adotadas; o job `story-trace` instala o bigpowers na versão fixada |
| Limites de tamanho | Fechado | Arquivos de 300 linhas e funções de 40, aplicados pelo ESLint |
| `Co-authored-by` de agente nos commits | Fechado | Proibido, como no modelo do bigpowers |
| Quem roda `sync:issues` | Fechado | Só o dono e o CI; agentes não criam issues |
| Conteúdo do `CONVENTIONS.md` | Fechado | Modelo gerado pelo seed mais a seção do app (seção 4); o dono revisa na primeira rodada |
| Metas do Lighthouse | Padrão | As da seção 9; LCP e desempenho passam de aviso a erro após duas semanas de linha de base |
| Cobertura mínima em `src/domain` | Padrão | 80%; revisar após as primeiras fases do produto |
| Comando de conformidade do `audit-code` | Padrão | Confirmar na primeira rodada e registrar em ADR; o gate de 94% não é rebaixado |
| Campo `covers` nas stories | Padrão | Convenção do projeto registrada em ADR; se a validação do bigpowers rejeitar, guardar a lista em comentário padronizado |
| `build-epic`: completo ou passo a passo? | Padrão | Passo a passo nas primeiras stories; modo completo quando o fluxo estiver confiável |
| Limite de stories em paralelo | Padrão | 2; subir só depois de medir conflitos e custo de revisão |
| Subagentes (dispatch-agents) | Fechado | O Pi já tem a extensão de subagentes; uso permitido dentro de uma story |
| Nome da branch e da pasta no kickoff-branch | Padrão | Testar na primeira story paralela e registrar a solução em ADR |

# Adoção de Pets — AI Agents

> **Multi-agent context** — This file is the canonical project context for **Cline**, **Aider**, **OpenCode**, and other AGENTS.md-native tools. Claude Code and Cursor read it via the `CLAUDE.md` symlink.

Read CONVENTIONS.md before any GitHub or git operation.

<!-- BEGIN bigpowers:context-routing -->

## Context Routing

Load subdirectory context by file glob — see project-specific routing table (seeded by `seed-conventions`).
<!-- END bigpowers:context-routing -->

<!-- BEGIN bigpowers:learned-preferences -->

## Learned User Preferences

- (none yet — updated via `session-state`)

## Workspace Facts

- (none yet — durable facts discovered across sessions)

<!-- END bigpowers:learned-preferences -->

<!-- BEGIN bigpowers:project -->

## Project

Plataforma open-source de adoção, apadrinhamento e resgate animal.
Stack: TypeScript / Next.js 16 / React 19 / Prisma 5 / PostgreSQL / Node 22

## Commands

| Action    | Command                            |
| --------- | ---------------------------------- |
| Run       | `pnpm dev`                         |
| Test      | `pnpm test`                        |
| Build     | `pnpm build`                       |
| Lint      | `pnpm lint`                        |
| Preflight | `pnpm verify`                      |
| CI        | `gh pr checks` (when a PR is open) |

## Test

`pnpm test` — Vitest for unit/integration, Playwright for E2E

## Lint

`pnpm lint` — ESLint 9 flat config

## Build

`pnpm build` — Next.js production build

## Architecture

Next.js App Router with feature-based modules. Prisma ORM for database access. Repository pattern for data access. Testes unitários (Vitest), integração (Vitest com banco real), E2E (Playwright). CI/CD com GitHub Actions.

## Conventions

- Feature-based modules in `src/modules/`
- Components in PascalCase
- Hooks in camelCase with `use` prefix
- Tests in `__tests__/` directories
- Repositories extend `BaseRepository<T>`
- All queries go through the repository layer

## Never

- NÃO editar migration manual
- NÃO usar `any` ou `@ts-ignore`
- NÃO editar .env.example com valores reais
- NÃO subir .env ou dados sensíveis
- NÃO usar `Math.random()` em testes
- NÃO criar migrations sem schema do Prisma
- Never dismiss reproducible gate failures as pre-existing or out of scope
- Never proceed on red Preflight or red CI — invoke quick-fix or fix-bug first

## Agent Rules

- **Workflow Mandate:** Use bigpowers skills (e.g. `plan-work`, `develop-tdd`) for structured work.
- **Always Green:** Preflight and CI must be green before forward work.
- Read specs/ and CONVENTIONS.md before writing code.
- Write the minimum code that solves the stated problem.
- Run tests after every change. Show evidence before declaring done.
- All planning output goes in specs/.

## Defensive Code

All 5 categories apply:

- Rate limit
- Retry
- Circuit breaker
- Timeout
- Graceful degradation

## Token Economy — Minimal Footprint

1. **Check existing dependencies first.** DO inspect what your current dependencies already do before adding a package or writing your own code.
2. **Prefer mature, maintained libraries.** DO NOT rewrite a capability a maintained library provides without a documented reason.
3. **Copy validated patterns.** DO study how established products solve the same problem before inventing a new approach.
4. **Keep the simplest working implementation.** DO write the least code that satisfies the stated requirement. NEVER add preventive abstraction or unused config layers.

<!-- END bigpowers:project -->

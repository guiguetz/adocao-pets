# Tech Stack — Adoção de Pets

## Stack Principal

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|---------------|
| Framework | Next.js | 16 | App Router, RSC, Server Actions |
| UI | React | 19 | Concurrent features, use() hook |
| ORM | Prisma | 5 | Type-safe, migrations, seed |
| Database | PostgreSQL | 16 | Robusto, JSON support, full-text search |
| Auth | Auth.js | v5 | Google OAuth, session management |
| Styling | Tailwind CSS | 4 | Utility-first, design system |
| Testing | Vitest | 3 | Fast, ESM native, compatível com Vite |
| E2E | Playwright | 1.50 | Multi-browser, auto-wait |
| Lint | ESLint | 9 | Flat config, typescript-eslint |
| Package | pnpm | 9 | Fast, disk efficient, workspaces |
| Runtime | Node.js | 22 | LTS, performance |

## Arquitetura

```
src/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/       # Componentes React compartilhados
├── modules/          # Feature-based modules (auth, pets, orgs, adoption)
│   └── [module]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── repositories/
│       └── __tests__/
└── server/           # Server-side code
    ├── db/           # Prisma client, utilities
    └── auth/         # Auth.js configuration
```

## Padrões

### Repository Pattern
```typescript
// Base repository
export class BaseRepository<T> {
  protected prisma: PrismaClient
  protected model: string

  async findById(id: string): Promise<T | null>
  async findMany(args?: FindManyArgs): Promise<T[]>
  async create(data: CreateInput): Promise<T>
  async update(id: string, data: UpdateInput): Promise<T>
  async delete(id: string): Promise<void>
}
```

### Multi-tenant
- Cada ONG é um tenant
- Todos os models têm `organizationId`
- Middleware injeta tenant context

### Testing Strategy
- **Unit**: Vitest, mocks com `vi.mock()`
- **Integration**: Vitest + banco real (testcontainers)
- **E2E**: Playwright, fluxos críticos

## Decisões Técnicas (ADRs)

- [ADR-001: Stack](adr/ADR-001-stack.md)
- [ADR-002: Multi-tenancy](adr/ADR-002-multi-tenancy.md)
- [ADR-003: Google Auth](adr/ADR-003-google-auth.md)
- [ADR-004: Testing Strategy](adr/ADR-004-testing-strategy.md)
# ADR-001: Stack Selection

## Status

Accepted

## Context

We need to select a technology stack for the pet adoption platform that supports:

- Modern web development with TypeScript
- Server-side rendering for SEO
- Database access with type safety
- Authentication with Google
- Testing at multiple levels
- Deployment on Vercel

## Decision

We will use:

- **Frontend/Backend:** Next.js 15 (App Router) with React 19
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon) with Prisma 5
- **Auth:** Auth.js with Google provider
- **Testing:** Vitest (unit/integration) + Playwright (E2E/visual)
- **Deployment:** Vercel

## Consequences

### Positive

- Full-stack TypeScript for type safety
- Server-side rendering for SEO
- Built-in API routes
- Excellent Vercel integration
- Strong community support

### Negative

- Vendor lock-in with Vercel
- Learning curve for App Router
- Prisma can be verbose for complex queries

## Alternatives Considered

1. **Remix + Drizzle:** More flexible but less ecosystem support
2. **SvelteKit:** Better performance but smaller community
3. **Traditional SPA + API:** More control but worse SEO

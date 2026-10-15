# Story e02s01: Repository de ONGs

## Status

- **Created:** 2025-01-27
- **Status:** planning
- **Points:** 3

## Goal

Implement OrganizationRepository extending BaseRepository with CRUD operations and specialized queries.

## Context

- **Module:** src/modules/organizations/
- **Prisma Model:** Organization (id, name, slug, createdAt, updatedAt)
- **Relations:** users User[], pets Pet[]
- **Multi-tenant:** All queries must scope by organizationId where applicable

## Requirements

### ADDED

- OrganizationRepository class extending BaseRepository<Organization>
- Methods: findById, findAll, create, update, delete
- Specialized queries: findBySlug, findByUser
- Multi-tenant scoping for all queries

## Acceptance Criteria

1. Repository faz CRUD completo
2. findBySlug funciona
3. Testes unitários passam

## Implementation Steps

### Step 1: Create BaseRepository abstract class

Create `src/modules/shared/repositories/base.repository.ts` with generic CRUD interface.

**verify:** `pnpm test -- base.repository.test.ts`

### Step 2: Create OrganizationRepository

Create `src/modules/organizations/repositories/organization.repository.ts` extending BaseRepository.

**verify:** `pnpm test -- organization.repository.test.ts`

### Step 3: Implement findBySlug method

Add specialized query to find organization by unique slug field.

**verify:** `pnpm test -- organization.repository.test.ts -t "findBySlug"`

### Step 4: Implement findByUser method

Add query to find organizations by user ID through the users relation.

**verify:** `pnpm test -- organization.repository.test.ts -t "findByUser"`

### Step 5: Write comprehensive unit tests

Cover all CRUD operations, findBySlug, findByUser, and edge cases.

**verify:** `pnpm test -- organization.repository.test.ts`

## Verification Script (Step-by-Step)

1. Run unit tests: `pnpm test -- organization.repository.test.ts`
2. Verify all tests pass with >80% coverage
3. Check TypeScript compilation: `pnpm typecheck`
4. Verify lint passes: `pnpm lint`

## Out of Scope

- API routes (e02s02)
- UI components (e02s03)
- Database migrations (already exist in e01)

## Risks

- **P1:** Multi-tenant scoping must be enforced on all queries
- **P2:** Prisma client setup must be consistent with existing patterns

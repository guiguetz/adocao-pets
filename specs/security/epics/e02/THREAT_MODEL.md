# Threat Model — Epic e02: Módulo de ONGs

created: '2025-01-27'
scope: 'Repository layer for Organizations with CRUD operations'

## Surface Area

- **Input vectors:** Repository methods called by API routes and server actions
- **Data store:** PostgreSQL via Prisma ORM
- **Authentication:** Auth.js with Google OAuth (handled by e01)
- **Authorization:** Multi-tenant via organizationId

## Vulnerability Categories

### SQL Injection (CWE-89)

- **Risk:** LOW — Prisma ORM uses parameterized queries by default
- **Mitigation:** Use Prisma's query builder; avoid raw SQL with string interpolation
- **Status:** Mitigated by framework

### IDOR (CWE-639)

- **Risk:** MEDIUM — Repository must scope queries to organizationId
- **Mitigation:** All queries MUST include organizationId filter when applicable
- **Status:** Requires implementation verification

### Data Exposure

- **Risk:** LOW — Repository returns only Organization fields, no sensitive data
- **Mitigation:** Prisma schema defines explicit fields
- **Status:** Mitigated by schema

## Risk Level: LOW

Standard repository pattern with Prisma ORM. No direct HTTP handling, no file operations, no external API calls.

## Mitigation Guidance

1. Ensure all queries include organizationId scoping (multi-tenant)
2. Use Prisma's built-in parameterization (no raw SQL)
3. Validate input at API layer (e02s02), not repository layer
4. Return only necessary fields from repository methods

# Story e02s02: API routes de ONGs

**Points:** 3 | **Priority:** must-have | **Epic:** e02-ongs

## Description

Criar API routes para ONGs: GET (list), GET/:id, POST, PUT/:id, DELETE/:id.
Validação com Zod. Autenticação obrigatória em todas as rotas.

## Acceptance Criteria

- [ ] POST /api/organizations cria ONG
- [ ] GET /api/organizations lista ONGs do usuário
- [ ] GET /api/organizations/[id] retorna ONG específica
- [ ] PUT /api/organizations/[id] atualiza ONG
- [ ] DELETE /api/organizations/[id] remove ONG
- [ ] Validação retorna 400 em dados inválidos
- [ ] Rotas sem auth retornam 401
- [ ] Usuário não dono recebe 403 em PUT/DELETE

## Tasks

### Task 1: Zod schemas for Organization

- Create `src/modules/organizations/schemas/organization.schema.ts`
- Schemas: `createOrganizationSchema`, `updateOrganizationSchema`
- Fields: name (required, min 2), slug (required, alphanumeric), description (optional), phone (optional), email (optional, valid email)
- Use `z.strict()` to reject unknown fields

### Task 2: Auth helper for API routes

- Create `src/modules/shared/api/auth-guard.ts`
- Function `requireAuth()` — returns session or throws 401
- Function `requireOrgOwnership(orgId, userId)` — verifies user is member

### Task 3: POST /api/organizations

- Create `src/app/api/organizations/route.ts`
- Validate body with `createOrganizationSchema`
- Call `auth()` → 401 if not logged in
- Create org via `OrganizationRepository.create()`
- Add user to org (connect relation)
- Return 201 with created org

### Task 4: GET /api/organizations

- Add to `src/app/api/organizations/route.ts`
- Call `auth()` → 401 if not logged in
- Return orgs where user is member
- Support pagination? (skip/take query params)

### Task 5: GET /api/organizations/[id]

- Create `src/app/api/organizations/[id]/route.ts`
- Call `auth()` → 401 if not logged in
- Fetch org by ID
- Verify user is member → 403 if not
- Return org or 404

### Task 6: PUT /api/organizations/[id]

- Add to `src/app/api/organizations/[id]/route.ts`
- Validate body with `updateOrganizationSchema`
- Call `auth()` → 401 if not logged in
- Verify ownership → 403 if not
- Update org via repository
- Return updated org

### Task 7: DELETE /api/organizations/[id]

- Add to `src/app/api/organizations/[id]/route.ts`
- Call `auth()` → 401 if not logged in
- Verify ownership → 403 if not
- Delete org via repository
- Return 204

### Task 8: Tests

- Create `src/app/api/organizations/route.test.ts`
- Test all endpoints with mocked auth
- Test validation errors (400)
- Test unauthorized (401)
- Test forbidden (403)

## Verify

```bash
pnpm test:unit -- organizations
```

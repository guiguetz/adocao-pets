# Threat Model — Epic e02: Módulo de ONGs

## Story: e02s02 — API routes de ONGs

**Scope:** CRUD API routes for Organizations (GET, GET/:id, POST, PUT/:id, DELETE/:id) with Zod validation.

**Risk Level:** 🟡 Medium

---

## Surface Area

| Endpoint                  | Method | Auth Required | Risk                       |
| ------------------------- | ------ | ------------- | -------------------------- |
| `/api/organizations`      | GET    | Yes           | Low — list own orgs        |
| `/api/organizations/[id]` | GET    | Yes           | Medium — data exposure     |
| `/api/organizations`      | POST   | Yes           | Medium — resource creation |
| `/api/organizations/[id]` | PUT    | Yes           | Medium — data mutation     |
| `/api/organizations/[id]` | DELETE | Yes           | High — destructive action  |

---

## Vulnerability Categories

### 1. Authentication & Authorization

**Finding:** Middleware excludes `/api/*` from auth checks. Each API route MUST verify session.

**Mitigations:**

- Call `auth()` at the start of every route handler
- Return 401 if `!session?.user`
- For PUT/DELETE: verify user owns the organization (multi-tenant isolation)

### 2. Input Validation

**Finding:** Zod validation is planned but must cover all fields.

**Mitigations:**

- Validate ALL inputs with Zod schemas before hitting repository
- Sanitize string inputs (trim, max length)
- Reject unknown fields with `z.strict()`

### 3. IDOR (Insecure Direct Object Reference)

**Finding:** Routes use `[id]` params — users could access other orgs.

**Mitigations:**

- On GET/PUT/DELETE: verify `organization.users` includes `session.user.id`
- Or add `userId` filter to all queries

### 4. Rate Limiting

**Finding:** No rate limiting on API routes currently.

**Mitigations:**

- Consider rate limiting on POST (resource creation)
- Log failed auth attempts

### 5. Data Exposure

**Finding:** GET responses may include sensitive fields.

**Mitigations:**

- Select only necessary fields in queries
- Never return internal IDs or timestamps unless needed

---

## Risk Summary

| Category         | Risk   | Mitigation Status             |
| ---------------- | ------ | ----------------------------- |
| Auth bypass      | High   | Must implement per-route auth |
| IDOR             | High   | Must add ownership checks     |
| Input validation | Medium | Zod schemas planned           |
| Rate limiting    | Low    | Optional for MVP              |
| Data exposure    | Low    | Select specific fields        |

---

## Recommendations

1. **MUST:** Add `auth()` check to every API route
2. **MUST:** Add ownership verification for PUT/DELETE
3. **MUST:** Use Zod strict mode for input validation
4. **SHOULD:** Log unauthorized access attempts
5. **NICE-TO-HAVE:** Rate limiting on POST

# ADR-002: Multi-tenancy by organization_id

## Status

Accepted

## Context

The platform needs to support multiple ONGs (organizations) with data isolation between them. We need to ensure that:

- Each ONG can only see their own data
- Queries are automatically filtered by organization
- New entities are automatically associated with the correct organization

## Decision

We will implement multi-tenancy by:

- Adding `organization_id` to all relevant tables
- Filtering all queries by `organization_id`
- Using a repository pattern to enforce isolation
- Checking authorization on the server for every route

## Consequences

### Positive

- Strong data isolation between organizations
- Simple implementation with Prisma
- Easy to add new organizations
- Clear security boundary

### Negative

- Slightly more complex queries
- Need to ensure all queries include organization filter
- Migration complexity when adding new tables

## Implementation

1. All tables that contain organization-specific data have an `organization_id` column
2. The repository layer automatically filters by `organization_id`
3. Server-side authorization checks verify the user belongs to the organization
4. Client-side code never sends organization_id (it's derived from the session)

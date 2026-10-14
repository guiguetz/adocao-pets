# ADR-004: Testing Strategy

## Status

Accepted

## Context

We need a comprehensive testing strategy that covers:

- Unit tests for business logic
- Integration tests for database operations
- End-to-end tests for user flows
- Visual regression tests for UI
- Accessibility tests

## Decision

We will use a multi-level testing approach:

- **Unit tests:** Vitest for individual functions and components
- **Integration tests:** Vitest with real PostgreSQL for database operations
- **E2E tests:** Playwright for user flows
- **Visual tests:** Playwright with screenshot comparison
- **Accessibility tests:** Playwright with axe-core

## Consequences

### Positive

- High confidence in code quality
- Fast feedback with unit tests
- Real-world testing with E2E
- Accessibility compliance
- Visual regression prevention

### Negative

- More complex test setup
- Slower CI pipeline
- Need to maintain test infrastructure
- Screenshot management for visual tests

## Test Pyramid

```
     E2E (10%)
    /        \
Integration (20%)
    \        /
   Unit (70%)
```

## Implementation

1. Unit tests run on every commit
2. Integration tests run on PR
3. E2E tests run on PR (not draft)
4. Visual tests run on PR (not draft)
5. Accessibility tests run on PR (not draft)

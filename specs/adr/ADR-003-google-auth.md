# ADR-003: Google-only Authentication

## Status

Accepted

## Context

We need to implement authentication for the platform. The requirements are:

- Simple user experience
- Secure authentication
- Easy to implement
- Support for multiple users

## Decision

We will use Auth.js with Google as the only authentication provider.

## Consequences

### Positive

- Simple implementation with Auth.js
- No password management
- Strong security with Google OAuth
- Good user experience

### Negative

- Users must have a Google account
- Dependency on Google's OAuth service
- Limited customization of login flow

## Alternatives Considered

1. **Email/Password:** More flexible but requires password management
2. **Multiple OAuth providers:** More options but more complexity
3. **Magic links:** Good UX but requires email service

## Implementation

1. Configure Auth.js with Google provider
2. Store user session in database
3. Link user to organization on first login
4. Handle account linking for returning users

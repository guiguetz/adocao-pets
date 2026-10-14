# Deploy

## Vercel

This project is deployed on Vercel with the following configuration:

### Environments

- **Preview:** Automatic deploy for each PR with a separate database branch
- **Production:** Automatic deploy on merge to main

### Configuration

1. Connect the GitHub repository to Vercel
2. Set environment variables for each environment:
   - `DATABASE_URL` - PostgreSQL connection string
   - `AUTH_SECRET` - Session secret for Auth.js
   - `AUTH_GOOGLE_ID` - Google OAuth client ID
   - `AUTH_GOOGLE_SECRET` - Google OAuth client secret
   - `SENTRY_DSN` - Sentry error tracking DSN

### Database

- **Provider:** Neon (PostgreSQL)
- **Branching:** Each PR gets its own database branch
- **Migrations:** Applied automatically during deploy with `prisma migrate deploy`

### Sentry

Error tracking is configured with:

- Release tracking by commit SHA
- Source maps uploaded during CI
- Environment-specific projects

### Rollback

1. Go to Vercel dashboard
2. Find the previous successful deployment
3. Click "Promote to Production"

**Note:** Rollback is safe because migrations are always compatible with the previous app version.

## Runbooks

- [Rollback](./runbooks/rollback.md)
- [Backup Restore](./runbooks/backup-restore.md)
- [Emergency Bypass](./runbooks/emergency-bypass.md)

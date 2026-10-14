# Rollback Runbook

## When to Use

- Production deployment is broken
- Critical bug discovered in production
- Performance degradation

## Steps

1. **Identify the issue**
   - Check Sentry for errors
   - Check Vercel logs for issues
   - Verify the issue is deployment-related

2. **Rollback on Vercel**
   - Go to Vercel dashboard
   - Select the project
   - Go to Deployments
   - Find the last successful deployment
   - Click "Promote to Production"

3. **Verify rollback**
   - Check that the app is working
   - Verify no data loss
   - Monitor Sentry for new errors

4. **Post-rollback**
   - Create an issue describing the problem
   - Investigate the root cause
   - Fix the issue and redeploy

## Notes

- Rollback is safe because migrations are always compatible with the previous app version
- Database migrations are not rolled back automatically
- If a migration caused the issue, manual intervention may be needed

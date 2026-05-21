# Deployment Guide

## Canon CIO Command Center

This document describes how to deploy the Canon CIO Command Center to Vercel, including build configuration, environment variables, and rollback procedures.

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Vercel CLI (optional, for manual deployments)
- Access to the Vercel project (contact platform team)

---

## Environment Variables

This static frontend requires **no environment variables**. All configuration is handled via constants in `src/app.config.js`.

If you need to add environment variables in the future, define them in `.env` with the `VITE_` prefix:

```bash
VITE_API_URL=https://api.example.com
```

---

## Build Configuration

The project uses Vite 5 as the build tool. The build configuration is defined in `vite.config.js`:

- **Output directory**: `dist/`
- **Source maps**: Enabled for production debugging
- **Dev server port**: 3000

### Build Command

```bash
npm run build
```

This produces an optimized production build in the `dist/` directory.

### Preview Build

```bash
npm run preview
```

Serves the production build locally for verification.

---

## Vercel Deployment

### Automatic Deployments (Recommended)

The project is configured for automatic deployments via Git integration:

1. Push changes to the `main` branch
2. Vercel automatically detects the push and triggers a deployment
3. The deployment uses the following settings (defined in `vercel.json`):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The rewrite rule ensures client-side routing works correctly by serving `index.html` for all routes.

### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Vercel Dashboard

1. Navigate to [Vercel Dashboard](https://vercel.com)
2. Select the `canon-cio-command-center` project
3. View deployment history, logs, and settings

### Required Vercel Settings

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x (default) |
| **Root Directory** | `/` |

---

## Deployment Checklist

Before deploying to production, verify the following:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in preview build
- [ ] All tabs render correctly
- [ ] Chat drawer opens and responds
- [ ] Predictive modal opens and closes
- [ ] CSV export downloads correctly
- [ ] Login/logout flow works
- [ ] Keyboard navigation works (tabs, modals, chat)
- [ ] Screen reader announcements are present
- [ ] All links and buttons are functional

---

## Rollback Procedures

### Rollback via Vercel Dashboard

1. Go to the Vercel project dashboard
2. Click **Deployments** in the sidebar
3. Find the previous stable deployment
4. Click the three-dot menu (⋮) and select **Promote to Production**
5. Confirm the rollback

### Rollback via Vercel CLI

```bash
# List recent deployments
vercel list

# Rollback to a specific deployment
vercel rollback <deployment-id>
```

### Rollback via Git

1. Identify the last known good commit:

```bash
git log --oneline -10
```

2. Revert to the stable commit:

```bash
git revert HEAD --no-edit
git push origin main
```

3. Vercel automatically deploys the reverted commit.

---

## CI/CD Pipeline

### GitHub Actions (Optional)

If CI/CD is configured via GitHub Actions, the workflow file (`.github/workflows/deploy.yml`) should:

1. Run tests on pull requests to `main`
2. Build the project
3. Deploy to Vercel on merge to `main`

Example workflow trigger:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

---

## Monitoring & Logging

### Build Logs

- View build logs in the Vercel dashboard under **Deployments** → select deployment → **Logs**
- Build logs include Vite output, dependency installation, and any build errors

### Runtime Logs

- The application uses a structured logging service (`src/services/logger.js`)
- Logs are output to the browser console in development
- In production, logs are available via browser developer tools

### Error Tracking

- Error boundaries (`src/components/ErrorBoundary.jsx`) catch rendering errors
- Errors are logged to the console with component stack traces
- Consider integrating with an error tracking service (e.g., Sentry) for production monitoring

---

## Performance Considerations

- **Bundle size**: The initial bundle is optimized via code splitting (lazy-loaded tab panels)
- **Caching**: Vercel automatically caches static assets with appropriate headers
- **CDN**: Vercel serves assets from a global CDN for fast delivery
- **Compression**: Vite enables gzip/brotli compression for production builds

---

## Troubleshooting

### Build Fails

1. Check the build logs in Vercel dashboard
2. Verify Node.js version compatibility (18+)
3. Run `npm install` locally to ensure dependencies are up to date
4. Run `npm run build` locally to reproduce the error

### Blank Page After Deployment

1. Check browser console for JavaScript errors
2. Verify the `vercel.json` rewrite rules are correct
3. Ensure all imports resolve correctly (case-sensitive file paths)
4. Check that the output directory is set to `dist`

### Client-Side Routing Not Working

The `vercel.json` rewrite rule handles this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

If routing fails, verify this file exists in the project root and is deployed correctly.

---

## Support

For deployment issues, contact:

- **Platform Team**: platform@canon.com
- **DevOps**: devops@canon.com

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2025-01-15 | Initial deployment guide |
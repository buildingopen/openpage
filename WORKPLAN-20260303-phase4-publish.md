# WORKPLAN: Phase 4 - One-Click Publish

**Created:** 2026-03-03
**Status:** COMPLETE
**Phase:** 4 of 8 (ROADMAP.md)
**Depends on:** Phase 2 (HTML Export) - COMPLETE, Phase 3 (Images) - COMPLETE

## Objective
Users click "Publish" and get a live URL. No downloads, no Netlify, no FTP.

## Architecture

```
Client                          Server (api/deploy.ts)              Vercel API
  |                                |                                   |
  |-- POST /api/deploy ---------->|                                   |
  |   { html, slug }              |                                   |
  |                                |-- POST /v13/deployments -------->|
  |                                |   { files: [index.html] }        |
  |                                |   project: openpage-{slug}       |
  |                                |                                   |
  |                                |<-- { url, readyState } ----------|
  |<-- { url, deploymentId } -----|                                   |
  |                                                                    |
  | Store url in projectsStore                                         |
```

## Tasks

### 1. Create api/deploy.ts serverless function
- [x] Accept POST with { html, slug }
- [x] Sanitize slug (lowercase, alphanumeric + hyphens, max 50 chars)
- [x] Create Vercel deployment via REST API (v13/deployments)
- [x] Auto-create project if first deploy (project name: `openpage-{slug}`)
- [x] Return { url, projectUrl, deploymentId, readyState }
- [x] Set VERCEL_DEPLOY_TOKEN and VERCEL_TEAM_ID env vars on Vercel

### 2. Add deploy fields to Project type
- [x] Added `deployUrl?: string` to Project interface
- [x] Added `deploymentId?: string` to Project interface
- [x] Added `lastDeployedAt?: string` to Project interface
- [x] Added `setDeployInfo(id, url, deploymentId)` to store

### 3. Update Deploy route
- [x] Publish to Web section with green accent card
- [x] Show publish state: idle -> publishing -> published (with URL)
- [x] Display live URL with copy + visit buttons
- [x] Show "Update" button if already published
- [x] Loading state with spinner
- [x] "Last published Xm ago" timestamp

### 4. Add Publish button to CanvasToolbar
- [x] Green "Publish" button (or "Update" if already published)
- [x] Loading state with spinner
- [x] Toast notification with URL and "Visit" action
- [x] External link button to visit published site

### 5. Set environment variables
- [x] VERCEL_DEPLOY_TOKEN on Vercel
- [x] VERCEL_TEAM_ID on Vercel
- [x] maxDuration: 30 for deploy function in vercel.json

### 6. Verify
- [x] Deploy API works: POST with HTML + slug returns live URL
- [x] Test with 25KB payload (realistic site size): works
- [x] Deployed site loads correctly at returned URL
- [x] Build passes, deployed to Vercel
- [x] UI tested: publish button in toolbar, Deploy route with publish card

## Files Modified
- `api/deploy.ts` - NEW: Vercel deployment serverless function
- `src/store/projectsStore.ts` - Added deploy fields + setDeployInfo
- `src/routes/Deploy.tsx` - Real publish flow with URL display
- `src/editor/CanvasToolbar.tsx` - Publish/Update button + visit link
- `vercel.json` - maxDuration: 30 for deploy function

## Key Decisions
- Client generates HTML (reuses existing exportSiteToHTML)
- Server only handles Vercel API deployment (no HTML generation duplication)
- Each project gets its own Vercel project: `openpage-{slug}`
- MVP uses Federico's Vercel team token (migrate to user auth later)
- Deploy URL persisted in projectsStore (localStorage)
- Inline file data in Vercel API (no SHA/upload step needed)

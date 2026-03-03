# WORKPLAN: Phase 2 - Static HTML Export

**Created:** 2026-03-02
**Status:** COMPLETE
**Phase:** 2 of 8 (ROADMAP.md)
**Depends on:** Phase 1 (AI Backend) - COMPLETE

## Objective
Users download a working HTML website they can host anywhere. The exported site looks identical to the editor preview, with working links and responsive design.

## Architecture

```
SiteConfig
  -> for each block: render to HTML string via template function
  -> wrap in full HTML document (head, meta, fonts, Tailwind CDN, theme CSS vars)
  -> download as single index.html file
```

No React in the output. Pure HTML + Tailwind CSS via CDN + Google Fonts. Clean, readable, editable by humans.

## Tasks

### 1. Create block-to-HTML templates
- [x] One template function per block type (13 total)
- [x] Each handles all variants
- [x] Uses Tailwind classes (same as React components)
- [x] Links use href from URL props (primaryCtaUrl, buttonUrl, etc.)
- [x] Template literal strings, no JSX

### 2. Create HTML document wrapper
- [x] Full HTML5 document structure
- [x] Tailwind CSS via CDN script tag
- [x] Google Fonts via link tags (from theme)
- [x] Theme CSS custom properties in style block
- [x] Tailwind config for custom colors matching theme
- [x] SEO meta tags (title)
- [x] Viewport meta tag for mobile

### 3. Wire up Deploy route
- [x] "Download HTML" button triggers export
- [x] Generate HTML string from current config
- [x] Download as index.html via blob URL
- [x] Toast confirmation on download

### 4. Handle edge cases
- [x] Blocks with missing/empty props render gracefully (fallback defaults)
- [x] Empty URL props render as non-linked elements (span, not broken href="")
- [x] Special characters in content are HTML-escaped
- [x] Theme colors applied consistently via Tailwind config + CSS vars

### 5. Verify
- [x] Export a 11-block SaaS site -> renders all blocks correctly in browser
- [x] Links with URLs work (href="https://..." on CTAs)
- [x] Responsive classes present (md:, lg: breakpoints)
- [x] File size: 47.8KB for 11-block site (well under 200KB target)
- [x] Deployed to Vercel, "Download HTML" button visible and functional
- [x] FAQ accordion has working JavaScript toggle
- [x] Custom theme colors (blue accent #3b82f6) applied correctly
- [x] Google Fonts (Inter, Space Grotesk, JetBrains Mono) loaded via CDN

## Files Changed
- `src/lib/export-html.ts` - NEW: 1295 lines, core export engine + all 13 block templates
- `src/routes/Deploy.tsx` - Rewired with HTML download as primary action

## Key Decisions
- Single file (index.html) not a zip. Simpler to use.
- Tailwind via CDN play script (includes runtime compiler). Adds ~100KB but means all Tailwind classes work.
- No minification. Users might want to edit the HTML.
- No JavaScript in output (except Tailwind CDN + FAQ accordion). Pure static HTML + CSS.
- URL props render as `<a href>` when present, `<span>` when empty (no broken links).

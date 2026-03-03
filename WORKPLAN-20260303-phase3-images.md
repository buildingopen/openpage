# WORKPLAN: Phase 3 - Images

**Created:** 2026-03-03
**Status:** COMPLETE
**Phase:** 3 of 8 (ROADMAP.md)
**Depends on:** Phase 2 (HTML Export) - COMPLETE

## Objective
Sites have real images instead of colored rectangles and initials. AI-generated sites include relevant stock photos from Pexels.

## Architecture

```
AI Generation:
  1. Gemini Flash generates site config (fast, ~15-20s)
  2. Post-processing step searches Pexels for relevant images (~5s)
  3. Injects image URLs into config (hero image, testimonial avatars)

Editor:
  - Image URL fields in PropertiesPanel for image-capable blocks
  - Blocks render images with graceful fallbacks (initials, placeholders)

Export:
  - HTML export includes <img> tags with Pexels URLs
```

## Tasks

### 1. Add image rendering to block components
- [x] Team: render `avatar` prop as img with initials fallback
- [x] Testimonials: render `avatar` prop as img with initials fallback
- [x] Hero split: render `heroImage` prop replacing dashed placeholder
- [x] Navbar: add optional `logoImage` prop
- [x] Footer: add optional `logoImage` prop
- [ ] LogoCloud: extend logo items to support `{ name, logoUrl }` objects (deferred, low priority)

### 2. Create Pexels API proxy
- [x] Proxy via Vercel serverless function (`api/pexels.ts`) to hide API key
- [x] Return optimized image URLs (small/medium/large/portrait)
- Skipped client-side `src/lib/pexels.ts` (not needed, injection is server-side)

### 3. Add image fields to PropertiesPanel
- [x] Hero: heroImage URL field
- [x] Team: per-member avatar URL field (auto-rendered via array-items)
- [x] Testimonials: per-item avatar URL field (auto-rendered via array-items)
- [x] Navbar/Footer: logoImage URL field

### 4. AI post-generation image injection
- [x] After Gemini returns config, search Pexels for:
  - Hero image (landscape, based on site description) for split variant
  - Portrait headshots for team members and testimonial avatars
- [x] Inject URLs into config before returning to client
- [x] Best-effort with 5s timeout per Pexels call, try/catch fallback
- [x] System prompt updated to instruct AI not to set avatar/heroImage

### 5. Update HTML export
- [x] Hero: render `<img>` for heroImage (split variant)
- [x] Team: render `<img>` for avatar with initials fallback
- [x] Testimonials: render `<img>` for avatar with initials fallback
- [x] Navbar/Footer: render `<img>` for logoImage
- [ ] LogoCloud: render `<img>` for logoUrl (deferred with block component)

### 6. Update block-metadata.ts
- [x] Added `heroImage: ''` to hero defaultProps

### 7. Verify
- [x] Generate "yoga studio" -> testimonials have 3/3 avatars (28s)
- [x] Generate "AI project management, split hero" -> heroImage injected + 3/3 avatars (26s)
- [x] Image fields appear in PropertiesPanel for hero, navbar, footer
- [x] Blocks without images still render gracefully (initials/placeholders)
- [x] Build passes, deployed to Vercel
- [x] Pexels API proxy verified: `/api/pexels?q=yoga+studio&per_page=2` returns photos

## Performance Notes
- Model order changed: Flash first (fast, ~15s), Pro fallback (slower but better quality)
- Prompt expansion has independent 10s timeout (doesn't block generation)
- Overall function timeout: 55s (Vercel maxDuration: 60s)
- Typical generation: 25-30s total (expand + generate + image injection)

## Files Modified
- `src/blocks/hero/HeroBlock.tsx` - heroImage rendering in split variant
- `src/blocks/team/TeamBlock.tsx` - avatar rendering with initials fallback
- `src/blocks/testimonials/TestimonialsBlock.tsx` - avatar rendering with initials fallback
- `src/blocks/navbar/NavbarBlock.tsx` - optional logoImage prop
- `src/blocks/footer/FooterBlock.tsx` - optional logoImage prop
- `api/pexels.ts` - NEW: Pexels API proxy
- `api/generate.ts` - Post-generation image injection, Flash-first model order
- `src/editor/PropertiesPanel.tsx` - Image URL fields
- `src/lib/block-metadata.ts` - heroImage in hero defaultProps
- `src/lib/export-html.ts` - Image support in all HTML templates
- `vercel.json` - maxDuration: 60 for generate function

## Key Decisions
- Pexels API proxied through Vercel (API key hidden from client)
- No image upload for now (URL-based only, simpler)
- Pexels URLs are permanent and free for commercial use with attribution
- Fallbacks for all image slots (initials, SVG placeholders)
- AI injects images post-generation (separate from Gemini call)
- Flash model first for speed, Pro as fallback for availability

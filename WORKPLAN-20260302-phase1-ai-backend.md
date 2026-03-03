# WORKPLAN: Phase 1 - Real AI Generation Backend

**Created:** 2026-03-02
**Status:** COMPLETE
**Phase:** 1 of 8 (ROADMAP.md)

## Objective
Make AI generation produce unique, high-quality sites from any prompt. Currently falls back to 4 presets.

## Current State
- `/api/generate.ts` exists, calls Gemini 3 Flash
- `GEMINI_API_KEY` is set on Vercel
- System prompt has basic schema but missing: URL props, footer tagline, multi-column footer columns, newsletter socialProof, logocloud logos array
- Model is `gemini-3-flash-preview` (should be `gemini-3.1-pro-preview` for quality)
- Client-side `generate-site.ts` validates response but falls back to presets on any error
- No prompt enhancement (short prompts produce generic results)

## Tasks

### 1. Upgrade model and system prompt
- [x] Switch to `gemini-3.1-pro-preview`
- [x] Add missing props to schema: primaryCtaUrl, secondaryCtaUrl, buttonUrl, tagline, columns, socialProof, logos
- [x] Add more theme examples (warm, elegant, corporate, playful)
- [x] Add content quality rules (specific copy, realistic names/numbers, no generic text)
- [x] Increase block count guidance: 8-12 blocks for rich sites
- [x] Add variant selection guidance (when to use split vs centered hero, etc.)

### 2. Prompt enhancement
- [x] Two-step generation: first expand short prompt to detailed brief, then generate config
- [x] Handle both short ("pizza shop") and long (detailed description) prompts

### 3. Client-side improvements
- [x] Better error messages shown to user
- [x] Generation timer already exists (good)

### 4. Validation hardening
- [x] Ensure validateSiteConfig handles all new props
- [x] Fallback presets still work as safety net

### 5. Verify end-to-end
- [x] Deploy to Vercel
- [x] Test 5 diverse prompts:
  1. "vintage bookshop in Portland" -> "Paper & Rain Antiquarian", 11 blocks, gold accent, Playfair Display
  2. "B2B cybersecurity platform" -> "Vantaguard", 11 blocks, green accent, "The Perimeter is Dead."
  3. "yoga studio in Brooklyn" -> "Concrete Lotus", 10 blocks, bronze accent, "Grit Meets Grace"
  4. "fintech startup for freelancers" -> "SoloStream", 10 blocks, mint accent, "The Solo Life, Optimized."
  5. "pizza shop" -> "Neon Crust", 10 blocks, magenta accent, "Born in the Dark. Baked in the Light."
- [x] Each produces unique site with relevant copy, theme, and 8+ blocks
- [x] Suggestion pills produce rich sites (via fallback presets + new API)
- [x] Fallback presets still work when API fails (network error -> preset)

## Files Changed
- `api/generate.ts` - Model upgrade, system prompt rewrite
- `src/lib/generate-site.ts` - Prompt enhancement, error handling

## Verification Criteria (must ALL pass)
1. `npm run build` passes
2. 5 diverse prompts each produce unique, relevant sites
3. Themes match the vibe (dark for tech, warm for food, etc.)
4. Copy is specific and compelling (no "Lorem ipsum", no generic "Get Started")
5. Each site has 8+ blocks with proper content
6. Suggestion pills work with new backend
7. Fallback presets still work when API is down

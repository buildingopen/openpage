# OpenPage Issues

## Issue #1: Mock projects load default config
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Page:** Dashboard
- **Description:** The 4 seed projects (Acme Landing Page, SaaS Dashboard, Portfolio Site, Startup MVP) have no config stored. When clicked, they all load `defaultConfig` which is the generic "Build websites with JSON" template. Each project should have unique, realistic config matching its name and description.
- **Fix:** Each mock project now gets a proper SiteConfig via `getTemplateForPrompt()` with appropriate keywords: Acme -> agency template, SaaS -> default SaaS, Portfolio -> portfolio template, Startup -> blog template. Block counts auto-calculated from actual config.

## Issue #2: Attachment button silently ignores files
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Page:** Dashboard prompt section
- **Description:** The paperclip button opens a file picker, files get selected and pills appear, but when Generate is clicked the attachments are completely ignored. No warning, no indication this is non-functional. Overpromises.
- **Fix:** Removed file input, attachment state, and attachment pills. Paperclip button is now dimmed (40% opacity) and shows "Image attachments coming soon" toast on click. Title says "Coming soon".

## Issue #3: Deploy to Vercel card looks functional but isn't
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Page:** Deploy
- **Description:** The "Deploy to Vercel" card looks identical to working export options (Static HTML, JSON Config) with the same styling and an ExternalLink icon suggesting it opens something. Clicking shows a toast "Vercel export coming soon". Deceptive UX.
- **Fix:** Moved "Deploy to Vercel" from working options to a "Coming soon" section. Cards are dimmed (50% opacity), use muted styling, and show a "Soon" badge. Visually distinct from functional export options.

## Issue #4: Generation overlay shows fake progress for template fallback
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Page:** Editor (GenerationOverlay)
- **Description:** When no Gemini API key exists and the server has no key, generation falls back to a hardcoded template. But the overlay still shows 4 animated progress steps (Analyzing prompt, Generating layout, Writing copy, Applying theme) that play out over ~15 seconds, pretending real AI work is happening. The template loads in milliseconds. This is dishonest.
- **Fix:** `generateSiteConfig` now returns `{ config, source: 'ai' | 'template' }`. When source is 'template', the overlay clears immediately (template resolves in ms) and a toast says "Generated from template. Add a Gemini API key in Settings for AI generation." No fake progress animation plays.

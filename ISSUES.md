# OpenPage Issues

## Issue #1: Mock projects load default config
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Fix:** Each mock project now gets a proper SiteConfig via `getTemplateForPrompt()` with appropriate keywords.

## Issue #2: Attachment button silently ignores files
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Fix:** Removed dead file input/state. Paperclip button dimmed with "coming soon" toast.

## Issue #3: Deploy to Vercel card looks functional but isn't
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Fix:** Moved to "Coming soon" section with visual distinction.

## Issue #4: Generation overlay shows fake progress for template fallback
- **Status:** FIXED
- **Reported:** 2026-02-28
- **Fix:** `generateSiteConfig` returns source info. Template fallback clears overlay immediately.

## Issue #5: Multi-page HTML export only renders first page
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Deploy / Export
- **Fix:** Export now renders all pages as sections with anchor navigation. Multi-page sites get a sticky nav bar in the exported HTML.

## Issue #6: No error boundary on block rendering
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Editor canvas
- **Fix:** Each block render wrapped in BlockErrorBoundary. Failed blocks show recoverable error message instead of crashing the canvas.

## Issue #7: No generation timeout
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Editor generation overlay
- **Fix:** 30s timeout added to AbortController. Shows error toast on timeout.

## Issue #8: Settings page has fake/misleading UI
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Settings
- **Fix:** Removed language dropdown (no i18n). Replaced DNS table with placeholder. Disabled danger zone buttons. Fixed analytics copy to say "future deploy integrations" not "automatically when you deploy".

## Issue #9: Undo/redo gives no visual feedback
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Editor toolbar
- **Fix:** Undo/redo buttons now show brief toast with action label (e.g. "Undo: Update properties").

## Issue #10: Keyboard shortcuts not discoverable
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Editor toolbar
- **Fix:** Added HelpCircle button in toolbar that opens ShortcutsModal. Previously only accessible via "?" hotkey.

## Issue #11: Undo stack grows unbounded
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** configStore
- **Fix:** Capped undo stack at 50 entries to prevent localStorage bloat.

## Issue #12: Project rename not discoverable
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Dashboard
- **Fix:** Added pencil icon that appears on hover next to project name. Still double-click to edit.

## Issue #13: Component library has no search
- **Status:** FIXED
- **Reported:** 2026-03-01
- **Page:** Components
- **Fix:** Added search input above category filters. Searches component label, description, and type.

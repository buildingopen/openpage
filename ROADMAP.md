# OpenPage UX Fix Roadmap

## Phase 1: Critical - Trust & Reliability
Things that break user trust or crash the app.

### 1.1 Multi-page HTML export
Export only renders first page. Multi-page sites silently lose all other pages.
Fix: Render all pages as sections with anchor nav in single HTML.

### 1.2 Block error boundary
One bad block config crashes the entire canvas. No recovery.
Fix: Wrap each block render in error boundary with recoverable fallback.

### 1.3 Generation timeout
If server hangs, overlay stays forever. No escape except Cancel button.
Fix: 30s timeout on AbortController in useGenerationOrchestration.

---

## Phase 2: Honesty - Stop faking
Remove or properly mark non-functional UI.

### 2.1 Settings cleanup
- Language dropdown: remove (not implemented, no i18n)
- DNS table: replace with placeholder text (deploy not implemented)
- Danger zone: disable buttons, show "Contact support" as description
- Analytics copy: fix misleading "injected automatically when you deploy"

---

## Phase 3: Editor Polish

### 3.1 Undo/redo toast feedback
Ctrl+Z works but gives zero visual feedback.
Fix: Toast with action label on undo/redo.

### 3.2 Keyboard shortcuts button in toolbar
ShortcutsModal exists but no visible button. Only "?" hotkey.
Fix: Add "?" button next to history in CanvasToolbar.

### 3.3 Undo stack cap
Stack grows unbounded in localStorage.
Fix: Cap at 50 entries.

---

## Phase 4: Discoverability

### 4.1 Project rename visual affordance
Double-click to rename has no visual hint.
Fix: Show pencil icon on hover.

### 4.2 Component library search
Category filters exist but no keyword search.
Fix: Add search input above categories.

---

## Verification
After each phase: npm run build, deploy, verify.

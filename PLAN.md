# OpenPage: React Migration Plan (Adjusted)

## Context
Port wireframes.html to a React app with production-quality shadcn-level block components. Each version is deployable, pushed to GitHub, hosted on Vercel.

## Tech Stack
- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** + shadcn/ui (confirmed compatible)
- **Zustand + immer** for state (JSON config as single source of truth)
- **React Router v7** (5 flat routes)
- **lucide-react** for icons
- **sonner** for toasts

## Adjustments from Original Plan

### 1. Split v0.6.0 into two milestones
v0.6.0 = essential blocks (Hero, Features, Pricing, CTA, Footer, Navbar - 6 types)
v0.6.5 = secondary blocks (Testimonials, Stats, FAQ, Team, Contact, Newsletter, Logo Cloud - 7 types)
This is ~40% of total effort; splitting prevents a single massive PR.

### 2. Defer ContentEditable to v0.10.0
v0.4.0 uses sidebar-only property editing. No inline editing on canvas.
ContentEditable two-way binding is a rabbit hole (cursor jumps, selection loss, React reconciliation issues). Add it as polish in v0.10.0 only if time allows.

### 3. Add missing fundamentals
- Error boundaries in v0.1.0 scaffold
- localStorage persistence for projects in v0.2.0
- 404 route in v0.1.0
- Mobile nav collapse in v0.1.0

---

## Versioned Milestones

### v0.1.0 - Scaffold + Design System
- Vite init, Tailwind v4, shadcn/ui setup
- Fonts: DM Sans, JetBrains Mono, Space Grotesk
- Design tokens ported from wireframes CSS vars
- AppLayout + TopNav with 5 route shells (Dashboard, Editor, Components, Deploy, Settings)
- 404 route
- Error boundary wrapper
- Mobile nav (collapse to hamburger)
- Deploy to Vercel
- **Verify**: `npm run build` passes, all 5 routes render, Vercel live

### v0.2.0 - Dashboard
- Project grid with search + filter chips (All/Published/Drafts)
- Project cards with status dots, thumbnail placeholders
- "Create New Site" card
- Mock data from wireframe (3-4 projects)
- localStorage persistence for projects
- **Verify**: filter/search works, cards render, persists on reload

### v0.3.0 - Editor Layout + Canvas
- 3-column editor (left 256px, center flex, right 272px)
- CanvasToolbar: breadcrumb, page tabs, viewport toggle, undo/redo buttons
- Canvas renders blocks from `configStore` (wireframe-style placeholders)
- LayersPanel with block list
- Block selection syncs: layers <-> canvas <-> right sidebar
- Empty state when no blocks
- **Verify**: selecting block highlights in all 3 columns, empty state shows

### v0.4.0 - Properties Panel (Sidebar-Only Editing)
- Dynamic right sidebar per block type (hero/features/cta/footer)
- Property inputs (text, textarea, select, color swatches) update canvas live
- NO contentEditable on canvas (sidebar is sole editing interface)
- "View Block JSON" toggle per panel
- **Verify**: changing sidebar inputs updates canvas in real-time

### v0.5.0 - JSON Drawer + Agent Chat UI
- Bottom JSON drawer with syntax highlighting (manual coloring, no heavy lib)
- Live sync indicator (green dot)
- Drawer toggle with keyboard shortcut (J)
- Agent chat panel: messages, typing indicator, JSON patch diffs with Apply/Reject, suggestion chips
- Left sidebar Layers/Agent mode toggle
- Visual only (no AI backend)
- **Verify**: JSON drawer reflects config, agent UI renders messages

### v0.6.0 - Core Block Components
Replace wireframe placeholders with production-quality rendered components:

| Block | Variants | Key Design |
|-------|----------|------------|
| Navbar | default | Logo + nav links + CTA button |
| Hero | centered, split, gradient | text-5xl headline, gradient text, py-24+ |
| Features | grid (3-col), list | Icon cards with hover lift + border glow |
| Pricing | simple (3-col), comparison | Featured tier green glow + "Recommended" badge |
| CTA | simple, split | Green-tinted bg, centered text + button |
| Footer | simple, multi-column, minimal | Logo + link columns |

All blocks: Tailwind-only, responsive, dark theme native, green accent (#22c55e), hover animations, shadcn/ui primitives where useful.

- **Verify**: each block renders correctly with all variants, responsive at 3 breakpoints

### v0.6.5 - Extended Block Components
| Block | Variants | Key Design |
|-------|----------|------------|
| Testimonials | cards, carousel | Avatar + quote + star ratings |
| Stats | grid, bar | Large numbers + labels |
| FAQ | accordion | shadcn Accordion, clean expand/collapse |
| Team | grid | Photo placeholder + name + role |
| Contact | form | Name/email/message inputs |
| Newsletter | simple | Email input + subscribe + social proof |
| Logo Cloud | default | Grayscale logos with hover color |

- **Verify**: all 7 block types render, accordion expands/collapses

### v0.7.0 - Component Library Screen
- Browse components with live mini-previews (CSS scale transform)
- Category filters (chips), variant counts
- JSON schema tooltip on hover
- Click to add block to current project
- **Verify**: all 13 block types appear, filters work, add-to-project works

### v0.8.0 - Block Operations + Drag & Drop
- Add/remove/duplicate/reorder blocks
- @dnd-kit for drag reorder in layers panel
- Undo/redo stack in configStore (full operation history)
- Keyboard: Ctrl+Z / Ctrl+Shift+Z
- **Verify**: drag reorder works, undo/redo restores state, duplicate creates copy

### v0.9.0 - Deploy + Settings Screens
- Deploy screen: 5 export options (Vercel, Netlify, Static HTML, Next.js, JSON) + status section
- Settings: 7 sub-panels
  - General, SEO (Google preview), Domain (DNS table), Analytics, Integrations, API Keys, Danger Zone
- All visual, no real backend
- **Verify**: all panels render, Google preview updates from inputs

### v0.10.0 - History + Shortcuts + Polish
- Version history overlay panel
- Keyboard shortcuts: 1-5 (nav), J (JSON drawer), H (history), ? (help modal), Esc (deselect)
- Toast notifications (sonner) for block operations
- Viewport responsive preview (desktop/tablet/mobile)
- Animation polish (transitions, micro-interactions)
- Optional: ContentEditable inline editing on canvas (only if stable)
- **Verify**: shortcuts work, toasts appear, viewport preview resizes canvas

### v1.0.0 - First Release
- CLAUDE.md for the project
- README with screenshots
- Final Vercel deploy
- Git tag v1.0.0

---

## File Structure
```
src/
  routes/        Dashboard, Editor, Components, Deploy, Settings, NotFound
  layout/        AppLayout, TopNav, ErrorBoundary
  editor/        EditorLayout, LeftSidebar, LayersPanel, AgentPanel,
                 Canvas, CanvasToolbar, CanvasFrame, CanvasEmpty,
                 JsonDrawer, RightSidebar, PropertiesPanel, VersionHistory
  blocks/        registry.ts, types.ts, BlockWrapper.tsx
    hero/        HeroBlock, HeroCentered, HeroSplit, HeroGradient
    features/    FeaturesBlock, FeaturesGrid, FeaturesList
    pricing/     PricingBlock, PricingSimple, PricingComparison
    cta/         CtaBlock, CtaSimple, CtaSplit
    footer/      FooterBlock, FooterSimple, FooterMultiColumn, FooterMinimal
    navbar/      NavbarBlock, NavbarDefault
    testimonials/ TestimonialsBlock, TestimonialsCards, TestimonialsCarousel
    stats/       StatsBlock, StatsGrid, StatsBar
    faq/         FaqBlock, FaqAccordion
    team/        TeamBlock, TeamGrid
    contact/     ContactBlock, ContactForm
    newsletter/  NewsletterBlock, NewsletterSimple
    logocloud/   LogoCloudBlock, LogoCloudDefault
  store/         configStore, editorStore, projectsStore
  components/ui/ shadcn/ui primitives
  lib/           utils, config-defaults, block-metadata
```

## Key Architecture
- **configStore** (Zustand + immer): site JSON config, undo/redo stack
- **editorStore** (Zustand): selectedBlockId, activePanel, viewport, UI state
- **projectsStore** (Zustand + localStorage): project list, CRUD
- **Block Registry**: maps `type` string -> React component, drives canvas rendering
- **BlockWrapper**: shared selection/hover UI around each block in editor mode
- **One-way binding** (v0.4.0): sidebar inputs -> store -> canvas re-renders. No contentEditable.

## Deploy
- GitHub: `federicodeponte/openpage` (private, exists)
- Vercel: fede account (token in memory), team: fedes-projects-5891bd50
- Git tags per version

## Verification Protocol
After each version:
1. `npm run build` must pass (zero errors)
2. `npm run dev` - visually verify all screens
3. Git commit + tag
4. Push to GitHub
5. Deploy to Vercel, confirm live URL works

# OpenPage

## What This Is

A visual website builder where **JSON config is the source of truth**. Both humans (via visual editor) and AI agents (via JSON patches) can build websites. React app with 13 production-quality block components.

## Tech Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** + shadcn/ui patterns
- **Zustand + immer** for state management
- **React Router v7** for routing
- **@dnd-kit** for drag-and-drop
- **sonner** for toasts, **lucide-react** for icons

## Project Structure

```
src/
  routes/        Dashboard, Editor, Components, Deploy, Settings, NotFound
  layout/        AppLayout, TopNav, ErrorBoundary
  editor/        EditorLayout, Canvas, CanvasToolbar, LayersPanel, AgentPanel,
                 JsonDrawer, RightSidebar, PropertiesPanel, VersionHistory
  blocks/        registry.tsx, types.ts, BlockWrapper.tsx
    hero/        HeroCentered, HeroSplit, HeroGradient
    features/    FeaturesGrid, FeaturesList
    pricing/     PricingSimple, PricingComparison
    cta/         CtaSimple, CtaSplit
    footer/      FooterSimple, FooterMultiColumn, FooterMinimal
    navbar/      NavbarDefault
    testimonials/ TestimonialsCards, TestimonialsCarousel
    stats/       StatsGrid, StatsBar
    faq/         FaqAccordion
    team/        TeamGrid
    contact/     ContactForm
    newsletter/  NewsletterSimple
    logocloud/   LogoCloudDefault
  store/         configStore (site JSON + undo/redo), editorStore (UI state), projectsStore (projects + localStorage)
  lib/           utils, block-metadata, useKeyboardShortcuts
```

## Key Architecture

- **configStore**: Zustand + immer. Holds site JSON config and full undo/redo stack.
- **Block Registry**: Maps block type string to React component. `renderBlock(config)` resolves and renders.
- **BlockWrapper**: Shared selection/hover/type-tag UI around each block in editor mode.
- **Sidebar editing**: Right sidebar has dynamic property inputs per block type. Changes update store, canvas re-renders.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
```

## Design Tokens

All from wireframes.html:
- Backgrounds: bg-0 (#09090b) through bg-5 (#303036)
- Green accent: #22c55e (--color-green)
- Fonts: DM Sans (body), JetBrains Mono (code), Space Grotesk (display)

## Conventions

- Dark theme only (no light mode)
- Green (#22c55e) is the sole accent color
- All blocks are Tailwind-only, no external CSS
- Block components receive `{ block: BlockConfig }` as props
- Use `@/` import alias for all src/ imports

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import type { BlockConfig, SiteConfig, ThemeConfig, PageConfig } from '@/blocks/types'

function ensurePages(config: SiteConfig): PageConfig[] {
  if (config.pages && config.pages.length > 0) return config.pages
  return [{ id: 'page-home', name: 'Home', path: '/', blocks: config.blocks }]
}

function getPageBlocks(config: SiteConfig, pageId: string): BlockConfig[] {
  const pages = ensurePages(config)
  const page = pages.find((p) => p.id === pageId)
  return page?.blocks ?? pages[0]?.blocks ?? []
}

interface UndoEntry {
  pages?: PageConfig[]
  blocks: BlockConfig[]
  theme?: Partial<ThemeConfig>
  label: string
  timestamp: number
}

interface ConfigState {
  config: SiteConfig
  activePageId: string
  undoStack: UndoEntry[]
  redoStack: UndoEntry[]
  setConfig: (config: SiteConfig) => void
  setActivePage: (id: string) => void
  getActivePageBlocks: () => BlockConfig[]
  updateBlock: (id: string, updates: Partial<BlockConfig>) => void
  updateBlockProps: (id: string, props: Record<string, unknown>) => void
  addBlock: (block: BlockConfig, index?: number) => void
  removeBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  addPage: (name: string, path: string) => string
  removePage: (id: string) => void
  renamePage: (id: string, name: string) => void
  setTheme: (theme: Partial<ThemeConfig>) => void
  updateTheme: (partial: Partial<ThemeConfig>) => void
  previewTheme: (partial: Partial<ThemeConfig>) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const defaultBlocks: BlockConfig[] = [
  {
    id: 'block-navbar',
    type: 'navbar',
    variant: 'default',
    props: {
      logo: 'Acme Inc',
      links: ['Features', 'Pricing', 'About', 'Contact'],
      ctaText: 'Get Started',
    },
  },
  {
    id: 'block-hero',
    type: 'hero',
    variant: 'centered',
    props: {
      badge: 'Now in Beta',
      headline: 'Build websites with JSON',
      subheadline: 'The visual editor that agents and humans both understand. Structured config, beautiful output.',
      primaryCta: 'Start Building',
      secondaryCta: 'View Demo',
    },
  },
  {
    id: 'block-features',
    type: 'features',
    variant: 'grid',
    props: {
      label: 'Features',
      title: 'Everything you need',
      subtitle: 'Powerful building blocks for your next website',
      items: [
        { icon: 'Blocks', title: 'Visual Editor', description: 'Drag and drop blocks to build your layout' },
        { icon: 'Code', title: 'JSON Config', description: 'Every change is a clean JSON mutation' },
        { icon: 'Bot', title: 'Agent Ready', description: 'AI agents can read and write your config' },
      ],
    },
  },
  {
    id: 'block-cta',
    type: 'cta',
    variant: 'simple',
    props: {
      headline: 'Ready to get started?',
      subheadline: 'Create your first site in minutes.',
      buttonText: 'Start Free',
    },
  },
  {
    id: 'block-footer',
    type: 'footer',
    variant: 'simple',
    props: {
      logo: 'OpenPage',
      copyright: '2026 OpenPage. All rights reserved.',
      links: ['Privacy', 'Terms', 'Contact'],
    },
  },
]

export const defaultConfig: SiteConfig = {
  name: 'My Website',
  pages: [{ id: 'page-home', name: 'Home', path: '/', blocks: defaultBlocks }],
  blocks: defaultBlocks,
}

function snapshot(state: ConfigState): { pages?: PageConfig[]; blocks: BlockConfig[]; theme?: Partial<ThemeConfig> } {
  return {
    pages: state.config.pages ? JSON.parse(JSON.stringify(state.config.pages)) : undefined,
    blocks: JSON.parse(JSON.stringify(state.config.blocks)),
    theme: state.config.theme ? JSON.parse(JSON.stringify(state.config.theme)) : undefined,
  }
}

function pushUndo(state: ConfigState, label: string): Partial<ConfigState> {
  const snap = snapshot(state)
  return {
    undoStack: [...state.undoStack, { ...snap, label, timestamp: Date.now() }],
    redoStack: [],
  }
}

function withPages(config: SiteConfig): SiteConfig {
  const pages = ensurePages(config)
  return { ...config, pages }
}

function mutateActivePageBlocks(
  config: SiteConfig,
  activePageId: string,
  mutator: (blocks: BlockConfig[]) => BlockConfig[],
): SiteConfig {
  const pages = ensurePages(config)
  const newPages = pages.map((p) =>
    p.id === activePageId ? { ...p, blocks: mutator([...p.blocks]) } : p,
  )
  // Keep top-level blocks synced with first page for backward compat
  const activeBlocks = newPages.find((p) => p.id === activePageId)?.blocks ?? []
  return { ...config, pages: newPages, blocks: activeBlocks }
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      activePageId: 'page-home',
      undoStack: [],
      redoStack: [],

      setConfig: (config) => {
        const pages = ensurePages(config)
        set({ config: { ...config, pages }, activePageId: pages[0]?.id ?? 'page-home', undoStack: [], redoStack: [] })
      },

      setActivePage: (id) => set({ activePageId: id }),

      getActivePageBlocks: () => {
        const state = get()
        return getPageBlocks(state.config, state.activePageId)
      },

      updateBlock: (id, updates) =>
        set((state) => ({
          ...pushUndo(state, 'Update block'),
          config: produce(withPages(state.config), (draft) => {
            const page = draft.pages!.find((p) => p.id === state.activePageId)
            if (!page) return
            const block = page.blocks.find((b) => b.id === id)
            if (block) Object.assign(block, updates)
            draft.blocks = page.blocks
          }),
        })),

      updateBlockProps: (id, props) =>
        set((state) => ({
          ...pushUndo(state, 'Update properties'),
          config: produce(withPages(state.config), (draft) => {
            const page = draft.pages!.find((p) => p.id === state.activePageId)
            if (!page) return
            const block = page.blocks.find((b) => b.id === id)
            if (block) Object.assign(block.props, props)
            draft.blocks = page.blocks
          }),
        })),

      addBlock: (block, index) =>
        set((state) => ({
          ...pushUndo(state, 'Add block'),
          config: mutateActivePageBlocks(withPages(state.config), state.activePageId, (blocks) => {
            if (index !== undefined) {
              blocks.splice(index, 0, block)
            } else {
              blocks.push(block)
            }
            return blocks
          }),
        })),

      removeBlock: (id) =>
        set((state) => ({
          ...pushUndo(state, 'Remove block'),
          config: mutateActivePageBlocks(withPages(state.config), state.activePageId, (blocks) =>
            blocks.filter((b) => b.id !== id),
          ),
        })),

      duplicateBlock: (id) =>
        set((state) => {
          const blocks = getPageBlocks(state.config, state.activePageId)
          const idx = blocks.findIndex((b) => b.id === id)
          if (idx === -1) return state
          const original = blocks[idx]
          const clone: BlockConfig = {
            ...JSON.parse(JSON.stringify(original)),
            id: `block-${Date.now()}`,
          }
          return {
            ...pushUndo(state, 'Duplicate block'),
            config: mutateActivePageBlocks(withPages(state.config), state.activePageId, (b) => {
              b.splice(idx + 1, 0, clone)
              return b
            }),
          }
        }),

      moveBlock: (fromIndex, toIndex) =>
        set((state) => ({
          ...pushUndo(state, 'Move block'),
          config: mutateActivePageBlocks(withPages(state.config), state.activePageId, (blocks) => {
            const [moved] = blocks.splice(fromIndex, 1)
            blocks.splice(toIndex, 0, moved)
            return blocks
          }),
        })),

      addPage: (name, path) => {
        const id = `page-${Date.now()}`
        set((state) => ({
          ...pushUndo(state, 'Add page'),
          config: produce(withPages(state.config), (draft) => {
            draft.pages!.push({ id, name, path, blocks: [] })
          }),
          activePageId: id,
        }))
        return id
      },

      removePage: (id) =>
        set((state) => {
          const pages = ensurePages(state.config)
          if (pages.length <= 1) return state
          const newPages = pages.filter((p) => p.id !== id)
          const newActiveId = state.activePageId === id ? newPages[0].id : state.activePageId
          return {
            ...pushUndo(state, 'Remove page'),
            config: { ...state.config, pages: newPages, blocks: newPages[0].blocks },
            activePageId: newActiveId,
          }
        }),

      renamePage: (id, name) =>
        set((state) => ({
          config: produce(withPages(state.config), (draft) => {
            const page = draft.pages!.find((p) => p.id === id)
            if (page) page.name = name
          }),
        })),

      setTheme: (theme) =>
        set((state) => ({
          ...pushUndo(state, 'Change theme'),
          config: { ...state.config, theme },
        })),

      updateTheme: (partial) =>
        set((state) => ({
          ...pushUndo(state, 'Update theme'),
          config: { ...state.config, theme: { ...state.config.theme, ...partial } },
        })),

      previewTheme: (partial) =>
        set((state) => ({
          config: { ...state.config, theme: { ...state.config.theme, ...partial } },
        })),

      undo: () =>
        set((state) => {
          if (state.undoStack.length === 0) return state
          const prev = state.undoStack[state.undoStack.length - 1]
          const snap = snapshot(state)
          return {
            undoStack: state.undoStack.slice(0, -1),
            redoStack: [...state.redoStack, { ...snap, label: prev.label, timestamp: Date.now() }],
            config: { ...state.config, pages: prev.pages, blocks: prev.blocks, theme: prev.theme },
          }
        }),

      redo: () =>
        set((state) => {
          if (state.redoStack.length === 0) return state
          const next = state.redoStack[state.redoStack.length - 1]
          const snap = snapshot(state)
          return {
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, { ...snap, label: next.label, timestamp: Date.now() }],
            config: { ...state.config, pages: next.pages, blocks: next.blocks, theme: next.theme },
          }
        }),

      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,
    }),
    {
      name: 'openpage-config',
      version: 2,
      partialize: (state) => ({ config: state.config, activePageId: state.activePageId }),
      migrate: (persisted, version) => {
        const data = persisted as Record<string, unknown>
        if (version === 0 || version === 1 || version === undefined) {
          // v0/v1 -> v2: wrap blocks[] into pages[]
          const config = data.config as SiteConfig | undefined
          if (config && !config.pages) {
            config.pages = [{ id: 'page-home', name: 'Home', path: '/', blocks: config.blocks || [] }]
          }
          data.activePageId = 'page-home'
          return data
        }
        return data
      },
    }
  )
)

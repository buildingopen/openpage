import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import type { BlockConfig, SiteConfig } from '@/blocks/types'

interface UndoEntry {
  blocks: BlockConfig[]
  label: string
  timestamp: number
}

interface ConfigState {
  config: SiteConfig
  undoStack: UndoEntry[]
  redoStack: UndoEntry[]
  setConfig: (config: SiteConfig) => void
  updateBlock: (id: string, updates: Partial<BlockConfig>) => void
  updateBlockProps: (id: string, props: Record<string, unknown>) => void
  addBlock: (block: BlockConfig, index?: number) => void
  removeBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (fromIndex: number, toIndex: number) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const defaultConfig: SiteConfig = {
  name: 'My Website',
  blocks: [
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
  ],
}

function pushUndo(state: ConfigState, label: string): Partial<ConfigState> {
  return {
    undoStack: [...state.undoStack, { blocks: JSON.parse(JSON.stringify(state.config.blocks)), label, timestamp: Date.now() }],
    redoStack: [],
  }
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      undoStack: [],
      redoStack: [],

      setConfig: (config) => set({ config, undoStack: [], redoStack: [] }),

      updateBlock: (id, updates) =>
        set((state) => ({
          ...pushUndo(state, 'Update block'),
          config: produce(state.config, (draft) => {
            const block = draft.blocks.find((b) => b.id === id)
            if (block) Object.assign(block, updates)
          }),
        })),

      updateBlockProps: (id, props) =>
        set((state) => ({
          ...pushUndo(state, 'Update properties'),
          config: produce(state.config, (draft) => {
            const block = draft.blocks.find((b) => b.id === id)
            if (block) Object.assign(block.props, props)
          }),
        })),

      addBlock: (block, index) =>
        set((state) => ({
          ...pushUndo(state, 'Add block'),
          config: produce(state.config, (draft) => {
            if (index !== undefined) {
              draft.blocks.splice(index, 0, block)
            } else {
              draft.blocks.push(block)
            }
          }),
        })),

      removeBlock: (id) =>
        set((state) => ({
          ...pushUndo(state, 'Remove block'),
          config: produce(state.config, (draft) => {
            draft.blocks = draft.blocks.filter((b) => b.id !== id)
          }),
        })),

      duplicateBlock: (id) =>
        set((state) => {
          const idx = state.config.blocks.findIndex((b) => b.id === id)
          if (idx === -1) return state
          const original = state.config.blocks[idx]
          const clone: BlockConfig = {
            ...JSON.parse(JSON.stringify(original)),
            id: `block-${Date.now()}`,
          }
          return {
            ...pushUndo(state, 'Duplicate block'),
            config: produce(state.config, (draft) => {
              draft.blocks.splice(idx + 1, 0, clone)
            }),
          }
        }),

      moveBlock: (fromIndex, toIndex) =>
        set((state) => ({
          ...pushUndo(state, 'Move block'),
          config: produce(state.config, (draft) => {
            const [moved] = draft.blocks.splice(fromIndex, 1)
            draft.blocks.splice(toIndex, 0, moved)
          }),
        })),

      undo: () =>
        set((state) => {
          if (state.undoStack.length === 0) return state
          const prev = state.undoStack[state.undoStack.length - 1]
          return {
            undoStack: state.undoStack.slice(0, -1),
            redoStack: [...state.redoStack, { blocks: JSON.parse(JSON.stringify(state.config.blocks)), label: prev.label, timestamp: Date.now() }],
            config: { ...state.config, blocks: prev.blocks },
          }
        }),

      redo: () =>
        set((state) => {
          if (state.redoStack.length === 0) return state
          const next = state.redoStack[state.redoStack.length - 1]
          return {
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, { blocks: JSON.parse(JSON.stringify(state.config.blocks)), label: next.label, timestamp: Date.now() }],
            config: { ...state.config, blocks: next.blocks },
          }
        }),

      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,
    }),
    {
      name: 'openpage-config',
      partialize: (state) => ({ config: state.config }),
    }
  )
)

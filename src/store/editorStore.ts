import { create } from 'zustand'

export type LeftPanel = 'layers' | 'agent'
export type Viewport = 'desktop' | 'tablet' | 'mobile'

interface EditorState {
  selectedBlockId: string | null
  leftPanel: LeftPanel
  viewport: Viewport
  jsonDrawerOpen: boolean
  historyOpen: boolean
  shortcutsModalOpen: boolean
  selectBlock: (id: string | null) => void
  setLeftPanel: (panel: LeftPanel) => void
  setViewport: (vp: Viewport) => void
  toggleJsonDrawer: () => void
  toggleHistory: () => void
  toggleShortcutsModal: () => void
}

export const useEditorStore = create<EditorState>()((set) => ({
  selectedBlockId: null,
  leftPanel: 'layers',
  viewport: 'desktop',
  jsonDrawerOpen: false,
  historyOpen: false,
  shortcutsModalOpen: false,
  selectBlock: (id) => set({ selectedBlockId: id }),
  setLeftPanel: (panel) => set({ leftPanel: panel }),
  setViewport: (vp) => set({ viewport: vp }),
  toggleJsonDrawer: () => set((s) => ({ jsonDrawerOpen: !s.jsonDrawerOpen })),
  toggleHistory: () => set((s) => ({ historyOpen: !s.historyOpen })),
  toggleShortcutsModal: () => set((s) => ({ shortcutsModalOpen: !s.shortcutsModalOpen })),
}))

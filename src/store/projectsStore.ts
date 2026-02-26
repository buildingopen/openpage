import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SiteConfig } from '@/blocks/types'

export interface Project {
  id: string
  name: string
  status: 'published' | 'draft'
  updatedAt: string
  blockCount: number
  config?: SiteConfig
  settings?: ProjectSettings
}

export interface ProjectSettings {
  siteName?: string
  siteDescription?: string
  faviconUrl?: string
  language?: string
  seoTitle?: string
  seoDescription?: string
  ogImageUrl?: string
  customDomain?: string
  gaId?: string
  posthogKey?: string
}

interface ProjectsState {
  projects: Project[]
  addProject: (name: string) => string
  deleteProject: (id: string) => void
  renameProject: (id: string, name: string) => void
  updateProjectConfig: (id: string, config: SiteConfig) => void
  updateProjectSettings: (id: string, settings: Partial<ProjectSettings>) => void
}

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Acme Landing Page',
    status: 'published',
    updatedAt: '2 hours ago',
    blockCount: 8,
  },
  {
    id: 'proj-2',
    name: 'SaaS Dashboard',
    status: 'draft',
    updatedAt: '1 day ago',
    blockCount: 5,
  },
  {
    id: 'proj-3',
    name: 'Portfolio Site',
    status: 'published',
    updatedAt: '3 days ago',
    blockCount: 12,
  },
  {
    id: 'proj-4',
    name: 'Startup MVP',
    status: 'draft',
    updatedAt: '1 week ago',
    blockCount: 3,
  },
]

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: mockProjects,
      addProject: (name) => {
        const id = `proj-${Date.now()}`
        set((state) => ({
          projects: [
            {
              id,
              name,
              status: 'draft' as const,
              updatedAt: 'Just now',
              blockCount: 0,
            },
            ...state.projects,
          ],
        }))
        return id
      },
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      renameProject: (id, name) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        })),
      updateProjectConfig: (id, config) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, config, blockCount: config.blocks.length, updatedAt: 'Just now' } : p
          ),
        })),
      updateProjectSettings: (id, settings) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, settings: { ...p.settings, ...settings } } : p
          ),
        })),
    }),
    { name: 'openpage-projects' }
  )
)

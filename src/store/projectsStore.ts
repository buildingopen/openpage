import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  name: string
  status: 'published' | 'draft'
  updatedAt: string
  blockCount: number
}

interface ProjectsState {
  projects: Project[]
  addProject: (name: string) => void
  deleteProject: (id: string) => void
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
      addProject: (name) =>
        set((state) => ({
          projects: [
            {
              id: `proj-${Date.now()}`,
              name,
              status: 'draft' as const,
              updatedAt: 'Just now',
              blockCount: 0,
            },
            ...state.projects,
          ],
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
    }),
    { name: 'openpage-projects' }
  )
)

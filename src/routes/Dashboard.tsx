import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useProjectsStore, type Project } from '@/store/projectsStore'

const filters = ['All', 'Published', 'Drafts'] as const
type Filter = (typeof filters)[number]

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate('/editor')}
      className="bg-bg-1 border border-border-default rounded-xl overflow-hidden cursor-pointer transition-all hover:border-border-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
    >
      {/* Thumbnail */}
      <div className="h-40 bg-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-glow2 to-transparent" />
        <div className="absolute inset-3 border border-dashed border-border-default rounded flex flex-col gap-1 p-2">
          <div className="h-1.5 bg-bg-4 rounded-sm w-3/4" />
          <div className="h-1.5 bg-bg-4 rounded-sm w-1/2" />
          <div className="flex gap-1 mt-1">
            <div className="flex-1 h-7 bg-bg-4 rounded" />
            <div className="flex-1 h-7 bg-bg-4 rounded" />
            <div className="flex-1 h-7 bg-bg-4 rounded" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        <div className="text-sm font-semibold mb-1">{project.name}</div>
        <div className="text-[11.5px] text-text-2 flex items-center gap-2.5">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                project.status === 'published' ? 'bg-green' : 'bg-status-yellow'
              }`}
            />
            {project.status === 'published' ? 'Published' : 'Draft'}
          </span>
          <span>{project.updatedAt}</span>
          <span>{project.blockCount} blocks</span>
        </div>
      </div>
    </div>
  )
}

function NewProjectCard() {
  const addProject = useProjectsStore((s) => s.addProject)
  return (
    <div
      onClick={() => addProject('Untitled Project')}
      className="bg-transparent border border-dashed border-border-default rounded-xl flex items-center justify-center min-h-[234px] cursor-pointer transition-all hover:border-green hover:bg-green-glow2"
    >
      <div className="text-center text-text-2">
        <Plus size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-[13px] font-medium">Create New Site</p>
      </div>
    </div>
  )
}

export function Dashboard() {
  const projects = useProjectsStore((s) => s.projects)
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')

  const filtered = projects.filter((p) => {
    if (filter === 'Published' && p.status !== 'published') return false
    if (filter === 'Drafts' && p.status !== 'draft') return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-12 pt-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-text-2 text-[13.5px] mt-1">
            {projects.length} website{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-12 pt-6 flex gap-2 items-center">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-3"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md border border-border-default bg-bg-2 text-text-0 text-[13px] w-64 outline-none focus:border-green placeholder:text-text-3"
          />
        </div>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
              filter === f
                ? 'text-text-0 bg-bg-3 border border-border-default'
                : 'text-text-2 border border-transparent hover:text-text-1 hover:bg-bg-2'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-12 pt-6 pb-12 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <NewProjectCard />
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  )
}

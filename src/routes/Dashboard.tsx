import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useProjectsStore, type Project } from '@/store/projectsStore'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'

const filters = ['All', 'Published', 'Drafts'] as const
type Filter = (typeof filters)[number]

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const renameProject = useProjectsStore((s) => s.renameProject)
  const setConfig = useConfigStore((s) => s.setConfig)
  const setActiveProject = useEditorStore((s) => s.setActiveProject)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(project.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commitRename() {
    const trimmed = name.trim()
    if (trimmed && trimmed !== project.name) {
      renameProject(project.id, trimmed)
    } else {
      setName(project.name)
    }
    setEditing(false)
  }

  function openProject() {
    setActiveProject(project.id)
    if (project.config) {
      setConfig(project.config)
    }
    navigate('/editor')
  }

  return (
    <div
      onClick={openProject}
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
        {editing ? (
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') { setName(project.name); setEditing(false) }
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-semibold mb-1 bg-transparent border-b border-green outline-none w-full"
          />
        ) : (
          <div
            className="text-sm font-semibold mb-1 hover:text-green transition-colors"
            onDoubleClick={(e) => { e.stopPropagation(); setEditing(true) }}
            title="Double-click to rename"
          >
            {project.name}
          </div>
        )}
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

function EmptyState() {
  const addProject = useProjectsStore((s) => s.addProject)
  const setActiveProject = useEditorStore((s) => s.setActiveProject)
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-24 px-12">
      <div className="w-20 h-20 rounded-2xl bg-bg-2 border border-border-default flex items-center justify-center mb-6">
        <Plus size={32} className="text-text-3" />
      </div>
      <h2 className="text-lg font-semibold mb-2">Create your first site</h2>
      <p className="text-text-2 text-sm mb-6 text-center max-w-sm">
        Start building with our visual editor and component library. Your site config is just JSON.
      </p>
      <button
        onClick={() => { const id = addProject('My First Site'); setActiveProject(id); navigate('/editor') }}
        className="px-5 py-2.5 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all"
      >
        Get Started
      </button>
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

  if (projects.length === 0) {
    return <EmptyState />
  }

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

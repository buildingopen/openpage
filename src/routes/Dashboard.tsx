import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Search, Sparkles, ArrowRight, Trash2, FolderOpen, Copy, Pencil } from 'lucide-react'
import { useProjectsStore, type Project } from '@/store/projectsStore'
import { useConfigStore, defaultConfig } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { hexToRgb } from '@/lib/theme-presets'

const suggestions = [
  {
    label: 'SaaS landing page',
    prompt: 'Create a SaaS landing page for a project management tool called "FlowBoard". Include a hero with a compelling headline about team productivity, a features grid highlighting task boards, real-time collaboration, and analytics. Add a pricing section with Free, Pro ($12/mo), and Enterprise tiers. Use a clean, modern dark theme with blue accents.',
  },
  {
    label: 'Portfolio site',
    prompt: 'Create a portfolio site for a freelance product designer named Alex Chen. Include a hero section with a strong personal headline, a project gallery showcasing 4-6 case studies with titles and descriptions, a testimonials section with client quotes, an about/bio section, and a contact form. Use a minimal, sophisticated aesthetic with warm neutral tones.',
  },
  {
    label: 'Restaurant website',
    prompt: 'Create a website for an upscale Italian restaurant called "Trattoria Luna". Include a hero with an inviting headline about authentic cuisine, a features section highlighting handmade pasta, wood-fired pizza, and a curated wine list. Add a content block with the chef\'s philosophy, a testimonials section with diner reviews, and a CTA to make reservations. Use warm, earthy tones with gold accents.',
  },
  {
    label: 'AI startup',
    prompt: 'Create a landing page for an AI startup called "NeuralFlow" that builds intelligent document processing tools. Include a hero with a bold headline about automating workflows, a features grid with smart extraction, multi-language support, and enterprise security. Add a stats section with impressive numbers, a pricing comparison table, customer testimonials from CTOs, and a strong CTA. Use a sleek dark theme with green accents.',
  },
]

const filters = ['All', 'Published', 'Drafts'] as const
type Filter = (typeof filters)[number]

const fallbackAccents = ['#22c55e', '#3b82f6', '#f472b6', '#8b5cf6', '#e8a838', '#06b6d4', '#10b981', '#ef4444']

function projectHash(name: string): number {
  return name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

function projectAccent(project: Project): string {
  if (project.config?.theme?.accent) return project.config.theme.accent
  return fallbackAccents[projectHash(project.name) % fallbackAccents.length]
}

function PromptSection() {
  const navigate = useNavigate()
  const addProject = useProjectsStore((s) => s.addProject)
  const setConfig = useConfigStore((s) => s.setConfig)
  const setActiveProject = useEditorStore((s) => s.setActiveProject)
  const editorSetGenerating = useEditorStore((s) => s.setGenerating)

  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function startBlank() {
    const id = addProject('Untitled Project')
    setActiveProject(id)
    setConfig(defaultConfig)
    navigate('/editor')
  }

  function generate(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    const hasGeminiKey = !!localStorage.getItem('openpage-gemini-key')
    if (!hasGeminiKey) {
      toast('No API key found. Generating from templates.', { duration: 3000 })
    }

    // Create placeholder project, set generation state, navigate immediately
    const placeholderName = trimmed.split(/\s+/).slice(0, 4).join(' ')
    const id = addProject(placeholderName.charAt(0).toUpperCase() + placeholderName.slice(1))
    setActiveProject(id)
    setConfig(defaultConfig)
    editorSetGenerating(trimmed)
    navigate('/editor')
  }

  const isFocused = prompt.length > 0

  return (
    <div className="relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-green/[0.07] rounded-full blur-[150px]" />
      </div>

      <div className="relative flex flex-col items-center pt-16 pb-6 px-6">
        <h1 className="text-[36px] font-display font-bold tracking-tight mb-2 text-center animate-fade-in-up stagger-1">What will you build?</h1>
        <p className="text-text-2 text-[15px] mb-8 text-center animate-fade-in-up stagger-2">Describe your site and AI generates the layout, copy, and theme.</p>

        {/* Prompt card - gradient border wrapper */}
        <div className={`w-full max-w-[680px] rounded-2xl p-px transition-all duration-300 animate-scale-in stagger-3 ${
          isFocused
            ? 'bg-gradient-to-b from-green/40 via-green/20 to-green/5 shadow-[0_0_80px_rgba(34,197,94,0.15)]'
            : 'bg-gradient-to-b from-border-hover via-border-default to-border-subtle shadow-[0_0_60px_rgba(34,197,94,0.06)] hover:from-green/25 hover:via-green/10 hover:to-green/5 hover:shadow-[0_0_80px_rgba(34,197,94,0.1)]'
        }`}>
          <div className="bg-bg-1 rounded-[15px] overflow-hidden">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  generate(prompt)
                }
              }}
              rows={3}
              placeholder="A landing page for a modern fitness app with dark theme..."
              className="w-full px-5 pt-5 pb-3 bg-transparent text-text-0 text-[14px] placeholder:text-text-3 resize-none leading-relaxed"
            />

            {/* Bottom bar */}
            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              <div className="flex items-center gap-1.5 animate-fade-in stagger-4">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setPrompt(s.prompt); textareaRef.current?.focus() }}
                    className="px-2.5 py-1 rounded-full text-text-3 text-[11px] border border-border-default hover:text-text-0 hover:bg-bg-3 hover:border-border-hover transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {prompt.trim() && (
                  <span className="text-[10px] text-text-3 hidden sm:inline">
                    {navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl'}+Enter
                  </span>
                )}
                <button
                  onClick={() => generate(prompt)}
                  disabled={!prompt.trim()}
                  className="px-5 py-2.5 rounded-xl bg-green text-black text-[13px] font-semibold hover:bg-green-dim active:scale-[0.97] transition-all disabled:opacity-20 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                >
                  <Sparkles size={14} />
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Start blank */}
        <div className="mt-4">
          <button
            onClick={startBlank}
            className="text-text-3 text-[12px] hover:text-text-1 transition-colors inline-flex items-center gap-1.5 animate-fade-in stagger-5"
          >
            or start from a template <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const renameProject = useProjectsStore((s) => s.renameProject)
  const deleteProject = useProjectsStore((s) => s.deleteProject)
  const duplicateProject = useProjectsStore((s) => s.duplicateProject)
  const setConfig = useConfigStore((s) => s.setConfig)
  const setActiveProject = useEditorStore((s) => s.setActiveProject)
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [name, setName] = useState(project.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    return () => { if (confirmTimer.current) clearTimeout(confirmTimer.current) }
  }, [])

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
    setConfig(project.config || defaultConfig)
    navigate('/editor')
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirming) {
      deleteProject(project.id)
    } else {
      setConfirming(true)
      confirmTimer.current = setTimeout(() => setConfirming(false), 2000)
    }
  }

  const accent = projectAccent(project)
  const rgb = hexToRgb(accent)
  const layout = projectHash(project.name) % 3

  return (
    <div
      onClick={openProject}
      className="group bg-bg-1 border border-border-default rounded-xl overflow-hidden cursor-pointer card-lift hover:border-border-hover hover:card-lift-hover"
    >
      {/* Thumbnail */}
      <div className="h-32 bg-bg-2 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}
        />

        {/* Action buttons */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); duplicateProject(project.id); toast('Project duplicated') }}
            aria-label={`Duplicate ${project.name}`}
            className="p-1.5 rounded-md border bg-bg-0/80 border-border-default text-text-3 opacity-0 group-hover:opacity-100 hover:text-green hover:border-green/30 transition-all"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={handleDelete}
            aria-label={confirming ? `Confirm delete ${project.name}` : `Delete ${project.name}`}
            className={`rounded-md border transition-all ${
              confirming
                ? 'px-2 py-1 bg-status-red/90 border-status-red text-white text-[10px] font-medium opacity-100'
                : 'p-1.5 bg-bg-0/80 border-border-default text-text-3 opacity-0 group-hover:opacity-100 hover:text-status-red hover:border-status-red/30'
            }`}
          >
            {confirming ? 'Delete?' : <Trash2 size={12} />}
          </button>
        </div>

        {/* Wireframe - varies by project name hash */}
        <div className="absolute inset-3 flex flex-col gap-1.5 p-2.5">
          {layout === 0 && (
            <>
              <div className="h-2 rounded-sm w-2/3" style={{ background: `rgba(${rgb}, 0.15)` }} />
              <div className="h-1.5 bg-bg-4/40 rounded-sm w-1/2" />
              <div className="flex gap-1.5 mt-auto">
                <div className="flex-1 h-6 rounded" style={{ background: `rgba(${rgb}, 0.07)` }} />
                <div className="flex-1 h-6 rounded" style={{ background: `rgba(${rgb}, 0.07)` }} />
                <div className="flex-1 h-6 rounded" style={{ background: `rgba(${rgb}, 0.07)` }} />
              </div>
            </>
          )}
          {layout === 1 && (
            <>
              <div className="flex gap-2 flex-1">
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-2 rounded-sm w-3/4" style={{ background: `rgba(${rgb}, 0.15)` }} />
                  <div className="h-1.5 bg-bg-4/40 rounded-sm w-full" />
                  <div className="h-1.5 bg-bg-4/40 rounded-sm w-2/3" />
                  <div className="h-4 rounded w-1/2 mt-auto" style={{ background: `rgba(${rgb}, 0.12)` }} />
                </div>
                <div className="w-16 rounded" style={{ background: `rgba(${rgb}, 0.06)` }} />
              </div>
            </>
          )}
          {layout === 2 && (
            <>
              <div className="flex justify-center mt-1">
                <div className="h-2 rounded-sm w-1/3" style={{ background: `rgba(${rgb}, 0.15)` }} />
              </div>
              <div className="flex justify-center">
                <div className="h-1.5 bg-bg-4/40 rounded-sm w-2/3" />
              </div>
              <div className="flex gap-1 mt-auto justify-center">
                <div className="w-12 h-4 rounded" style={{ background: `rgba(${rgb}, 0.12)` }} />
                <div className="w-12 h-4 rounded bg-bg-4/30" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
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
            className="text-[13px] font-semibold mb-1 bg-transparent border-b border-green outline-none w-full"
          />
        ) : (
          <div
            className="text-[13px] font-semibold mb-1 transition-colors text-text-0 flex items-center gap-1.5 group/name"
            onDoubleClick={(e) => { e.stopPropagation(); setEditing(true) }}
            title="Double-click to rename"
          >
            <span className="truncate">{project.name}</span>
            <Pencil size={10} className="text-text-3 opacity-0 group-hover:opacity-100 group-hover/name:opacity-60 transition-opacity shrink-0" />
          </div>
        )}
        <div className="text-[10.5px] text-text-2 flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                project.status === 'published' ? 'bg-green' : 'bg-status-yellow'
              }`}
            />
            {project.status === 'published' ? 'Published' : 'Draft'}
          </span>
          <span className="text-text-3">{project.updatedAt}</span>
        </div>
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
      <PromptSection />

      {/* Projects section */}
      {projects.length > 0 && (
        <>
          <div className="px-4 md:px-12 pt-4">
            <div className="border-t border-border-subtle" />
          </div>

          <div className="px-4 md:px-12 pt-5 flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-[13px] font-semibold text-text-1 animate-fade-in">
                Your projects
                <span className="text-text-3 font-normal ml-1.5">({projects.length})</span>
              </h2>
              <div className="flex gap-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 rounded-full text-[11px] transition-all ${
                      filter === f
                        ? 'text-text-0 bg-bg-3 border border-border-default'
                        : 'text-text-2 border border-transparent hover:text-text-1 hover:bg-bg-2'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-3"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 pr-3 py-1.5 rounded-md border border-border-default bg-bg-2 text-text-0 text-[12px] w-44 outline-none focus:border-green placeholder:text-text-3"
              />
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="px-4 md:px-12 pt-4 pb-12 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 md:px-12 pt-8 pb-12 flex flex-col items-center text-center">
              <FolderOpen size={28} className="text-text-3 mb-2" />
              <p className="text-text-2 text-[13px]">No projects match your filter</p>
              <button
                onClick={() => { setFilter('All'); setSearch('') }}
                className="mt-2 text-green text-[12px] hover:text-green-dim transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

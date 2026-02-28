import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Monitor, Tablet, Smartphone, Undo2, Redo2, Code, Clock, Eye, Plus } from 'lucide-react'
import { useEditorStore, type Viewport } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'
import { useProjectsStore } from '@/store/projectsStore'
import type { PageConfig } from '@/blocks/types'

const viewports: { value: Viewport; icon: typeof Monitor; label: string }[] = [
  { value: 'desktop', icon: Monitor, label: 'Desktop' },
  { value: 'tablet', icon: Tablet, label: 'Tablet' },
  { value: 'mobile', icon: Smartphone, label: 'Mobile' },
]

function AddPagePopover({ onAdd, onClose }: { onAdd: (name: string, path: string) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [path, setPath] = useState('/')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    const cleanPath = path.trim() || `/${trimmed.toLowerCase().replace(/\s+/g, '-')}`
    onAdd(trimmed, cleanPath)
    onClose()
  }

  return (
    <div className="absolute top-full left-0 mt-1 bg-bg-2 border border-border-default rounded-lg p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 w-52">
      <div className="space-y-2">
        <div>
          <label className="block text-[10px] text-text-3 mb-0.5">Page name</label>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (!path || path === '/') setPath(`/${e.target.value.toLowerCase().replace(/\s+/g, '-')}`)
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
            placeholder="About"
            className="w-full px-2 py-1.5 rounded border border-border-default bg-bg-3 text-text-0 text-[11.5px] outline-none focus:border-green"
          />
        </div>
        <div>
          <label className="block text-[10px] text-text-3 mb-0.5">Path</label>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
            placeholder="/about"
            className="w-full px-2 py-1.5 rounded border border-border-default bg-bg-3 text-text-0 text-[11.5px] outline-none focus:border-green font-mono"
          />
        </div>
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="w-full py-1.5 rounded bg-green text-black text-[11px] font-semibold hover:bg-green-dim transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Add Page
        </button>
      </div>
    </div>
  )
}

function PageTab({ page, isActive, onClick, onRename, onDelete, canDelete }: {
  page: PageConfig
  isActive: boolean
  onClick: () => void
  onRename: (name: string) => void
  onDelete: () => void
  canDelete: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(page.name)
  const [showContext, setShowContext] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function commitRename() {
    const trimmed = name.trim()
    if (trimmed && trimmed !== page.name) onRename(trimmed)
    else setName(page.name)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commitRename()
          if (e.key === 'Escape') { setName(page.name); setEditing(false) }
        }}
        className="px-2 py-1 rounded text-xs bg-bg-3 border border-green outline-none w-20"
        onClick={(e) => e.stopPropagation()}
      />
    )
  }

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onDoubleClick={(e) => { e.stopPropagation(); setEditing(true) }}
        onContextMenu={(e) => { e.preventDefault(); setShowContext(true) }}
        className={`px-2 py-1 rounded text-xs transition-all ${
          isActive ? 'bg-bg-3 text-text-0' : 'text-text-3 hover:text-text-1 hover:bg-bg-2'
        }`}
        title={`${page.name} (${page.path})`}
      >
        {page.name}
      </button>
      {showContext && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowContext(false)} />
          <div className="absolute top-full left-0 mt-1 bg-bg-2 border border-border-default rounded-lg p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-20 min-w-[100px]">
            <button
              onClick={() => { setShowContext(false); setEditing(true) }}
              className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-text-1 hover:bg-bg-3 hover:text-text-0 transition-colors"
            >
              Rename
            </button>
            {canDelete && (
              <button
                onClick={() => { setShowContext(false); onDelete() }}
                className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-text-1 hover:bg-status-red/10 hover:text-status-red transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export function CanvasToolbar() {
  const navigate = useNavigate()
  const { viewport, setViewport, toggleJsonDrawer, jsonDrawerOpen, toggleHistory, togglePreview, previewMode, activeProjectId } = useEditorStore()
  const { undo, redo, canUndo, canRedo } = useConfigStore()
  const pages = useConfigStore((s) => s.config.pages) ?? []
  const activePageId = useConfigStore((s) => s.activePageId)
  const setActivePage = useConfigStore((s) => s.setActivePage)
  const addPage = useConfigStore((s) => s.addPage)
  const removePage = useConfigStore((s) => s.removePage)
  const renamePage = useConfigStore((s) => s.renamePage)
  const projects = useProjectsStore((s) => s.projects)
  const configName = useConfigStore((s) => s.config.name)
  const [showAddPage, setShowAddPage] = useState(false)

  const activeProject = activeProjectId ? projects.find((p) => p.id === activeProjectId) : null
  const projectName = activeProject?.name || configName

  return (
    <div className="h-10 bg-bg-1 border-b border-border-default flex items-center px-3 gap-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-text-3 shrink-0">
        <span
          className="cursor-pointer hover:text-text-1 transition-colors"
          onClick={() => navigate('/')}
        >
          Projects
        </span>
        <span>/</span>
        <span className="text-text-0 font-medium max-w-[120px] truncate">{projectName}</span>
      </div>

      <div className="w-px h-5 bg-border-default mx-1.5 shrink-0" />

      {/* Page tabs */}
      <div className="flex items-center gap-0.5 relative overflow-x-auto">
        {pages.map((page) => (
          <PageTab
            key={page.id}
            page={page}
            isActive={activePageId === page.id}
            onClick={() => setActivePage(page.id)}
            onRename={(name) => renamePage(page.id, name)}
            onDelete={() => removePage(page.id)}
            canDelete={pages.length > 1}
          />
        ))}
        <div className="relative">
          <button
            onClick={() => setShowAddPage(!showAddPage)}
            className="w-6 h-6 rounded flex items-center justify-center text-text-3 hover:text-green hover:bg-bg-2 transition-all"
            title="Add page"
            aria-label="Add page"
          >
            <Plus size={12} />
          </button>
          {showAddPage && (
            <AddPagePopover
              onAdd={(name, path) => addPage(name, path)}
              onClose={() => setShowAddPage(false)}
            />
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1 shrink-0">
        {/* Viewport toggle */}
        {viewports.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            title={label}
            aria-label={label}
            aria-pressed={viewport === value}
            onClick={() => setViewport(value)}
            className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-all ${
              viewport === value
                ? 'bg-bg-3 text-text-0'
                : 'text-text-3 hover:text-text-1 hover:bg-bg-3'
            }`}
          >
            <Icon size={14} />
          </button>
        ))}

        <div className="w-px h-5 bg-border-default mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="w-7 h-7 rounded flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
          aria-label="Undo"
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="w-7 h-7 rounded flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
          aria-label="Redo"
        >
          <Redo2 size={14} />
        </button>

        <div className="w-px h-5 bg-border-default mx-1" />

        {/* Preview toggle */}
        <button
          onClick={togglePreview}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            previewMode ? 'bg-green-glow text-green' : 'text-text-3 hover:text-text-1 hover:bg-bg-3'
          }`}
          title="Preview (P)"
          aria-label="Toggle preview mode"
          aria-pressed={previewMode}
        >
          <Eye size={14} />
        </button>

        {/* JSON drawer toggle */}
        <button
          onClick={toggleJsonDrawer}
          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
            jsonDrawerOpen ? 'bg-green-glow text-green' : 'text-text-3 hover:text-text-1 hover:bg-bg-3'
          }`}
          title="JSON Drawer (J)"
          aria-label="Toggle JSON drawer"
          aria-pressed={jsonDrawerOpen}
        >
          <Code size={14} />
        </button>

        {/* History */}
        <button
          onClick={toggleHistory}
          className="w-7 h-7 rounded flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"
          title="History (H)"
          aria-label="Toggle version history"
        >
          <Clock size={14} />
        </button>
      </div>
    </div>
  )
}

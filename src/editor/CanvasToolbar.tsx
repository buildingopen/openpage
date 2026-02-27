import { useNavigate } from 'react-router-dom'
import { Monitor, Tablet, Smartphone, Undo2, Redo2, Code, Clock, Eye } from 'lucide-react'
import { useEditorStore, type Viewport } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'
import { useProjectsStore } from '@/store/projectsStore'

const viewports: { value: Viewport; icon: typeof Monitor; label: string }[] = [
  { value: 'desktop', icon: Monitor, label: 'Desktop' },
  { value: 'tablet', icon: Tablet, label: 'Tablet' },
  { value: 'mobile', icon: Smartphone, label: 'Mobile' },
]

export function CanvasToolbar() {
  const navigate = useNavigate()
  const { viewport, setViewport, toggleJsonDrawer, jsonDrawerOpen, toggleHistory, togglePreview, previewMode, activeProjectId } = useEditorStore()
  const { undo, redo, canUndo, canRedo } = useConfigStore()
  const projects = useProjectsStore((s) => s.projects)
  const configName = useConfigStore((s) => s.config.name)

  const activeProject = activeProjectId ? projects.find((p) => p.id === activeProjectId) : null
  const projectName = activeProject?.name || configName

  return (
    <div className="h-10 bg-bg-1 border-b border-border-default flex items-center px-3 gap-1">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-text-3">
        <span
          className="cursor-pointer hover:text-text-1 transition-colors"
          onClick={() => navigate('/')}
        >
          Projects
        </span>
        <span>/</span>
        <span className="text-text-0 font-medium">{projectName}</span>
      </div>

      <div className="w-px h-5 bg-border-default mx-1.5" />

      {/* Page tabs placeholder */}
      <div className="flex gap-0.5">
        <span className="px-2 py-1 rounded text-xs text-text-0 bg-bg-3">Home</span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-1">
        {/* Viewport toggle */}
        {viewports.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            title={label}
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
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="w-7 h-7 rounded flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
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
        >
          <Code size={14} />
        </button>

        {/* History */}
        <button
          onClick={toggleHistory}
          className="w-7 h-7 rounded flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-bg-3 transition-all"
          title="History (H)"
        >
          <Clock size={14} />
        </button>
      </div>
    </div>
  )
}

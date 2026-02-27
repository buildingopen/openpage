import { Layers, Bot } from 'lucide-react'
import { useEditorStore, type LeftPanel } from '@/store/editorStore'
import { LayersPanel } from './LayersPanel'
import { AgentPanel } from './AgentPanel'

const modes: { value: LeftPanel; label: string; icon: typeof Layers }[] = [
  { value: 'layers', label: 'Layers', icon: Layers },
  { value: 'agent', label: 'Agent', icon: Bot },
]

export function LeftSidebar() {
  const { leftPanel, setLeftPanel } = useEditorStore()

  return (
    <div className="hidden md:flex w-[280px] bg-bg-1 border-r border-border-default flex-col shrink-0">
      {/* Mode toggle */}
      <div className="flex m-2.5 mb-0 bg-bg-2 rounded-lg p-0.5 gap-0.5">
        {modes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setLeftPanel(value)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              leftPanel === value
                ? value === 'agent'
                  ? 'bg-green-glow text-green shadow-sm'
                  : 'bg-bg-4 text-text-0 shadow-sm'
                : 'text-text-2 hover:text-text-1'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      {leftPanel === 'layers' ? <LayersPanel /> : <AgentPanel />}
    </div>
  )
}

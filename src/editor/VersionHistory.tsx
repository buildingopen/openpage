import { X, Clock } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

interface HistoryEntry {
  id: string
  time: string
  description: string
  source: 'agent' | 'manual'
  diff?: { added?: string[]; removed?: string[] }
}

const mockHistory: HistoryEntry[] = [
  { id: '1', time: 'Just now', description: 'Updated hero headline', source: 'manual' },
  { id: '2', time: '5 min ago', description: 'Added pricing section', source: 'agent', diff: { added: ['blocks[3]: pricing (simple)'] } },
  { id: '3', time: '12 min ago', description: 'Changed feature descriptions', source: 'manual' },
  { id: '4', time: '1 hour ago', description: 'Generated initial layout', source: 'agent', diff: { added: ['navbar', 'hero', 'features', 'cta', 'footer'] } },
  { id: '5', time: '1 hour ago', description: 'Project created', source: 'manual' },
]

export function VersionHistory() {
  const { historyOpen, toggleHistory } = useEditorStore()

  return (
    <div
      className={`absolute top-0 right-0 bottom-0 w-80 bg-bg-1 border-l border-border-default z-50 flex flex-col transition-transform duration-250 ease-in-out ${
        historyOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-text-2" />
          <h3 className="text-sm font-semibold">Version History</h3>
        </div>
        <button
          onClick={toggleHistory}
          className="w-7 h-7 rounded flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto p-2">
        {mockHistory.map((entry, i) => (
          <div
            key={entry.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors mb-0.5 ${
              i === 0 ? 'bg-green-glow' : 'hover:bg-bg-3'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-text-2 mb-1">
              <span>{entry.time}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                entry.source === 'agent'
                  ? 'bg-green-glow text-green'
                  : 'bg-status-blue/10 text-status-blue'
              }`}>
                {entry.source}
              </span>
            </div>
            <div className="text-[12.5px] text-text-1">{entry.description}</div>

            {entry.diff && i === 0 && (
              <div className="mt-2 p-2 bg-bg-2 border border-border-default rounded font-mono text-[10px] leading-relaxed">
                {entry.diff.added?.map((line, j) => (
                  <div key={j} className="text-green">+ {line}</div>
                ))}
                {entry.diff.removed?.map((line, j) => (
                  <div key={j} className="text-status-red">- {line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

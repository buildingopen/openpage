import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-status-yellow' // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-300' // key
          match = match.replace(/:$/, '')
          return `<span class="${cls}">${match}</span>:`
        } else {
          cls = 'text-emerald-300' // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-status-blue'
      } else if (/null/.test(match)) {
        cls = 'text-text-3'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

export function JsonDrawer() {
  const config = useConfigStore((s) => s.config)
  const { jsonDrawerOpen, toggleJsonDrawer } = useEditorStore()

  const jsonStr = JSON.stringify(config, null, 2)
  const highlighted = syntaxHighlight(jsonStr)

  return (
    <div
      className="bg-bg-0 border-t border-border-default flex flex-col overflow-hidden transition-all duration-250 ease-in-out"
      style={{ height: jsonDrawerOpen ? '220px' : '0px' }}
    >
      {/* Header */}
      <div
        className="h-8 min-h-8 bg-bg-1 border-b border-border-default flex items-center px-3 text-[11px] text-text-2 gap-2 cursor-pointer select-none hover:bg-bg-2 transition-colors"
        onClick={toggleJsonDrawer}
      >
        <span className="font-mono">{'{ }'}</span>
        <span>Site Config</span>

        <div className="ml-auto flex items-center gap-1 text-[10px] text-green">
          <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          Synced
        </div>
      </div>

      {/* JSON body */}
      <div className="flex-1 overflow-auto px-3.5 py-2.5 font-mono text-[11.5px] leading-relaxed text-text-1">
        <pre dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  )
}

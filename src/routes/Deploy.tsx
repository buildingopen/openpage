import { Globe, FileJson, ExternalLink, Download, Code } from 'lucide-react'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'

const readyOptions = [
  { icon: Globe, label: 'Deploy to Vercel', description: 'One-click deploy to Vercel with automatic SSL', action: 'vercel' },
  { icon: FileJson, label: 'JSON Config', description: 'Download the raw JSON config file', action: 'json' },
]

const plannedOptions = [
  { icon: Globe, label: 'Netlify', description: 'Continuous deployment' },
  { icon: Download, label: 'Static HTML', description: 'HTML/CSS/JS bundle' },
  { icon: Code, label: 'Next.js', description: 'Exportable project' },
]

export function Deploy() {
  const config = useConfigStore((s) => s.config)

  function handleExport(action: string) {
    if (action === 'json') {
      const jsonStr = JSON.stringify(config, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'site-config.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast('JSON config downloaded')
    } else {
      toast(`${action.charAt(0).toUpperCase() + action.slice(1)} export coming soon`)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 md:px-12 pt-8">
        <h1 className="text-[22px] font-display font-semibold tracking-tight animate-fade-in-up stagger-1">Deploy</h1>
        <p className="text-text-2 text-[13px] mt-1 animate-fade-in-up stagger-2">Export and publish your site</p>
      </div>

      {/* Ready export options */}
      <div className="px-4 md:px-12 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {readyOptions.map((opt, i) => (
            <div
              key={opt.label}
              onClick={() => handleExport(opt.action)}
              style={{ animationDelay: `${i * 60}ms` }}
              className="flex items-start gap-3 p-4 rounded-xl border bg-bg-1 border-border-default card-lift hover:border-border-hover cursor-pointer hover:card-lift-hover animate-fade-in-up"
            >
              <div className="w-9 h-9 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
                <opt.icon size={16} />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold">{opt.label}</span>
                <p className="text-[11.5px] text-text-2 mt-0.5">{opt.description}</p>
              </div>
              <ExternalLink size={14} className="text-text-3 mt-1 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Planned exports */}
      <div className="px-4 md:px-12 pt-8 pb-12 animate-fade-in-up stagger-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-3 mb-3">More export options planned</h2>
        <div className="flex flex-col gap-2">
          {plannedOptions.map((opt) => (
            <div key={opt.label} className="flex items-center gap-3 text-text-3">
              <opt.icon size={14} />
              <span className="text-[12.5px] text-text-2">{opt.label}</span>
              <span className="text-[11px]">{opt.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

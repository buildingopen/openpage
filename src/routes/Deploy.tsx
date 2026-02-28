import { useState } from 'react'
import { Globe, FileJson, ExternalLink, Download, Code, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'
import { exportToHTML, downloadHTML, previewHTML } from '@/lib/export-html'

const readyOptions = [
  { icon: Download, label: 'Static HTML', description: 'Download a standalone HTML file', action: 'html' },
  { icon: FileJson, label: 'JSON Config', description: 'Download the raw JSON config file', action: 'json' },
]

const plannedOptions = [
  { icon: Globe, label: 'Deploy to Vercel', description: 'One-click deploy with automatic SSL' },
  { icon: Globe, label: 'Netlify', description: 'Continuous deployment' },
  { icon: Code, label: 'Next.js', description: 'Exportable project' },
]

export function Deploy() {
  const config = useConfigStore((s) => s.config)
  const [exporting, setExporting] = useState(false)

  async function handleExport(action: string) {
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
    } else if (action === 'html') {
      setExporting(true)
      try {
        const html = await exportToHTML(config)
        const filename = `${config.name.toLowerCase().replace(/\s+/g, '-')}.html`
        downloadHTML(html, filename)
        toast('HTML exported')
      } catch (err) {
        toast.error('Export failed')
      } finally {
        setExporting(false)
      }
    } else {
      toast(`${action.charAt(0).toUpperCase() + action.slice(1)} export coming soon`)
    }
  }

  async function handlePreview() {
    setExporting(true)
    try {
      const html = await exportToHTML(config)
      previewHTML(html)
    } catch {
      toast.error('Preview failed')
    } finally {
      setExporting(false)
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
              onClick={() => !exporting && handleExport(opt.action)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`flex items-start gap-3 p-4 rounded-xl border bg-bg-1 border-border-default card-lift hover:border-border-hover cursor-pointer hover:card-lift-hover animate-fade-in-up ${exporting ? 'opacity-60 pointer-events-none' : ''}`}
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

          {/* Preview button */}
          <div
            onClick={() => !exporting && handlePreview()}
            className={`flex items-start gap-3 p-4 rounded-xl border bg-bg-1 border-border-default card-lift hover:border-border-hover cursor-pointer hover:card-lift-hover animate-fade-in-up ${exporting ? 'opacity-60 pointer-events-none' : ''}`}
            style={{ animationDelay: `${readyOptions.length * 60}ms` }}
          >
            <div className="w-9 h-9 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
              <Eye size={16} />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold">Preview in Browser</span>
              <p className="text-[11.5px] text-text-2 mt-0.5">Open a standalone preview in a new tab</p>
            </div>
            <ExternalLink size={14} className="text-text-3 mt-1 shrink-0" />
          </div>
        </div>
      </div>

      {/* Planned exports */}
      <div className="px-4 md:px-12 pt-8 pb-12 animate-fade-in-up stagger-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-3 mb-3">Coming soon</h2>
        <div className="flex flex-col gap-2">
          {plannedOptions.map((opt) => (
            <div key={opt.label} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border-subtle bg-bg-1/50 opacity-50">
              <div className="w-8 h-8 rounded-lg bg-bg-3 flex items-center justify-center text-text-3 shrink-0">
                <opt.icon size={14} />
              </div>
              <div className="flex-1">
                <span className="text-[13px] text-text-2">{opt.label}</span>
                <p className="text-[11px] text-text-3">{opt.description}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-3 text-text-3 border border-border-subtle shrink-0">Soon</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

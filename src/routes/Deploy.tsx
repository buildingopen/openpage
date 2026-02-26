import { Globe, Download, Code, FileJson, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'

const exportOptions = [
  { icon: Globe, label: 'Deploy to Vercel', description: 'One-click deploy to Vercel with automatic SSL', status: 'ready' as const, action: 'vercel' },
  { icon: Globe, label: 'Deploy to Netlify', description: 'Deploy to Netlify with continuous deployment', status: 'coming' as const, action: 'netlify' },
  { icon: Download, label: 'Static HTML Export', description: 'Download as HTML/CSS/JS bundle', status: 'coming' as const, action: 'html' },
  { icon: Code, label: 'Next.js Export', description: 'Export as a Next.js project with components', status: 'coming' as const, action: 'nextjs' },
  { icon: FileJson, label: 'JSON Config', description: 'Download the raw JSON config file', status: 'ready' as const, action: 'json' },
]

const deployHistory = [
  { id: '1', url: 'acme-landing.vercel.app', status: 'live' as const, time: '2 hours ago', commit: 'Update hero headline' },
  { id: '2', url: 'acme-landing-abc123.vercel.app', status: 'superseded' as const, time: '1 day ago', commit: 'Add pricing section' },
  { id: '3', url: 'acme-landing-def456.vercel.app', status: 'failed' as const, time: '2 days ago', commit: 'Initial deploy' },
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
      <div className="px-12 pt-8">
        <h1 className="text-[22px] font-semibold tracking-tight">Deploy</h1>
        <p className="text-text-2 text-[13px] mt-1">Export and publish your site</p>
      </div>

      {/* Export options */}
      <div className="px-12 pt-6">
        <h2 className="text-sm font-semibold mb-3">Export Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exportOptions.map((opt) => (
            <div
              key={opt.label}
              onClick={() => opt.status === 'ready' && handleExport(opt.action)}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                opt.status === 'ready'
                  ? 'bg-bg-1 border-border-default hover:border-border-hover cursor-pointer hover:-translate-y-0.5'
                  : 'bg-bg-1 border-border-subtle opacity-60'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
                <opt.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{opt.label}</span>
                  {opt.status === 'coming' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-bg-3 text-text-3 font-medium uppercase tracking-wider">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-[11.5px] text-text-2 mt-0.5">{opt.description}</p>
              </div>
              {opt.status === 'ready' && (
                <ExternalLink size={14} className="text-text-3 mt-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deploy history */}
      <div className="px-12 pt-8 pb-12">
        <h2 className="text-sm font-semibold mb-3">Deployment History</h2>
        <div className="border border-border-default rounded-xl overflow-hidden">
          {deployHistory.map((deploy, i) => (
            <div
              key={deploy.id}
              className={`flex items-center gap-3 px-4 py-3 ${
                i < deployHistory.length - 1 ? 'border-b border-border-subtle' : ''
              }`}
            >
              {deploy.status === 'live' && <CheckCircle size={14} className="text-green shrink-0" />}
              {deploy.status === 'superseded' && <Clock size={14} className="text-text-3 shrink-0" />}
              {deploy.status === 'failed' && <AlertCircle size={14} className="text-status-red shrink-0" />}

              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium truncate">{deploy.url}</div>
                <div className="text-[11px] text-text-3">{deploy.commit}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  deploy.status === 'live' ? 'bg-green/10 text-green' :
                  deploy.status === 'failed' ? 'bg-status-red/10 text-status-red' :
                  'bg-bg-3 text-text-3'
                }`}>
                  {deploy.status}
                </span>
                <span className="text-[11px] text-text-3">{deploy.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import {
  Globe,
  FileJson,
  ExternalLink,
  Download,
  Code,
  Eye,
  Copy,
  Check,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { useProjectsStore } from '@/store/projectsStore'
import { exportToHTML, downloadHTML, previewHTML } from '@/lib/export-html'
import { publishSite } from '@/lib/publish-site'

const readyOptions = [
  { icon: Download, label: 'Static HTML', description: 'Download a standalone HTML file', action: 'html' },
  { icon: FileJson, label: 'JSON Config', description: 'Download the raw JSON config file', action: 'json' },
  { icon: Eye, label: 'Preview in Browser', description: 'Open a standalone preview in a new tab', action: 'preview' },
] as const

const plannedOptions = [
  { icon: Globe, label: 'Netlify', description: 'Continuous deployment' },
  { icon: Code, label: 'Next.js', description: 'Exportable project' },
]

export function Deploy() {
  const config = useConfigStore((s) => s.config)
  const activeProjectId = useEditorStore((s) => s.activeProjectId)
  const projects = useProjectsStore((s) => s.projects)
  const setDeployInfo = useProjectsStore((s) => s.setDeployInfo)

  const project = activeProjectId ? projects.find((p) => p.id === activeProjectId) : null
  const deployUrl = project?.deployUrl
  const lastDeployedAt = project?.lastDeployedAt
  const hasDeployKey = !!project?.settings?.deployAccessKey?.trim()

  const [exporting, setExporting] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleExport(action: (typeof readyOptions)[number]['action']) {
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
      return
    }

    setExporting(true)
    try {
      const html = await exportToHTML(config, { settings: project?.settings })

      if (action === 'html') {
        const filename = `${(project?.name || config.name || 'site').toLowerCase().replace(/\s+/g, '-')}.html`
        downloadHTML(html, filename)
        toast('HTML exported')
      } else {
        previewHTML(html)
      }
    } catch {
      toast.error(action === 'preview' ? 'Preview failed' : 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  async function handlePublish() {
    if (!activeProjectId) {
      toast.error('Save your project first')
      return
    }

    setPublishing(true)
    try {
      const { liveUrl, deploymentId } = await publishSite({
        config,
        projectName: project?.name || config.name,
        settings: project?.settings,
      })
      setDeployInfo(activeProjectId, liveUrl, deploymentId)
      toast.success('Published')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deploy failed')
    } finally {
      setPublishing(false)
    }
  }

  function handleCopy() {
    if (!deployUrl) return
    navigator.clipboard
      .writeText(deployUrl)
      .then(() => {
        setCopied(true)
        toast('URL copied')
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => toast.error('Could not copy URL'))
  }

  const timeAgo = lastDeployedAt ? formatTimeAgo(lastDeployedAt) : null

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 md:px-12 pt-8">
        <h1 className="text-[22px] font-display font-semibold tracking-tight animate-fade-in-up stagger-1">Deploy</h1>
        <p className="text-text-2 text-[13px] mt-1 animate-fade-in-up stagger-2">Export and publish your site</p>
      </div>

      <div className="px-4 md:px-12 pt-6 animate-fade-in-up stagger-2">
        <div className="p-5 rounded-xl border bg-bg-1 border-border-default">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
              <Globe size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold">Publish to Web</h3>
              <p className="text-[11.5px] text-text-2 mt-0.5">
                Deploy your site to a live URL in seconds
              </p>

              {deployUrl && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-3 border border-border-subtle">
                    <div className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
                    <a
                      href={deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-green hover:underline truncate"
                    >
                      {deployUrl.replace('https://', '')}
                    </a>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-8 h-8 rounded-lg border border-border-default hover:border-border-hover flex items-center justify-center text-text-3 hover:text-text-1 transition-all shrink-0"
                    title="Copy URL"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <a
                    href={deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg border border-border-default hover:border-border-hover flex items-center justify-center text-text-3 hover:text-text-1 transition-all shrink-0"
                    title="Visit site"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handlePublish}
                  disabled={publishing || !hasDeployKey}
                  className="px-4 py-1.5 rounded-lg bg-green text-bg-0 text-[12.5px] font-semibold hover:bg-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {publishing ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Publishing...
                    </>
                  ) : deployUrl ? (
                    <>
                      <RefreshCw size={13} />
                      Update
                    </>
                  ) : (
                    'Publish'
                  )}
                </button>
                {timeAgo && (
                  <span className="text-[11px] text-text-3">Last published {timeAgo}</span>
                )}
                {!hasDeployKey && (
                  <span className="text-[11px] text-status-yellow">Set Deploy Access Key in Settings - API Keys</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 pt-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-3 mb-3">Export</h2>
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
        </div>
      </div>

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

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

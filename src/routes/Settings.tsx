import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Settings2, Search as SearchIcon, Globe, BarChart3, Puzzle, Key, AlertTriangle, Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { useProjectsStore, type ProjectSettings } from '@/store/projectsStore'
import { useEditorStore } from '@/store/editorStore'

type SettingsTab = 'general' | 'seo' | 'domain' | 'analytics' | 'integrations' | 'api' | 'danger'

const tabDefs: { value: SettingsTab; label: string; icon: typeof Settings2 }[] = [
  { value: 'general', label: 'General', icon: Settings2 },
  { value: 'seo', label: 'SEO', icon: SearchIcon },
  { value: 'domain', label: 'Domain', icon: Globe },
  { value: 'analytics', label: 'Analytics', icon: BarChart3 },
  { value: 'integrations', label: 'Integrations', icon: Puzzle },
  { value: 'api', label: 'API Keys', icon: Key },
  { value: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

function useSettingsState() {
  const activeProjectId = useEditorStore((s) => s.activeProjectId)
  const projects = useProjectsStore((s) => s.projects)
  const updateProjectSettings = useProjectsStore((s) => s.updateProjectSettings)

  const activeProject = activeProjectId ? projects.find((p) => p.id === activeProjectId) : null
  const projectSettings = activeProject?.settings || {}

  const [localOverrides, setLocalOverrides] = useState<Record<string, string>>({})
  const [showSaved, setShowSaved] = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const data: Record<string, string> = { ...Object.fromEntries(Object.entries(projectSettings).map(([k, v]) => [k, v || ''])), ...localOverrides }

  const update = useCallback((key: string, value: string) => {
    setLocalOverrides((prev) => ({ ...prev, [key]: value }))
    if (activeProjectId) {
      updateProjectSettings(activeProjectId, { [key]: value } as Partial<ProjectSettings>)
    }
    setShowSaved(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setShowSaved(false), 2000)
  }, [activeProjectId, updateProjectSettings])

  useEffect(() => {
    return () => { if (savedTimer.current) clearTimeout(savedTimer.current) }
  }, [])

  return { data, update, showSaved }
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[11.5px] text-text-2 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  )
}

function ControlledInput({ settingsKey, placeholder, settings }: { settingsKey: string; placeholder?: string; settings: ReturnType<typeof useSettingsState> }) {
  return (
    <input
      type="text"
      value={settings.data[settingsKey] || ''}
      placeholder={placeholder}
      onChange={(e) => settings.update(settingsKey, e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3 transition-colors"
    />
  )
}

function ControlledTextarea({ settingsKey, rows = 3, settings }: { settingsKey: string; rows?: number; settings: ReturnType<typeof useSettingsState> }) {
  return (
    <textarea
      value={settings.data[settingsKey] || ''}
      rows={rows}
      onChange={(e) => settings.update(settingsKey, e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green resize-y transition-colors"
    />
  )
}

function GeneralPanel({ settings }: { settings: ReturnType<typeof useSettingsState> }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">General</h2>
      <FieldGroup label="Site Name"><ControlledInput settingsKey="siteName" settings={settings} /></FieldGroup>
      <FieldGroup label="Site Description"><ControlledTextarea settingsKey="siteDescription" settings={settings} /></FieldGroup>
      <FieldGroup label="Favicon URL"><ControlledInput settingsKey="faviconUrl" placeholder="https://example.com/favicon.ico" settings={settings} /></FieldGroup>
    </div>
  )
}

function SeoPanel({ settings }: { settings: ReturnType<typeof useSettingsState> }) {
  const title = settings.data.seoTitle || 'My Website - Build with OpenPage'
  const description = settings.data.seoDescription || 'A beautiful website built with structured JSON config.'
  const domain = settings.data.customDomain || 'mywebsite.com'

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">SEO</h2>
      <FieldGroup label="Page Title"><ControlledInput settingsKey="seoTitle" settings={settings} /></FieldGroup>
      <FieldGroup label="Meta Description"><ControlledTextarea settingsKey="seoDescription" settings={settings} /></FieldGroup>
      <FieldGroup label="OG Image URL"><ControlledInput settingsKey="ogImageUrl" placeholder="https://example.com/og.png" settings={settings} /></FieldGroup>

      {/* Live Google preview */}
      <div className="mt-6 p-4 rounded-xl bg-bg-2 border border-border-default">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-3">Google Preview</div>
        <div className="text-[#8ab4f8] text-sm hover:underline cursor-pointer">{title}</div>
        <div className="text-[#bdc1c6] text-[11px] mt-0.5">https://{domain}</div>
        <div className="text-[#9aa0a6] text-[11.5px] mt-1 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  )
}

function DomainPanel({ settings }: { settings: ReturnType<typeof useSettingsState> }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Domain</h2>
      <FieldGroup label="Custom Domain"><ControlledInput settingsKey="customDomain" placeholder="www.example.com" settings={settings} /></FieldGroup>

      <div className="mt-4 p-4 rounded-xl bg-bg-2 border border-border-default">
        <p className="text-[12px] text-text-2">DNS configuration will appear here once deploy integrations are available.</p>
      </div>
    </div>
  )
}

function AnalyticsPanel({ settings }: { settings: ReturnType<typeof useSettingsState> }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>
      <FieldGroup label="Google Analytics ID"><ControlledInput settingsKey="gaId" placeholder="G-XXXXXXXXXX" settings={settings} /></FieldGroup>
      <FieldGroup label="PostHog Project Key"><ControlledInput settingsKey="posthogKey" placeholder="phc_..." settings={settings} /></FieldGroup>
      <p className="text-[11px] text-text-3 mt-2">Analytics scripts will be included in future deploy integrations.</p>
    </div>
  )
}

function IntegrationsPanel() {
  const integrations = [
    { name: 'Stripe', description: 'Accept payments' },
    { name: 'Mailchimp', description: 'Email marketing' },
    { name: 'Slack', description: 'Form notifications' },
    { name: 'Zapier', description: 'Workflow automation' },
  ]
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Integrations</h2>
      <div className="space-y-3">
        {integrations.map((int) => (
          <div key={int.name} className="flex items-center justify-between p-3 rounded-xl bg-bg-2 border border-border-default">
            <div>
              <div className="text-sm font-semibold">{int.name}</div>
              <div className="text-[11px] text-text-3">{int.description}</div>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-bg-3 text-text-3 font-medium uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-text-3 mt-4">Integrations are on the roadmap. Stay tuned for updates.</p>
    </div>
  )
}

function ApiPanel() {
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('openpage-gemini-key') || '')
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)

  function handleKeyChange(value: string) {
    setGeminiKey(value)
    if (value) {
      localStorage.setItem('openpage-gemini-key', value)
    } else {
      localStorage.removeItem('openpage-gemini-key')
    }
  }

  async function handleTest() {
    if (!geminiKey) return
    setTesting(true)
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
      )
      if (res.ok) {
        toast.success('API key is valid')
      } else {
        toast.error(`Invalid key: ${res.status}`)
      }
    } catch {
      toast.error('Connection failed')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">API Keys</h2>

      <FieldGroup label="Gemini API Key">
        <div className="flex gap-2">
          <input
            type={showKey ? 'text' : 'password'}
            value={geminiKey}
            placeholder="AIza..."
            onChange={(e) => handleKeyChange(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3 transition-colors font-mono"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-2 text-[12px] hover:text-text-0 hover:bg-bg-3 transition-colors shrink-0"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
          <button
            onClick={handleTest}
            disabled={!geminiKey || testing}
            className="px-3 py-2 rounded-lg bg-green/10 text-green text-[12px] font-medium hover:bg-green/20 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {testing ? 'Testing...' : 'Test'}
          </button>
        </div>
        <p className="text-[11px] text-text-3 mt-1.5">
          Used for client-side AI generation. Get one at{' '}
          <span className="text-text-2">aistudio.google.com</span>
        </p>
      </FieldGroup>

      <div className="p-4 rounded-xl bg-bg-2 border border-border-default mt-4">
        <p className="text-[13px] text-text-1 mb-2">Programmatic API access coming soon.</p>
        <p className="text-[11px] text-text-3">Read and update your site config via REST API for CI/CD workflows.</p>
      </div>
    </div>
  )
}

function DangerPanel() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-status-red">Danger Zone</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border-subtle opacity-50">
          <div>
            <div className="text-sm font-semibold text-text-2">Transfer Project</div>
            <div className="text-[11px] text-text-3">Contact support to transfer this project</div>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-3 border border-border-subtle cursor-not-allowed">
            Transfer
          </span>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl border border-border-subtle opacity-50">
          <div>
            <div className="text-sm font-semibold text-text-2">Delete Project</div>
            <div className="text-[11px] text-text-3">Contact support to delete this project</div>
          </div>
          <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-3 border border-border-subtle cursor-not-allowed">
            Delete
          </span>
        </div>
      </div>
    </div>
  )
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const settings = useSettingsState()

  const panels: Record<SettingsTab, React.ReactNode> = {
    general: <GeneralPanel settings={settings} />,
    seo: <SeoPanel settings={settings} />,
    domain: <DomainPanel settings={settings} />,
    analytics: <AnalyticsPanel settings={settings} />,
    integrations: <IntegrationsPanel />,
    api: <ApiPanel />,
    danger: <DangerPanel />,
  }

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="md:w-52 bg-bg-1 border-b md:border-b-0 md:border-r border-border-default p-2 shrink-0 flex md:flex-col gap-1 overflow-x-auto">
        {tabDefs.map(({ value, label, icon: Icon }, i) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            style={{ animationDelay: `${i * 40}ms` }}
            className={`shrink-0 md:w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] transition-all text-left animate-fade-in-up ${
              activeTab === value
                ? value === 'danger'
                  ? 'bg-status-red/10 text-status-red'
                  : 'bg-bg-3 text-text-0'
                : value === 'danger'
                  ? 'text-text-3 hover:text-status-red hover:bg-status-red/5'
                  : 'text-text-2 hover:text-text-0 hover:bg-bg-2'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-2xl relative">
        {settings.showSaved && (
          <div className="absolute top-3 right-6 flex items-center gap-1.5 text-green text-[11px] animate-fade-in">
            <Check size={12} />
            Saved
          </div>
        )}
        <div key={activeTab} className="animate-fade-in-up">
          {panels[activeTab]}
        </div>
      </div>
    </div>
  )
}

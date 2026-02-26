import { useState, useCallback } from 'react'
import {
  Settings2, Search as SearchIcon, Globe, BarChart3, Puzzle, Key, AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'

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

// Simple local settings state (persisted in localStorage)
function useSettingsState() {
  const [data, setData] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('openpage-settings') || '{}')
    } catch { return {} }
  })

  const update = useCallback((key: string, value: string) => {
    setData((prev) => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('openpage-settings', JSON.stringify(next))
      return next
    })
  }, [])

  return { data, update }
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
      <FieldGroup label="Language">
        <select
          value={settings.data.language || 'English'}
          onChange={(e) => settings.update('language', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green cursor-pointer"
        >
          <option>English</option><option>German</option><option>Spanish</option><option>French</option>
        </select>
      </FieldGroup>
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

      <div className="mt-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-2">DNS Configuration</div>
        <div className="border border-border-default rounded-lg overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-bg-2 border-b border-border-default">
                <th className="text-left px-3 py-2 text-text-3 font-medium">Type</th>
                <th className="text-left px-3 py-2 text-text-3 font-medium">Name</th>
                <th className="text-left px-3 py-2 text-text-3 font-medium">Value</th>
                <th className="text-left px-3 py-2 text-text-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-subtle">
                <td className="px-3 py-2 font-mono text-text-2">A</td>
                <td className="px-3 py-2 font-mono text-text-2">@</td>
                <td className="px-3 py-2 font-mono text-text-2">76.76.21.21</td>
                <td className="px-3 py-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-status-yellow/10 text-status-yellow font-medium">Pending</span></td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-text-2">CNAME</td>
                <td className="px-3 py-2 font-mono text-text-2">www</td>
                <td className="px-3 py-2 font-mono text-text-2">cname.vercel-dns.com</td>
                <td className="px-3 py-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-status-yellow/10 text-status-yellow font-medium">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
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
      <p className="text-[11px] text-text-3 mt-2">Analytics scripts are injected automatically when you deploy.</p>
    </div>
  )
}

function IntegrationsPanel() {
  const integrations = [
    { name: 'Stripe', description: 'Accept payments', connected: false },
    { name: 'Mailchimp', description: 'Email marketing', connected: false },
    { name: 'Slack', description: 'Form notifications', connected: true },
    { name: 'Zapier', description: 'Workflow automation', connected: false },
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
            <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              int.connected ? 'bg-green/10 text-green' : 'bg-bg-3 text-text-2 border border-border-default hover:bg-bg-4'
            }`}>
              {int.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApiPanel() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">API Keys</h2>
      <div className="p-4 rounded-xl bg-bg-2 border border-border-default mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold">Project API Key</span>
          <button className="text-[10px] px-2 py-1 rounded bg-bg-3 text-text-2 border border-border-default hover:bg-bg-4 transition-colors">
            Regenerate
          </button>
        </div>
        <div className="font-mono text-[11px] text-text-2 bg-bg-3 rounded px-3 py-2 select-all">
          op_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </div>
      </div>
      <p className="text-[11px] text-text-3">Use this key to authenticate API requests. Keep it secret.</p>
    </div>
  )
}

function DangerPanel() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-status-red">Danger Zone</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl border border-status-red/20">
          <div>
            <div className="text-sm font-semibold">Transfer Project</div>
            <div className="text-[11px] text-text-3">Transfer this project to another account</div>
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-status-red border border-status-red/30 hover:bg-status-red/10 transition-colors">
            Transfer
          </button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl border border-status-red/20">
          <div>
            <div className="text-sm font-semibold">Delete Project</div>
            <div className="text-[11px] text-text-3">Permanently delete this project and all its data</div>
          </div>
          <button
            onClick={() => toast.error('This action cannot be undone', { description: 'Contact support to delete your project.' })}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-status-red border border-status-red/30 hover:bg-status-red/10 transition-colors"
          >
            Delete
          </button>
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
    <div className="h-full flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 bg-bg-1 border-r border-border-default p-2 shrink-0">
        {tabDefs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] transition-all text-left ${
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
      <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
        {panels[activeTab]}
      </div>
    </div>
  )
}

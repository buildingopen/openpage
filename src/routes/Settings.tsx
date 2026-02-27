import { useState, useCallback, useMemo } from 'react'
import {
  Settings2, Search as SearchIcon, Globe, BarChart3, Puzzle, Key, AlertTriangle, Palette, ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { useProjectsStore, type ProjectSettings } from '@/store/projectsStore'
import { useEditorStore } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'
import type { ThemeConfig } from '@/blocks/types'
import { themePresets, resolveTheme, googleFontOptions } from '@/lib/theme-presets'

type SettingsTab = 'general' | 'design' | 'seo' | 'domain' | 'analytics' | 'integrations' | 'api' | 'danger'

const tabDefs: { value: SettingsTab; label: string; icon: typeof Settings2 }[] = [
  { value: 'general', label: 'General', icon: Settings2 },
  { value: 'design', label: 'Design', icon: Palette },
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

  const data: Record<string, string> = { ...Object.fromEntries(Object.entries(projectSettings).map(([k, v]) => [k, v || ''])), ...localOverrides }

  const update = useCallback((key: string, value: string) => {
    setLocalOverrides((prev) => ({ ...prev, [key]: value }))
    if (activeProjectId) {
      updateProjectSettings(activeProjectId, { [key]: value } as Partial<ProjectSettings>)
    }
  }, [activeProjectId, updateProjectSettings])

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

// Color picker with hex input
function ColorInput({ value, onInput, onChange }: { value: string; onInput: (v: string) => void; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onInput={(e) => onInput((e.target as HTMLInputElement).value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border border-border-default bg-bg-2 cursor-pointer p-0.5"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value
          if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            onChange(v)
          }
        }}
        onBlur={(e) => {
          const v = e.target.value
          if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            onChange(v)
          }
        }}
        className="w-[90px] px-2 py-1.5 rounded-lg border border-border-default bg-bg-2 text-text-1 text-[11px] font-mono outline-none focus:border-green"
      />
    </div>
  )
}

function ColorSection({ title, colors, defaultOpen = false }: {
  title: string
  colors: { key: keyof ThemeConfig; label: string }[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const theme = useConfigStore((s) => s.config.theme)
  const previewTheme = useConfigStore((s) => s.previewTheme)
  const updateTheme = useConfigStore((s) => s.updateTheme)
  const resolved = useMemo(() => resolveTheme(theme), [theme])

  return (
    <div className="border border-border-default rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-2 hover:bg-bg-3 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] font-semibold">{title}</span>
          <div className="flex gap-1">
            {colors.slice(0, 4).map((c) => (
              <div
                key={c.key}
                className="w-3.5 h-3.5 rounded-sm border border-border-subtle"
                style={{ backgroundColor: resolved[c.key] as string }}
              />
            ))}
          </div>
        </div>
        <ChevronDown size={14} className={`text-text-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 py-3 space-y-3 bg-bg-1">
          {colors.map((c) => (
            <div key={c.key} className="flex items-center justify-between">
              <span className="text-[11.5px] text-text-2">{c.label}</span>
              <ColorInput
                value={resolved[c.key] as string}
                onInput={(v) => previewTheme({ [c.key]: v })}
                onChange={(v) => updateTheme({ [c.key]: v })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ThemePreview() {
  const theme = useConfigStore((s) => s.config.theme)
  const t = useMemo(() => resolveTheme(theme), [theme])

  return (
    <div className="rounded-xl border border-border-default overflow-hidden mb-6">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: t.bg1, borderBottom: `1px solid ${t.borderDefault}` }}>
        <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
        <div className="w-2 h-2 rounded-full bg-[#eab308]" />
        <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
        <div className="flex-1 h-4 rounded-sm mx-2" style={{ background: t.bg3 }} />
      </div>

      {/* Page content */}
      <div style={{ background: t.bg0, padding: '16px 20px', fontFamily: `"${t.fontSans}", sans-serif` }}>
        {/* Navbar */}
        <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `1px solid ${t.borderDefault}` }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ background: t.accent }} />
            <div className="h-2 w-14 rounded-sm" style={{ background: t.text0, opacity: 0.8 }} />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 rounded-sm" style={{ background: t.text2 }} />
            <div className="h-1.5 w-8 rounded-sm" style={{ background: t.text2 }} />
            <div className="h-5 px-2 flex items-center" style={{ background: t.accent, borderRadius: `${t.radius}px` }}>
              <div className="h-1.5 w-6 rounded-sm" style={{ background: t.bg0, opacity: 0.9 }} />
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-4">
          <div className="h-3 w-36 mx-auto mb-2 rounded-sm" style={{ background: t.text0 }} />
          <div className="h-1.5 w-48 mx-auto mb-1 rounded-sm" style={{ background: t.text1, opacity: 0.6 }} />
          <div className="h-1.5 w-40 mx-auto rounded-sm" style={{ background: t.text2, opacity: 0.4 }} />
          <div className="flex gap-2 justify-center mt-3">
            <div className="h-5 w-16" style={{ background: t.accent, borderRadius: `${t.radius}px` }} />
            <div className="h-5 w-16" style={{ background: t.bg3, borderRadius: `${t.radius}px`, border: `1px solid ${t.borderDefault}` }} />
          </div>
        </div>

        {/* Feature cards */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 p-2.5" style={{ background: t.bg1, border: `1px solid ${t.borderDefault}`, borderRadius: `${t.radius}px` }}>
              <div className="w-5 h-5 mb-2 flex items-center justify-center" style={{ background: `${t.accent}18`, borderRadius: `${Math.max(t.radius - 2, 4)}px` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.accent }} />
              </div>
              <div className="h-2 w-3/4 mb-1.5 rounded-sm" style={{ background: t.text0, opacity: 0.7 }} />
              <div className="h-1.5 w-full mb-1 rounded-sm" style={{ background: t.text2, opacity: 0.4 }} />
              <div className="h-1.5 w-2/3 rounded-sm" style={{ background: t.text2, opacity: 0.4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DesignPanel() {
  const theme = useConfigStore((s) => s.config.theme)
  const setTheme = useConfigStore((s) => s.setTheme)
  const updateTheme = useConfigStore((s) => s.updateTheme)
  const resolved = useMemo(() => resolveTheme(theme), [theme])

  // Find active preset
  const activePresetId = useMemo(() => {
    for (const preset of themePresets) {
      const match = Object.keys(preset.theme).every(
        (k) => resolved[k as keyof ThemeConfig] === preset.theme[k as keyof ThemeConfig]
      )
      if (match) return preset.id
    }
    return null
  }, [resolved])

  return (
    <div>
      <h2 className="text-lg font-display font-semibold mb-4">Design</h2>

      {/* Live theme preview */}
      <ThemePreview />

      {/* Preset grid */}
      <div className="mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-3">Presets</div>
        <div className="grid grid-cols-5 gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setTheme(preset.theme)}
              className={`p-2.5 rounded-xl border transition-all text-left ${
                activePresetId === preset.id
                  ? 'border-green bg-green/5'
                  : 'border-border-default bg-bg-2 hover:border-border-hover hover:bg-bg-3'
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: preset.theme.bg0 }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: preset.theme.bg2 }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: preset.theme.accent }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: preset.theme.text0 }} />
              </div>
              <div className="text-[10.5px] font-medium truncate">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color sections */}
      <div className="space-y-3 mb-6">
        <ColorSection
          title="Backgrounds"
          defaultOpen
          colors={[
            { key: 'bg0', label: 'Base' },
            { key: 'bg1', label: 'Surface 1' },
            { key: 'bg2', label: 'Surface 2' },
            { key: 'bg3', label: 'Surface 3' },
            { key: 'bg4', label: 'Surface 4' },
            { key: 'bg5', label: 'Surface 5' },
          ]}
        />
        <ColorSection
          title="Text"
          colors={[
            { key: 'text0', label: 'Primary' },
            { key: 'text1', label: 'Secondary' },
            { key: 'text2', label: 'Muted' },
            { key: 'text3', label: 'Dimmed' },
          ]}
        />
        <ColorSection
          title="Accent"
          defaultOpen
          colors={[
            { key: 'accent', label: 'Accent' },
            { key: 'accentDim', label: 'Accent Dim' },
          ]}
        />
        <ColorSection
          title="Borders"
          colors={[
            { key: 'borderDefault', label: 'Default' },
            { key: 'borderSubtle', label: 'Subtle' },
            { key: 'borderHover', label: 'Hover' },
          ]}
        />
      </div>

      {/* Fonts */}
      <div className="mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-3">Fonts</div>
        <div className="space-y-3">
          {([
            { key: 'fontSans' as const, label: 'Body Font' },
            { key: 'fontDisplay' as const, label: 'Display Font' },
            { key: 'fontMono' as const, label: 'Mono Font' },
          ]).map(({ key, label }) => (
            <FieldGroup key={key} label={label}>
              <select
                value={resolved[key]}
                onChange={(e) => updateTheme({ [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green cursor-pointer"
                style={{ fontFamily: `"${resolved[key]}", sans-serif` }}
              >
                {googleFontOptions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </FieldGroup>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-3">Border Radius</div>
        <div className="grid grid-cols-2 gap-3">
          <FieldGroup label="Default (px)">
            <input
              type="number"
              min={0}
              max={24}
              value={resolved.radius}
              onChange={(e) => updateTheme({ radius: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green"
            />
          </FieldGroup>
          <FieldGroup label="Large (px)">
            <input
              type="number"
              min={0}
              max={32}
              value={resolved.radiusLg}
              onChange={(e) => updateTheme({ radiusLg: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green"
            />
          </FieldGroup>
        </div>
      </div>
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
            <button
              onClick={() => toast(int.connected ? `${int.name} is connected` : `${int.name} integration coming soon`)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                int.connected ? 'bg-green/10 text-green' : 'bg-bg-3 text-text-2 border border-border-default hover:bg-bg-4'
              }`}
            >
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
          <button
            onClick={() => toast('API key regeneration coming soon')}
            className="text-[10px] px-2 py-1 rounded bg-bg-3 text-text-2 border border-border-default hover:bg-bg-4 transition-colors"
          >
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
          <button
            onClick={() => toast('Contact support to transfer your project')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-status-red border border-status-red/30 hover:bg-status-red/10 transition-colors"
          >
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
    design: <DesignPanel />,
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
        <div key={activeTab} className="animate-fade-in">
          {panels[activeTab]}
        </div>
      </div>
    </div>
  )
}

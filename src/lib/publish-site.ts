import type { SiteConfig } from '@/blocks/types'
import { exportSiteToHTML } from '@/lib/export-html'
import type { ProjectSettings } from '@/store/projectsStore'

interface DeployApiResponse {
  url?: string
  projectUrl?: string
  deploymentId?: string
  error?: string
  details?: string
}

export interface PublishSiteInput {
  config: SiteConfig
  projectName?: string
  settings?: ProjectSettings
}

export interface PublishSiteResult {
  liveUrl: string
  deploymentId: string
}

function buildSlug(projectName?: string): string {
  const base = (projectName || 'site')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return base || 'site'
}

async function readDeployError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as DeployApiResponse
    if (typeof payload.details === 'string' && payload.details.trim()) return payload.details
    if (typeof payload.error === 'string' && payload.error.trim()) return payload.error
  } catch {
    // Ignore JSON parse errors and fall back to status text.
  }
  return response.statusText || `Deploy failed (${response.status})`
}

export async function publishSite(input: PublishSiteInput): Promise<PublishSiteResult> {
  const { config, projectName, settings } = input
  const deployAccessKey = settings?.deployAccessKey?.trim()
  if (!deployAccessKey) {
    throw new Error('Deploy Access Key is required. Set it in Settings -> API Keys.')
  }

  const html = exportSiteToHTML(config, { settings })
  const slug = buildSlug(projectName || settings?.siteName || config.name)

  const response = await fetch('/api/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-openpage-deploy-key': deployAccessKey,
    },
    body: JSON.stringify({ html, slug }),
  })

  if (!response.ok) {
    throw new Error(await readDeployError(response))
  }

  const data = await response.json() as DeployApiResponse
  const liveUrl = data.projectUrl || data.url
  const deploymentId = data.deploymentId

  if (!liveUrl || !deploymentId) {
    throw new Error('Deploy response did not include a valid URL and deployment id')
  }

  return { liveUrl, deploymentId }
}

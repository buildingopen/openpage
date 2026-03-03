import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash, timingSafeEqual } from 'node:crypto'
import {
  extractUpstreamError,
  isRequestOriginAllowed,
  sanitizeSlug,
} from './lib/deploy-security'

const VERCEL_DEPLOY_TOKEN = process.env.VERCEL_DEPLOY_TOKEN
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID
const OPENPAGE_DEPLOY_KEY = process.env.OPENPAGE_DEPLOY_KEY
const OPENPAGE_ALLOWED_ORIGINS = (process.env.OPENPAGE_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

const MAX_HTML_BYTES = 900_000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 20
const DEPLOY_CACHE_TTL_MS = 30_000

const rateLimitByIp = new Map<string, { count: number; resetAt: number }>()
const recentDeploysByFingerprint = new Map<
  string,
  { url: string; projectUrl: string; deploymentId: string; readyState: string; expiresAt: number }
>()

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const existing = rateLimitByIp.get(ip)

  if (!existing || existing.resetAt <= now) {
    rateLimitByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  existing.count += 1
  return false
}

function isOriginAllowed(req: VercelRequest): boolean {
  return isRequestOriginAllowed(req.headers, OPENPAGE_ALLOWED_ORIGINS)
}

function isDeployKeyValid(req: VercelRequest): boolean {
  if (!OPENPAGE_DEPLOY_KEY) return false
  const requestKey = req.headers['x-openpage-deploy-key']
  if (typeof requestKey !== 'string' || requestKey.length === 0) return false

  const expected = Buffer.from(OPENPAGE_DEPLOY_KEY, 'utf8')
  const provided = Buffer.from(requestKey, 'utf8')
  if (expected.length !== provided.length) return false
  return timingSafeEqual(expected, provided)
}

function isHtmlLikelyDocument(html: string): boolean {
  const lower = html.toLowerCase()
  return lower.includes('<html') && lower.includes('</html>')
}

function getCachedDeploy(fingerprint: string) {
  const cached = recentDeploysByFingerprint.get(fingerprint)
  if (!cached) return null
  if (cached.expiresAt <= Date.now()) {
    recentDeploysByFingerprint.delete(fingerprint)
    return null
  }
  return cached
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!VERCEL_DEPLOY_TOKEN) {
    return res.status(500).json({ error: 'VERCEL_DEPLOY_TOKEN not configured' })
  }

  if (!OPENPAGE_DEPLOY_KEY) {
    return res.status(500).json({ error: 'OPENPAGE_DEPLOY_KEY not configured' })
  }

  const contentType = req.headers['content-type']
  if (typeof contentType !== 'string' || !contentType.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' })
  }

  if (!isOriginAllowed(req)) {
    return res.status(403).json({ error: 'Forbidden origin' })
  }

  const fetchSite = req.headers['sec-fetch-site']
  if (typeof fetchSite === 'string' && fetchSite === 'cross-site') {
    return res.status(403).json({ error: 'Cross-site requests are not allowed' })
  }

  if (!isDeployKeyValid(req)) {
    return res.status(401).json({ error: 'Invalid deploy key' })
  }

  const clientIp = getClientIp(req)
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again shortly.' })
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const { html: rawHtml, slug: rawSlug } = req.body as { html?: unknown; slug?: unknown }
  if (typeof rawHtml !== 'string' || rawHtml.trim().length === 0) {
    return res.status(400).json({ error: 'html is required' })
  }

  if (typeof rawSlug !== 'string') {
    return res.status(400).json({ error: 'slug is required' })
  }

  const html = rawHtml.trim()
  if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) {
    return res.status(413).json({ error: `html exceeds ${MAX_HTML_BYTES} bytes` })
  }
  if (!isHtmlLikelyDocument(html)) {
    return res.status(400).json({ error: 'html must be a complete HTML document' })
  }

  const safeSlug = sanitizeSlug(rawSlug) || 'site'
  const projectName = `openpage-${safeSlug}`
  const htmlHash = createHash('sha256').update(html).digest('hex')
  const deployFingerprint = `${clientIp}:${projectName}:${htmlHash}`

  const cached = getCachedDeploy(deployFingerprint)
  if (cached) {
    return res.status(200).json({
      url: cached.url,
      projectUrl: cached.projectUrl,
      deploymentId: cached.deploymentId,
      readyState: cached.readyState,
      cached: true,
    })
  }

  try {
    const teamParam = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''
    const deployAbort = AbortSignal.timeout(25_000)

    // Create deployment with inline file data
    const deployResponse = await fetch(
      `https://api.vercel.com/v13/deployments${teamParam}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_DEPLOY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        signal: deployAbort,
        body: JSON.stringify({
          name: projectName,
          files: [
            {
              file: 'index.html',
              data: html,
            },
          ],
          projectSettings: {
            framework: null,
          },
          target: 'production',
        }),
      }
    )

    if (!deployResponse.ok) {
      const upstreamError = await deployResponse.json().catch(() => null)
      return res.status(502).json({
        error: 'Vercel deployment failed',
        details: extractUpstreamError(upstreamError),
      })
    }

    const deployData = await deployResponse.json().catch(() => null) as
      | { url?: unknown; id?: unknown; readyState?: unknown }
      | null

    if (!deployData || typeof deployData.url !== 'string' || typeof deployData.id !== 'string') {
      return res.status(502).json({ error: 'Vercel deployment returned an invalid response' })
    }

    const result = {
      url: `https://${deployData.url}`,
      projectUrl: `https://${projectName}.vercel.app`,
      deploymentId: deployData.id,
      readyState: typeof deployData.readyState === 'string' ? deployData.readyState : 'UNKNOWN',
    }

    recentDeploysByFingerprint.set(deployFingerprint, {
      ...result,
      expiresAt: Date.now() + DEPLOY_CACHE_TTL_MS,
    })

    return res.status(200).json(result)
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === 'AbortError' || err.name === 'TimeoutError')
    ) {
      return res.status(504).json({ error: 'Deployment timed out while contacting Vercel' })
    }

    return res.status(500).json({
      error: 'Deployment failed',
    })
  }
}

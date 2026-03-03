export interface DeployRequestHeaders {
  origin?: string | string[]
  referer?: string | string[]
  host?: string | string[]
  'x-forwarded-proto'?: string | string[]
  'x-openpage-deploy-key'?: string | string[]
}

export function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}

export function extractUpstreamError(data: unknown): string {
  if (!data || typeof data !== 'object') return 'Upstream deployment error'
  const obj = data as {
    error?: { message?: unknown; code?: unknown }
    message?: unknown
  }
  if (typeof obj.error?.message === 'string' && obj.error.message.trim()) return obj.error.message
  if (typeof obj.error?.code === 'string' && obj.error.code.trim()) return obj.error.code
  if (typeof obj.message === 'string' && obj.message.trim()) return obj.message
  return 'Upstream deployment error'
}

function firstHeaderValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] || null
  if (typeof value === 'string' && value.length > 0) return value
  return null
}

export function getRequestOriginFromHeaders(headers: DeployRequestHeaders): string | null {
  const origin = firstHeaderValue(headers.origin)
  if (origin) return origin

  const referer = firstHeaderValue(headers.referer)
  if (!referer) return null

  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

export function isRequestOriginAllowed(
  headers: DeployRequestHeaders,
  allowedOrigins: string[]
): boolean {
  const origin = getRequestOriginFromHeaders(headers)
  if (!origin) return false

  if (allowedOrigins.length > 0) return allowedOrigins.includes(origin)

  const host = firstHeaderValue(headers.host)
  if (!host) return false

  const forwardedProto = firstHeaderValue(headers['x-forwarded-proto'])
  const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : 'https'
  const inferredOrigin = `${proto}://${host}`
  return origin === inferredOrigin
}

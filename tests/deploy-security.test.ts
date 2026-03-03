import { describe, it, expect } from 'vitest'
import {
  extractUpstreamError,
  getRequestOriginFromHeaders,
  isRequestOriginAllowed,
  sanitizeSlug,
} from '../api/lib/deploy-security'

describe('sanitizeSlug', () => {
  it('normalizes and trims safely', () => {
    expect(sanitizeSlug(' My Cool Site!!! ')).toBe('my-cool-site')
    expect(sanitizeSlug('---A__B__C---')).toBe('a-b-c')
    expect(sanitizeSlug('%%%')).toBe('')
    expect(sanitizeSlug('x'.repeat(80)).length).toBe(40)
  })
})

describe('extractUpstreamError', () => {
  it('prioritizes nested message fields', () => {
    expect(
      extractUpstreamError({ error: { message: 'Project not found' } })
    ).toBe('Project not found')
    expect(extractUpstreamError({ error: { code: 'bad_request' } })).toBe('bad_request')
    expect(extractUpstreamError({ message: 'Fallback message' })).toBe('Fallback message')
    expect(extractUpstreamError(null)).toBe('Upstream deployment error')
  })
})

describe('getRequestOriginFromHeaders', () => {
  it('resolves origin then referer', () => {
    expect(
      getRequestOriginFromHeaders({ origin: 'https://openpage.app' })
    ).toBe('https://openpage.app')
    expect(
      getRequestOriginFromHeaders({ referer: 'https://openpage.app/editor?x=1' })
    ).toBe('https://openpage.app')
    expect(getRequestOriginFromHeaders({ referer: 'invalid-url' })).toBe(null)
  })
})

describe('isRequestOriginAllowed', () => {
  it('supports explicit allowlist', () => {
    const headers = { origin: 'https://openpage.app' }
    expect(isRequestOriginAllowed(headers, ['https://openpage.app'])).toBe(true)
    expect(isRequestOriginAllowed(headers, ['https://other.app'])).toBe(false)
  })

  it('infers same-origin from host/proto when allowlist is empty', () => {
    const headers = {
      origin: 'https://openpage-phi.vercel.app',
      host: 'openpage-phi.vercel.app',
      'x-forwarded-proto': 'https',
    }
    expect(isRequestOriginAllowed(headers, [])).toBe(true)

    const mismatch = {
      origin: 'https://evil.example',
      host: 'openpage-phi.vercel.app',
      'x-forwarded-proto': 'https',
    }
    expect(isRequestOriginAllowed(mismatch, [])).toBe(false)
  })
})

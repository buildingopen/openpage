import test from 'node:test'
import assert from 'node:assert/strict'
import {
  extractUpstreamError,
  getRequestOriginFromHeaders,
  isRequestOriginAllowed,
  sanitizeSlug,
} from '../api/lib/deploy-security'

test('sanitizeSlug normalizes and trims safely', () => {
  assert.equal(sanitizeSlug(' My Cool Site!!! '), 'my-cool-site')
  assert.equal(sanitizeSlug('---A__B__C---'), 'a-b-c')
  assert.equal(sanitizeSlug('%%%'), '')
  assert.equal(sanitizeSlug('x'.repeat(80)).length, 40)
})

test('extractUpstreamError prioritizes nested message fields', () => {
  assert.equal(
    extractUpstreamError({ error: { message: 'Project not found' } }),
    'Project not found'
  )
  assert.equal(extractUpstreamError({ error: { code: 'bad_request' } }), 'bad_request')
  assert.equal(extractUpstreamError({ message: 'Fallback message' }), 'Fallback message')
  assert.equal(extractUpstreamError(null), 'Upstream deployment error')
})

test('getRequestOriginFromHeaders resolves origin then referer', () => {
  assert.equal(
    getRequestOriginFromHeaders({ origin: 'https://openpage.app' }),
    'https://openpage.app'
  )
  assert.equal(
    getRequestOriginFromHeaders({ referer: 'https://openpage.app/editor?x=1' }),
    'https://openpage.app'
  )
  assert.equal(getRequestOriginFromHeaders({ referer: 'invalid-url' }), null)
})

test('isRequestOriginAllowed supports explicit allowlist', () => {
  const headers = { origin: 'https://openpage.app' }
  assert.equal(isRequestOriginAllowed(headers, ['https://openpage.app']), true)
  assert.equal(isRequestOriginAllowed(headers, ['https://other.app']), false)
})

test('isRequestOriginAllowed infers same-origin from host/proto when allowlist is empty', () => {
  const headers = {
    origin: 'https://openpage-phi.vercel.app',
    host: 'openpage-phi.vercel.app',
    'x-forwarded-proto': 'https',
  }
  assert.equal(isRequestOriginAllowed(headers, []), true)

  const mismatch = {
    origin: 'https://evil.example',
    host: 'openpage-phi.vercel.app',
    'x-forwarded-proto': 'https',
  }
  assert.equal(isRequestOriginAllowed(mismatch, []), false)
})

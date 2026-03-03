import test from 'node:test'
import assert from 'node:assert/strict'
import { exportSiteToHTML } from '../src/lib/export-html'
import type { SiteConfig } from '../src/blocks/types'

const baseConfig: SiteConfig = {
  name: 'Test Site',
  blocks: [
    {
      id: 'hero-1',
      type: 'hero',
      variant: 'centered',
      props: {
        headline: 'Hello',
        subheadline: 'World',
        primaryCta: 'Start',
      },
    },
  ],
}

test('exportSiteToHTML includes SEO metadata and language settings', () => {
  const html = exportSiteToHTML(baseConfig, {
    settings: {
      siteName: 'OpenPage',
      seoTitle: 'OpenPage Builder',
      seoDescription: 'Build <fast> websites safely',
      ogImageUrl: 'https://cdn.example.com/og.png',
      faviconUrl: 'https://cdn.example.com/favicon.ico',
      language: 'German',
    },
  })

  assert.match(html, /<html lang="de">/)
  assert.match(html, /<title>OpenPage Builder<\/title>/)
  assert.match(html, /name="description" content="Build &lt;fast&gt; websites safely"/)
  assert.match(html, /property="og:image" content="https:\/\/cdn\.example\.com\/og\.png"/)
  assert.match(html, /rel="icon" href="https:\/\/cdn\.example\.com\/favicon\.ico"/)
})

test('exportSiteToHTML injects analytics snippets when keys are provided', () => {
  const html = exportSiteToHTML(baseConfig, {
    settings: {
      gaId: 'G-ABC123XYZ',
      posthogKey: 'phc_test_key',
    },
  })

  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-ABC123XYZ/)
  assert.match(html, /gtag\('config', "G-ABC123XYZ"\);/)
  assert.match(html, /posthog\.init\("phc_test_key"/)
})

test('exportSiteToHTML omits optional metadata when settings are absent', () => {
  const html = exportSiteToHTML(baseConfig)
  assert.doesNotMatch(html, /name="description"/)
  assert.doesNotMatch(html, /property="og:image"/)
  assert.doesNotMatch(html, /googletagmanager/)
  assert.doesNotMatch(html, /posthog\.init/)
})

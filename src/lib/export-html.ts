import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import type { SiteConfig, ThemeConfig } from '@/blocks/types'
import { renderBlock } from '@/blocks/registry'
import { resolveTheme, themeToCSS } from '@/lib/theme-presets'

function extractStyles(): string {
  const styles: string[] = []
  const styleTags = document.querySelectorAll('style')
  for (const tag of styleTags) {
    if (tag.textContent) {
      styles.push(tag.textContent)
    }
  }
  return styles.join('\n')
}

function buildFontLink(theme: ThemeConfig): string {
  const fonts = new Set([theme.fontSans, theme.fontDisplay, theme.fontMono])
  const families = [...fonts].map((f) => `family=${f.replace(/\s+/g, '+')}:wght@400;500;600;700`).join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

function themeVarsToInline(theme: ThemeConfig): string {
  const vars = themeToCSS(theme)
  return Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')
}

export async function exportToHTML(config: SiteConfig): Promise<string> {
  const theme = resolveTheme(config.theme)
  const cssVars = themeToCSS(theme)

  // Render blocks into a temporary container
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '-9999px'
  document.body.appendChild(container)

  const root = createRoot(container)
  flushSync(() => {
    root.render(
      createElement(
        'div',
        {
          style: { ...cssVars, color: 'var(--color-text-0)', backgroundColor: 'var(--color-bg-1)' } as React.CSSProperties,
        },
        ...(config.pages?.[0]?.blocks ?? config.blocks).map((block) => renderBlock(block)),
      ),
    )
  })

  const blockHTML = container.querySelector('div')?.innerHTML || ''

  root.unmount()
  document.body.removeChild(container)

  // Extract compiled CSS from <style> tags
  const css = extractStyles()

  const fontLink = buildFontLink(theme)
  const inlineVars = themeVarsToInline(theme)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.name)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontLink}" rel="stylesheet">
  <style>${css}</style>
</head>
<body style="${escapeHtml(inlineVars)}; color: var(--color-text-0); background-color: var(--color-bg-1); margin: 0; -webkit-font-smoothing: antialiased;">
  ${blockHTML}
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function downloadHTML(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function previewHTML(html: string) {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}

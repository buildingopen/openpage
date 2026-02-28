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

function renderBlocksToHTML(
  blocks: import('@/blocks/types').BlockConfig[],
  cssVars: Record<string, string>,
): string {
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
        ...blocks.map((block) => renderBlock(block)),
      ),
    )
  })

  const html = container.querySelector('div')?.innerHTML || ''
  root.unmount()
  document.body.removeChild(container)
  return html
}

export async function exportToHTML(config: SiteConfig): Promise<string> {
  const theme = resolveTheme(config.theme)
  const cssVars = themeToCSS(theme)

  const pages = config.pages && config.pages.length > 0
    ? config.pages
    : [{ id: 'home', name: 'Home', path: '/', blocks: config.blocks }]

  // Render each page's blocks
  const pageSections: string[] = []
  for (const page of pages) {
    const html = renderBlocksToHTML(page.blocks, cssVars)
    const sectionId = page.path === '/' ? 'home' : page.path.replace(/^\//, '').replace(/[^a-z0-9-]/gi, '-')
    pageSections.push(`<section id="${escapeHtml(sectionId)}">${html}</section>`)
  }

  // Extract compiled CSS from <style> tags
  const css = extractStyles()

  const fontLink = buildFontLink(theme)
  const inlineVars = themeVarsToInline(theme)

  // Build page nav if multiple pages
  let pageNav = ''
  if (pages.length > 1) {
    const navLinks = pages.map((page) => {
      const href = page.path === '/' ? '#home' : `#${page.path.replace(/^\//, '').replace(/[^a-z0-9-]/gi, '-')}`
      return `<a href="${escapeHtml(href)}" style="color: var(--color-text-2); text-decoration: none; font-size: 13px; padding: 6px 12px; border-radius: 6px; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text-0)'" onmouseout="this.style.color='var(--color-text-2)'">${escapeHtml(page.name)}</a>`
    }).join('')
    pageNav = `<nav style="position: sticky; top: 0; z-index: 50; display: flex; gap: 4px; justify-content: center; padding: 8px 16px; background: var(--color-bg-0); border-bottom: 1px solid var(--color-border-default);">${navLinks}</nav>`
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.name)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontLink}" rel="stylesheet">
  <style>${css}
  html { scroll-behavior: smooth; }</style>
</head>
<body style="${escapeHtml(inlineVars)}; color: var(--color-text-0); background-color: var(--color-bg-1); margin: 0; -webkit-font-smoothing: antialiased;">
  ${pageNav}
  ${pageSections.join('\n  ')}
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

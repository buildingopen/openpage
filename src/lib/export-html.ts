import type { SiteConfig, BlockConfig } from '@/blocks/types'
import { resolveTheme } from '@/lib/theme-presets'

export interface ExportSiteSettings {
  siteName?: string
  siteDescription?: string
  faviconUrl?: string
  language?: string
  seoTitle?: string
  seoDescription?: string
  ogImageUrl?: string
  gaId?: string
  posthogKey?: string
}

export interface ExportSiteOptions {
  settings?: ExportSiteSettings
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderLink(text: string, url?: string, className?: string): string {
  const cls = className ? ` class="${escapeHtml(className)}"` : ''
  const escaped = escapeHtml(text)
  if (url && url.trim()) {
    return `<a href="${escapeHtml(url)}"${cls}>${escaped}</a>`
  }
  return `<span${cls}>${escaped}</span>`
}

function googleFontUrl(fonts: string[]): string {
  const unique = [...new Set(fonts.filter(Boolean))]
  const families = unique.map(
    (f) => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`
  )
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

function initials(name: string): string {
  return escapeHtml(
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
  )
}

function prop<T>(props: Record<string, unknown>, key: string, fallback: T): T {
  const val = props[key]
  if (val === undefined || val === null) return fallback
  return val as T
}

function normalizeLanguage(value?: string): string {
  const normalized = (value || '').toLowerCase().trim()
  if (!normalized) return 'en'
  if (normalized === 'english' || normalized.startsWith('en')) return 'en'
  if (normalized === 'german' || normalized.startsWith('de')) return 'de'
  if (normalized === 'spanish' || normalized.startsWith('es')) return 'es'
  if (normalized === 'french' || normalized.startsWith('fr')) return 'fr'
  return 'en'
}

// ---------------------------------------------------------------------------
// SVG icons (inline, no dependencies)
// ---------------------------------------------------------------------------

const SVG_CHECK =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'

const SVG_CHEVRON_DOWN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'

const SVG_MENU =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>'

const SVG_SPARKLES =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>'

const SVG_STAR_FILLED =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'

const SVG_STAR_EMPTY =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'

const SVG_QUOTE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3"/></svg>'

const SVG_SEND =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'

const SVG_MAIL =
  '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>'

const SVG_STAR_10 =
  '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'

/** Simple icon placeholder for feature items (rounded square with initial) */
function featureIconSvg(iconName: string): string {
  const char = escapeHtml(iconName.charAt(0).toUpperCase())
  return `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.5"/><text x="9" y="13" text-anchor="middle" fill="currentColor" font-size="10" font-weight="600" font-family="system-ui, sans-serif">${char}</text></svg>`
}

function starRatingHtml(rating: number): string {
  const stars = [1, 2, 3, 4, 5]
    .map((i) =>
      i <= rating
        ? `<span class="text-yellow-400">${SVG_STAR_FILLED}</span>`
        : `<span class="text-text-3">${SVG_STAR_EMPTY}</span>`
    )
    .join('')
  return `<div class="flex gap-0.5">${stars}</div>`
}

function logoPlaceholderSvg(name: string): string {
  const char = escapeHtml(name.charAt(0).toUpperCase())
  return `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="26" height="26" rx="6" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="14" y="18" text-anchor="middle" fill="currentColor" font-size="14" font-weight="700" font-family="system-ui, sans-serif">${char}</text></svg>`
}

// ---------------------------------------------------------------------------
// Block renderers
// ---------------------------------------------------------------------------

function renderNavbar(block: BlockConfig): string {
  const logo = escapeHtml(prop(block.props, 'logo', 'Brand'))
  const logoImage = prop<string>(block.props, 'logoImage', '')
  const links = prop<string[]>(block.props, 'links', [])
  const ctaText = escapeHtml(prop(block.props, 'ctaText', 'Get Started'))

  const navLinks = links
    .map(
      (l) =>
        `          <span class="text-[13px] text-text-2 hover:text-text-0 transition-colors cursor-pointer">${escapeHtml(l)}</span>`
    )
    .join('\n')

  const logoHtml = logoImage
    ? `<img src="${escapeHtml(logoImage)}" alt="${logo}" class="h-8 w-auto object-contain" />`
    : `<div class="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center"><div class="w-4 h-4 rounded-full bg-green"></div></div>`

  return `  <nav class="px-6 md:px-10 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      ${logoHtml}
      <span class="font-semibold text-[15px] text-text-0 tracking-tight">${logo}</span>
    </div>
    <div class="hidden lg:flex items-center gap-6">
${navLinks}
    </div>
    <div class="flex items-center gap-3">
      <button class="px-4 py-2 rounded-lg bg-green text-black text-[13px] font-semibold hover:bg-green-dim transition-colors">${ctaText}</button>
      <button class="lg:hidden w-9 h-9 rounded-lg border border-border-default flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-bg-3 transition-colors">
        ${SVG_MENU}
      </button>
    </div>
  </nav>`
}

// ---------------------------------------------------------------------------
// Hero variants
// ---------------------------------------------------------------------------

function renderHeroCentered(block: BlockConfig): string {
  const badge = prop<string>(block.props, 'badge', '')
  const headline = escapeHtml(prop(block.props, 'headline', ''))
  const subheadline = escapeHtml(prop(block.props, 'subheadline', ''))
  const primaryCta = prop<string>(block.props, 'primaryCta', '')
  const primaryCtaUrl = prop<string>(block.props, 'primaryCtaUrl', '')
  const secondaryCta = prop<string>(block.props, 'secondaryCta', '')
  const secondaryCtaUrl = prop<string>(block.props, 'secondaryCtaUrl', '')

  const badgeHtml = badge
    ? `      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-green text-[11px] font-medium mb-6">
        ${SVG_SPARKLES}
        ${escapeHtml(badge)}
      </div>`
    : ''

  const secondaryHtml = secondaryCta
    ? `        ${renderLink(secondaryCta, secondaryCtaUrl, 'px-6 py-3 rounded-lg bg-bg-3 text-text-0 text-sm font-medium border border-border-default hover:bg-bg-4 hover:border-border-hover transition-all inline-block')}`
    : ''

  return `  <section class="px-6 md:px-10 py-20 md:py-28 text-center">
${badgeHtml}
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4 max-w-3xl mx-auto">${headline}</h1>
      <p class="text-text-2 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">${subheadline}</p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        ${renderLink(primaryCta, primaryCtaUrl, 'px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all inline-flex items-center gap-2')}
${secondaryHtml}
      </div>
  </section>`
}

function renderHeroSplit(block: BlockConfig): string {
  const badge = prop<string>(block.props, 'badge', '')
  const headline = escapeHtml(prop(block.props, 'headline', ''))
  const subheadline = escapeHtml(prop(block.props, 'subheadline', ''))
  const primaryCta = prop<string>(block.props, 'primaryCta', '')
  const primaryCtaUrl = prop<string>(block.props, 'primaryCtaUrl', '')
  const secondaryCta = prop<string>(block.props, 'secondaryCta', '')
  const secondaryCtaUrl = prop<string>(block.props, 'secondaryCtaUrl', '')
  const heroImage = prop<string>(block.props, 'heroImage', '')

  const badgeHtml = badge
    ? `        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-green text-[11px] font-medium mb-4">
          ${SVG_SPARKLES}
          ${escapeHtml(badge)}
        </div>`
    : ''

  const secondaryHtml = secondaryCta
    ? `          ${renderLink(secondaryCta, secondaryCtaUrl, 'px-6 py-3 rounded-lg bg-bg-3 text-text-0 text-sm font-medium border border-border-default hover:bg-bg-4 transition-all inline-block')}`
    : ''

  const imageHtml = heroImage
    ? `          <img src="${escapeHtml(heroImage)}" alt="" class="absolute inset-0 w-full h-full object-cover" />`
    : `          <div class="absolute inset-0 bg-gradient-to-br from-green/5 to-transparent"></div>
          <div class="absolute inset-6 border border-dashed border-border-default rounded-lg flex items-center justify-center text-text-3 text-sm">Preview</div>`

  return `  <section class="px-6 md:px-10 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-10">
      <div class="flex-1">
${badgeHtml}
        <h1 class="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">${headline}</h1>
        <p class="text-text-2 text-base leading-relaxed mb-6 max-w-lg">${subheadline}</p>
        <div class="flex flex-wrap items-center gap-3">
          ${renderLink(primaryCta, primaryCtaUrl, 'px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all inline-flex items-center gap-2')}
${secondaryHtml}
        </div>
      </div>
      <div class="flex-1 w-full">
        <div class="aspect-[4/3] rounded-xl bg-bg-2 border border-border-default overflow-hidden relative">
${imageHtml}
        </div>
      </div>
  </section>`
}

function renderHeroGradient(block: BlockConfig): string {
  const badge = prop<string>(block.props, 'badge', '')
  const headline = escapeHtml(prop(block.props, 'headline', ''))
  const subheadline = escapeHtml(prop(block.props, 'subheadline', ''))
  const primaryCta = prop<string>(block.props, 'primaryCta', '')
  const primaryCtaUrl = prop<string>(block.props, 'primaryCtaUrl', '')
  const secondaryCta = prop<string>(block.props, 'secondaryCta', '')
  const secondaryCtaUrl = prop<string>(block.props, 'secondaryCtaUrl', '')

  const badgeHtml = badge
    ? `        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-green text-[11px] font-medium mb-6">
          ${SVG_SPARKLES}
          ${escapeHtml(badge)}
        </div>`
    : ''

  const secondaryHtml = secondaryCta
    ? `          ${renderLink(secondaryCta, secondaryCtaUrl, 'px-6 py-3 rounded-lg bg-bg-3 text-text-0 text-sm font-medium border border-border-default hover:bg-bg-4 transition-all inline-block')}`
    : ''

  return `  <section class="px-6 md:px-10 py-20 md:py-32 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-green/5 via-transparent to-transparent pointer-events-none"></div>
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green/[0.08] rounded-full blur-[100px] pointer-events-none"></div>
      <div class="relative z-10">
${badgeHtml}
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4 max-w-3xl mx-auto text-text-0">${headline}</h1>
        <p class="text-text-2 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">${subheadline}</p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          ${renderLink(primaryCta, primaryCtaUrl, 'px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all inline-flex items-center gap-2')}
${secondaryHtml}
        </div>
      </div>
  </section>`
}

function renderHero(block: BlockConfig): string {
  switch (block.variant) {
    case 'split':
      return renderHeroSplit(block)
    case 'gradient':
      return renderHeroGradient(block)
    default:
      return renderHeroCentered(block)
  }
}

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

function renderFeaturesGrid(block: BlockConfig): string {
  const label = prop<string>(block.props, 'label', '')
  const title = escapeHtml(prop(block.props, 'title', ''))
  const subtitle = prop<string>(block.props, 'subtitle', '')
  const items = prop<{ icon?: string; title: string; description: string }[]>(
    block.props,
    'items',
    []
  )

  const labelHtml = label
    ? `        <div class="text-[11px] font-semibold uppercase tracking-widest text-green mb-2">${escapeHtml(label)}</div>`
    : ''
  const subtitleHtml = subtitle
    ? `        <p class="text-text-2 text-sm max-w-lg mx-auto">${escapeHtml(subtitle)}</p>`
    : ''

  const cards = items
    .map(
      (item) => `        <div class="group bg-bg-2 border border-border-default rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <div class="w-10 h-10 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green mb-3">
            ${featureIconSvg(item.icon || 'Z')}
          </div>
          <h3 class="text-sm font-semibold mb-1">${escapeHtml(item.title)}</h3>
          <p class="text-[12.5px] text-text-2 leading-relaxed">${escapeHtml(item.description)}</p>
        </div>`
    )
    .join('\n')

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="text-center mb-10">
${labelHtml}
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
${cards}
      </div>
  </section>`
}

function renderFeaturesList(block: BlockConfig): string {
  const label = prop<string>(block.props, 'label', '')
  const title = escapeHtml(prop(block.props, 'title', ''))
  const subtitle = prop<string>(block.props, 'subtitle', '')
  const items = prop<{ icon?: string; title: string; description: string }[]>(
    block.props,
    'items',
    []
  )

  const labelHtml = label
    ? `        <div class="text-[11px] font-semibold uppercase tracking-widest text-green mb-2">${escapeHtml(label)}</div>`
    : ''
  const subtitleHtml = subtitle
    ? `        <p class="text-text-2 text-sm max-w-lg mx-auto">${escapeHtml(subtitle)}</p>`
    : ''

  const rows = items
    .map(
      (item) => `        <div class="flex gap-4 p-4 rounded-xl bg-bg-2 border border-border-default transition-all hover:border-border-hover">
          <div class="w-10 h-10 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
            ${featureIconSvg(item.icon || 'Z')}
          </div>
          <div>
            <h3 class="text-sm font-semibold mb-0.5">${escapeHtml(item.title)}</h3>
            <p class="text-[12.5px] text-text-2 leading-relaxed">${escapeHtml(item.description)}</p>
          </div>
        </div>`
    )
    .join('\n')

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="text-center mb-10">
${labelHtml}
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
      </div>
      <div class="max-w-2xl mx-auto space-y-4">
${rows}
      </div>
  </section>`
}

function renderFeatures(block: BlockConfig): string {
  switch (block.variant) {
    case 'list':
      return renderFeaturesList(block)
    default:
      return renderFeaturesGrid(block)
  }
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

interface PricingTier {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  cta: string
  featured?: boolean
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    description: 'For personal projects',
    features: ['1 website', '5 blocks', 'Basic export', 'Community support'],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For professionals',
    features: [
      'Unlimited websites',
      'All blocks',
      'Custom domains',
      'Priority support',
      'Agent API access',
      'Version history',
    ],
    cta: 'Upgrade to Pro',
    featured: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom components',
      'SSO',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
  },
]

function renderPricingSimple(block: BlockConfig): string {
  const title = escapeHtml(prop(block.props, 'title', ''))
  const subtitle = prop<string>(block.props, 'subtitle', '')
  const tiers = prop<PricingTier[]>(block.props, 'tiers', defaultTiers)

  const subtitleHtml = subtitle
    ? `        <p class="text-text-2 text-sm max-w-lg mx-auto">${escapeHtml(subtitle)}</p>`
    : ''

  const cards = tiers
    .map((tier) => {
      const featuredBorder = tier.featured
        ? 'bg-bg-2 border-2 border-green'
        : 'bg-bg-2 border border-border-default hover:border-border-hover'
      const featuredBadge = tier.featured
        ? `          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-green text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            ${SVG_STAR_10}
            Recommended
          </div>`
        : ''
      const btnClass = tier.featured
        ? 'w-full py-2.5 rounded-lg text-sm font-semibold transition-all bg-green text-black hover:bg-green-dim'
        : 'w-full py-2.5 rounded-lg text-sm font-semibold transition-all bg-bg-3 text-text-0 border border-border-default hover:bg-bg-4 hover:border-border-hover'

      const features = tier.features
        .map(
          (f) =>
            `            <li class="flex items-start gap-2 text-[12.5px] text-text-1">
              <span class="text-green shrink-0 mt-0.5">${SVG_CHECK}</span>
              ${escapeHtml(f)}
            </li>`
        )
        .join('\n')

      const periodHtml = tier.period
        ? `<span class="text-text-3 text-sm">${escapeHtml(tier.period)}</span>`
        : ''
      const descHtml = tier.description
        ? `            <p class="text-[11px] text-text-3">${escapeHtml(tier.description)}</p>`
        : ''

      return `        <div class="relative rounded-xl p-6 flex flex-col transition-all ${featuredBorder}">
${featuredBadge}
          <div class="mb-4">
            <h3 class="text-sm font-semibold mb-1">${escapeHtml(tier.name)}</h3>
${descHtml}
          </div>
          <div class="mb-4">
            <span class="text-3xl font-bold tracking-tight">${escapeHtml(tier.price)}</span>
            ${periodHtml}
          </div>
          <ul class="space-y-2 mb-6 flex-1">
${features}
          </ul>
          <button class="${btnClass}">${escapeHtml(tier.cta)}</button>
        </div>`
    })
    .join('\n')

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
${cards}
      </div>
  </section>`
}

function renderPricingComparison(block: BlockConfig): string {
  const title = escapeHtml(prop(block.props, 'title', ''))
  const subtitle = prop<string>(block.props, 'subtitle', '')
  const tiers = prop<PricingTier[]>(block.props, 'tiers', defaultTiers)

  const allFeatures = [...new Set(tiers.flatMap((t) => t.features))]

  const subtitleHtml = subtitle
    ? `        <p class="text-text-2 text-sm max-w-lg mx-auto">${escapeHtml(subtitle)}</p>`
    : ''

  const headerCells = tiers
    .map((tier) => {
      const cls = tier.featured ? 'text-green' : 'text-text-0'
      return `              <th class="py-3 px-3 text-center font-semibold ${cls}">
                ${escapeHtml(tier.name)}
                <div class="text-lg font-bold mt-0.5">${escapeHtml(tier.price)}</div>
              </th>`
    })
    .join('\n')

  const bodyRows = allFeatures
    .map((feature) => {
      const cells = tiers
        .map((tier) => {
          const has = tier.features.includes(feature)
          return has
            ? `              <td class="py-2.5 px-3 text-center"><span class="text-green inline-block">${SVG_CHECK}</span></td>`
            : `              <td class="py-2.5 px-3 text-center text-text-3">-</td>`
        })
        .join('\n')
      return `            <tr class="border-b border-border-subtle">
              <td class="py-2.5 px-3 text-text-1">${escapeHtml(feature)}</td>
${cells}
            </tr>`
    })
    .join('\n')

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
      </div>
      <div class="max-w-3xl mx-auto overflow-x-auto">
        <table class="w-full text-left text-[12.5px]">
          <thead>
            <tr class="border-b border-border-default">
              <th class="py-3 px-3 text-text-3 font-medium">Feature</th>
${headerCells}
            </tr>
          </thead>
          <tbody>
${bodyRows}
          </tbody>
        </table>
      </div>
  </section>`
}

function renderPricing(block: BlockConfig): string {
  switch (block.variant) {
    case 'comparison':
      return renderPricingComparison(block)
    default:
      return renderPricingSimple(block)
  }
}

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

function renderCtaSimple(block: BlockConfig): string {
  const headline = escapeHtml(prop(block.props, 'headline', ''))
  const subheadline = prop<string>(block.props, 'subheadline', '')
  const buttonText = prop<string>(block.props, 'buttonText', '')
  const buttonUrl = prop<string>(block.props, 'buttonUrl', '')

  const subHtml = subheadline
    ? `        <p class="text-text-2 text-sm mb-6 max-w-md mx-auto">${escapeHtml(subheadline)}</p>`
    : ''

  return `  <section class="px-6 md:px-10 py-16 md:py-20 text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-green/[0.06] via-green/[0.03] to-transparent pointer-events-none"></div>
      <div class="relative z-10">
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-3">${headline}</h2>
${subHtml}
        ${renderLink(buttonText, buttonUrl, 'px-8 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all inline-flex items-center gap-2')}
      </div>
  </section>`
}

function renderCtaSplit(block: BlockConfig): string {
  const headline = escapeHtml(prop(block.props, 'headline', ''))
  const subheadline = prop<string>(block.props, 'subheadline', '')
  const buttonText = prop<string>(block.props, 'buttonText', '')
  const buttonUrl = prop<string>(block.props, 'buttonUrl', '')

  const subHtml = subheadline
    ? `          <p class="text-text-2 text-sm">${escapeHtml(subheadline)}</p>`
    : ''

  return `  <section class="px-6 md:px-10 py-12 md:py-16">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-xl bg-bg-2 border border-border-default relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-green/5 to-transparent pointer-events-none"></div>
        <div class="relative z-10">
          <h2 class="text-xl md:text-2xl font-bold tracking-tight mb-1">${headline}</h2>
${subHtml}
        </div>
        ${renderLink(buttonText, buttonUrl, 'relative z-10 px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all shrink-0 inline-flex items-center gap-2')}
      </div>
  </section>`
}

function renderCta(block: BlockConfig): string {
  switch (block.variant) {
    case 'split':
      return renderCtaSplit(block)
    default:
      return renderCtaSimple(block)
  }
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

function renderFooterSimple(block: BlockConfig): string {
  const logo = escapeHtml(prop(block.props, 'logo', 'Brand'))
  const logoImage = prop<string>(block.props, 'logoImage', '')
  const copyright = escapeHtml(prop(block.props, 'copyright', ''))
  const links = prop<string[]>(block.props, 'links', [])

  const linksHtml = links
    .map(
      (l) =>
        `        <span class="text-[12px] text-text-3 hover:text-text-1 transition-colors cursor-pointer">${escapeHtml(l)}</span>`
    )
    .join('\n')

  const footerLogoHtml = logoImage
    ? `<img src="${escapeHtml(logoImage)}" alt="${logo}" class="h-6 w-auto object-contain" />`
    : `<div class="w-6 h-6 rounded-md bg-green/10 flex items-center justify-center"><div class="w-3 h-3 rounded-full bg-green"></div></div>`

  return `  <footer class="px-6 md:px-10 py-8 border-t border-border-subtle">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          ${footerLogoHtml}
          <span class="text-sm font-semibold text-text-1">${logo}</span>
        </div>
        <div class="flex items-center gap-4">
${linksHtml}
        </div>
        <span class="text-[11px] text-text-3">${copyright}</span>
      </div>
  </footer>`
}

function renderFooterMultiColumn(block: BlockConfig): string {
  const logo = escapeHtml(prop(block.props, 'logo', 'Brand'))
  const logoImage = prop<string>(block.props, 'logoImage', '')
  const copyright = escapeHtml(prop(block.props, 'copyright', ''))
  const links = prop<string[]>(block.props, 'links', [])
  const columns = prop<{ title: string; links: string[] }[]>(
    block.props,
    'columns',
    [
      { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
      { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
      {
        title: 'Resources',
        links: ['Documentation', 'API Reference', 'Guides', 'Community'],
      },
      { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookie Policy'] },
    ]
  )

  const colsHtml = columns
    .map((col) => {
      const colLinks = col.links
        .map(
          (l) =>
            `            <li><span class="text-[12.5px] text-text-3 hover:text-text-1 transition-colors cursor-pointer">${escapeHtml(l)}</span></li>`
        )
        .join('\n')
      return `        <div>
          <h4 class="text-[11px] font-semibold uppercase tracking-wider text-text-2 mb-3">${escapeHtml(col.title)}</h4>
          <ul class="space-y-2">
${colLinks}
          </ul>
        </div>`
    })
    .join('\n')

  const bottomLinks = links
    .map(
      (l) =>
        `          <span class="text-[11px] text-text-3 hover:text-text-1 transition-colors cursor-pointer">${escapeHtml(l)}</span>`
    )
    .join('\n')

  const mcLogoHtml = logoImage
    ? `<img src="${escapeHtml(logoImage)}" alt="${logo}" class="h-7 w-auto object-contain" />`
    : `<div class="w-7 h-7 rounded-md bg-green/10 flex items-center justify-center"><div class="w-3.5 h-3.5 rounded-full bg-green"></div></div>`

  return `  <footer class="px-6 md:px-10 py-12 border-t border-border-subtle">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        <div class="col-span-2 lg:col-span-1">
          <div class="flex items-center gap-2 mb-3">
            ${mcLogoHtml}
            <span class="text-sm font-semibold">${logo}</span>
          </div>
          <p class="text-[12px] text-text-3 leading-relaxed max-w-[200px]">Build beautiful websites with structured JSON config.</p>
        </div>
${colsHtml}
      </div>
      <div class="pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <span class="text-[11px] text-text-3">${copyright}</span>
        <div class="flex gap-4">
${bottomLinks}
        </div>
      </div>
  </footer>`
}

function renderFooterMinimal(block: BlockConfig): string {
  const copyright = escapeHtml(prop(block.props, 'copyright', ''))
  const links = prop<string[]>(block.props, 'links', [])

  const linksHtml = links
    .map((l, i) => {
      const sep = i < links.length - 1 ? '<span class="mx-1">|</span>' : ''
      return `<span class="hover:text-text-1 transition-colors cursor-pointer">${escapeHtml(l)}</span>${sep}`
    })
    .join('')

  const divider = links.length > 0 ? '<span class="mx-1">|</span>' : ''

  return `  <footer class="px-6 md:px-10 py-6">
      <div class="flex items-center justify-center gap-1.5 text-[11px] text-text-3">
        <span>${copyright}</span>
        ${divider}
        ${linksHtml}
      </div>
  </footer>`
}

function renderFooter(block: BlockConfig): string {
  switch (block.variant) {
    case 'multi-column':
      return renderFooterMultiColumn(block)
    case 'minimal':
      return renderFooterMinimal(block)
    default:
      return renderFooterSimple(block)
  }
}

// ---------------------------------------------------------------------------
// Testimonials (cards only, carousel skipped per spec)
// ---------------------------------------------------------------------------

interface TestimonialItem {
  name: string
  role: string
  quote: string
  rating?: number
  avatar?: string
}

const defaultTestimonials: TestimonialItem[] = [
  {
    name: 'Sarah Chen',
    role: 'CEO at TechCorp',
    quote: 'OpenPage completely changed how we build landing pages. The JSON config approach is genius.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Lead Developer',
    quote: 'Finally, a tool where both designers and AI agents can work together seamlessly.',
    rating: 5,
  },
  {
    name: 'Emma Wilson',
    role: 'Product Manager',
    quote: 'We shipped our marketing site in half the time. The component library is incredible.',
    rating: 4,
  },
]

function renderTestimonials(block: BlockConfig): string {
  const title = escapeHtml(
    prop(block.props, 'title', 'What people say')
  )
  const subtitle = prop<string>(block.props, 'subtitle', '')
  const items = prop<TestimonialItem[]>(block.props, 'items', defaultTestimonials)

  const subtitleHtml = subtitle
    ? `        <p class="text-text-2 text-sm max-w-lg mx-auto">${escapeHtml(subtitle)}</p>`
    : ''

  const cards = items
    .map((item) => {
      const ratingHtml = item.rating ? `          ${starRatingHtml(item.rating)}` : ''
      return `        <div class="bg-bg-2 border border-border-default rounded-xl p-5 transition-all hover:border-border-hover">
          <span class="text-green/30 block mb-3">${SVG_QUOTE}</span>
          <p class="text-[13px] text-text-1 leading-relaxed mb-4 italic">"${escapeHtml(item.quote)}"</p>
${ratingHtml}
          <div class="flex items-center gap-3 mt-4 pt-4 border-t border-border-subtle">
            ${item.avatar ? `<img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.name)}" class="w-9 h-9 rounded-full object-cover border border-border-default" />` : `<div class="w-9 h-9 rounded-full bg-bg-4 border border-border-default flex items-center justify-center text-[11px] font-semibold text-text-2">${initials(item.name)}</div>`}
            <div>
              <div class="text-[12.5px] font-semibold">${escapeHtml(item.name)}</div>
              <div class="text-[11px] text-text-3">${escapeHtml(item.role)}</div>
            </div>
          </div>
        </div>`
    })
    .join('\n')

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
${cards}
      </div>
  </section>`
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

interface StatItem {
  value: string
  label: string
}

const defaultStats: StatItem[] = [
  { value: '10K+', label: 'Sites built' },
  { value: '99.9%', label: 'Uptime' },
  { value: '50ms', label: 'Avg. response' },
  { value: '4.9/5', label: 'User rating' },
]

function renderStatsGrid(block: BlockConfig): string {
  const title = prop<string>(block.props, 'title', '')
  const items = prop<StatItem[]>(block.props, 'items', defaultStats)

  const titleHtml = title
    ? `      <h2 class="text-xl font-bold tracking-tight text-center mb-8">${escapeHtml(title)}</h2>`
    : ''

  const cards = items
    .map(
      (item) => `        <div class="text-center p-4 rounded-xl bg-bg-2 border border-border-default">
          <div class="text-3xl md:text-4xl font-bold tracking-tight text-green mb-1">${escapeHtml(item.value)}</div>
          <div class="text-[12px] text-text-2 font-medium">${escapeHtml(item.label)}</div>
        </div>`
    )
    .join('\n')

  return `  <section class="px-6 md:px-10 py-12 md:py-16">
${titleHtml}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
${cards}
      </div>
  </section>`
}

function renderStatsBar(block: BlockConfig): string {
  const items = prop<StatItem[]>(block.props, 'items', defaultStats)

  const statsHtml = items
    .map(
      (item) => `          <div class="text-center">
            <div class="text-2xl md:text-3xl font-bold tracking-tight text-text-0 mb-0.5">${escapeHtml(item.value)}</div>
            <div class="text-[11px] text-text-3 font-medium uppercase tracking-wider">${escapeHtml(item.label)}</div>
          </div>`
    )
    .join('\n')

  return `  <section class="px-6 md:px-10 py-10">
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12 py-6 px-4 rounded-xl bg-bg-2 border border-border-default">
${statsHtml}
      </div>
  </section>`
}

function renderStats(block: BlockConfig): string {
  switch (block.variant) {
    case 'bar':
      return renderStatsBar(block)
    default:
      return renderStatsGrid(block)
  }
}

// ---------------------------------------------------------------------------
// FAQ (with inline JS for accordion toggle)
// ---------------------------------------------------------------------------

interface FaqItem {
  question: string
  answer: string
}

const defaultFaqs: FaqItem[] = [
  {
    question: 'What is OpenPage?',
    answer:
      'OpenPage is a visual website builder that uses structured JSON config as the source of truth. Both humans and AI agents can edit the same config to build beautiful websites.',
  },
  {
    question: 'How does the JSON config work?',
    answer:
      'Every website is represented as a JSON document with blocks, styles, and content. The visual editor reads and writes this JSON, and agents can make surgical edits via the API.',
  },
  {
    question: 'Can I use my own components?',
    answer:
      'Yes! OpenPage supports custom components. You can build your own blocks following our component schema and register them in the block registry.',
  },
  {
    question: 'Is it free to use?',
    answer:
      'OpenPage offers a free tier for personal projects with up to 5 blocks. Pro and Team plans unlock unlimited blocks, custom domains, and priority support.',
  },
]

function renderFaq(block: BlockConfig): string {
  const title = escapeHtml(
    prop(block.props, 'title', 'Frequently Asked Questions')
  )
  const subtitle = prop<string>(block.props, 'subtitle', '')
  const items = prop<FaqItem[]>(block.props, 'items', defaultFaqs)

  const subtitleHtml = subtitle
    ? `        <p class="text-text-2 text-sm max-w-lg mx-auto">${escapeHtml(subtitle)}</p>`
    : ''

  const accordionItems = items
    .map(
      (item, i) => `        <div class="border-b border-border-subtle">
          <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between py-4 text-left group" aria-expanded="${i === 0 ? 'true' : 'false'}">
            <span class="text-[13.5px] font-medium text-text-0 group-hover:text-green transition-colors">${escapeHtml(item.question)}</span>
            <span class="faq-chevron text-text-3 shrink-0 ml-4 transition-transform duration-200${i === 0 ? ' rotate-180 text-green' : ''}">${SVG_CHEVRON_DOWN}</span>
          </button>
          <div class="faq-content overflow-hidden transition-all duration-200${i === 0 ? ' max-h-[500px] pb-4' : ' max-h-0'}">
            <p class="text-[12.5px] text-text-2 leading-relaxed pr-8">${escapeHtml(item.answer)}</p>
          </div>
        </div>`
    )
    .join('\n')

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
      </div>
      <div class="max-w-2xl mx-auto">
${accordionItems}
      </div>
  </section>`
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

interface TeamMember {
  name: string
  role: string
  avatar?: string
}

const defaultMembers: TeamMember[] = [
  { name: 'Alex Rivera', role: 'CEO & Founder' },
  { name: 'Jordan Lee', role: 'CTO' },
  { name: 'Sam Patel', role: 'Head of Design' },
  { name: 'Casey Morgan', role: 'Lead Engineer' },
]

function renderTeam(block: BlockConfig): string {
  const title = escapeHtml(prop(block.props, 'title', 'Meet the Team'))
  const subtitle = prop<string>(block.props, 'subtitle', '')
  const members = prop<TeamMember[]>(block.props, 'members', defaultMembers)

  const subtitleHtml = subtitle
    ? `        <p class="text-text-2 text-sm max-w-lg mx-auto">${escapeHtml(subtitle)}</p>`
    : ''

  const cards = members
    .map(
      (m) => `        <div class="text-center group">
          ${m.avatar ? `<img src="${escapeHtml(m.avatar)}" alt="${escapeHtml(m.name)}" class="w-20 h-20 mx-auto rounded-full object-cover border-2 border-border-default mb-3 transition-all group-hover:border-green/30" />` : `<div class="w-20 h-20 mx-auto rounded-full bg-bg-3 border-2 border-border-default flex items-center justify-center text-xl font-bold text-text-3 mb-3 transition-all group-hover:border-green/30">${initials(m.name)}</div>`}
          <h3 class="text-sm font-semibold">${escapeHtml(m.name)}</h3>
          <p class="text-[11px] text-text-3 mt-0.5">${escapeHtml(m.role)}</p>
        </div>`
    )
    .join('\n')

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
${cards}
      </div>
  </section>`
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

function renderContact(block: BlockConfig): string {
  const title = escapeHtml(prop(block.props, 'title', 'Get in Touch'))
  const subtitle = prop<string>(block.props, 'subtitle', '')

  const subtitleHtml = subtitle
    ? `          <p class="text-text-2 text-sm">${escapeHtml(subtitle)}</p>`
    : ''

  return `  <section class="px-6 md:px-10 py-16 md:py-20">
      <div class="max-w-lg mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">${title}</h2>
${subtitleHtml}
        </div>
        <form onsubmit="return false" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11.5px] text-text-2 mb-1.5 font-medium">Name</label>
              <input type="text" placeholder="Your name" class="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3 transition-colors" />
            </div>
            <div>
              <label class="block text-[11.5px] text-text-2 mb-1.5 font-medium">Email</label>
              <input type="email" placeholder="you@example.com" class="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3 transition-colors" />
            </div>
          </div>
          <div>
            <label class="block text-[11.5px] text-text-2 mb-1.5 font-medium">Message</label>
            <textarea rows="4" placeholder="How can we help?" class="w-full px-3 py-2.5 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3 resize-y transition-colors"></textarea>
          </div>
          <button type="submit" class="w-full py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all flex items-center justify-center gap-2">
            ${SVG_SEND}
            Send Message
          </button>
        </form>
      </div>
  </section>`
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

function renderNewsletter(block: BlockConfig): string {
  const title = escapeHtml(
    prop(block.props, 'title', 'Stay in the loop')
  )
  const subtitle = escapeHtml(
    prop(
      block.props,
      'subtitle',
      'Get updates on new features and releases. No spam, ever.'
    )
  )
  const buttonText = escapeHtml(
    prop(block.props, 'buttonText', 'Subscribe')
  )
  const socialProof = prop<string>(block.props, 'socialProof', '')

  const proofText = socialProof
    ? escapeHtml(socialProof)
    : 'Join 2,000+ developers and designers'

  return `  <section class="px-6 md:px-10 py-12 md:py-16">
      <div class="max-w-xl mx-auto text-center">
        <div class="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mx-auto mb-4">
          ${SVG_MAIL}
        </div>
        <h2 class="text-xl md:text-2xl font-bold tracking-tight mb-2">${title}</h2>
        <p class="text-text-2 text-sm mb-6">${subtitle}</p>
        <form onsubmit="return false" class="flex gap-2 max-w-sm mx-auto">
          <input type="email" placeholder="you@example.com" class="flex-1 px-4 py-2.5 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3 transition-colors" />
          <button type="submit" class="px-5 py-2.5 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all shrink-0">${buttonText}</button>
        </form>
        <p class="text-[11px] text-text-3 mt-3">${proofText}</p>
      </div>
  </section>`
}

// ---------------------------------------------------------------------------
// Logo Cloud
// ---------------------------------------------------------------------------

function renderLogoCloud(block: BlockConfig): string {
  const title = escapeHtml(
    prop(block.props, 'title', 'Trusted by teams at')
  )
  const logos = prop<string[]>(block.props, 'logos', [
    'Vercel',
    'Stripe',
    'GitHub',
    'Figma',
    'Notion',
    'Linear',
  ])

  const logosHtml = logos
    .map(
      (name) => `        <div class="group cursor-pointer transition-all">
          <div class="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-all group-hover:scale-105">
            <span class="text-text-3 group-hover:text-green transition-colors">${logoPlaceholderSvg(name)}</span>
            <span class="text-sm font-semibold text-text-3 group-hover:text-text-0 tracking-tight transition-colors">${escapeHtml(name)}</span>
          </div>
        </div>`
    )
    .join('\n')

  return `  <section class="px-6 md:px-10 py-10 md:py-14">
      <p class="text-center text-[11px] font-medium uppercase tracking-widest text-text-3 mb-6">${title}</p>
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12">
${logosHtml}
      </div>
  </section>`
}

// ---------------------------------------------------------------------------
// Block dispatcher
// ---------------------------------------------------------------------------

function renderBlock(block: BlockConfig): string {
  switch (block.type) {
    case 'navbar':
      return renderNavbar(block)
    case 'hero':
      return renderHero(block)
    case 'features':
      return renderFeatures(block)
    case 'pricing':
      return renderPricing(block)
    case 'cta':
      return renderCta(block)
    case 'footer':
      return renderFooter(block)
    case 'testimonials':
      return renderTestimonials(block)
    case 'stats':
      return renderStats(block)
    case 'faq':
      return renderFaq(block)
    case 'team':
      return renderTeam(block)
    case 'contact':
      return renderContact(block)
    case 'newsletter':
      return renderNewsletter(block)
    case 'logocloud':
      return renderLogoCloud(block)
    default:
      return `  <!-- Unknown block type: ${escapeHtml(block.type)} -->`
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function exportSiteToHTML(config: SiteConfig, options?: ExportSiteOptions): string {
  const theme = resolveTheme(config.theme)
  const fonts = [theme.fontSans, theme.fontDisplay, theme.fontMono]
  const fontUrl = googleFontUrl(fonts)
  const settings = options?.settings

  const hasFaq = config.blocks.some((b) => b.type === 'faq')

  const blocksHtml = config.blocks.map((b) => renderBlock(b)).join('\n\n')

  const pageTitle = (settings?.seoTitle || settings?.siteName || config.name || 'Website').trim()
  const pageDescription = (settings?.seoDescription || settings?.siteDescription || '').trim()
  const ogTitle = (settings?.seoTitle || settings?.siteName || pageTitle).trim()
  const ogDescription = (settings?.seoDescription || settings?.siteDescription || pageDescription).trim()
  const ogImage = (settings?.ogImageUrl || '').trim()
  const faviconUrl = (settings?.faviconUrl || '').trim()
  const gaId = (settings?.gaId || '').trim()
  const posthogKey = (settings?.posthogKey || '').trim()
  const lang = normalizeLanguage(settings?.language)

  const descriptionMeta = pageDescription
    ? `  <meta name="description" content="${escapeHtml(pageDescription)}" />\n`
    : ''
  const ogDescriptionMeta = ogDescription
    ? `  <meta property="og:description" content="${escapeHtml(ogDescription)}" />\n`
    : ''
  const ogImageMeta = ogImage
    ? `  <meta property="og:image" content="${escapeHtml(ogImage)}" />\n`
    : ''
  const faviconLink = faviconUrl
    ? `  <link rel="icon" href="${escapeHtml(faviconUrl)}" />\n`
    : ''

  const gaScript = gaId
    ? `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ${JSON.stringify(gaId)});
  </script>`
    : ''

  const posthogScript = posthogKey
    ? `
  <script>
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");
    2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
    (p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",
    (r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",
    u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},
    u.people.toString=function(){return u.toString(1)+".people"},o="init capture register register_once alias unregister identify set_config reset opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing".split(" "),
    n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init(${JSON.stringify(posthogKey)}, { api_host: 'https://us.i.posthog.com' });
  </script>`
    : ''

  const faqScript = hasFaq
    ? `
    <script>
      function toggleFaq(btn) {
        var content = btn.nextElementSibling;
        var chevron = btn.querySelector('.faq-chevron');
        var isOpen = btn.getAttribute('aria-expanded') === 'true';

        // Close all
        var items = btn.closest('section').querySelectorAll('[aria-expanded]');
        items.forEach(function(b) {
          b.setAttribute('aria-expanded', 'false');
          b.nextElementSibling.style.maxHeight = '0';
          b.nextElementSibling.style.paddingBottom = '0';
          var c = b.querySelector('.faq-chevron');
          if (c) { c.style.transform = ''; c.classList.remove('text-green'); c.classList.add('text-text-3'); }
        });

        // Toggle current
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = '500px';
          content.style.paddingBottom = '1rem';
          if (chevron) { chevron.style.transform = 'rotate(180deg)'; chevron.classList.add('text-green'); chevron.classList.remove('text-text-3'); }
        }
      }
    </script>`
    : ''

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
${descriptionMeta}  <meta property="og:title" content="${escapeHtml(ogTitle)}" />
${ogDescriptionMeta}${ogImageMeta}${faviconLink}

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${fontUrl}" />

  <!-- Tailwind CSS (Play CDN) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'bg-0': '${theme.bg0}',
            'bg-1': '${theme.bg1}',
            'bg-2': '${theme.bg2}',
            'bg-3': '${theme.bg3}',
            'bg-4': '${theme.bg4}',
            'bg-5': '${theme.bg5}',
            'text-0': '${theme.text0}',
            'text-1': '${theme.text1}',
            'text-2': '${theme.text2}',
            'text-3': '${theme.text3}',
            'green': {
              DEFAULT: '${theme.accent}',
              dim: '${theme.accentDim}',
            },
            'border-default': '${theme.borderDefault}',
            'border-subtle': '${theme.borderSubtle}',
            'border-hover': '${theme.borderHover}',
          },
          fontFamily: {
            sans: ['"${theme.fontSans}"', '-apple-system', 'system-ui', 'sans-serif'],
            display: ['"${theme.fontDisplay}"', 'system-ui', 'sans-serif'],
            mono: ['"${theme.fontMono}"', 'ui-monospace', 'monospace'],
          },
          borderRadius: {
            DEFAULT: '${theme.radius}px',
            lg: '${theme.radiusLg}px',
          },
        },
      },
    }
  </script>

  <!-- Theme CSS Custom Properties -->
  <style>
    :root {
      --color-bg-0: ${theme.bg0};
      --color-bg-1: ${theme.bg1};
      --color-bg-2: ${theme.bg2};
      --color-bg-3: ${theme.bg3};
      --color-bg-4: ${theme.bg4};
      --color-bg-5: ${theme.bg5};
      --color-text-0: ${theme.text0};
      --color-text-1: ${theme.text1};
      --color-text-2: ${theme.text2};
      --color-text-3: ${theme.text3};
      --color-green: ${theme.accent};
      --color-green-dim: ${theme.accentDim};
      --color-border-default: ${theme.borderDefault};
      --color-border-subtle: ${theme.borderSubtle};
      --color-border-hover: ${theme.borderHover};
      --font-sans: "${theme.fontSans}", -apple-system, system-ui, sans-serif;
      --font-display: "${theme.fontDisplay}", system-ui, sans-serif;
      --font-mono: "${theme.fontMono}", ui-monospace, monospace;
      --radius-default: ${theme.radius}px;
      --radius-lg: ${theme.radiusLg}px;
    }

    *, *::before, *::after { box-sizing: border-box; }

    body {
      margin: 0;
      background-color: ${theme.bg0};
      color: ${theme.text0};
      font-family: "${theme.fontSans}", -apple-system, system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: "${theme.fontDisplay}", system-ui, sans-serif;
    }

    .faq-content {
      transition: max-height 0.2s ease, padding-bottom 0.2s ease;
    }

    .faq-chevron {
      transition: transform 0.2s ease;
    }
  </style>
${gaScript}
${posthogScript}
</head>
<body>

${blocksHtml}
${faqScript}
</body>
</html>`
}

export async function exportToHTML(
  config: SiteConfig,
  options?: ExportSiteOptions
): Promise<string> {
  return exportSiteToHTML(config, options)
}

export function downloadHTML(html: string, filename: string): void {
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

export function previewHTML(html: string): void {
  const previewWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!previewWindow) {
    throw new Error('Preview popup was blocked')
  }
  previewWindow.document.open()
  previewWindow.document.write(html)
  previewWindow.document.close()
}

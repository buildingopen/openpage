import type { SiteConfig } from '@/blocks/types'
import { themePresets } from './theme-presets'

interface Template {
  keywords: string[]
  themePresetId: string
  build: (name: string) => SiteConfig
}

function getTheme(id: string) {
  return themePresets.find((p) => p.id === id)?.theme
}

const templates: Template[] = [
  {
    keywords: ['portfolio', 'personal', 'resume', 'freelance', 'designer', 'developer'],
    themePresetId: 'slate',
    build: (name) => ({
      name,
      theme: getTheme('slate'),
      blocks: [
        { id: 'block-navbar-1', type: 'navbar', variant: 'default', props: { logo: name, links: ['Work', 'About', 'Contact'], ctaText: 'Hire Me' } },
        { id: 'block-hero-1', type: 'hero', variant: 'minimal', props: { headline: `Hi, I'm ${name}`, subheadline: 'I design and build digital experiences that make a difference.', primaryCta: 'View My Work' } },
        { id: 'block-gallery-1', type: 'gallery', variant: 'grid', props: { title: 'Selected Work' } },
        { id: 'block-stats-1', type: 'stats', variant: 'counter', props: { title: 'By the Numbers', items: [{ value: '50+', label: 'Projects completed' }, { value: '8', label: 'Years experience' }, { value: '30+', label: 'Happy clients' }, { value: '5', label: 'Awards won' }] } },
        { id: 'block-testimonials-1', type: 'testimonials', variant: 'spotlight', props: { title: 'Client Feedback', items: [{ name: 'Alex Rivera', role: 'CEO at Startup', quote: 'Exceptional work. Delivered on time with incredible attention to detail.', rating: 5 }] } },
        { id: 'block-contact-1', type: 'contact', variant: 'form', props: { title: 'Get in Touch', subtitle: "Have a project in mind? Let's talk." } },
        { id: 'block-footer-1', type: 'footer', variant: 'minimal', props: { logo: name, copyright: `2026 ${name}. All rights reserved.`, links: ['LinkedIn', 'GitHub', 'Twitter'] } },
      ],
    }),
  },
  {
    keywords: ['restaurant', 'food', 'cafe', 'bakery', 'bar', 'bistro', 'pizza', 'sushi', 'kitchen'],
    themePresetId: 'amber',
    build: (name) => ({
      name,
      theme: getTheme('amber'),
      blocks: [
        { id: 'block-navbar-1', type: 'navbar', variant: 'centered', props: { logo: name, links: ['Menu', 'About', 'Reservations', 'Gallery'], ctaText: 'Book a Table' } },
        { id: 'block-hero-1', type: 'hero', variant: 'gradient', props: { headline: `Welcome to ${name}`, subheadline: 'Fresh ingredients, bold flavors, unforgettable dining experiences.', primaryCta: 'View Menu', secondaryCta: 'Make a Reservation' } },
        { id: 'block-features-1', type: 'features', variant: 'list', props: { title: 'Why Choose Us', items: [{ icon: 'Star', title: 'Farm to Table', description: 'We source locally from sustainable farms.' }, { icon: 'Globe', title: 'World Cuisine', description: 'Inspired by flavors from around the globe.' }, { icon: 'Zap', title: 'Fresh Daily', description: 'Our menu changes with the seasons.' }] } },
        { id: 'block-gallery-1', type: 'gallery', variant: 'masonry', props: { title: 'From Our Kitchen' } },
        { id: 'block-testimonials-1', type: 'testimonials', variant: 'spotlight', props: { items: [{ name: 'Maria Garcia', role: 'Food Critic', quote: 'A culinary gem. Every dish is a masterpiece of flavor and presentation.', rating: 5 }] } },
        { id: 'block-cta-1', type: 'cta', variant: 'simple', props: { headline: 'Reserve Your Table', subheadline: 'Open Tuesday through Sunday, 5pm to 11pm.', buttonText: 'Book Now' } },
        { id: 'block-footer-1', type: 'footer', variant: 'multi-column', props: { logo: name, copyright: `2026 ${name}. All rights reserved.`, links: ['Menu', 'Reservations', 'Privacy'] } },
      ],
    }),
  },
  {
    keywords: ['agency', 'studio', 'consulting', 'firm', 'digital', 'creative', 'marketing'],
    themePresetId: 'clean',
    build: (name) => ({
      name,
      theme: getTheme('clean'),
      blocks: [
        { id: 'block-navbar-1', type: 'navbar', variant: 'centered', props: { logo: name, links: ['Services', 'Work', 'About', 'Contact'], ctaText: 'Get a Quote' } },
        { id: 'block-hero-1', type: 'hero', variant: 'split', props: { badge: 'Award-Winning Agency', headline: 'We build brands that matter', subheadline: 'Strategy, design, and technology working together to drive real results.', primaryCta: 'Start a Project', secondaryCta: 'Our Work' } },
        { id: 'block-logocloud-1', type: 'logocloud', variant: 'default', props: { title: 'Trusted by Industry Leaders' } },
        { id: 'block-features-1', type: 'features', variant: 'alternating', props: { label: 'Services', title: 'What We Do', subtitle: 'End-to-end digital solutions', items: [{ icon: 'Palette', title: 'Brand Strategy', description: 'We craft brand identities that resonate with your audience and stand the test of time.' }, { icon: 'Code', title: 'Web Development', description: 'Modern, performant websites built with the latest technologies.' }, { icon: 'Rocket', title: 'Growth Marketing', description: 'Data-driven campaigns that deliver measurable results.' }] } },
        { id: 'block-stats-1', type: 'stats', variant: 'counter', props: { items: [{ value: '200+', label: 'Projects delivered' }, { value: '95%', label: 'Client retention' }, { value: '12', label: 'Team members' }, { value: '8', label: 'Years in business' }] } },
        { id: 'block-testimonials-1', type: 'testimonials', variant: 'cards', props: { title: 'What Clients Say', items: [{ name: 'James Park', role: 'VP Marketing, TechCo', quote: 'They transformed our entire digital presence. ROI exceeded expectations by 3x.', rating: 5 }, { name: 'Lisa Chen', role: 'Founder, StartupXYZ', quote: 'Professional, creative, and incredibly responsive. Our go-to agency.', rating: 5 }, { name: 'David Kim', role: 'CMO, Enterprise Inc', quote: 'The strategic thinking behind their work sets them apart from other agencies.', rating: 5 }] } },
        { id: 'block-cta-1', type: 'cta', variant: 'split', props: { headline: "Let's build something great together", subheadline: 'Schedule a free consultation to discuss your next project.', buttonText: 'Get Started' } },
        { id: 'block-footer-1', type: 'footer', variant: 'multi-column', props: { logo: name, copyright: `2026 ${name}. All rights reserved.`, links: ['Services', 'Work', 'Blog', 'Careers', 'Privacy', 'Terms'] } },
      ],
    }),
  },
  {
    keywords: ['blog', 'newsletter', 'magazine', 'journal', 'publication', 'writer', 'author'],
    themePresetId: 'ivory',
    build: (name) => ({
      name,
      theme: getTheme('ivory'),
      blocks: [
        { id: 'block-navbar-1', type: 'navbar', variant: 'default', props: { logo: name, links: ['Articles', 'Topics', 'About'], ctaText: 'Subscribe' } },
        { id: 'block-hero-1', type: 'hero', variant: 'minimal', props: { headline: name, subheadline: 'Thoughtful writing on technology, design, and the future of work.', primaryCta: 'Start Reading' } },
        { id: 'block-content-1', type: 'content', variant: 'columns', props: { body: '## Latest Thinking\n\nExploring ideas at the intersection of technology and humanity. From AI ethics to sustainable design, we cover what matters.\n\n## Featured Topics\n\n- **Technology** - The tools shaping our future\n- **Design** - Making things beautiful and useful\n- **Culture** - How work and life are evolving' } },
        { id: 'block-divider-1', type: 'divider', variant: 'dots', props: { height: 40 } },
        { id: 'block-newsletter-1', type: 'newsletter', variant: 'simple', props: { title: 'Join 5,000+ readers', subtitle: 'Get weekly insights delivered to your inbox. No spam, ever.', buttonText: 'Subscribe Free' } },
        { id: 'block-faq-1', type: 'faq', variant: 'accordion', props: { title: 'Frequently Asked Questions', items: [{ question: 'How often do you publish?', answer: 'We publish 2-3 articles per week, plus a weekly newsletter digest.' }, { question: 'Can I contribute?', answer: 'Yes! We welcome guest contributions from thoughtful writers.' }, { question: 'Is it free?', answer: 'All articles are free. We offer a premium newsletter with deeper analysis.' }] } },
        { id: 'block-footer-1', type: 'footer', variant: 'simple', props: { logo: name, copyright: `2026 ${name}. All rights reserved.`, links: ['RSS', 'Twitter', 'Privacy'] } },
      ],
    }),
  },
  {
    // Default: SaaS landing page
    keywords: [],
    themePresetId: 'default',
    build: (name) => ({
      name,
      theme: getTheme('default'),
      blocks: [
        { id: 'block-navbar-1', type: 'navbar', variant: 'default', props: { logo: name, links: ['Features', 'Pricing', 'About'], ctaText: 'Get Started' } },
        { id: 'block-hero-1', type: 'hero', variant: 'centered', props: { badge: 'Now in Beta', headline: `${name} - Build Better, Ship Faster`, subheadline: 'The all-in-one platform that helps teams move from idea to production in record time.', primaryCta: 'Start Free Trial', secondaryCta: 'Watch Demo' } },
        { id: 'block-logocloud-1', type: 'logocloud', variant: 'default', props: { title: 'Trusted by innovative teams' } },
        { id: 'block-features-1', type: 'features', variant: 'grid', props: { label: 'Features', title: 'Everything you need', subtitle: 'Powerful tools that grow with your team', items: [{ icon: 'Zap', title: 'Lightning Fast', description: 'Sub-100ms response times. Your team never waits.' }, { icon: 'Shield', title: 'Enterprise Security', description: 'SOC 2 compliant with end-to-end encryption.' }, { icon: 'Globe', title: 'Global Scale', description: 'Deploy to 30+ regions worldwide.' }, { icon: 'Bot', title: 'AI-Powered', description: 'Smart automation that learns your workflow.' }, { icon: 'Layers', title: 'Integrations', description: '200+ integrations with your favorite tools.' }, { icon: 'Rocket', title: 'Fast Setup', description: 'Go from signup to production in under 5 minutes.' }] } },
        { id: 'block-pricing-1', type: 'pricing', variant: 'simple', props: { title: 'Simple, transparent pricing', subtitle: 'No hidden fees. Cancel anytime.' } },
        { id: 'block-testimonials-1', type: 'testimonials', variant: 'cards', props: { title: 'Loved by developers', items: [{ name: 'Sarah Chen', role: 'CTO at TechCorp', quote: 'Cut our deployment time by 80%. The team productivity gains are incredible.', rating: 5 }, { name: 'Marcus Johnson', role: 'Lead Developer', quote: 'Best developer experience I have ever used. Period.', rating: 5 }, { name: 'Emma Wilson', role: 'Product Manager', quote: 'Finally, a tool the whole team can align on. Worth every penny.', rating: 5 }] } },
        { id: 'block-cta-1', type: 'cta', variant: 'simple', props: { headline: 'Ready to get started?', subheadline: 'Join thousands of teams shipping faster.', buttonText: 'Start Free Trial' } },
        { id: 'block-footer-1', type: 'footer', variant: 'multi-column', props: { logo: name, copyright: `2026 ${name}. All rights reserved.`, links: ['Features', 'Pricing', 'Docs', 'Blog', 'Privacy', 'Terms'] } },
      ],
    }),
  },
]

// Metadata for the 4 featured template cards on Dashboard
// icon: lucide-react icon name, mapped in rendering components
export const templateMeta = [
  { id: 'portfolio', name: 'Portfolio', description: 'Showcase your work and skills', accent: '#06b6d4', blockCount: 7, templateIndex: 0, icon: 'Briefcase' },
  { id: 'restaurant', name: 'Restaurant', description: 'Menu, reservations, and ambiance', accent: '#e8a838', blockCount: 7, templateIndex: 1, icon: 'UtensilsCrossed' },
  { id: 'agency', name: 'Agency', description: 'Services, case studies, and team', accent: '#228be6', blockCount: 8, templateIndex: 2, icon: 'Building2' },
  { id: 'blog', name: 'Blog', description: 'Articles, topics, and subscribers', accent: '#4f46e5', blockCount: 7, templateIndex: 3, icon: 'BookOpen' },
] as const

export function buildTemplate(id: string, name: string): SiteConfig {
  const meta = templateMeta.find((m) => m.id === id)
  if (!meta) return templates[templates.length - 1].build(name)
  return templates[meta.templateIndex].build(name)
}

function extractName(prompt: string): string {
  const words = prompt.split(/\s+/).slice(0, 4).join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export function getTemplateForPrompt(prompt: string): SiteConfig {
  const lower = prompt.toLowerCase()
  const name = extractName(prompt)

  // Find first template with a keyword match
  for (const template of templates) {
    if (template.keywords.length === 0) continue
    if (template.keywords.some((kw) => lower.includes(kw))) {
      return template.build(name)
    }
  }

  // Default: SaaS template (last in array)
  return templates[templates.length - 1].build(name)
}

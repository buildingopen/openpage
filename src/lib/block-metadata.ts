import type { BlockType } from '@/blocks/types'

export interface BlockMeta {
  type: BlockType
  label: string
  description: string
  category: string
  variants: string[]
  defaultProps: Record<string, unknown>
}

export const blockMetadata: BlockMeta[] = [
  {
    type: 'navbar',
    label: 'Navbar',
    description: 'Navigation bar with logo, links, and CTA',
    category: 'Navigation',
    variants: ['default'],
    defaultProps: { logo: 'Brand', links: ['Features', 'Pricing', 'About'], ctaText: 'Get Started' },
  },
  {
    type: 'hero',
    label: 'Hero',
    description: 'Full-width hero section with headline and CTAs',
    category: 'Hero',
    variants: ['centered', 'split', 'gradient'],
    defaultProps: { headline: 'Your Headline Here', subheadline: 'A compelling subheadline that explains your value proposition.', primaryCta: 'Get Started', secondaryCta: 'Learn More' },
  },
  {
    type: 'features',
    label: 'Features',
    description: 'Feature showcase with icon cards',
    category: 'Content',
    variants: ['grid', 'list'],
    defaultProps: { title: 'Features', subtitle: 'Everything you need', items: [{ icon: 'Zap', title: 'Fast', description: 'Lightning fast performance' }, { icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security' }, { icon: 'Globe', title: 'Global', description: 'Available worldwide' }] },
  },
  {
    type: 'pricing',
    label: 'Pricing',
    description: 'Pricing tiers with feature comparison',
    category: 'Commerce',
    variants: ['simple', 'comparison'],
    defaultProps: { title: 'Pricing', subtitle: 'Choose the plan that fits your needs' },
  },
  {
    type: 'cta',
    label: 'Call to Action',
    description: 'Conversion-focused section with CTA button',
    category: 'Conversion',
    variants: ['simple', 'split'],
    defaultProps: { headline: 'Ready to get started?', subheadline: 'Start building today.', buttonText: 'Start Free' },
  },
  {
    type: 'footer',
    label: 'Footer',
    description: 'Page footer with links and copyright',
    category: 'Navigation',
    variants: ['simple', 'multi-column', 'minimal'],
    defaultProps: { logo: 'Brand', copyright: '2026 Brand. All rights reserved.', links: ['Privacy', 'Terms'] },
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Customer testimonials with quotes and ratings',
    category: 'Social Proof',
    variants: ['cards', 'carousel'],
    defaultProps: { title: 'What our customers say' },
  },
  {
    type: 'stats',
    label: 'Stats',
    description: 'Key metrics and statistics display',
    category: 'Social Proof',
    variants: ['grid', 'bar'],
    defaultProps: { title: 'By the numbers' },
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions accordion',
    category: 'Content',
    variants: ['accordion'],
    defaultProps: { title: 'Frequently Asked Questions' },
  },
  {
    type: 'team',
    label: 'Team',
    description: 'Team member grid with photos and roles',
    category: 'Content',
    variants: ['grid'],
    defaultProps: { title: 'Meet the Team' },
  },
  {
    type: 'contact',
    label: 'Contact',
    description: 'Contact form with name, email, and message',
    category: 'Forms',
    variants: ['form'],
    defaultProps: { title: 'Get in Touch', subtitle: "We'd love to hear from you." },
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    description: 'Email subscription form with social proof',
    category: 'Conversion',
    variants: ['simple'],
    defaultProps: { title: 'Stay in the loop', subtitle: 'Get updates on new features.', buttonText: 'Subscribe' },
  },
  {
    type: 'logocloud',
    label: 'Logo Cloud',
    description: 'Company logos with hover effects',
    category: 'Social Proof',
    variants: ['default'],
    defaultProps: { title: 'Trusted by leading companies' },
  },
]

export const categories = [...new Set(blockMetadata.map((b) => b.category))]

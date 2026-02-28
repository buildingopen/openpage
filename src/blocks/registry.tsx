import type { BlockConfig } from './types'
import { Component, type ReactNode } from 'react'

import { NavbarBlock } from './navbar/NavbarBlock'
import { HeroBlock } from './hero/HeroBlock'
import { FeaturesBlock } from './features/FeaturesBlock'
import { PricingBlock } from './pricing/PricingBlock'
import { CtaBlock } from './cta/CtaBlock'
import { FooterBlock } from './footer/FooterBlock'
import { TestimonialsBlock } from './testimonials/TestimonialsBlock'
import { StatsBlock } from './stats/StatsBlock'
import { FaqBlock } from './faq/FaqBlock'
import { TeamBlock } from './team/TeamBlock'
import { ContactBlock } from './contact/ContactBlock'
import { NewsletterBlock } from './newsletter/NewsletterBlock'
import { LogoCloudBlock } from './logocloud/LogoCloudBlock'
import { DividerBlock } from './divider/DividerBlock'
import { BannerBlock } from './banner/BannerBlock'
import { ContentBlock } from './content/ContentBlock'
import { ImageBlock } from './image/ImageBlock'
import { VideoBlock } from './video/VideoBlock'
import { GalleryBlock } from './gallery/GalleryBlock'

// Error boundary for individual blocks
class BlockErrorBoundary extends Component<
  { blockType: string; children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="px-6 py-8 text-center border border-status-red/20 bg-status-red/5 rounded-lg mx-4 my-2">
          <p className="text-status-red text-sm font-medium mb-1">
            Failed to render {this.props.blockType} block
          </p>
          <p className="text-text-3 text-xs">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

// Fallback for unregistered block types
function PlaceholderBlock({ block }: { block: BlockConfig }) {
  return (
    <div className="px-9 py-7 text-center text-text-3 text-sm">
      {block.type} block (coming soon)
    </div>
  )
}

const blockRenderers: Record<string, React.ComponentType<{ block: BlockConfig }>> = {
  navbar: NavbarBlock,
  hero: HeroBlock,
  features: FeaturesBlock,
  pricing: PricingBlock,
  cta: CtaBlock,
  footer: FooterBlock,
  testimonials: TestimonialsBlock,
  stats: StatsBlock,
  faq: FaqBlock,
  team: TeamBlock,
  contact: ContactBlock,
  newsletter: NewsletterBlock,
  logocloud: LogoCloudBlock,
  divider: DividerBlock,
  banner: BannerBlock,
  content: ContentBlock,
  image: ImageBlock,
  video: VideoBlock,
  gallery: GalleryBlock,
}

export function renderBlock(block: BlockConfig): ReactNode {
  const Renderer = blockRenderers[block.type] || PlaceholderBlock
  return (
    <BlockErrorBoundary blockType={block.type}>
      <Renderer block={block} />
    </BlockErrorBoundary>
  )
}

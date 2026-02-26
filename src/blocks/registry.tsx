import type { BlockConfig, BlockType } from './types'
import type { ReactNode } from 'react'

import { NavbarBlock } from './navbar/NavbarBlock'
import { HeroBlock } from './hero/HeroBlock'
import { FeaturesBlock } from './features/FeaturesBlock'
import { PricingBlock } from './pricing/PricingBlock'
import { CtaBlock } from './cta/CtaBlock'
import { FooterBlock } from './footer/FooterBlock'

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
}

export function registerBlock(type: BlockType, component: React.ComponentType<{ block: BlockConfig }>) {
  blockRenderers[type] = component
}

export function renderBlock(block: BlockConfig): ReactNode {
  const Renderer = blockRenderers[block.type] || PlaceholderBlock
  return <Renderer block={block} />
}

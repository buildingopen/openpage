import type { BlockConfig } from '../types'
import { Menu } from 'lucide-react'

interface NavbarProps {
  logo: string
  links: string[]
  ctaText: string
}

export function NavbarBlock({ block }: { block: BlockConfig }) {
  const { logo, links = [], ctaText } = block.props as unknown as NavbarProps

  return (
    <nav className="px-6 @md:px-10 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-green" />
        </div>
        <span className="font-semibold text-[15px] text-text-0 tracking-tight">{logo}</span>
      </div>

      {/* Desktop nav links */}
      <div className="hidden @2xl:flex items-center gap-6">
        {links.map((link, i) => (
          <span
            key={i}
            className="text-[13px] text-text-2 hover:text-text-0 transition-colors cursor-pointer"
          >
            {link}
          </span>
        ))}
      </div>

      {/* CTA + mobile menu */}
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-lg bg-green text-black text-[13px] font-semibold hover:bg-green-dim transition-colors">
          {ctaText}
        </button>
        <button className="@2xl:hidden w-9 h-9 rounded-lg border border-border-default flex items-center justify-center text-text-2 hover:text-text-0 hover:bg-bg-3 transition-colors">
          <Menu size={16} />
        </button>
      </div>
    </nav>
  )
}

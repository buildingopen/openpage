import { ArrowRight } from 'lucide-react'
import type { BlockConfig } from '../types'

export function BannerBlock({ block }: { block: BlockConfig }) {
  const { variant, props } = block
  const text = (props.text as string) || 'Announcement'
  const linkText = props.linkText as string | undefined
  const linkUrl = (props.linkUrl as string) || '#'

  if (variant === 'bar') {
    return (
      <div className="px-6 py-3 @lg:px-9">
        <div className="reveal-fade-up reveal-d1 flex items-center justify-between gap-4 px-5 py-3.5 rounded-lg border border-border-default bg-bg-2">
          <span className="text-[13px] text-text-1">{text}</span>
          {linkText && (
            <a href={linkUrl} className="text-[13px] font-medium text-green hover:text-green-dim transition-colors flex items-center gap-1 shrink-0">
              {linkText}
              <ArrowRight size={13} />
            </a>
          )}
        </div>
      </div>
    )
  }

  // ribbon (default)
  return (
    <div className="reveal-fade-up reveal-d1 flex items-center justify-center gap-3 px-4 py-2.5 bg-green/10 border-b border-green/20">
      <span className="text-[12.5px] text-text-0 font-medium">{text}</span>
      {linkText && (
        <a href={linkUrl} className="text-[12.5px] font-semibold text-green hover:text-green-dim transition-colors flex items-center gap-1">
          {linkText}
          <ArrowRight size={12} />
        </a>
      )}
    </div>
  )
}

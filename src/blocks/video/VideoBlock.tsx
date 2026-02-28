import { Play } from 'lucide-react'
import type { BlockConfig } from '../types'

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/)
  return match?.[1] || null
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match?.[1] || null
}

function Placeholder() {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-bg-3 to-bg-4 rounded-lg flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-bg-5/50 border border-border-default flex items-center justify-center">
        <Play size={24} className="text-text-3 ml-0.5" />
      </div>
    </div>
  )
}

export function VideoBlock({ block }: { block: BlockConfig }) {
  const { variant, props } = block
  const url = (props.url as string) || ''
  const title = props.title as string | undefined

  let embedUrl: string | null = null

  if (variant === 'vimeo') {
    const id = extractVimeoId(url)
    if (id) embedUrl = `https://player.vimeo.com/video/${id}`
  } else {
    // youtube (default)
    const id = extractYouTubeId(url)
    if (id) embedUrl = `https://www.youtube-nocookie.com/embed/${id}`
  }

  return (
    <div className="px-6 py-12 @lg:px-16 @lg:py-16">
      {title && <h2 className="reveal-fade-up reveal-d1 text-xl font-display font-semibold mb-4 text-center">{title}</h2>}
      {embedUrl ? (
        <div className="reveal-scale reveal-d2 w-full aspect-video rounded-lg overflow-hidden border border-border-default">
          <iframe
            src={embedUrl}
            title={title || 'Video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <Placeholder />
      )}
    </div>
  )
}

import { ImageIcon } from 'lucide-react'
import type { BlockConfig } from '../types'

interface GalleryImage {
  src?: string
  alt?: string
  caption?: string
}

const defaultImages: GalleryImage[] = [
  { alt: 'Image 1' }, { alt: 'Image 2' }, { alt: 'Image 3' },
  { alt: 'Image 4' }, { alt: 'Image 5' }, { alt: 'Image 6' },
]

function ImageCard({ image, tall }: { image: GalleryImage; tall?: boolean }) {
  return (
    <div className={`rounded-lg overflow-hidden border border-border-default group ${tall ? 'row-span-2' : ''}`}>
      {image.src ? (
        <img src={image.src} alt={image.alt || ''} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full min-h-[140px] bg-gradient-to-br from-bg-3 to-bg-4 flex items-center justify-center">
          <ImageIcon size={24} className="text-text-3" />
        </div>
      )}
      {image.caption && (
        <div className="px-3 py-2 bg-bg-2 text-[11px] text-text-2">{image.caption}</div>
      )}
    </div>
  )
}

export function GalleryBlock({ block }: { block: BlockConfig }) {
  const { variant, props } = block
  const title = props.title as string | undefined
  const images = ((props.images as GalleryImage[]) || []).length > 0
    ? (props.images as GalleryImage[])
    : defaultImages

  if (variant === 'masonry') {
    return (
      <div className="px-6 py-12 @lg:px-16 @lg:py-16">
        {title && <h2 className="reveal-fade-up reveal-d1 text-2xl font-display font-semibold mb-6 text-center">{title}</h2>}
        <div className="grid grid-cols-2 @lg:grid-cols-3 auto-rows-[160px] gap-3">
          {images.map((img, i) => (
            <div key={i} className={`reveal-scale reveal-d${Math.min(i + 2, 8)}`}>
              <ImageCard image={img} tall={i % 3 === 0} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // grid (default)
  return (
    <div className="px-6 py-12 @lg:px-16 @lg:py-16">
      {title && <h2 className="reveal-fade-up reveal-d1 text-2xl font-display font-semibold mb-6 text-center">{title}</h2>}
      <div className="grid grid-cols-2 @lg:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <div key={i} className={`reveal-scale reveal-d${Math.min(i + 2, 8)}`}>
            <ImageCard image={img} />
          </div>
        ))}
      </div>
    </div>
  )
}

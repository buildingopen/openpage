import { ImageIcon } from 'lucide-react'
import type { BlockConfig } from '../types'

function Placeholder({ className }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-bg-3 to-bg-4 flex items-center justify-center ${className || ''}`}>
      <ImageIcon size={32} className="text-text-3" />
    </div>
  )
}

export function ImageBlock({ block }: { block: BlockConfig }) {
  const { variant, props } = block
  const src = props.src as string | undefined
  const alt = (props.alt as string) || ''
  const title = props.title as string | undefined
  const subtitle = props.subtitle as string | undefined
  const imageSide = (props.imageSide as string) || 'left'
  const images = (props.images as { src?: string; alt?: string }[]) || []

  if (variant === 'side-by-side') {
    const imgEl = src
      ? <img src={src} alt={alt} className="w-full h-full object-cover rounded-lg" />
      : <Placeholder className="w-full h-64 @lg:h-80 rounded-lg" />

    return (
      <div className="px-6 py-12 @lg:px-16 @lg:py-16">
        <div className={`grid grid-cols-1 @lg:grid-cols-2 gap-8 @lg:gap-12 items-center ${imageSide === 'right' ? '' : ''}`}>
          <div className={`reveal-scale reveal-d1 ${imageSide === 'right' ? '@lg:order-2' : ''}`}>
            {imgEl}
          </div>
          <div className={`reveal-fade-up reveal-d2 ${imageSide === 'right' ? '@lg:order-1' : ''}`}>
            {title && <h2 className="text-2xl font-display font-semibold mb-3">{title}</h2>}
            {subtitle && <p className="text-text-1 leading-relaxed">{subtitle}</p>}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'grid') {
    const gridImages = images.length > 0
      ? images.slice(0, 4)
      : [{ src: undefined, alt: '1' }, { src: undefined, alt: '2' }, { src: undefined, alt: '3' }, { src: undefined, alt: '4' }]

    return (
      <div className="px-6 py-12 @lg:px-16 @lg:py-16">
        {title && <h2 className="reveal-fade-up reveal-d1 text-2xl font-display font-semibold mb-6 text-center">{title}</h2>}
        <div className="grid grid-cols-2 @lg:grid-cols-4 gap-3">
          {gridImages.map((img, i) => (
            <div key={i} className={`reveal-scale reveal-d${Math.min(i + 2, 8)} aspect-square rounded-lg overflow-hidden`}>
              {img.src
                ? <img src={img.src} alt={img.alt || ''} className="w-full h-full object-cover" />
                : <Placeholder className="w-full h-full" />
              }
            </div>
          ))}
        </div>
      </div>
    )
  }

  // hero-image (default)
  return (
    <div className="reveal-scale reveal-d1 relative">
      {src
        ? <img src={src} alt={alt} className="w-full h-64 @lg:h-96 object-cover" />
        : <Placeholder className="w-full h-64 @lg:h-96" />
      }
      {(title || subtitle) && (
        <div className="absolute inset-0 bg-gradient-to-t from-bg-0/80 to-transparent flex flex-col justify-end p-6 @lg:p-12">
          {title && <h2 className="reveal-fade-up reveal-d2 text-2xl @lg:text-3xl font-display font-bold mb-2">{title}</h2>}
          {subtitle && <p className="reveal-fade-up reveal-d3 text-text-1 text-sm @lg:text-base max-w-lg">{subtitle}</p>}
        </div>
      )}
    </div>
  )
}

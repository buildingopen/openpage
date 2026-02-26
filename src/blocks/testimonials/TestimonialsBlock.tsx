import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import type { BlockConfig } from '../types'

interface Testimonial {
  name: string
  role: string
  quote: string
  rating?: number
  avatar?: string
}

interface TestimonialsProps {
  title?: string
  subtitle?: string
  items?: Testimonial[]
}

const defaultTestimonials: Testimonial[] = [
  { name: 'Sarah Chen', role: 'CEO at TechCorp', quote: 'OpenPage completely changed how we build landing pages. The JSON config approach is genius.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Lead Developer', quote: 'Finally, a tool where both designers and AI agents can work together seamlessly.', rating: 5 },
  { name: 'Emma Wilson', role: 'Product Manager', quote: 'We shipped our marketing site in half the time. The component library is incredible.', rating: 4 },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? 'text-status-yellow fill-status-yellow' : 'text-text-3'}
        />
      ))}
    </div>
  )
}

function TestimonialsCards({ props }: { props: TestimonialsProps }) {
  const items = props.items || defaultTestimonials

  return (
    <section className="px-6 sm:px-10 py-16 sm:py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {props.title || 'What people say'}
        </h2>
        {props.subtitle && (
          <p className="text-text-2 text-sm max-w-lg mx-auto">{props.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-bg-2 border border-border-default rounded-xl p-5 transition-all hover:border-border-hover"
          >
            <Quote size={20} className="text-green/30 mb-3" />
            <p className="text-[13px] text-text-1 leading-relaxed mb-4 italic">
              "{item.quote}"
            </p>
            {item.rating && <StarRating rating={item.rating} />}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-subtle">
              <div className="w-9 h-9 rounded-full bg-bg-4 border border-border-default flex items-center justify-center text-[11px] font-semibold text-text-2">
                {item.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-[12.5px] font-semibold">{item.name}</div>
                <div className="text-[11px] text-text-3">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimonialsCarousel({ props }: { props: TestimonialsProps }) {
  const items = props.items || defaultTestimonials
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = (index: number) => {
    setActiveIndex(((index % items.length) + items.length) % items.length)
  }

  if (items.length === 0) return null
  const safeIndex = Math.min(activeIndex, items.length - 1)
  const item = items[safeIndex]

  return (
    <section className="px-6 sm:px-10 py-16 sm:py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {props.title || 'What people say'}
        </h2>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <Quote size={32} className="text-green/20 mx-auto mb-4" />
          <p className="text-lg text-text-0 leading-relaxed mb-4 italic">
            "{item.quote}"
          </p>
          {item.rating && (
            <div className="flex justify-center mb-4">
              <StarRating rating={item.rating} />
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bg-4 border border-border-default flex items-center justify-center text-xs font-semibold text-text-2">
              {item.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">{item.name}</div>
              <div className="text-[11px] text-text-3">{item.role}</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => goTo(safeIndex - 1)}
              className="w-8 h-8 rounded-full border border-border-default bg-bg-2 flex items-center justify-center text-text-2 hover:text-text-0 hover:border-border-hover transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === safeIndex ? 'bg-green' : 'bg-bg-4 hover:bg-bg-5'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(safeIndex + 1)}
              className="w-8 h-8 rounded-full border border-border-default bg-bg-2 flex items-center justify-center text-text-2 hover:text-text-0 hover:border-border-hover transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TestimonialsBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as TestimonialsProps

  switch (block.variant) {
    case 'carousel':
      return <TestimonialsCarousel props={props} />
    default:
      return <TestimonialsCards props={props} />
  }
}

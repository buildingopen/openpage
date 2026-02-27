import type { BlockConfig } from '../types'
import {
  Blocks, Code, Bot, Zap, Shield, Globe,
  Layers, Palette, Rocket, Star, Lock, Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FeatureItem {
  icon?: string
  title: string
  description: string
}

interface FeaturesProps {
  label?: string
  title: string
  subtitle?: string
  items: FeatureItem[]
}

const iconMap: Record<string, LucideIcon> = {
  Blocks, Code, Bot, Zap, Shield, Globe,
  Layers, Palette, Rocket, Star, Lock, Settings,
}

function getIcon(name?: string): LucideIcon {
  if (!name) return Zap
  return iconMap[name] || Zap
}

function FeaturesGrid({ props }: { props: FeaturesProps }) {
  return (
    <section className="px-6 @md:px-10 py-16 @md:py-20">
      {/* Header */}
      <div className="text-center mb-10">
        {props.label && (
          <div className="text-[11px] font-semibold uppercase tracking-widest text-green mb-2">
            {props.label}
          </div>
        )}
        <h2 className="text-2xl @md:text-3xl font-bold tracking-tight mb-2">{props.title}</h2>
        {props.subtitle && (
          <p className="text-text-2 text-sm max-w-lg mx-auto">{props.subtitle}</p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-4">
        {props.items.map((item, i) => {
          const Icon = getIcon(item.icon)
          return (
            <div
              key={i}
              className="group bg-bg-2 border border-border-default rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
            >
              <div className="w-10 h-10 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green mb-3 transition-all group-hover:bg-green/15 group-hover:accent-glow-md">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
              <p className="text-[12.5px] text-text-2 leading-relaxed">{item.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function FeaturesList({ props }: { props: FeaturesProps }) {
  return (
    <section className="px-6 @md:px-10 py-16 @md:py-20">
      <div className="text-center mb-10">
        {props.label && (
          <div className="text-[11px] font-semibold uppercase tracking-widest text-green mb-2">
            {props.label}
          </div>
        )}
        <h2 className="text-2xl @md:text-3xl font-bold tracking-tight mb-2">{props.title}</h2>
        {props.subtitle && (
          <p className="text-text-2 text-sm max-w-lg mx-auto">{props.subtitle}</p>
        )}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {props.items.map((item, i) => {
          const Icon = getIcon(item.icon)
          return (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl bg-bg-2 border border-border-default transition-all hover:border-border-hover"
            >
              <div className="w-10 h-10 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center text-green shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">{item.title}</h3>
                <p className="text-[12.5px] text-text-2 leading-relaxed">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function FeaturesBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as FeaturesProps

  switch (block.variant) {
    case 'list':
      return <FeaturesList props={props} />
    default:
      return <FeaturesGrid props={props} />
  }
}

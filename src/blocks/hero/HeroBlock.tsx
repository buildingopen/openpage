import type { BlockConfig } from '../types'
import { ArrowRight, Sparkles } from 'lucide-react'

interface HeroProps {
  badge?: string
  headline: string
  subheadline: string
  primaryCta: string
  secondaryCta?: string
}

function HeroCentered({ props }: { props: HeroProps }) {
  return (
    <section className="px-6 @md:px-10 py-20 @md:py-28 text-center">
      {/* Badge */}
      {props.badge && (
        <div className="reveal-fade-up reveal-d1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-green text-[11px] font-medium mb-6">
          <Sparkles size={12} />
          {props.badge}
        </div>
      )}

      {/* Headline */}
      <h1 className="reveal-fade-up reveal-d2 text-4xl @md:text-5xl font-bold tracking-tight leading-[1.1] mb-4 max-w-3xl mx-auto">
        {props.headline}
      </h1>

      {/* Subheadline */}
      <p className="reveal-fade-up reveal-d3 text-text-2 text-base @md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
        {props.subheadline}
      </p>

      {/* CTAs */}
      <div className="reveal-fade-up reveal-d4 flex flex-wrap items-center justify-center gap-3">
        <button className="px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all hover:accent-glow-xl flex items-center gap-2">
          {props.primaryCta}
          <ArrowRight size={16} />
        </button>
        {props.secondaryCta && (
          <button className="px-6 py-3 rounded-lg bg-bg-3 text-text-0 text-sm font-medium border border-border-default hover:bg-bg-4 hover:border-border-hover transition-all">
            {props.secondaryCta}
          </button>
        )}
      </div>
    </section>
  )
}

function HeroSplit({ props }: { props: HeroProps }) {
  return (
    <section className="px-6 @md:px-10 py-16 @md:py-24 flex flex-col @2xl:flex-row items-center gap-10">
      {/* Text side */}
      <div className="flex-1">
        {props.badge && (
          <div className="reveal-fade-up reveal-d1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-green text-[11px] font-medium mb-4">
            <Sparkles size={12} />
            {props.badge}
          </div>
        )}
        <h1 className="reveal-fade-up reveal-d2 text-3xl @md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
          {props.headline}
        </h1>
        <p className="reveal-fade-up reveal-d3 text-text-2 text-base leading-relaxed mb-6 max-w-lg">
          {props.subheadline}
        </p>
        <div className="reveal-fade-up reveal-d4 flex flex-wrap items-center gap-3">
          <button className="px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all flex items-center gap-2">
            {props.primaryCta}
            <ArrowRight size={16} />
          </button>
          {props.secondaryCta && (
            <button className="px-6 py-3 rounded-lg bg-bg-3 text-text-0 text-sm font-medium border border-border-default hover:bg-bg-4 transition-all">
              {props.secondaryCta}
            </button>
          )}
        </div>
      </div>

      {/* Visual side */}
      <div className="reveal-fade-up reveal-d3 flex-1 w-full">
        <div className="aspect-[4/3] rounded-xl bg-bg-2 border border-border-default overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green/5 to-transparent" />
          <div className="absolute inset-6 border border-dashed border-border-default rounded-lg flex items-center justify-center text-text-3 text-sm">
            Preview
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroGradient({ props }: { props: HeroProps }) {
  return (
    <section className="px-6 @md:px-10 py-20 @md:py-32 text-center relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {props.badge && (
          <div className="reveal-fade-up reveal-d1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green/10 border border-green/20 text-green text-[11px] font-medium mb-6">
            <Sparkles size={12} />
            {props.badge}
          </div>
        )}

        <h1 className="reveal-fade-up reveal-d2 text-4xl @md:text-5xl font-bold tracking-tight leading-[1.1] mb-4 max-w-3xl mx-auto" style={{ color: 'var(--color-text-0)' }}>
          {props.headline}
        </h1>

        <p className="reveal-fade-up reveal-d3 text-text-2 text-base @md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
          {props.subheadline}
        </p>

        <div className="reveal-fade-up reveal-d4 flex flex-wrap items-center justify-center gap-3">
          <button className="px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all hover:accent-glow-xl flex items-center gap-2">
            {props.primaryCta}
            <ArrowRight size={16} />
          </button>
          {props.secondaryCta && (
            <button className="px-6 py-3 rounded-lg bg-bg-3 text-text-0 text-sm font-medium border border-border-default hover:bg-bg-4 transition-all">
              {props.secondaryCta}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function HeroMinimal({ props }: { props: HeroProps }) {
  return (
    <section className="px-6 @md:px-10 py-24 @md:py-36 text-center">
      <h1 className="reveal-fade-up reveal-d1 text-5xl @md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 max-w-4xl mx-auto">
        {props.headline}
      </h1>
      <p className="reveal-fade-up reveal-d2 text-text-2 text-lg @md:text-xl leading-relaxed max-w-lg mx-auto mb-10">
        {props.subheadline}
      </p>
      <div className="reveal-fade-up reveal-d3">
        <button className="px-8 py-4 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all hover:accent-glow-xl flex items-center gap-2 mx-auto">
          {props.primaryCta}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

export function HeroBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as HeroProps

  switch (block.variant) {
    case 'split':
      return <HeroSplit props={props} />
    case 'gradient':
      return <HeroGradient props={props} />
    case 'minimal':
      return <HeroMinimal props={props} />
    default:
      return <HeroCentered props={props} />
  }
}

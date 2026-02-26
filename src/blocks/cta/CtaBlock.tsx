import type { BlockConfig } from '../types'
import { ArrowRight } from 'lucide-react'

interface CtaProps {
  headline: string
  subheadline?: string
  buttonText: string
}

function CtaSimple({ props }: { props: CtaProps }) {
  return (
    <section className="px-6 sm:px-10 py-16 sm:py-20 text-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green/6 via-green/3 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          {props.headline}
        </h2>
        {props.subheadline && (
          <p className="text-text-2 text-sm mb-6 max-w-md mx-auto">
            {props.subheadline}
          </p>
        )}
        <button className="px-8 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all hover:shadow-[0_0_24px_rgba(34,197,94,0.3)] inline-flex items-center gap-2">
          {props.buttonText}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

function CtaSplit({ props }: { props: CtaProps }) {
  return (
    <section className="px-6 sm:px-10 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-xl bg-bg-2 border border-border-default relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
            {props.headline}
          </h2>
          {props.subheadline && (
            <p className="text-text-2 text-sm">{props.subheadline}</p>
          )}
        </div>
        <button className="relative z-10 px-6 py-3 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all shrink-0 flex items-center gap-2">
          {props.buttonText}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

export function CtaBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as CtaProps

  switch (block.variant) {
    case 'split':
      return <CtaSplit props={props} />
    default:
      return <CtaSimple props={props} />
  }
}

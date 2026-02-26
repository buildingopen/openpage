import type { BlockConfig } from '../types'

interface LogoCloudProps {
  title?: string
  logos?: string[]
}

const defaultLogos = ['Vercel', 'Stripe', 'GitHub', 'Figma', 'Notion', 'Linear']

export function LogoCloudBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as LogoCloudProps
  const logos = props.logos || defaultLogos

  return (
    <section className="px-6 sm:px-10 py-10 sm:py-14">
      {props.title && (
        <p className="text-center text-[11px] font-medium uppercase tracking-widest text-text-3 mb-6">
          {props.title}
        </p>
      )}
      {!props.title && (
        <p className="text-center text-[11px] font-medium uppercase tracking-widest text-text-3 mb-6">
          Trusted by teams at
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="group cursor-pointer transition-all"
          >
            <div className="text-lg font-bold text-text-3 transition-all group-hover:text-text-0 group-hover:scale-105 tracking-tight opacity-50 group-hover:opacity-100">
              {logo}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

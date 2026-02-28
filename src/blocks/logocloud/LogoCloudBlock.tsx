import type { BlockConfig } from '../types'

interface LogoCloudProps {
  title?: string
  logos?: string[]
}

const defaultLogos = ['Vercel', 'Stripe', 'GitHub', 'Figma', 'Notion', 'Linear']

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="group cursor-pointer transition-all">
      <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-all group-hover:scale-105 grayscale group-hover:grayscale-0">
        <svg
          aria-hidden="true"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="text-text-3 group-hover:text-green transition-colors"
        >
          <rect
            x="1"
            y="1"
            width="26"
            height="26"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <text
            x="14"
            y="18"
            textAnchor="middle"
            fill="currentColor"
            fontSize="14"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            {name.charAt(0).toUpperCase()}
          </text>
        </svg>
        <span className="text-sm font-semibold text-text-3 group-hover:text-text-0 tracking-tight transition-colors">
          {name}
        </span>
      </div>
    </div>
  )
}

export function LogoCloudBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as LogoCloudProps
  const logos = props.logos || defaultLogos

  return (
    <section className="px-6 @md:px-10 py-10 @md:py-14">
      <p className="reveal-fade-up reveal-d1 text-center text-[11px] font-medium uppercase tracking-widest text-text-3 mb-6">
        {props.title || 'Trusted by teams at'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8 @md:gap-12">
        {logos.map((logo, i) => (
          <div key={i} className={`reveal-fade-up reveal-d${Math.min(i + 2, 8)}`}>
            <LogoPlaceholder name={logo} />
          </div>
        ))}
      </div>
    </section>
  )
}

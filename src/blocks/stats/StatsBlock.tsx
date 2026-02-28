import type { BlockConfig } from '../types'

interface StatItem {
  value: string
  label: string
}

interface StatsProps {
  title?: string
  items?: StatItem[]
}

const defaultStats: StatItem[] = [
  { value: '10K+', label: 'Sites built' },
  { value: '99.9%', label: 'Uptime' },
  { value: '50ms', label: 'Avg. response' },
  { value: '4.9/5', label: 'User rating' },
]

function StatsGrid({ props }: { props: StatsProps }) {
  const items = props.items || defaultStats

  return (
    <section className="px-6 @md:px-10 py-12 @md:py-16">
      {props.title && (
        <h2 className="reveal-fade-up reveal-d1 text-xl font-bold tracking-tight text-center mb-8">{props.title}</h2>
      )}
      <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className={`reveal-fade-up reveal-d${Math.min(i + 2, 8)} text-center p-4 rounded-xl bg-bg-2 border border-border-default`}>
            <div className="text-3xl @md:text-4xl font-bold tracking-tight text-green mb-1">
              {item.value}
            </div>
            <div className="text-[12px] text-text-2 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatsBar({ props }: { props: StatsProps }) {
  const items = props.items || defaultStats

  return (
    <section className="px-6 @md:px-10 py-10">
      <div className="reveal-scale reveal-d1 flex flex-wrap items-center justify-center gap-8 @md:gap-12 py-6 px-4 rounded-xl bg-bg-2 border border-border-default">
        {items.map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl @md:text-3xl font-bold tracking-tight text-text-0 mb-0.5">
              {item.value}
            </div>
            <div className="text-[11px] text-text-3 font-medium uppercase tracking-wider">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatsCounter({ props }: { props: StatsProps }) {
  const items = props.items || defaultStats

  return (
    <section className="px-6 @md:px-10 py-12 @md:py-16">
      {props.title && (
        <h2 className="reveal-fade-up reveal-d1 text-xl font-bold tracking-tight text-center mb-8">{props.title}</h2>
      )}
      <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className={`reveal-fade-up reveal-d${Math.min(i + 2, 8)} text-center p-5 rounded-xl bg-green/8 border border-green/15`}>
            <div className="text-3xl @md:text-4xl font-bold tracking-tight text-text-0 mb-1">
              {item.value}
            </div>
            <div className="text-[12px] text-green font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StatsBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as StatsProps

  switch (block.variant) {
    case 'bar':
      return <StatsBar props={props} />
    case 'counter':
      return <StatsCounter props={props} />
    default:
      return <StatsGrid props={props} />
  }
}

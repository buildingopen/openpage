import type { BlockConfig } from '../types'

interface TeamMember {
  name: string
  role: string
  avatar?: string
}

interface TeamProps {
  title?: string
  subtitle?: string
  members?: TeamMember[]
}

const defaultMembers: TeamMember[] = [
  { name: 'Alex Rivera', role: 'CEO & Founder' },
  { name: 'Jordan Lee', role: 'CTO' },
  { name: 'Sam Patel', role: 'Head of Design' },
  { name: 'Casey Morgan', role: 'Lead Engineer' },
]

export function TeamBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as TeamProps
  const members = props.members || defaultMembers

  return (
    <section className="px-6 sm:px-10 py-16 sm:py-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {props.title || 'Meet the Team'}
        </h2>
        {props.subtitle && (
          <p className="text-text-2 text-sm max-w-lg mx-auto">{props.subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {members.map((member, i) => (
          <div key={i} className="text-center group">
            <div className="w-20 h-20 mx-auto rounded-full bg-bg-3 border-2 border-border-default flex items-center justify-center text-xl font-bold text-text-3 mb-3 transition-all group-hover:border-green/30 group-hover:shadow-[0_0_16px_rgba(34,197,94,0.1)]">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="text-sm font-semibold">{member.name}</h3>
            <p className="text-[11px] text-text-3 mt-0.5">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

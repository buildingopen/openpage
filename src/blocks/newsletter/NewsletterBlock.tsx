import { toast } from 'sonner'
import type { BlockConfig } from '../types'
import { Mail } from 'lucide-react'

interface NewsletterProps {
  title?: string
  subtitle?: string
  buttonText?: string
  socialProof?: string
}

export function NewsletterBlock({ block }: { block: BlockConfig }) {
  const props = block.props as unknown as NewsletterProps

  return (
    <section className="px-6 @md:px-10 py-12 @md:py-16">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center text-green mx-auto mb-4">
          <Mail size={22} />
        </div>
        <h2 className="text-xl @md:text-2xl font-bold tracking-tight mb-2">
          {props.title || 'Stay in the loop'}
        </h2>
        <p className="text-text-2 text-sm mb-6">
          {props.subtitle || 'Get updates on new features and releases. No spam, ever.'}
        </p>

        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="you@example.com"
            className="flex-1 px-4 py-2.5 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3 transition-colors"
          />
          <button
            onClick={() => toast("You're subscribed!")}
            className="px-5 py-2.5 rounded-lg bg-green text-black text-sm font-semibold hover:bg-green-dim transition-all shrink-0"
          >
            {props.buttonText || 'Subscribe'}
          </button>
        </div>

        {props.socialProof && (
          <p className="text-[11px] text-text-3 mt-3">{props.socialProof}</p>
        )}
        {!props.socialProof && (
          <p className="text-[11px] text-text-3 mt-3">Join 2,000+ developers and designers</p>
        )}
      </div>
    </section>
  )
}

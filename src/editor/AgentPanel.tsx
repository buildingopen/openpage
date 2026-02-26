import { useState, useRef, useEffect } from 'react'
import { Send, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useConfigStore } from '@/store/configStore'

interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  text: string
  applied?: boolean
  patch?: {
    path: string
    blockId?: string
    propKey?: string
    value?: string
    added?: string[]
    removed?: string[]
  }
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'agent',
    text: 'Hi! I can help you build and modify your site. Try asking me to add sections, change content, or tweak styles.',
  },
]

function TypingIndicator() {
  return (
    <div className="self-start flex gap-1 px-4 py-3 bg-green-glow rounded-xl rounded-bl-sm border border-green/10">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-green opacity-40"
          style={{
            animation: 'typeDot 1.4s infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes typeDot {
          0%, 60%, 100% { opacity: 0.4; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  )
}

// Simple pattern matching for demo agent responses
function generateResponse(input: string, blocks: { id: string; type: string; props: Record<string, unknown> }[]): ChatMessage {
  const lower = input.toLowerCase()
  const heroBlock = blocks.find((b) => b.type === 'hero')

  if (lower.includes('change') && lower.includes('headline') && heroBlock) {
    const match = input.match(/["'](.+?)["']/) || input.match(/to\s+(.+)/i)
    const newHeadline = match?.[1]?.trim() || 'Your New Headline'
    const oldHeadline = String(heroBlock.props.headline || 'Build websites with JSON')
    return {
      id: `msg-${Date.now()}`,
      role: 'agent',
      text: `I'll update the hero headline for you.`,
      patch: {
        path: `blocks[${blocks.indexOf(heroBlock)}].props.headline`,
        blockId: heroBlock.id,
        propKey: 'headline',
        value: newHeadline,
        removed: [`"${oldHeadline}"`],
        added: [`"${newHeadline}"`],
      },
    }
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'agent',
    text: "I'm a demo agent. I can change the hero headline if you ask me to. Try: \"Change the headline to 'Your New Title'\"",
  }
}

export function AgentPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [showTyping, setShowTyping] = useState(false)
  const updateBlockProps = useConfigStore((s) => s.updateBlockProps)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showTyping])

  function handleApply(msg: ChatMessage) {
    if (!msg.patch?.blockId || !msg.patch?.propKey || !msg.patch?.value) {
      toast.error('Cannot apply: missing patch data')
      return
    }
    updateBlockProps(msg.patch.blockId, { [msg.patch.propKey]: msg.patch.value })
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, applied: true } : m))
    )
    toast('Patch applied')
  }

  function handleReject(msg: ChatMessage) {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, applied: false, patch: undefined } : m))
    )
    toast('Patch rejected')
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const userMsg: ChatMessage = { id: `msg-${Date.now()}`, role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setShowTyping(true)

    // Simulate agent thinking (read fresh blocks inside timeout)
    setTimeout(() => {
      const currentBlocks = useConfigStore.getState().config.blocks
      const response = generateResponse(text, currentBlocks)
      setShowTyping(false)
      setMessages((prev) => [...prev, response])
    }, 800 + Math.random() * 600)
  }

  function handleHint(hint: string) {
    setInput(hint)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[94%] px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed ${
              msg.role === 'user'
                ? 'self-end bg-bg-3 text-text-0 rounded-br-sm'
                : 'self-start bg-green-glow text-text-0 rounded-bl-sm border border-green/10'
            }`}
          >
            {msg.text}

            {/* JSON patch diff */}
            {msg.patch && (
              <div className="bg-bg-2 border border-border-default rounded-md p-2 mt-2 font-mono text-[10.5px] leading-relaxed">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-[9px] font-semibold uppercase tracking-wider text-text-3">
                    JSON Patch
                  </span>
                  {!msg.applied && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleApply(msg)}
                        className="px-1.5 py-0.5 rounded text-[9px] bg-green/20 text-green hover:bg-green/30 transition-colors flex items-center gap-0.5"
                      >
                        <Check size={9} /> Apply
                      </button>
                      <button
                        onClick={() => handleReject(msg)}
                        className="px-1.5 py-0.5 rounded text-[9px] bg-status-red/10 text-status-red hover:bg-status-red/20 transition-colors flex items-center gap-0.5"
                      >
                        <X size={9} /> Reject
                      </button>
                    </div>
                  )}
                  {msg.applied && (
                    <span className="text-[9px] text-green font-medium flex items-center gap-0.5">
                      <Check size={9} /> Applied
                    </span>
                  )}
                </div>
                <div className="text-text-3 text-[10px] mb-1">{msg.patch.path}</div>
                {msg.patch.removed?.map((line, i) => (
                  <div key={`r-${i}`} className="text-status-red line-through opacity-60">
                    - {line}
                  </div>
                ))}
                {msg.patch.added?.map((line, i) => (
                  <div key={`a-${i}`} className="text-green">
                    + {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {showTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2.5 border-t border-border-default">
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="Ask the agent..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            className="flex-1 px-3 py-2 rounded-lg border border-border-default bg-bg-2 text-text-0 text-[13px] outline-none focus:border-green placeholder:text-text-3"
          />
          <button
            onClick={handleSend}
            className="w-9 h-9 rounded-lg bg-green flex items-center justify-center text-black shrink-0 hover:bg-green-dim transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {['Change the headline', 'Add pricing', 'Make it minimal'].map((hint) => (
            <span
              key={hint}
              onClick={() => handleHint(hint)}
              className="px-2 py-0.5 rounded-full text-[10.5px] text-text-2 border border-border-default bg-bg-2 cursor-pointer hover:border-green hover:text-green hover:bg-green-glow transition-all"
            >
              {hint}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

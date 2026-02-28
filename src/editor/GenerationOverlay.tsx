import { useState, useEffect, useRef } from 'react'
import { Loader2, X, Sparkles } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

export function GenerationOverlay() {
  const isGenerating = useEditorStore((s) => s.isGenerating)
  const clearGeneration = useEditorStore((s) => s.clearGeneration)
  const [elapsed, setElapsed] = useState(0)
  const [fading, setFading] = useState(false)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isGenerating) {
      setVisible(true)
      setFading(false)
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else if (visible) {
      // Fade out
      setFading(true)
      if (timerRef.current) clearInterval(timerRef.current)
      const t = setTimeout(() => { setVisible(false); setFading(false) }, 500)
      return () => clearTimeout(t)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isGenerating]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center bg-bg-0/80 backdrop-blur-sm transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6 max-w-sm px-6">
        {/* Animated icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center">
            <Sparkles size={28} className="text-green" />
          </div>
          <div className="absolute inset-0 rounded-2xl animate-pulse bg-green/5" />
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="text-text-0 text-[15px] font-semibold mb-1">Building your site</p>
          <p className="text-text-3 text-[12px]">AI is generating layout, copy, and theme</p>
        </div>

        {/* Elapsed timer */}
        <div className="flex items-center gap-2 text-green text-[13px]">
          <Loader2 size={15} className="animate-spin" />
          <span className="tabular-nums">{elapsed}s</span>
        </div>

        {/* Shimmer skeleton preview */}
        <div className="w-full max-w-[280px] space-y-2">
          <div className="h-3 rounded bg-bg-3 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-3) 25%, var(--color-bg-4) 50%, var(--color-bg-3) 75%)' }} />
          <div className="h-3 rounded bg-bg-3 w-3/4 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-3) 25%, var(--color-bg-4) 50%, var(--color-bg-3) 75%)', animationDelay: '150ms' }} />
          <div className="h-3 rounded bg-bg-3 w-1/2 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, var(--color-bg-3) 25%, var(--color-bg-4) 50%, var(--color-bg-3) 75%)', animationDelay: '300ms' }} />
        </div>

        {/* Cancel */}
        <button
          onClick={() => clearGeneration()}
          className="px-3 py-1.5 rounded-lg bg-bg-3 text-text-2 text-[12px] border border-border-default hover:bg-bg-4 hover:text-text-0 transition-colors inline-flex items-center gap-1.5"
        >
          <X size={12} />
          Cancel
        </button>
      </div>
    </div>
  )
}

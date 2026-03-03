import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

const steps = [
  { label: 'Analyzing prompt', duration: 3 },
  { label: 'Generating layout', duration: 5 },
  { label: 'Writing copy', duration: 4 },
  { label: 'Applying theme', duration: 3 },
]

export function GenerationOverlay() {
  const isGenerating = useEditorStore((s) => s.isGenerating)
  const clearGeneration = useEditorStore((s) => s.clearGeneration)
  const [elapsed, setElapsed] = useState(0)
  const [showAfterFade, setShowAfterFade] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Adjust state during render when isGenerating changes (React-recommended pattern)
  const [prevIsGenerating, setPrevIsGenerating] = useState(false)
  if (isGenerating !== prevIsGenerating) {
    setPrevIsGenerating(isGenerating)
    if (isGenerating) {
      setShowAfterFade(true)
      setElapsed(0)
    }
  }

  // Timer management: all setState calls are inside callbacks, not synchronous
  useEffect(() => {
    if (isGenerating) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
    if (showAfterFade) {
      const t = setTimeout(() => setShowAfterFade(false), 600)
      return () => clearTimeout(t)
    }
  }, [isGenerating, showAfterFade])

  const visible = isGenerating || showAfterFade
  const fading = !isGenerating && showAfterFade

  if (!visible) return null

  // Determine active step based on elapsed time
  let stepTime = 0
  let activeStep = steps.length - 1
  for (let i = 0; i < steps.length; i++) {
    stepTime += steps[i].duration
    if (elapsed < stepTime) { activeStep = i; break }
  }

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-600 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-0/90 backdrop-blur-md" />

      {/* Animated glow orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, var(--color-green) 0%, transparent 70%)',
          animation: 'gen-orb 4s ease-in-out infinite',
        }}
      />

      <div className="relative flex flex-col items-center gap-8 max-w-md px-8">
        {/* Wireframe animation */}
        <div className="relative w-[200px] h-[130px] rounded-lg border border-border-default bg-bg-1/80 overflow-hidden">
          {/* Animated wireframe blocks */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-bg-3/60 flex items-center px-2 gap-1">
            <div className="w-6 h-1.5 rounded-sm bg-green/40" />
            <div className="flex-1" />
            <div className="w-3 h-1.5 rounded-sm bg-bg-4" />
            <div className="w-3 h-1.5 rounded-sm bg-bg-4" />
            <div className="w-3 h-1.5 rounded-sm bg-bg-4" />
          </div>
          <div className="absolute top-6 left-3 right-3 space-y-1.5">
            <div className="h-2 w-16 rounded-sm bg-green/30 gen-shimmer" style={{ animationDelay: '0ms' }} />
            <div className="h-4 w-full rounded-sm bg-bg-4/80 gen-shimmer" style={{ animationDelay: '100ms' }} />
            <div className="h-2 w-3/4 rounded-sm bg-bg-4/50 gen-shimmer" style={{ animationDelay: '200ms' }} />
            <div className="flex gap-1.5 pt-1">
              <div className="h-3 w-12 rounded-sm bg-green/40 gen-shimmer" style={{ animationDelay: '300ms' }} />
              <div className="h-3 w-10 rounded-sm bg-bg-4/60 gen-shimmer" style={{ animationDelay: '350ms' }} />
            </div>
          </div>
          <div className="absolute bottom-2 left-3 right-3 flex gap-1.5">
            <div className="flex-1 h-8 rounded bg-bg-3/60 gen-shimmer" style={{ animationDelay: '400ms' }} />
            <div className="flex-1 h-8 rounded bg-bg-3/60 gen-shimmer" style={{ animationDelay: '500ms' }} />
            <div className="flex-1 h-8 rounded bg-bg-3/60 gen-shimmer" style={{ animationDelay: '600ms' }} />
          </div>
          {/* Scan line */}
          <div className="absolute left-0 right-0 h-px bg-green/40 gen-scan" />
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-text-0 text-[16px] font-display font-semibold mb-2 tracking-tight">
            Building your site
          </p>
          <div className="flex items-center justify-center gap-2 text-green text-[13px] tabular-nums">
            <div className="w-4 h-4 rounded-full border-2 border-green/30 border-t-green animate-spin" />
            <span>{elapsed}s</span>
          </div>
        </div>

        {/* Progress steps */}
        <div className="w-full space-y-2">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold border transition-all duration-500 ${
                i < activeStep
                  ? 'bg-green/20 border-green/40 text-green'
                  : i === activeStep
                    ? 'border-green text-green animate-pulse'
                    : 'border-border-default text-text-3'
              }`}>
                {i < activeStep ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className={`text-[12px] transition-colors duration-500 ${
                i < activeStep ? 'text-text-2' : i === activeStep ? 'text-text-0 font-medium' : 'text-text-3'
              }`}>
                {step.label}
              </span>
              {i === activeStep && (
                <div className="flex-1 h-1 rounded-full bg-bg-3 overflow-hidden ml-auto max-w-[80px]">
                  <div className="h-full bg-green/60 rounded-full gen-progress" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cancel */}
        <button
          onClick={() => clearGeneration()}
          className="px-4 py-2 rounded-lg bg-bg-2 text-text-2 text-[12px] border border-border-default hover:bg-bg-3 hover:text-text-0 hover:border-border-hover transition-all inline-flex items-center gap-1.5"
        >
          <X size={12} />
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes gen-orb {
          0%, 100% { transform: translate(-30%, -20%) scale(1); }
          33% { transform: translate(20%, -10%) scale(1.1); }
          66% { transform: translate(-10%, 20%) scale(0.9); }
        }
        .gen-shimmer {
          animation: gen-shimmer 2s ease-in-out infinite;
        }
        @keyframes gen-shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .gen-scan {
          animation: gen-scan 2.5s ease-in-out infinite;
        }
        @keyframes gen-scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .gen-progress {
          animation: gen-progress 3s ease-in-out infinite;
        }
        @keyframes gen-progress {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}

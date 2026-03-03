import { useRef, useState, useEffect } from 'react'

export function useScrollReveal(disabled = false) {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(disabled)

  useEffect(() => {
    if (disabled) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '-60px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [disabled])

  return { ref, isRevealed: disabled || isRevealed }
}

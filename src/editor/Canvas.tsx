import { useMemo } from 'react'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { CanvasEmpty } from './CanvasEmpty'
import { BlockWrapper } from '@/blocks/BlockWrapper'
import { renderBlock } from '@/blocks/registry'
import { resolveTheme, themeToCSS } from '@/lib/theme-presets'
import { useGoogleFonts } from '@/lib/useGoogleFonts'

export function Canvas() {
  const blocks = useConfigStore((s) => s.config.blocks)
  const theme = useConfigStore((s) => s.config.theme)
  const { selectedBlockId, selectBlock, viewport } = useEditorStore()

  const resolved = useMemo(() => resolveTheme(theme), [theme])
  const cssVars = useMemo(() => themeToCSS(resolved), [resolved])
  useGoogleFonts([resolved.fontSans, resolved.fontDisplay, resolved.fontMono])

  const maxWidth = viewport === 'desktop' ? '880px' : viewport === 'tablet' ? '768px' : '375px'

  if (blocks.length === 0) {
    return <CanvasEmpty />
  }

  const canvasContent = (
    <div
      className="@container border rounded-xl min-h-[400px] relative z-[1] overflow-hidden transition-all duration-300"
      style={{ width: '100%', maxWidth, ...cssVars, color: 'var(--color-text-0)', backgroundColor: 'var(--color-bg-1)', borderColor: 'var(--color-border-default)' } as React.CSSProperties}
      onClick={(e) => {
        if (e.target === e.currentTarget) selectBlock(null)
      }}
    >
      {blocks.map((block) => (
        <BlockWrapper
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onSelect={() => selectBlock(block.id)}
        >
          {renderBlock(block)}
        </BlockWrapper>
      ))}
    </div>
  )

  return (
    <div className="flex-1 flex items-start justify-center p-6 overflow-auto relative">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-bg-3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {viewport === 'tablet' ? (
        <div className="relative z-[1]">
          {/* Tablet frame */}
          <div className="border-[12px] border-bg-4 rounded-2xl bg-bg-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="rounded-lg overflow-hidden">
              {canvasContent}
            </div>
          </div>
        </div>
      ) : viewport === 'mobile' ? (
        <div className="relative z-[1]">
          {/* Phone frame */}
          <div className="border-[10px] border-bg-4 rounded-[2rem] bg-bg-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Notch */}
            <div className="flex justify-center -mt-[4px] mb-1">
              <div className="w-24 h-5 bg-bg-4 rounded-b-xl" />
            </div>
            <div className="rounded-xl overflow-hidden">
              {canvasContent}
            </div>
            {/* Home indicator */}
            <div className="flex justify-center mt-2 pb-1">
              <div className="w-28 h-1 bg-bg-5 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        canvasContent
      )}
    </div>
  )
}

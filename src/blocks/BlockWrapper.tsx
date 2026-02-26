import type { ReactNode } from 'react'
import { Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { useConfigStore } from '@/store/configStore'
import type { BlockConfig } from './types'

interface Props {
  block: BlockConfig
  isSelected: boolean
  onSelect: () => void
  children: ReactNode
}

export function BlockWrapper({ block, isSelected, onSelect, children }: Props) {
  const blocks = useConfigStore((s) => s.config.blocks)
  const { duplicateBlock, removeBlock, moveBlock } = useConfigStore()

  const index = blocks.findIndex((b) => b.id === block.id)
  const isFirst = index === 0
  const isLast = index === blocks.length - 1

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      className={`relative cursor-pointer transition-all border-b border-border-subtle group block-enter ${
        isSelected
          ? 'bg-green-glow2 outline outline-2 outline-green -outline-offset-2 rounded'
          : 'hover:bg-green-glow2'
      }`}
    >
      {/* Block type tag */}
      <span
        className={`absolute top-1.5 left-1.5 text-[9px] font-semibold uppercase tracking-wider text-green bg-green-glow px-1.5 py-0.5 rounded transition-opacity z-10 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {block.type}
      </span>

      {/* Action buttons */}
      <div
        className={`absolute top-1.5 right-1.5 flex gap-0.5 z-10 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {!isFirst && (
          <button
            onClick={(e) => { e.stopPropagation(); moveBlock(index, index - 1) }}
            className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
            title="Move up"
          >
            <ChevronUp size={12} />
          </button>
        )}
        {!isLast && (
          <button
            onClick={(e) => { e.stopPropagation(); moveBlock(index, index + 1) }}
            className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
            title="Move down"
          >
            <ChevronDown size={12} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id) }}
          className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
          title="Duplicate"
        >
          <Copy size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); removeBlock(block.id) }}
          className="w-6 h-6 rounded bg-bg-2/80 border border-border-default backdrop-blur-sm flex items-center justify-center text-text-3 hover:text-status-red hover:bg-status-red/10 transition-colors"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {children}
    </div>
  )
}

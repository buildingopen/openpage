import { useState } from 'react'
import { Plus, Code } from 'lucide-react'
import { blockMetadata, categories } from '@/lib/block-metadata'
import { renderBlock } from '@/blocks/registry'
import type { BlockConfig } from '@/blocks/types'

export function Components() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

  const filtered = activeCategory
    ? blockMetadata.filter((b) => b.category === activeCategory)
    : blockMetadata

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-12 pt-8">
        <h1 className="text-[22px] font-semibold tracking-tight">Component Library</h1>
        <p className="text-text-2 text-[13px] mt-1">
          {blockMetadata.length} components across {categories.length} categories
        </p>
      </div>

      {/* Category filters */}
      <div className="px-12 pt-5 flex gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
            !activeCategory
              ? 'text-text-0 bg-bg-3 border border-border-default'
              : 'text-text-2 border border-transparent hover:text-text-1 hover:bg-bg-2'
          }`}
        >
          All ({blockMetadata.length})
        </button>
        {categories.map((cat) => {
          const count = blockMetadata.filter((b) => b.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                activeCategory === cat
                  ? 'text-text-0 bg-bg-3 border border-border-default'
                  : 'text-text-2 border border-transparent hover:text-text-1 hover:bg-bg-2'
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Component grid */}
      <div className="px-12 pt-6 pb-12 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {filtered.map((meta) => {
          const previewBlock: BlockConfig = {
            id: `preview-${meta.type}`,
            type: meta.type,
            variant: meta.variants[0],
            props: meta.defaultProps,
          }

          return (
            <div
              key={meta.type}
              className="bg-bg-1 border border-border-default rounded-xl overflow-hidden transition-all hover:border-border-hover hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] cursor-pointer"
              onMouseEnter={() => setHoveredBlock(meta.type)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              {/* Mini preview */}
              <div className="h-[120px] bg-bg-2 overflow-hidden relative">
                <div
                  className="origin-top-left"
                  style={{ transform: 'scale(0.35)', width: '285%', height: '285%' }}
                >
                  <div className="pointer-events-none">
                    {renderBlock(previewBlock)}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h3 className="text-sm font-semibold">{meta.label}</h3>
                    <p className="text-[11px] text-text-3 mt-0.5">{meta.description}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-3 text-text-2 border border-border-default shrink-0 ml-2">
                    {meta.variants.length} variant{meta.variants.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-glow text-green font-medium">
                    {meta.category}
                  </span>

                  <div className="flex gap-1.5">
                    {/* JSON schema tooltip hint */}
                    {hoveredBlock === meta.type && (
                      <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-text-3 hover:text-text-1 hover:bg-bg-3 transition-colors">
                        <Code size={10} />
                        Schema
                      </button>
                    )}
                    <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-green/10 text-green hover:bg-green/20 transition-colors font-medium">
                      <Plus size={10} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

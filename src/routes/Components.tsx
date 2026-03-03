import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Code, Search } from 'lucide-react'
import { toast } from 'sonner'
import { blockMetadata, categories } from '@/lib/block-metadata'
import { RenderBlock } from '@/blocks/registry'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { resolveTheme, themeToCSS } from '@/lib/theme-presets'
import type { BlockConfig } from '@/blocks/types'

let componentBlockIdSeq = 0

function nextComponentBlockId(): string {
  componentBlockIdSeq += 1
  return `block-${componentBlockIdSeq}`
}

export function Components() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)
  const [activeVariants, setActiveVariants] = useState<Record<string, number>>({})
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const addBlock = useConfigStore((s) => s.addBlock)
  const selectBlock = useEditorStore((s) => s.selectBlock)
  const theme = useConfigStore((s) => s.config.theme)
  const cssVars = useMemo(() => themeToCSS(resolveTheme(theme)), [theme])

  const filtered = useMemo(() => {
    let results = blockMetadata
    if (activeCategory) results = results.filter((b) => b.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter((b) =>
        b.label.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
      )
    }
    return results
  }, [activeCategory, search])

  function handleAdd(meta: typeof blockMetadata[number]) {
    const variantIdx = activeVariants[meta.type] ?? 0
    const block: BlockConfig = {
      id: nextComponentBlockId(),
      type: meta.type,
      variant: meta.variants[variantIdx],
      props: { ...meta.defaultProps },
    }
    addBlock(block)
    selectBlock(block.id)
    toast(`${meta.label} added`)
    navigate('/editor')
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 md:px-12 pt-8">
        <h1 className="text-[22px] font-display font-semibold tracking-tight animate-fade-in-up stagger-1">Component Library</h1>
        <p className="text-text-2 text-[13px] mt-1 animate-fade-in-up stagger-2">
          {blockMetadata.length} components across {categories.length} categories
        </p>
      </div>

      {/* Search */}
      <div className="px-4 md:px-12 pt-5 animate-fade-in stagger-3">
        <div className="relative max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 rounded-md border border-border-default bg-bg-2 text-text-0 text-[12px] outline-none focus:border-green placeholder:text-text-3"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 md:px-12 pt-3 flex gap-1.5 flex-wrap animate-fade-in stagger-3">
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
      <div className="px-4 md:px-12 pt-6 pb-12 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {filtered.map((meta, i) => {
          const variantIdx = activeVariants[meta.type] ?? 0
          const previewBlock: BlockConfig = {
            id: `preview-${meta.type}`,
            type: meta.type,
            variant: meta.variants[variantIdx],
            props: meta.defaultProps,
          }

          return (
            <div
              key={meta.type}
              style={{ animationDelay: `${i * 50}ms` }}
              className="bg-bg-1 border border-border-default rounded-xl overflow-hidden card-lift hover:border-border-hover hover:card-lift-hover cursor-pointer animate-fade-in-up"
              onMouseEnter={() => setHoveredBlock(meta.type)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              {/* Mini preview */}
              <div className="h-[140px] bg-bg-2 overflow-hidden relative">
                <div
                  className="origin-top-left pointer-events-none"
                  style={{ transform: 'scale(0.3)', width: '333%', height: '333%', ...cssVars, color: 'var(--color-text-0)', backgroundColor: 'var(--color-bg-1)' } as React.CSSProperties}
                >
                  <RenderBlock block={previewBlock} />
                </div>

                {/* Variant tabs */}
                {meta.variants.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-2 py-1.5 backdrop-blur-sm bg-bg-0/60">
                    {meta.variants.map((v, vi) => (
                      <button
                        key={v}
                        onClick={(e) => { e.stopPropagation(); setActiveVariants((prev) => ({ ...prev, [meta.type]: vi })) }}
                        className={`px-2 py-0.5 rounded-md text-[10px] transition-all ${
                          vi === variantIdx
                            ? 'bg-green/10 text-green border border-green/20'
                            : 'bg-bg-3/80 text-text-2 border border-transparent hover:text-text-0'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
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
                      <button
                        onClick={(e) => { e.stopPropagation(); toast(`${meta.label} schema: ${Object.keys(meta.defaultProps).join(', ')}`) }}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-text-3 hover:text-text-1 hover:bg-bg-3 transition-colors"
                      >
                        <Code size={10} />
                        Schema
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdd(meta) }}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-green/10 text-green hover:bg-green/20 active:scale-[0.97] transition-all font-medium"
                    >
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

import { useState } from 'react'
import { ChevronDown, ChevronRight, Code } from 'lucide-react'
import type { BlockConfig, BlockType } from '@/blocks/types'
import { useConfigStore } from '@/store/configStore'

interface FieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'array-strings' | 'array-items'
  options?: string[]
}

const blockFields: Partial<Record<BlockType, { sections: { title: string; fields: FieldDef[] }[] }>> = {
  navbar: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'logo', label: 'Logo Text', type: 'text' },
          { key: 'ctaText', label: 'CTA Button', type: 'text' },
          { key: 'links', label: 'Nav Links', type: 'array-strings' },
        ],
      },
    ],
  },
  hero: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'badge', label: 'Badge', type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
          { key: 'primaryCta', label: 'Primary CTA', type: 'text' },
          { key: 'secondaryCta', label: 'Secondary CTA', type: 'text' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['centered', 'split', 'gradient'] },
        ],
      },
    ],
  },
  features: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'label', label: 'Section Label', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
        ],
      },
      {
        title: 'Items',
        fields: [
          { key: 'items', label: 'Feature Cards', type: 'array-items' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['grid', 'list'] },
        ],
      },
    ],
  },
  pricing: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['simple', 'comparison'] },
        ],
      },
    ],
  },
  cta: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subheadline', label: 'Subheadline', type: 'text' },
          { key: 'buttonText', label: 'Button Text', type: 'text' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['simple', 'split'] },
        ],
      },
    ],
  },
  footer: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'logo', label: 'Logo Text', type: 'text' },
          { key: 'copyright', label: 'Copyright', type: 'text' },
          { key: 'links', label: 'Links', type: 'array-strings' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['simple', 'multi-column', 'minimal'] },
        ],
      },
    ],
  },
  testimonials: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'items', label: 'Testimonials', type: 'array-items' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['cards', 'carousel'] },
        ],
      },
    ],
  },
  stats: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'items', label: 'Stats', type: 'array-items' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'variant', label: 'Variant', type: 'select', options: ['grid', 'bar'] },
        ],
      },
    ],
  },
  faq: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'items', label: 'Questions', type: 'array-items' },
        ],
      },
    ],
  },
  team: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'members', label: 'Members', type: 'array-items' },
        ],
      },
    ],
  },
  contact: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
        ],
      },
    ],
  },
  newsletter: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'buttonText', label: 'Button Text', type: 'text' },
          { key: 'socialProof', label: 'Social Proof', type: 'text' },
        ],
      },
    ],
  },
  logocloud: {
    sections: [
      {
        title: 'Content',
        fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'logos', label: 'Logos', type: 'array-strings' },
        ],
      },
    ],
  },
}

function PropertyField({ field, block }: { field: FieldDef; block: BlockConfig }) {
  const updateBlockProps = useConfigStore((s) => s.updateBlockProps)
  const updateBlock = useConfigStore((s) => s.updateBlock)

  // For variant field, it's on the block itself
  const value = field.key === 'variant'
    ? block.variant
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : (block.props as any)[field.key]

  const onChange = (newValue: unknown) => {
    if (field.key === 'variant') {
      updateBlock(block.id, { variant: newValue as string })
    } else {
      updateBlockProps(block.id, { [field.key]: newValue })
    }
  }

  switch (field.type) {
    case 'text':
      return (
        <div className="mb-2.5">
          <label className="block text-[11.5px] text-text-2 mb-1 font-medium">{field.label}</label>
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded border border-border-default bg-bg-2 text-text-0 text-xs outline-none focus:border-green"
          />
        </div>
      )

    case 'textarea':
      return (
        <div className="mb-2.5">
          <label className="block text-[11.5px] text-text-2 mb-1 font-medium">{field.label}</label>
          <textarea
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-2 py-1.5 rounded border border-border-default bg-bg-2 text-text-0 text-xs outline-none focus:border-green resize-y"
          />
        </div>
      )

    case 'select':
      return (
        <div className="mb-2.5">
          <label className="block text-[11.5px] text-text-2 mb-1 font-medium">{field.label}</label>
          <select
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded border border-border-default bg-bg-2 text-text-0 text-xs outline-none focus:border-green cursor-pointer"
          >
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )

    case 'array-strings': {
      const items = (Array.isArray(value) ? value : []) as string[]
      return (
        <div className="mb-2.5">
          <label className="block text-[11.5px] text-text-2 mb-1 font-medium">{field.label}</label>
          {items.map((item, i) => (
            <div key={i} className="flex gap-1 mb-1">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...items]
                  updated[i] = e.target.value
                  onChange(updated)
                }}
                className="flex-1 px-2 py-1 rounded border border-border-default bg-bg-2 text-text-0 text-xs outline-none focus:border-green"
              />
              <button
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="px-1.5 text-text-3 hover:text-status-red text-xs transition-colors"
              >
                x
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...items, ''])}
            className="text-[10px] text-green hover:text-green-dim transition-colors mt-0.5"
          >
            + Add item
          </button>
        </div>
      )
    }

    case 'array-items': {
      const items = (Array.isArray(value) ? value : []) as Array<Record<string, string>>

      // Infer new item shape from existing items, or use sensible defaults per field key
      function createEmptyItem(): Record<string, string> {
        if (items.length > 0) {
          const template: Record<string, string> = {}
          for (const key of Object.keys(items[0])) template[key] = ''
          return template
        }
        // Fallback templates by block type + field key
        const blockTemplates: Partial<Record<string, Record<string, Record<string, string>>>> = {
          testimonials: { items: { name: '', role: '', quote: '' } },
          stats: { items: { value: '', label: '' } },
          faq: { items: { question: '', answer: '' } },
          team: { members: { name: '', role: '' } },
          features: { items: { title: '', description: '' } },
        }
        return blockTemplates[block.type]?.[field.key] || { title: '', description: '' }
      }

      return (
        <div className="mb-2.5">
          <label className="block text-[11.5px] text-text-2 mb-1 font-medium">{field.label}</label>
          {items.map((item, i) => (
            <div key={i} className="bg-bg-2 border border-border-default rounded p-2 mb-1.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-text-3 font-medium">Item {i + 1}</span>
                <button
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="text-[10px] text-text-3 hover:text-status-red transition-colors"
                >
                  Remove
                </button>
              </div>
              {Object.entries(item).map(([key, val]) => (
                <div key={key} className="mb-1">
                  <label className="block text-[10px] text-text-3 mb-0.5">{key}</label>
                  <input
                    type="text"
                    value={String(val)}
                    onChange={(e) => {
                      const updated = [...items]
                      updated[i] = { ...updated[i], [key]: e.target.value }
                      onChange(updated)
                    }}
                    className="w-full px-1.5 py-1 rounded border border-border-subtle bg-bg-3 text-text-0 text-[11px] outline-none focus:border-green"
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={() => onChange([...items, createEmptyItem()])}
            className="text-[10px] text-green hover:text-green-dim transition-colors"
          >
            + Add item
          </button>
        </div>
      )
    }

    default:
      return null
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3.5 py-2.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-text-3 hover:text-text-2 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
      </button>
      {open && <div className="px-3.5 pb-3">{children}</div>}
    </div>
  )
}

export function PropertiesPanel({ block }: { block: BlockConfig }) {
  const [showJson, setShowJson] = useState(false)
  const schema = blockFields[block.type]

  return (
    <>
      {/* Header */}
      <div className="px-3.5 py-3 border-b border-border-default flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
          Properties
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-glow text-green font-semibold">
          {block.type}
        </span>
      </div>

      {/* Property sections */}
      {schema?.sections.map((section) => (
        <Section key={section.title} title={section.title}>
          {section.fields.map((field) => (
            <PropertyField key={field.key} field={field} block={block} />
          ))}
        </Section>
      )) || (
        <div className="p-3.5 text-[11px] text-text-3">
          No editable properties defined for this block type.
        </div>
      )}

      {/* View JSON toggle */}
      <div className="border-t border-border-subtle">
        <button
          onClick={() => setShowJson(!showJson)}
          className="w-full px-3.5 py-2 flex items-center gap-1.5 text-[10px] text-text-3 hover:text-text-2 transition-colors"
        >
          <Code size={11} />
          {showJson ? 'Hide' : 'View'} Block JSON
        </button>
        {showJson && (
          <pre className="px-3.5 pb-3 text-[10px] font-mono text-text-2 leading-relaxed overflow-x-auto max-h-48 overflow-y-auto">
            {JSON.stringify({ id: block.id, type: block.type, variant: block.variant, props: block.props }, null, 2)}
          </pre>
        )}
      </div>
    </>
  )
}

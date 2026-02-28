import { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'
import { PropertiesPanel } from './PropertiesPanel'
import { DesignPanel } from './DesignPanel'

type Tab = 'properties' | 'design'

export function RightSidebar() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId)
  const blocks = useConfigStore((s) => {
    const pages = s.config.pages
    if (!pages || pages.length === 0) return s.config.blocks
    const page = pages.find((p) => p.id === s.activePageId) ?? pages[0]
    return page.blocks
  })
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)
  const [tab, setTab] = useState<Tab>('design')

  const activeTab = tab === 'properties' && !selectedBlock ? 'design' : tab

  return (
    <div className="hidden md:flex w-[280px] bg-bg-1 border-l border-border-default flex-col shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-border-default shrink-0">
        <button
          onClick={() => setTab('properties')}
          className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
            activeTab === 'properties'
              ? 'text-text-0 border-b border-green'
              : 'text-text-3 hover:text-text-1'
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setTab('design')}
          className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
            activeTab === 'design'
              ? 'text-text-0 border-b border-green'
              : 'text-text-3 hover:text-text-1'
          }`}
        >
          Design
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'design' ? (
          <DesignPanel />
        ) : selectedBlock ? (
          <>
            <PropertiesPanel block={selectedBlock} />
            <div className="mt-auto px-3.5 py-2.5 font-mono text-[10.5px] text-text-3 break-all border-t border-border-subtle">
              config.blocks[{blocks.indexOf(selectedBlock)}]
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-3 text-xs text-center px-6 py-12">
            Select a block to edit its properties
          </div>
        )}
      </div>
    </div>
  )
}

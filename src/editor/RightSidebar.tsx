import { useEditorStore } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'
import { PropertiesPanel } from './PropertiesPanel'

export function RightSidebar() {
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId)
  const blocks = useConfigStore((s) => s.config.blocks)
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  if (!selectedBlock) {
    return (
      <div className="w-[272px] bg-bg-1 border-l border-border-default flex flex-col shrink-0">
        <div className="flex-1 flex items-center justify-center text-text-3 text-xs text-center px-6">
          Select a block to edit its properties
        </div>
      </div>
    )
  }

  return (
    <div className="w-[272px] bg-bg-1 border-l border-border-default flex flex-col shrink-0 overflow-y-auto">
      <PropertiesPanel block={selectedBlock} />

      {/* JSON path */}
      <div className="mt-auto px-3.5 py-2.5 font-mono text-[10.5px] text-text-3 break-all border-t border-border-subtle">
        config.blocks[{blocks.indexOf(selectedBlock)}]
      </div>
    </div>
  )
}

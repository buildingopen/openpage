import { X } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

const shortcutGroups = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['1'], description: 'Dashboard' },
      { keys: ['2'], description: 'Editor' },
      { keys: ['3'], description: 'Components' },
      { keys: ['4'], description: 'Deploy' },
      { keys: ['5'], description: 'Settings' },
    ],
  },
  {
    title: 'Editor',
    shortcuts: [
      { keys: ['J'], description: 'Toggle JSON drawer' },
      { keys: ['H'], description: 'Toggle version history' },
      { keys: ['P'], description: 'Toggle preview mode' },
      { keys: ['Esc'], description: 'Deselect block' },
      { keys: ['?'], description: 'Show this help' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: ['\u2318', 'Z'], description: 'Undo' },
      { keys: ['\u2318', '\u21E7', 'Z'], description: 'Redo' },
    ],
  },
]

export function ShortcutsModal() {
  const { shortcutsModalOpen, toggleShortcutsModal } = useEditorStore()

  if (!shortcutsModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={toggleShortcutsModal}
    >
      <div
        className="bg-bg-1 border border-border-default rounded-xl w-[420px] max-h-[80vh] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
          <h2 className="text-sm font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={toggleShortcutsModal}
            className="w-7 h-7 rounded flex items-center justify-center text-text-3 hover:text-text-0 hover:bg-bg-3 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-3 mb-2">
                {group.title}
              </h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between">
                    <span className="text-[12.5px] text-text-1">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="min-w-[24px] h-6 px-1.5 rounded border border-border-default bg-bg-3 text-[11px] font-mono text-text-2 flex items-center justify-center"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

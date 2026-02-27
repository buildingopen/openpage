import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEditorStore } from '@/store/editorStore'
import { useConfigStore } from '@/store/configStore'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleJsonDrawer, toggleHistory, toggleShortcutsModal, togglePreview, selectBlock } = useEditorStore()
  const { undo, redo } = useConfigStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't fire in inputs
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      // Nav shortcuts: 1-5
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key) {
          case '1': e.preventDefault(); navigate('/'); return
          case '2': e.preventDefault(); navigate('/editor'); return
          case '3': e.preventDefault(); navigate('/components'); return
          case '4': e.preventDefault(); navigate('/deploy'); return
          case '5': e.preventDefault(); navigate('/settings'); return
          case '?': e.preventDefault(); toggleShortcutsModal(); return
        }
      }

      // Editor shortcuts (only on editor page)
      if (location.pathname === '/editor') {
        if (!e.metaKey && !e.ctrlKey) {
          switch (e.key) {
            case 'j': case 'J': e.preventDefault(); toggleJsonDrawer(); return
            case 'h': case 'H': e.preventDefault(); toggleHistory(); return
            case 'p': case 'P': e.preventDefault(); togglePreview(); return
            case 'Escape': e.preventDefault(); selectBlock(null); return
          }
        }

        // Undo/Redo
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
          e.preventDefault()
          if (e.shiftKey) redo()
          else undo()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, location.pathname, toggleJsonDrawer, toggleHistory, toggleShortcutsModal, togglePreview, selectBlock, undo, redo])
}

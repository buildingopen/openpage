import { useEffect, useRef } from 'react'
import { CanvasToolbar } from './CanvasToolbar'
import { LeftSidebar } from './LeftSidebar'
import { Canvas } from './Canvas'
import { RightSidebar } from './RightSidebar'
import { JsonDrawer } from './JsonDrawer'
import { VersionHistory } from './VersionHistory'
import { ShortcutsModal } from './ShortcutsModal'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { useProjectsStore } from '@/store/projectsStore'

function useAutoSaveToProject() {
  const config = useConfigStore((s) => s.config)
  const activeProjectId = useEditorStore((s) => s.activeProjectId)
  const updateProjectConfig = useProjectsStore((s) => s.updateProjectConfig)
  const initialConfigRef = useRef(config)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    initialConfigRef.current = config
    hasMountedRef.current = false
  }, [activeProjectId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!activeProjectId) return
    // Skip the first render (initial load from project)
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    updateProjectConfig(activeProjectId, config)
  }, [config, activeProjectId, updateProjectConfig])
}

export function EditorLayout() {
  useAutoSaveToProject()

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <CanvasToolbar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Canvas />
            <JsonDrawer />
          </div>
        </div>
        <RightSidebar />
      </div>
      <VersionHistory />
      <ShortcutsModal />
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { CanvasToolbar } from './CanvasToolbar'
import { LeftSidebar } from './LeftSidebar'
import { Canvas } from './Canvas'
import { RightSidebar } from './RightSidebar'
import { JsonDrawer } from './JsonDrawer'
import { VersionHistory } from './VersionHistory'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { useProjectsStore } from '@/store/projectsStore'

function useAutoSaveToProject() {
  const config = useConfigStore((s) => s.config)
  const activeProjectId = useEditorStore((s) => s.activeProjectId)
  const updateProjectConfig = useProjectsStore((s) => s.updateProjectConfig)
  const loadedConfigRef = useRef<string | null>(null)

  // Snapshot the config at load time so we can diff
  useEffect(() => {
    loadedConfigRef.current = JSON.stringify(config)
  }, [activeProjectId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!activeProjectId) return
    const serialized = JSON.stringify(config)
    // Only save when config actually differs from what was loaded
    if (serialized === loadedConfigRef.current) return
    updateProjectConfig(activeProjectId, config)
  }, [config, activeProjectId, updateProjectConfig])
}

export function EditorLayout() {
  useAutoSaveToProject()
  const previewMode = useEditorStore((s) => s.previewMode)

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 flex overflow-hidden">
        {!previewMode && <LeftSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          <CanvasToolbar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Canvas />
            <JsonDrawer />
          </div>
        </div>
        {!previewMode && <RightSidebar />}
      </div>
      <VersionHistory />
    </div>
  )
}

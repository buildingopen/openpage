import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { CanvasToolbar } from './CanvasToolbar'
import { LeftSidebar } from './LeftSidebar'
import { Canvas } from './Canvas'
import { RightSidebar } from './RightSidebar'
import { JsonDrawer } from './JsonDrawer'
import { VersionHistory } from './VersionHistory'
import { GenerationOverlay } from './GenerationOverlay'
import { useConfigStore } from '@/store/configStore'
import { useEditorStore } from '@/store/editorStore'
import { useProjectsStore } from '@/store/projectsStore'
import { generateSiteConfig } from '@/lib/generate-site'

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

function useGenerationOrchestration() {
  const isGenerating = useEditorStore((s) => s.isGenerating)
  const generationPrompt = useEditorStore((s) => s.generationPrompt)
  const clearGeneration = useEditorStore((s) => s.clearGeneration)
  const setGenerationError = useEditorStore((s) => s.setGenerationError)
  const activeProjectId = useEditorStore((s) => s.activeProjectId)
  const setConfig = useConfigStore((s) => s.setConfig)
  const updateProjectConfig = useProjectsStore((s) => s.updateProjectConfig)
  const renameProject = useProjectsStore((s) => s.renameProject)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!isGenerating || !generationPrompt) return

    const controller = new AbortController()
    abortRef.current = controller

    generateSiteConfig(generationPrompt, controller.signal)
      .then((config) => {
        if (controller.signal.aborted) return
        setConfig(config)
        if (activeProjectId) {
          updateProjectConfig(activeProjectId, config)
          if (config.name) renameProject(activeProjectId, config.name)
        }
        clearGeneration()
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setGenerationError(err instanceof Error ? err.message : 'Generation failed')
        toast.error(err instanceof Error ? err.message : 'Generation failed')
        clearGeneration()
      })

    return () => {
      controller.abort()
      abortRef.current = null
    }
  }, [isGenerating, generationPrompt]) // eslint-disable-line react-hooks/exhaustive-deps
}

export function EditorLayout() {
  useAutoSaveToProject()
  useGenerationOrchestration()
  const previewMode = useEditorStore((s) => s.previewMode)

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 flex overflow-hidden">
        {!previewMode && <LeftSidebar />}
        <div className="flex-1 flex flex-col min-w-0 relative">
          <CanvasToolbar />
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <Canvas />
            <JsonDrawer />
            <GenerationOverlay />
          </div>
        </div>
        {!previewMode && <RightSidebar />}
      </div>
      <VersionHistory />
    </div>
  )
}

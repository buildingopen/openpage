import { LayersPanel } from './LayersPanel'

export function LeftSidebar() {
  return (
    <div className="hidden md:flex w-[280px] bg-bg-1 border-r border-border-default flex-col shrink-0">
      <LayersPanel />
    </div>
  )
}

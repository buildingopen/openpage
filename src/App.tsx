import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './layout/ErrorBoundary'
import { AppLayout } from './layout/AppLayout'
import { Dashboard } from './routes/Dashboard'
import { Editor } from './routes/Editor'
import { Components } from './routes/Components'
import { Deploy } from './routes/Deploy'
import { Settings } from './routes/Settings'
import { NotFound } from './routes/NotFound'
import { useKeyboardShortcuts } from './lib/useKeyboardShortcuts'

function AppRoutes() {
  useKeyboardShortcuts()

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="editor" element={<Editor />} />
        <Route path="components" element={<Components />} />
        <Route path="deploy" element={<Deploy />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

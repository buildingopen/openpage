import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-center p-8">
          <div className="w-12 h-12 rounded-full bg-status-red/10 flex items-center justify-center text-status-red text-xl">
            !
          </div>
          <h2 className="text-lg font-semibold text-text-0">Something went wrong</h2>
          <p className="text-sm text-text-2 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-bg-3 border border-border-default text-text-1 text-sm hover:bg-bg-4 transition-colors"
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

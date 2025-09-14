'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn, buttonVariants } from '@/lib/design-system'
import { reportClientError } from '@/lib/actions/errorReporting'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number | boolean | null | undefined>
}

interface State {
  hasError: boolean
  error?: Error
  resetKeys?: Array<string | number | boolean | null | undefined>
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false,
      resetKeys: props.resetKeys 
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.resetOnPropsChange && this.props.resetKeys !== prevProps.resetKeys) {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: undefined, resetKeys: this.props.resetKeys })
      }
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Report to error monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo)
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      await reportClientError({
        message: error.message,
        stack: error.stack || undefined,
        componentStack: errorInfo.componentStack || undefined,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      })
    } catch (reportingError) {
      // Silently fail error reporting to avoid infinite loops
      console.error('Failed to report error via Server Action:', reportingError)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI - Centered modal-style overlay
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div>
                <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
                <p className="text-sm text-red-600 mt-1">
                  {process.env.NODE_ENV === 'development' && this.state.error
                    ? this.state.error.message
                    : 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mb-4">
              <button
                onClick={this.handleRetry}
                className={cn(
                  buttonVariants({ variant: 'primary', size: 'sm' }),
                  'flex-1'
                )}
                type="button"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'flex-1'
                )}
                type="button"
              >
                Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="w-full">
                <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800 font-medium">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook version of Error Boundary for functional components
 * Wraps children in ErrorBoundary component
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

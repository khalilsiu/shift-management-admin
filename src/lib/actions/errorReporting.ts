'use server'

/**
 * Server Action for Error Reporting
 * Handles client-side error reports from Error Boundaries
 */
export const reportClientError = async (errorData: {
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent?: string
}) => {
  try {
    // Validate required fields
    if (!errorData.message || !errorData.timestamp) {
      console.error('Invalid error report data:', errorData)
      return { success: false, error: 'Invalid error data' }
    }

    // Log error details (in production, send to monitoring service)
    console.error('Client Error Report:', {
      message: errorData.message,
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      timestamp: errorData.timestamp,
      userAgent: errorData.userAgent,
    })

    // In production, you would send to error monitoring service:
    // await Sentry.captureException(new Error(errorData.message), {
    //   tags: { source: 'client-error-boundary' },
    //   extra: errorData,
    // })

    // For development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('🚨 Error reported via Server Action:', errorData.message)
    }

    return { success: true }
  } catch (error) {
    console.error('Error reporting Server Action failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

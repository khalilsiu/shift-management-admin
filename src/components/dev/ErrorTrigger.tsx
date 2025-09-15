'use client'

import { useState } from 'react'
import { cn, buttonVariants, components } from '@/lib/design-system'


const ErrorThrowingComponent = () => {
  throw new Error('This is a test error to show Error Boundary UI')
}

// Development component to trigger Error Boundary UI (for test purpose, will be in production)
export const ErrorTrigger = () => {
  const [shouldThrowError, setShouldThrowError] = useState(false)


  const handleTriggerError = () => {
    setShouldThrowError(true)
  }

  const handleReset = () => {
    setShouldThrowError(false)
  }

  return (
    <div className={components.layout.fixedBottomRight}>
      {!shouldThrowError ? (
        <button
          onClick={handleTriggerError}
          className={cn(
            buttonVariants({ variant: 'danger', size: 'sm' })
          )}
          type="button"
        >
          🚨 Trigger Error UI
        </button>
      ) : (
        <div className="bg-white border border-red-300 rounded-lg shadow-lg p-3">
          <button
            onClick={handleReset}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mb-2')}
            type="button"
          >
            Reset (Hide Error)
          </button>
          
          {/* This will trigger the Error Boundary */}
          <ErrorThrowingComponent />
        </div>
      )}
    </div>
  )
}

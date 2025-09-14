'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useNotifications } from '@/lib/contexts/NotificationContext'
import { Toast } from './Toast'
import { ErrorBoundary } from './ErrorBoundary'
import { cn } from '@/lib/design-system'

// Uses React Portal for proper z-index layering
export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotifications()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  
  if (notifications.length === 0) {
    return null
  }

  const toastContainer = (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col space-y-3 pointer-events-none',
        'sm:bottom-6 sm:right-6',
        'max-h-screen overflow-hidden' 
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto"
        >
          <ErrorBoundary
            fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">Failed to render notification</p>
              </div>
            }
            onError={(error) => {
              console.error('Toast rendering error:', error)
              // Remove the problematic notification
              setTimeout(() => removeNotification(notification.id), 100)
            }}
          >
            <Toast
              notification={notification}
              onRemove={removeNotification}
            />
          </ErrorBoundary>
        </div>
      ))}
    </div>
  )

  // Use portal to render outside of normal component tree
  return createPortal(toastContainer, document.body)
}

'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/design-system'
import type { Notification } from '@/types/notification'

interface ToastProps {
  notification: Notification
  onRemove: (id: string) => void
}

export const Toast = ({ notification, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    if (isRemoving) return // Prevent double-clicking
    
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      handleClose()
    }
  }

  const getIcon = () => {
    const iconProps = { className: 'h-5 w-5 flex-shrink-0' }
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle {...iconProps} className={cn(iconProps.className, 'text-green-400')} />
      case 'error':
        return <XCircle {...iconProps} className={cn(iconProps.className, 'text-red-400')} />
      case 'warning':
        return <AlertTriangle {...iconProps} className={cn(iconProps.className, 'text-yellow-400')} />
      case 'info':
        return <Info {...iconProps} className={cn(iconProps.className, 'text-blue-400')} />
      default:
        return <Info {...iconProps} className={cn(iconProps.className, 'text-gray-400')} />
    }
  }

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
        return 'text-blue-800'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div
      className={cn(
        'relative flex w-full max-w-sm items-start space-x-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        getBackgroundColor(),
        isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isRemoving && '-translate-x-full opacity-0'
      )}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-describedby={`toast-content-${notification.id}`}
      aria-labelledby={`toast-title-${notification.id}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div 
          id={`toast-title-${notification.id}`}
          className={cn('text-sm font-semibold', getTextColor())}
        >
          {notification.title}
        </div>
        {notification.message && (
          <div 
            id={`toast-content-${notification.id}`}
            className={cn('mt-1 text-sm', getTextColor(), 'opacity-90')}
          >
            {notification.message}
          </div>
        )}
        
        {/* Action button */}
        {notification.action && (
          <button
            className={cn(
              'mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded',
              getTextColor()
            )}
            onClick={notification.action.onClick}
            type="button"
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        className={cn(
          'flex-shrink-0 rounded-md p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          'hover:bg-black hover:bg-opacity-10',
          getTextColor(),
          'focus:ring-gray-500'
        )}
        onClick={handleClose}
        onKeyDown={handleKeyDown}
        type="button"
        aria-label="Close notification"
        tabIndex={0}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

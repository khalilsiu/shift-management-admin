'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn, toastVariants, colors, getAnimationClasses } from '@/lib/design-system'
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
        return <CheckCircle {...iconProps} className={cn(iconProps.className, (colors.semantic.success as any).text)} />
      case 'error':
        return <XCircle {...iconProps} className={cn(iconProps.className, (colors.semantic.danger as any).text)} />
      case 'warning':
        return <AlertTriangle {...iconProps} className={cn(iconProps.className, (colors.semantic.warning as any).text)} />
      case 'info':
        return <Info {...iconProps} className={cn(iconProps.className, (colors.semantic.primary as any).text)} />
      default:
        return <Info {...iconProps} className={cn(iconProps.className, (colors.semantic.neutral as any).text)} />
    }
  }

  return (
    <div
      className={cn(
        toastVariants({ 
          type: notification.type,
          size: 'md'
        }),
        'relative flex w-full items-start space-x-3',
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
          className="text-sm font-semibold"
        >
          {notification.title}
        </div>
        {notification.message && (
          <div 
            id={`toast-content-${notification.id}`}
            className="mt-1 text-sm opacity-90"
          >
            {notification.message}
          </div>
        )}
        
        {/* Action button */}
        {notification.action && (
          <button
            className={cn(
              'mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded',
              getAnimationClasses('focus')
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
          'flex-shrink-0 rounded-md p-1.5 hover:bg-black hover:bg-opacity-10',
          getAnimationClasses('transition', 'colors'),
          getAnimationClasses('focus')
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

'use client'

import { useState } from 'react'

import { useShiftNotifications } from '@/lib/hooks/useShiftNotifications'
import { cn, buttonVariants } from '@/lib/design-system'
import { useNotifications } from '@/lib/providers'

// Development component to trigger Error Boundary UI (for test purpose, will be in production)
export const NotificationTester = () => {
  const { addNotification, clearAllNotifications } = useNotifications()
  const {
    notifyShiftUpdated,
    notifyBatchShiftsUpdated,
    notifyShiftUpdateError,
    notifyBatchUpdateError,
    notifyPartialBatchUpdate,
    notifyOptimisticUpdate,
  } = useShiftNotifications()
  
  const [isExpanded, setIsExpanded] = useState(false)

  const handleTestBasicNotifications = () => {
    // Test all basic notification types
    addNotification({
      type: 'success',
      title: 'Success Test',
      message: 'This is a success notification test',
    })

    setTimeout(() => {
      addNotification({
        type: 'error',
        title: 'Error Test',
        message: 'This is an error notification test',
      })
    }, 500)

    setTimeout(() => {
      addNotification({
        type: 'warning',
        title: 'Warning Test',
        message: 'This is a warning notification test',
      })
    }, 1000)

    setTimeout(() => {
      addNotification({
        type: 'info',
        title: 'Info Test',
        message: 'This is an info notification test',
      })
    }, 1500)
  }

  const handleTestShiftSuccess = () => {
    // Test successful shift updates
    notifyShiftUpdated('Alice Johnson', 'CONFIRMED')
    
    setTimeout(() => {
      notifyShiftUpdated('Bob Smith', 'DECLINED')
    }, 800)
  }

  const handleTestBatchSuccess = () => {
    // Test batch update success
    notifyBatchShiftsUpdated(3, 'CONFIRMED')
    
    setTimeout(() => {
      notifyBatchShiftsUpdated(1, 'DECLINED')
    }, 1000)
  }

  const handleTestShiftErrors = () => {
    // Test shift update errors
    notifyShiftUpdateError('Carol Davis', 'Network connection failed')
    
    setTimeout(() => {
      notifyShiftUpdateError('David Wilson', 'Shift no longer available')
    }, 1200)

    setTimeout(() => {
      notifyShiftUpdateError(undefined, 'Unknown error occurred')
    }, 2400)
  }

  const handleTestBatchErrors = () => {
    // Test batch update errors
    notifyBatchUpdateError(5, 'Server temporarily unavailable')
    
    setTimeout(() => {
      notifyBatchUpdateError(2, 'Database connection timeout')
    }, 1500)
  }

  const handleTestPartialBatch = () => {
    // Test partial batch updates (warnings)
    notifyPartialBatchUpdate(3, 1, 'CONFIRMED')
    
    setTimeout(() => {
      notifyPartialBatchUpdate(1, 2, 'DECLINED')
    }, 1800)
  }

  const handleTestOptimistic = () => {
    // Test optimistic updates
    notifyOptimisticUpdate('Emma Brown', 'CONFIRMED')
    
    setTimeout(() => {
      notifyOptimisticUpdate('Frank White', 'DECLINED')
    }, 600)
  }

  const handleTestPersistentNotification = () => {
    // Test persistent notification that doesn't auto-dismiss
    addNotification({
      type: 'warning',
      title: 'Persistent Notification',
      message: 'This notification will not auto-dismiss',
      persistent: true,
    })
  }

  const handleTestNotificationWithAction = () => {
    // Test notification with action button
    addNotification({
      type: 'info',
      title: 'Action Required',
      message: 'Click the action button to test',
      action: {
        label: 'Test Action',
        onClick: () => {
          addNotification({
            type: 'success',
            title: 'Action Clicked!',
            message: 'The action button worked correctly',
          })
        }
      }
    })
  }

  const handleTestLongMessages = () => {
    // Test notifications with long messages
    addNotification({
      type: 'error',
      title: 'Long Error Message Test',
      message: 'This is a very long error message that should test how the notification component handles text wrapping and layout when the content exceeds the normal width expectations. It should remain readable and properly formatted.',
    })
  }

  const handleTestRapidFire = () => {
    // Test rapid-fire notifications to test stacking
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => {
        addNotification({
          type: i % 2 === 0 ? 'success' : 'info',
          title: `Rapid Fire #${i}`,
          message: `Testing notification stacking - ${i}/5`,
        })
      }, i * 200)
    }
  }

  const handleTestEdgeCases = () => {
    // Test edge cases
    addNotification({
      type: 'success',
      title: '',
      message: 'Empty title test',
    })

    setTimeout(() => {
      addNotification({
        type: 'error',
        title: 'No message test',
      })
    }, 500)

    setTimeout(() => {
      addNotification({
        type: 'warning',
        title: 'Special Characters Test: 🚀 ✅ ❌ ⚠️',
        message: 'Testing emojis and special chars: <>{}[]()&*#@!',
      })
    }, 1000)
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200'
          )}
          type="button"
        >
          🧪 Test Notifications
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Notification Tester</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          type="button"
          aria-label="Close tester"
        >
          ×
        </button>
      </div>

      <div className="space-y-2">
        {/* Basic Tests */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Basic Types</h4>
          <button
            onClick={handleTestBasicNotifications}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs')}
            type="button"
          >
            Test All Types
          </button>
        </div>

        {/* Shift-Specific Tests */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Shift Updates</h4>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={handleTestShiftSuccess}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs')}
              type="button"
            >
              Success
            </button>
            <button
              onClick={handleTestShiftErrors}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs')}
              type="button"
            >
              Errors
            </button>
          </div>
        </div>

        {/* Batch Tests */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Batch Updates</h4>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={handleTestBatchSuccess}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs')}
              type="button"
            >
              Success
            </button>
            <button
              onClick={handleTestBatchErrors}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs')}
              type="button"
            >
              Errors
            </button>
          </div>
          <button
            onClick={handleTestPartialBatch}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs mt-1')}
            type="button"
          >
            Partial Success
          </button>
        </div>

        {/* Special Cases */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Special Cases</h4>
          <div className="space-y-1">
            <button
              onClick={handleTestOptimistic}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs')}
              type="button"
            >
              Optimistic Updates
            </button>
            <button
              onClick={handleTestPersistentNotification}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs')}
              type="button"
            >
              Persistent Toast
            </button>
            <button
              onClick={handleTestNotificationWithAction}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs')}
              type="button"
            >
              With Action
            </button>
          </div>
        </div>

        {/* Stress Tests */}
        <div className="border-b border-gray-200 pb-2 mb-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Stress Tests</h4>
          <div className="space-y-1">
            <button
              onClick={handleTestLongMessages}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs')}
              type="button"
            >
              Long Messages
            </button>
            <button
              onClick={handleTestRapidFire}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs')}
              type="button"
            >
              Rapid Fire (5x)
            </button>
            <button
              onClick={handleTestEdgeCases}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full text-xs')}
              type="button"
            >
              Edge Cases
            </button>
          </div>
        </div>

        {/* Clear All */}
        <button
          onClick={clearAllNotifications}
          className={cn(buttonVariants({ variant: 'danger', size: 'sm' }), 'w-full text-xs')}
          type="button"
        >
          Clear All Notifications
        </button>
      </div>
    </div>
  )
}

import { useCallback, useOptimistic, useTransition } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  toggleShiftSelection,
  selectAllShifts,
  clearSelection,
  setError,
  clearError,
  selectShifts,
  selectSelectedShifts,
  selectError,
} from '@/lib/store/shiftsSlice'
import { updateShiftStatus, batchUpdateShifts } from '@/lib/actions/shifts'
import { useShiftNotifications } from './useShiftNotifications'
import type { Shift } from '@/types/shift'

export const useShifts = () => {
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  
  // Notification hooks for user feedback
  const {
    notifyShiftUpdated,
    notifyBatchShiftsUpdated,
    notifyShiftUpdateError,
    notifyBatchUpdateError,
    notifyPartialBatchUpdate,
    notifyOptimisticUpdate,
  } = useShiftNotifications()
  
  // RTK selectors for client state only
  const shifts = useAppSelector(selectShifts)
  const selectedShifts = useAppSelector(selectSelectedShifts)
  const error = useAppSelector(selectError)

  // React useOptimistic for Server Action optimistic updates
  const [optimisticShifts, updateOptimisticShifts] = useOptimistic<
    Shift[],
    { type: 'update'; shiftId: string; status: 'CONFIRMED' | 'DECLINED' } |
    { type: 'batchUpdate'; shiftIds: string[]; status: 'CONFIRMED' | 'DECLINED' }
  >(
    shifts, // Base state from RTK, filtered by RSC
    (currentShifts, optimisticUpdate) => {
      switch (optimisticUpdate.type) {
        case 'update':
          return currentShifts.map(shift =>
            shift.id === optimisticUpdate.shiftId
              ? { ...shift, status: optimisticUpdate.status, updated_at: new Date().toISOString() }
              : shift
          )
        case 'batchUpdate':
          const updateTime = new Date().toISOString()
          return currentShifts.map(shift =>
            optimisticUpdate.shiftIds.includes(shift.id)
              ? { ...shift, status: optimisticUpdate.status, updated_at: updateTime }
              : shift
          )
        default:
          return currentShifts
      }
    }
  )

  // Derived state
  const isShiftSelected = useCallback(
    (shiftId: string) => selectedShifts.includes(shiftId),
    [selectedShifts]
  )

  const canUpdateShift = useCallback(
    (shiftId: string) => {
      const shift = optimisticShifts.find(s => s.id === shiftId)
      return shift?.status === 'PENDING'
    },
    [optimisticShifts]
  )

  const hasSelectedShifts = selectedShifts.length > 0
  const selectedCount = selectedShifts.length

  // Server Action with useOptimistic
  const handleUpdateShift = useCallback(
    (shiftId: string, status: 'CONFIRMED' | 'DECLINED', updatedBy: string = 'admin_001') => {
      // Find shift for notifications
      const shift = optimisticShifts.find(s => s.id === shiftId)
      const caregiverName = shift?.caregiver_name || 'Unknown'
      
      startTransition(async () => {
        try {
          // 1. Show optimistic notification
          notifyOptimisticUpdate(caregiverName, status)
          
          // 2. Optimistic update using React's useOptimistic (inside transition)
          updateOptimisticShifts({ type: 'update', shiftId, status })
          
          dispatch(clearError())
          
          // 3. Execute Server Action
          const result = await updateShiftStatus(shiftId, status, updatedBy)
          
          if (!result.success) {
            dispatch(setError(result.error || 'Failed to update shift'))
            notifyShiftUpdateError(caregiverName, result.error)
            // useOptimistic automatically reverts on Server Action completion
          } else {
            dispatch(clearSelection())
            notifyShiftUpdated(caregiverName, status)
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          dispatch(setError(errorMessage))
          notifyShiftUpdateError(caregiverName, errorMessage)
          // useOptimistic automatically reverts on error
        }
      })
    },
    [updateOptimisticShifts, dispatch, startTransition, optimisticShifts, notifyOptimisticUpdate, notifyShiftUpdated, notifyShiftUpdateError]
  )

  // Server Action with useOptimistic
  const handleBatchUpdate = useCallback(
    (shiftIds: string[], status: 'CONFIRMED' | 'DECLINED', updatedBy: string = 'admin_001') => {
      startTransition(async () => {
        try {
          // 1. Optimistic update
          updateOptimisticShifts({ type: 'batchUpdate', shiftIds, status })
          
          dispatch(clearError())
          
          // 2. Execute Server Action
          const result = await batchUpdateShifts(shiftIds, status, updatedBy)
          
          if (!result.success) {
            dispatch(setError(result.error || 'Failed to batch update shifts'))
            notifyBatchUpdateError(shiftIds.length, result.error)
          } else {
            dispatch(clearSelection())
            
            // Handle partial success
            if (result.notFound && result.notFound.length > 0) {
              const successCount = result.updated || 0
              const failedCount = result.notFound.length
              notifyPartialBatchUpdate(successCount, failedCount, status)
            } else {
              notifyBatchShiftsUpdated(result.updated || shiftIds.length, status)
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          dispatch(setError(errorMessage))
          notifyBatchUpdateError(shiftIds.length, errorMessage)
        }
      })
    },
    [updateOptimisticShifts, dispatch, startTransition, notifyBatchShiftsUpdated, notifyBatchUpdateError, notifyPartialBatchUpdate]
  )

  // RTK actions for client-side state only
  const handleToggleSelection = useCallback(
    (shiftId: string) => {
      dispatch(toggleShiftSelection(shiftId))
    },
    [dispatch]
  )

  const handleSelectAll = useCallback(
    (shiftIds: string[]) => {
      dispatch(selectAllShifts(shiftIds))
    },
    [dispatch]
  )

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelection())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    // Optimistic state for RSC server actions
    shifts: optimisticShifts,
    selectedShifts,
    pendingShifts: optimisticShifts.filter(shift => shift.status === 'PENDING'),
    
    // RTK UI states
    isLoading: isPending, // Server Action pending state
    error,
    
    // Derived states
    isShiftSelected,
    canUpdateShift,
    hasSelectedShifts,
    selectedCount,
    
    // Server Actions handlers with useOptimistic
    handleUpdateShift,
    handleBatchUpdate,
    
    // Client-side actions handlers with RTK
    handleToggleSelection,
    handleSelectAll,
    handleClearSelection,
    handleClearError,
  }
}
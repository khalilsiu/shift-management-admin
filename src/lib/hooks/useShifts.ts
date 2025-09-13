import { useCallback, useOptimistic, useTransition } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  toggleShiftSelection,
  selectAllShifts,
  clearSelection,
  setError,
  clearError,
  selectShifts,
  selectSelectedShifts,
  selectError,
  selectPendingShifts,
  selectSelectedShiftsList,
  selectCaregiverNames,
} from '@/lib/features/shiftsSlice'
import { updateShiftStatus, batchUpdateShifts } from '@/lib/actions/shifts'
import type { Shift } from '@/types/shift'

// Custom hook combining useOptimistic + RTK best practices
// Search is now handled by URL state, not RTK global state
export const useShifts = () => {
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  
  // RTK selectors for client state only (no search/filter state)
  const shifts = useAppSelector(selectShifts)
  const selectedShifts = useAppSelector(selectSelectedShifts)
  const error = useAppSelector(selectError)
  const pendingShifts = useAppSelector(selectPendingShifts)
  const selectedShiftsList = useAppSelector(selectSelectedShiftsList)
  const caregiverNames = useAppSelector(selectCaregiverNames)

  // ✅ React useOptimistic for Server Action optimistic updates
  const [optimisticShifts, updateOptimisticShifts] = useOptimistic<
    Shift[],
    { type: 'update'; shiftId: string; status: 'CONFIRMED' | 'DECLINED' } |
    { type: 'batchUpdate'; shiftIds: string[]; status: 'CONFIRMED' | 'DECLINED' }
  >(
    shifts, // Base state from RTK (already filtered by RSC)
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

  // ✅ Server Action with useOptimistic: Update single shift
  const handleUpdateShift = useCallback(
    (shiftId: string, status: 'CONFIRMED' | 'DECLINED', updatedBy: string = 'admin_001') => {
      // Execute both optimistic update and Server Action inside startTransition
      startTransition(async () => {
        try {
          // 1. Optimistic update using React's useOptimistic (inside transition)
          updateOptimisticShifts({ type: 'update', shiftId, status })
          
          dispatch(clearError())
          
          // 2. Execute Server Action
          const result = await updateShiftStatus(shiftId, status, updatedBy)
          
          if (!result.success) {
            dispatch(setError(result.error || 'Failed to update shift'))
            // useOptimistic automatically reverts on Server Action completion
          } else {
            dispatch(clearSelection())
          }
        } catch (error) {
          dispatch(setError(error instanceof Error ? error.message : 'Unknown error'))
          // useOptimistic automatically reverts on error
        }
      })
    },
    [updateOptimisticShifts, dispatch, startTransition]
  )

  // ✅ Server Action with useOptimistic: Batch update shifts
  const handleBatchUpdate = useCallback(
    (shiftIds: string[], status: 'CONFIRMED' | 'DECLINED', updatedBy: string = 'admin_001') => {
      // Execute both optimistic update and Server Action inside startTransition
      startTransition(async () => {
        try {
          // 1. Optimistic update using React's useOptimistic (inside transition)
          updateOptimisticShifts({ type: 'batchUpdate', shiftIds, status })
          
          dispatch(clearError())
          
          // 2. Execute Server Action
          const result = await batchUpdateShifts(shiftIds, status, updatedBy)
          
          if (!result.success) {
            dispatch(setError(result.error || 'Failed to batch update shifts'))
            // useOptimistic automatically reverts on Server Action completion
          } else {
            // Clear selection after successful batch update
            dispatch(clearSelection())
          }
        } catch (error) {
          dispatch(setError(error instanceof Error ? error.message : 'Unknown error'))
          // useOptimistic automatically reverts on error
        }
      })
    },
    [updateOptimisticShifts, dispatch, startTransition]
  )

  // ✅ RTK actions for client-side state only
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
    // ✅ Data: useOptimistic for mutations, RSC handles search/filtering
    shifts: optimisticShifts, // Use optimistic version for UI
    selectedShifts,
    selectedShiftsList,
    pendingShifts: optimisticShifts.filter(shift => shift.status === 'PENDING'),
    caregiverNames,
    
    // ✅ UI State: RTK manages client-side state only
    isLoading: isPending, // Server Action pending state
    error,
    
    // ✅ Computed state: Based on optimistic data
    isShiftSelected,
    canUpdateShift,
    hasSelectedShifts,
    selectedCount,
    
    // ✅ Server Actions with useOptimistic
    handleUpdateShift,
    handleBatchUpdate,
    
    // ✅ Client-side actions with RTK
    handleToggleSelection,
    handleSelectAll,
    handleClearSelection,
    handleClearError,
  }
}
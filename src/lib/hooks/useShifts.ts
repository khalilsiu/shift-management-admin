import { useOptimistic, useTransition } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import {
  toggleShiftSelection,
  selectAllShifts,
  clearSelection,
  selectShifts,
  selectSelectedShifts,
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
    notifyBatchOptimisticUpdate,
  } = useShiftNotifications()

  // RTK selectors for client state only
  const shifts = useAppSelector(selectShifts)
  const selectedShifts = useAppSelector(selectSelectedShifts)

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
  const isShiftSelected = (shiftId: string) => selectedShifts.includes(shiftId)

  const canUpdateShift = (shiftId: string) => {
    const shift = optimisticShifts.find(s => s.id === shiftId)
    return shift?.status === 'PENDING'
  }

  const hasSelectedShifts = selectedShifts.length > 0
  const selectedCount = selectedShifts.length


  // Server Action with useOptimistic
  const handleUpdateShift = (shiftId: string, status: 'CONFIRMED' | 'DECLINED', updatedBy: string = 'admin_001') => {
    // Find shift for notifications
    const shift = optimisticShifts.find(s => s.id === shiftId)
    const caregiverName = shift?.caregiver_name || 'Unknown'

    // 1. Show optimistic notification
    notifyOptimisticUpdate(caregiverName, status)

    startTransition(async () => {
      try {
        // 2. Optimistic update using React's useOptimistic (inside transition)
        updateOptimisticShifts({ type: 'update', shiftId, status })

        // 3. Execute Server Action
        const result = await updateShiftStatus(shiftId, status, updatedBy)

        if (!result.success) {
          notifyShiftUpdateError(caregiverName, result.error)
          // useOptimistic automatically reverts on Server Action completion
        } else {
          dispatch(clearSelection())
          notifyShiftUpdated(caregiverName, status)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        notifyShiftUpdateError(caregiverName, errorMessage)
        // useOptimistic automatically reverts on error
      }
    })
  }

  // Server Action with useOptimistic
  const handleBatchUpdate = (shiftIds: string[], status: 'CONFIRMED' | 'DECLINED', updatedBy: string = 'admin_001') => {
    // 1. Show batch optimistic notification
    notifyBatchOptimisticUpdate(shiftIds.length, status)

    startTransition(async () => {
      try {
        // 2. Optimistic update
        updateOptimisticShifts({ type: 'batchUpdate', shiftIds, status })

        // 3. Execute Server Action
        const result = await batchUpdateShifts(shiftIds, status, updatedBy)

        if (!result.success) {
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
        notifyBatchUpdateError(shiftIds.length, errorMessage)
      }
    })
  }

  // RTK actions for client-side state only
  const handleToggleSelection = (shiftId: string) => {
    dispatch(toggleShiftSelection(shiftId))
  }

  const handleSelectAll = (shiftIds: string[]) => {
    dispatch(selectAllShifts(shiftIds))
  }

  const handleClearSelection = () => {
    dispatch(clearSelection())
  }

  return {
    // Optimistic state for RSC server actions
    shifts: optimisticShifts,
    selectedShifts,
    pendingShifts: optimisticShifts.filter(shift => shift.status === 'PENDING'),

    // RTK UI states
    isLoading: isPending, // Server Action pending state

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
  }
}
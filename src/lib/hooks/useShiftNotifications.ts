'use client'

import { useCallback } from 'react'
import { useNotifications } from '../providers'
import { toProperCase } from '../utils'




export const useShiftNotifications = () => {
  const { addNotification } = useNotifications()

  /**
   * Show success notification when shift is updated
   */
  const notifyShiftUpdated = useCallback((
    caregiverName: string,
    status: 'CONFIRMED' | 'DECLINED',
  ) => {
    const statusText = toProperCase(status)
    
    addNotification({
      type: 'success',
      title: 'Shift Updated Successfully',
      message: `${caregiverName}'s shift has been ${statusText.toLowerCase()}`,
      duration: 4000,
    })
  }, [addNotification])

  /**
   * Show success notification when multiple shifts are updated
   */
  const notifyBatchShiftsUpdated = useCallback((
    count: number,
    status: 'CONFIRMED' | 'DECLINED'
  ) => {
    const statusText = toProperCase(status)
    
    addNotification({
      type: 'success',
      title: 'Shifts Updated Successfully',
      message: `${count} shift${count !== 1 ? 's' : ''} ${statusText.toLowerCase()}`,
      duration: 4000,
    })
  }, [addNotification])

  /**
   * Show error notification when shift update fails
   */
  const notifyShiftUpdateError = useCallback((
    caregiverName?: string,
    errorMessage?: string
  ) => {
    addNotification({
      type: 'error',
      title: 'Failed to Update Shift',
      message: caregiverName 
        ? `Could not update ${caregiverName}'s shift. ${errorMessage || 'Please try again.'}`
        : `Shift update failed. ${errorMessage || 'Please try again.'}`,
      duration: 6000, // Longer duration for errors
    })
  }, [addNotification])

  /**
   * Show error notification when batch update fails
   */
  const notifyBatchUpdateError = useCallback((
    attemptedCount: number,
    errorMessage?: string
  ) => {
    addNotification({
      type: 'error',
      title: 'Failed to Update Shifts',
      message: `Could not update ${attemptedCount} shift${attemptedCount !== 1 ? 's' : ''}. ${errorMessage || 'Please try again.'}`,
      duration: 6000,
    })
  }, [addNotification])

  /**
   * Show warning notification when some shifts in batch update fail
   */
  const notifyPartialBatchUpdate = useCallback((
    successCount: number,
    failedCount: number,
    status: 'CONFIRMED' | 'DECLINED'
  ) => {
    const statusText = toProperCase(status)
    
    addNotification({
      type: 'warning',
      title: 'Partial Update Completed',
      message: `${successCount} shift${successCount !== 1 ? 's' : ''} ${statusText.toLowerCase()}, but ${failedCount} failed to update`,
      duration: 6000,
    })
  }, [addNotification])

  /**
   * Show info notification for optimistic updates
   */
  const notifyOptimisticUpdate = useCallback((
    caregiverName: string,
    status: 'CONFIRMED' | 'DECLINED'
  ) => {
    const statusText = toProperCase(status)
    
    addNotification({
      type: 'info',
      title: 'Updating Shift...',
      message: `${statusText}ing ${caregiverName}'s shift`,
      duration: 2000, // Short duration for optimistic updates
    })
  }, [addNotification])

  return {
    notifyShiftUpdated,
    notifyBatchShiftsUpdated,
    notifyShiftUpdateError,
    notifyBatchUpdateError,
    notifyPartialBatchUpdate,
    notifyOptimisticUpdate,
  }
}

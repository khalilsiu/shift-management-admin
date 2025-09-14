'use client'

import { useShifts } from '@/lib/hooks/useShifts'
import { parseISO, differenceInHours, format } from 'date-fns'
import { toProperCase } from '@/lib/utils/toProperCase'
import { cn } from '@/lib/design-system'
import type { Shift } from '@/types/shift'

interface ShiftCardProps {
  shift?: Shift
  isLoading?: boolean
}

// Skeleton component that matches exact ShiftCard structure
const ShiftCardSkeleton = () => {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      {/* Date header skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-24 h-5 bg-gray-300 rounded animate-pulse" />
      </div>
      
      {/* Time and caregiver skeleton */}
      <div className="space-y-2">
        <div className="w-32 h-4 bg-gray-300 rounded animate-pulse" />
        <div className="w-40 h-4 bg-gray-300 rounded animate-pulse" />
        
        {/* Role indicator skeleton */}
        <div className="flex items-center space-x-2 mt-3">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex space-x-2 mt-3">
          <div className="w-16 h-8 bg-gray-300 rounded animate-pulse" />
          <div className="w-16 h-8 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export const ShiftCard = ({ shift, isLoading = false }: ShiftCardProps) => {
  // Return skeleton if loading
  if (isLoading || !shift) {
    return <ShiftCardSkeleton />
  }

  const {
    handleUpdateShift,
    handleToggleSelection,
    isShiftSelected,
    canUpdateShift,
  } = useShifts()

  const isSelected = isShiftSelected(shift.id)
  const canUpdate = canUpdateShift(shift.id)
  const isPending = shift.status === 'PENDING'

  // Check if shift is held (created less than 24 hours ago)
  const isHeldShift = differenceInHours(new Date(), parseISO(shift.created_at)) < 24

  const handleConfirmClick = () => {
    handleUpdateShift(shift.id, 'CONFIRMED', 'admin_001') // TODO: Replace with actual admin ID
  }

  const handleDeclineClick = () => {
    handleUpdateShift(shift.id, 'DECLINED', 'admin_001') // TODO: Replace with actual admin ID
  }

  const handleCheckboxChange = () => {
    if (isPending) {
      handleToggleSelection(shift.id)
    }
  }

  const getStatusColor = () => {
    switch (shift.status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'DECLINED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className={`flex items-center space-x-4 bg-white p-4 transition-all border-b border-gray-200 last:border-b-0 ${isSelected ? 'shadow-md' : 'hover:bg-gray-50'
      }`}>

      {/* Selection checkbox */}

      <input
        type="checkbox"
        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        checked={isSelected}
        onChange={handleCheckboxChange}
        disabled={!isPending}
        aria-label={`Select shift for ${shift.caregiver_name}`}
      />


      {/* Main content */}
      <div>
        {/* Time */}
        <div className="text-xs font-medium text-gray-900 mb-1">
          {format(parseISO(shift.start_time), 'HH:mm')} - {format(parseISO(shift.end_time), 'HH:mm')}
        </div>

        {/* Caregiver info */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-gray-900 font-medium">
            {shift.caregiver_name}
          </span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${shift.role === "ST" ? "bg-cyan-500" : "bg-pink-300"}`}></div>
          <span className="text-xs font-medium text-gray-900">
            {shift.role}
          </span>
        </div>

        {/* Status and actions */}
        <div className="flex items-center justify-between">
          {!isPending && <div className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
            <span>{toProperCase(shift.status)}</span>
          </div>}

          {/* Action buttons */}
          {canUpdate && (
            <div className="flex items-center space-x-2">
              <button
                className="inline-flex items-center px-3 py-1 bg-white border border-red-700 text-red-700 text-xs font-medium rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                onClick={handleDeclineClick}
                type="button"
                aria-label={`Decline shift for ${shift.caregiver_name}`}
              >
                Decline
              </button>

              <button
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                onClick={handleConfirmClick}
                type="button"
                aria-label={`Confirm shift for ${shift.caregiver_name}`}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

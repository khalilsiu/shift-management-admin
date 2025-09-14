'use client'

import { useShifts } from '@/lib/hooks/useShifts'
import { ShiftCardStatic } from './ShiftCardStatic'
import type { Shift } from '@/types/shift'

interface ShiftCardProps {
  shift?: Shift
  isLoading?: boolean
}

// Skeleton component that matches exact ShiftCard structure
const ShiftCardSkeleton = () => {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="w-24 h-5 bg-gray-300 rounded animate-pulse" />
      </div>
      
      <div className="space-y-2">
        <div className="w-32 h-4 bg-gray-300 rounded animate-pulse" />
        <div className="w-40 h-4 bg-gray-300 rounded animate-pulse" />
        
        <div className="flex items-center space-x-2 mt-3">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-8 h-4 bg-gray-300 rounded animate-pulse" />
        </div>
        
        <div className="flex space-x-2 mt-3">
          <div className="w-16 h-8 bg-gray-300 rounded animate-pulse" />
          <div className="w-16 h-8 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export const ShiftCard = ({ shift, isLoading = false }: ShiftCardProps) => {
  const {
    handleUpdateShift,
    handleToggleSelection,
    isShiftSelected,
    canUpdateShift,
  } = useShifts()

  // Return skeleton if loading (after hooks are called)
  if (isLoading || !shift) {
    return <ShiftCardSkeleton />
  }

  const isSelected = isShiftSelected(shift.id)
  const canUpdate = canUpdateShift(shift.id)
  const isPending = shift.status === 'PENDING'

  const handleConfirmClick = () => {
    handleUpdateShift(shift.id, 'CONFIRMED', 'admin_001')
  }

  const handleDeclineClick = () => {
    handleUpdateShift(shift.id, 'DECLINED', 'admin_001')
  }

  const handleCheckboxChange = () => {
    if (isPending) {
      handleToggleSelection(shift.id)
    }
  }

  return (
    <div className={`flex items-center space-x-4 bg-white p-4 transition-all border-b border-gray-200 last:border-b-0 ${isSelected ? 'shadow-md' : 'hover:bg-gray-50'}`}>
      <input
        type="checkbox"
        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        checked={isSelected}
        onChange={handleCheckboxChange}
        disabled={!isPending}
        aria-label={`Select shift for ${shift.caregiver_name}`}
      />

      {/* Static content rendered on server */}
      <ShiftCardStatic shift={shift} isSelected={isSelected}>
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
      </ShiftCardStatic>
    </div>
  )
}

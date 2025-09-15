'use client'

import { useShifts } from '@/lib/hooks/useShifts'
import { ShiftCardStatic } from './ShiftCardStatic'
import { cn, shiftCardVariants, buttonVariants, checkboxVariants, getShiftCardState } from '@/lib/design-system'
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
    isLoading: isUpdatingShift,
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
    <div className={cn(
      shiftCardVariants({ 
        state: getShiftCardState(shift, isSelected),
        status: shift.status.toLowerCase() as 'pending' | 'confirmed' | 'declined'
      })
    )}>
      <input
        type="checkbox"
        className={cn(
          checkboxVariants({ 
            size: 'md', 
            color: 'primary',
            state: !isPending ? 'disabled' : 'default'
          })
        )}
        checked={isSelected}
        onChange={handleCheckboxChange}
        disabled={!isPending || isUpdatingShift}
        aria-label={`Select shift for ${shift.caregiver_name}`}
      />

      {/* Static content rendered on server */}
      <ShiftCardStatic shift={shift} isSelected={isSelected}>
        {canUpdate && (
          <div className="flex items-center space-x-2">
            <button
              className={cn(
                buttonVariants({ 
                  variant: 'dangerOutline', 
                  size: 'sm' 
                })
              )}
              onClick={handleDeclineClick}
              type="button"
              aria-label={`Decline shift for ${shift.caregiver_name}`}
            >
              Decline
            </button>

            <button
              className={cn(
                buttonVariants({ 
                  variant: 'success', 
                  size: 'sm' 
                })
              )}
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

'use client'

import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { DateGroup } from './DateGroup'
import { ShiftCard } from './ShiftCard'
import { useShifts } from '@/lib/hooks/useShifts'
import { CheckSquare, Square } from 'lucide-react'
import { cn, cardVariants, buttonVariants, typography, spacing, components } from '@/lib/design-system'
import type { Shift } from '@/types/shift'

interface MonthGroupProps {
  monthKey: string // YYYY-MM format
  shifts: Shift[]
  isLoading?: boolean
}

// Skeleton component that matches exact MonthGroup structure
const MonthGroupSkeleton = ({ monthKey }: { monthKey: string }) => {
  const monthLabel = format(parseISO(`${monthKey}-01`), 'MMMM yyyy')
  
  return (
    <div className={cn(
      cardVariants({ shadow: 'sm' }),
      components.monthCard.mobile,
      components.monthCard.tablet,
      components.monthCard.desktop,
      'bg-gray-50 border-gray-200 flex-shrink-0'
    )}>
      {/* Month header skeleton */}
      <div className={cn(
        'flex items-center justify-between bg-gray-200 rounded-t-lg',
        spacing.card.mobile
      )}>
        <div className="flex items-center space-x-1">
          <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
          <div className="w-32 h-6 bg-gray-300 rounded animate-pulse" />
          <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="w-20 h-8 bg-gray-300 rounded animate-pulse" />
      </div>

      {/* Date groups skeleton */}
      <div className="p-4 space-y-4">
        {/* Generate 2-4 skeleton shift cards */}
        {[1, 2, 3].map((i) => (
          <ShiftCard key={`skeleton-${i}`} isLoading={true} />
        ))}
      </div>
    </div>
  )
}

export const MonthGroup = ({ monthKey, shifts, isLoading = false }: MonthGroupProps) => {
  // Return skeleton if loading
  if (isLoading) {
    return <MonthGroupSkeleton monthKey={monthKey} />
  }

  const { handleSelectAll, handleClearSelection, selectedShifts, handleBatchUpdate } = useShifts()
  
  const monthLabel = format(parseISO(`${monthKey}-01`), 'MMMM yyyy')
  
  // Group shifts by date
  const shiftsByDate = useMemo(() => {
    const groups = new Map<string, Shift[]>()
    
    shifts.forEach((shift) => {
      const date = new Date(shift.start_time).toISOString().split('T')[0]
      if (!groups.has(date)) {
        groups.set(date, [])
      }
      groups.get(date)!.push(shift)
    })
    
    // Convert to array and sort by date
    return Array.from(groups.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, dateShifts]) => ({ date, shifts: dateShifts }))
  }, [shifts])

  // Count pending shifts and held shifts
  const pendingShifts = shifts.filter(shift => shift.status === 'PENDING')
  const heldShiftsCount = shifts.length

  // Check if all pending shifts in this month are selected
  const allPendingSelected = pendingShifts.length > 0 && 
    pendingShifts.every(shift => selectedShifts.includes(shift.id))

  // Check if any pending shifts in this month are selected
  const selectedPendingShifts = pendingShifts.filter(shift => selectedShifts.includes(shift.id))
  const hasSelectedPendingShifts = selectedPendingShifts.length > 0

  const handleMonthSelectAll = () => {
    if (allPendingSelected) {
      // If all are selected, clear selection for this month
      const pendingIds = pendingShifts.map(shift => shift.id)
      pendingIds.forEach(id => {
        if (selectedShifts.includes(id)) {
          // This would need to be implemented in the store
          handleClearSelection()
        }
      })
    } else {
      // Select all pending shifts in this month
      const pendingIds = pendingShifts.map(shift => shift.id)
      handleSelectAll(pendingIds)
    }
  }

  return (
    <div className={cn(
      cardVariants({ shadow: 'sm' }),
      components.monthCard.mobile,
      components.monthCard.tablet,
      components.monthCard.desktop,
      'bg-gray-50 border-gray-200 flex-shrink-0'
    )}>
      {/* Month header */}
      <div className={cn(
        'flex items-center justify-between bg-gray-200 rounded-t-lg',
        spacing.card.mobile
      )}>
        <div className="flex items-center space-x-1">
          <button
            className="flex items-center space-x-2 hover:bg-gray-100 rounded p-1 transition-colors"
            onClick={handleMonthSelectAll}
            type="button"
            aria-label={`${allPendingSelected ? 'Deselect' : 'Select'} all pending shifts in ${monthLabel}`}
            disabled={pendingShifts.length === 0}
          >
            {allPendingSelected ? (
              <CheckSquare className="h-5 w-5 text-blue-600" />
            ) : (
              <Square className="h-5 w-5 text-gray-400" />
            )}
            <h2 className={cn(typography.body.large, 'font-semibold text-gray-900')}>
              {monthLabel}
            </h2>
          </button>
          
          <span className={cn(typography.body.small, 'text-gray-500')}>
            ({heldShiftsCount} held shift{heldShiftsCount !== 1 ? 's' : ''})
          </span>
        </div>

        {/* Confirm button for month */}
        {pendingShifts.length > 0 && (
          <button
            className={cn(
              buttonVariants({ 
                variant: hasSelectedPendingShifts ? 'success' : 'ghost',
                size: 'sm',
                responsive: 'auto'
              }),
              !hasSelectedPendingShifts && 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
            onClick={() => {
              if (hasSelectedPendingShifts) {
                const pendingIds = selectedPendingShifts.map(shift => shift.id)
                // This would trigger the bulk confirm action for selected shifts
                handleBatchUpdate(pendingIds, 'CONFIRMED')
              }
            }}
            disabled={!hasSelectedPendingShifts}
            type="button"
            aria-label={
              hasSelectedPendingShifts 
                ? `Confirm ${selectedPendingShifts.length} selected pending shift${selectedPendingShifts.length !== 1 ? 's' : ''} in ${monthLabel}`
                : `No shifts selected in ${monthLabel}`
            }
          >
            Confirm {hasSelectedPendingShifts && `(${selectedPendingShifts.length})`}
          </button>
        )}
      </div>

      {/* Date groups */}
      <div>
        {shiftsByDate.map(({ date, shifts: dateShifts }) => (
          <DateGroup
            key={date}
            date={date}
            shifts={dateShifts}
          />
        ))}
      </div>
    </div>
  )
}

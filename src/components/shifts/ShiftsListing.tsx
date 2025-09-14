'use client'

import { useMemo } from 'react'
import { useShifts } from '@/lib/hooks/useShifts'
import { MonthGroup } from './MonthGroup'
import { HorizontalScrollContainer } from '@/components/ui/HorizontalScrollContainer'
import { format, parseISO } from 'date-fns'
import { Loader2, AlertCircle } from 'lucide-react'
import { cn, containerVariants, spacing, layout } from '@/lib/design-system'

export const ShiftsListing = () => {
  const {
    shifts,
    isLoading,
    error,
    handleClearError,
  } = useShifts()


  // Group shifts by month
  const shiftsByMonth = useMemo(() => {
    const groups = new Map<string, typeof shifts>()
    
    shifts.forEach((shift) => {
      const monthKey = format(parseISO(shift.start_time), 'yyyy-MM')
      if (!groups.has(monthKey)) {
        groups.set(monthKey, [])
      }
      groups.get(monthKey)!.push(shift)
    })
    
    // Convert to array and sort by month
    return Array.from(groups.entries())
      .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
      .map(([monthKey, shifts]) => ({ monthKey, shifts }))
  }, [shifts])

  // Mobile-first: Always single column on mobile, horizontal scroll on desktop only
  const shouldUseHorizontalScroll = shiftsByMonth.length >= 3


  if (isLoading && shifts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading shifts...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Error message */}
      {error && (
        <div className={cn(
          containerVariants({ spacing: 'normal' }),
          'mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'
        )}>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                onClick={handleClearError}
                type="button"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={cn(containerVariants({ spacing: 'normal' }), spacing.section.mobile, spacing.section.tablet)}>
        {shifts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">No shifts found</h3>
              <p className="text-sm">
                Try adjusting your search criteria or check back later.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile-first layout: Single column on mobile, horizontal scroll on desktop */}
            <div className="block lg:hidden">
              {/* Mobile: Single column, vertical scroll */}
              <div className={cn(layout.flex.column, spacing.gap.mobile)}>
                {shiftsByMonth.map(({ monthKey, shifts }) => (
                  <MonthGroup
                    key={monthKey}
                    monthKey={monthKey}
                    shifts={shifts}
                  />
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              {/* Desktop: Horizontal scroll for 3+ months, grid for fewer */}
              {shouldUseHorizontalScroll ? (
                <HorizontalScrollContainer className="pb-4">
                  <div className="flex gap-6 min-w-max">
                    {shiftsByMonth.map(({ monthKey, shifts }) => (
                      <MonthGroup
                        key={monthKey}
                        monthKey={monthKey}
                        shifts={shifts}
                      />
                    ))}
                  </div>
                </HorizontalScrollContainer>
              ) : (
                <div className={cn(layout.grid.desktop, spacing.gap.desktop)}>
                  {shiftsByMonth.map(({ monthKey, shifts }) => (
                    <MonthGroup
                      key={monthKey}
                      monthKey={monthKey}
                      shifts={shifts}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Loading indicator for additional data */}
            {isLoading && (
              <div className={cn(layout.flex.center, 'py-8')}>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">Updating...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

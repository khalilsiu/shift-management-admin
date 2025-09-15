import { memo } from 'react'
import { parseISO, format } from 'date-fns'
import { toProperCase } from '@/lib/utils/toProperCase'
import { cn, typography, statusBadgeVariants, getStatusStyles } from '@/lib/design-system'
import type { Shift } from '@/types/shift'

interface ShiftCardStaticProps {
  shift: Shift
  isSelected?: boolean
  children: React.ReactNode // Slot for interactive elements
}


const ShiftCardStaticComponent = ({ shift, children }: ShiftCardStaticProps) => {
  const isPending = shift.status === 'PENDING'

  return (
    <div className="flex-1">
      <div>
        <div className={`${typography.body.small} text-gray-900 mb-1`}>
          {format(parseISO(shift.start_time), 'h:mmaaa')} - {format(parseISO(shift.end_time), 'h:mmaaa')}
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <span className={`${typography.body.small} text-gray-900`}>
            {shift.caregiver_name}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${shift.role === "ST" ? "bg-cyan-500" : "bg-pink-300"}`}></div>
          <span className={`${typography.body.small} text-gray-900`}>
            {shift.role}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {!isPending && (
            <div className={cn(
              statusBadgeVariants({ 
                status: shift.status.toLowerCase() as 'confirmed' | 'declined',
                size: 'sm'
              })
            )}>
              <span>{toProperCase(shift.status)}</span>
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  )
}

// Memoized ShiftCardStatic - only re-renders when shift data changes
export const ShiftCardStatic = memo(ShiftCardStaticComponent)

import { memo } from 'react'
import { parseISO, format } from 'date-fns'
import { toProperCase } from '@/lib/utils/toProperCase'
import { typography } from '@/lib/design-system'
import type { Shift } from '@/types/shift'

interface ShiftCardStaticProps {
  shift: Shift
  isSelected?: boolean
  children: React.ReactNode // Slot for interactive elements
}


const ShiftCardStaticComponent = ({ shift, children }: ShiftCardStaticProps) => {
  const isPending = shift.status === 'PENDING'

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
            <div className={`inline-flex items-center px-3 py-1 rounded ${typography.label.small} ${getStatusColor()}`}>
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

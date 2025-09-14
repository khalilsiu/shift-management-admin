import { memo } from 'react'
import { format, parseISO } from 'date-fns'
import { ShiftCard } from '../shift-card'
import type { Shift } from '@/types/shift'

interface DateGroupProps {
  date: string // YYYY-MM-DD format
  shifts: Shift[]
}

const DateGroupComponent = ({ date, shifts }: DateGroupProps) => {
  const formattedDate = format(parseISO(date), 'dd MMMM')
  
  const sortedShifts = [...shifts].sort((a, b) => 
    a.start_time.localeCompare(b.start_time)
  )

  return (
    <div>
      <div className="bg-gray-100 p-1">
        <h3 className="text-xs font-medium text-gray-600">
          {formattedDate}
        </h3>
      </div>

      <div>
        {sortedShifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
          />
        ))}
      </div>
    </div>
  )
}

// Memoized DateGroup - only re-renders when date or shifts change
export const DateGroup = memo(DateGroupComponent)

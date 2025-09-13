import { readFileSync } from 'fs'
import { join } from 'path'
import { Shift, ShiftSearchParams } from '@/types/shift'

/**
 * Read shifts directly from the JSON file
 * This is a server-side only function for RSC data fetching
 */
const getShiftsFromFile = (): Shift[] => {
  const filePath = join(process.cwd(), 'src', 'data', 'shifts.json')
  const fileContents = readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents)
  return data.shifts
}

/**
 * Filter shifts based on search parameters
 */
const filterShifts = (shifts: Shift[], params: ShiftSearchParams): Shift[] => {
  let filtered = [...shifts]

  // Filter by caregiver name
  if (params.caregiver?.trim()) {
    filtered = filtered.filter(shift =>
      shift.caregiver_name.toLowerCase().includes(params.caregiver!.toLowerCase())
    )
  }

  // Filter by status
  if (params.status) {
    filtered = filtered.filter(shift => shift.status === params.status)
  }

  // Filter by role
  if (params.role) {
    filtered = filtered.filter(shift => shift.role === params.role)
  }

  // Filter by date range
  if (params.date_from) {
    filtered = filtered.filter(shift => {
      const shiftDate = new Date(shift.start_time).toISOString().split('T')[0]
      return shiftDate >= params.date_from!
    })
  }

  if (params.date_to) {
    filtered = filtered.filter(shift => {
      const shiftDate = new Date(shift.start_time).toISOString().split('T')[0]
      return shiftDate <= params.date_to!
    })
  }

  return filtered
}

/**
 * Sort shifts by start time (earliest first)
 */
const sortShifts = (shifts: Shift[]): Shift[] => {
  return shifts.sort((a, b) => {
    const startTimeA = new Date(a.start_time).getTime()
    const startTimeB = new Date(b.start_time).getTime()
    return startTimeA - startTimeB
  })
}

/**
 * Main function to get shifts with optional filtering
 * Used by RSC pages for server-side data fetching
 */
export const getShifts = async (searchParams: ShiftSearchParams = {}): Promise<{
  data: Shift[]
  total: number
  filtered: number
}> => {
  try {
    // Read all shifts from file
    const allShifts = getShiftsFromFile()
    
    // Apply filters
    const filteredShifts = filterShifts(allShifts, searchParams)
    
    // Sort results
    const sortedShifts = sortShifts(filteredShifts)

    return {
      data: sortedShifts,
      total: allShifts.length,
      filtered: sortedShifts.length
    }
  } catch (error) {
    console.error('Error reading shifts:', error)
    return {
      data: [],
      total: 0,
      filtered: 0
    }
  }
}

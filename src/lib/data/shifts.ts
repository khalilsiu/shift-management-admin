import { readFileSync } from 'fs'
import { join } from 'path'
import { Shift, ShiftSearchParams } from '@/types/shift'
import { cacheUtils, cacheKeys, cacheTTL } from '@/lib/redis'

/**
 * Read shifts directly from the JSON file
 * This is a server-side only function for RSC data fetching
 */
const getShiftsFromFile = (): Shift[] => {
  try {
    const filePath = join(process.cwd(), 'src', 'data', 'shifts.json')
    const fileContents = readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    // Validate data structure
    if (!data.shifts || !Array.isArray(data.shifts)) {
      throw new Error('Invalid shifts data structure')
    }
    
    return data.shifts
  } catch (error) {
    console.error('Error reading shifts file:', error)
    throw new Error(`Failed to read shifts data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Filter shifts based on search parameters
 * Implements early returns for better readability
 */
const filterShifts = (shifts: Shift[], params: ShiftSearchParams): Shift[] => {
  // Early return if no filters
  if (!params.caregiver?.trim()) {
    return shifts
  }

  // Filter by caregiver name with case-insensitive search
  const caregiverQuery = params.caregiver.toLowerCase().trim()
  
  return shifts.filter(shift =>
    shift.caregiver_name.toLowerCase().includes(caregiverQuery)
  )
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
 * Get shifts from file system (cache fallback function)
 * This function is called only on cache misses
 */
const getShiftsFromSource = async (searchParams: ShiftSearchParams): Promise<{
  data: Shift[]
  total: number
  filtered: number
}> => {
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
}

/**
 * Main function to get shifts with Redis caching
 * Used by RSC pages for server-side data fetching
 * 
 * Cache Strategy:
 * - Cache filtered results for 5 minutes
 * - Use cache-aside pattern with automatic fallback
 * - Generate consistent cache keys based on search parameters
 */
export const getShifts = async (searchParams: ShiftSearchParams = {}): Promise<{
  data: Shift[]
  total: number
  filtered: number
  source: 'cache' | 'database'
}> => {
  try {
    // Generate cache key based on search parameters
    const cacheKey = cacheKeys.shifts.filtered(searchParams)
    
    // Use cache-aside pattern with fallback
    const result = await cacheUtils.getWithFallback(
      cacheKey,
      () => getShiftsFromSource(searchParams),
      cacheTTL.shifts
    )

    return {
      ...result.data,
      source: result.source
    }
  } catch (error) {
    console.error('Error getting shifts:', error)
    
    // Fallback to direct file access on any error
    const fallbackResult = await getShiftsFromSource(searchParams)
    return {
      ...fallbackResult,
      source: 'database' as const
    }
  }
}

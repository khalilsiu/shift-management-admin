'use server'

import { revalidatePath } from 'next/cache'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { cacheUtils } from '@/lib/redis'
import type { Shift } from '@/types/shift'

/**
 * Read shifts from JSON file
 */
const readShiftsFile = (): { shifts: Shift[] } => {
  const filePath = join(process.cwd(), 'src', 'data', 'shifts.json')
  const fileContents = readFileSync(filePath, 'utf8')
  return JSON.parse(fileContents)
}

/**
 * Write shifts to JSON file
 */
const writeShiftsFile = (data: { shifts: Shift[] }): void => {
  const filePath = join(process.cwd(), 'src', 'data', 'shifts.json')
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

/**
 * Invalidate all relevant caches after shift updates
 * Uses comprehensive cache invalidation patterns
 */
const invalidateShiftCaches = async (): Promise<void> => {
  try {
    const patterns = [
      'shifts:*',    // All shift caches
    ]

    await cacheUtils.invalidatePatterns(patterns)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Cache invalidated after shift update')
    }
  } catch (error) {
    console.error('Error invalidating cache:', error)
    // Don't fail the operation if cache invalidation fails
  }
}

/**
 * Server Action: Update single shift status
 */
export const updateShiftStatus = async (
  shiftId: string,
  status: 'CONFIRMED' | 'DECLINED',
  updatedBy: string = 'admin_001'
) => {
  try {
    // Input validation
    if (!shiftId?.trim()) {
      return {
        success: false,
        error: 'Shift ID is required'
      }
    }

    if (!['CONFIRMED', 'DECLINED'].includes(status)) {
      return {
        success: false,
        error: 'Invalid status. Must be CONFIRMED or DECLINED'
      }
    }

    if (!updatedBy?.trim()) {
      return {
        success: false,
        error: 'Updated by field is required'
      }
    }
    
    const data = readShiftsFile()
    
    const shiftIndex = data.shifts.findIndex(shift => shift.id === shiftId)
    
    if (shiftIndex === -1) {
      return {
        success: false,
        error: `Shift with ID ${shiftId} not found`
      }
    }

    // Check if shift is already in the requested status
    if (data.shifts[shiftIndex].status === status) {
      return {
        success: false,
        error: `Shift is already ${status.toLowerCase()}`
      }
    }

    // Update the shift
    data.shifts[shiftIndex] = {
      ...data.shifts[shiftIndex],
      status,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    }

    writeShiftsFile(data)
    
    // Invalidate all relevant caches after update 
    await invalidateShiftCaches()
    
    // Revalidate the page to refresh RSC data
    revalidatePath('/')
    return {
      success: true,
      data: data.shifts[shiftIndex]
    }
  } catch (error) {
    console.error('Error updating shift status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Server Action: Batch update multiple shifts
 */
export const batchUpdateShifts = async (
  shiftIds: string[],
  status: 'CONFIRMED' | 'DECLINED',
  updatedBy: string = 'admin_001'
) => {
  try {
    const data = readShiftsFile()
    
    const updatedShifts: Shift[] = []
    const notFoundIds: string[] = []
    
    shiftIds.forEach(shiftId => {
      const shiftIndex = data.shifts.findIndex(shift => shift.id === shiftId)
      
      if (shiftIndex !== -1) {
        data.shifts[shiftIndex] = {
          ...data.shifts[shiftIndex],
          status,
          updated_at: new Date().toISOString(),
          updated_by: updatedBy
        }
        updatedShifts.push(data.shifts[shiftIndex])
      } else {
        notFoundIds.push(shiftId)
      }
    })

    if (updatedShifts.length === 0) {
      throw new Error(`No shifts found for the provided IDs: ${shiftIds.join(', ')}`)
    }

    writeShiftsFile(data)
    
    // Invalidate all relevant caches after update
    await invalidateShiftCaches()
    
    // Revalidate the page to refresh RSC data
    revalidatePath('/')
    
    return {
      success: true,
      data: updatedShifts,
      updated: updatedShifts.length,
      notFound: notFoundIds
    }
  } catch (error) {
    console.error('Error batch updating shifts:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
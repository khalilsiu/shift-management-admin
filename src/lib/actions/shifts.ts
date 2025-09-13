'use server'

import { revalidatePath } from 'next/cache'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
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
 * Server Action: Update single shift status
 */
export const updateShiftStatus = async (
  shiftId: string,
  status: 'CONFIRMED' | 'DECLINED',
  updatedBy: string = 'admin_001'
) => {
  try {
    // Read current data
    const data = readShiftsFile()
    
    // Find and update the shift
    const shiftIndex = data.shifts.findIndex(shift => shift.id === shiftId)
    
    if (shiftIndex === -1) {
      throw new Error(`Shift with ID ${shiftId} not found`)
    }

    // Update the shift
    data.shifts[shiftIndex] = {
      ...data.shifts[shiftIndex],
      status,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    }

    // Write back to file
    writeShiftsFile(data)
    
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
    // Read current data
    const data = readShiftsFile()
    
    // Track updated shifts
    const updatedShifts: Shift[] = []
    const notFoundIds: string[] = []
    
    // Update each shift
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

    // Write back to file
    writeShiftsFile(data)
    
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

/**
 * Server Action: Create new shift
 */
export const createShift = async (formData: FormData) => {
  try {
    const caregiverName = formData.get('caregiver_name') as string
    const role = formData.get('role') as 'ST' | 'EN'
    const startTime = formData.get('start_time') as string
    const endTime = formData.get('end_time') as string

    // Validation
    if (!caregiverName || !role || !startTime || !endTime) {
      throw new Error('All fields are required')
    }

    // Read current data
    const data = readShiftsFile()
    
    // Generate new ID
    const maxId = Math.max(...data.shifts.map(s => parseInt(s.id.replace('shift_', ''))), 0)
    const newId = `shift_${String(maxId + 1).padStart(3, '0')}`
    
    // Create new shift
    const newShift: Shift = {
      id: newId,
      caregiver_name: caregiverName,
      role,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add to data
    data.shifts.push(newShift)
    
    // Write back to file
    writeShiftsFile(data)
    
    // Revalidate the page
    revalidatePath('/')
    
    return {
      success: true,
      data: newShift
    }
  } catch (error) {
    console.error('Error creating shift:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

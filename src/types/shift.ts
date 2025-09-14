// Core shift data types
export interface Shift {
  id: string
  caregiver_name: string
  role: 'ST' | 'EN'
  start_time: string // ISO datetime format
  end_time: string // ISO datetime format
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED'
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  updated_by?: string // Admin ID who made the change
}

// API request/response types
export interface ShiftUpdateRequest {
  shift_id: string
  status: 'CONFIRMED' | 'DECLINED'
  updated_by: string
}

export interface BatchShiftUpdateRequest {
  shift_ids: string[]
  status: 'CONFIRMED' | 'DECLINED'
  updated_by: string
}

export interface ShiftsApiResponse {
  success: boolean
  data: Shift[]
  count: number
  message?: string
}

export interface ShiftUpdateResponse {
  success: boolean
  data?: Shift
  message: string
}

// Search and filter types
export interface ShiftSearchParams {
  caregiver?: string
}

// Grouped shifts for UI display
export interface MonthGroup {
  monthKey: string // YYYY-MM format
  monthLabel: string // "January 2024"
  shifts: Shift[]
}

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import type { Shift } from '@/types/shift'

// Shifts state interface - search is now handled by URL state
interface ShiftsState {
  shifts: Shift[]
  selectedShifts: string[]
  error: string | null
  lastUpdated: string | null
}

// Initial state
const initialState: ShiftsState = {
  shifts: [],
  selectedShifts: [],
  error: null,
  lastUpdated: null,
}

export const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    // Data hydration from RSC (filtered data comes from server)
    setInitialShifts: (state, action: PayloadAction<Shift[]>) => {
      state.shifts = action.payload
      state.lastUpdated = new Date().toISOString()
    },

    // Selection actions (client-side only)
    toggleShiftSelection: (state, action: PayloadAction<string>) => {
      const shiftId = action.payload
      const currentIndex = state.selectedShifts.indexOf(shiftId)
      
      if (currentIndex >= 0) {
        state.selectedShifts.splice(currentIndex, 1)
      } else {
        state.selectedShifts.push(shiftId)
      }
    },

    selectAllShifts: (state, action: PayloadAction<string[]>) => {
      state.selectedShifts = action.payload
    },

    clearSelection: (state) => {
      state.selectedShifts = []
    },

    // Error states (for Server Action feedback)
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = null
    },
  },
  // No extraReducers needed - Server Actions handle all mutations
})

// Export actions
export const {
  setInitialShifts,
  toggleShiftSelection,
  selectAllShifts,
  clearSelection,
  setError,
  clearError,
} = shiftsSlice.actions

// Export selectors
export const selectShifts = (state: { shifts: ShiftsState }) => state.shifts.shifts
export const selectSelectedShifts = (state: { shifts: ShiftsState }) => state.shifts.selectedShifts
export const selectError = (state: { shifts: ShiftsState }) => state.shifts.error
export const selectLastUpdated = (state: { shifts: ShiftsState }) => state.shifts.lastUpdated

// Computed selectors with proper memoization
export const selectPendingShifts = createSelector(
  [selectShifts],
  (shifts) => shifts.filter(shift => shift.status === 'PENDING')
)

export const selectSelectedShiftsList = createSelector(
  [selectShifts, selectSelectedShifts],
  (shifts, selectedShifts) => shifts.filter(shift => selectedShifts.includes(shift.id))
)

export const selectCaregiverNames = createSelector(
  [selectShifts],
  (shifts) => Array.from(new Set(shifts.map(shift => shift.caregiver_name))).sort()
)

export default shiftsSlice.reducer
'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../store/store'
import { Shift } from '@/types/shift'
import { setInitialShifts } from '../store/shiftsSlice'

interface StoreProviderProps {
  children: React.ReactNode
  initialShifts?: Shift[]
}

export const StoreProvider = ({ children, initialShifts }: StoreProviderProps) => {
  const storeRef = useRef<AppStore>(null)
  
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  // ✅ Move dispatch to useEffect to avoid "setState during render" error
  useEffect(() => {
    if (initialShifts && storeRef.current) {
      storeRef.current.dispatch(setInitialShifts(initialShifts))
    }
  }, [initialShifts])

  return <Provider store={storeRef.current}>{children}</Provider>
}

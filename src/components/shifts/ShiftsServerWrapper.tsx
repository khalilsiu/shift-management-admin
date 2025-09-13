'use client'

import { ShiftsListing } from '@/components/shifts/ShiftsListing'
import { StoreProvider } from '@/lib/StoreProvider'
import { Shift } from '@/types/shift'

interface Props {
  initialShifts: Shift[]
}

export const ShiftsServerWrapper = ({ initialShifts }: Props) => {
  return (
    <StoreProvider initialShifts={initialShifts}>
      <ShiftsListing />
    </StoreProvider>
  )
}
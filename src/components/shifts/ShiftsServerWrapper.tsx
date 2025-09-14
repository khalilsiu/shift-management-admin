'use client'

import { ShiftsListing } from './ShiftsListing'
import { StoreProvider } from '@/lib/providers/StoreProvider'
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
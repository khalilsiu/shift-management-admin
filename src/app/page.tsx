import { Suspense } from 'react'
import { SearchHeader } from "@/components/shifts/SearchHeader"
import { ShiftsServerWrapper } from "@/components/shifts/ShiftsServerWrapper"
import { ShiftsSkeleton } from "@/components/ui/ShiftsSkeleton"
import { getShifts } from "@/lib/data/shifts"
import { ShiftSearchParams } from "@/types/shift"

// Separate RSC component for data fetching
async function ShiftsDataLoader({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const filters: ShiftSearchParams = {
    caregiver: typeof params.caregiver === 'string' ? params.caregiver : undefined
  }

  const shiftsData = await getShifts(filters)
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Shifts loaded from ${shiftsData.source} (${shiftsData.filtered} results)`)
  }
  
  return <ShiftsServerWrapper initialShifts={shiftsData.data} />
}


// Main page with progressive loading
export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* SearchHeader renders immediately */}
      <SearchHeader />
      
      {/* Shifts data loads progressively */}
      <Suspense fallback={<ShiftsSkeleton />}>
        <ShiftsDataLoader searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
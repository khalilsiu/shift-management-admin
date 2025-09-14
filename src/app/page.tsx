import { Suspense } from 'react'
import { SearchHeader } from "@/components/shifts/SearchHeader"
import { ShiftsServerWrapper } from "@/components/shifts/ShiftsServerWrapper"
import { ShiftsSkeleton } from "@/components/ui/ShiftsSkeleton"
import { NotificationTester } from "@/components/dev/NotificationTester"
import { ErrorTrigger } from "@/components/dev/ErrorTrigger"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
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
      {/* SearchHeader with Suspense for useSearchParams */}
      <Suspense fallback={
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      }>
        <SearchHeader />
      </Suspense>
      
      {/* Shifts data loads progressively */}
      <Suspense fallback={<ShiftsSkeleton />}>
        <ShiftsDataLoader searchParams={searchParams} />
      </Suspense>
      
      {/* Development-only testing tools */}
      <NotificationTester />
      
      {/* Error Boundary test trigger wrapped in Error Boundary */}
      <ErrorBoundary>
        <ErrorTrigger />
      </ErrorBoundary>
    </div>
  )
}
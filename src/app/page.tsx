import { ShiftsServerWrapper } from "@/components/shifts/ShiftsServerWrapper"
import { getShifts } from "@/lib/data/shifts"
import { ShiftSearchParams } from "@/types/shift"

// Main page uses RSC to fetch data directly from file system
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await searchParams and convert to our ShiftSearchParams type
  const params = await searchParams
  const filters: ShiftSearchParams = {
    caregiver: typeof params.caregiver === 'string' ? params.caregiver : undefined,
    status: params.status === 'PENDING' || params.status === 'CONFIRMED' || params.status === 'DECLINED' 
      ? params.status : undefined,
    role: params.role === 'ST' || params.role === 'EN' ? params.role : undefined,
    date_from: typeof params.date_from === 'string' ? params.date_from : undefined,
    date_to: typeof params.date_to === 'string' ? params.date_to : undefined,
  }

  // Fetch data directly from file system (RSC best practice)
  const shiftsData = await getShifts(filters)
  
  return <ShiftsServerWrapper initialShifts={shiftsData.data} />
}
import { MonthGroup } from '@/components/shifts/MonthGroup'
import { cn, containerVariants, spacing, layout } from '@/lib/design-system'

/**
 * Generate skeleton data that matches real structure
 */
const generateSkeletonData = () => {
    const currentYear = 2024
    const currentMonth = 0

    // Generate 4 months of skeleton data
    return [
        {
            monthKey: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`,
            shiftCount: 3
        },
        {
            monthKey: `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}`,
            shiftCount: 2
        },
        {
            monthKey: `${currentYear}-${String(currentMonth + 3).padStart(2, '0')}`,
            shiftCount: 4
        },
        {
            monthKey: `${currentYear}-${String(currentMonth + 4).padStart(2, '0')}`,
            shiftCount: 5
        }
    ]
}

const ShiftsSkeletonContent = () => {
    const skeletonMonths = generateSkeletonData()
    return (
        <>
            {/* Mobile-first layout: Single column on mobile, horizontal scroll on desktop */}
            <div className="block lg:hidden">
                {/* Mobile: Single column, vertical scroll */}
                <div className={cn(layout.flex.column, spacing.gap.mobile)}>
                    {skeletonMonths.slice(0, 1).map(({ monthKey }) => (
                        <MonthGroup
                            key={`mobile-skeleton-${monthKey}`}
                            monthKey={monthKey}
                            shifts={[]} // Empty shifts array
                            isLoading={true} // Trigger skeleton mode
                        />
                    ))}
                </div>
            </div>

            <div className="hidden lg:block">
                <div className="pb-4">
                    <div className="flex gap-6 min-w-max">
                        {skeletonMonths.map(({ monthKey }) => (
                            <MonthGroup
                                key={`desktop-horizontal-skeleton-${monthKey}`}
                                monthKey={monthKey}
                                shifts={[]} // Empty shifts array
                                isLoading={true} // Trigger skeleton mode
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

/**
 * Main skeleton component that matches ShiftsListing structure
 */
export const ShiftsSkeleton = () => {
    return (
        <div>
            {/* Main content with same structure as ShiftsListing */}
            <div className={cn(containerVariants({ spacing: 'normal' }), spacing.section.mobile, spacing.section.tablet)}>
                <ShiftsSkeletonContent />
            </div>
        </div>
    )
}

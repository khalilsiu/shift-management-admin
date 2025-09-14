import { Clock } from 'lucide-react'
import { cn } from '@/lib/design-system/variants'
import { containerVariants } from '@/lib/design-system/variants'
import { typography, spacing } from '@/lib/design-system/tokens'

interface SearchHeaderStaticProps {
  children: React.ReactNode 
}

export const SearchHeaderStatic = ({ children }: SearchHeaderStaticProps) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className={cn(containerVariants({ spacing: 'normal' }), spacing.section.mobile)}>
        <h1 className={cn(typography.heading.h1, 'text-gray-900 mb-4 sm:mb-6')}>
          Caregiver Shifts
        </h1>

        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <Clock className="h-4 w-4 text-yellow-400 flex-shrink-0" aria-hidden="true" />
          <span className={cn(typography.body.small, 'text-gray-600')}>
            indicates held shift with less than 24 hours response time
          </span>
        </div>

        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
          <h2 className={cn(typography.label.normal, 'text-gray-700')}>
            Caregiver Name
          </h2>
          
          {children}
        </div>
      </div>
    </div>
  )
}

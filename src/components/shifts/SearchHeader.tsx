'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, Clock, Loader2 } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { cn, containerVariants, inputVariants, typography, spacing } from '@/lib/design-system'

export const SearchHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ✅ Controlled component: Local state for immediate UI updates
  const [searchQuery, setSearchQuery] = useState(() => 
    searchParams.get('caregiver') || ''
  )
  
  // ✅ Debounced value for URL updates (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  // ✅ Show spinner when user is typing but URL hasn't updated yet
  const isSearching = searchQuery !== debouncedSearchQuery
  
  // Derived state
  const hasSearchQuery = searchQuery.length > 0

  // Create query string helper
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      
      return params.toString()
    },
    [searchParams]
  )

  // ✅ Update URL when debounced value changes
  useEffect(() => {
    const queryString = createQueryString('caregiver', debouncedSearchQuery)
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    // Only update URL if it's different from current
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [debouncedSearchQuery, pathname, searchParams, router, createQueryString])

  // ✅ Sync local state when URL changes externally (e.g., browser back/forward)
  // Only sync when URL changes, not when local state changes
  useEffect(() => {
    const urlSearchQuery = searchParams.get('caregiver') || ''
    setSearchQuery(urlSearchQuery)
  }, [searchParams])

  // ✅ Handle input change - immediate local state update
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // ✅ Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

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

        {/* Mobile-first search layout */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
          <h2 className={cn(typography.label.normal, 'text-gray-700')}>
            Caregiver Name
          </h2>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {isSearching ? (
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              )}
            </div>

            <input
              type="text"
              className={cn(
                inputVariants({ size: 'md', width: 'fixed' }),
                'pl-10 pr-10'
              )}
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
              aria-label="Search shifts by caregiver name"
            />

            {hasSearchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                onClick={handleClearSearch}
                type="button"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
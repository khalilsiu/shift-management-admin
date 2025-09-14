'use client'

import { useState, useEffect, useCallback, useTransition, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, Clock, Loader2 } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { cn, containerVariants, inputVariants, typography, spacing } from '@/lib/design-system'

export const SearchHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const initialLoad = useRef(true)
  const isTyping = useRef(false)

  const [searchQuery, setSearchQuery] = useState(() => 
    searchParams.get('caregiver') || ''
  )
  
  const debouncedSearchQuery = useDebounce(searchQuery, 400)
  
  // Show spinner when user is typing or URL is updating
  const isSearching = searchQuery !== debouncedSearchQuery || isPending
  
  const hasSearchQuery = searchQuery.length > 0

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false
      return
    }

    // use transition to async update the url
    startTransition(() => {
      const params = new URLSearchParams()
      
      if (debouncedSearchQuery) {
        params.set('caregiver', debouncedSearchQuery)
      }
      
      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      
      // use router.replace for better performance
      router.replace(newUrl, { scroll: false })
    })
  }, [debouncedSearchQuery, pathname, router])

  // handle external url changes
  useEffect(() => {
    if (!isTyping.current) {
      const urlSearchQuery = searchParams.get('caregiver') || ''
      if (urlSearchQuery !== searchQuery) {
        setSearchQuery(urlSearchQuery)
      }
    }
  }, [searchParams, searchQuery])

  // handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isTyping.current = true
    setSearchQuery(e.target.value)
    
    setTimeout(() => {
      isTyping.current = false
    }, 100)
  }

  const handleClearSearch = useCallback(() => {
    isTyping.current = false
    setSearchQuery('')
    
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }, [pathname, router])

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
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
              {hasSearchQuery && (
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={handleClearSearch}
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {isSearching ? (
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin pointer-events-none" aria-hidden="true" />
              ) : (
                <Search className="h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              )}
            </div>

            <input
              type="text"
              className={cn(
                inputVariants({ size: 'md', width: 'fixed' }),
                'pl-4 pr-16' 
              )}
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
              aria-label="Search shifts by caregiver name"
              autoComplete="off"
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
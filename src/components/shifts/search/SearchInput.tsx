'use client'

import { useState, useEffect, useCallback, useTransition, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { cn, inputVariants } from '@/lib/design-system'

export const SearchInput = () => {
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

  useEffect(() => {
    // Only sync URL to local state if user is NOT actively typing
    if (!isTyping.current) {
      const urlSearchQuery = searchParams.get('caregiver') || ''
      if (urlSearchQuery !== searchQuery) {
        setSearchQuery(urlSearchQuery)
      }
    }
  }, [searchParams, searchQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isTyping.current = true
    setSearchQuery(e.target.value)
    
    // Reset typing flag after a short delay
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
  )
}

'use client'

import { useState, useEffect, useTransition, useRef, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { cn, searchInputVariants, spinnerVariants, getAnimationClasses } from '@/lib/design-system'

export const SearchInput = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Refs to track state
  const initialLoad = useRef(true)
  const isUserTyping = useRef(false)
  const lastUrlUpdate = useRef<string | null>(null)

  // Single source of truth for input value - always controlled by local state
  const [inputValue, setInputValue] = useState(() =>
    searchParams.get('caregiver') || ''
  )

  const debouncedValue = useDebounce(inputValue, 400)

  // Show spinner when debouncing or URL is updating
  const isSearching = (inputValue !== debouncedValue) || isPending

  const hasQuery = inputValue.length > 0

  // Update URL when debounced value changes
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false
      return
    }

    // Prevent infinite loops by checking if this is the same value we just updated
    const targetValue = debouncedValue || ''
    if (lastUrlUpdate.current === targetValue) {
      return
    }

    lastUrlUpdate.current = targetValue

    // use transition to async update the url
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (debouncedValue) {
        params.set('caregiver', debouncedValue)
      } else {
        params.delete('caregiver')
      }

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname

      router.replace(newUrl, { scroll: false })
    })
  }, [debouncedValue, pathname, router, searchParams])


  // Sync URL changes to input
  useEffect(() => {
    // Don't sync if user is actively typing
    if (isUserTyping.current) {
      return
    }

    const urlQuery = searchParams.get('caregiver') || ''

    if (urlQuery !== inputValue && lastUrlUpdate.current !== urlQuery) {
      setInputValue(urlQuery)
      lastUrlUpdate.current = urlQuery
    }
  }, [searchParams, inputValue])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    isUserTyping.current = true

    setInputValue(newValue)

    const timeoutId = setTimeout(() => {
      isUserTyping.current = false
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  // handle clear search
  const handleClearSearch = () => {
    isUserTyping.current = false
    setInputValue('')
    lastUrlUpdate.current = ''

    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
        {hasQuery && (
          <button
            className={cn(
              "text-gray-400 hover:text-gray-600",
              getAnimationClasses('transition', 'colors')
            )}
            onClick={handleClearSearch}
            type="button"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {isSearching ? (
          <Loader2 className={cn(
            spinnerVariants({ size: 'sm', color: 'primary' }),
            "pointer-events-none"
          )} aria-hidden="true" />
        ) : (
          <Search className="h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
        )}
      </div>

      <input
        type="text"
        className={cn(
          searchInputVariants({
            state: isSearching ? 'loading' : 'default',
            size: 'md',
            width: 'fixed'
          }),
          'pl-4 pr-16'
        )}
        placeholder="Search shifts by caregiver name"
        value={inputValue}
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

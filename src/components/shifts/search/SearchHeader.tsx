import React, { Suspense } from 'react'
import { SearchHeaderStatic } from './SearchHeaderStatic'
import { SearchInput } from './SearchInput'
import { cn, searchInputVariants } from '@/lib/design-system'


export const SearchHeader = () => {
  return (
    <SearchHeaderStatic>
      <Suspense fallback={
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className={cn(
            searchInputVariants({ 
              state: 'loading', 
              size: 'md', 
              width: 'fixed' 
            }),
            'pl-4 pr-16 bg-gray-100 animate-pulse border-gray-200'
          )}>
          </div>
        </div>
      }>
        <SearchInput />
      </Suspense>
    </SearchHeaderStatic>
  )
}
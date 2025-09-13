'use client'

import { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useHorizontalScroll } from '@/lib/hooks/useHorizontalScroll'

interface HorizontalScrollContainerProps {
    children: ReactNode
    className?: string
}

export const HorizontalScrollContainer = ({
    children,
    className = ''
}: HorizontalScrollContainerProps) => {
    const {
        scrollContainerRef,
        canScrollLeft,
        canScrollRight,
        isScrollable,
        scrollLeft,
        scrollRight,
    } = useHorizontalScroll()

    return (
        <div className="relative">
            {/* Left scroll indicator - FIXED TO VIEWPORT */}
            {isScrollable && canScrollLeft && (
                <div className="fixed h-full w-12 bg-gradient-to-r from-black/20 to-transparent left-0 top-0 z-40 flex items-center justify-center">
                    <button
                        onClick={scrollLeft}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group"
                        aria-label="Scroll left"
                        type="button"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                    </button>
                </div>
            )}

            {/* Right scroll indicator - FIXED TO VIEWPORT */}
            {isScrollable && canScrollRight && (
                <div className="fixed h-full w-12 bg-gradient-to-l from-black/20 to-transparent right-0 top-0 z-40 flex items-center justify-center">
                    <button
                        onClick={scrollRight}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group"
                        aria-label="Scroll right"
                        type="button"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                    </button>
                </div>
            )}

            {/* Scrollable content */}
            <div
                ref={scrollContainerRef}
                className={`overflow-x-auto scrollbar-hide ${className}`}
            >
                {children}
            </div>
        </div>
    )
}

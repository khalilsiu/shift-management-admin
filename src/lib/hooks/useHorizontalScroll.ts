import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for horizontal scroll with navigation
 */
export const useHorizontalScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  // Check scroll position and update navigation state
  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScrollLeft = scrollWidth - clientWidth

    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < maxScrollLeft)
    setIsScrollable(scrollWidth > clientWidth)
  }, [])

  // Scroll to left
  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8 // Scroll 80% of visible width
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }, [])

  // Scroll to right
  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8 // Scroll 80% of visible width
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }, [])

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Initial check
    updateScrollState()

    // Listen to scroll events
    container.addEventListener('scroll', updateScrollState)
    
    // Listen to resize events (in case container size changes)
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [updateScrollState])

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    isScrollable,
    scrollLeft,
    scrollRight,
  }
}

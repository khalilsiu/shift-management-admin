// Export all design system utilities
export * from './tokens'
export * from './variants'

// Re-export commonly used utilities
export { cn } from './variants'

// Utility functions for design system usage
import { colors, status, animation, components } from './tokens'
import type { Shift } from '@/types/shift'

/**
 * Get status-specific styles based on shift status
 */
export const getStatusStyles = (shiftStatus: 'PENDING' | 'CONFIRMED' | 'DECLINED') => {
  const statusMap = {
    PENDING: status.pending,
    CONFIRMED: status.confirmed, 
    DECLINED: status.declined,
  }
  return statusMap[shiftStatus] || status.pending
}

/**
 * Get semantic color classes by type and shade
 */
export const getSemanticColor = (
  type: 'primary' | 'success' | 'warning' | 'danger' | 'neutral',
  variant: 'bg' | 'text' | 'border' | 'ring' = 'bg',
  shade?: string
) => {
  const colorSet = colors.semantic[type]
  
  if (shade && shade in colorSet) {
    return colorSet[shade as keyof typeof colorSet]
  }
  
  // Default variants
  const variantMap = {
    bg: (colorSet as any)[500] || (colorSet as any)[100],
    text: (colorSet as any).text || (colorSet as any).textDark,
    border: (colorSet as any).border,
    ring: (colorSet as any).ring,
  }
  
  return variantMap[variant]
}

/**
 * Get animation classes for consistent transitions
 */
export const getAnimationClasses = (
  type: 'transition' | 'hover' | 'focus' = 'transition',
  variant?: string
) => {
  switch (type) {
    case 'hover':
      return variant && variant in animation.hover 
        ? `${animation.transition.normal} ${animation.hover[variant as keyof typeof animation.hover]}`
        : `${animation.transition.normal} ${animation.hover.shadow}`
    case 'focus':
      return variant && variant in animation.focus
        ? `${animation.focus.ring} ${animation.focus[variant as keyof typeof animation.focus]}`
        : `${animation.focus.ring} ${animation.focus.ringPrimary}`
    case 'transition':
    default:
      return variant && variant in animation.transition
        ? animation.transition[variant as keyof typeof animation.transition]
        : animation.transition.normal
  }
}

/**
 * Get component-specific styles
 */
export const getComponentStyles = (
  component: keyof typeof components,
  variant?: string
) => {
  const componentStyles = components[component]
  
  if (variant && typeof componentStyles === 'object' && variant in componentStyles) {
    return componentStyles[variant as keyof typeof componentStyles]
  }
  
  return componentStyles
}

/**
 * Helper to determine shift card state based on shift data
 */
export const getShiftCardState = (shift: Shift, isSelected: boolean) => {
  if (shift.status !== 'PENDING') {
    return 'disabled'
  }
  if (isSelected) {
    return 'selected'
  }
  return 'default'
}

/**
 * Helper to get toast type from notification type
 */
export const getToastType = (notificationType: 'success' | 'error' | 'warning' | 'info') => {
  return components.toast[notificationType] || components.toast.info
}

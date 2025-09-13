import { type VariantProps, cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind classes
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Button variants for consistent button styling
 */
export const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      },
      size: {
        sm: 'h-8 px-3 text-xs min-w-[44px]',           // Mobile-optimized touch target
        md: 'h-10 px-4 text-sm min-w-[44px] sm:h-9',   // Responsive sizing
        lg: 'h-12 px-6 text-base min-w-[44px] sm:h-10', // Larger for desktop
      },
      responsive: {
        mobile: 'w-full sm:w-auto',                     // Full width on mobile
        auto: 'w-auto',                                 // Auto width always
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      responsive: 'auto',
    },
  }
)

/**
 * Card variants for consistent card styling
 */
export const cardVariants = cva(
  // Base classes
  'bg-white rounded-lg p-0 shadow-sm border border-gray-200 transition-all duration-200',
  {
    variants: {
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm hover:shadow-md',
        md: 'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl',
      },
      interactive: {
        none: '',
        hover: 'hover:shadow-md cursor-pointer',
        selected: 'ring-2 ring-blue-500 shadow-md',
      }
    },
    defaultVariants: {
      shadow: 'sm',
      interactive: 'none',
    },
  }
)

/**
 * Container variants for consistent layout
 */
export const containerVariants = cva(
  'w-full',
  {
    variants: {
      spacing: {
        tight: 'px-4 sm:px-6',
        normal: 'px-4 sm:px-6 lg:px-8',
        wide: 'px-4 sm:px-6 lg:px-8 xl:px-12',
      },
      maxWidth: {
        none: '',
        sm: 'max-w-screen-sm mx-auto',
        md: 'max-w-screen-md mx-auto',
        lg: 'max-w-screen-lg mx-auto',
        xl: 'max-w-screen-xl mx-auto',
        full: 'max-w-full',
      }
    },
    defaultVariants: {
      spacing: 'normal',
      maxWidth: 'full',
    },
  }
)

/**
 * Input variants for form elements
 */
export const inputVariants = cva(
  // Base classes
  'border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  {
    variants: {
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base sm:px-4 sm:py-2 sm:text-sm',  // Mobile-first: larger on mobile
        lg: 'px-4 py-4 text-lg sm:px-6 sm:py-3 sm:text-base',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
        fixed: 'w-full sm:w-96',  // Full width on mobile, fixed on desktop
      }
    },
    defaultVariants: {
      size: 'md',
      width: 'full',
    },
  }
)

/**
 * Badge variants for status indicators
 */
export const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1 text-xs sm:px-3 sm:text-sm',
        lg: 'px-3 py-1.5 text-sm sm:px-4 sm:text-base',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Export types for TypeScript
export type ButtonVariants = VariantProps<typeof buttonVariants>
export type CardVariants = VariantProps<typeof cardVariants>
export type ContainerVariants = VariantProps<typeof containerVariants>
export type InputVariants = VariantProps<typeof inputVariants>
export type BadgeVariants = VariantProps<typeof badgeVariants>

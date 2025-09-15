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
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        dangerOutline: 'border border-red-700 bg-white text-red-700 hover:bg-red-50 focus:ring-red-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      },
      size: {
        sm: 'h-7 px-2 text-xs min-w-[72px]',           // Mobile-optimized touch target
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
  'border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400',
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

/**
 * Shift Card variants for consistent shift display
 */
export const shiftCardVariants = cva(
  'flex items-center space-x-4 bg-white p-4 border-b border-gray-200 last:border-b-0 transition-all duration-200',
  {
    variants: {
      state: {
        default: 'hover:bg-gray-50',
        selected: 'shadow-md bg-blue-50 border-blue-200',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      status: {
        pending: 'border-l-4 border-l-yellow-400',
        confirmed: 'border-l-4 border-l-green-400', 
        declined: 'border-l-4 border-l-red-400',
      }
    },
    defaultVariants: {
      state: 'default',
    }
  }
)

/**
 * Status Badge variants for shift status indicators
 */
export const statusBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-md font-bold',
  {
    variants: {
      status: {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        confirmed: 'bg-green-100 text-green-800 border-green-300',
        declined: 'bg-red-100 text-red-800 border-red-300',
      },
      size: {
        sm: 'h-7 px-2 text-xs min-w-[72px]',  
        md: 'px-2.5 py-1 text-xs sm:px-3 sm:text-sm',
        lg: 'px-3 py-1.5 text-sm sm:px-4 sm:text-base',
      }
    },
    defaultVariants: {
      status: 'pending',
      size: 'md',
    }
  }
)

/**
 * Search Input variants for search functionality
 */
export const searchInputVariants = cva(
  'border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  {
    variants: {
      state: {
        default: 'text-gray-900 placeholder-gray-400',
        loading: 'text-gray-900 placeholder-gray-400 bg-gray-50',
        error: 'border-red-300 focus:ring-red-500 focus:border-red-500 text-red-900',
        success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base sm:px-4 sm:py-2 sm:text-sm',
        lg: 'px-4 py-4 text-lg sm:px-6 sm:py-3 sm:text-base',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
        fixed: 'w-full sm:w-96',
      }
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
      width: 'fixed',
    }
  }
)

/**
 * Toast/Notification variants for user feedback
 */
export const toastVariants = cva(
  'rounded-lg shadow-lg border p-4 max-w-sm transition-all duration-300 ease-in-out',
  {
    variants: {
      type: {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
      },
      position: {
        'top-right': 'animate-slide-in-right',
        'top-left': 'animate-slide-in-left',
        'bottom-right': 'animate-slide-in-up',
        'bottom-left': 'animate-slide-in-up',
      },
      size: {
        sm: 'p-3 text-sm max-w-xs',
        md: 'p-4 text-sm max-w-sm',
        lg: 'p-5 text-base max-w-md',
      }
    },
    defaultVariants: {
      type: 'info',
      position: 'top-right',
      size: 'md',
    }
  }
)

/**
 * Month Group variants for month/date grouping
 */
export const monthGroupVariants = cva(
  'bg-white rounded-lg border border-gray-200 transition-shadow duration-200',
  {
    variants: {
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm hover:shadow-md',
        md: 'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl',
      },
      width: {
        mobile: 'w-full mb-6',
        tablet: 'sm:w-auto sm:mb-0 sm:min-w-[320px]',
        desktop: 'lg:min-w-[360px]',
        full: 'w-full mb-6 sm:w-auto sm:mb-0 sm:min-w-[320px] lg:min-w-[360px]',
      }
    },
    defaultVariants: {
      shadow: 'sm',
      width: 'full',
    }
  }
)

/**
 * Loading Spinner variants for consistent loading states
 */
export const spinnerVariants = cva(
  'animate-spin rounded-full border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
      },
      color: {
        primary: 'text-blue-600',
        success: 'text-green-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
        neutral: 'text-gray-600',
        white: 'text-white',
      }
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
    }
  }
)

/**
 * Checkbox variants for form controls
 */
export const checkboxVariants = cva(
  'rounded border-gray-300 transition-colors focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      color: {
        primary: 'text-blue-600 focus:ring-blue-500',
        success: 'text-green-600 focus:ring-green-500',
        warning: 'text-yellow-600 focus:ring-yellow-500',
        danger: 'text-red-600 focus:ring-red-500',
      },
      state: {
        default: '',
        disabled: 'opacity-50 cursor-not-allowed',
        error: 'border-red-300 text-red-600 focus:ring-red-500',
      }
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
      state: 'default',
    }
  }
)

// Export types for TypeScript
export type ButtonVariants = VariantProps<typeof buttonVariants>
export type CardVariants = VariantProps<typeof cardVariants>
export type ContainerVariants = VariantProps<typeof containerVariants>
export type InputVariants = VariantProps<typeof inputVariants>
export type BadgeVariants = VariantProps<typeof badgeVariants>
export type ShiftCardVariants = VariantProps<typeof shiftCardVariants>
export type StatusBadgeVariants = VariantProps<typeof statusBadgeVariants>
export type SearchInputVariants = VariantProps<typeof searchInputVariants>
export type ToastVariants = VariantProps<typeof toastVariants>
export type MonthGroupVariants = VariantProps<typeof monthGroupVariants>
export type SpinnerVariants = VariantProps<typeof spinnerVariants>
export type CheckboxVariants = VariantProps<typeof checkboxVariants>

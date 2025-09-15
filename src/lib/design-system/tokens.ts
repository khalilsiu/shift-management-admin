/**
 * Design Tokens for Mobile-First Responsive Design
 * Primary target: iPhone 15 Pro (393px width)
 * Supporting: All modern devices
 */

// Mobile-first breakpoints (Tailwind default + custom)
export const breakpoints = {
  mobile: '0px',      // iPhone 15 Pro: 393px
  sm: '640px',        // Small tablets
  md: '768px',        // iPad: 768px  
  lg: '1024px',       // Desktop
  xl: '1280px',       // Large desktop
  '2xl': '1536px',    // Extra large
} as const

// Responsive spacing tokens
export const spacing = {
  // Container spacing
  container: {
    mobile: 'px-4',           // 16px on mobile
    tablet: 'sm:px-6',        // 24px on tablet+
    desktop: 'lg:px-8',       // 32px on desktop+
  },
  
  // Section spacing
  section: {
    mobile: 'py-6',           // 24px vertical on mobile
    tablet: 'sm:py-8',        // 32px on tablet+
    desktop: 'lg:py-12',      // 48px on desktop+
  },
  
  // Card spacing
  card: {
    mobile: 'p-2',            // 16px on mobile
    tablet: 'sm:p-2',         // 24px on tablet+
    desktop: 'lg:p-2',        // 32px on desktop+
  },
  
  // Gap spacing
  gap: {
    mobile: 'gap-4',          // 16px gap on mobile
    tablet: 'sm:gap-6',       // 24px gap on tablet+
    desktop: 'lg:gap-8',      // 32px gap on desktop+
  },
} as const

// Typography tokens
export const typography = {
  // Headings
  heading: {
    h1: 'text-3xl sm:text-3xl lg:text-3xl font-bold',
    h2: 'text-2xl sm:text-xl lg:text-2xl font-bold',
    h3: 'text-xl sm:text-lg lg:text-xl font-bold',
  },
  
  // Body text
  body: {
    large: 'text-lg sm:text-lg',
    normal: 'text-md sm:text-base',
    small: 'text-base sm:text-sm',
  },
  
  // Labels and UI text
  label: {
    large: 'text-md sm:text-base font-bold',
    normal: 'text-sm sm:text-sm font-bold',
    small: 'text-sm font-bold',
  },
} as const

// Layout tokens
export const layout = {
  // Width constraints
  width: {
    full: 'w-full',
    mobile: 'w-full',
    tablet: 'w-full sm:w-auto',
    desktop: 'w-full lg:w-auto',
  },
  
  // Height constraints
  height: {
    screen: 'min-h-screen',
    auto: 'h-auto',
    fit: 'h-fit',
  },
  
  // Flex layouts
  flex: {
    column: 'flex flex-col',
    row: 'flex flex-row',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
  },
  
  // Grid layouts
  grid: {
    mobile: 'grid grid-cols-1',
    tablet: 'grid grid-cols-1 sm:grid-cols-2',
    desktop: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  },
} as const

// Interactive states
export const interactive = {
  // Button states
  button: {
    base: 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    hover: 'hover:shadow-md',
    focus: 'focus:ring-blue-500',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  
  // Touch targets (minimum 44px for mobile)
  touch: {
    mobile: 'min-h-[44px] min-w-[44px]',
    tablet: 'sm:min-h-[40px] sm:min-w-[40px]',
  },
} as const

// Semantic color tokens for better maintainability
export const colors = {
  // Semantic colors (derived from base colors)
  semantic: {
    primary: {
      50: 'bg-blue-50',
      100: 'bg-blue-100',
      500: 'bg-blue-500', 
      600: 'bg-blue-600',
      700: 'bg-blue-700',
      text: 'text-blue-600',
      textLight: 'text-blue-500',
      textDark: 'text-blue-700',
      border: 'border-blue-500',
      ring: 'ring-blue-500',
    },
    success: {
      50: 'bg-green-50',
      100: 'bg-green-100',
      500: 'bg-green-500',
      600: 'bg-green-600',
      700: 'bg-green-700',
      800: 'bg-green-800',
      text: 'text-green-600',
      textLight: 'text-green-500',
      textDark: 'text-green-800',
      border: 'border-green-500',
      ring: 'ring-green-500',
    },
    warning: {
      50: 'bg-yellow-50',
      100: 'bg-yellow-100',
      400: 'bg-yellow-400',
      500: 'bg-yellow-500',
      600: 'bg-yellow-600',
      800: 'bg-yellow-800',
      text: 'text-yellow-600',
      textLight: 'text-yellow-500',
      textDark: 'text-yellow-800',
      border: 'border-yellow-400',
      ring: 'ring-yellow-500',
    },
    danger: {
      50: 'bg-red-50',
      100: 'bg-red-100',
      500: 'bg-red-500',
      600: 'bg-red-600',
      700: 'bg-red-700',
      800: 'bg-red-800',
      text: 'text-red-600',
      textLight: 'text-red-500',
      textDark: 'text-red-800',
      border: 'border-red-500',
      ring: 'ring-red-500',
    },
    neutral: {
      50: 'bg-gray-50',
      100: 'bg-gray-100',
      200: 'bg-gray-200',
      300: 'bg-gray-300',
      400: 'bg-gray-400',
      500: 'bg-gray-500',
      600: 'bg-gray-600',
      700: 'bg-gray-700',
      800: 'bg-gray-800',
      900: 'bg-gray-900',
      text: 'text-gray-600',
      textLight: 'text-gray-400',
      textDark: 'text-gray-900',
      border: 'border-gray-300',
      ring: 'ring-gray-500',
    }
  }
} as const

// Status-specific tokens for shift management
export const status = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    borderLeft: 'border-l-yellow-400',
    icon: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  confirmed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    borderLeft: 'border-l-green-400',
    icon: 'text-green-600',
    badge: 'bg-green-100 text-green-800 border-green-300',
  },
  declined: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    borderLeft: 'border-l-red-400',
    icon: 'text-red-600',
    badge: 'bg-red-100 text-red-800 border-red-300',
  }
} as const

// Animation tokens for consistency
export const animation = {
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-200',
    shadow: 'transition-shadow duration-200',
  },
  hover: {
    scale: 'hover:scale-105',
    shadow: 'hover:shadow-md',
    lift: 'hover:shadow-lg hover:-translate-y-0.5',
    bg: 'hover:bg-gray-50',
    bgPrimary: 'hover:bg-blue-700',
    bgSuccess: 'hover:bg-green-700',
    bgDanger: 'hover:bg-red-700',
  },
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    ringPrimary: 'focus:ring-blue-500',
    ringSuccess: 'focus:ring-green-500',
    ringDanger: 'focus:ring-red-500',
  }
} as const

// Component-specific tokens
export const components = {
  // Search input
  searchInput: {
    mobile: 'w-full px-4 py-3 text-base',
    tablet: 'sm:w-96 sm:px-4 sm:py-2 sm:text-sm',
    states: {
      default: 'text-gray-900 placeholder-gray-400',
      loading: 'text-gray-900 placeholder-gray-400 bg-gray-50',
      error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    }
  },
  
  // Month cards
  monthCard: {
    mobile: 'w-full mb-6',
    tablet: 'sm:w-auto sm:mb-0 sm:min-w-[320px]',
    desktop: 'lg:min-w-[360px]',
    shadow: {
      default: 'shadow-sm',
      hover: 'hover:shadow-md',
      selected: 'shadow-md',
    }
  },
  
  // Shift cards
  shiftCard: {
    mobile: 'w-full p-4',
    tablet: 'sm:p-4',
    desktop: 'lg:p-6',
    states: {
      default: 'hover:bg-gray-50',
      selected: 'shadow-md bg-blue-50 border-blue-200',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    borders: {
      default: 'border-b border-gray-200 last:border-b-0',
      pending: 'border-l-4 border-l-yellow-400',
      confirmed: 'border-l-4 border-l-green-400',
      declined: 'border-l-4 border-l-red-400',
    }
  },
  
  // Notification/Toast tokens
  toast: {
    base: 'rounded-lg shadow-lg border p-4 max-w-sm',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  
  // Button loading states
  buttonLoading: {
    spinner: 'animate-spin h-4 w-4',
    text: 'ml-2',
  },
  
  // Common layout patterns
  layout: {
    // Modal/Dialog patterns
    modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4',
    modalContent: 'bg-white rounded-lg shadow-xl max-w-md w-full p-6',
    
    // Fixed positioning patterns
    fixedBottomRight: 'fixed bottom-4 right-4 z-30',
    fixedTopRight: 'fixed top-4 right-4 z-50',
    
    // Flex patterns
    flexBetween: 'flex items-center justify-between',
    flexCenter: 'flex items-center justify-center',
    flexStart: 'flex items-center space-x-2',
    flexCol: 'flex flex-col space-y-2',
    
    // Common spacing
    cardPadding: 'p-4 sm:p-6',
    sectionSpacing: 'mb-4',
    buttonGroup: 'flex space-x-3',
  }
} as const

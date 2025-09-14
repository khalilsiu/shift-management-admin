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

// Component-specific tokens
export const components = {
  // Search input
  searchInput: {
    mobile: 'w-full px-4 py-3 text-base',
    tablet: 'sm:w-96 sm:px-4 sm:py-2 sm:text-sm',
  },
  
  // Month cards
  monthCard: {
    mobile: 'w-full mb-6',
    tablet: 'sm:w-auto sm:mb-0 sm:min-w-[320px]',
    desktop: 'lg:min-w-[360px]',
  },
  
  // Shift cards
  shiftCard: {
    mobile: 'w-full p-4',
    tablet: 'sm:p-4',
    desktop: 'lg:p-6',
  },
} as const

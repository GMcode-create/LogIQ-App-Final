/**
 * Responsive Design Utilities
 * Provides utilities for responsive design, mobile detection, and cross-browser compatibility
 */

import { useEffect, useState } from 'react';

// Breakpoint definitions matching Tailwind CSS
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to detect current screen size and breakpoint
 */
export const useBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm');
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    currentBreakpoint,
    screenWidth,
    isMobile: screenWidth < breakpoints.md,
    isTablet: screenWidth >= breakpoints.md && screenWidth < breakpoints.lg,
    isDesktop: screenWidth >= breakpoints.lg,
  };
};

/**
 * Hook to detect touch device capabilities
 */
export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasHover, setHasHover] = useState(true);

  useEffect(() => {
    // Check for touch support
    const hasTouchSupport = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigator as any).msMaxTouchPoints > 0;

    setIsTouchDevice(hasTouchSupport);

    // Check for hover support
    const hasHoverSupport = window.matchMedia('(hover: hover)').matches;
    setHasHover(hasHoverSupport);
  }, []);

  return {
    isTouchDevice,
    hasHover,
    isCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
  };
};

/**
 * Hook to detect browser capabilities and apply fallbacks
 */
export const useBrowserCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    supportsGrid: true,
    supportsFlexbox: true,
    supportsTransforms: true,
    supportsAnimations: true,
    supportsBackdropFilter: true,
    supportsCustomProperties: true,
    supportsWillChange: true,
    supportsIntersectionObserver: true,
  });

  useEffect(() => {
    const testElement = document.createElement('div');
    
    setCapabilities({
      supportsGrid: CSS.supports('display', 'grid'),
      supportsFlexbox: CSS.supports('display', 'flex'),
      supportsTransforms: CSS.supports('transform', 'translateX(0)'),
      supportsAnimations: CSS.supports('animation', 'none'),
      supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
      supportsCustomProperties: CSS.supports('color', 'var(--test)'),
      supportsWillChange: CSS.supports('will-change', 'transform'),
      supportsIntersectionObserver: 'IntersectionObserver' in window,
    });
  }, []);

  return capabilities;
};

/**
 * Responsive value utility - returns different values based on breakpoint
 */
export const useResponsiveValue = <T>(values: {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}) => {
  const { currentBreakpoint } = useBreakpoint();
  
  // Find the appropriate value for current breakpoint
  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return values.sm;
};

/**
 * Generate responsive classes based on breakpoint
 */
export const getResponsiveClasses = (baseClasses: string, responsiveClasses: {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}) => {
  let classes = baseClasses;
  
  Object.entries(responsiveClasses).forEach(([breakpoint, classNames]) => {
    if (classNames) {
      if (breakpoint === 'sm') {
        classes += ` ${classNames}`;
      } else {
        classes += ` ${breakpoint}:${classNames}`;
      }
    }
  });
  
  return classes;
};

/**
 * Optimize animation performance for mobile devices
 */
export const getOptimizedAnimationProps = (isMobile: boolean, baseProps: any) => {
  if (isMobile) {
    return {
      ...baseProps,
      transition: {
        ...baseProps.transition,
        duration: Math.min(baseProps.transition?.duration || 0.3, 0.3),
        ease: 'easeOut',
      },
      // Reduce complex animations on mobile
      animate: {
        ...baseProps.animate,
        // Remove rotation and complex transforms on mobile
        rotate: undefined,
        scale: baseProps.animate?.scale ? Math.min(baseProps.animate.scale, 1.05) : undefined,
      }
    };
  }
  return baseProps;
};

/**
 * Cross-browser safe CSS property generator
 */
export const getCrossBrowserStyles = (property: string, value: string) => {
  const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
  const styles: Record<string, string> = {};
  
  // Properties that need vendor prefixes
  const prefixedProperties = [
    'transform',
    'transition',
    'animation',
    'backdrop-filter',
    'user-select',
    'appearance',
    'box-sizing',
  ];
  
  if (prefixedProperties.some(prop => property.includes(prop))) {
    prefixes.forEach(prefix => {
      styles[`${prefix}${property}`] = value;
    });
  } else {
    styles[property] = value;
  }
  
  return styles;
};

/**
 * Safe feature detection for CSS properties
 */
export const supportsCSS = (property: string, value: string): boolean => {
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports(property, value);
  }
  
  // Fallback for older browsers
  const testElement = document.createElement('div');
  const camelProperty = property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  
  try {
    (testElement.style as any)[camelProperty] = value;
    return (testElement.style as any)[camelProperty] === value;
  } catch {
    return false;
  }
};

/**
 * Generate safe inline styles with fallbacks
 */
export const getSafeStyles = (styles: Record<string, string>) => {
  const safeStyles: Record<string, string> = {};
  
  Object.entries(styles).forEach(([property, value]) => {
    if (supportsCSS(property, value)) {
      safeStyles[property] = value;
    } else {
      // Add fallbacks for common properties
      switch (property) {
        case 'backdrop-filter':
          safeStyles.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          break;
        case 'transform':
          // Skip transform if not supported
          break;
        default:
          safeStyles[property] = value;
      }
    }
  });
  
  return safeStyles;
};

/**
 * Mobile-optimized touch target size utility
 */
export const getTouchTargetStyles = (isTouchDevice: boolean) => {
  return isTouchDevice ? {
    minHeight: '48px',
    minWidth: '48px',
    padding: '12px',
  } : {
    minHeight: '44px',
    minWidth: '44px',
  };
};

/**
 * Performance-optimized scroll handler
 */
export const useOptimizedScroll = (callback: () => void, delay = 16) => {
  useEffect(() => {
    let timeoutId: number;
    let lastScrollTime = 0;
    
    const handleScroll = () => {
      const now = Date.now();
      
      if (now - lastScrollTime > delay) {
        callback();
        lastScrollTime = now;
      } else {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          callback();
          lastScrollTime = Date.now();
        }, delay);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [callback, delay]);
};

/**
 * Responsive font size utility
 */
export const getResponsiveFontSize = (baseSize: string, breakpoint: Breakpoint) => {
  const sizeMap = {
    sm: {
      'text-xs': 'text-xs',
      'text-sm': 'text-sm',
      'text-base': 'text-sm',
      'text-lg': 'text-base',
      'text-xl': 'text-lg',
      'text-2xl': 'text-xl',
      'text-3xl': 'text-2xl',
      'text-4xl': 'text-3xl',
      'text-5xl': 'text-4xl',
      'text-6xl': 'text-5xl',
      'text-7xl': 'text-6xl',
    },
    md: {
      'text-xs': 'text-xs',
      'text-sm': 'text-sm',
      'text-base': 'text-base',
      'text-lg': 'text-lg',
      'text-xl': 'text-xl',
      'text-2xl': 'text-2xl',
      'text-3xl': 'text-3xl',
      'text-4xl': 'text-4xl',
      'text-5xl': 'text-5xl',
      'text-6xl': 'text-6xl',
      'text-7xl': 'text-7xl',
    },
    lg: {
      'text-xs': 'text-xs',
      'text-sm': 'text-sm',
      'text-base': 'text-base',
      'text-lg': 'text-lg',
      'text-xl': 'text-xl',
      'text-2xl': 'text-2xl',
      'text-3xl': 'text-3xl',
      'text-4xl': 'text-4xl',
      'text-5xl': 'text-5xl',
      'text-6xl': 'text-6xl',
      'text-7xl': 'text-7xl',
    },
    xl: {
      'text-xs': 'text-xs',
      'text-sm': 'text-sm',
      'text-base': 'text-base',
      'text-lg': 'text-lg',
      'text-xl': 'text-xl',
      'text-2xl': 'text-2xl',
      'text-3xl': 'text-3xl',
      'text-4xl': 'text-4xl',
      'text-5xl': 'text-5xl',
      'text-6xl': 'text-6xl',
      'text-7xl': 'text-7xl',
    },
    '2xl': {
      'text-xs': 'text-xs',
      'text-sm': 'text-sm',
      'text-base': 'text-base',
      'text-lg': 'text-lg',
      'text-xl': 'text-xl',
      'text-2xl': 'text-2xl',
      'text-3xl': 'text-3xl',
      'text-4xl': 'text-4xl',
      'text-5xl': 'text-5xl',
      'text-6xl': 'text-6xl',
      'text-7xl': 'text-7xl',
    },
  };
  
  return sizeMap[breakpoint]?.[baseSize as keyof typeof sizeMap[typeof breakpoint]] || baseSize;
};
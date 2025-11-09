import { Variants, Transition } from 'framer-motion';

// Utility function to create staggered animations
export const createStaggerVariants = (
  baseVariant: Variants,
  staggerDelay: number = 0.1,
  delayChildren: number = 0.2
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

// Utility function to create responsive animations
export const createResponsiveVariants = (
  mobileVariant: Variants,
  desktopVariant: Variants,
  breakpoint: number = 768
): Variants => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < breakpoint;
  return isMobile ? mobileVariant : desktopVariant;
};

// Utility function to create conditional animations based on reduced motion
export const createAccessibleVariants = (
  animatedVariant: Variants,
  staticVariant: Variants,
  prefersReducedMotion: boolean
): Variants => {
  return prefersReducedMotion ? staticVariant : animatedVariant;
};

// Enhanced accessibility utilities with comprehensive reduced motion support
export const createAccessibleAnimation = (
  baseVariant: Variants,
  options: {
    respectReducedMotion?: boolean;
    fallbackDuration?: number;
    ariaLabel?: string;
    ariaLive?: 'polite' | 'assertive' | 'off';
    enableFocusManagement?: boolean;
    enablePerformanceOptimizations?: boolean;
  } = {}
): Variants => {
  const { 
    respectReducedMotion = true, 
    fallbackDuration = 0.3,
    enableFocusManagement = true,
    enablePerformanceOptimizations = true
  } = options;
  
  // Check for reduced motion preference with enhanced detection
  const prefersReducedMotion = respectReducedMotion && typeof window !== 'undefined' && 
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
     window.matchMedia('(prefers-reduced-motion)').matches);
  
  if (prefersReducedMotion) {
    // Return simplified variants that respect reduced motion
    const reducedMotionVariants: Variants = {};
    Object.keys(baseVariant).forEach(key => {
      const originalVariant = baseVariant[key];
      if (typeof originalVariant === 'object' && originalVariant !== null) {
        reducedMotionVariants[key] = {
          // Preserve opacity changes as they're generally acceptable
          opacity: originalVariant.opacity !== undefined ? originalVariant.opacity : 
                   (key === 'hidden' ? 0 : 1),
          // Preserve color and background changes
          ...Object.fromEntries(
            Object.entries(originalVariant).filter(([prop]) => 
              ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke', 'opacity'].includes(prop)
            )
          ),
          // Use shorter, gentler transitions
          transition: { 
            duration: Math.min(fallbackDuration, 0.3),
            ease: 'easeOut'
          }
        };
      } else {
        reducedMotionVariants[key] = originalVariant;
      }
    });
    return reducedMotionVariants;
  }
  
  // Apply performance optimizations if enabled
  if (enablePerformanceOptimizations) {
    return applyPerformanceOptimizations(baseVariant);
  }
  
  return baseVariant;
};

// Apply performance optimizations to animation variants
const applyPerformanceOptimizations = (variants: Variants): Variants => {
  const optimizedVariants: Variants = {};
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      const hasTransformProps = ['x', 'y', 'scale', 'rotate', 'skew', 'scaleX', 'scaleY'].some(
        prop => prop in variant
      );
      
      optimizedVariants[key] = {
        ...variant,
        // Add hardware acceleration for transform properties
        ...(hasTransformProps && {
          transform: variant.transform ? 
            `${variant.transform} translate3d(0, 0, 0)` : 
            'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          perspective: 1000,
        }),
        // Optimize transitions
        transition: {
          ...variant.transition,
          // Add will-change hints
          willChange: hasTransformProps ? 'transform, opacity' : 'opacity',
        },
      };
    } else {
      optimizedVariants[key] = variant;
    }
  });
  
  return optimizedVariants;
};

// Enhanced performance optimization utilities with comprehensive cleanup management
export const optimizeForPerformance = (
  element: HTMLElement,
  options: {
    enableWillChange?: boolean;
    enableTransform3d?: boolean;
    enableBackfaceVisibility?: boolean;
    enablePerspective?: boolean;
    enableContainment?: boolean;
    autoCleanup?: boolean;
    cleanupDelay?: number;
    respectReducedMotion?: boolean;
  } = {}
): (() => void) => {
  const {
    enableWillChange = true,
    enableTransform3d = true,
    enableBackfaceVisibility = true,
    enablePerspective = true,
    enableContainment = true,
    autoCleanup = true,
    cleanupDelay = 1000,
    respectReducedMotion = true
  } = options;
  
  // Check for reduced motion preference
  const prefersReducedMotion = respectReducedMotion && 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Skip optimizations if reduced motion is preferred
  if (prefersReducedMotion) {
    return () => {}; // Return empty cleanup function
  }
  
  // Store original values for restoration
  const originalStyles = {
    willChange: element.style.willChange,
    transform: element.style.transform,
    backfaceVisibility: element.style.backfaceVisibility,
    perspective: element.style.perspective,
    contain: element.style.contain,
  };
  
  // Check browser capabilities
  const supportsTransform3d = (() => {
    try {
      const testEl = document.createElement('div');
      testEl.style.transform = 'translate3d(0, 0, 0)';
      return testEl.style.transform !== '';
    } catch (e) {
      return false;
    }
  })();
  
  const supportsWillChange = 'willChange' in element.style;
  const supportsBackfaceVisibility = 'backfaceVisibility' in element.style || 
                                     'webkitBackfaceVisibility' in element.style;
  const supportsPerspective = 'perspective' in element.style || 
                             'webkitPerspective' in element.style;
  const supportsContain = 'contain' in element.style;
  
  // Apply performance optimizations based on browser support
  if (enableWillChange && supportsWillChange) {
    element.style.willChange = 'transform, opacity';
  }
  
  if (enableTransform3d && supportsTransform3d) {
    const currentTransform = element.style.transform;
    element.style.transform = currentTransform 
      ? `${currentTransform} translate3d(0, 0, 0)` 
      : 'translate3d(0, 0, 0)';
  }
  
  if (enableBackfaceVisibility && supportsBackfaceVisibility) {
    element.style.backfaceVisibility = 'hidden';
  }
  
  if (enablePerspective && supportsPerspective) {
    element.style.perspective = '1000px';
  }
  
  if (enableContainment && supportsContain) {
    element.style.contain = 'layout style paint';
  }
  
  // Auto cleanup after delay
  let cleanupTimeout: NodeJS.Timeout;
  if (autoCleanup) {
    cleanupTimeout = setTimeout(() => {
      cleanup();
    }, cleanupDelay);
  }
  
  // Manual cleanup function
  const cleanup = () => {
    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
    }
    
    // Restore original styles
    element.style.willChange = originalStyles.willChange || 'auto';
    element.style.transform = originalStyles.transform || '';
    element.style.backfaceVisibility = originalStyles.backfaceVisibility || '';
    element.style.perspective = originalStyles.perspective || '';
    element.style.contain = originalStyles.contain || '';
  };
  
  return cleanup;
};

// Comprehensive ARIA utilities for animated elements with enhanced accessibility
export const getAnimationAriaProps = (
  isAnimating: boolean,
  options: {
    label?: string;
    live?: 'polite' | 'assertive' | 'off';
    describedBy?: string;
    role?: string;
    hidden?: boolean;
    expanded?: boolean;
    pressed?: boolean;
    selected?: boolean;
    disabled?: boolean;
    current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
    level?: number;
    setSize?: number;
    posInSet?: number;
  } = {}
): Record<string, string> => {
  const { 
    label, 
    live = 'polite', 
    describedBy, 
    role, 
    hidden, 
    expanded,
    pressed,
    selected,
    disabled,
    current,
    level,
    setSize,
    posInSet
  } = options;
  
  const props: Record<string, string> = {
    'aria-busy': isAnimating.toString(),
  };
  
  if (label) {
    props['aria-label'] = label;
  }
  
  if (live !== 'off' && isAnimating) {
    props['aria-live'] = live;
  }
  
  if (describedBy) {
    props['aria-describedby'] = describedBy;
  }
  
  if (role) {
    props['role'] = role;
  }
  
  if (hidden !== undefined) {
    props['aria-hidden'] = hidden.toString();
  }
  
  if (expanded !== undefined) {
    props['aria-expanded'] = expanded.toString();
  }
  
  if (pressed !== undefined) {
    props['aria-pressed'] = pressed.toString();
  }
  
  if (selected !== undefined) {
    props['aria-selected'] = selected.toString();
  }
  
  if (disabled !== undefined) {
    props['aria-disabled'] = disabled.toString();
  }
  
  if (current !== undefined) {
    props['aria-current'] = typeof current === 'boolean' ? current.toString() : current;
  }
  
  if (level !== undefined) {
    props['aria-level'] = level.toString();
  }
  
  if (setSize !== undefined) {
    props['aria-setsize'] = setSize.toString();
  }
  
  if (posInSet !== undefined) {
    props['aria-posinset'] = posInSet.toString();
  }
  
  return props;
};

// Enhanced ARIA announcement utility for animation states
export const createAnimationAnnouncer = () => {
  let announcementElement: HTMLDivElement | null = null;
  
  const ensureAnnouncementElement = () => {
    if (!announcementElement) {
      announcementElement = document.createElement('div');
      announcementElement.className = 'sr-only';
      announcementElement.setAttribute('aria-live', 'polite');
      announcementElement.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcementElement);
    }
    return announcementElement;
  };
  
  const announce = (
    message: string, 
    priority: 'polite' | 'assertive' = 'polite',
    delay: number = 100
  ) => {
    const element = ensureAnnouncementElement();
    
    // Clear previous announcement
    element.textContent = '';
    element.setAttribute('aria-live', priority);
    
    // Set new announcement after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      element.textContent = message;
    }, delay);
  };
  
  const announceAnimationStart = (elementLabel?: string) => {
    const message = elementLabel 
      ? `Animation started for ${elementLabel}` 
      : 'Animation started';
    announce(message, 'polite');
  };
  
  const announceAnimationEnd = (elementLabel?: string) => {
    const message = elementLabel 
      ? `Animation completed for ${elementLabel}` 
      : 'Animation completed';
    announce(message, 'polite');
  };
  
  const announceStateChange = (state: string, elementLabel?: string) => {
    const message = elementLabel 
      ? `${elementLabel} ${state}` 
      : `State changed to ${state}`;
    announce(message, 'polite');
  };
  
  const cleanup = () => {
    if (announcementElement && announcementElement.parentNode) {
      announcementElement.parentNode.removeChild(announcementElement);
      announcementElement = null;
    }
  };
  
  return {
    announce,
    announceAnimationStart,
    announceAnimationEnd,
    announceStateChange,
    cleanup
  };
};

// Focus management for animated elements
export const createFocusManagement = () => {
  let previousFocus: HTMLElement | null = null;
  
  const saveFocus = () => {
    previousFocus = document.activeElement as HTMLElement;
  };
  
  const restoreFocus = () => {
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  };
  
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };
  
  return { saveFocus, restoreFocus, trapFocus };
};

// Check for browser animation support
export const checkAnimationSupport = (): {
  css: boolean;
  js: boolean;
  transform3d: boolean;
} => {
  if (typeof window === 'undefined') {
    return { css: false, js: false, transform3d: false };
  }
  
  const element = document.createElement('div');
  
  const cssSupport = 'animation' in element.style || 
                    'webkitAnimation' in element.style ||
                    'mozAnimation' in element.style;
  
  const jsSupport = typeof requestAnimationFrame !== 'undefined';
  
  const transform3dSupport = 'transform' in element.style &&
                            'perspective' in element.style;
  
  return {
    css: cssSupport,
    js: jsSupport,
    transform3d: transform3dSupport,
  };
};

// Common transition presets
export const transitions = {
  smooth: {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94],
  } as Transition,
  
  bouncy: {
    duration: 0.8,
    ease: [0.68, -0.55, 0.265, 1.55],
  } as Transition,
  
  quick: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94],
  } as Transition,
  
  slow: {
    duration: 1.2,
    ease: [0.25, 0.46, 0.45, 0.94],
  } as Transition,
  
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  } as Transition,
  
  springBouncy: {
    type: 'spring',
    stiffness: 200,
    damping: 10,
  } as Transition,
};

// Utility to combine multiple animation variants
export const combineVariants = (...variants: Variants[]): Variants => {
  return variants.reduce((combined, variant) => {
    Object.keys(variant).forEach(key => {
      if (combined[key]) {
        combined[key] = { ...combined[key], ...variant[key] };
      } else {
        combined[key] = variant[key];
      }
    });
    return combined;
  }, {});
};

// Utility to create hover variants for interactive elements
export const createHoverVariants = (
  scale: number = 1.05,
  y: number = -5,
  transition: Transition = transitions.quick
): Variants => ({
  rest: {
    scale: 1,
    y: 0,
    transition,
  },
  hover: {
    scale,
    y,
    transition,
  },
  tap: {
    scale: 0.98,
    transition: { ...transition, duration: 0.1 },
  },
});

// Utility to create loading animation variants
export const createLoadingVariants = (): Variants => ({
  loading: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
});

// Utility to create pulse animation variants
export const createPulseVariants = (
  scale: [number, number] = [1, 1.05],
  duration: number = 2
): Variants => ({
  pulse: {
    scale,
    transition: {
      duration,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
});

// Utility to create text reveal animation
export const createTextRevealVariants = (): Variants => ({
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
});

// Utility to create path drawing animation for SVGs
export const createPathVariants = (
  duration: number = 2,
  delay: number = 0
): Variants => ({
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration,
        delay,
        ease: 'easeInOut',
      },
      opacity: {
        duration: 0.3,
        delay,
      },
    },
  },
});

// Utility to create morphing variants for shape animations
export const createMorphVariants = (
  shapes: string[],
  duration: number = 1
): Variants => ({
  morph: {
    d: shapes,
    transition: {
      duration,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
});

// Utility to create parallax scroll variants
export const createParallaxVariants = (
  yRange: [number, number] = [-50, 50]
): Variants => ({
  scroll: (scrollY: number) => ({
    y: scrollY * 0.5,
    transition: {
      duration: 0,
    },
  }),
});
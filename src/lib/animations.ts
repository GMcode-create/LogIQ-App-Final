import { Variants } from 'framer-motion';

// Optimized easing functions for better performance and feel
export const easings = {
  // Smooth and natural feeling easings
  easeOutCubic: [0.25, 0.46, 0.45, 0.94],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  // New optimized easings for better UX
  easeOutCirc: [0.075, 0.82, 0.165, 1],
  easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
  easeOutBack: [0.175, 0.885, 0.32, 1.275],
  easeInOutBack: [0.68, -0.55, 0.265, 1.55],
  // Performance-optimized easings (simpler calculations)
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
  easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
  // Accessibility-friendly easings (gentler motion)
  easeGentle: [0.25, 0.1, 0.25, 1],
  easeAccessible: [0.4, 0, 0.2, 1],
} as const;

// Optimized animation duration presets based on user research
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  medium: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.0,
  // Context-specific durations
  microInteraction: 0.15,
  hover: 0.2,
  focus: 0.15,
  pageTransition: 0.4,
  modalTransition: 0.3,
  tooltipTransition: 0.2,
} as const;

// Optimized stagger delay presets for better rhythm
export const staggerDelays = {
  tight: 0.03,
  fast: 0.05,
  normal: 0.08,
  medium: 0.1,
  slow: 0.15,
  relaxed: 0.2,
  // Context-specific stagger delays
  cardGrid: 0.08,
  listItems: 0.05,
  navigation: 0.03,
  features: 0.1,
} as const;

// Enhanced animation variants for scroll-triggered animations with optimized timing
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20, // Reduced distance for smoother feel
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.easeOutQuart,
    },
  },
};

export const fadeInUpLarge: Variants = {
  hidden: {
    opacity: 0,
    y: 40, // Reduced for better performance
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutQuart,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.easeOutQuart,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.medium,
      ease: easings.easeOutQuart,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.medium,
      ease: easings.easeOutQuart,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutQuart,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelays.normal,
      delayChildren: durations.fast,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 15, // Reduced for subtler effect
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.medium,
      ease: easings.easeOutQuart,
    },
  },
};

// Floating animation for code snippets
export const floatingCode: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-1, 1, -1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Card hover animations
export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: durations.hover,
      ease: easings.easeOutQuart,
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: durations.hover,
      ease: easings.easeOutQuart,
    },
  },
};

// Button animations
export const buttonHover: Variants = {
  rest: {
    scale: 1,
    transition: {
      duration: durations.hover,
      ease: easings.easeOutQuart,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: durations.hover,
      ease: easings.easeOutQuart,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: durations.microInteraction,
      ease: easings.easeOutQuart,
    },
  },
};

// Number counting animation
export const countUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOutQuart,
    },
  },
};

// Progress bar animation
export const progressBar: Variants = {
  hidden: {
    width: 0,
  },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 1.5,
      ease: easings.easeOutQuart,
      delay: 0.5,
    },
  }),
};

// Glow effect animation
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 188, 212, 0.3)',
      '0 0 30px rgba(0, 188, 212, 0.6)',
      '0 0 20px rgba(0, 188, 212, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Slide in from different directions
export const slideInFromTop: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOutQuart,
    },
  },
};

export const slideInFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOutQuart,
    },
  },
};

// Enhanced scroll-triggered animation variants
export const scrollFadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOutQuart,
    },
  },
};

export const scrollFadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutQuart,
    },
  },
};

export const scrollSlideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOutQuart,
    },
  },
};

export const scrollSlideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOutQuart,
    },
  },
};

// Staggered container variants for scroll animations
export const scrollStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelays.slow,
      delayChildren: durations.microInteraction,
    },
  },
};

export const scrollStaggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelays.fast,
      delayChildren: durations.microInteraction,
    },
  },
};

export const scrollStaggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.medium,
      ease: easings.easeOutQuart,
    },
  },
};

// Card-specific scroll animations
export const scrollCardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOutQuart,
    },
  },
};

// Text reveal animations
export const scrollTextReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: durations.medium,
      ease: easings.easeOutQuart,
    },
  }),
};

// Section header animations
export const scrollSectionHeader: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slowest,
      ease: easings.easeOutQuart,
    },
  },
};

// Performance optimized variants with reduced motion support
export const createScrollVariant = (
  prefersReducedMotion: boolean,
  baseVariant: Variants
): Variants => {
  if (prefersReducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: durations.hover }
      },
    };
  }
  return baseVariant;
};

// Accessibility-aware animation variants with ARIA support
export const createAccessibleVariants = (
  baseVariant: Variants,
  options: {
    ariaLabel?: string;
    ariaLive?: 'polite' | 'assertive' | 'off';
    reducedMotionFallback?: Variants;
  } = {}
): Variants => {
  const { reducedMotionFallback } = options;
  
  return {
    ...baseVariant,
    // Add reduced motion fallbacks
    reducedMotion: reducedMotionFallback || {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: durations.hover }
      },
    },
  };
};

// Performance-optimized variants with hardware acceleration
export const createOptimizedVariants = (
  baseVariant: Variants,
  options: {
    enableWillChange?: boolean;
    enableTransform3d?: boolean;
    enableBackfaceVisibility?: boolean;
    enablePerspective?: boolean;
    respectReducedMotion?: boolean;
    fallbackDuration?: number;
  } = {}
): Variants => {
  const {
    enableWillChange = true,
    enableTransform3d = true,
    enableBackfaceVisibility = true,
    enablePerspective = true,
    respectReducedMotion = true,
    fallbackDuration = durations.hover
  } = options;

  // Check for reduced motion preference
  const prefersReducedMotion = respectReducedMotion && 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Return simplified variants for reduced motion
  if (prefersReducedMotion) {
    const simplifiedVariants: Variants = {};
    Object.keys(baseVariant).forEach(key => {
      simplifiedVariants[key] = {
        opacity: key === 'hidden' ? 0 : 1,
        transition: { duration: fallbackDuration }
      };
    });
    return simplifiedVariants;
  }

  const optimizeTransition = (transition: any) => ({
    ...transition,
    // Enable hardware acceleration hints
    ...(enableWillChange && { willChange: 'transform, opacity' }),
  });

  const optimizeVariant = (variant: any) => {
    if (typeof variant !== 'object' || variant === null) return variant;
    
    const optimized = { ...variant };
    
    // Add transform3d for hardware acceleration if transform properties exist
    if (enableTransform3d && (variant.x !== undefined || variant.y !== undefined || variant.scale !== undefined || variant.rotate !== undefined)) {
      optimized.transform = optimized.transform ? 
        `${optimized.transform} translate3d(0, 0, 0)` : 
        'translate3d(0, 0, 0)';
      
      if (enableBackfaceVisibility) {
        optimized.backfaceVisibility = 'hidden';
      }
      
      if (enablePerspective) {
        optimized.perspective = 1000;
      }
    }
    
    // Optimize transition
    if (variant.transition) {
      optimized.transition = optimizeTransition(variant.transition);
    }
    
    return optimized;
  };

  const optimizedVariant: Variants = {};
  
  Object.keys(baseVariant).forEach(key => {
    optimizedVariant[key] = optimizeVariant(baseVariant[key]);
  });

  return optimizedVariant;
};

// Fallback variants for browsers without animation support
export const createFallbackVariants = (): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  rest: {},
  hover: {},
  tap: {},
});

// Check for animation support with comprehensive feature detection
export const supportsAnimations = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const element = document.createElement('div');
  
  // Check for CSS animation support
  const animationSupport = 'animation' in element.style || 
                          'webkitAnimation' in element.style ||
                          'mozAnimation' in element.style ||
                          'msAnimation' in element.style;
  
  // Check for transform support
  const transformSupport = 'transform' in element.style ||
                          'webkitTransform' in element.style ||
                          'mozTransform' in element.style ||
                          'msTransform' in element.style;
  
  // Check for transition support
  const transitionSupport = 'transition' in element.style ||
                           'webkitTransition' in element.style ||
                           'mozTransition' in element.style ||
                           'msTransition' in element.style;
  
  // Check for 3D transform support
  const transform3dSupport = (() => {
    try {
      element.style.transform = 'translate3d(0, 0, 0)';
      return element.style.transform !== '';
    } catch (e) {
      return false;
    }
  })();
  
  return animationSupport && transformSupport && transitionSupport && transform3dSupport;
};

// Get user's motion preferences with change listener support
export const getPrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

// Create context-aware animation variants with full accessibility support
export const createContextAwareVariants = (
  baseVariant: Variants,
  options: {
    ariaLabel?: string;
    ariaLive?: 'polite' | 'assertive' | 'off';
    fallbackDuration?: number;
  } = {}
): Variants => {
  const prefersReducedMotion = getPrefersReducedMotion();
  const supportsAnim = supportsAnimations();
  const { fallbackDuration = durations.hover } = options;
  
  // No animation support - return static fallback
  if (!supportsAnim) {
    return createFallbackVariants();
  }
  
  // Reduced motion preference - return simplified animations
  if (prefersReducedMotion) {
    return createAccessibleVariants(baseVariant, {
      ...options,
      reducedMotionFallback: {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { duration: fallbackDuration }
        },
        rest: {},
        hover: { opacity: 1 },
        tap: {},
      }
    }).reducedMotion as Variants;
  }
  
  // Full animation support - return optimized variants
  return createOptimizedVariants(baseVariant);
};

// ARIA properties helper for animated elements
export const getAnimationAriaProps = (
  isAnimating: boolean,
  options: {
    label?: string;
    live?: 'polite' | 'assertive' | 'off';
    describedBy?: string;
  } = {}
): Record<string, string> => {
  const { label, live = 'polite', describedBy } = options;
  
  const props: Record<string, string> = {
    'aria-busy': isAnimating.toString(),
  };
  
  if (label) {
    props['aria-label'] = label;
  }
  
  if (live !== 'off') {
    props['aria-live'] = live;
  }
  
  if (describedBy) {
    props['aria-describedby'] = describedBy;
  }
  
  return props;
};

// Performance monitoring for animations
export const createPerformanceOptimizedVariant = (
  baseVariant: Variants,
  performanceOptions: {
    enableWillChange?: boolean;
    enableTransform3d?: boolean;
    enableBackfaceVisibility?: boolean;
    enablePerspective?: boolean;
  } = {}
): Variants => {
  const {
    enableWillChange = true,
    enableTransform3d = true,
    enableBackfaceVisibility = true,
    enablePerspective = true
  } = performanceOptions;
  
  const optimizeVariant = (variant: any) => {
    if (typeof variant !== 'object' || variant === null) return variant;
    
    const optimized = { ...variant };
    
    // Apply performance optimizations
    if (enableWillChange && (variant.x !== undefined || variant.y !== undefined || variant.scale !== undefined || variant.rotate !== undefined || variant.opacity !== undefined)) {
      optimized.willChange = 'transform, opacity';
    }
    
    if (enableTransform3d && (variant.x !== undefined || variant.y !== undefined || variant.scale !== undefined || variant.rotate !== undefined)) {
      optimized.transform = optimized.transform ? `${optimized.transform} translate3d(0, 0, 0)` : 'translate3d(0, 0, 0)';
    }
    
    if (enableBackfaceVisibility) {
      optimized.backfaceVisibility = 'hidden';
    }
    
    if (enablePerspective) {
      optimized.perspective = 1000;
    }
    
    return optimized;
  };
  
  const optimizedVariant: Variants = {};
  
  Object.keys(baseVariant).forEach(key => {
    optimizedVariant[key] = optimizeVariant(baseVariant[key]);
  });
  
  return optimizedVariant;
};
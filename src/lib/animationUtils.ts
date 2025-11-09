import { Variants } from 'framer-motion';

// Easing functions for consistent animations
export const easingFunctions = {
  smooth: [0.4, 0, 0.2, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  elastic: [0.175, 0.885, 0.32, 1.275] as const,
  sharp: [0.4, 0, 0.6, 1] as const,
};

// Duration presets
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// Common motion variants
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: durations.normal, ease: easingFunctions.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durations.fast, ease: easingFunctions.sharp }
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: durations.normal, ease: easingFunctions.smooth }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: durations.fast, ease: easingFunctions.sharp }
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: durations.normal, ease: easingFunctions.smooth }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: durations.fast, ease: easingFunctions.sharp }
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: durations.normal, ease: easingFunctions.smooth }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: { duration: durations.fast, ease: easingFunctions.sharp }
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: durations.normal, ease: easingFunctions.smooth }
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: { duration: durations.fast, ease: easingFunctions.sharp }
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: durations.normal, ease: easingFunctions.smooth }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: durations.fast, ease: easingFunctions.sharp }
  },
};

export const bounceScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: durations.slow, ease: easingFunctions.bounce }
  },
  exit: { 
    opacity: 0, 
    scale: 0.3,
    transition: { duration: durations.fast, ease: easingFunctions.sharp }
  },
};

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Hover and tap variants for interactive elements
export const hoverScaleVariants: Variants = {
  hover: { 
    scale: 1.05,
    transition: { duration: durations.fast, ease: easingFunctions.smooth }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: durations.instant, ease: easingFunctions.sharp }
  },
};

export const hoverLiftVariants: Variants = {
  hover: { 
    y: -5,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    transition: { duration: durations.fast, ease: easingFunctions.smooth }
  },
  tap: { 
    y: -2,
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: { duration: durations.instant, ease: easingFunctions.sharp }
  },
};

// Utility functions
export const createSlideVariants = (direction: 'up' | 'down' | 'left' | 'right', distance = 20): Variants => {
  const getTransform = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
    }
  };

  return {
    hidden: { opacity: 0, ...getTransform() },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { duration: durations.normal, ease: easingFunctions.smooth }
    },
    exit: { 
      opacity: 0, 
      ...getTransform(),
      transition: { duration: durations.fast, ease: easingFunctions.sharp }
    },
  };
};

export const createStaggerVariants = (staggerDelay = 0.1, initialDelay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: staggerDelay * 0.5,
      staggerDirection: -1,
    },
  },
});

// Responsive animation configuration
export interface ResponsiveAnimationConfig {
  mobile: {
    reduceComplexity: boolean;
    simplifyEffects: boolean;
    lowerFrameRate: boolean;
    disableParticles: boolean;
  };
  tablet: {
    moderateEffects: boolean;
    reducedParticles: boolean;
    optimizedTransforms: boolean;
  };
  desktop: {
    fullEffects: boolean;
    highQuality: boolean;
    advancedFeatures: boolean;
  };
}

export const responsiveAnimationConfig: ResponsiveAnimationConfig = {
  mobile: {
    reduceComplexity: true,
    simplifyEffects: true,
    lowerFrameRate: true,
    disableParticles: true,
  },
  tablet: {
    moderateEffects: true,
    reducedParticles: true,
    optimizedTransforms: true,
  },
  desktop: {
    fullEffects: true,
    highQuality: true,
    advancedFeatures: true,
  },
};

// Breakpoint detection utility
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

// Animation performance utilities
export const shouldReduceMotion = (prefersReducedMotion: boolean, deviceType: 'mobile' | 'tablet' | 'desktop'): boolean => {
  if (prefersReducedMotion) return true;
  return deviceType === 'mobile' && responsiveAnimationConfig.mobile.reduceComplexity;
};

export const getOptimizedDuration = (baseDuration: number, deviceType: 'mobile' | 'tablet' | 'desktop'): number => {
  switch (deviceType) {
    case 'mobile':
      return baseDuration * 0.7; // Faster animations on mobile
    case 'tablet':
      return baseDuration * 0.85;
    default:
      return baseDuration;
  }
};
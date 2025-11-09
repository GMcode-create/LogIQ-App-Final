import { motion, Variants } from 'framer-motion';
import { ReactNode, forwardRef, useEffect, useRef, useState, Suspense } from 'react';
import { useAccessibilityPreferences, useBrowserCapabilities, useReducedMotion } from '@/hooks/use-scroll-animation';
import { createAccessibleAnimation, getAnimationAriaProps } from '@/lib/animation-utils';
import { 
  scrollFadeInUp, 
  scrollFadeInScale, 
  scrollSlideInLeft, 
  scrollSlideInRight,
  scrollStaggerContainer,
  scrollStaggerContainerFast,
  scrollStaggerItem,
  scrollCardReveal,
  scrollSectionHeader,
  createOptimizedVariants
} from '@/lib/animations';
import { AnimationErrorBoundary } from './animation-error-boundary';
import { ScrollRevealSkeleton } from './animation-loading-states';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: 'fadeUp' | 'fadeScale' | 'slideLeft' | 'slideRight' | 'card' | 'header';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  // Accessibility props
  ariaLabel?: string;
  ariaLive?: 'polite' | 'assertive' | 'off';
  ariaDescribedBy?: string;
  announceAnimation?: boolean;
  // Performance props
  enablePerformanceOptimization?: boolean;
  disableAnimationOnLowEnd?: boolean;
}

const variantMap: Record<string, Variants> = {
  fadeUp: scrollFadeInUp,
  fadeScale: scrollFadeInScale,
  slideLeft: scrollSlideInLeft,
  slideRight: scrollSlideInRight,
  card: scrollCardReveal,
  header: scrollSectionHeader,
};

export const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({ 
    children, 
    variant = 'fadeUp', 
    delay = 0, 
    duration,
    className = '',
    threshold = 0.1,
    rootMargin = '-50px',
    once = true,
    // Accessibility props
    ariaLabel,
    ariaLive = 'polite',
    ariaDescribedBy,
    announceAnimation = false,
    // Performance props
    enablePerformanceOptimization = true,
    disableAnimationOnLowEnd = true
  }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const cleanupRef = useRef<(() => void) | null>(null);
    
    // Hooks for accessibility and performance
    const capabilities = useBrowserCapabilities();
    const [isAnimating, setIsAnimating] = useState(false);
    const { prefersReducedMotion } = useAccessibilityPreferences();
    
    const shouldAnimate = capabilities.supportsAnimations && 
                         capabilities.supportsTransforms && 
                         !prefersReducedMotion;

    const startAnimation = () => {
      setIsAnimating(true);
    };

    const endAnimation = () => {
      setIsAnimating(false);
    };

    // Determine if we should disable animations based on capabilities
    const shouldDisableAnimation = disableAnimationOnLowEnd && (
      !capabilities.supportsAnimations ||
      !capabilities.supportsTransforms ||
      !capabilities.supportsIntersectionObserver
    );

    const baseVariant = variantMap[variant];
    
    // Create custom variant with delay and duration if provided
    const customVariant: Variants = duration || delay ? {
      ...baseVariant,
      visible: {
        ...baseVariant.visible,
        transition: {
          ...baseVariant.visible.transition,
          ...(delay && { delay }),
          ...(duration && { duration }),
        },
      },
    } : baseVariant;

    // Use accessible variants that handle reduced motion and browser capabilities
    const animationVariant = shouldDisableAnimation 
      ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
      : createAccessibleAnimation(customVariant, {
          respectReducedMotion: true,
          fallbackDuration: 0.3,
          enablePerformanceOptimizations: enablePerformanceOptimization
        });

    // Performance optimization handled by existing elementRef

    // Get ARIA properties for the animated element
    const ariaProps = getAnimationAriaProps(isAnimating, {
      label: ariaLabel,
      live: ariaLive,
      describedBy: ariaDescribedBy,
    });

    return (
      <AnimationErrorBoundary
        fallback={<ScrollRevealSkeleton className={className} />}
        onError={(error) => console.warn('ScrollReveal animation error:', error)}
      >
        <Suspense fallback={<ScrollRevealSkeleton className={className} />}>
          <motion.div
            ref={(node) => {
              elementRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={`${className} ${enablePerformanceOptimization ? 'animate-optimized' : ''}`}
            variants={animationVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ 
              once, 
              amount: threshold,
              margin: rootMargin
            }}
            onAnimationStart={startAnimation}
            onAnimationComplete={() => {
              endAnimation();
              // Clean up performance optimizations after animation
              if (elementRef.current && enablePerformanceOptimization) {
                elementRef.current.classList.add('animate-complete');
              }
            }}
            {...ariaProps}
          >
            {children}
          </motion.div>
        </Suspense>
      </AnimationErrorBoundary>
    );
  }
);

ScrollReveal.displayName = 'ScrollReveal';

interface ScrollStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  fast?: boolean;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const ScrollStagger = forwardRef<HTMLDivElement, ScrollStaggerProps>(
  ({ 
    children, 
    className = '',
    staggerDelay,
    delayChildren,
    fast = false,
    threshold = 0.1,
    rootMargin = '-50px',
    once = true
  }, ref) => {
    const capabilities = useBrowserCapabilities();
    const baseContainer = fast ? scrollStaggerContainerFast : scrollStaggerContainer;
    
    // Create custom container variant with custom timing if provided
    const customContainer: Variants = staggerDelay || delayChildren ? {
      ...baseContainer,
      visible: {
        transition: {
          ...(staggerDelay && { staggerChildren: staggerDelay }),
          ...(delayChildren && { delayChildren }),
        },
      },
    } : baseContainer;

    // Use accessible variants for better accessibility and performance
    const containerVariant = !capabilities.supportsAnimations 
      ? { hidden: {}, visible: {} }
      : createAccessibleAnimation(customContainer, {
          respectReducedMotion: true,
          fallbackDuration: 0.3,
          enablePerformanceOptimizations: true
        });

    return (
      <motion.div
        ref={ref}
        className={`${className} animate-optimized`}
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ 
          once, 
          amount: threshold,
          margin: rootMargin
        }}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollStagger.displayName = 'ScrollStagger';

interface ScrollStaggerItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export const ScrollStaggerItem = forwardRef<HTMLDivElement, ScrollStaggerItemProps>(
  ({ children, className = '', index }, ref) => {
    const capabilities = useBrowserCapabilities();
    
    // Use accessible variants for better accessibility and performance
    const animationVariant = !capabilities.supportsAnimations 
      ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
      : createAccessibleAnimation(scrollStaggerItem, {
          respectReducedMotion: true,
          fallbackDuration: 0.3,
          enablePerformanceOptimizations: true
        });

    return (
      <motion.div
        ref={ref}
        className={`${className} animate-optimized`}
        variants={animationVariant}
        custom={index}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollStaggerItem.displayName = 'ScrollStaggerItem';

// Utility component for section headers with consistent animation
interface ScrollSectionHeaderProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollSectionHeader = ({ children, className = '', delay = 0 }: ScrollSectionHeaderProps) => {
  return (
    <ScrollReveal 
      variant="header" 
      delay={delay}
      className={className}
      threshold={0.2}
      rootMargin="-100px"
    >
      {children}
    </ScrollReveal>
  );
};

// Utility component for cards with consistent animation
interface ScrollCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

export const ScrollCard = ({ children, className = '', delay = 0, index = 0 }: ScrollCardProps) => {
  return (
    <ScrollReveal 
      variant="card" 
      delay={delay + (index * 0.1)}
      className={className}
      threshold={0.15}
    >
      {children}
    </ScrollReveal>
  );
};
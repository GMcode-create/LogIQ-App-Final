import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { useAccessibilityPreferences, useBrowserCapabilities } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface AccessibleMotionProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  // Accessibility options
  ariaLabel?: string;
  ariaLive?: 'polite' | 'assertive' | 'off';
  ariaDescribedBy?: string;
  role?: string;
  // Animation options
  respectReducedMotion?: boolean;
  fallbackDuration?: number;
  enablePerformanceOptimization?: boolean;
  // Performance options
  enableWillChange?: boolean;
  enableTransform3d?: boolean;
  enableBackfaceVisibility?: boolean;
  // Announcement options
  announceAnimationStart?: boolean;
  announceAnimationEnd?: boolean;
  customStartAnnouncement?: string;
  customEndAnnouncement?: string;
}

const AccessibleMotion = forwardRef<HTMLDivElement, AccessibleMotionProps>(
  ({
    children,
    className,
    ariaLabel,
    ariaLive = 'polite',
    ariaDescribedBy,
    role,
    respectReducedMotion = true,
    fallbackDuration = 0.3,
    enablePerformanceOptimization = true,
    enableWillChange = true,
    enableTransform3d = true,
    enableBackfaceVisibility = true,
    announceAnimationStart = false,
    announceAnimationEnd = false,
    customStartAnnouncement,
    customEndAnnouncement,
    variants,
    initial,
    animate,
    exit,
    transition,
    ...motionProps
  }, ref) => {
    const { prefersReducedMotion, prefersHighContrast } = useAccessibilityPreferences();
    const { supportsAnimations, supportsTransforms, supportsTransform3d } = useBrowserCapabilities();
    const [isAnimating, setIsAnimating] = useState(false);
    const announcementRef = useRef<HTMLDivElement>(null);
    const elementRef = useRef<HTMLDivElement>(null);

    // Determine if animations should be enabled
    const shouldAnimate = supportsAnimations && 
                         supportsTransforms && 
                         (!respectReducedMotion || !prefersReducedMotion);

    // Create optimized variants based on user preferences and browser capabilities
    const createOptimizedVariants = (originalVariants?: Variants): Variants | undefined => {
      if (!originalVariants) return undefined;

      // If reduced motion is preferred, return simplified variants
      if (respectReducedMotion && prefersReducedMotion) {
        const simplifiedVariants: Variants = {};
        Object.keys(originalVariants).forEach(key => {
          simplifiedVariants[key] = {
            opacity: key === 'hidden' ? 0 : 1,
            transition: { duration: fallbackDuration }
          };
        });
        return simplifiedVariants;
      }

      // If no animation support, return static variants
      if (!shouldAnimate) {
        const staticVariants: Variants = {};
        Object.keys(originalVariants).forEach(key => {
          staticVariants[key] = {
            opacity: key === 'hidden' ? 0 : 1,
          };
        });
        return staticVariants;
      }

      // Apply performance optimizations to variants
      if (enablePerformanceOptimization) {
        const optimizedVariants: Variants = {};
        Object.keys(originalVariants).forEach(key => {
          const variant = originalVariants[key];
          if (typeof variant === 'object' && variant !== null) {
            optimizedVariants[key] = {
              ...variant,
              // Add hardware acceleration hints
              ...(enableTransform3d && supportsTransform3d && {
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: enableBackfaceVisibility ? 'hidden' : undefined,
              }),
              // Optimize transition
              transition: {
                ...variant.transition,
                ...(enableWillChange && {
                  willChange: 'transform, opacity',
                }),
              },
            };
          } else {
            optimizedVariants[key] = variant;
          }
        });
        return optimizedVariants;
      }

      return originalVariants;
    };

    // Apply performance optimizations to element
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !enablePerformanceOptimization || !shouldAnimate) return;

      const originalStyles = {
        willChange: element.style.willChange,
        transform: element.style.transform,
        backfaceVisibility: element.style.backfaceVisibility,
      };

      // Apply optimizations
      if (enableWillChange) {
        element.style.willChange = 'transform, opacity';
      }

      if (enableTransform3d && supportsTransform3d) {
        const currentTransform = element.style.transform;
        element.style.transform = currentTransform 
          ? `${currentTransform} translate3d(0, 0, 0)` 
          : 'translate3d(0, 0, 0)';
      }

      if (enableBackfaceVisibility) {
        element.style.backfaceVisibility = 'hidden';
      }

      // Cleanup function
      return () => {
        element.style.willChange = originalStyles.willChange || 'auto';
        element.style.transform = originalStyles.transform || '';
        element.style.backfaceVisibility = originalStyles.backfaceVisibility || '';
      };
    }, [enablePerformanceOptimization, enableWillChange, enableTransform3d, enableBackfaceVisibility, shouldAnimate, supportsTransform3d]);

    // Handle animation lifecycle announcements
    const handleAnimationStart = () => {
      setIsAnimating(true);
      
      if (announceAnimationStart && announcementRef.current) {
        const announcement = customStartAnnouncement || 
                           `Animation started${ariaLabel ? `: ${ariaLabel}` : ''}`;
        announcementRef.current.textContent = announcement;
      }
    };

    const handleAnimationComplete = () => {
      setIsAnimating(false);
      
      if (announceAnimationEnd && announcementRef.current) {
        const announcement = customEndAnnouncement || 
                           `Animation completed${ariaLabel ? `: ${ariaLabel}` : ''}`;
        announcementRef.current.textContent = announcement;
      }

      // Clean up performance optimizations after animation
      const element = elementRef.current;
      if (element && enablePerformanceOptimization) {
        setTimeout(() => {
          element.style.willChange = 'auto';
        }, 100);
      }
    };

    // Get ARIA properties
    const getAriaProps = () => {
      const props: Record<string, string> = {};
      
      if (ariaLabel) props['aria-label'] = ariaLabel;
      if (ariaDescribedBy) props['aria-describedby'] = ariaDescribedBy;
      if (role) props['role'] = role;
      if (ariaLive !== 'off') props['aria-live'] = ariaLive;
      
      // Add animation state
      props['aria-busy'] = isAnimating.toString();
      
      return props;
    };

    // Optimized variants
    const optimizedVariants = createOptimizedVariants(variants);

    // If animations are not supported or disabled, render static content
    if (!shouldAnimate) {
      return (
        <>
          <div
            ref={elementRef}
            className={cn(className, 'animate-optimized')}
            {...getAriaProps()}
          >
            {children}
          </div>
          {(announceAnimationStart || announceAnimationEnd) && (
            <div
              ref={announcementRef}
              className="sr-only"
              aria-live={ariaLive}
              aria-atomic="true"
            />
          )}
        </>
      );
    }

    return (
      <>
        <motion.div
          ref={(node) => {
            elementRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={cn(className, 'animate-optimized')}
          variants={optimizedVariants}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
          {...getAriaProps()}
          {...motionProps}
        >
          {children}
        </motion.div>
        {(announceAnimationStart || announceAnimationEnd) && (
          <div
            ref={announcementRef}
            className="sr-only"
            aria-live={ariaLive}
            aria-atomic="true"
          />
        )}
      </>
    );
  }
);

AccessibleMotion.displayName = 'AccessibleMotion';

// Higher-order component for wrapping existing motion components
export const withAccessibility = <P extends object>(
  MotionComponent: React.ComponentType<P & MotionProps>
) => {
  return forwardRef<HTMLElement, P & AccessibleMotionProps>((props, ref) => {
    const {
      ariaLabel,
      ariaLive = 'polite',
      ariaDescribedBy,
      role,
      respectReducedMotion = true,
      fallbackDuration = 0.3,
      enablePerformanceOptimization = true,
      announceAnimationStart = false,
      announceAnimationEnd = false,
      customStartAnnouncement,
      customEndAnnouncement,
      ...motionProps
    } = props;

    return (
      <AccessibleMotion
        ref={ref}
        ariaLabel={ariaLabel}
        ariaLive={ariaLive}
        ariaDescribedBy={ariaDescribedBy}
        role={role}
        respectReducedMotion={respectReducedMotion}
        fallbackDuration={fallbackDuration}
        enablePerformanceOptimization={enablePerformanceOptimization}
        announceAnimationStart={announceAnimationStart}
        announceAnimationEnd={announceAnimationEnd}
        customStartAnnouncement={customStartAnnouncement}
        customEndAnnouncement={customEndAnnouncement}
        {...(motionProps as MotionProps)}
      />
    );
  });
};

// Pre-configured accessible motion components
export const AccessibleMotionDiv = AccessibleMotion;

export const AccessibleMotionButton = forwardRef<HTMLButtonElement, AccessibleMotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const { children, ...accessibleProps } = props;
    return (
      <AccessibleMotion
        as="button"
        ref={ref as any}
        role="button"
        {...accessibleProps}
      >
        {children}
      </AccessibleMotion>
    );
  }
);

AccessibleMotionButton.displayName = 'AccessibleMotionButton';

export const AccessibleMotionSection = forwardRef<HTMLElement, AccessibleMotionProps & React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { children, ...accessibleProps } = props;
    return (
      <AccessibleMotion
        as="section"
        ref={ref as any}
        role="region"
        {...accessibleProps}
      >
        {children}
      </AccessibleMotion>
    );
  }
);

AccessibleMotionSection.displayName = 'AccessibleMotionSection';

export default AccessibleMotion;
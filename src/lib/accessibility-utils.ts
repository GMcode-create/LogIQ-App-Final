import React, { useEffect, useRef, useCallback } from 'react';

// ARIA label utilities for animated elements
export const createAriaProps = (
  isAnimating: boolean,
  options: {
    label?: string;
    live?: 'polite' | 'assertive' | 'off';
    describedBy?: string;
    role?: string;
    hidden?: boolean;
  } = {}
): Record<string, string> => {
  const { label, live = 'polite', describedBy, role, hidden } = options;
  
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
  
  return props;
};

// Performance optimization utilities
export const usePerformanceOptimization = (
  enabled: boolean = true,
  options: {
    enableWillChange?: boolean;
    enableTransform3d?: boolean;
    enableBackfaceVisibility?: boolean;
    enablePerspective?: boolean;
    autoCleanup?: boolean;
    cleanupDelay?: number;
  } = {}
) => {
  const elementRef = useRef<HTMLElement>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout>();
  
  const {
    enableWillChange = true,
    enableTransform3d = true,
    enableBackfaceVisibility = true,
    enablePerspective = true,
    autoCleanup = true,
    cleanupDelay = 1000
  } = options;

  const applyOptimizations = useCallback(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    // Store original values for restoration
    const originalStyles = {
      willChange: element.style.willChange,
      transform: element.style.transform,
      backfaceVisibility: element.style.backfaceVisibility,
      perspective: element.style.perspective,
    };

    // Apply performance optimizations
    if (enableWillChange) {
      element.style.willChange = 'transform, opacity';
    }

    if (enableTransform3d) {
      const currentTransform = element.style.transform;
      element.style.transform = currentTransform 
        ? `${currentTransform} translate3d(0, 0, 0)` 
        : 'translate3d(0, 0, 0)';
    }

    if (enableBackfaceVisibility) {
      element.style.backfaceVisibility = 'hidden';
    }

    if (enablePerspective) {
      element.style.perspective = '1000px';
    }

    // Auto cleanup after delay
    if (autoCleanup) {
      cleanupTimeoutRef.current = setTimeout(() => {
        cleanup();
      }, cleanupDelay);
    }

    // Return cleanup function
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      
      element.style.willChange = originalStyles.willChange || 'auto';
      element.style.transform = originalStyles.transform || '';
      element.style.backfaceVisibility = originalStyles.backfaceVisibility || '';
      element.style.perspective = originalStyles.perspective || '';
    };
  }, [enabled, enableWillChange, enableTransform3d, enableBackfaceVisibility, enablePerspective, autoCleanup, cleanupDelay]);

  const cleanup = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }
    
    element.style.willChange = 'auto';
    element.style.transform = element.style.transform.replace('translate3d(0, 0, 0)', '').trim();
    element.style.backfaceVisibility = '';
    element.style.perspective = '';
  }, []);

  useEffect(() => {
    return applyOptimizations();
  }, [applyOptimizations]);

  return { elementRef, applyOptimizations, cleanup };
};

// Focus management utilities
export const useFocusManagement = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);
  
  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
  }, []);
  
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);
  
  return { saveFocus, restoreFocus, trapFocus };
};

// Screen reader announcement utilities
export const useScreenReaderAnnouncements = () => {
  const announcementRef = useRef<HTMLDivElement>(null);
  
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) return;
    
    // Clear previous announcement
    announcementRef.current.textContent = '';
    
    // Set new announcement after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.setAttribute('aria-live', priority);
        announcementRef.current.textContent = message;
      }
    }, 100);
  }, []);
  
  const AnnouncementRegion = useCallback(() => {
    return React.createElement('div', {
      ref: announcementRef,
      className: 'sr-only',
      'aria-live': 'polite',
      'aria-atomic': 'true'
    });
  }, []);
  
  return { announce, AnnouncementRegion };
};

// Browser capability detection
export const detectBrowserCapabilities = () => {
  if (typeof window === 'undefined') {
    return {
      supportsAnimations: false,
      supportsTransforms: false,
      supportsTransform3d: false,
      supportsWillChange: false,
      supportsIntersectionObserver: false,
      supportsRequestAnimationFrame: false,
      supportsBackfaceVisibility: false,
      supportsPerspective: false,
    };
  }

  const testElement = document.createElement('div');
  
  const supportsAnimations = 'animation' in testElement.style ||
                            'webkitAnimation' in testElement.style ||
                            'mozAnimation' in testElement.style;
  
  const supportsTransforms = 'transform' in testElement.style ||
                            'webkitTransform' in testElement.style ||
                            'mozTransform' in testElement.style;
  
  const supportsTransform3d = (() => {
    try {
      testElement.style.transform = 'translate3d(0, 0, 0)';
      return testElement.style.transform !== '';
    } catch (e) {
      return false;
    }
  })();
  
  const supportsWillChange = 'willChange' in testElement.style;
  const supportsBackfaceVisibility = 'backfaceVisibility' in testElement.style ||
                                     'webkitBackfaceVisibility' in testElement.style;
  const supportsPerspective = 'perspective' in testElement.style ||
                             'webkitPerspective' in testElement.style;
  
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const supportsRequestAnimationFrame = 'requestAnimationFrame' in window;

  return {
    supportsAnimations,
    supportsTransforms,
    supportsTransform3d,
    supportsWillChange,
    supportsIntersectionObserver,
    supportsRequestAnimationFrame,
    supportsBackfaceVisibility,
    supportsPerspective,
  };
};

// Accessibility preference detection
export const detectAccessibilityPreferences = () => {
  if (typeof window === 'undefined') {
    return {
      prefersReducedMotion: false,
      prefersHighContrast: false,
      prefersReducedTransparency: false,
      prefersReducedData: false,
      prefersColorScheme: 'dark' as const,
    };
  }

  return {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
    prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches,
    prefersColorScheme: window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' as const : 'dark' as const,
  };
};

// Enhanced ARIA announcement system with better screen reader support
export const createAdvancedAriaAnnouncer = () => {
  let announcementElement: HTMLDivElement | null = null;
  let politeElement: HTMLDivElement | null = null;
  let assertiveElement: HTMLDivElement | null = null;
  
  const ensureAnnouncementElements = () => {
    if (!politeElement) {
      politeElement = document.createElement('div');
      politeElement.className = 'sr-only';
      politeElement.setAttribute('aria-live', 'polite');
      politeElement.setAttribute('aria-atomic', 'true');
      politeElement.setAttribute('id', 'aria-announcer-polite');
      document.body.appendChild(politeElement);
    }
    
    if (!assertiveElement) {
      assertiveElement = document.createElement('div');
      assertiveElement.className = 'sr-only';
      assertiveElement.setAttribute('aria-live', 'assertive');
      assertiveElement.setAttribute('aria-atomic', 'true');
      assertiveElement.setAttribute('id', 'aria-announcer-assertive');
      document.body.appendChild(assertiveElement);
    }
    
    return { politeElement, assertiveElement };
  };
  
  const announce = (
    message: string, 
    priority: 'polite' | 'assertive' = 'polite',
    delay: number = 100
  ) => {
    const { politeElement, assertiveElement } = ensureAnnouncementElements();
    const targetElement = priority === 'assertive' ? assertiveElement : politeElement;
    
    // Clear previous announcement
    targetElement.textContent = '';
    
    // Set new announcement after a brief delay
    setTimeout(() => {
      targetElement.textContent = message;
      
      // Clear after announcement to prevent repetition
      setTimeout(() => {
        targetElement.textContent = '';
      }, 1000);
    }, delay);
  };
  
  const announceAnimationState = (
    state: 'started' | 'completed' | 'paused' | 'resumed',
    elementLabel?: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const messages = {
      started: elementLabel ? `Animation started for ${elementLabel}` : 'Animation started',
      completed: elementLabel ? `Animation completed for ${elementLabel}` : 'Animation completed',
      paused: elementLabel ? `Animation paused for ${elementLabel}` : 'Animation paused',
      resumed: elementLabel ? `Animation resumed for ${elementLabel}` : 'Animation resumed'
    };
    
    announce(messages[state], priority);
  };
  
  const announceLoadingState = (
    isLoading: boolean,
    elementLabel?: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const message = isLoading
      ? (elementLabel ? `Loading ${elementLabel}` : 'Loading')
      : (elementLabel ? `${elementLabel} loaded` : 'Loading complete');
    
    announce(message, priority);
  };
  
  const cleanup = () => {
    [politeElement, assertiveElement].forEach(element => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    politeElement = null;
    assertiveElement = null;
  };
  
  return {
    announce,
    announceAnimationState,
    announceLoadingState,
    cleanup
  };
};

// Enhanced performance optimization with comprehensive browser support detection
export const createAdvancedPerformanceOptimizer = () => {
  const capabilities = detectBrowserCapabilities();
  
  const optimizeElement = (
    element: HTMLElement,
    options: {
      enableWillChange?: boolean;
      enableTransform3d?: boolean;
      enableBackfaceVisibility?: boolean;
      enablePerspective?: boolean;
      enableContainment?: boolean;
      enableIsolation?: boolean;
      autoCleanup?: boolean;
      cleanupDelay?: number;
      respectReducedMotion?: boolean;
    } = {}
  ) => {
    const {
      enableWillChange = true,
      enableTransform3d = true,
      enableBackfaceVisibility = true,
      enablePerspective = true,
      enableContainment = true,
      enableIsolation = true,
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
      isolation: element.style.isolation,
    };
    
    // Apply optimizations based on browser support
    if (enableWillChange && capabilities.supportsWillChange) {
      element.style.willChange = 'transform, opacity';
    }
    
    if (enableTransform3d && capabilities.supportsTransform3d) {
      const currentTransform = element.style.transform;
      element.style.transform = currentTransform 
        ? `${currentTransform} translate3d(0, 0, 0)` 
        : 'translate3d(0, 0, 0)';
    }
    
    if (enableBackfaceVisibility && capabilities.supportsBackfaceVisibility) {
      element.style.backfaceVisibility = 'hidden';
    }
    
    if (enablePerspective && capabilities.supportsPerspective) {
      element.style.perspective = '1000px';
    }
    
    if (enableContainment && 'contain' in element.style) {
      element.style.contain = 'layout style paint';
    }
    
    if (enableIsolation && 'isolation' in element.style) {
      element.style.isolation = 'isolate';
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
      Object.entries(originalStyles).forEach(([property, value]) => {
        (element.style as any)[property] = value || '';
      });
    };
    
    return cleanup;
  };
  
  return { optimizeElement, capabilities };
};

// Create accessible animation variants with comprehensive fallback support
export const createAccessibleVariants = (
  baseVariants: any,
  options: {
    respectReducedMotion?: boolean;
    fallbackDuration?: number;
    enablePerformanceOptimizations?: boolean;
    ariaLabel?: string;
    ariaLive?: 'polite' | 'assertive' | 'off';
    enableFallbacks?: boolean;
    enableAdvancedOptimizations?: boolean;
  } = {}
) => {
  const {
    respectReducedMotion = true,
    fallbackDuration = 0.3,
    enablePerformanceOptimizations = true,
    enableFallbacks = true,
    enableAdvancedOptimizations = false
  } = options;

  const preferences = detectAccessibilityPreferences();
  const capabilities = detectBrowserCapabilities();

  // Return static variants if animations aren't supported
  if (!capabilities.supportsAnimations || !capabilities.supportsTransforms) {
    if (!enableFallbacks) return baseVariants;
    
    const staticVariants: any = {};
    Object.keys(baseVariants).forEach(key => {
      staticVariants[key] = {
        opacity: key === 'hidden' ? 0 : 1,
        // Preserve non-animation properties
        ...Object.fromEntries(
          Object.entries(baseVariants[key] || {}).filter(([prop]) => 
            !['x', 'y', 'scale', 'rotate', 'transition', 'transform'].includes(prop)
          )
        )
      };
    });
    return staticVariants;
  }

  // Return simplified variants for reduced motion
  if (respectReducedMotion && preferences.prefersReducedMotion) {
    const simplifiedVariants: any = {};
    Object.keys(baseVariants).forEach(key => {
      const originalVariant = baseVariants[key] || {};
      simplifiedVariants[key] = {
        opacity: key === 'hidden' ? 0 : 1,
        // Preserve color, background, and other non-motion properties
        ...Object.fromEntries(
          Object.entries(originalVariant).filter(([prop]) => 
            ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].includes(prop)
          )
        ),
        transition: { duration: fallbackDuration }
      };
    });
    return simplifiedVariants;
  }

  // Apply performance optimizations if enabled
  if (enablePerformanceOptimizations) {
    const optimizedVariants: any = {};
    Object.keys(baseVariants).forEach(key => {
      const variant = baseVariants[key];
      if (typeof variant === 'object' && variant !== null) {
        const hasTransformProps = ['x', 'y', 'scale', 'rotate', 'skew'].some(prop => prop in variant);
        
        optimizedVariants[key] = {
          ...variant,
          // Add hardware acceleration hints only if transform properties exist
          ...(hasTransformProps && capabilities.supportsTransform3d && {
            transform: variant.transform ? 
              `${variant.transform} translate3d(0, 0, 0)` : 
              'translate3d(0, 0, 0)',
          }),
          ...(hasTransformProps && capabilities.supportsBackfaceVisibility && {
            backfaceVisibility: 'hidden',
          }),
          ...(hasTransformProps && capabilities.supportsPerspective && {
            perspective: 1000,
          }),
          // Advanced optimizations
          ...(enableAdvancedOptimizations && hasTransformProps && {
            contain: 'layout style paint',
            isolation: 'isolate',
          }),
          // Optimize transition with will-change
          transition: {
            ...variant.transition,
            ...(capabilities.supportsWillChange && hasTransformProps && {
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

  return baseVariants;
};

// Utility to add skip links for keyboard navigation
export const addSkipLinks = (targets: Array<{ id: string; label: string }>) => {
  const skipLinksContainer = document.createElement('div');
  skipLinksContainer.className = 'skip-links';
  
  targets.forEach(({ id, label }) => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${id}`;
    skipLink.className = 'skip-link';
    skipLink.textContent = `Skip to ${label}`;
    skipLinksContainer.appendChild(skipLink);
  });
  
  document.body.insertBefore(skipLinksContainer, document.body.firstChild);
};

// Utility to ensure proper heading hierarchy
export const validateHeadingHierarchy = () => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const issues: string[] = [];
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    
    if (index === 0 && currentLevel !== 1) {
      issues.push('Page should start with an h1 element');
    }
    
    if (currentLevel > previousLevel + 1) {
      issues.push(`Heading level jumps from h${previousLevel} to h${currentLevel} - should be sequential`);
    }
    
    previousLevel = currentLevel;
  });
  
  if (issues.length > 0) {
    console.warn('Heading hierarchy issues found:', issues);
  }
  
  return issues;
};

// Utility to check color contrast
export const checkColorContrast = (foreground: string, background: string): number => {
  // Simple contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing and contrast calculation
  const getLuminance = (color: string): number => {
    // This is a simplified version - you'd want to use a proper color library
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      const val = parseInt(c) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

export default {
  createAriaProps,
  usePerformanceOptimization,
  useFocusManagement,
  useScreenReaderAnnouncements,
  detectBrowserCapabilities,
  detectAccessibilityPreferences,
  createAccessibleVariants,
  createAdvancedAriaAnnouncer,
  createAdvancedPerformanceOptimizer,
  addSkipLinks,
  validateHeadingHierarchy,
  checkColorContrast,
};
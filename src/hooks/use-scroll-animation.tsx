import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'framer-motion';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  delay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    threshold: options.threshold || 0.1,
    once: options.triggerOnce !== false,
    margin: options.rootMargin || '-100px',
  });

  return { ref, isInView };
};

// Enhanced scroll animation hook with performance optimization
export const useOptimizedScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isInView = useInView(ref, {
    threshold: options.threshold || 0.1,
    once: options.triggerOnce !== false,
    margin: options.rootMargin || '-100px',
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, options.delay || 0);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, options.delay]);

  return { ref, isInView: hasAnimated, isVisible: isInView };
};

export const useStaggeredAnimation = (itemCount: number, delay: number = 0.1) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const { ref, isInView } = useScrollAnimation();

  useEffect(() => {
    if (isInView) {
      const timeouts: NodeJS.Timeout[] = [];
      
      for (let i = 0; i < itemCount; i++) {
        const timeout = setTimeout(() => {
          setVisibleItems(prev => [...prev, i]);
        }, i * delay * 1000);
        
        timeouts.push(timeout);
      }

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [isInView, itemCount, delay]);

  return { ref, visibleItems, isInView };
};

export const useCountAnimation = (
  endValue: number,
  duration: number = 2000,
  startOnView: boolean = true
) => {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useScrollAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if ((startOnView && isInView && !hasAnimated) || (!startOnView && !hasAnimated)) {
      setHasAnimated(true);
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, endValue, duration, startOnView, hasAnimated]);

  return { ref, count, isInView };
};

export const useParallaxScroll = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Initialize with server-safe default
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Use both addEventListener and addListener for broader browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

// Enhanced accessibility hook with comprehensive support
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        prefersReducedMotion: false,
        prefersHighContrast: false,
        prefersReducedTransparency: false,
        prefersColorScheme: 'dark' as 'light' | 'dark',
      };
    }

    return {
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersReducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
      prefersColorScheme: window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' as const : 'dark' as const,
    };
  });

  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      reducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)'),
      colorScheme: window.matchMedia('(prefers-color-scheme: light)'),
    };

    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: mediaQueries.reducedMotion.matches,
        prefersHighContrast: mediaQueries.highContrast.matches,
        prefersReducedTransparency: mediaQueries.reducedTransparency.matches,
        prefersColorScheme: mediaQueries.colorScheme.matches ? 'light' : 'dark',
      });
    };

    // Set up listeners for all media queries
    Object.values(mediaQueries).forEach(mq => {
      if (mq.addEventListener) {
        mq.addEventListener('change', updatePreferences);
      } else if (mq.addListener) {
        mq.addListener(updatePreferences);
      }
    });

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        if (mq.removeEventListener) {
          mq.removeEventListener('change', updatePreferences);
        } else if (mq.removeListener) {
          mq.removeListener(updatePreferences);
        }
      });
    };
  }, []);

  return preferences;
};

// Enhanced scroll animation performance optimization
export const useScrollAnimationPerformance = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const optimizeAnimation = useCallback((element: HTMLElement) => {
    // Add will-change property for better performance
    element.style.willChange = 'transform, opacity';
    
    // Use transform3d to enable hardware acceleration
    element.style.transform = 'translate3d(0, 0, 0)';
    
    return () => {
      // Clean up will-change after animation
      element.style.willChange = 'auto';
    };
  }, []);

  const createOptimizedVariant = useCallback((baseVariant: any) => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { duration: 0.3 }
        }
      };
    }
    return baseVariant;
  }, [prefersReducedMotion]);

  return {
    isVisible,
    hasAnimated,
    prefersReducedMotion,
    optimizeAnimation,
    createOptimizedVariant
  };
};

// Intersection Observer with performance optimizations
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '-50px',
        ...options
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasIntersected, options]);

  return { targetRef, isIntersecting, hasIntersected };
};

// Debounced scroll handler for performance
export const useScrollHandler = (
  callback: () => void,
  delay: number = 16
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(callback, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Accessibility-aware animation hook with ARIA support
export const useAccessibleAnimation = (
  options: {
    respectReducedMotion?: boolean;
    ariaLabel?: string;
    ariaLive?: 'polite' | 'assertive' | 'off';
    announceStart?: boolean;
    announceEnd?: boolean;
  } = {}
) => {
  const {
    respectReducedMotion = true,
    ariaLabel,
    ariaLive = 'polite',
    announceStart = false,
    announceEnd = false
  } = options;
  
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const announcementRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = !respectReducedMotion || !prefersReducedMotion;

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    
    if (announceStart && announcementRef.current) {
      announcementRef.current.textContent = `Animation started: ${ariaLabel || 'Content animation'}`;
    }
  }, [announceStart, ariaLabel]);

  const endAnimation = useCallback(() => {
    setIsAnimating(false);
    
    if (announceEnd && announcementRef.current) {
      announcementRef.current.textContent = `Animation completed: ${ariaLabel || 'Content animation'}`;
    }
  }, [announceEnd, ariaLabel]);

  const getAriaProps = useCallback(() => ({
    'aria-busy': isAnimating.toString(),
    'aria-live': ariaLive,
    ...(ariaLabel && { 'aria-label': ariaLabel }),
  }), [isAnimating, ariaLive, ariaLabel]);

  // Screen reader announcement element
  const announcementElement = (
    <div
      ref={announcementRef}
      className="sr-only"
      aria-live={ariaLive}
      aria-atomic="true"
    />
  );

  return {
    isAnimating,
    shouldAnimate,
    prefersReducedMotion,
    startAnimation,
    endAnimation,
    getAriaProps,
    announcementElement
  };
};

// Performance monitoring hook for animations
export const useAnimationPerformance = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    frameRate: 0,
    droppedFrames: 0,
    averageFrameTime: 0,
  });
  
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  const startMonitoring = useCallback(() => {
    frameTimesRef.current = [];
    lastFrameTimeRef.current = performance.now();

    const measureFrame = (currentTime: number) => {
      const frameTime = currentTime - lastFrameTimeRef.current;
      frameTimesRef.current.push(frameTime);
      lastFrameTimeRef.current = currentTime;

      // Keep only last 60 frames for rolling average
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calculate metrics
      const averageFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const frameRate = 1000 / averageFrameTime;
      const droppedFrames = frameTimesRef.current.filter(time => time > 16.67).length; // 60fps = 16.67ms per frame

      setPerformanceMetrics({
        frameRate: Math.round(frameRate),
        droppedFrames,
        averageFrameTime: Math.round(averageFrameTime * 100) / 100,
      });

      animationFrameRef.current = requestAnimationFrame(measureFrame);
    };

    animationFrameRef.current = requestAnimationFrame(measureFrame);
  }, []);

  const stopMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    performanceMetrics,
    startMonitoring,
    stopMonitoring,
  };
};

// Browser capability detection hook
export const useBrowserCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    supportsAnimations: false,
    supportsTransforms: false,
    supportsTransform3d: false,
    supportsWillChange: false,
    supportsIntersectionObserver: false,
    supportsRequestAnimationFrame: false,
  });

  useEffect(() => {
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
    
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    
    const supportsRequestAnimationFrame = 'requestAnimationFrame' in window;

    setCapabilities({
      supportsAnimations,
      supportsTransforms,
      supportsTransform3d,
      supportsWillChange,
      supportsIntersectionObserver,
      supportsRequestAnimationFrame,
    });
  }, []);

  return capabilities;
};
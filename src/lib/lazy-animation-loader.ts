// Lazy loading utilities for animation libraries and components
// This helps reduce initial bundle size by loading animations only when needed

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import type { Variants } from 'framer-motion';

// Lazy load Framer Motion components
export const LazyMotion = lazy(() => 
  import('framer-motion').then(module => ({ default: module.motion.div }))
);

export const LazyAnimatePresence = lazy(() =>
  import('framer-motion').then(module => ({ default: module.AnimatePresence }))
);

// Lazy load heavy animation components
export const LazyScrollReveal = lazy(() => 
  import('@/components/ui/scroll-reveal').then(module => ({ 
    default: module.ScrollReveal 
  }))
);

export const LazyAnimatedContainer = lazy(() =>
  import('@/components/ui/animated-container').then(module => ({
    default: module.AnimatedContainer
  }))
);

export const LazyAnimatedButton = lazy(() =>
  import('@/components/ui/animated-button').then(module => ({
    default: module.AnimatedButton
  }))
);

// Lazy load animation variants
export const loadAnimationVariants = async (): Promise<typeof import('@/lib/animations')> => {
  return import('@/lib/animations');
};

export const loadAnimationUtils = async (): Promise<typeof import('@/lib/animation-utils')> => {
  return import('@/lib/animation-utils');
};

// Lazy load performance monitoring
export const loadPerformanceMonitor = async (): Promise<typeof import('@/lib/animation-performance-monitor')> => {
  return import('@/lib/animation-performance-monitor');
};

// Dynamic animation loader with fallback
export const loadAnimationComponent = async <T extends ComponentType<any>>(
  componentLoader: () => Promise<{ default: T }>,
  fallbackComponent?: ComponentType<any>
): Promise<T> => {
  try {
    const module = await componentLoader();
    return module.default;
  } catch (error) {
    console.warn('Failed to load animation component:', error);
    if (fallbackComponent) {
      return fallbackComponent as T;
    }
    throw error;
  }
};

// Preload critical animations
export const preloadCriticalAnimations = async (): Promise<void> => {
  try {
    // Preload only essential animation variants
    await Promise.all([
      loadAnimationVariants(),
      import('@/hooks/use-scroll-animation')
    ]);
  } catch (error) {
    console.warn('Failed to preload critical animations:', error);
  }
};

// Conditional animation loading based on user preferences
export const loadAnimationsConditionally = async (): Promise<{
  shouldLoadAnimations: boolean;
  animationVariants?: typeof import('@/lib/animations');
  animationUtils?: typeof import('@/lib/animation-utils');
}> => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check device capabilities
  const isLowEndDevice = typeof navigator !== 'undefined' && 
    'hardwareConcurrency' in navigator && 
    navigator.hardwareConcurrency <= 2;

  const shouldLoadAnimations = !prefersReducedMotion && !isLowEndDevice;

  if (!shouldLoadAnimations) {
    return { shouldLoadAnimations: false };
  }

  try {
    const [animationVariants, animationUtils] = await Promise.all([
      loadAnimationVariants(),
      loadAnimationUtils()
    ]);

    return {
      shouldLoadAnimations: true,
      animationVariants,
      animationUtils
    };
  } catch (error) {
    console.warn('Failed to load animations:', error);
    return { shouldLoadAnimations: false };
  }
};

// Animation bundle analyzer
export const getAnimationBundleInfo = (): {
  isFramerMotionLoaded: boolean;
  loadedComponents: string[];
  estimatedSize: number;
} => {
  const loadedComponents: string[] = [];
  let estimatedSize = 0;

  // Check if Framer Motion is loaded
  const isFramerMotionLoaded = typeof window !== 'undefined' && 
    'framerMotion' in window;

  // Estimate bundle size based on loaded components
  if (isFramerMotionLoaded) {
    estimatedSize += 50; // Framer Motion base size (KB)
    loadedComponents.push('framer-motion');
  }

  // Check for loaded animation components
  const animationElements = document.querySelectorAll('[data-framer-motion]');
  if (animationElements.length > 0) {
    estimatedSize += animationElements.length * 2; // Estimate 2KB per animated element
    loadedComponents.push(`${animationElements.length} animated elements`);
  }

  return {
    isFramerMotionLoaded,
    loadedComponents,
    estimatedSize
  };
};

// Progressive animation loading
export class ProgressiveAnimationLoader {
  private loadedModules = new Set<string>();
  private loadingPromises = new Map<string, Promise<any>>();

  async loadModule<T>(
    moduleId: string,
    loader: () => Promise<T>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    if (this.loadedModules.has(moduleId)) {
      return loader(); // Return cached result
    }

    if (this.loadingPromises.has(moduleId)) {
      return this.loadingPromises.get(moduleId)!;
    }

    const loadingPromise = this.loadWithPriority(loader, priority);
    this.loadingPromises.set(moduleId, loadingPromise);

    try {
      const result = await loadingPromise;
      this.loadedModules.add(moduleId);
      this.loadingPromises.delete(moduleId);
      return result;
    } catch (error) {
      this.loadingPromises.delete(moduleId);
      throw error;
    }
  }

  private async loadWithPriority<T>(
    loader: () => Promise<T>,
    priority: 'high' | 'medium' | 'low'
  ): Promise<T> {
    // Add delay for low priority loads to not block critical resources
    if (priority === 'low') {
      await new Promise(resolve => setTimeout(resolve, 100));
    } else if (priority === 'medium') {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return loader();
  }

  getLoadedModules(): string[] {
    return Array.from(this.loadedModules);
  }

  clearCache(): void {
    this.loadedModules.clear();
    this.loadingPromises.clear();
  }
}

// Global progressive loader instance
export const progressiveLoader = new ProgressiveAnimationLoader();

// Utility to load animations based on viewport intersection
export const loadAnimationOnIntersection = (
  element: HTMLElement,
  animationLoader: () => Promise<any>,
  options: IntersectionObserverInit = {}
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          observer.disconnect();
          try {
            const animation = await animationLoader();
            resolve(animation);
          } catch (error) {
            reject(error);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);
  });
};

// Memory-efficient animation loader with cleanup
export class MemoryEfficientAnimationLoader {
  private animationCache = new Map<string, any>();
  private cleanupTimers = new Map<string, NodeJS.Timeout>();
  private maxCacheSize = 10;
  private cacheTimeout = 30000; // 30 seconds

  async loadAnimation(
    key: string,
    loader: () => Promise<any>,
    keepAlive: boolean = false
  ): Promise<any> {
    // Return cached animation if available
    if (this.animationCache.has(key)) {
      this.resetCleanupTimer(key, keepAlive);
      return this.animationCache.get(key);
    }

    // Load animation
    try {
      const animation = await loader();
      
      // Manage cache size
      if (this.animationCache.size >= this.maxCacheSize) {
        this.evictOldestEntry();
      }

      // Cache the animation
      this.animationCache.set(key, animation);
      
      // Set cleanup timer if not keeping alive
      if (!keepAlive) {
        this.setCleanupTimer(key);
      }

      return animation;
    } catch (error) {
      console.warn(`Failed to load animation: ${key}`, error);
      throw error;
    }
  }

  private setCleanupTimer(key: string): void {
    const timer = setTimeout(() => {
      this.animationCache.delete(key);
      this.cleanupTimers.delete(key);
    }, this.cacheTimeout);

    this.cleanupTimers.set(key, timer);
  }

  private resetCleanupTimer(key: string, keepAlive: boolean): void {
    const existingTimer = this.cleanupTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.cleanupTimers.delete(key);
    }

    if (!keepAlive) {
      this.setCleanupTimer(key);
    }
  }

  private evictOldestEntry(): void {
    const firstKey = this.animationCache.keys().next().value;
    if (firstKey) {
      const timer = this.cleanupTimers.get(firstKey);
      if (timer) {
        clearTimeout(timer);
        this.cleanupTimers.delete(firstKey);
      }
      this.animationCache.delete(firstKey);
    }
  }

  clearCache(): void {
    // Clear all timers
    this.cleanupTimers.forEach(timer => clearTimeout(timer));
    this.cleanupTimers.clear();
    
    // Clear cache
    this.animationCache.clear();
  }

  getCacheInfo(): {
    size: number;
    maxSize: number;
    keys: string[];
  } {
    return {
      size: this.animationCache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.animationCache.keys())
    };
  }
}

// Global memory-efficient loader instance
export const memoryEfficientLoader = new MemoryEfficientAnimationLoader();

// Development utilities
export const logAnimationLoadingStats = (): void => {
  if (process.env.NODE_ENV === 'development') {
    const bundleInfo = getAnimationBundleInfo();
    const cacheInfo = memoryEfficientLoader.getCacheInfo();
    const loadedModules = progressiveLoader.getLoadedModules();

    console.group('Animation Loading Stats');
    console.log('Bundle Info:', bundleInfo);
    console.log('Cache Info:', cacheInfo);
    console.log('Loaded Modules:', loadedModules);
    console.groupEnd();
  }
};
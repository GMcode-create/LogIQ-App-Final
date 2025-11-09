import { useEffect, useRef, useState, useCallback } from 'react';
import { animationMonitor } from '@/lib/animation-performance-monitor';
import { adaptivePerformanceManager } from '@/lib/performance-monitor';
import { memoryEfficientLoader, progressiveLoader } from '@/lib/lazy-animation-loader';

interface PerformanceOptimizationOptions {
  enableAdaptiveMode?: boolean;
  enableMemoryManagement?: boolean;
  enableProgressiveLoading?: boolean;
  enablePerformanceMonitoring?: boolean;
  performanceThreshold?: {
    frameRate: number;
    droppedFrames: number;
    memoryUsage: number;
  };
}

interface PerformanceMetrics {
  frameRate: number;
  droppedFrames: number;
  memoryUsage?: number;
  animationCount: number;
  performanceMode: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export const usePerformanceOptimization = (
  options: PerformanceOptimizationOptions = {}
) => {
  const {
    enableAdaptiveMode = true,
    enableMemoryManagement = true,
    enableProgressiveLoading = true,
    enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
    performanceThreshold = {
      frameRate: 45,
      droppedFrames: 10,
      memoryUsage: 100, // MB
    }
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    frameRate: 60,
    droppedFrames: 0,
    animationCount: 0,
    performanceMode: 'high',
    recommendations: [],
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);
  const performanceCheckIntervalRef = useRef<NodeJS.Timeout>();

  // Start performance monitoring
  const startMonitoring = useCallback(() => {
    if (!enablePerformanceMonitoring) return;

    animationMonitor.startMonitoring();
    
    if (enableAdaptiveMode) {
      adaptivePerformanceManager.startAdaptiveMode();
    }

    // Set up metrics update listener
    const unsubscribe = animationMonitor.onMetricsUpdate((newMetrics) => {
      const currentMode = adaptivePerformanceManager.getCurrentMode();
      const recommendations = animationMonitor.getOptimizationRecommendations();

      setMetrics({
        frameRate: newMetrics.frameRate,
        droppedFrames: newMetrics.droppedFrames,
        memoryUsage: newMetrics.memoryUsage,
        animationCount: newMetrics.animationCount,
        performanceMode: currentMode,
        recommendations,
      });

      // Auto-optimize if performance is poor
      if (enableAdaptiveMode && shouldOptimize(newMetrics)) {
        optimizePerformance();
      }
    });

    cleanupFunctionsRef.current.push(unsubscribe);
  }, [enablePerformanceMonitoring, enableAdaptiveMode]);

  // Stop performance monitoring
  const stopMonitoring = useCallback(() => {
    animationMonitor.stopMonitoring();
    
    if (enableAdaptiveMode) {
      adaptivePerformanceManager.stopAdaptiveMode();
    }

    // Clean up all subscriptions
    cleanupFunctionsRef.current.forEach(cleanup => cleanup());
    cleanupFunctionsRef.current = [];

    if (performanceCheckIntervalRef.current) {
      clearInterval(performanceCheckIntervalRef.current);
    }
  }, [enableAdaptiveMode]);

  // Check if performance optimization is needed
  const shouldOptimize = useCallback((currentMetrics: any) => {
    return (
      currentMetrics.frameRate < performanceThreshold.frameRate ||
      currentMetrics.droppedFrames > performanceThreshold.droppedFrames ||
      (currentMetrics.memoryUsage && currentMetrics.memoryUsage > performanceThreshold.memoryUsage)
    );
  }, [performanceThreshold]);

  // Optimize performance based on current metrics
  const optimizePerformance = useCallback(async () => {
    if (isOptimizing) return;

    setIsOptimizing(true);

    try {
      // Clear animation caches if memory management is enabled
      if (enableMemoryManagement) {
        memoryEfficientLoader.clearCache();
        progressiveLoader.clearCache();
      }

      // Reduce animation complexity
      const animatedElements = document.querySelectorAll('[data-framer-motion]');
      animatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Apply performance optimizations
        const cleanup = animationMonitor.optimizeElement(htmlElement, {
          enableWillChange: true,
          enableTransform3d: true,
          enableBackfaceVisibility: true,
          enablePerspective: false, // Disable for better performance
          enableContainment: true,
        });

        cleanupFunctionsRef.current.push(cleanup);
      });

      // Add performance mode classes to document
      const currentMode = adaptivePerformanceManager.getCurrentMode();
      document.documentElement.classList.remove(
        'performance-mode-high',
        'performance-mode-medium', 
        'performance-mode-low'
      );
      document.documentElement.classList.add(`performance-mode-${currentMode}`);

      // Notify about optimization
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance optimized to ${currentMode} mode`);
      }

    } catch (error) {
      console.error('Performance optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [isOptimizing, enableMemoryManagement]);

  // Optimize specific element
  const optimizeElement = useCallback((
    element: HTMLElement,
    optimizationOptions?: Parameters<typeof animationMonitor.optimizeElement>[1]
  ) => {
    const cleanup = animationMonitor.optimizeElement(element, optimizationOptions);
    cleanupFunctionsRef.current.push(cleanup);
    return cleanup;
  }, []);

  // Register animation for monitoring
  const registerAnimation = useCallback((
    element: HTMLElement,
    type: string,
    duration?: number
  ) => {
    return animationMonitor.registerAnimation(element, type, duration);
  }, []);

  // Unregister animation
  const unregisterAnimation = useCallback((id: string) => {
    animationMonitor.unregisterAnimation(id);
  }, []);

  // Load animation with performance considerations
  const loadAnimationOptimized = useCallback(async (
    key: string,
    loader: () => Promise<any>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    if (!enableProgressiveLoading) {
      return loader();
    }

    // Check current performance before loading
    const currentMetrics = animationMonitor.getMetrics();
    if (shouldOptimize(currentMetrics) && priority === 'low') {
      // Skip low priority animations if performance is poor
      return null;
    }

    try {
      return await progressiveLoader.loadModule(key, loader, priority);
    } catch (error) {
      console.warn(`Failed to load animation: ${key}`, error);
      return null;
    }
  }, [enableProgressiveLoading, shouldOptimize]);

  // Get performance recommendations
  const getRecommendations = useCallback(() => {
    return animationMonitor.getOptimizationRecommendations();
  }, []);

  // Force cleanup of all optimizations
  const cleanup = useCallback(() => {
    stopMonitoring();
    
    // Run all cleanup functions
    cleanupFunctionsRef.current.forEach(cleanupFn => {
      try {
        cleanupFn();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    cleanupFunctionsRef.current = [];

    // Remove performance mode classes
    document.documentElement.classList.remove(
      'performance-mode-high',
      'performance-mode-medium',
      'performance-mode-low'
    );

    // Clear caches
    if (enableMemoryManagement) {
      memoryEfficientLoader.clearCache();
      progressiveLoader.clearCache();
    }
  }, [stopMonitoring, enableMemoryManagement]);

  // Initialize performance optimization
  useEffect(() => {
    startMonitoring();

    // Set up periodic performance checks
    if (enableAdaptiveMode) {
      performanceCheckIntervalRef.current = setInterval(() => {
        const currentMetrics = animationMonitor.getMetrics();
        if (shouldOptimize(currentMetrics)) {
          optimizePerformance();
        }
      }, 5000); // Check every 5 seconds
    }

    return cleanup;
  }, [startMonitoring, cleanup, enableAdaptiveMode, shouldOptimize, optimizePerformance]);

  return {
    // Metrics and status
    metrics,
    isOptimizing,
    isMonitoring: enablePerformanceMonitoring,
    
    // Control functions
    startMonitoring,
    stopMonitoring,
    optimizePerformance,
    
    // Element optimization
    optimizeElement,
    registerAnimation,
    unregisterAnimation,
    
    // Loading optimization
    loadAnimationOptimized,
    
    // Utilities
    getRecommendations,
    shouldOptimize: () => shouldOptimize(metrics),
    cleanup,
  };
};

// Hook for component-level performance optimization
export const useComponentPerformanceOptimization = (
  componentName: string,
  options: {
    enableOptimization?: boolean;
    animationType?: string;
    priority?: 'high' | 'medium' | 'low';
  } = {}
) => {
  const {
    enableOptimization = true,
    animationType = 'component',
    priority = 'medium'
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const animationIdRef = useRef<string>();
  const cleanupRef = useRef<(() => void) | null>(null);
  
  const {
    optimizeElement,
    registerAnimation,
    unregisterAnimation,
    metrics
  } = usePerformanceOptimization();

  // Optimize the component element
  useEffect(() => {
    if (!enableOptimization || !elementRef.current) return;

    // Register animation for monitoring
    animationIdRef.current = registerAnimation(
      elementRef.current,
      `${componentName}-${animationType}`
    );

    // Apply optimizations
    cleanupRef.current = optimizeElement(elementRef.current, {
      enableWillChange: true,
      enableTransform3d: true,
      enableBackfaceVisibility: true,
      enablePerspective: priority === 'high',
      enableContainment: true,
    });

    return () => {
      if (animationIdRef.current) {
        unregisterAnimation(animationIdRef.current);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [
    enableOptimization,
    componentName,
    animationType,
    priority,
    optimizeElement,
    registerAnimation,
    unregisterAnimation
  ]);

  return {
    elementRef,
    metrics,
    isOptimized: !!cleanupRef.current,
    shouldReduceAnimations: metrics.performanceMode === 'low',
  };
};

// Context for sharing performance optimization across components
import { createContext, useContext, ReactNode } from 'react';

interface PerformanceOptimizationContextValue {
  metrics: PerformanceMetrics;
  optimizeElement: (element: HTMLElement) => () => void;
  loadAnimationOptimized: (key: string, loader: () => Promise<any>) => Promise<any>;
  shouldReduceAnimations: boolean;
}

const PerformanceOptimizationContext = createContext<PerformanceOptimizationContextValue | null>(null);

export const PerformanceOptimizationProvider: React.FC<{
  children: ReactNode;
  options?: PerformanceOptimizationOptions;
}> = ({ children, options }) => {
  const optimization = usePerformanceOptimization(options);

  const contextValue: PerformanceOptimizationContextValue = {
    metrics: optimization.metrics,
    optimizeElement: optimization.optimizeElement,
    loadAnimationOptimized: optimization.loadAnimationOptimized,
    shouldReduceAnimations: optimization.metrics.performanceMode === 'low',
  };

  return (
    <PerformanceOptimizationContext.Provider value={contextValue}>
      {children}
    </PerformanceOptimizationContext.Provider>
  );
};

export const usePerformanceOptimizationContext = () => {
  const context = useContext(PerformanceOptimizationContext);
  if (!context) {
    throw new Error('usePerformanceOptimizationContext must be used within PerformanceOptimizationProvider');
  }
  return context;
};
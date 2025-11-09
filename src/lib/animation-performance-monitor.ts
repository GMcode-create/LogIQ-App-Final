// Animation Performance Monitor
// Comprehensive performance monitoring and optimization for animations

import React from 'react';

interface PerformanceMetrics {
  frameRate: number;
  droppedFrames: number;
  averageFrameTime: number;
  memoryUsage?: number;
  cpuUsage?: number;
  animationCount: number;
  lastMeasurement: number;
}

interface AnimationElement {
  element: HTMLElement;
  type: string;
  startTime: number;
  duration: number;
  isActive: boolean;
}

class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor;
  private frameTimestamps: number[] = [];
  private animationElements: Map<string, AnimationElement> = new Map();
  private performanceObserver?: PerformanceObserver;
  private rafId?: number;
  private isMonitoring = false;
  private metrics: PerformanceMetrics = {
    frameRate: 0,
    droppedFrames: 0,
    averageFrameTime: 0,
    animationCount: 0,
    lastMeasurement: 0
  };
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];

  private constructor() {
    this.setupPerformanceObserver();
  }

  static getInstance(): AnimationPerformanceMonitor {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
    }
    return AnimationPerformanceMonitor.instance;
  }

  private setupPerformanceObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.startsWith('animation-')) {
            this.trackAnimationPerformance(entry);
          }
        });
      });

      this.performanceObserver.observe({ 
        entryTypes: ['measure', 'navigation', 'paint'] 
      });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  private trackAnimationPerformance(entry: PerformanceEntry) {
    // Track animation-specific performance metrics
    const animationId = entry.name.replace('animation-', '');
    const element = this.animationElements.get(animationId);
    
    if (element && entry.duration > 16.67) { // Frame dropped if > 16.67ms (60fps)
      this.metrics.droppedFrames++;
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameTimestamps = [];
    this.metrics.lastMeasurement = performance.now();
    
    const measureFrame = (timestamp: number) => {
      if (!this.isMonitoring) return;

      this.frameTimestamps.push(timestamp);
      
      // Keep only last 60 frames for rolling average
      if (this.frameTimestamps.length > 60) {
        this.frameTimestamps.shift();
      }

      // Calculate metrics every 60 frames or 1 second
      if (this.frameTimestamps.length >= 60 || 
          timestamp - this.metrics.lastMeasurement >= 1000) {
        this.calculateMetrics(timestamp);
        this.notifyCallbacks();
        this.metrics.lastMeasurement = timestamp;
      }

      this.rafId = requestAnimationFrame(measureFrame);
    };

    this.rafId = requestAnimationFrame(measureFrame);
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  private calculateMetrics(currentTime: number): void {
    if (this.frameTimestamps.length < 2) return;

    const frameTimes: number[] = [];
    for (let i = 1; i < this.frameTimestamps.length; i++) {
      frameTimes.push(this.frameTimestamps[i] - this.frameTimestamps[i - 1]);
    }

    const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const frameRate = 1000 / averageFrameTime;
    const droppedFrames = frameTimes.filter(time => time > 16.67).length;

    this.metrics = {
      ...this.metrics,
      frameRate: Math.round(frameRate * 10) / 10,
      averageFrameTime: Math.round(averageFrameTime * 100) / 100,
      droppedFrames: this.metrics.droppedFrames + droppedFrames,
      animationCount: this.animationElements.size,
    };

    // Add memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
    }
  }

  registerAnimation(
    element: HTMLElement, 
    type: string, 
    duration: number = 1000
  ): string {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.animationElements.set(id, {
      element,
      type,
      startTime: performance.now(),
      duration,
      isActive: true
    });

    // Mark performance measurement start
    if ('performance' in window && 'mark' in performance) {
      try {
        performance.mark(`animation-${id}-start`);
      } catch (error) {
        // Ignore marking errors
      }
    }

    // Auto-cleanup after duration + buffer
    setTimeout(() => {
      this.unregisterAnimation(id);
    }, duration + 1000);

    return id;
  }

  unregisterAnimation(id: string): void {
    const animation = this.animationElements.get(id);
    if (!animation) return;

    // Mark performance measurement end
    if ('performance' in window && 'mark' in performance && 'measure' in performance) {
      try {
        performance.mark(`animation-${id}-end`);
        performance.measure(
          `animation-${id}`, 
          `animation-${id}-start`, 
          `animation-${id}-end`
        );
      } catch (error) {
        // Ignore marking errors
      }
    }

    this.animationElements.delete(id);
  }

  optimizeElement(element: HTMLElement, options: {
    enableWillChange?: boolean;
    enableTransform3d?: boolean;
    enableBackfaceVisibility?: boolean;
    enablePerspective?: boolean;
    enableContainment?: boolean;
  } = {}): () => void {
    const {
      enableWillChange = true,
      enableTransform3d = true,
      enableBackfaceVisibility = true,
      enablePerspective = true,
      enableContainment = true
    } = options;

    // Store original styles for cleanup
    const originalStyles = {
      willChange: element.style.willChange,
      transform: element.style.transform,
      backfaceVisibility: element.style.backfaceVisibility,
      perspective: element.style.perspective,
      contain: element.style.contain,
    };

    // Check browser support
    const supportsWillChange = 'willChange' in element.style;
    const supportsTransform3d = this.checkTransform3dSupport();
    const supportsBackfaceVisibility = 'backfaceVisibility' in element.style || 
                                       'webkitBackfaceVisibility' in element.style;
    const supportsPerspective = 'perspective' in element.style || 
                               'webkitPerspective' in element.style;
    const supportsContain = 'contain' in element.style;

    // Apply optimizations based on support
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

    // Return cleanup function
    return () => {
      Object.entries(originalStyles).forEach(([property, value]) => {
        (element.style as any)[property] = value || '';
      });
    };
  }

  private checkTransform3dSupport(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const testElement = document.createElement('div');
      testElement.style.transform = 'translate3d(0, 0, 0)';
      return testElement.style.transform !== '';
    } catch (error) {
      return false;
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('Error in performance metrics callback:', error);
      }
    });
  }

  // Adaptive performance management
  shouldReduceAnimations(): boolean {
    const { frameRate, droppedFrames, animationCount } = this.metrics;
    
    // Reduce animations if:
    // - Frame rate is consistently below 45fps
    // - More than 20% of frames are dropped
    // - Too many concurrent animations
    return frameRate < 45 || 
           (droppedFrames / 60 > 0.2) || 
           animationCount > 10;
  }

  getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const { frameRate, droppedFrames, animationCount, memoryUsage } = this.metrics;

    if (frameRate < 45) {
      recommendations.push('Consider reducing animation complexity or duration');
    }

    if (droppedFrames > 12) { // More than 20% of 60 frames
      recommendations.push('Enable hardware acceleration with transform3d');
      recommendations.push('Use will-change property for animated elements');
    }

    if (animationCount > 8) {
      recommendations.push('Limit concurrent animations to improve performance');
    }

    if (memoryUsage && memoryUsage > 50) {
      recommendations.push('Consider reducing memory usage by cleaning up unused animations');
    }

    if (recommendations.length === 0) {
      recommendations.push('Animation performance is optimal');
    }

    return recommendations;
  }

  // Cleanup method
  destroy(): void {
    this.stopMonitoring();
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    this.animationElements.clear();
    this.callbacks = [];
    this.frameTimestamps = [];
  }
}

// Export singleton instance and utility functions
export const animationMonitor = AnimationPerformanceMonitor.getInstance();

// Utility hook for React components
export const useAnimationPerformance = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(
    animationMonitor.getMetrics()
  );
  const [isMonitoring, setIsMonitoring] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = animationMonitor.onMetricsUpdate(setMetrics);
    return unsubscribe;
  }, []);

  const startMonitoring = React.useCallback(() => {
    animationMonitor.startMonitoring();
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = React.useCallback(() => {
    animationMonitor.stopMonitoring();
    setIsMonitoring(false);
  }, []);

  const registerAnimation = React.useCallback(
    (element: HTMLElement, type: string, duration?: number) => {
      return animationMonitor.registerAnimation(element, type, duration);
    },
    []
  );

  const optimizeElement = React.useCallback(
    (element: HTMLElement, options?: Parameters<typeof animationMonitor.optimizeElement>[1]) => {
      return animationMonitor.optimizeElement(element, options);
    },
    []
  );

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    registerAnimation,
    optimizeElement,
    shouldReduceAnimations: animationMonitor.shouldReduceAnimations(),
    recommendations: animationMonitor.getOptimizationRecommendations(),
  };
};

// Performance-aware animation wrapper (simplified)
export const withPerformanceMonitoring = (Component: React.ComponentType<any>) => {
  const WrappedComponent = React.forwardRef<any, any>((props, ref) => {
    const { monitorPerformance = false, animationType = 'generic', ...componentProps } = props;
    const elementRef = React.useRef<HTMLElement>(null);
    const animationIdRef = React.useRef<string>();

    React.useEffect(() => {
      if (monitorPerformance && elementRef.current) {
        animationIdRef.current = animationMonitor.registerAnimation(
          elementRef.current,
          animationType
        );

        return () => {
          if (animationIdRef.current) {
            animationMonitor.unregisterAnimation(animationIdRef.current);
          }
        };
      }
    }, [monitorPerformance, animationType]);

    return React.createElement(Component, {
      ...componentProps,
      ref: (node: HTMLElement) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }
    });
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default AnimationPerformanceMonitor;
import { useEffect, useState, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  animationCount: number;
  cpuUsage: number;
}

interface PerformanceConfig {
  targetFPS: number;
  maxAnimations: number;
  adaptiveQuality: boolean;
  monitoringInterval: number;
}

interface QualitySettings {
  particleCount: number;
  animationComplexity: 'low' | 'medium' | 'high';
  effectsEnabled: boolean;
  frameRateTarget: number;
}

const defaultConfig: PerformanceConfig = {
  targetFPS: 60,
  maxAnimations: 10,
  adaptiveQuality: true,
  monitoringInterval: 1000, // 1 second
};

const qualityLevels: Record<string, QualitySettings> = {
  high: { particleCount: 100, animationComplexity: 'high', effectsEnabled: true, frameRateTarget: 60 },
  medium: { particleCount: 50, animationComplexity: 'medium', effectsEnabled: true, frameRateTarget: 30 },
  low: { particleCount: 20, animationComplexity: 'low', effectsEnabled: false, frameRateTarget: 24 },
};

export const usePerformanceMonitor = (config: Partial<PerformanceConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    animationCount: 0,
    cpuUsage: 0,
  });

  const [qualityLevel, setQualityLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [isMonitoring, setIsMonitoring] = useState(false);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const measureFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTimeRef.current;
    
    if (delta >= 1000) { // Update every second
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      const frameTime = delta / frameCountRef.current;
      
      setMetrics(prev => ({
        ...prev,
        fps,
        frameTime,
      }));

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    } else {
      frameCountRef.current++;
    }

    if (isMonitoring) {
      animationFrameRef.current = requestAnimationFrame(measureFPS);
    }
  }, [isMonitoring]);

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage,
      }));
    }
  }, []);

  const adjustQuality = useCallback((currentFPS: number) => {
    if (!finalConfig.adaptiveQuality) return;

    const targetFPS = finalConfig.targetFPS;
    const fpsRatio = currentFPS / targetFPS;

    if (fpsRatio < 0.7 && qualityLevel !== 'low') {
      // Performance is poor, reduce quality
      if (qualityLevel === 'high') {
        setQualityLevel('medium');
      } else {
        setQualityLevel('low');
      }
    } else if (fpsRatio > 0.9 && qualityLevel !== 'high') {
      // Performance is good, increase quality
      if (qualityLevel === 'low') {
        setQualityLevel('medium');
      } else {
        setQualityLevel('high');
      }
    }
  }, [finalConfig.adaptiveQuality, finalConfig.targetFPS, qualityLevel]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    measureFPS();
    
    intervalRef.current = setInterval(() => {
      measureMemory();
      adjustQuality(metrics.fps);
    }, finalConfig.monitoringInterval);
  }, [measureFPS, measureMemory, adjustQuality, metrics.fps, finalConfig.monitoringInterval]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const updateAnimationCount = useCallback((count: number) => {
    setMetrics(prev => ({
      ...prev,
      animationCount: count,
    }));
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    metrics,
    qualityLevel,
    qualitySettings: qualityLevels[qualityLevel],
    startMonitoring,
    stopMonitoring,
    updateAnimationCount,
    isMonitoring,
  };
};
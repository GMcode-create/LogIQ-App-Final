import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { 
  GlobalAnimationConfig, 
  createAnimationConfig, 
  deviceConfigs,
  qualityLevels,
  QualitySettings 
} from '@/lib/animationConfig';
import { getDeviceType } from '@/lib/animationUtils';

interface AnimationContextType {
  config: GlobalAnimationConfig;
  qualityLevel: 'low' | 'medium' | 'high';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isReducedMotion: boolean;
  updateQuality: (level: 'low' | 'medium' | 'high') => void;
  shouldAnimate: (animationType?: 'essential' | 'decorative') => boolean;
  getOptimizedDuration: (baseDuration: number) => number;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
  theme?: 'light' | 'dark';
  forceQuality?: 'low' | 'medium' | 'high';
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  theme = 'light',
  forceQuality,
}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(() => getDeviceType());
  const [qualityLevel, setQualityLevel] = useState<'low' | 'medium' | 'high'>(
    forceQuality || deviceConfigs[deviceType].performance.qualityLevel
  );
  
  const isReducedMotion = useReducedMotion();
  const { qualityLevel: performanceQuality, startMonitoring, stopMonitoring } = usePerformanceMonitor({
    adaptiveQuality: !forceQuality, // Only adapt if quality isn't forced
  });

  // Update device type on resize
  useEffect(() => {
    const handleResize = () => {
      const newDeviceType = getDeviceType();
      if (newDeviceType !== deviceType) {
        setDeviceType(newDeviceType);
        if (!forceQuality) {
          setQualityLevel(deviceConfigs[newDeviceType].performance.qualityLevel);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceType, forceQuality]);

  // Update quality based on performance monitoring
  useEffect(() => {
    if (!forceQuality && performanceQuality !== qualityLevel) {
      setQualityLevel(performanceQuality);
    }
  }, [performanceQuality, qualityLevel, forceQuality]);

  // Start performance monitoring on mount
  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  // Create animation configuration
  const config = createAnimationConfig(deviceType, theme, {
    reducedMotion: isReducedMotion,
  });

  // Update config with current quality level
  config.quality = qualityLevels[qualityLevel];
  config.device = deviceConfigs[deviceType];

  const updateQuality = (level: 'low' | 'medium' | 'high') => {
    setQualityLevel(level);
  };

  const shouldAnimate = (animationType: 'essential' | 'decorative' = 'decorative'): boolean => {
    // Always respect reduced motion preference
    if (isReducedMotion) {
      return animationType === 'essential';
    }

    // Check device capabilities
    if (deviceType === 'mobile' && !config.device.effects.particles && animationType === 'decorative') {
      return false;
    }

    // Check quality settings
    if (qualityLevel === 'low' && animationType === 'decorative') {
      return config.quality.effectsEnabled;
    }

    return true;
  };

  const getOptimizedDuration = (baseDuration: number): number => {
    if (isReducedMotion) {
      return Math.min(baseDuration * 0.5, 0.2); // Faster or max 200ms for reduced motion
    }

    // Adjust based on device type
    switch (deviceType) {
      case 'mobile':
        return baseDuration * 0.7;
      case 'tablet':
        return baseDuration * 0.85;
      default:
        return baseDuration;
    }
  };

  const contextValue: AnimationContextType = {
    config,
    qualityLevel,
    deviceType,
    isReducedMotion,
    updateQuality,
    shouldAnimate,
    getOptimizedDuration,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContextType => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

// Convenience hooks for specific animation needs
export const useAnimationConfig = () => {
  const { config } = useAnimation();
  return config;
};

export const useAnimationQuality = () => {
  const { qualityLevel, updateQuality } = useAnimation();
  return { qualityLevel, updateQuality };
};

export const useResponsiveAnimation = () => {
  const { deviceType, getOptimizedDuration, shouldAnimate } = useAnimation();
  return { deviceType, getOptimizedDuration, shouldAnimate };
};
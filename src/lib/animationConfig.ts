import { Variants } from 'framer-motion';
import { easingFunctions, durations } from './animationUtils';

// Performance monitoring configuration
export interface PerformanceConfig {
  targetFPS: number;
  maxAnimations: number;
  adaptiveQuality: boolean;
  monitoringInterval: number;
  memoryThreshold: number; // MB
  cpuThreshold: number; // percentage
}

export const defaultPerformanceConfig: PerformanceConfig = {
  targetFPS: 60,
  maxAnimations: 10,
  adaptiveQuality: true,
  monitoringInterval: 1000,
  memoryThreshold: 50,
  cpuThreshold: 70,
};

// Quality settings for adaptive performance
export interface QualitySettings {
  particleCount: number;
  animationComplexity: 'low' | 'medium' | 'high';
  effectsEnabled: boolean;
  frameRateTarget: number;
  shadowQuality: 'none' | 'low' | 'medium' | 'high';
  blurEffects: boolean;
  parallaxEnabled: boolean;
}

export const qualityLevels: Record<'low' | 'medium' | 'high', QualitySettings> = {
  high: {
    particleCount: 100,
    animationComplexity: 'high',
    effectsEnabled: true,
    frameRateTarget: 60,
    shadowQuality: 'high',
    blurEffects: true,
    parallaxEnabled: true,
  },
  medium: {
    particleCount: 50,
    animationComplexity: 'medium',
    effectsEnabled: true,
    frameRateTarget: 30,
    shadowQuality: 'medium',
    blurEffects: true,
    parallaxEnabled: true,
  },
  low: {
    particleCount: 20,
    animationComplexity: 'low',
    effectsEnabled: false,
    frameRateTarget: 24,
    shadowQuality: 'low',
    blurEffects: false,
    parallaxEnabled: false,
  },
};

// Responsive breakpoints
export const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
} as const;

// Device-specific animation configurations
export interface DeviceAnimationConfig {
  durations: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
    verySlow: number;
  };
  effects: {
    particles: boolean;
    shadows: boolean;
    blur: boolean;
    parallax: boolean;
    glow: boolean;
  };
  performance: {
    maxConcurrentAnimations: number;
    frameRateTarget: number;
    qualityLevel: 'low' | 'medium' | 'high';
  };
}

export const deviceConfigs: Record<'mobile' | 'tablet' | 'desktop', DeviceAnimationConfig> = {
  mobile: {
    durations: {
      instant: 0.1,
      fast: 0.15,
      normal: 0.2,
      slow: 0.3,
      verySlow: 0.4,
    },
    effects: {
      particles: false,
      shadows: true,
      blur: false,
      parallax: false,
      glow: false,
    },
    performance: {
      maxConcurrentAnimations: 3,
      frameRateTarget: 30,
      qualityLevel: 'low',
    },
  },
  tablet: {
    durations: {
      instant: 0.1,
      fast: 0.18,
      normal: 0.25,
      slow: 0.4,
      verySlow: 0.6,
    },
    effects: {
      particles: true,
      shadows: true,
      blur: true,
      parallax: true,
      glow: false,
    },
    performance: {
      maxConcurrentAnimations: 6,
      frameRateTarget: 45,
      qualityLevel: 'medium',
    },
  },
  desktop: {
    durations: {
      instant: 0.1,
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      verySlow: 0.8,
    },
    effects: {
      particles: true,
      shadows: true,
      blur: true,
      parallax: true,
      glow: true,
    },
    performance: {
      maxConcurrentAnimations: 10,
      frameRateTarget: 60,
      qualityLevel: 'high',
    },
  },
};

// Theme-aware animation configurations
export interface AnimationTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    glow: string;
  };
  effects: {
    shadowColor: string;
    glowIntensity: number;
    particleColors: string[];
    gradients: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  timing: {
    fast: number;
    normal: number;
    slow: number;
  };
}

export const lightTheme: AnimationTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937',
    glow: '#3b82f6',
  },
  effects: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    glowIntensity: 0.3,
    particleColors: ['#3b82f6', '#64748b', '#f59e0b'],
    gradients: {
      primary: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      secondary: 'linear-gradient(135deg, #64748b, #475569)',
      accent: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  },
  timing: durations,
};

export const darkTheme: AnimationTheme = {
  colors: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#fbbf24',
    background: '#0f172a',
    text: '#f1f5f9',
    glow: '#60a5fa',
  },
  effects: {
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    glowIntensity: 0.6,
    particleColors: ['#60a5fa', '#94a3b8', '#fbbf24'],
    gradients: {
      primary: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      secondary: 'linear-gradient(135deg, #94a3b8, #64748b)',
      accent: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    },
  },
  timing: durations,
};

// Accessibility configurations
export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  focusVisible: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  respectSystemPreferences: boolean;
}

export const defaultAccessibilityConfig: AccessibilityConfig = {
  reducedMotion: false,
  highContrast: false,
  focusVisible: true,
  screenReader: false,
  keyboardNavigation: true,
  respectSystemPreferences: true,
};

// Motion variants for reduced motion
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.1 }
  },
};

// Animation presets for common use cases
export const animationPresets = {
  // Hero section animations
  heroTitle: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: easingFunctions.smooth,
        delay: 0.2 
      }
    },
  },
  
  // Feature card animations
  featureCard: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: easingFunctions.smooth 
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      transition: { 
        duration: 0.2, 
        ease: easingFunctions.smooth 
      }
    },
  },
  
  // Button animations
  button: {
    hover: {
      scale: 1.05,
      transition: { 
        duration: 0.2, 
        ease: easingFunctions.smooth 
      }
    },
    tap: {
      scale: 0.95,
      transition: { 
        duration: 0.1, 
        ease: easingFunctions.sharp 
      }
    },
  },
  
  // Loading animations
  loading: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  
  // Pulse animation for CTAs
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: easingFunctions.smooth,
      },
    },
  },
} as const;

// Global animation configuration
export interface GlobalAnimationConfig {
  performance: PerformanceConfig;
  accessibility: AccessibilityConfig;
  theme: AnimationTheme;
  device: DeviceAnimationConfig;
  quality: QualitySettings;
}

// Configuration factory
export const createAnimationConfig = (
  deviceType: 'mobile' | 'tablet' | 'desktop',
  theme: 'light' | 'dark' = 'light',
  accessibility: Partial<AccessibilityConfig> = {}
): GlobalAnimationConfig => {
  return {
    performance: defaultPerformanceConfig,
    accessibility: { ...defaultAccessibilityConfig, ...accessibility },
    theme: theme === 'light' ? lightTheme : darkTheme,
    device: deviceConfigs[deviceType],
    quality: qualityLevels[deviceConfigs[deviceType].performance.qualityLevel],
  };
};
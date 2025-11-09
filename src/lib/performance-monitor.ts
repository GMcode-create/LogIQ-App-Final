// Performance monitoring and accessibility testing utilities

interface PerformanceMetrics {
  frameRate: number;
  droppedFrames: number;
  averageFrameTime: number;
  memoryUsage?: number;
  animationCount: number;
  renderTime: number;
}

interface AccessibilityReport {
  reducedMotionRespected: boolean;
  ariaLabelsPresent: boolean;
  focusManagementValid: boolean;
  colorContrastValid: boolean;
  headingHierarchyValid: boolean;
  keyboardNavigable: boolean;
  screenReaderFriendly: boolean;
}

class PerformanceMonitor {
  private frameTimesBuffer: number[] = [];
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;
  private isMonitoring: boolean = false;
  private metrics: PerformanceMetrics = {
    frameRate: 0,
    droppedFrames: 0,
    averageFrameTime: 0,
    animationCount: 0,
    renderTime: 0,
  };

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameTimesBuffer = [];
    this.lastFrameTime = performance.now();
    
    const measureFrame = (currentTime: number) => {
      if (!this.isMonitoring) return;
      
      const frameTime = currentTime - this.lastFrameTime;
      this.frameTimesBuffer.push(frameTime);
      this.lastFrameTime = currentTime;

      // Keep only last 60 frames for rolling average
      if (this.frameTimesBuffer.length > 60) {
        this.frameTimesBuffer.shift();
      }

      // Calculate metrics
      this.updateMetrics();
      
      this.animationFrameId = requestAnimationFrame(measureFrame);
    };

    this.animationFrameId = requestAnimationFrame(measureFrame);
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updateMetrics(): void {
    if (this.frameTimesBuffer.length === 0) return;

    const averageFrameTime = this.frameTimesBuffer.reduce((a, b) => a + b, 0) / this.frameTimesBuffer.length;
    const frameRate = 1000 / averageFrameTime;
    const droppedFrames = this.frameTimesBuffer.filter(time => time > 16.67).length; // 60fps = 16.67ms per frame
    
    this.metrics = {
      ...this.metrics,
      frameRate: Math.round(frameRate),
      droppedFrames,
      averageFrameTime: Math.round(averageFrameTime * 100) / 100,
      animationCount: this.countActiveAnimations(),
      renderTime: this.measureRenderTime(),
    };

    // Add memory usage if available
    if ('memory' in performance) {
      this.metrics.memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
    }
  }

  private countActiveAnimations(): number {
    // Count elements with active animations
    const animatedElements = document.querySelectorAll('[data-framer-motion], .animate-pulse, .animate-spin, .animate-bounce');
    return animatedElements.length;
  }

  private measureRenderTime(): number {
    const startTime = performance.now();
    // Force a reflow to measure render time
    document.body.offsetHeight;
    return performance.now() - startTime;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  isPerformanceGood(): boolean {
    return this.metrics.frameRate >= 55 && this.metrics.droppedFrames < 5;
  }

  getPerformanceReport(): string {
    const metrics = this.getMetrics();
    const isGood = this.isPerformanceGood();
    
    return `
Performance Report:
- Frame Rate: ${metrics.frameRate} fps ${metrics.frameRate >= 55 ? '✅' : '⚠️'}
- Dropped Frames: ${metrics.droppedFrames} ${metrics.droppedFrames < 5 ? '✅' : '⚠️'}
- Average Frame Time: ${metrics.averageFrameTime}ms
- Active Animations: ${metrics.animationCount}
- Render Time: ${metrics.renderTime}ms
${metrics.memoryUsage ? `- Memory Usage: ${metrics.memoryUsage}MB` : ''}
- Overall: ${isGood ? 'Good ✅' : 'Needs Optimization ⚠️'}
    `.trim();
  }
}

class AccessibilityTester {
  testReducedMotionSupport(): boolean {
    // Check if reduced motion preferences are respected
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) return true; // Not applicable
    
    // Check if animations are disabled when reduced motion is preferred
    const animatedElements = document.querySelectorAll('[data-framer-motion]');
    let respectsReducedMotion = true;
    
    animatedElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const animationDuration = computedStyle.animationDuration;
      const transitionDuration = computedStyle.transitionDuration;
      
      // Check if durations are very short (indicating reduced motion)
      if (animationDuration !== 'none' && parseFloat(animationDuration) > 0.1) {
        respectsReducedMotion = false;
      }
      if (transitionDuration !== 'none' && parseFloat(transitionDuration) > 0.1) {
        respectsReducedMotion = false;
      }
    });
    
    return respectsReducedMotion;
  }

  testAriaLabels(): boolean {
    // Check for proper ARIA labels on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], [tabindex]');
    let hasProperLabels = true;
    
    interactiveElements.forEach(element => {
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      const hasTextContent = element.textContent?.trim();
      const hasAltText = element.hasAttribute('alt');
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasTextContent && !hasAltText) {
        hasProperLabels = false;
        console.warn('Element missing accessible label:', element);
      }
    });
    
    return hasProperLabels;
  }

  testFocusManagement(): boolean {
    // Test if focus management is properly implemented
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let focusManagementValid = true;
    
    focusableElements.forEach(element => {
      // Check if element is focusable
      if (element.getAttribute('tabindex') === '-1' && !element.hasAttribute('aria-hidden')) {
        // Element is not focusable but not hidden from screen readers
        console.warn('Element not focusable but visible to screen readers:', element);
        focusManagementValid = false;
      }
    });
    
    return focusManagementValid;
  }

  testColorContrast(): boolean {
    // Basic color contrast testing (simplified)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, a');
    let contrastValid = true;
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      // Skip if no text content
      if (!element.textContent?.trim()) return;
      
      // Basic contrast check (simplified - in production use a proper contrast library)
      if (color === backgroundColor) {
        console.warn('Potential contrast issue:', element);
        contrastValid = false;
      }
    });
    
    return contrastValid;
  }

  testHeadingHierarchy(): boolean {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let hierarchyValid = true;
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && currentLevel !== 1) {
        console.warn('Page should start with h1');
        hierarchyValid = false;
      }
      
      if (currentLevel > previousLevel + 1) {
        console.warn(`Heading level jumps from h${previousLevel} to h${currentLevel}`);
        hierarchyValid = false;
      }
      
      previousLevel = currentLevel;
    });
    
    return hierarchyValid;
  }

  testKeyboardNavigation(): boolean {
    // Test if all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
    let keyboardAccessible = true;
    
    interactiveElements.forEach(element => {
      const tabIndex = element.getAttribute('tabindex');
      const isHidden = element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true';
      
      if (tabIndex === '-1' && !isHidden) {
        console.warn('Interactive element not keyboard accessible:', element);
        keyboardAccessible = false;
      }
    });
    
    return keyboardAccessible;
  }

  testScreenReaderSupport(): boolean {
    // Test for screen reader support features
    let screenReaderFriendly = true;
    
    // Check for skip links
    const skipLinks = document.querySelectorAll('.skip-link, [href^="#"]');
    if (skipLinks.length === 0) {
      console.warn('No skip links found for keyboard navigation');
      screenReaderFriendly = false;
    }
    
    // Check for ARIA live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    const hasLiveRegions = liveRegions.length > 0;
    
    // Check for proper landmark roles
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
    if (landmarks.length === 0) {
      console.warn('No landmark roles found');
      screenReaderFriendly = false;
    }
    
    return screenReaderFriendly;
  }

  runFullAccessibilityTest(): AccessibilityReport {
    return {
      reducedMotionRespected: this.testReducedMotionSupport(),
      ariaLabelsPresent: this.testAriaLabels(),
      focusManagementValid: this.testFocusManagement(),
      colorContrastValid: this.testColorContrast(),
      headingHierarchyValid: this.testHeadingHierarchy(),
      keyboardNavigable: this.testKeyboardNavigation(),
      screenReaderFriendly: this.testScreenReaderSupport(),
    };
  }

  getAccessibilityReport(): string {
    const report = this.runFullAccessibilityTest();
    const passed = Object.values(report).filter(Boolean).length;
    const total = Object.keys(report).length;
    
    return `
Accessibility Report (${passed}/${total} passed):
- Reduced Motion Respected: ${report.reducedMotionRespected ? '✅' : '❌'}
- ARIA Labels Present: ${report.ariaLabelsPresent ? '✅' : '❌'}
- Focus Management Valid: ${report.focusManagementValid ? '✅' : '❌'}
- Color Contrast Valid: ${report.colorContrastValid ? '✅' : '❌'}
- Heading Hierarchy Valid: ${report.headingHierarchyValid ? '✅' : '❌'}
- Keyboard Navigable: ${report.keyboardNavigable ? '✅' : '❌'}
- Screen Reader Friendly: ${report.screenReaderFriendly ? '✅' : '❌'}
- Overall Score: ${Math.round((passed / total) * 100)}%
    `.trim();
  }
}

// Utility functions for development
export const performanceMonitor = new PerformanceMonitor();
export const accessibilityTester = new AccessibilityTester();

// Development helper functions
export const startPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.startMonitoring();
    console.log('Performance monitoring started');
  }
};

export const stopPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    performanceMonitor.stopMonitoring();
    console.log('Performance monitoring stopped');
  }
};

export const logPerformanceReport = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(performanceMonitor.getPerformanceReport());
  }
};

export const logAccessibilityReport = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(accessibilityTester.getAccessibilityReport());
  }
};

export const runFullDiagnostics = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('=== PERFORMANCE & ACCESSIBILITY DIAGNOSTICS ===');
    logPerformanceReport();
    console.log('\n');
    logAccessibilityReport();
    console.log('=== END DIAGNOSTICS ===');
  }
};

// Enhanced performance optimization with automatic adjustments
export const createAdaptivePerformanceManager = () => {
  let performanceMode: 'high' | 'medium' | 'low' = 'high';
  let lastFrameRate = 60;
  let adaptiveCheckInterval: NodeJS.Timeout;

  const adjustPerformanceMode = () => {
    const metrics = performanceMonitor.getMetrics();
    
    if (metrics.frameRate < 30 || metrics.droppedFrames > 20) {
      performanceMode = 'low';
      // Disable heavy animations
      document.documentElement.style.setProperty('--animation-duration-multiplier', '0.5');
      document.documentElement.classList.add('performance-mode-low');
    } else if (metrics.frameRate < 45 || metrics.droppedFrames > 10) {
      performanceMode = 'medium';
      // Reduce animation complexity
      document.documentElement.style.setProperty('--animation-duration-multiplier', '0.75');
      document.documentElement.classList.add('performance-mode-medium');
    } else {
      performanceMode = 'high';
      // Full animations
      document.documentElement.style.setProperty('--animation-duration-multiplier', '1');
      document.documentElement.classList.remove('performance-mode-low', 'performance-mode-medium');
    }

    lastFrameRate = metrics.frameRate;
  };

  const startAdaptiveMode = () => {
    performanceMonitor.startMonitoring();
    adaptiveCheckInterval = setInterval(adjustPerformanceMode, 2000);
  };

  const stopAdaptiveMode = () => {
    performanceMonitor.stopMonitoring();
    if (adaptiveCheckInterval) {
      clearInterval(adaptiveCheckInterval);
    }
  };

  return {
    startAdaptiveMode,
    stopAdaptiveMode,
    getCurrentMode: () => performanceMode,
    getLastFrameRate: () => lastFrameRate,
  };
};

export const adaptivePerformanceManager = createAdaptivePerformanceManager();

// Auto-run diagnostics and adaptive performance in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Run diagnostics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      runFullDiagnostics();
      // Start adaptive performance monitoring
      adaptivePerformanceManager.startAdaptiveMode();
    }, 2000); // Wait 2 seconds for animations to settle
  });

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    adaptivePerformanceManager.stopAdaptiveMode();
  });
}

export default {
  performanceMonitor,
  accessibilityTester,
  startPerformanceMonitoring,
  stopPerformanceMonitoring,
  logPerformanceReport,
  logAccessibilityReport,
  runFullDiagnostics,
};
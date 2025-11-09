/**
 * Cross-Browser Compatibility Testing Utilities
 * Tests various browser features and provides fallbacks
 */

export interface BrowserTestResult {
  feature: string;
  supported: boolean;
  fallback?: string;
  notes?: string;
}

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
}

/**
 * Detect browser information
 */
export const getBrowserInfo = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  let name = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  let mobile = false;

  // Mobile detection
  mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // Browser detection
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'Chrome';
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    engine = 'Blink';
  } else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    engine = 'Gecko';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    engine = 'WebKit';
  } else if (userAgent.includes('Edg')) {
    name = 'Edge';
    version = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    engine = 'Blink';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    name = 'Internet Explorer';
    version = userAgent.match(/(?:MSIE |rv:)(\d+)/)?.[1] || 'Unknown';
    engine = 'Trident';
  }

  return { name, version, engine, platform, mobile };
};

/**
 * Test CSS feature support
 */
export const testCSSFeatures = (): BrowserTestResult[] => {
  const results: BrowserTestResult[] = [];

  // Test CSS Grid
  results.push({
    feature: 'CSS Grid',
    supported: CSS.supports('display', 'grid'),
    fallback: 'Flexbox layout',
    notes: 'Falls back to flexbox for older browsers'
  });

  // Test Flexbox
  results.push({
    feature: 'Flexbox',
    supported: CSS.supports('display', 'flex'),
    fallback: 'Block layout',
    notes: 'Essential for modern layouts'
  });

  // Test CSS Custom Properties
  results.push({
    feature: 'CSS Custom Properties',
    supported: CSS.supports('color', 'var(--test)'),
    fallback: 'Static color values',
    notes: 'Variables for theming'
  });

  // Test CSS Transforms
  results.push({
    feature: 'CSS Transforms',
    supported: CSS.supports('transform', 'translateX(0)'),
    fallback: 'Position-based animations',
    notes: 'Hardware acceleration available'
  });

  // Test CSS Animations
  results.push({
    feature: 'CSS Animations',
    supported: CSS.supports('animation', 'none'),
    fallback: 'JavaScript animations',
    notes: 'Smooth transitions and effects'
  });

  // Test Backdrop Filter
  results.push({
    feature: 'Backdrop Filter',
    supported: CSS.supports('backdrop-filter', 'blur(10px)'),
    fallback: 'Solid background colors',
    notes: 'Blur effects behind elements'
  });

  // Test Will Change
  results.push({
    feature: 'Will Change',
    supported: CSS.supports('will-change', 'transform'),
    fallback: 'Manual optimization',
    notes: 'Performance optimization hint'
  });

  // Test Background Clip Text
  results.push({
    feature: 'Background Clip Text',
    supported: CSS.supports('background-clip', 'text') || CSS.supports('-webkit-background-clip', 'text'),
    fallback: 'Solid text colors',
    notes: 'Gradient text effects'
  });

  return results;
};

/**
 * Test JavaScript API support
 */
export const testJavaScriptAPIs = (): BrowserTestResult[] => {
  const results: BrowserTestResult[] = [];

  // Test Intersection Observer
  results.push({
    feature: 'Intersection Observer',
    supported: 'IntersectionObserver' in window,
    fallback: 'Scroll event listeners',
    notes: 'Efficient scroll-based animations'
  });

  // Test Resize Observer
  results.push({
    feature: 'Resize Observer',
    supported: 'ResizeObserver' in window,
    fallback: 'Window resize events',
    notes: 'Element size change detection'
  });

  // Test Web Animations API
  results.push({
    feature: 'Web Animations API',
    supported: 'animate' in document.createElement('div'),
    fallback: 'CSS animations or libraries',
    notes: 'Programmatic animation control'
  });

  // Test Passive Event Listeners
  let passiveSupported = false;
  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }
    };
    window.addEventListener('test', () => {}, options);
    window.removeEventListener('test', () => {}, options);
  } catch (err) {
    passiveSupported = false;
  }

  results.push({
    feature: 'Passive Event Listeners',
    supported: passiveSupported,
    fallback: 'Regular event listeners',
    notes: 'Better scroll performance'
  });

  // Test Touch Events
  results.push({
    feature: 'Touch Events',
    supported: 'ontouchstart' in window,
    fallback: 'Mouse events',
    notes: 'Mobile touch interaction'
  });

  // Test Pointer Events
  results.push({
    feature: 'Pointer Events',
    supported: 'onpointerdown' in window,
    fallback: 'Mouse and touch events',
    notes: 'Unified input handling'
  });

  // Test Service Workers
  results.push({
    feature: 'Service Workers',
    supported: 'serviceWorker' in navigator,
    fallback: 'Application cache',
    notes: 'Offline functionality'
  });

  return results;
};

/**
 * Test performance features
 */
export const testPerformanceFeatures = (): BrowserTestResult[] => {
  const results: BrowserTestResult[] = [];

  // Test Performance Observer
  results.push({
    feature: 'Performance Observer',
    supported: 'PerformanceObserver' in window,
    fallback: 'Manual performance tracking',
    notes: 'Monitor performance metrics'
  });

  // Test Request Animation Frame
  results.push({
    feature: 'Request Animation Frame',
    supported: 'requestAnimationFrame' in window,
    fallback: 'setTimeout animations',
    notes: 'Smooth 60fps animations'
  });

  // Test Web Workers
  results.push({
    feature: 'Web Workers',
    supported: 'Worker' in window,
    fallback: 'Main thread processing',
    notes: 'Background processing'
  });

  // Test Hardware Acceleration
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  results.push({
    feature: 'WebGL/Hardware Acceleration',
    supported: !!gl,
    fallback: 'Software rendering',
    notes: 'GPU-accelerated graphics'
  });

  return results;
};

/**
 * Test responsive design features
 */
export const testResponsiveFeatures = (): BrowserTestResult[] => {
  const results: BrowserTestResult[] = [];

  // Test Media Queries
  results.push({
    feature: 'Media Queries',
    supported: 'matchMedia' in window,
    fallback: 'Fixed layouts',
    notes: 'Responsive breakpoints'
  });

  // Test Viewport Meta
  const viewport = document.querySelector('meta[name="viewport"]');
  results.push({
    feature: 'Viewport Meta Support',
    supported: !!viewport,
    fallback: 'Desktop-only layout',
    notes: 'Mobile viewport control'
  });

  // Test Container Queries (newer feature)
  results.push({
    feature: 'Container Queries',
    supported: CSS.supports('container-type', 'inline-size'),
    fallback: 'Media queries',
    notes: 'Element-based responsive design'
  });

  // Test Prefers Reduced Motion
  results.push({
    feature: 'Prefers Reduced Motion',
    supported: 'matchMedia' in window && window.matchMedia('(prefers-reduced-motion)').media !== 'not all',
    fallback: 'Always show animations',
    notes: 'Accessibility preference'
  });

  // Test Prefers Color Scheme
  results.push({
    feature: 'Prefers Color Scheme',
    supported: 'matchMedia' in window && window.matchMedia('(prefers-color-scheme)').media !== 'not all',
    fallback: 'Fixed color scheme',
    notes: 'Dark/light mode detection'
  });

  return results;
};

/**
 * Run comprehensive browser compatibility test
 */
export const runCompatibilityTest = () => {
  const browserInfo = getBrowserInfo();
  const cssFeatures = testCSSFeatures();
  const jsAPIs = testJavaScriptAPIs();
  const performanceFeatures = testPerformanceFeatures();
  const responsiveFeatures = testResponsiveFeatures();

  const allTests = [
    ...cssFeatures,
    ...jsAPIs,
    ...performanceFeatures,
    ...responsiveFeatures
  ];

  const supportedCount = allTests.filter(test => test.supported).length;
  const totalCount = allTests.length;
  const compatibilityScore = Math.round((supportedCount / totalCount) * 100);

  return {
    browserInfo,
    compatibilityScore,
    supportedFeatures: supportedCount,
    totalFeatures: totalCount,
    results: {
      css: cssFeatures,
      javascript: jsAPIs,
      performance: performanceFeatures,
      responsive: responsiveFeatures
    }
  };
};

/**
 * Generate compatibility report
 */
export const generateCompatibilityReport = () => {
  const testResults = runCompatibilityTest();
  
  console.group('🔍 Browser Compatibility Report');
  console.log('Browser:', testResults.browserInfo.name, testResults.browserInfo.version);
  console.log('Engine:', testResults.browserInfo.engine);
  console.log('Platform:', testResults.browserInfo.platform);
  console.log('Mobile:', testResults.browserInfo.mobile ? 'Yes' : 'No');
  console.log('Compatibility Score:', `${testResults.compatibilityScore}%`);
  console.log('Supported Features:', `${testResults.supportedFeatures}/${testResults.totalFeatures}`);
  
  // Log unsupported features
  const unsupportedFeatures = Object.values(testResults.results)
    .flat()
    .filter(test => !test.supported);
    
  if (unsupportedFeatures.length > 0) {
    console.group('⚠️ Unsupported Features');
    unsupportedFeatures.forEach(feature => {
      console.log(`${feature.feature}: ${feature.fallback || 'No fallback'}`);
      if (feature.notes) {
        console.log(`  Note: ${feature.notes}`);
      }
    });
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return testResults;
};

/**
 * Apply browser-specific fixes
 */
export const applyBrowserFixes = () => {
  const browserInfo = getBrowserInfo();
  
  // iOS Safari fixes
  if (browserInfo.name === 'Safari' && browserInfo.mobile) {
    // Fix viewport height issue
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        const currentFontSize = window.getComputedStyle(input).fontSize;
        if (parseFloat(currentFontSize) < 16) {
          input.style.fontSize = '16px';
        }
      }
    });
  }
  
  // Chrome Android fixes
  if (browserInfo.name === 'Chrome' && browserInfo.mobile) {
    // Improve touch scrolling
    document.body.style.webkitOverflowScrolling = 'touch';
  }
  
  // Firefox fixes
  if (browserInfo.name === 'Firefox') {
    // Fix backdrop-filter fallback
    const elements = document.querySelectorAll('.backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-lg');
    elements.forEach(element => {
      if (element instanceof HTMLElement && !CSS.supports('backdrop-filter', 'blur(10px)')) {
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      }
    });
  }
  
  // Edge fixes
  if (browserInfo.name === 'Edge') {
    // Fix CSS Grid issues in older Edge
    if (parseInt(browserInfo.version) < 16) {
      const gridElements = document.querySelectorAll('.grid');
      gridElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.display = 'flex';
          element.style.flexWrap = 'wrap';
        }
      });
    }
  }
};

/**
 * Initialize browser compatibility
 */
export const initializeBrowserCompatibility = () => {
  // Run compatibility test
  const results = generateCompatibilityReport();
  
  // Apply browser-specific fixes
  applyBrowserFixes();
  
  // Add compatibility class to body
  const browserInfo = getBrowserInfo();
  document.body.classList.add(
    `browser-${browserInfo.name.toLowerCase()}`,
    `engine-${browserInfo.engine.toLowerCase()}`,
    browserInfo.mobile ? 'mobile' : 'desktop'
  );
  
  return results;
};
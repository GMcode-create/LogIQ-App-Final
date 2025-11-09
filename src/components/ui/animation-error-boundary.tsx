import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface AnimationErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  enableRetry?: boolean;
  enableFallbackToggle?: boolean;
  className?: string;
}

interface AnimationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  showFallback: boolean;
  showErrorDetails: boolean;
}

export class AnimationErrorBoundary extends Component<
  AnimationErrorBoundaryProps,
  AnimationErrorBoundaryState
> {
  private maxRetries = 3;
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: AnimationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      showFallback: false,
      showErrorDetails: props.showErrorDetails || false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AnimationErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error for debugging
    console.group('Animation Error Boundary');
    console.error('Animation error:', error);
    console.error('Error info:', errorInfo);
    console.groupEnd();

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service in production
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to your error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'animation-error',
      };

      // Send to error tracking service
      // errorTrackingService.captureException(errorReport);
      
      console.log('Error report prepared:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
    }));

    // Add a small delay before retry to prevent immediate re-error
    this.retryTimeout = setTimeout(() => {
      // Force re-render by updating state
      this.forceUpdate();
    }, 500);
  };

  private toggleFallback = () => {
    this.setState(prevState => ({
      showFallback: !prevState.showFallback,
    }));
  };

  private toggleErrorDetails = () => {
    this.setState(prevState => ({
      showErrorDetails: !prevState.showErrorDetails,
    }));
  };

  private renderErrorUI = () => {
    const { error, errorInfo, retryCount, showErrorDetails } = this.state;
    const { enableRetry = true, enableFallbackToggle = true } = this.props;
    const canRetry = enableRetry && retryCount < this.maxRetries;

    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Animation Error</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            An error occurred while loading animations. The content is displayed 
            without animations to ensure accessibility.
          </p>
          
          {showErrorDetails && error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">
                Error Details
              </summary>
              <div className="mt-2 p-2 bg-destructive/10 rounded text-xs font-mono">
                <p><strong>Error:</strong> {error.message}</p>
                {error.stack && (
                  <pre className="mt-1 whitespace-pre-wrap overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                )}
                {errorInfo?.componentStack && (
                  <div className="mt-2">
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap overflow-auto max-h-32">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {canRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Retry ({this.maxRetries - retryCount} left)
              </Button>
            )}
            
            {enableFallbackToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={this.toggleFallback}
                className="flex items-center gap-2"
              >
                {this.state.showFallback ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    Hide Content
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    Show Content
                  </>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={this.toggleErrorDetails}
              className="flex items-center gap-2"
            >
              {showErrorDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  private renderFallbackContent = () => {
    const { fallback, children } = this.props;
    
    if (fallback) {
      return fallback;
    }

    // Default fallback: render children without animations
    return (
      <div className="animate-none">
        {children}
      </div>
    );
  };

  render() {
    const { hasError, showFallback } = this.state;
    const { className } = this.props;

    if (hasError) {
      return (
        <div className={className}>
          {this.renderErrorUI()}
          {showFallback && this.renderFallbackContent()}
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withAnimationErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<AnimationErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <AnimationErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </AnimationErrorBoundary>
  ));

  WrappedComponent.displayName = `withAnimationErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
};

// Hook for handling animation errors in functional components
export const useAnimationErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);
  const [hasError, setHasError] = React.useState(false);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    setHasError(true);
    console.error('Animation error:', error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
    setHasError(false);
  }, []);

  const wrapAsyncAnimation = React.useCallback(
    async <T,>(animationPromise: Promise<T>): Promise<T | null> => {
      try {
        return await animationPromise;
      } catch (error) {
        handleError(error as Error);
        return null;
      }
    },
    [handleError]
  );

  return {
    error,
    hasError,
    handleError,
    clearError,
    wrapAsyncAnimation,
  };
};

// Context for sharing error boundary state
export const AnimationErrorContext = React.createContext<{
  hasGlobalError: boolean;
  reportError: (error: Error) => void;
  clearGlobalError: () => void;
}>({
  hasGlobalError: false,
  reportError: () => {},
  clearGlobalError: () => {},
});

// Provider for global animation error handling
export const AnimationErrorProvider: React.FC<{
  children: ReactNode;
  onGlobalError?: (error: Error) => void;
}> = ({ children, onGlobalError }) => {
  const [hasGlobalError, setHasGlobalError] = React.useState(false);
  const [globalErrors, setGlobalErrors] = React.useState<Error[]>([]);

  const reportError = React.useCallback((error: Error) => {
    setGlobalErrors(prev => [...prev, error]);
    setHasGlobalError(true);
    onGlobalError?.(error);
  }, [onGlobalError]);

  const clearGlobalError = React.useCallback(() => {
    setHasGlobalError(false);
    setGlobalErrors([]);
  }, []);

  const contextValue = React.useMemo(() => ({
    hasGlobalError,
    reportError,
    clearGlobalError,
  }), [hasGlobalError, reportError, clearGlobalError]);

  return (
    <AnimationErrorContext.Provider value={contextValue}>
      {children}
    </AnimationErrorContext.Provider>
  );
};

// Hook to use animation error context
export const useAnimationErrorContext = () => {
  const context = React.useContext(AnimationErrorContext);
  if (!context) {
    throw new Error('useAnimationErrorContext must be used within AnimationErrorProvider');
  }
  return context;
};

// Utility component for graceful animation degradation
export const GracefulAnimationWrapper: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  enableAnimations?: boolean;
  className?: string;
}> = ({ 
  children, 
  fallback, 
  enableAnimations = true,
  className 
}) => {
  const [animationSupported, setAnimationSupported] = React.useState(true);
  const { handleError } = useAnimationErrorHandler();

  React.useEffect(() => {
    // Check if animations are supported
    const checkAnimationSupport = () => {
      try {
        const testElement = document.createElement('div');
        testElement.style.animation = 'test 1s';
        const supported = testElement.style.animation !== '';
        setAnimationSupported(supported);
      } catch (error) {
        setAnimationSupported(false);
        handleError(error as Error);
      }
    };

    checkAnimationSupport();
  }, [handleError]);

  if (!enableAnimations || !animationSupported) {
    return (
      <div className={className}>
        {fallback || children}
      </div>
    );
  }

  return (
    <AnimationErrorBoundary
      fallback={fallback}
      className={className}
      onError={handleError}
    >
      {children}
    </AnimationErrorBoundary>
  );
};
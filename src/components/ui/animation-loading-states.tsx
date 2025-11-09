import React, { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Loading skeleton for animated containers
export const AnimatedContainerSkeleton: React.FC<{
  className?: string;
  itemCount?: number;
  variant?: 'card' | 'list' | 'grid';
}> = ({ className, itemCount = 3, variant = 'card' }) => {
  const skeletonItems = Array.from({ length: itemCount }, (_, i) => i);

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {skeletonItems.map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {skeletonItems.map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className={cn('space-y-6', className)}>
      {skeletonItems.map((_, index) => (
        <div key={index} className="p-6 border rounded-lg space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Loading skeleton for scroll reveal components
export const ScrollRevealSkeleton: React.FC<{
  className?: string;
  height?: string;
  variant?: 'text' | 'card' | 'image';
}> = ({ className, height = 'h-32', variant = 'card' }) => {
  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton className={cn('w-full rounded-lg', height)} />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  // Default card variant
  return (
    <div className={cn('p-4 border rounded-lg space-y-3', className)}>
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className={cn('w-full', height)} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

// Loading skeleton for animated buttons
export const AnimatedButtonSkeleton: React.FC<{
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}> = ({ className, variant = 'default' }) => {
  const baseClasses = 'h-10 rounded-md';
  const variantClasses = {
    default: 'w-24',
    outline: 'w-28',
    ghost: 'w-20'
  };

  return (
    <Skeleton 
      className={cn(
        baseClasses, 
        variantClasses[variant], 
        className
      )} 
    />
  );
};

// Progressive loading wrapper for heavy animation components
export const ProgressiveAnimationLoader: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ComponentType;
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  fallback, 
  loadingComponent: LoadingComponent,
  delay = 0,
  className 
}) => {
  const [shouldRender, setShouldRender] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) {
    return (
      <div className={className}>
        {LoadingComponent ? <LoadingComponent /> : fallback}
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className={className}>
          {LoadingComponent ? <LoadingComponent /> : fallback}
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

// Intersection-based lazy loader for animations
export const IntersectionAnimationLoader: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}> = ({ 
  children, 
  fallback = <ScrollRevealSkeleton />, 
  threshold = 0.1,
  rootMargin = '50px',
  className 
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsIntersecting(true);
          setHasIntersected(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

// Smart loading state that adapts to connection speed
export const AdaptiveAnimationLoader: React.FC<{
  children: React.ReactNode;
  lightFallback?: React.ReactNode;
  heavyFallback?: React.ReactNode;
  className?: string;
}> = ({ 
  children, 
  lightFallback = <Skeleton className="h-32 w-full" />,
  heavyFallback = <ScrollRevealSkeleton />,
  className 
}) => {
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow'>('fast');

  useEffect(() => {
    // Check connection speed
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      setConnectionSpeed(
        effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'fast'
      );

      const handleConnectionChange = () => {
        const newEffectiveType = connection.effectiveType;
        setConnectionSpeed(
          newEffectiveType === 'slow-2g' || newEffectiveType === '2g' ? 'slow' : 'fast'
        );
      };

      connection.addEventListener('change', handleConnectionChange);
      return () => {
        connection.removeEventListener('change', handleConnectionChange);
      };
    }
  }, []);

  const fallback = connectionSpeed === 'slow' ? lightFallback : heavyFallback;

  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
};

// Loading state with progress indicator
export const ProgressiveLoadingState: React.FC<{
  isLoading: boolean;
  progress?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ isLoading, progress = 0, children, className }) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Loading animations...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <ScrollRevealSkeleton />
      </div>
    );
  }

  return <>{children}</>;
};

// Batch loading for multiple animation components
export const BatchAnimationLoader: React.FC<{
  children: React.ReactNode[];
  batchSize?: number;
  delay?: number;
  className?: string;
}> = ({ children, batchSize = 3, delay = 100, className }) => {
  const [loadedBatches, setLoadedBatches] = useState(1);
  const totalBatches = Math.ceil(children.length / batchSize);

  useEffect(() => {
    if (loadedBatches < totalBatches) {
      const timer = setTimeout(() => {
        setLoadedBatches(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [loadedBatches, totalBatches, delay]);

  const visibleChildren = children.slice(0, loadedBatches * batchSize);
  const remainingCount = children.length - visibleChildren.length;

  return (
    <div className={className}>
      {visibleChildren}
      {remainingCount > 0 && (
        <div className="space-y-4 mt-6">
          {Array.from({ length: Math.min(batchSize, remainingCount) }).map((_, index) => (
            <ScrollRevealSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

// Error boundary for animation loading failures
export class AnimationErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
    onError?: (error: Error) => void;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Animation loading error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <p className="text-sm text-destructive">
            Animation failed to load. Content is displayed without animations.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for managing loading states
export const useAnimationLoadingState = (initialLoading = true) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setError(null);
  };

  const updateProgress = (newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 200); // Small delay for smooth transition
  };

  const setLoadingError = (err: Error) => {
    setError(err);
    setIsLoading(false);
  };

  return {
    isLoading,
    progress,
    error,
    startLoading,
    updateProgress,
    finishLoading,
    setLoadingError
  };
};
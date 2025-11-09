import React, { Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import { useScrollAnimation, useReducedMotion } from '@/hooks/use-scroll-animation';
import { AnimationErrorBoundary } from './animation-error-boundary';
import { AnimatedContainerSkeleton } from './animation-loading-states';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInFromTop' | 'slideInFromBottom';
  delay?: number;
  duration?: number;
  stagger?: boolean;
  staggerDelay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

const animationVariants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInFromTop: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  slideInFromBottom: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  stagger = false,
  staggerDelay = 0.1,
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const { ref, isInView } = useScrollAnimation({ threshold, triggerOnce });
  const prefersReducedMotion = useReducedMotion();

  const variants = animationVariants[animation];

  const containerVariants: Variants = stagger
    ? {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    : variants;

  const itemVariants: Variants = stagger
    ? {
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }
    : {
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimationErrorBoundary
      fallback={<AnimatedContainerSkeleton className={className} />}
      onError={(error) => console.warn('AnimatedContainer error:', error)}
    >
      <Suspense fallback={<AnimatedContainerSkeleton className={className} />}>
        <motion.div
          ref={ref}
          className={cn(className)}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {stagger
            ? React.Children.map(children, (child, index) => (
                <motion.div key={index} variants={itemVariants}>
                  {child}
                </motion.div>
              ))
            : children}
        </motion.div>
      </Suspense>
    </AnimationErrorBoundary>
  );
};
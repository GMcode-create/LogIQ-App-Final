import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/use-scroll-animation';
import { AnimationErrorBoundary } from './animation-error-boundary';
import { AnimatedButtonSkeleton } from './animation-loading-states';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  glowEffect?: boolean;
  scaleOnHover?: boolean;
  pulseOnHover?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  glowEffect = false,
  scaleOnHover = true,
  pulseOnHover = false,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  const buttonVariants = {
    rest: {
      scale: 1,
      boxShadow: glowEffect
        ? '0 4px 15px rgba(0, 188, 212, 0.3)'
        : '0 1px 3px rgba(0, 0, 0, 0.12)',
    },
    hover: {
      scale: scaleOnHover && !prefersReducedMotion ? 1.05 : 1,
      boxShadow: glowEffect
        ? '0 6px 20px rgba(0, 188, 212, 0.4)'
        : '0 4px 6px rgba(0, 0, 0, 0.16)',
    },
    tap: {
      scale: !prefersReducedMotion ? 0.98 : 1,
    },
  };

  const pulseVariants = {
    animate: {
      boxShadow: [
        '0 4px 15px rgba(0, 188, 212, 0.3)',
        '0 6px 20px rgba(0, 188, 212, 0.6)',
        '0 4px 15px rgba(0, 188, 212, 0.3)',
      ],
    },
  };

  if (prefersReducedMotion) {
    return (
      <Button className={className} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <AnimationErrorBoundary
      fallback={
        <Button className={className} {...props}>
          {children}
        </Button>
      }
      onError={(error) => console.warn('AnimatedButton error:', error)}
    >
      <Suspense fallback={<AnimatedButtonSkeleton className={className} />}>
        <motion.div
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          animate={pulseOnHover ? pulseVariants.animate : undefined}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            repeat: pulseOnHover ? Infinity : 0,
            repeatType: 'loop',
            repeatDelay: 1,
          }}
        >
          <Button
            className={cn(
              glowEffect && 'shadow-logiq-button hover:shadow-logiq-button-hover',
              className
            )}
            {...props}
          >
            {children}
          </Button>
        </motion.div>
      </Suspense>
    </AnimationErrorBoundary>
  );
};
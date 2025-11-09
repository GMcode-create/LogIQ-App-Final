import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
  duration?: number;
  delay?: number;
  direction?: 'vertical' | 'horizontal' | 'both';
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  intensity = 'normal',
  duration = 6,
  delay = 0,
  direction = 'vertical',
}) => {
  const prefersReducedMotion = useReducedMotion();

  const intensityMap = {
    subtle: { y: 5, x: 3, rotate: 0.5 },
    normal: { y: 10, x: 6, rotate: 1 },
    strong: { y: 15, x: 10, rotate: 2 },
  };

  const movement = intensityMap[intensity];

  const getAnimationProps = () => {
    switch (direction) {
      case 'vertical':
        return {
          y: [-movement.y, movement.y, -movement.y],
          rotate: [-movement.rotate, movement.rotate, -movement.rotate],
        };
      case 'horizontal':
        return {
          x: [-movement.x, movement.x, -movement.x],
          rotate: [-movement.rotate, movement.rotate, -movement.rotate],
        };
      case 'both':
        return {
          y: [-movement.y, movement.y, -movement.y],
          x: [-movement.x, movement.x, -movement.x],
          rotate: [-movement.rotate, movement.rotate, -movement.rotate],
        };
      default:
        return {};
    }
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      animate={getAnimationProps()}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SlideInProps extends Omit<MotionProps, 'initial' | 'animate' | 'exit'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
  triggerOnce?: boolean;
  easing?: 'smooth' | 'bounce' | 'elastic' | 'sharp';
}

const easingFunctions = {
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  sharp: [0.4, 0, 0.6, 1],
};

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  direction,
  distance = 50,
  className,
  triggerOnce = true,
  easing = 'smooth',
  ...motionProps
}) => {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, use simpler animation
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay }}
        className={className}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  // Calculate initial position based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getInitialTransform(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: easingFunctions[easing],
      },
    },
    exit: {
      opacity: 0,
      ...getInitialTransform(),
      transition: {
        duration: duration * 0.5,
        ease: easingFunctions.sharp,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
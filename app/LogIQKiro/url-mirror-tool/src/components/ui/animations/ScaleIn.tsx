import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScaleInProps extends Omit<MotionProps, 'initial' | 'animate' | 'exit'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  finalScale?: number;
  className?: string;
  triggerOnce?: boolean;
  easing?: 'smooth' | 'bounce' | 'elastic' | 'sharp';
  transformOrigin?: string;
}

const easingFunctions = {
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  sharp: [0.4, 0, 0.6, 1],
};

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  initialScale = 0.8,
  finalScale = 1,
  className,
  triggerOnce = true,
  easing = 'smooth',
  transformOrigin = 'center',
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
        style={{ transformOrigin }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  const variants = {
    hidden: {
      opacity: 0,
      scale: initialScale,
    },
    visible: {
      opacity: 1,
      scale: finalScale,
      transition: {
        duration,
        delay,
        ease: easingFunctions[easing],
      },
    },
    exit: {
      opacity: 0,
      scale: initialScale,
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
      style={{ transformOrigin }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
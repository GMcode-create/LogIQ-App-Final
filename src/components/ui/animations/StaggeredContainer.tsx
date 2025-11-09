import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StaggeredContainerProps extends Omit<MotionProps, 'initial' | 'animate' | 'exit'> {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
  direction?: 'normal' | 'reverse';
  triggerOnce?: boolean;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
  children,
  staggerDelay = 0.1,
  initialDelay = 0,
  className,
  direction = 'normal',
  triggerOnce = true,
  ...motionProps
}) => {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, show all children immediately
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: initialDelay }}
        className={className}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay,
        staggerDirection: direction === 'reverse' ? -1 : 1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerDelay * 0.5,
        staggerDirection: direction === 'reverse' ? 1 : -1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  };

  // Clone children and wrap them with motion.div if they aren't already motion components
  const wrappedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      // If child is already a motion component, just add variants
      if (child.type && typeof child.type === 'object' && 'render' in child.type) {
        return React.cloneElement(child, {
          variants: itemVariants,
          key: index,
        });
      }
      
      // Otherwise, wrap in motion.div
      return (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      );
    }
    return child;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className={className}
      {...motionProps}
    >
      {wrappedChildren}
    </motion.div>
  );
};
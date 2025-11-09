import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useReducedMotion } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  label?: string;
  showValue?: boolean;
  gradient?: boolean;
  glowEffect?: boolean;
  duration?: number;
  delay?: number;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className,
  barClassName,
  label,
  showValue = false,
  gradient = true,
  glowEffect = false,
  duration = 1.5,
  delay = 0.5,
}) => {
  const { ref, isInView } = useScrollAnimation();
  const prefersReducedMotion = useReducedMotion();
  
  const percentage = Math.min((value / max) * 100, 100);

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${percentage}%`,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        '0 0 10px rgba(0, 188, 212, 0.5)',
        '0 0 20px rgba(0, 188, 212, 0.8)',
        '0 0 10px rgba(0, 188, 212, 0.5)',
      ],
    },
  };

  return (
    <div ref={ref} className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-logiq-text-secondary">
            {label}
          </span>
          {showValue && (
            <span className="text-sm font-medium text-logiq-text-primary">
              {value}{max === 100 ? '%' : `/${max}`}
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-logiq-navy-light rounded-full h-2 overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            gradient
              ? 'bg-gradient-logiq-cta'
              : 'bg-logiq-cyan',
            glowEffect && 'shadow-logiq-glow',
            barClassName
          )}
          variants={progressVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          {...(glowEffect && !prefersReducedMotion && {
            animate: glowVariants.animate,
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          })}
        />
      </div>
    </div>
  );
};
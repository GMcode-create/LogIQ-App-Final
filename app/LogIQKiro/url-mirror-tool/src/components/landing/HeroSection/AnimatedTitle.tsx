import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TypewriterEffect, TypewriterConfig } from './TypewriterEffect';

export interface AnimatedTitleProps {
  text: string | string[];
  subtitle?: string;
  gradient?: boolean;
  typewriterEffect?: boolean;
  typewriterConfig?: Partial<TypewriterConfig>;
  delay?: number;
  className?: string;
  subtitleClassName?: string;
  onComplete?: () => void;
  responsive?: boolean;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  text,
  subtitle,
  gradient = true,
  typewriterEffect = true,
  typewriterConfig,
  delay = 0,
  className = '',
  subtitleClassName = '',
  onComplete,
  responsive = true,
}) => {
  const [titleComplete, setTitleComplete] = useState(false);

  const handleTitleComplete = () => {
    setTitleComplete(true);
    onComplete?.();
  };

  const baseClasses = responsive
    ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold'
    : 'text-5xl font-bold';

  const gradientClasses = gradient && !typewriterEffect
    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-[length:200%_200%] animate-gradient'
    : '';

  const titleClasses = `${baseClasses} ${gradientClasses} ${className}`;

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  };

  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  };

  return (
    <div className="text-center space-y-4">
      <motion.h1
        className={titleClasses}
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        {typewriterEffect ? (
          <TypewriterEffect
            text={text}
            config={typewriterConfig}
            gradient={gradient}
            onComplete={handleTitleComplete}
          />
        ) : (
          text
        )}
      </motion.h1>

      {subtitle && (
        <motion.p
          className={`text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto ${subtitleClassName}`}
          variants={subtitleVariants}
          initial="hidden"
          animate={titleComplete || !typewriterEffect ? "visible" : "hidden"}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
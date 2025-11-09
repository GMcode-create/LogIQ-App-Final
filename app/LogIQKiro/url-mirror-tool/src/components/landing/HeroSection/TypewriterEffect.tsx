import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface TypewriterConfig {
  speed: number;
  deleteSpeed: number;
  pauseDuration: number;
  loop: boolean;
}

export interface TypewriterEffectProps {
  text: string | string[];
  config?: Partial<TypewriterConfig>;
  gradient?: boolean;
  className?: string;
  onComplete?: () => void;
  onTypeComplete?: (text: string) => void;
  onDeleteComplete?: () => void;
}

const defaultConfig: TypewriterConfig = {
  speed: 100,
  deleteSpeed: 50,
  pauseDuration: 2000,
  loop: true,
};

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  config = {},
  gradient = false,
  className = '',
  onComplete,
  onTypeComplete,
  onDeleteComplete,
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const textArray = Array.isArray(text) ? text : [text];
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const typeText = useCallback(() => {
    const fullText = textArray[currentTextIndex];
    
    if (!isDeleting) {
      // Typing
      if (currentText.length < fullText.length) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      } else {
        // Finished typing current text
        onTypeComplete?.(fullText);
        
        if (textArray.length === 1 && !finalConfig.loop) {
          // Single text, no loop - we're done
          setIsComplete(true);
          onComplete?.();
          return;
        }
        
        // Start deleting after pause
        setTimeout(() => {
          setIsDeleting(true);
        }, finalConfig.pauseDuration);
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        // Finished deleting
        onDeleteComplete?.();
        setIsDeleting(false);
        
        // Move to next text
        const nextIndex = (currentTextIndex + 1) % textArray.length;
        setCurrentTextIndex(nextIndex);
        
        // If we've completed all texts and not looping, we're done
        if (nextIndex === 0 && !finalConfig.loop) {
          setIsComplete(true);
          onComplete?.();
        }
      }
    }
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    textArray,
    finalConfig,
    onComplete,
    onTypeComplete,
    onDeleteComplete,
  ]);

  useEffect(() => {
    if (isComplete) return;

    const speed = isDeleting ? finalConfig.deleteSpeed : finalConfig.speed;
    const timer = setTimeout(typeText, speed);

    return () => clearTimeout(timer);
  }, [typeText, isDeleting, finalConfig.deleteSpeed, finalConfig.speed, isComplete]);

  const gradientClasses = gradient
    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-[length:200%_200%] animate-gradient'
    : '';

  return (
    <motion.span
      className={`${gradientClasses} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {currentText}
      <motion.span
        className="inline-block w-0.5 h-[1em] bg-current ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </motion.span>
  );
};
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface VisualizationStep {
  array: number[];
  activeIndices: number[];
  comparedIndices: number[];
  swappedIndices?: number[];
  description: string;
}

interface AnimatedVisualizationProps {
  data: number[];
  activeIndices: number[];
  comparedIndices: number[];
  swappedIndices?: number[];
  visualizationType?: 'bars' | 'dots' | 'lines';
  animationSpeed?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  className?: string;
}

export const AnimatedVisualization: React.FC<AnimatedVisualizationProps> = ({
  data,
  activeIndices = [],
  comparedIndices = [],
  swappedIndices = [],
  visualizationType = 'bars',
  animationSpeed = 300,
  showGrid = true,
  showLabels = true,
  className = '',
}) => {
  const maxValue = Math.max(...data);
  const arrayLength = data.length;

  // Adaptive sizing based on array length - increased bar widths
  const getBarWidth = () => {
    if (arrayLength <= 10) return 40;
    if (arrayLength <= 20) return 28;
    if (arrayLength <= 30) return 20;
    return 12;
  };

  const getBarColor = (index: number) => {
    if (swappedIndices.includes(index)) {
      return 'hsl(var(--success))'; // Green for swapped
    }
    if (activeIndices.includes(index)) {
      return 'hsl(var(--warning))'; // Yellow for active
    }
    if (comparedIndices.includes(index)) {
      return 'hsl(var(--info))'; // Blue for compared
    }
    return 'hsl(var(--primary))'; // Default primary color
  };

  const barWidth = getBarWidth();
  // Make container height responsive - increased height for better visibility
  const containerHeight = showLabels ? 280 : 320;

  // Animation variants
  const barVariants = {
    initial: { 
      scaleY: 0, 
      opacity: 0,
      originY: 1 
    },
    animate: (height: number) => ({
      scaleY: 1,
      opacity: 1,
      height: height,
      transition: {
        duration: animationSpeed / 1000,
        ease: [0.4, 0, 0.2, 1], // Custom easing
      }
    }),
    exit: { 
      scaleY: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const labelVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.1, duration: 0.2 }
    }
  };

  const renderBars = () => (
    <div className="flex items-end justify-center gap-1 h-full pt-4">
      <AnimatePresence>
        {data.map((value, index) => {
          const height = (value / maxValue) * containerHeight;
          const color = getBarColor(index);
          
          return (
            <div key={`bar-${index}`} className="flex flex-col items-center">
              <motion.div
                initial={{ height: height }}
                animate={{
                  height: height,
                  backgroundColor: color,
                }}
                transition={{
                  duration: animationSpeed / 1000,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="rounded-t relative group cursor-pointer"
                style={{
                  width: `${barWidth}px`,
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {value}
                </div>
              </motion.div>
              
              {showLabels && (
                <motion.div
                  variants={labelVariants}
                  initial="initial"
                  animate="animate"
                  className="text-xs text-gray-400 mt-1"
                  style={{ fontSize: arrayLength > 20 ? '10px' : '12px' }}
                >
                  {value}
                </motion.div>
              )}
              
              <motion.div
                variants={labelVariants}
                initial="initial"
                animate="animate"
                className="text-xs text-blue-400 mt-1"
                style={{ fontSize: arrayLength > 20 ? '8px' : '10px' }}
              >
                {index}
              </motion.div>
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const renderDots = () => (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {data.map((value, index) => {
          const xPosition = (index / (data.length - 1)) * 100;
          const yPosition = 100 - (value / maxValue) * 100;
          const color = getBarColor(index);
          
          return (
            <motion.div
              key={`dot-${index}-${value}`}
              className="absolute group cursor-pointer"
              style={{
                left: `${xPosition}%`,
                top: `${yPosition}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: animationSpeed / 1000,
                  ease: [0.4, 0, 0.2, 1],
                  delay: index * 0.05,
                }
              }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.8 }}
            >
              <div
                className="w-5 h-5 rounded-full transition-colors duration-300 border-2 border-white/20"
                style={{ backgroundColor: color }}
              />
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                Value: {value} | Index: {index}
              </div>
              
              {showLabels && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 text-center">
                  <div>{value}</div>
                  <div className="text-blue-400">{index}</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  const renderLines = () => {
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - (value / maxValue) * 100,
      value,
      index,
    }));

    const pathData = points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x} ${point.y}`;
    }, '');

    return (
      <div className="relative w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d={pathData}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              transition: { duration: animationSpeed / 1000 * 2 }
            }}
          />
        </svg>
        
        {/* Data points */}
        <div className="absolute inset-0">
          {points.map((point, index) => {
            const color = getBarColor(index);
            return (
              <motion.div
                key={`point-${index}`}
                className="absolute w-3 h-3 rounded-full cursor-pointer group"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  backgroundColor: color,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { delay: index * 0.05 }
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  {point.value}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'dots':
        return renderDots();
      case 'lines':
        return renderLines();
      case 'bars':
      default:
        return renderBars();
    }
  };

  return (
    <div className={`relative bg-slate-900/50 rounded-lg p-4 overflow-hidden ${className}`}>
      {/* Grid lines and reference markers */}
      {showGrid && (
        <div className="absolute inset-4 pointer-events-none">
          {/* Horizontal grid lines with value markers */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = Math.round(maxValue * (1 - ratio));
            return (
              <div key={`h-grid-${ratio}`} className="absolute w-full">
                <div
                  className="border-t border-slate-700/40"
                  style={{ top: `${ratio * 100}%` }}
                />
                {/* Value marker */}
                <div
                  className="absolute -left-8 text-xs text-slate-400 transform -translate-y-1/2"
                  style={{ top: `${ratio * 100}%` }}
                >
                  {value}
                </div>
              </div>
            );
          })}
          
          {/* Vertical grid lines for larger arrays */}
          {data.length > 8 && [0.2, 0.4, 0.6, 0.8].map((ratio) => (
            <div
              key={`v-grid-${ratio}`}
              className="absolute h-full border-l border-slate-700/30"
              style={{ left: `${ratio * 100}%` }}
            />
          ))}
          

        </div>
      )}
      
      {/* Visualization content */}
      <div className="relative z-10" style={{ height: `${containerHeight}px` }}>
        {renderVisualization()}
      </div>
    </div>
  );
};
import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

export interface FloatingShape {
  id: string;
  type: 'circle' | 'triangle' | 'square' | 'hexagon';
  size: number;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number };
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export interface FloatingShapesProps {
  count?: number;
  parallaxStrength?: number;
  animationSpeed?: number;
  className?: string;
  colors?: string[];
  sizeRange?: [number, number];
  velocityRange?: [number, number];
}

const defaultColors = [
  'rgba(59, 130, 246, 0.3)', // blue-500
  'rgba(147, 51, 234, 0.3)', // purple-500
  'rgba(6, 182, 212, 0.3)',  // cyan-500
  'rgba(236, 72, 153, 0.3)', // pink-500
  'rgba(34, 197, 94, 0.3)',  // green-500
];

const createShape = (
  id: string,
  containerWidth: number,
  containerHeight: number,
  colors: string[],
  sizeRange: [number, number],
  velocityRange: [number, number]
): FloatingShape => {
  const types: FloatingShape['type'][] = ['circle', 'triangle', 'square', 'hexagon'];
  
  return {
    id,
    type: types[Math.floor(Math.random() * types.length)],
    size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
    position: {
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      z: Math.random() * 100,
    },
    velocity: {
      x: (Math.random() - 0.5) * (velocityRange[1] - velocityRange[0]) + velocityRange[0],
      y: (Math.random() - 0.5) * (velocityRange[1] - velocityRange[0]) + velocityRange[0],
    },
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.4 + 0.1,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
  };
};

const ShapeComponent: React.FC<{
  shape: FloatingShape;
  parallaxY: any;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ shape, parallaxY, containerRef }) => {
  const controls = useAnimation();
  const [currentShape, setCurrentShape] = useState(shape);

  useEffect(() => {
    const animateShape = async () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      let newX = currentShape.position.x + currentShape.velocity.x;
      let newY = currentShape.position.y + currentShape.velocity.y;
      let newVelocityX = currentShape.velocity.x;
      let newVelocityY = currentShape.velocity.y;

      // Boundary collision detection
      if (newX <= 0 || newX >= containerRect.width - currentShape.size) {
        newVelocityX = -newVelocityX;
        newX = Math.max(0, Math.min(containerRect.width - currentShape.size, newX));
      }
      
      if (newY <= 0 || newY >= containerRect.height - currentShape.size) {
        newVelocityY = -newVelocityY;
        newY = Math.max(0, Math.min(containerRect.height - currentShape.size, newY));
      }

      const newRotation = currentShape.rotation + currentShape.rotationSpeed;

      setCurrentShape(prev => ({
        ...prev,
        position: { ...prev.position, x: newX, y: newY },
        velocity: { x: newVelocityX, y: newVelocityY },
        rotation: newRotation,
      }));

      await controls.start({
        x: newX,
        y: newY,
        rotate: newRotation,
        transition: { duration: 0.1, ease: 'linear' },
      });
    };

    const interval = setInterval(animateShape, 100);
    return () => clearInterval(interval);
  }, [currentShape, controls, containerRef]);

  const renderShape = () => {
    const baseClasses = "absolute";
    const style = {
      width: currentShape.size,
      height: currentShape.size,
      backgroundColor: currentShape.color,
      opacity: currentShape.opacity,
    };

    switch (currentShape.type) {
      case 'circle':
        return (
          <div
            className={`${baseClasses} rounded-full`}
            style={style}
          />
        );
      case 'triangle':
        return (
          <div
            className={baseClasses}
            style={{
              ...style,
              backgroundColor: 'transparent',
              width: 0,
              height: 0,
              borderLeft: `${currentShape.size / 2}px solid transparent`,
              borderRight: `${currentShape.size / 2}px solid transparent`,
              borderBottom: `${currentShape.size}px solid ${currentShape.color}`,
            }}
          />
        );
      case 'square':
        return (
          <div
            className={baseClasses}
            style={style}
          />
        );
      case 'hexagon':
        return (
          <div
            className={`${baseClasses} hexagon`}
            style={{
              ...style,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      animate={controls}
      initial={{
        x: currentShape.position.x,
        y: currentShape.position.y,
        rotate: currentShape.rotation,
      }}
      style={{
        y: useTransform(parallaxY, [0, 1], [0, currentShape.position.z]),
      }}
    >
      {renderShape()}
    </motion.div>
  );
};

export const FloatingShapes: React.FC<FloatingShapesProps> = ({
  count = 15,
  parallaxStrength = 0.5,
  animationSpeed = 1,
  className = '',
  colors = defaultColors,
  sizeRange = [20, 80],
  velocityRange = [0.5, 2],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const scrollY = useMotionValue(0);
  const parallaxY = useTransform(scrollY, [0, 1000], [0, parallaxStrength]);

  useEffect(() => {
    const updateScrollY = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener('scroll', updateScrollY);
    return () => window.removeEventListener('scroll', updateScrollY);
  }, [scrollY]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const newShapes = Array.from({ length: count }, (_, i) =>
      createShape(
        `shape-${i}`,
        containerRect.width,
        containerRect.height,
        colors,
        sizeRange,
        velocityRange.map(v => v * animationSpeed) as [number, number]
      )
    );

    setShapes(newShapes);
  }, [count, colors, sizeRange, velocityRange, animationSpeed]);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      setShapes(prevShapes =>
        prevShapes.map(shape => ({
          ...shape,
          position: {
            ...shape.position,
            x: Math.min(shape.position.x, containerRect.width - shape.size),
            y: Math.min(shape.position.y, containerRect.height - shape.size),
          },
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {shapes.map(shape => (
        <ShapeComponent
          key={shape.id}
          shape={shape}
          parallaxY={parallaxY}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
};
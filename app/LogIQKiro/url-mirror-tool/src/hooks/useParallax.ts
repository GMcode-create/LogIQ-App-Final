import { useEffect, useState, useCallback } from 'react';

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  enabled?: boolean;
}

export const useParallax = (options: UseParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up', enabled = true } = options;
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleScroll = useCallback(() => {
    if (!enabled) return;

    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;

    let newOffset = { x: 0, y: 0 };

    switch (direction) {
      case 'up':
        newOffset.y = scrollY * speed;
        break;
      case 'down':
        newOffset.y = -scrollY * speed;
        break;
      case 'left':
        newOffset.x = scrollX * speed;
        break;
      case 'right':
        newOffset.x = -scrollX * speed;
        break;
    }

    setOffset(newOffset);
  }, [speed, direction, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Set initial offset
    handleScroll();

    // Add scroll listener with throttling for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [handleScroll, enabled]);

  return {
    offset,
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    style: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      willChange: enabled ? 'transform' : 'auto',
    },
  };
};
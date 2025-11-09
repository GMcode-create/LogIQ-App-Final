import React, { useRef, useEffect } from 'react';
import type { AlgorithmStep } from '../types/algorithm';

interface VisualizationCanvasProps {
  data: number[];
  currentStep?: AlgorithmStep;
  width?: number;
  height?: number;
}

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  data,
  currentStep,
  width = 800,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    const barWidth = (width - 40) / data.length;
    const maxBarHeight = height - 80;

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = ((value - minValue) / range) * maxBarHeight;
      const x = 20 + index * barWidth;
      const y = height - 40 - barHeight;

      // Determine bar color based on current step
      let color = '#3b82f6'; // Default blue
      
      if (currentStep) {
        if (currentStep.comparisons.includes(index)) {
          color = '#ef4444'; // Red for comparisons
        } else if (currentStep.swaps.includes(index)) {
          color = '#10b981'; // Green for swaps
        } else if (currentStep.highlights.includes(index)) {
          color = '#f59e0b'; // Yellow for highlights
        }
      }

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 2, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        value.toString(),
        x + barWidth / 2,
        y - 5
      );

      // Draw index at bottom
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.fillText(
        index.toString(),
        x + barWidth / 2,
        height - 20
      );
    });

    // Draw legend
    const legendY = 20;
    const legendItems = [
      { color: '#ef4444', label: 'Comparing' },
      { color: '#10b981', label: 'Swapping' },
      { color: '#f59e0b', label: 'Highlighted' },
      { color: '#3b82f6', label: 'Default' }
    ];

    legendItems.forEach((item, index) => {
      const x = 20 + index * 100;
      
      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(x, legendY, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, x + 20, legendY + 12);
    });

  }, [data, currentStep, width, height]);

  return (
    <div className="visualization-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg"
      />
      {currentStep && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium text-gray-800">
            Step {currentStep.id}: {currentStep.description}
          </p>
          <div className="mt-2 text-xs text-gray-600">
            Comparisons: {currentStep.metrics.comparisons} | 
            Swaps: {currentStep.metrics.swaps} | 
            Array Accesses: {currentStep.metrics.arrayAccesses}
          </div>
        </div>
      )}
    </div>
  );
};
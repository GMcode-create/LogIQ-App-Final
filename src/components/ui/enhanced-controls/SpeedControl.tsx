import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Turtle, Rabbit, Zap, Gauge } from 'lucide-react';

export interface SpeedPreset {
  name: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({
  speed,
  onSpeedChange,
  className = '',
}) => {
  const presets: SpeedPreset[] = [
    {
      name: 'Slow',
      value: 20,
      icon: <Turtle className="w-4 h-4" />,
      description: 'Perfect for learning step-by-step',
    },
    {
      name: 'Normal',
      value: 50,
      icon: <Gauge className="w-4 h-4" />,
      description: 'Balanced speed for most users',
    },
    {
      name: 'Fast',
      value: 80,
      icon: <Rabbit className="w-4 h-4" />,
      description: 'Quick overview of the algorithm',
    },
    {
      name: 'Very Fast',
      value: 95,
      icon: <Zap className="w-4 h-4" />,
      description: 'Rapid execution for comparison',
    },
  ];

  const getCurrentSpeedLabel = () => {
    if (speed <= 25) return 'Very Slow';
    if (speed <= 40) return 'Slow';
    if (speed <= 60) return 'Normal';
    if (speed <= 80) return 'Fast';
    return 'Very Fast';
  };

  const getSpeedColor = () => {
    if (speed <= 25) return 'text-blue-400';
    if (speed <= 40) return 'text-green-400';
    if (speed <= 60) return 'text-yellow-400';
    if (speed <= 80) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Speed Presets */}
      <div className="space-y-2">
        <div className="text-sm text-gray-300 font-medium">Speed Presets</div>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant={Math.abs(speed - preset.value) <= 5 ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(preset.value)}
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              title={preset.description}
            >
              {preset.icon}
              <span className="text-xs font-medium">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Speed Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-300 font-medium">Custom Speed</div>
          <div className={`text-sm font-semibold ${getSpeedColor()}`}>
            {getCurrentSpeedLabel()}
          </div>
        </div>
        
        <div className="space-y-2">
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Turtle className="w-3 h-3" />
              <span>Slow</span>
            </span>
            <span className="text-gray-400">{speed}%</span>
            <span className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Fast</span>
            </span>
          </div>
        </div>
      </div>

      {/* Speed Info */}
      <div className="text-xs text-gray-500 bg-slate-800/30 rounded p-2">
        <div className="flex items-center space-x-1 mb-1">
          <Gauge className="w-3 h-3" />
          <span className="font-medium">Speed Guide:</span>
        </div>
        <div>Use slower speeds to understand each step, faster speeds for quick overviews.</div>
      </div>
    </div>
  );
};
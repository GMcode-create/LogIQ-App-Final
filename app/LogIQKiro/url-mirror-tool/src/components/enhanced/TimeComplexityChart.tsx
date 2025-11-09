import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Zap, AlertTriangle } from 'lucide-react';

interface ComplexityData {
  algorithm: string;
  complexity: string;
  color: string;
  description: string;
}

interface TimeComplexityChartProps {
  algorithm1: ComplexityData;
  algorithm2: ComplexityData;
  currentInputSize: number;
  className?: string;
}

const TimeComplexityChart: React.FC<TimeComplexityChartProps> = ({
  algorithm1,
  algorithm2,
  currentInputSize,
  className = ''
}) => {
  // Calculate relative performance for different input sizes
  const inputSizes = [10, 50, 100, 500, 1000, 5000];
  
  const calculateOperations = (complexity: string, n: number): number => {
    switch (complexity.toLowerCase()) {
      case 'o(1)':
        return 1;
      case 'o(log n)':
        return Math.log2(n);
      case 'o(n)':
        return n;
      case 'o(n log n)':
        return n * Math.log2(n);
      case 'o(n²)':
      case 'o(n^2)':
        return n * n;
      case 'o(n³)':
      case 'o(n^3)':
        return n * n * n;
      case 'o(2^n)':
        return Math.pow(2, Math.min(n, 20)); // Cap to prevent overflow
      default:
        return n; // Default to linear
    }
  };

  const getComplexityRating = (complexity: string): { rating: string; color: string; icon: React.ReactNode } => {
    switch (complexity.toLowerCase()) {
      case 'o(1)':
        return { rating: 'Excellent', color: 'text-green-400', icon: <Zap className="w-4 h-4" /> };
      case 'o(log n)':
        return { rating: 'Excellent', color: 'text-green-400', icon: <Zap className="w-4 h-4" /> };
      case 'o(n)':
        return { rating: 'Good', color: 'text-blue-400', icon: <TrendingUp className="w-4 h-4" /> };
      case 'o(n log n)':
        return { rating: 'Good', color: 'text-blue-400', icon: <TrendingUp className="w-4 h-4" /> };
      case 'o(n²)':
      case 'o(n^2)':
        return { rating: 'Fair', color: 'text-yellow-400', icon: <BarChart3 className="w-4 h-4" /> };
      case 'o(n³)':
      case 'o(n^3)':
        return { rating: 'Poor', color: 'text-orange-400', icon: <AlertTriangle className="w-4 h-4" /> };
      case 'o(2^n)':
        return { rating: 'Very Poor', color: 'text-red-400', icon: <AlertTriangle className="w-4 h-4" /> };
      default:
        return { rating: 'Unknown', color: 'text-gray-400', icon: <BarChart3 className="w-4 h-4" /> };
    }
  };

  const algo1Rating = getComplexityRating(algorithm1.complexity);
  const algo2Rating = getComplexityRating(algorithm2.complexity);

  // Calculate max operations for scaling the chart
  const maxOperations = Math.max(
    ...inputSizes.map(size => 
      Math.max(
        calculateOperations(algorithm1.complexity, size),
        calculateOperations(algorithm2.complexity, size)
      )
    )
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Complexity Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <TrendingUp className="w-5 h-5" />
            Time Complexity Analysis
          </CardTitle>
          <p className="text-gray-400 text-sm">
            How algorithms scale with input size
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Algorithm 1 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-blue-400 font-semibold">{algorithm1.algorithm}</h3>
                <Badge 
                  variant="outline" 
                  className={`${algo1Rating.color} border-current`}
                >
                  {algo1Rating.icon}
                  <span className="ml-1">{algo1Rating.rating}</span>
                </Badge>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-2xl font-mono font-bold text-blue-400 mb-2">
                  {algorithm1.complexity}
                </div>
                <p className="text-gray-300 text-sm">
                  {algorithm1.description}
                </p>
              </div>
            </div>

            {/* Algorithm 2 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-purple-400 font-semibold">{algorithm2.algorithm}</h3>
                <Badge 
                  variant="outline" 
                  className={`${algo2Rating.color} border-current`}
                >
                  {algo2Rating.icon}
                  <span className="ml-1">{algo2Rating.rating}</span>
                </Badge>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-2xl font-mono font-bold text-purple-400 mb-2">
                  {algorithm2.complexity}
                </div>
                <p className="text-gray-300 text-sm">
                  {algorithm2.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scaling Visualization */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <BarChart3 className="w-5 h-5" />
            Performance Scaling Chart
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Operations required for different input sizes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="grid grid-cols-6 gap-2 h-48">
                {inputSizes.map((size, index) => {
                  const ops1 = calculateOperations(algorithm1.complexity, size);
                  const ops2 = calculateOperations(algorithm2.complexity, size);
                  const height1 = Math.max((ops1 / maxOperations) * 100, 2); // Minimum 2% height
                  const height2 = Math.max((ops2 / maxOperations) * 100, 2); // Minimum 2% height
                  const isCurrentSize = size === currentInputSize;

                  return (
                    <div key={size} className="flex flex-col items-center space-y-2 h-full">
                      {/* Bars Container */}
                      <div className="flex-1 flex items-end justify-center gap-1 w-full min-h-0">
                        <div className="flex flex-col items-center flex-1 h-full">
                          <div className="flex-1 flex items-end w-full">
                            <div
                              className={`w-full bg-blue-500 rounded-t transition-all duration-500 min-h-[2px] ${
                                isCurrentSize ? 'ring-2 ring-blue-400' : ''
                              }`}
                              style={{ height: `${height1}%` }}
                              title={`${algorithm1.algorithm}: ${ops1.toLocaleString()} operations`}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center flex-1 h-full">
                          <div className="flex-1 flex items-end w-full">
                            <div
                              className={`w-full bg-purple-500 rounded-t transition-all duration-500 min-h-[2px] ${
                                isCurrentSize ? 'ring-2 ring-purple-400' : ''
                              }`}
                              style={{ height: `${height2}%` }}
                              title={`${algorithm2.algorithm}: ${ops2.toLocaleString()} operations`}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Size Labels */}
                      <div className={`text-xs text-center flex-shrink-0 ${
                        isCurrentSize ? 'text-yellow-400 font-bold' : 'text-gray-400'
                      }`}>
                        {size}
                        {isCurrentSize && (
                          <div className="text-yellow-400">●</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-blue-400 text-sm">{algorithm1.algorithm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-purple-400 text-sm">{algorithm2.algorithm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span className="text-yellow-400 text-sm">Current Size</span>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="text-green-400 font-semibold text-sm mb-1">Best Case</div>
                <div className="text-gray-300 text-xs">
                  {algo1Rating.rating === 'Excellent' || algo2Rating.rating === 'Excellent' 
                    ? 'One algorithm has excellent time complexity'
                    : 'Both algorithms have room for optimization'
                  }
                </div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="text-yellow-400 font-semibold text-sm mb-1">Current Size</div>
                <div className="text-gray-300 text-xs">
                  At {currentInputSize} elements, performance difference is{' '}
                  {Math.abs(
                    calculateOperations(algorithm1.complexity, currentInputSize) - 
                    calculateOperations(algorithm2.complexity, currentInputSize)
                  ) > currentInputSize ? 'significant' : 'moderate'}
                </div>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-3">
                <div className="text-blue-400 font-semibold text-sm mb-1">Scaling</div>
                <div className="text-gray-300 text-xs">
                  {algorithm1.complexity === algorithm2.complexity 
                    ? 'Both algorithms scale similarly'
                    : 'Performance gap increases with larger inputs'
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeComplexityChart;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  HardDrive, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Database,
  MemoryStick,
  Cpu,
  BarChart3
} from 'lucide-react';

interface MemoryMetrics {
  algorithmName: string;
  baseMemory: number; // Memory for the input array
  auxiliaryMemory: number; // Additional memory used by algorithm
  totalMemory: number; // Total memory usage
  memoryEfficiency: number; // 0-100 score
  spaceComplexity: string; // Big O notation
  color: string;
}

interface MemoryUsageTrackerProps {
  algorithm1: MemoryMetrics;
  algorithm2: MemoryMetrics;
  inputSize: number;
  className?: string;
}

const MemoryUsageTracker: React.FC<MemoryUsageTrackerProps> = ({
  algorithm1,
  algorithm2,
  inputSize,
  className = ''
}) => {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMemoryEfficiencyRating = (efficiency: number): { rating: string; color: string; icon: React.ReactNode } => {
    if (efficiency >= 90) return { rating: 'Excellent', color: 'text-green-400', icon: <Zap className="w-4 h-4" /> };
    if (efficiency >= 75) return { rating: 'Good', color: 'text-blue-400', icon: <TrendingUp className="w-4 h-4" /> };
    if (efficiency >= 60) return { rating: 'Fair', color: 'text-yellow-400', icon: <BarChart3 className="w-4 h-4" /> };
    if (efficiency >= 40) return { rating: 'Poor', color: 'text-orange-400', icon: <TrendingDown className="w-4 h-4" /> };
    return { rating: 'Very Poor', color: 'text-red-400', icon: <TrendingDown className="w-4 h-4" /> };
  };

  const getSpaceComplexityRating = (complexity: string): { rating: string; color: string } => {
    switch (complexity.toLowerCase()) {
      case 'o(1)':
        return { rating: 'Excellent', color: 'text-green-400' };
      case 'o(log n)':
        return { rating: 'Very Good', color: 'text-green-300' };
      case 'o(n)':
        return { rating: 'Good', color: 'text-blue-400' };
      case 'o(n log n)':
        return { rating: 'Fair', color: 'text-yellow-400' };
      case 'o(n²)':
      case 'o(n^2)':
        return { rating: 'Poor', color: 'text-orange-400' };
      default:
        return { rating: 'Unknown', color: 'text-gray-400' };
    }
  };

  const algo1Rating = getMemoryEfficiencyRating(algorithm1.memoryEfficiency);
  const algo2Rating = getMemoryEfficiencyRating(algorithm2.memoryEfficiency);
  const algo1SpaceRating = getSpaceComplexityRating(algorithm1.spaceComplexity);
  const algo2SpaceRating = getSpaceComplexityRating(algorithm2.spaceComplexity);

  const maxMemory = Math.max(algorithm1.totalMemory, algorithm2.totalMemory);
  const memoryWinner = algorithm1.totalMemory < algorithm2.totalMemory ? 'algorithm1' : 
                      algorithm2.totalMemory < algorithm1.totalMemory ? 'algorithm2' : 'tie';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Memory Usage Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <MemoryStick className="w-5 h-5" />
            Memory Usage Analysis
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Comparing memory consumption for {inputSize} elements
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Algorithm 1 Memory Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${algorithm1.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {algorithm1.algorithmName}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`${algo1Rating.color} border-current`}
                >
                  {algo1Rating.icon}
                  <span className="ml-1">{algo1Rating.rating}</span>
                </Badge>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                {/* Total Memory */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Total Memory</span>
                  </div>
                  <span className={`font-mono font-bold ${algorithm1.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                    {formatBytes(algorithm1.totalMemory)}
                  </span>
                </div>

                {/* Base Memory */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Input Array</span>
                  </div>
                  <span className="font-mono text-gray-400">
                    {formatBytes(algorithm1.baseMemory)}
                  </span>
                </div>

                {/* Auxiliary Memory */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Algorithm Overhead</span>
                  </div>
                  <span className="font-mono text-gray-400">
                    {formatBytes(algorithm1.auxiliaryMemory)}
                  </span>
                </div>

                {/* Space Complexity */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <span className="text-sm text-gray-300">Space Complexity</span>
                  <Badge variant="outline" className={`${algo1SpaceRating.color} border-current`}>
                    {algorithm1.spaceComplexity}
                  </Badge>
                </div>

                {/* Memory Usage Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Memory Usage</span>
                    <span>{((algorithm1.totalMemory / maxMemory) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={(algorithm1.totalMemory / maxMemory) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            {/* Algorithm 2 Memory Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${algorithm2.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {algorithm2.algorithmName}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`${algo2Rating.color} border-current`}
                >
                  {algo2Rating.icon}
                  <span className="ml-1">{algo2Rating.rating}</span>
                </Badge>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                {/* Total Memory */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Total Memory</span>
                  </div>
                  <span className={`font-mono font-bold ${algorithm2.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                    {formatBytes(algorithm2.totalMemory)}
                  </span>
                </div>

                {/* Base Memory */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Input Array</span>
                  </div>
                  <span className="font-mono text-gray-400">
                    {formatBytes(algorithm2.baseMemory)}
                  </span>
                </div>

                {/* Auxiliary Memory */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Algorithm Overhead</span>
                  </div>
                  <span className="font-mono text-gray-400">
                    {formatBytes(algorithm2.auxiliaryMemory)}
                  </span>
                </div>

                {/* Space Complexity */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                  <span className="text-sm text-gray-300">Space Complexity</span>
                  <Badge variant="outline" className={`${algo2SpaceRating.color} border-current`}>
                    {algorithm2.spaceComplexity}
                  </Badge>
                </div>

                {/* Memory Usage Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Memory Usage</span>
                    <span>{((algorithm2.totalMemory / maxMemory) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={(algorithm2.totalMemory / maxMemory) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Efficiency Comparison */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <BarChart3 className="w-5 h-5" />
            Memory Efficiency Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Winner Declaration */}
            <div className="text-center">
              {memoryWinner === 'tie' ? (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-lg px-4 py-2">
                  Equal Memory Usage
                </Badge>
              ) : (
                <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                  {memoryWinner === 'algorithm1' ? algorithm1.algorithmName : algorithm2.algorithmName} Uses Less Memory
                </Badge>
              )}
            </div>

            {/* Memory Comparison Chart */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-400 border-b border-slate-700 pb-2">
                <div>Algorithm</div>
                <div className="text-center">Memory Usage</div>
                <div className="text-center">Efficiency</div>
              </div>

              {/* Algorithm 1 Row */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className={`font-medium ${algorithm1.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {algorithm1.algorithmName}
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          algorithm1.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${(algorithm1.totalMemory / maxMemory) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-16">
                      {formatBytes(algorithm1.totalMemory)}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className={`${algo1Rating.color} border-current`}>
                    {algorithm1.memoryEfficiency}%
                  </Badge>
                </div>
              </div>

              {/* Algorithm 2 Row */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className={`font-medium ${algorithm2.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {algorithm2.algorithmName}
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          algorithm2.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${(algorithm2.totalMemory / maxMemory) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-16">
                      {formatBytes(algorithm2.totalMemory)}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className={`${algo2Rating.color} border-current`}>
                    {algorithm2.memoryEfficiency}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Memory Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">Memory Winner</h4>
                <p className="text-gray-300 text-sm">
                  {memoryWinner === 'tie' 
                    ? 'Both algorithms use the same amount of memory'
                    : `${memoryWinner === 'algorithm1' ? algorithm1.algorithmName : algorithm2.algorithmName} uses ${
                        Math.abs(algorithm1.totalMemory - algorithm2.totalMemory) > 1024 
                          ? formatBytes(Math.abs(algorithm1.totalMemory - algorithm2.totalMemory)) + ' less'
                          : 'slightly less'
                      } memory`
                  }
                </p>
              </div>
              <div className="bg-slate-900/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">Space Complexity</h4>
                <p className="text-gray-300 text-sm">
                  {algorithm1.spaceComplexity === algorithm2.spaceComplexity
                    ? `Both algorithms have ${algorithm1.spaceComplexity} space complexity`
                    : `Different space complexities: ${algorithm1.spaceComplexity} vs ${algorithm2.spaceComplexity}`
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryUsageTracker;
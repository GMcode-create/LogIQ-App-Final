import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Target,
  Award
} from 'lucide-react';

interface AlgorithmMetrics {
  name: string;
  comparisons: number;
  swaps: number;
  executionTime: number;
  memoryUsage: number;
  steps: number;
  efficiency: number; // 0-100 score
}

interface PerformanceMetricsProps {
  algorithm1: AlgorithmMetrics;
  algorithm2: AlgorithmMetrics;
  inputSize: number;
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  algorithm1,
  algorithm2,
  inputSize,
  className = ''
}) => {
  // Calculate winner for each metric
  const getWinner = (metric1: number, metric2: number, lowerIsBetter = true) => {
    if (metric1 === metric2) return 'tie';
    if (lowerIsBetter) {
      return metric1 < metric2 ? 'algorithm1' : 'algorithm2';
    } else {
      return metric1 > metric2 ? 'algorithm1' : 'algorithm2';
    }
  };

  const comparisonsWinner = getWinner(algorithm1.comparisons, algorithm2.comparisons);
  const swapsWinner = getWinner(algorithm1.swaps, algorithm2.swaps);
  const timeWinner = getWinner(algorithm1.executionTime, algorithm2.executionTime);
  const stepsWinner = getWinner(algorithm1.steps, algorithm2.steps);
  const efficiencyWinner = getWinner(algorithm1.efficiency, algorithm2.efficiency, false);

  // Calculate overall winner
  const getOverallWinner = () => {
    const scores = { algorithm1: 0, algorithm2: 0 };
    
    [comparisonsWinner, swapsWinner, timeWinner, stepsWinner, efficiencyWinner].forEach(winner => {
      if (winner === 'algorithm1') scores.algorithm1++;
      else if (winner === 'algorithm2') scores.algorithm2++;
    });

    if (scores.algorithm1 > scores.algorithm2) return 'algorithm1';
    if (scores.algorithm2 > scores.algorithm1) return 'algorithm2';
    return 'tie';
  };

  const overallWinner = getOverallWinner();

  const getWinnerIcon = (winner: string) => {
    switch (winner) {
      case 'algorithm1':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'algorithm2':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Target className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getWinnerColor = (winner: string, isAlgorithm1: boolean) => {
    if (winner === 'tie') return 'text-yellow-400';
    if ((winner === 'algorithm1' && isAlgorithm1) || (winner === 'algorithm2' && !isAlgorithm1)) {
      return 'text-green-400 font-bold';
    }
    return 'text-red-400';
  };

  const MetricRow = ({ 
    label, 
    value1, 
    value2, 
    winner, 
    icon, 
    unit = '' 
  }: {
    label: string;
    value1: number;
    value2: number;
    winner: string;
    icon: React.ReactNode;
    unit?: string;
  }) => (
    <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-700/50 last:border-b-0">
      <div className="flex items-center gap-2 text-gray-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={`text-center ${getWinnerColor(winner, true)}`}>
        {value1.toLocaleString()}{unit}
        {winner === 'algorithm1' && <Trophy className="w-3 h-3 inline ml-1" />}
      </div>
      <div className={`text-center ${getWinnerColor(winner, false)}`}>
        {value2.toLocaleString()}{unit}
        {winner === 'algorithm2' && <Trophy className="w-3 h-3 inline ml-1" />}
      </div>
      <div className="flex justify-center">
        {getWinnerIcon(winner)}
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Winner Card */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5 text-yellow-400" />
            Performance Champion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            {overallWinner === 'tie' ? (
              <div>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-lg px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  It's a Tie!
                </Badge>
                <p className="text-gray-400 text-sm mt-2">
                  Both algorithms performed equally well across all metrics
                </p>
              </div>
            ) : (
              <div>
                <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  {overallWinner === 'algorithm1' ? algorithm1.name : algorithm2.name} Wins!
                </Badge>
                <p className="text-gray-400 text-sm mt-2">
                  Winner in most performance categories
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Comparison */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <BarChart3 className="w-5 h-5" />
            Detailed Performance Analysis
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Comparing performance metrics for input size: {inputSize} elements
          </p>
        </CardHeader>
        <CardContent>
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-4 pb-3 border-b border-slate-600 mb-4">
            <div className="text-gray-400 font-medium">Metric</div>
            <div className="text-center text-blue-400 font-medium">{algorithm1.name}</div>
            <div className="text-center text-purple-400 font-medium">{algorithm2.name}</div>
            <div className="text-center text-gray-400 font-medium">Winner</div>
          </div>

          {/* Metrics Rows */}
          <div className="space-y-1">
            <MetricRow
              label="Comparisons"
              value1={algorithm1.comparisons}
              value2={algorithm2.comparisons}
              winner={comparisonsWinner}
              icon={<BarChart3 className="w-4 h-4" />}
            />
            <MetricRow
              label="Swaps"
              value1={algorithm1.swaps}
              value2={algorithm2.swaps}
              winner={swapsWinner}
              icon={<Zap className="w-4 h-4" />}
            />
            <MetricRow
              label="Execution Time"
              value1={algorithm1.executionTime}
              value2={algorithm2.executionTime}
              winner={timeWinner}
              icon={<Clock className="w-4 h-4" />}
              unit="ms"
            />
            <MetricRow
              label="Total Steps"
              value1={algorithm1.steps}
              value2={algorithm2.steps}
              winner={stepsWinner}
              icon={<Target className="w-4 h-4" />}
            />
            <MetricRow
              label="Efficiency Score"
              value1={algorithm1.efficiency}
              value2={algorithm2.efficiency}
              winner={efficiencyWinner}
              icon={<TrendingUp className="w-4 h-4" />}
              unit="%"
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Visualization */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <TrendingUp className="w-5 h-5" />
            Performance Comparison Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comparisons Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Comparisons</span>
              <span className="text-gray-400">
                {Math.max(algorithm1.comparisons, algorithm2.comparisons).toLocaleString()} max
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-xs w-20">{algorithm1.name}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(algorithm1.comparisons / Math.max(algorithm1.comparisons, algorithm2.comparisons)) * 100}%`
                    }}
                  />
                </div>
                <span className="text-blue-400 text-xs w-16 text-right">
                  {algorithm1.comparisons.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-xs w-20">{algorithm2.name}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(algorithm2.comparisons / Math.max(algorithm1.comparisons, algorithm2.comparisons)) * 100}%`
                    }}
                  />
                </div>
                <span className="text-purple-400 text-xs w-16 text-right">
                  {algorithm2.comparisons.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Swaps Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Swaps</span>
              <span className="text-gray-400">
                {Math.max(algorithm1.swaps, algorithm2.swaps).toLocaleString()} max
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-xs w-20">{algorithm1.name}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(algorithm1.swaps, algorithm2.swaps) === 0 ? 0 : (algorithm1.swaps / Math.max(algorithm1.swaps, algorithm2.swaps)) * 100}%`
                    }}
                  />
                </div>
                <span className="text-blue-400 text-xs w-16 text-right">
                  {algorithm1.swaps.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-xs w-20">{algorithm2.name}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(algorithm1.swaps, algorithm2.swaps) === 0 ? 0 : (algorithm2.swaps / Math.max(algorithm1.swaps, algorithm2.swaps)) * 100}%`
                    }}
                  />
                </div>
                <span className="text-purple-400 text-xs w-16 text-right">
                  {algorithm2.swaps.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Efficiency Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Efficiency Score</span>
              <span className="text-gray-400">100% max</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-xs w-20">{algorithm1.name}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${algorithm1.efficiency}%` }}
                  />
                </div>
                <span className="text-blue-400 text-xs w-16 text-right">
                  {algorithm1.efficiency.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-xs w-20">{algorithm2.name}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${algorithm2.efficiency}%` }}
                  />
                </div>
                <span className="text-purple-400 text-xs w-16 text-right">
                  {algorithm2.efficiency.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
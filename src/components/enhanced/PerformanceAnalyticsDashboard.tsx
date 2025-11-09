import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Clock,
  Zap,
  Target,
  Award,
  Activity,
  Database,
  FileText,
  RefreshCw
} from 'lucide-react';

interface PerformanceRecord {
  id: string;
  timestamp: Date;
  algorithm1: string;
  algorithm2: string;
  inputSize: number;
  algorithm1Metrics: {
    comparisons: number;
    swaps: number;
    executionTime: number;
    memoryUsage: number;
  };
  algorithm2Metrics: {
    comparisons: number;
    swaps: number;
    executionTime: number;
    memoryUsage: number;
  };
  winner: string;
}

interface PerformanceAnalyticsDashboardProps {
  currentComparison?: {
    algorithm1: string;
    algorithm2: string;
    inputSize: number;
    metrics1: any;
    metrics2: any;
    winner: string;
  };
  className?: string;
}

const PerformanceAnalyticsDashboard: React.FC<PerformanceAnalyticsDashboardProps> = ({
  currentComparison,
  className = ''
}) => {
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceRecord[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Load performance history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('algorithmPerformanceHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory).map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }));
        setPerformanceHistory(history);
      } catch (error) {
        console.error('Failed to load performance history:', error);
      }
    }
  }, []);

  // Save current comparison to history
  const saveCurrentComparison = () => {
    if (!currentComparison) return;

    const newRecord: PerformanceRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      algorithm1: currentComparison.algorithm1,
      algorithm2: currentComparison.algorithm2,
      inputSize: currentComparison.inputSize,
      algorithm1Metrics: currentComparison.metrics1,
      algorithm2Metrics: currentComparison.metrics2,
      winner: currentComparison.winner
    };

    const updatedHistory = [newRecord, ...performanceHistory].slice(0, 100); // Keep last 100 records
    setPerformanceHistory(updatedHistory);
    localStorage.setItem('algorithmPerformanceHistory', JSON.stringify(updatedHistory));
  };

  // Filter history by time range
  const getFilteredHistory = () => {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = new Date(now.getTime() - timeRanges[selectedTimeRange]);
    return performanceHistory.filter(record => record.timestamp >= cutoff);
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    const filteredHistory = getFilteredHistory();

    if (filteredHistory.length === 0) {
      return {
        totalComparisons: 0,
        averageInputSize: 0,
        mostComparedAlgorithms: [],
        performanceTrends: {},
        winRates: []
      };
    }

    // Algorithm frequency
    const algorithmCounts: Record<string, number> = {};
    const winCounts: Record<string, number> = {};
    let totalInputSize = 0;

    filteredHistory.forEach(record => {
      // Count algorithm usage
      algorithmCounts[record.algorithm1] = (algorithmCounts[record.algorithm1] || 0) + 1;
      algorithmCounts[record.algorithm2] = (algorithmCounts[record.algorithm2] || 0) + 1;

      // Count wins
      if (record.winner !== 'tie') {
        winCounts[record.winner] = (winCounts[record.winner] || 0) + 1;
      }

      totalInputSize += record.inputSize;
    });

    // Most compared algorithms
    const mostComparedAlgorithms = Object.entries(algorithmCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([algorithm, count]) => ({ algorithm, count }));

    // Win rates
    const winRates = Object.entries(winCounts).map(([algorithm, wins]) => ({
      algorithm,
      wins,
      rate: (wins / filteredHistory.length) * 100
    })).sort((a, b) => b.rate - a.rate);

    return {
      totalComparisons: filteredHistory.length,
      averageInputSize: Math.round(totalInputSize / filteredHistory.length),
      mostComparedAlgorithms,
      winRates
    };
  };

  const analytics = calculateAnalytics();

  // Export functionality
  const exportData = (format: 'json' | 'csv') => {
    const filteredHistory = getFilteredHistory();

    if (format === 'json') {
      const dataStr = JSON.stringify(filteredHistory, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `algorithm-performance-${selectedTimeRange}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = [
        'Timestamp',
        'Algorithm 1',
        'Algorithm 2',
        'Input Size',
        'A1 Comparisons',
        'A1 Swaps',
        'A1 Execution Time',
        'A1 Memory Usage',
        'A2 Comparisons',
        'A2 Swaps',
        'A2 Execution Time',
        'A2 Memory Usage',
        'Winner'
      ];

      const csvContent = [
        headers.join(','),
        ...filteredHistory.map(record => [
          record.timestamp.toISOString(),
          record.algorithm1,
          record.algorithm2,
          record.inputSize,
          record.algorithm1Metrics.comparisons,
          record.algorithm1Metrics.swaps,
          record.algorithm1Metrics.executionTime,
          record.algorithm1Metrics.memoryUsage,
          record.algorithm2Metrics.comparisons,
          record.algorithm2Metrics.swaps,
          record.algorithm2Metrics.executionTime,
          record.algorithm2Metrics.memoryUsage,
          record.winner
        ].join(','))
      ].join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `algorithm-performance-${selectedTimeRange}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const clearHistory = () => {
    setPerformanceHistory([]);
    localStorage.removeItem('algorithmPerformanceHistory');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Header */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              <CardTitle className="text-white text-xl">Performance Analytics Dashboard</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {currentComparison && (
                <Button
                  onClick={saveCurrentComparison}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Save Current
                </Button>
              )}
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
                className="border-slate-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-gray-400">
            Historical performance tracking and trend analysis for algorithm comparisons
          </p>
        </CardHeader>
      </Card>

      {/* Time Range Selector */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Time Range:</span>
            </div>
            <div className="flex gap-2">
              {(['1h', '24h', '7d', '30d'] as const).map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={selectedTimeRange === range ? 'default' : 'outline'}
                  onClick={() => setSelectedTimeRange(range)}
                  className={selectedTimeRange === range ? 'bg-blue-600' : 'border-slate-600'}
                >
                  {range === '1h' ? '1 Hour' :
                    range === '24h' ? '24 Hours' :
                      range === '7d' ? '7 Days' : '30 Days'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{analytics.totalComparisons}</div>
                <div className="text-sm text-gray-400">Total Comparisons</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{analytics.averageInputSize}</div>
                <div className="text-sm text-gray-400">Avg Input Size</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {analytics.winRates.length > 0 ? analytics.winRates[0].algorithm : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">Top Performer</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {performanceHistory.length > 0
                    ? new Date(performanceHistory[0].timestamp).toLocaleDateString()
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-gray-400">Last Comparison</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="algorithms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="algorithms">Algorithm Usage</TabsTrigger>
          <TabsTrigger value="performance">Win Rates</TabsTrigger>
          <TabsTrigger value="history">Recent History</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        {/* Algorithm Usage Tab */}
        <TabsContent value="algorithms">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <BarChart3 className="w-5 h-5" />
                Most Compared Algorithms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.mostComparedAlgorithms.length > 0 ? (
                <div className="space-y-4">
                  {analytics.mostComparedAlgorithms.map((item, index) => (
                    <div key={item.algorithm} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-4">
                        <span className="text-gray-400 font-mono">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{item.algorithm}</span>
                          <span className="text-gray-400 text-sm">{item.count} comparisons</span>
                        </div>
                        <Progress
                          value={(item.count / analytics.mostComparedAlgorithms[0].count) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comparison data available</p>
                  <p className="text-sm">Run some algorithm comparisons to see analytics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Win Rates Tab */}
        <TabsContent value="performance">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Award className="w-5 h-5" />
                Algorithm Win Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.winRates.length > 0 ? (
                <div className="space-y-4">
                  {analytics.winRates.map((item, index) => (
                    <div key={item.algorithm} className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Award className="w-4 h-4 text-yellow-400" />}
                        <span className="text-gray-400 font-mono">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{item.algorithm}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">{item.wins} wins</span>
                            <Badge
                              variant="outline"
                              className={`${item.rate >= 70 ? 'text-green-400 border-green-400' :
                                item.rate >= 50 ? 'text-yellow-400 border-yellow-400' :
                                  'text-red-400 border-red-400'
                                }`}
                            >
                              {item.rate.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={item.rate} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No performance data available</p>
                  <p className="text-sm">Complete some comparisons to see win rates</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Clock className="w-5 h-5" />
                  Recent Comparisons
                </CardTitle>
                {performanceHistory.length > 0 && (
                  <Button
                    onClick={clearHistory}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    Clear History
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {getFilteredHistory().length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getFilteredHistory().slice(0, 20).map((record) => (
                    <div key={record.id} className="bg-slate-900/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 font-medium">{record.algorithm1}</span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-purple-400 font-medium">{record.algorithm2}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {record.inputSize} elements
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {record.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-300">
                          Winner: <span className="text-green-400 font-medium">
                            {record.winner === 'tie' ? 'Tie' : record.winner}
                          </span>
                        </div>
                        <div className="text-gray-400">
                          {record.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent comparisons</p>
                  <p className="text-sm">Your comparison history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <FileText className="w-5 h-5" />
                Export Performance Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                Export your performance data for external analysis or reporting.
                Data includes all comparisons from the selected time range.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => exportData('json')}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={getFilteredHistory().length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as JSON
                </Button>
                <Button
                  onClick={() => exportData('csv')}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={getFilteredHistory().length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
              </div>

              <div className="bg-slate-900/30 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Export Information</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>Records in selected range: {getFilteredHistory().length}</div>
                  <div>Time range: {selectedTimeRange}</div>
                  <div>File formats: JSON (structured data), CSV (spreadsheet compatible)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalyticsDashboard;
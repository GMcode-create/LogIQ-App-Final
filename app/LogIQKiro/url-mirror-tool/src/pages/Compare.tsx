
import Navigation from "@/components/Navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";
import { useAlgorithmComparison } from "@/hooks/useAlgorithmComparison";
import { useGlobalKeyboardShortcuts, createNavigationShortcuts, createAlgorithmShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import PerformanceMetrics from "@/components/enhanced/PerformanceMetrics";
import TimeComplexityChart from "@/components/enhanced/TimeComplexityChart";
import MemoryUsageTracker from "@/components/enhanced/MemoryUsageTracker";
import PerformanceAnalyticsDashboard from "@/components/enhanced/PerformanceAnalyticsDashboard";

const algorithms = [
  // Sorting Algorithms
  "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", 
  "Heap Sort", "Shell Sort", "Counting Sort", "Radix Sort", "Bucket Sort",
  // Searching Algorithms
  "Linear Search", "Binary Search",
  // Graph Algorithms
  "Breadth-First Search", "Depth-First Search"
];

const Compare = () => {
  const navigate = useNavigate();
  
  const {
    algorithm1,
    setAlgorithm1,
    algorithm2,
    setAlgorithm2,
    inputArray,
    setInputArray,
    arraySize,
    setArraySize,
    speed,
    setSpeed,
    synchronizedSpeed,
    setSynchronizedSpeed,
    algo1State,
    algo2State,
    generateRandomArray,
    initializeAlgorithms,
    playAlgorithm,
    resetAlgorithm,
    stepForward,
    stepBack,
    parseArray
  } = useAlgorithmComparison();

  // Navigation shortcuts
  const navigationShortcuts = createNavigationShortcuts({
    goToHome: () => navigate('/'),
    goToCompare: () => navigate('/compare'),
    goToCustom: () => navigate('/custom'),
  });

  // Algorithm control shortcuts
  const algorithmShortcuts = createAlgorithmShortcuts({
    playPause: () => {
      // Toggle both algorithms if synchronized, otherwise just algorithm 1
      if (synchronizedSpeed) {
        playAlgorithm(1);
        playAlgorithm(2);
      } else {
        playAlgorithm(1);
      }
    },
    reset: () => {
      resetAlgorithm(1);
      resetAlgorithm(2);
    },
    stepForward: () => {
      if (synchronizedSpeed) {
        stepForward(1);
        stepForward(2);
      } else {
        stepForward(1);
      }
    },
    stepBack: () => {
      if (synchronizedSpeed) {
        stepBack(1);
        stepBack(2);
      } else {
        stepBack(1);
      }
    },
    setSpeedSlow: () => setSpeed([25]),
    setSpeedNormal: () => setSpeed([50]),
    setSpeedFast: () => setSpeed([75]),
    setSpeedVeryFast: () => setSpeed([100]),
  });

  const allShortcuts = [...navigationShortcuts, ...algorithmShortcuts];
  useGlobalKeyboardShortcuts(allShortcuts);

  // Initialize algorithms when component mounts or dependencies change
  useEffect(() => {
    initializeAlgorithms();
  }, [initializeAlgorithms]);

  const handleSynchronizedSpeedChange = (checked: boolean | "indeterminate") => {
    setSynchronizedSpeed(checked === true);
  };

  const inputArrayNumbers = parseArray(inputArray);
  const currentStep1 = algo1State.steps[algo1State.currentStep];
  const currentStep2 = algo2State.steps[algo2State.currentStep];

  // Helper functions for algorithm complexity and descriptions
  const getAlgorithmComplexity = (algorithmName: string): string => {
    const complexityMap: Record<string, string> = {
      "Bubble Sort": "O(n²)",
      "Selection Sort": "O(n²)",
      "Insertion Sort": "O(n²)",
      "Merge Sort": "O(n log n)",
      "Quick Sort": "O(n log n)",
      "Heap Sort": "O(n log n)",
      "Shell Sort": "O(n^1.25)",
      "Counting Sort": "O(n+k)",
      "Radix Sort": "O(nk)",
      "Bucket Sort": "O(n+k)",
      "Linear Search": "O(n)",
      "Binary Search": "O(log n)",
      "Breadth-First Search": "O(V+E)",
      "Depth-First Search": "O(V+E)"
    };
    return complexityMap[algorithmName] || "O(n)";
  };

  const getAlgorithmDescription = (algorithmName: string): string => {
    const descriptionMap: Record<string, string> = {
      "Bubble Sort": "Simple comparison-based algorithm that repeatedly steps through the list",
      "Selection Sort": "Finds the minimum element and places it at the beginning",
      "Insertion Sort": "Builds the sorted array one element at a time",
      "Merge Sort": "Divide-and-conquer algorithm that divides the array into halves",
      "Quick Sort": "Efficient divide-and-conquer algorithm using pivot partitioning",
      "Heap Sort": "Comparison-based algorithm using a binary heap data structure",
      "Shell Sort": "Generalization of insertion sort allowing exchanges of far apart elements",
      "Counting Sort": "Non-comparison algorithm that counts occurrences of each element",
      "Radix Sort": "Non-comparison algorithm that sorts by individual digits",
      "Bucket Sort": "Distributes elements into buckets and sorts each bucket",
      "Linear Search": "Sequential search through each element until target is found",
      "Binary Search": "Efficient search on sorted arrays by repeatedly dividing search space",
      "Breadth-First Search": "Graph traversal exploring all vertices at current depth first",
      "Depth-First Search": "Graph traversal exploring as far as possible along each branch"
    };
    return descriptionMap[algorithmName] || "Algorithm for processing data";
  };

  const getAlgorithmSpaceComplexity = (algorithmName: string): string => {
    const spaceComplexityMap: Record<string, string> = {
      "Bubble Sort": "O(1)",
      "Selection Sort": "O(1)",
      "Insertion Sort": "O(1)",
      "Merge Sort": "O(n)",
      "Quick Sort": "O(log n)",
      "Heap Sort": "O(1)",
      "Shell Sort": "O(1)",
      "Counting Sort": "O(k)",
      "Radix Sort": "O(n+k)",
      "Bucket Sort": "O(n)",
      "Linear Search": "O(1)",
      "Binary Search": "O(1)",
      "Breadth-First Search": "O(V)",
      "Depth-First Search": "O(V)"
    };
    return spaceComplexityMap[algorithmName] || "O(1)";
  };

  const calculateMemoryUsage = (algorithmName: string, inputSize: number) => {
    const baseMemory = inputSize * 4; // 4 bytes per integer
    let auxiliaryMemory = 0;
    let memoryEfficiency = 90;

    switch (algorithmName) {
      case "Bubble Sort":
      case "Selection Sort":
      case "Insertion Sort":
      case "Heap Sort":
      case "Shell Sort":
        auxiliaryMemory = 16; // Few variables
        memoryEfficiency = 95;
        break;
      case "Merge Sort":
        auxiliaryMemory = inputSize * 4; // Additional array
        memoryEfficiency = 50;
        break;
      case "Quick Sort":
        auxiliaryMemory = Math.log2(inputSize) * 8; // Recursion stack
        memoryEfficiency = 85;
        break;
      case "Counting Sort":
        auxiliaryMemory = 1000 * 4; // Assuming max value of 1000
        memoryEfficiency = 70;
        break;
      case "Radix Sort":
        auxiliaryMemory = inputSize * 4 + 10 * 4; // Output array + buckets
        memoryEfficiency = 60;
        break;
      case "Bucket Sort":
        auxiliaryMemory = inputSize * 4 * 1.5; // Buckets overhead
        memoryEfficiency = 55;
        break;
      default:
        auxiliaryMemory = 16;
        memoryEfficiency = 80;
    }

    return {
      baseMemory,
      auxiliaryMemory,
      totalMemory: baseMemory + auxiliaryMemory,
      memoryEfficiency
    };
  };

  // Algorithm Card Component
  const AlgorithmSection = ({ 
    title, 
    color, 
    algorithm, 
    setAlgorithm, 
    algorithmState, 
    onPlay, 
    onReset, 
    onStepForward, 
    onStepBack,
    algorithmNumber
  }: {
    title: string;
    color: string;
    algorithm: string;
    setAlgorithm: (value: string) => void;
    algorithmState: any;
    onPlay: () => void;
    onReset: () => void;
    onStepForward: () => void;
    onStepBack: () => void;
    algorithmNumber: number;
  }) => {
    const currentStep = algorithmState.steps[algorithmState.currentStep];
    const maxValue = Math.max(...inputArrayNumbers);
    const arrayLength = inputArrayNumbers.length;
    
    // Adjust bar width and spacing based on array size
    const getBarWidth = () => {
      if (arrayLength <= 10) return "24px";
      if (arrayLength <= 20) return "16px";
      if (arrayLength <= 30) return "12px";
      return "8px";
    };

    const getGap = () => {
      if (arrayLength <= 10) return "gap-1";
      if (arrayLength <= 20) return "gap-0.5";
      return "gap-px";
    };

    return (
      <div className="space-y-6">
        {/* Visualization and Step-by-Step Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization - Takes up 2 columns */}
          <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className={`text-${color}-400 text-lg`}>{algorithm}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                <div className={`h-full flex items-end justify-center ${getGap()} min-w-fit`}>
                  {(currentStep && algorithmState.currentStep > 0 ? currentStep.array : inputArrayNumbers).map((value, index) => {
                    let barColor = `bg-${color}-500`;
                    
                    if (currentStep) {
                      if (currentStep.activeIndices.includes(index)) {
                        barColor = 'bg-yellow-500';
                      } else if (currentStep.comparedIndices.includes(index)) {
                        barColor = 'bg-orange-500';
                      } else if (currentStep.swappedIndices.includes(index)) {
                        barColor = 'bg-green-500';
                      }
                    }

                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`${barColor} rounded-t transition-colors duration-300`}
                          style={{
                            height: `${(value / maxValue) * 180}px`,
                            width: getBarWidth()
                          }}
                        />
                        <div className="text-xs text-gray-400 mt-1" style={{ fontSize: arrayLength > 20 ? '10px' : '12px' }}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Explanation */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className={`text-${color}-400 text-lg`}>Step-by-Step Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className={`w-6 h-6 bg-${color}-600 rounded flex items-center justify-center text-xs`}>
                    {algorithmState.currentStep + 1}
                  </div>
                  <div className="text-sm text-gray-300">
                    {currentStep ? currentStep.description : "Click play to start"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-blue-900/30 rounded p-2 text-center">
                    <div className="text-xs text-blue-400">Comparisons</div>
                    <div className="text-lg font-bold text-blue-400">
                      {currentStep ? currentStep.comparisons : 0}
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded p-2 text-center">
                    <div className="text-xs text-purple-400">Swaps</div>
                    <div className="text-lg font-bold text-purple-400">
                      {currentStep ? currentStep.swaps : 0}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-gray-400 mb-1">Progress</div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                      style={{
                        width: `${((algorithmState.currentStep) / Math.max(algorithmState.steps.length - 1, 1)) * 100}%`
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round(((algorithmState.currentStep) / Math.max(algorithmState.steps.length - 1, 1)) * 100)}% Complete
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Select Algorithm and Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className={`text-${color}-400 text-lg`}>Algorithm Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Select Algorithm</label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 max-h-80">
                    {/* Sorting Algorithms */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      Sorting
                    </div>
                    <SelectItem value="Bubble Sort" className="text-white pl-4">Bubble Sort</SelectItem>
                    <SelectItem value="Selection Sort" className="text-white pl-4">Selection Sort</SelectItem>
                    <SelectItem value="Insertion Sort" className="text-white pl-4">Insertion Sort</SelectItem>
                    <SelectItem value="Merge Sort" className="text-white pl-4">Merge Sort</SelectItem>
                    <SelectItem value="Quick Sort" className="text-white pl-4">Quick Sort</SelectItem>
                    <SelectItem value="Heap Sort" className="text-white pl-4">Heap Sort</SelectItem>
                    <SelectItem value="Shell Sort" className="text-white pl-4">Shell Sort</SelectItem>
                    <SelectItem value="Counting Sort" className="text-white pl-4">Counting Sort</SelectItem>
                    <SelectItem value="Radix Sort" className="text-white pl-4">Radix Sort</SelectItem>
                    <SelectItem value="Bucket Sort" className="text-white pl-4">Bucket Sort</SelectItem>
                    
                    {/* Searching Algorithms */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider mt-2">
                      Searching
                    </div>
                    <SelectItem value="Linear Search" className="text-white pl-4">Linear Search</SelectItem>
                    <SelectItem value="Binary Search" className="text-white pl-4">Binary Search</SelectItem>
                    
                    {/* Graph Algorithms */}
                    <div className="px-2 py-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider mt-2">
                      Graph
                    </div>
                    <SelectItem value="Breadth-First Search" className="text-white pl-4">Breadth-First Search</SelectItem>
                    <SelectItem value="Depth-First Search" className="text-white pl-4">Depth-First Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    className={`bg-${color}-600 hover:bg-${color}-700 flex-1`}
                    onClick={onPlay}
                  >        
                    {algorithmState.isRunning ? (
                      <Pause className="w-4 h-4 mr-1" />
                    ) : (
                      <Play className="w-4 h-4 mr-1" />
                    )}
                    {algorithmState.isRunning ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-700 flex-1"
                    onClick={onReset}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 flex-1"
                    onClick={onStepBack}
                    disabled={algorithmState.currentStep === 0}
                  >
                    <StepBack className="w-4 h-4 mr-1" />
                    Step Back
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 flex-1"
                    onClick={onStepForward}
                    disabled={algorithmState.currentStep >= algorithmState.steps.length - 1}
                  >
                    <StepForward className="w-4 h-4 mr-1" />
                    Step Forward
                  </Button>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Step {algorithmState.currentStep + 1} of {algorithmState.steps.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-[length:200%_200%] animate-gradient mb-4">
              ALGORITHM COMPARISON
            </h1>
            <p className="text-xl text-gray-300">
              Compare two algorithms side-by-side to understand their differences
            </p>
          </div>

          {/* Top Section - Input Data, Global Controls, Performance Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Input Data */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400 text-lg">Input Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Array (comma-separated)</label>
                  <Input
                    value={inputArray}
                    onChange={(e) => setInputArray(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="64, 34, 25, 12, 22, 11, 90"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Generate Random Array</label>
                  <div className="flex gap-2">
                    <Input
                      value={arraySize}
                      onChange={(e) => setArraySize(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white w-20"
                      placeholder="10"
                    />
                    <Button
                      variant="outline"
                      className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                      onClick={generateRandomArray}
                    >
                      Random
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Global Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-green-400 text-lg">Global Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sync-speed" 
                    checked={synchronizedSpeed}
                    onCheckedChange={handleSynchronizedSpeedChange}
                  />
                  <label htmlFor="sync-speed" className="text-sm text-gray-300">
                    Synchronized Speed
                  </label>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Speed Control</label>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400">
                      Speed: {speed[0] < 33 ? 'Slow' : speed[0] < 66 ? 'Normal' : 'Fast'}
                    </div>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={initializeAlgorithms}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    Initialize
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Comparison */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-purple-400 text-lg">Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div></div>
                  <div className="text-center text-blue-400">Algorithm A</div>
                  <div className="text-center text-purple-400">Algorithm B</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-gray-400">Comparisons</div>
                  <div className="text-center text-yellow-400">
                    {currentStep1 ? currentStep1.comparisons : 0}
                  </div>
                  <div className="text-center text-yellow-400">
                    {currentStep2 ? currentStep2.comparisons : 0}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-gray-400">Swaps</div>
                  <div className="text-center text-yellow-400">
                    {currentStep1 ? currentStep1.swaps : 0}
                  </div>
                  <div className="text-center text-yellow-400">
                    {currentStep2 ? currentStep2.swaps : 0}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-gray-400">Total Steps</div>
                  <div className="text-center text-yellow-400">{algo1State.stats.totalSteps}</div>
                  <div className="text-center text-yellow-400">{algo2State.stats.totalSteps}</div>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-gray-400 mb-2">Progress</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-900/30 rounded p-2 text-center">
                      <div className="text-xs text-blue-400">Algorithm A</div>
                      <div className="text-lg font-bold text-blue-400">
                        {Math.round(((algo1State.currentStep) / Math.max(algo1State.steps.length - 1, 1)) * 100)}%
                      </div>
                    </div>
                    <div className="bg-purple-900/30 rounded p-2 text-center">
                      <div className="text-xs text-purple-400">Algorithm B</div>
                      <div className="text-lg font-bold text-purple-400">
                        {Math.round(((algo2State.currentStep) / Math.max(algo2State.steps.length - 1, 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Time Complexity: O(n²) vs O(n²)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Algorithm A Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">Algorithm A</h2>
            <AlgorithmSection
              title="Algorithm A"
              color="blue"
              algorithm={algorithm1}
              setAlgorithm={setAlgorithm1}
              algorithmState={algo1State}
              onPlay={() => playAlgorithm(1)}
              onReset={() => resetAlgorithm(1)}
              onStepForward={() => stepForward(1)}
              onStepBack={() => stepBack(1)}
              algorithmNumber={1}
            />
          </div>

          {/* VS Divider */}
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-400">VS</div>
          </div>

          {/* Algorithm B Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 text-center mb-4">Algorithm B</h2>
            <AlgorithmSection
              title="Algorithm B"
              color="purple"
              algorithm={algorithm2}
              setAlgorithm={setAlgorithm2}
              algorithmState={algo2State}
              onPlay={() => playAlgorithm(2)}
              onReset={() => resetAlgorithm(2)}
              onStepForward={() => stepForward(2)}
              onStepBack={() => stepBack(2)}
              algorithmNumber={2}
            />
          </div>

          {/* Enhanced Performance Analysis Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
                Performance Analysis
              </h2>
              <p className="text-gray-400">
                Detailed comparison and complexity analysis
              </p>
            </div>

            {/* Performance Metrics */}
            <PerformanceMetrics
              algorithm1={{
                name: algorithm1,
                comparisons: currentStep1?.comparisons || 0,
                swaps: currentStep1?.swaps || 0,
                executionTime: algo1State.currentStep * (2000 - speed[0] * 19), // Simulated execution time
                memoryUsage: inputArrayNumbers.length * 4, // Simulated memory usage
                steps: algo1State.steps.length,
                efficiency: Math.max(0, 100 - (currentStep1?.comparisons || 0) / inputArrayNumbers.length)
              }}
              algorithm2={{
                name: algorithm2,
                comparisons: currentStep2?.comparisons || 0,
                swaps: currentStep2?.swaps || 0,
                executionTime: algo2State.currentStep * (2000 - speed[0] * 19), // Simulated execution time
                memoryUsage: inputArrayNumbers.length * 4, // Simulated memory usage
                steps: algo2State.steps.length,
                efficiency: Math.max(0, 100 - (currentStep2?.comparisons || 0) / inputArrayNumbers.length)
              }}
              inputSize={inputArrayNumbers.length}
            />

            {/* Time Complexity Chart */}
            <TimeComplexityChart
              algorithm1={{
                algorithm: algorithm1,
                complexity: getAlgorithmComplexity(algorithm1),
                color: 'blue',
                description: getAlgorithmDescription(algorithm1)
              }}
              algorithm2={{
                algorithm: algorithm2,
                complexity: getAlgorithmComplexity(algorithm2),
                color: 'purple',
                description: getAlgorithmDescription(algorithm2)
              }}
              currentInputSize={inputArrayNumbers.length}
            />

            {/* Memory Usage Tracking */}
            <MemoryUsageTracker
              algorithm1={{
                algorithmName: algorithm1,
                ...calculateMemoryUsage(algorithm1, inputArrayNumbers.length),
                spaceComplexity: getAlgorithmSpaceComplexity(algorithm1),
                color: 'blue'
              }}
              algorithm2={{
                algorithmName: algorithm2,
                ...calculateMemoryUsage(algorithm2, inputArrayNumbers.length),
                spaceComplexity: getAlgorithmSpaceComplexity(algorithm2),
                color: 'purple'
              }}
              inputSize={inputArrayNumbers.length}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Compare;

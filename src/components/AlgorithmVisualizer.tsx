
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
// Removed Select components - using custom dropdown instead
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AnimatedVisualization } from "@/components/enhanced/AnimatedVisualization";
import { SpeedControl } from "@/components/ui/enhanced-controls/SpeedControl";
import { DataInputManager } from "@/components/ui/enhanced-controls/DataInputManager";

import { useGlobalKeyboardShortcuts, createAlgorithmShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useFavoriteAlgorithms } from "@/hooks/useFavoriteAlgorithms";
import { Play, Pause, RotateCcw, SkipBack, SkipForward, BarChart3, Circle, TrendingUp, Keyboard, Heart } from "lucide-react";

interface VisualizationStep {
  array: number[];
  activeIndices: number[];
  comparedIndices: number[];
  description: string;
}

const AlgorithmVisualizer = () => {
  const [algorithm, setAlgorithm] = useState("bubble");
  const [inputArray, setInputArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [arraySize, setArraySize] = useState("7");
  const [speed, setSpeed] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [visualizationType, setVisualizationType] = useState<'bars' | 'dots' | 'lines'>('bars');
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
  // Removed isSelectOpen - using custom dropdown instead
  const [isCustomDropdownOpen, setIsCustomDropdownOpen] = useState(false);

  // Favorites functionality
  const { favorites, toggleFavorite, isFavorite } = useFavoriteAlgorithms();

  const algorithms = {
    // Sorting Algorithms
    bubble: "Bubble Sort",
    selection: "Selection Sort", 
    insertion: "Insertion Sort",
    merge: "Merge Sort",
    quick: "Quick Sort",
    heap: "Heap Sort",
    shell: "Shell Sort",
    counting: "Counting Sort",
    radix: "Radix Sort",
    bucket: "Bucket Sort",
    // Searching Algorithms
    linear: "Linear Search",
    binary: "Binary Search",
    // Graph Algorithms
    bfs: "Breadth-First Search",
    dfs: "Depth-First Search"
  };

  const algorithmInfo = {
    bubble: {
      description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      timeComplexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)"
      },
      spaceComplexity: "O(1)",
      pseudocode: [
        "for i = 0 to n-2:",
        "  for j = 0 to n-2-i:",
        "    if arr[j] > arr[j+1]:",
        "      swap arr[j] and arr[j+1]",
        "return arr"
      ]
    },
    selection: {
      description: "Selection Sort finds the minimum element and places it at the beginning, then repeats for the remaining elements.",
      timeComplexity: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)"
      },
      spaceComplexity: "O(1)",
      pseudocode: [
        "for i = 0 to n-1:",
        "  min_idx = i",
        "  for j = i+1 to n:",
        "    if arr[j] < arr[min_idx]:",
        "      min_idx = j",
        "  swap arr[i] and arr[min_idx]"
      ]
    },
    insertion: {
      description: "Insertion Sort builds the sorted array one element at a time by inserting each element into its correct position.",
      timeComplexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)"
      },
      spaceComplexity: "O(1)",
      pseudocode: [
        "for i = 1 to n:",
        "  key = arr[i]",
        "  j = i - 1",
        "  while j >= 0 and arr[j] > key:",
        "    arr[j+1] = arr[j]",
        "    j = j - 1",
        "  arr[j+1] = key"
      ]
    },
    quick: {
      description: "Quick Sort uses divide-and-conquer to partition the array around a pivot and recursively sort the partitions.",
      timeComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)"
      },
      spaceComplexity: "O(log n)",
      pseudocode: [
        "function quickSort(arr, low, high):",
        "  if low < high:",
        "    pi = partition(arr, low, high)",
        "    quickSort(arr, low, pi-1)",
        "    quickSort(arr, pi+1, high)"
      ]
    },
    merge: {
      description: "Merge Sort divides the array into halves, sorts them recursively, and merges the sorted halves.",
      timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      spaceComplexity: "O(n)",
      pseudocode: ["function mergeSort(arr):", "  if arr.length <= 1: return arr", "  divide arr into left and right", "  return merge(mergeSort(left), mergeSort(right))"]
    },
    heap: {
      description: "Heap Sort builds a max heap and repeatedly extracts the maximum element.",
      timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      spaceComplexity: "O(1)",
      pseudocode: ["buildMaxHeap(arr)", "for i = n-1 to 1:", "  swap arr[0] and arr[i]", "  heapify(arr, 0, i)"]
    },
    shell: {
      description: "Shell Sort is an optimization of insertion sort that allows exchanges of far apart elements.",
      timeComplexity: { best: "O(n log n)", average: "O(n^1.25)", worst: "O(n²)" },
      spaceComplexity: "O(1)",
      pseudocode: ["gap = n/2", "while gap > 0:", "  for i = gap to n:", "    insertionSort with gap", "  gap = gap/2"]
    },
    counting: {
      description: "Counting Sort counts occurrences of each element and uses this information to place elements in sorted order.",
      timeComplexity: { best: "O(n+k)", average: "O(n+k)", worst: "O(n+k)" },
      spaceComplexity: "O(k)",
      pseudocode: ["count occurrences of each element", "calculate cumulative counts", "place elements in sorted order"]
    },
    radix: {
      description: "Radix Sort sorts numbers digit by digit, starting from the least significant digit.",
      timeComplexity: { best: "O(nk)", average: "O(nk)", worst: "O(nk)" },
      spaceComplexity: "O(n+k)",
      pseudocode: ["for each digit position:", "  use counting sort on current digit", "repeat until all digits processed"]
    },
    bucket: {
      description: "Bucket Sort distributes elements into buckets, sorts each bucket, and concatenates the results.",
      timeComplexity: { best: "O(n+k)", average: "O(n+k)", worst: "O(n²)" },
      spaceComplexity: "O(n)",
      pseudocode: ["create empty buckets", "distribute elements into buckets", "sort each bucket", "concatenate buckets"]
    },
    linear: {
      description: "Linear Search checks each element sequentially until the target is found or the list ends.",
      timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
      spaceComplexity: "O(1)",
      pseudocode: ["for i = 0 to n-1:", "  if arr[i] == target:", "    return i", "return -1"]
    },
    binary: {
      description: "Binary Search repeatedly divides the sorted array in half to find the target element.",
      timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
      spaceComplexity: "O(1)",
      pseudocode: ["left = 0, right = n-1", "while left <= right:", "  mid = (left + right) / 2", "  if arr[mid] == target: return mid", "  else if arr[mid] < target: left = mid + 1", "  else: right = mid - 1"]
    },
    bfs: {
      description: "Breadth-First Search explores all vertices at the current depth before moving to vertices at the next depth.",
      timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
      spaceComplexity: "O(V)",
      pseudocode: ["create queue and add start vertex", "while queue not empty:", "  vertex = queue.dequeue()", "  visit vertex", "  add unvisited neighbors to queue"]
    },
    dfs: {
      description: "Depth-First Search explores as far as possible along each branch before backtracking.",
      timeComplexity: { best: "O(V+E)", average: "O(V+E)", worst: "O(V+E)" },
      spaceComplexity: "O(V)",
      pseudocode: ["function dfs(vertex):", "  mark vertex as visited", "  for each neighbor:", "    if not visited: dfs(neighbor)"]
    }
  };

  const generateSteps = useCallback((arr: number[], algoType: string) => {
    const result: VisualizationStep[] = [];
    let comparisons = 0;
    let swaps = 0;
    
    // Validate inputs
    if (!arr || arr.length === 0) {
      return [{
        array: [],
        activeIndices: [],
        comparedIndices: [],
        description: 'No data to process'
      }];
    }
    
    if (!algoType || !algorithms[algoType as keyof typeof algorithms]) {
      return [{
        array: [...arr],
        activeIndices: [],
        comparedIndices: [],
        description: 'Unknown algorithm selected'
      }];
    }
    
    const array = [...arr];
    
    // Add initial state
    result.push({ array: [...array], activeIndices: [], comparedIndices: [], description: `Starting ${algorithms[algoType as keyof typeof algorithms]}` });
    
    if (algoType === "bubble") {
      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          comparisons++;
          result.push({
            array: [...array],
            activeIndices: [j, j + 1],
            comparedIndices: [],
            description: `Comparing elements at positions ${j} and ${j + 1}`
          });
          
          if (array[j] > array[j + 1]) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            swaps++;
            result.push({
              array: [...array],
              activeIndices: [],
              comparedIndices: [j, j + 1],
              description: `Swapped ${array[j + 1]} and ${array[j]}`
            });
          }
        }
      }
    } else if (algoType === "selection") {
      for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        result.push({
          array: [...array],
          activeIndices: [i],
          comparedIndices: [],
          description: `Finding minimum element from position ${i}`
        });
        
        for (let j = i + 1; j < array.length; j++) {
          comparisons++;
          result.push({
            array: [...array],
            activeIndices: [minIdx, j],
            comparedIndices: [],
            description: `Comparing ${array[minIdx]} with ${array[j]}`
          });
          
          if (array[j] < array[minIdx]) {
            minIdx = j;
          }
        }
        
        if (minIdx !== i) {
          [array[i], array[minIdx]] = [array[minIdx], array[i]];
          swaps++;
          result.push({
            array: [...array],
            activeIndices: [],
            comparedIndices: [i, minIdx],
            description: `Swapped ${array[minIdx]} and ${array[i]}`
          });
        }
      }
    } else if (algoType === "insertion") {
      for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        result.push({
          array: [...array],
          activeIndices: [i],
          comparedIndices: [],
          description: `Inserting ${key} into sorted portion`
        });
        
        while (j >= 0 && array[j] > key) {
          comparisons++;
          result.push({
            array: [...array],
            activeIndices: [j, j + 1],
            comparedIndices: [],
            description: `Comparing ${array[j]} with ${key}`
          });
          
          array[j + 1] = array[j];
          swaps++;
          result.push({
            array: [...array],
            activeIndices: [],
            comparedIndices: [j, j + 1],
            description: `Shifted ${array[j]} to the right`
          });
          j--;
        }
        array[j + 1] = key;
      }
    } else {
      // For algorithms not yet implemented, show a simple demonstration
      const sortedArray = [...array].sort((a, b) => a - b);
      for (let i = 0; i < array.length; i++) {
        result.push({
          array: [...array],
          activeIndices: [i],
          comparedIndices: [],
          description: `Processing element at position ${i}`
        });
        comparisons++;
      }
      
      // Show final sorted state
      result.push({
        array: sortedArray,
        activeIndices: [],
        comparedIndices: [],
        description: `${algorithms[algoType as keyof typeof algorithms]} completed!`
      });
    }
    
    // Add completion step if not already added
    if (result[result.length - 1].description.indexOf("completed") === -1) {
      result.push({ 
        array: [...array], 
        activeIndices: [], 
        comparedIndices: [], 
        description: `${algorithms[algoType as keyof typeof algorithms]} completed!` 
      });
    }
    
    setStats({ comparisons, swaps });
    return result;
  }, []);

  useEffect(() => {
    const generateAlgorithmSteps = async () => {
      setIsGeneratingSteps(true);
      try {
        // Add a small delay to prevent UI blocking
        await new Promise(resolve => setTimeout(resolve, 10));
        const newSteps = generateSteps(inputArray, algorithm);
        setSteps(newSteps);
        setCurrentStep(0);
        setIsPlaying(false);
      } catch (error) {
        console.error('Error generating algorithm steps:', error);
        // Fallback to prevent blank screen
        setSteps([{
          array: [...inputArray],
          activeIndices: [],
          comparedIndices: [],
          description: `Ready to start ${algorithms[algorithm as keyof typeof algorithms] || 'Unknown Algorithm'}`
        }]);
        setCurrentStep(0);
        setIsPlaying(false);
      } finally {
        setIsGeneratingSteps(false);
      }
    };

    generateAlgorithmSteps();
  }, [inputArray, algorithm, generateSteps]);

  // Custom dropdown doesn't need special background handling

  // Monitor for DOM changes that might affect background
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Ensure body always has the correct background
      const body = document.body;
      const html = document.documentElement;
      
      if (body.style.background !== '' && body.style.background !== 'var(--gradient-hero)') {
        body.style.background = '';
        body.style.removeProperty('background-color');
      }
      
      if (html.style.background !== '' && html.style.background !== 'var(--gradient-hero)') {
        html.style.background = '';
        html.style.removeProperty('background-color');
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isCustomDropdownOpen && !target.closest('.relative')) {
        setIsCustomDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCustomDropdownOpen]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000 - speed * 19);
      
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleStepBack = () => setCurrentStep(Math.max(0, currentStep - 1));
  const handleStepForward = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));

  const generateRandomArray = () => {
    const size = parseInt(arraySize) || 7;
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
    setInputArray(newArray);
  };

  const currentVisualization = steps[currentStep] || { array: inputArray, activeIndices: [], comparedIndices: [], description: "Ready to start" };
  const maxValue = Math.max(...inputArray);
  const currentAlgorithmInfo = algorithmInfo[algorithm as keyof typeof algorithmInfo];

  // Speed preset functions
  const setSpeedSlow = () => setSpeed(25);
  const setSpeedNormal = () => setSpeed(50);
  const setSpeedFast = () => setSpeed(75);
  const setSpeedVeryFast = () => setSpeed(100);

  const toggleVisualization = () => {
    const types: ('bars' | 'dots' | 'lines')[] = ['bars', 'dots', 'lines'];
    const currentIndex = types.indexOf(visualizationType);
    const nextIndex = (currentIndex + 1) % types.length;
    setVisualizationType(types[nextIndex]);
  };

  // Keyboard shortcuts
  const shortcuts = createAlgorithmShortcuts({
    playPause: handlePlay,
    reset: handleReset,
    stepForward: handleStepForward,
    stepBack: handleStepBack,
    setSpeedSlow,
    setSpeedNormal,
    setSpeedFast,
    setSpeedVeryFast,
    toggleVisualization,
  });

  useGlobalKeyboardShortcuts(shortcuts);

  return (
    <div className="space-y-6 algorithm-visualizer-container">
      {/* Top Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 section-gap">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-400">Select Algorithm</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(algorithm)}
                className={`transition-colors ${
                  isFavorite(algorithm) 
                    ? 'text-red-400 hover:text-red-300' 
                    : 'text-gray-400 hover:text-red-400'
                }`}
                title={isFavorite(algorithm) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite(algorithm) ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                onClick={() => setIsCustomDropdownOpen(!isCustomDropdownOpen)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-left text-white hover:bg-slate-600 transition-colors flex items-center justify-between"
              >
                <span>{algorithms[algorithm as keyof typeof algorithms]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCustomDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCustomDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto algorithm-dropdown dropdown-menu">
                  {/* Favorites Section */}
                  {favorites.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current" />
                        Favorites
                      </div>
                      {favorites.map((favAlgo) => (
                        <button
                          key={`fav-${favAlgo}`}
                          onClick={() => {
                            setAlgorithm(favAlgo);
                            setIsCustomDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-white hover:bg-slate-700 bg-red-900/10 flex items-center gap-2 transition-colors duration-200 border-b border-slate-700/50 last:border-b-0"
                        >
                          <Heart className="w-3 h-3 fill-current text-red-400" />
                          {algorithms[favAlgo as keyof typeof algorithms]}
                        </button>
                      ))}
                      <div className="border-t border-slate-700 my-1" />
                    </>
                  )}
                  
                  {/* Sorting Algorithms */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    Sorting
                  </div>
                  {['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'shell', 'counting', 'radix', 'bucket'].map((algo) => (
                    <button
                      key={algo}
                      onClick={() => {
                        setAlgorithm(algo);
                        setIsCustomDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-slate-700 flex items-center justify-between"
                    >
                      <span>{algorithms[algo as keyof typeof algorithms]}</span>
                      {isFavorite(algo) && <Heart className="w-3 h-3 fill-current text-red-400" />}
                    </button>
                  ))}
                  
                  {/* Searching Algorithms */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-green-400 uppercase tracking-wider border-t border-slate-700 mt-1">
                    Searching
                  </div>
                  {['linear', 'binary'].map((algo) => (
                    <button
                      key={algo}
                      onClick={() => {
                        setAlgorithm(algo);
                        setIsCustomDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-slate-700 flex items-center justify-between"
                    >
                      <span>{algorithms[algo as keyof typeof algorithms]}</span>
                      {isFavorite(algo) && <Heart className="w-3 h-3 fill-current text-red-400" />}
                    </button>
                  ))}
                  
                  {/* Graph Algorithms */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider border-t border-slate-700 mt-1">
                    Graph
                  </div>
                  {['bfs', 'dfs'].map((algo) => (
                    <button
                      key={algo}
                      onClick={() => {
                        setAlgorithm(algo);
                        setIsCustomDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-slate-700 flex items-center justify-between"
                    >
                      <span>{algorithms[algo as keyof typeof algorithms]}</span>
                      {isFavorite(algo) && <Heart className="w-3 h-3 fill-current text-red-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <DataInputManager
            onDataChange={setInputArray}
            currentData={inputArray}
            maxArraySize={50}
          />
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Visualization & Speed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-300">Visualization Type</div>
              <div className="flex space-x-2">
                <Button
                  variant={visualizationType === 'bars' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisualizationType('bars')}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Bars
                </Button>
                <Button
                  variant={visualizationType === 'dots' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisualizationType('dots')}
                  className="flex-1"
                >
                  <Circle className="w-4 h-4 mr-1" />
                  Dots
                </Button>
                <Button
                  variant={visualizationType === 'lines' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVisualizationType('lines')}
                  className="flex-1"
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Lines
                </Button>
              </div>
            </div>
            <SpeedControl
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Visualization and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Visualization - Takes up 3 columns */}
        <Card className="lg:col-span-3 bg-slate-800/50 border-slate-700">
          <CardHeader className="border-b-0 pb-2">
            <CardTitle className="text-blue-400">{algorithms[algorithm as keyof typeof algorithms]}</CardTitle>
          </CardHeader>
          <CardContent>
            {isGeneratingSteps ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
                  <p className="text-gray-300">Generating algorithm steps...</p>
                </div>
              </div>
            ) : (
              <div className="h-80 w-full visualization-container">
                <AnimatedVisualization
                  data={currentVisualization.array}
                  activeIndices={currentVisualization.activeIndices}
                  comparedIndices={currentVisualization.comparedIndices}
                  visualizationType={visualizationType}
                  animationSpeed={2000 - speed * 19}
                  showGrid={true}
                  showLabels={true}
                  className="animated-visualization"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step-by-Step Explanation - 1 column */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Step-by-Step</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2 min-h-[60px] step-description">
              <span className="text-sm mt-0.5">📖</span>
              <span className="text-sm text-gray-300 leading-relaxed">
                {currentStep === 0 ? "Select an algorithm and click play to start" : currentVisualization.description}
              </span>
            </div>
            <div className="text-sm text-gray-400 min-h-[20px]">Step {currentStep + 1} of {steps.length}</div>
            
            <div className="space-y-2 stats-container">
              <div className="flex justify-between items-center min-h-[32px]">
                <span className="text-blue-400">COMPARISONS</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400 stat-badge">{stats.comparisons}</Badge>
              </div>
              <div className="flex justify-between items-center min-h-[32px]">
                <span className="text-purple-400">SWAPS</span>
                <Badge variant="outline" className="text-purple-400 border-purple-400 stat-badge">{stats.swaps}</Badge>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 pt-4 border-t border-slate-700 control-panel">
              <Button 
                onClick={handlePlay}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <div className="button-group step-controls">
                <Button 
                  onClick={handleStepBack}
                  variant="outline"
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                  disabled={currentStep === 0}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleStepForward}
                  variant="outline"
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                  disabled={currentStep >= steps.length - 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Keyboard Shortcuts Help */}
              <div className="pt-2 border-t border-slate-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Keyboard Shortcuts (?)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Complexity Analysis and Pseudocode */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complexity Analysis */}
        <Card className="bg-slate-800/50 border-slate-700" data-tutorial="complexity-analysis">
          <CardHeader>
            <CardTitle className="text-purple-400">Complexity Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-300 p-3 bg-slate-900/50 rounded">
              {currentAlgorithmInfo.description}
            </div>
            
            <div className="space-y-3">
              <div className="text-blue-400 font-semibold">TIME COMPLEXITY</div>
              
              <div className="flex justify-between items-center p-3 bg-green-900/20 rounded border border-green-800 transition-smooth hover:bg-green-900/30 hover:scale-[1.02] cursor-help group">
                <span className="text-green-400">Best Case:</span>
                <span className="text-green-400 font-mono group-hover:font-bold transition-all">{currentAlgorithmInfo.timeComplexity.best}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-900/20 rounded border border-yellow-800 transition-smooth hover:bg-yellow-900/30 hover:scale-[1.02] cursor-help group">
                <span className="text-yellow-400">Average Case:</span>
                <span className="text-yellow-400 font-mono group-hover:font-bold transition-all">{currentAlgorithmInfo.timeComplexity.average}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-900/20 rounded border border-red-800 transition-smooth hover:bg-red-900/30 hover:scale-[1.02] cursor-help group">
                <span className="text-red-400">Worst Case:</span>
                <span className="text-red-400 font-mono group-hover:font-bold transition-all">{currentAlgorithmInfo.timeComplexity.worst}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-blue-400 font-semibold">SPACE COMPLEXITY</div>
              <div className="p-3 bg-blue-900/30 rounded">
                <span className="text-blue-400 font-mono text-lg">{currentAlgorithmInfo.spaceComplexity}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div><strong>Big O Guide:</strong></div>
              <div>O(1) - Constant • O(log n) - Logarithmic</div>
              <div>O(n) - Linear • O(n log n) - Linearithmic</div>
              <div>O(n²) - Quadratic • O(2ⁿ) - Exponential</div>
            </div>
          </CardContent>
        </Card>

        {/* Pseudocode */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-green-400">Pseudocode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 rounded p-4 font-mono text-sm">
              {currentAlgorithmInfo.pseudocode.map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 w-6 text-right mr-4">{index + 1}</span>
                  <span className="text-gray-300">{line}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-4 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-400">Currently executing line</span>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default AlgorithmVisualizer;

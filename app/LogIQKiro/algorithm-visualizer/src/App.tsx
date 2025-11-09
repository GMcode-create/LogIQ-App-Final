import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { VisualizationCanvas } from './components/VisualizationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { DataInput } from './components/DataInput';
import { AlgorithmRegistry } from './algorithms/AlgorithmRegistry';
import { BubbleSort } from './algorithms/BubbleSort';
import { InsertionSort } from './algorithms/InsertionSort';
import { SelectionSort } from './algorithms/SelectionSort';
import type { Algorithm, AlgorithmStep, AlgorithmMetadata } from './types/algorithm';

// Register algorithms
const registry = AlgorithmRegistry.getInstance();
registry.register(new BubbleSort(), {
  name: 'Bubble Sort',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  category: 'Sorting',
  complexity: {
    time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)'
  },
  pseudocode: [
    'procedure bubbleSort(A: list of sortable items)',
    '  n = length(A)',
    '  for i = 0 to n-2',
    '    for j = 0 to n-i-2',
    '      if A[j] > A[j+1]',
    '        swap(A[j], A[j+1])',
    '      end if',
    '    end for',
    '  end for',
    'end procedure'
  ]
});

registry.register(new InsertionSort(), {
  name: 'Insertion Sort',
  description: 'A sorting algorithm that builds the final sorted array one item at a time by inserting each element into its correct position.',
  category: 'Sorting',
  complexity: {
    time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)'
  },
  pseudocode: [
    'procedure insertionSort(A: list of sortable items)',
    '  n = length(A)',
    '  for i = 1 to n-1',
    '    key = A[i]',
    '    j = i - 1',
    '    while j >= 0 and A[j] > key',
    '      A[j+1] = A[j]',
    '      j = j - 1',
    '    end while',
    '    A[j+1] = key',
    '  end for',
    'end procedure'
  ]
});

registry.register(new SelectionSort(), {
  name: 'Selection Sort',
  description: 'A sorting algorithm that finds the minimum element and places it at the beginning, then repeats for the remaining unsorted portion.',
  category: 'Sorting',
  complexity: {
    time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)'
  },
  pseudocode: [
    'procedure selectionSort(A: list of sortable items)',
    '  n = length(A)',
    '  for i = 0 to n-2',
    '    minIndex = i',
    '    for j = i+1 to n-1',
    '      if A[j] < A[minIndex]',
    '        minIndex = j',
    '      end if',
    '    end for',
    '    if minIndex != i',
    '      swap(A[i], A[minIndex])',
    '    end if',
    '  end for',
    'end procedure'
  ]
});

function App() {
  const [data, setData] = useState<number[]>([38, 27, 43, 3, 9, 82, 10]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [selectedAlgorithmName, setSelectedAlgorithmName] = useState<string>('');
  const [algorithmMetadata, setAlgorithmMetadata] = useState<AlgorithmMetadata | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(5);
  const [playIntervalId, setPlayIntervalId] = useState<number | null>(null);

  // Load initial algorithm
  useEffect(() => {
    const algorithmNames = registry.getAlgorithmNames();
    if (algorithmNames.length > 0) {
      handleAlgorithmChange(algorithmNames[0]);
    }
  }, []);

  // Handle algorithm execution
  useEffect(() => {
    if (selectedAlgorithm) {
      const validationResult = selectedAlgorithm.validate(data);
      if (validationResult.isValid) {
        const newSteps = selectedAlgorithm.execute(data);
        setSteps(newSteps);
        setCurrentStepIndex(0);
      } else {
        console.error('Validation errors:', validationResult.errors);
        setSteps([]);
        setCurrentStepIndex(0);
      }
    }
  }, [selectedAlgorithm, data]);

  // Handle play/pause logic
  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 1100 - speed * 100; // 100ms to 1000ms based on speed (1-10)
      const id = window.setInterval(() => {
        setCurrentStepIndex(prevIndex => {
          if (prevIndex >= steps.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, intervalTime);
      setPlayIntervalId(id);
    } else if (playIntervalId !== null) {
      clearInterval(playIntervalId);
      setPlayIntervalId(null);
    }

    return () => {
      if (playIntervalId !== null) {
        clearInterval(playIntervalId);
      }
    };
  }, [isPlaying, speed, steps.length]);

  const handleAlgorithmChange = useCallback((algorithmName: string) => {
    const algorithm = registry.getAlgorithm(algorithmName);
    const metadata = registry.getMetadata(algorithmName);

    if (algorithm && metadata) {
      setSelectedAlgorithm(algorithm);
      setSelectedAlgorithmName(algorithmName);
      setAlgorithmMetadata(metadata);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setIsPlaying(true);
    }
  }, [currentStepIndex, steps.length]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleStepForward = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    }
  }, [currentStepIndex]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleDataChange = useCallback((newData: number[]) => {
    setData(newData);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  return (
    <div className="app-container max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Algorithm Visualizer</h1>
        <p className="text-gray-600">
          Visualize and understand sorting algorithms step by step
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Select Algorithm</h2>
            <select
              value={selectedAlgorithmName}
              onChange={(e) => handleAlgorithmChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {registry.getAlgorithmNames().map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {algorithmMetadata && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-800">{algorithmMetadata.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{algorithmMetadata.description}</p>

                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Time Complexity:</h4>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>Best: {algorithmMetadata.complexity.time.best}</li>
                    <li>Average: {algorithmMetadata.complexity.time.average}</li>
                    <li>Worst: {algorithmMetadata.complexity.time.worst}</li>
                  </ul>
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Space Complexity:</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {algorithmMetadata.complexity.space}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DataInput onDataChange={handleDataChange} currentData={data} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <VisualizationCanvas
            data={steps.length > 0 && currentStepIndex < steps.length
              ? steps[currentStepIndex].data
              : data}
            currentStep={steps.length > 0 && currentStepIndex < steps.length
              ? steps[currentStepIndex]
              : undefined}
            width={800}
            height={400}
          />

          <ControlPanel
            isPlaying={isPlaying}
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            speed={speed}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onSpeedChange={handleSpeedChange}
          />

          {algorithmMetadata && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Pseudocode</h3>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                {algorithmMetadata.pseudocode.map((line, index) => (
                  <div
                    key={index}
                    className={`${steps.length > 0 &&
                      currentStepIndex < steps.length &&
                      steps[currentStepIndex].pseudocodeLine === index + 1
                      ? 'bg-yellow-200'
                      : ''
                      } px-2 py-0.5`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
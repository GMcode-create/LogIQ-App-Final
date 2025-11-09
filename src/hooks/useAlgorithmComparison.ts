
import { useState, useCallback, useEffect } from 'react';

export interface AlgorithmStep {
  array: number[];
  activeIndices: number[];
  comparedIndices: number[];
  swappedIndices: number[];
  description: string;
  comparisons: number;
  swaps: number;
}

export interface AlgorithmState {
  steps: AlgorithmStep[];
  currentStep: number;
  isRunning: boolean;
  stats: {
    comparisons: number;
    swaps: number;
    totalSteps: number;
  };
}

export const useAlgorithmComparison = () => {
  const [algorithm1, setAlgorithm1] = useState("Bubble Sort");
  const [algorithm2, setAlgorithm2] = useState("Selection Sort");
  const [inputArray, setInputArray] = useState("64, 34, 25, 12, 22, 11, 90");
  const [arraySize, setArraySize] = useState("10");
  const [speed, setSpeed] = useState([50]);
  const [synchronizedSpeed, setSynchronizedSpeed] = useState(true);
  
  const [algo1State, setAlgo1State] = useState<AlgorithmState>({
    steps: [],
    currentStep: 0,
    isRunning: false,
    stats: { comparisons: 0, swaps: 0, totalSteps: 0 }
  });
  
  const [algo2State, setAlgo2State] = useState<AlgorithmState>({
    steps: [],
    currentStep: 0,
    isRunning: false,
    stats: { comparisons: 0, swaps: 0, totalSteps: 0 }
  });

  const parseArray = useCallback((arrayString: string): number[] => {
    return arrayString.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }, []);

  const generateRandomArray = useCallback(() => {
    const size = parseInt(arraySize) || 10;
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setInputArray(randomArray.join(', '));
  }, [arraySize]);

  const generateBubbleSortSteps = useCallback((arr: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Starting Bubble Sort",
      comparisons,
      swaps
    });

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        comparisons++;
        steps.push({
          array: [...array],
          activeIndices: [j, j + 1],
          comparedIndices: [],
          swappedIndices: [],
          description: `Comparing ${array[j]} and ${array[j + 1]}`,
          comparisons,
          swaps
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swaps++;
          steps.push({
            array: [...array],
            activeIndices: [],
            comparedIndices: [],
            swappedIndices: [j, j + 1],
            description: `Swapped ${array[j]} and ${array[j + 1]}`,
            comparisons,
            swaps
          });
        }
      }
    }

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Bubble Sort completed!",
      comparisons,
      swaps
    });

    return steps;
  }, []);

  const generateSelectionSortSteps = useCallback((arr: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Starting Selection Sort",
      comparisons,
      swaps
    });

    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      
      steps.push({
        array: [...array],
        activeIndices: [i],
        comparedIndices: [],
        swappedIndices: [],
        description: `Finding minimum from position ${i}`,
        comparisons,
        swaps
      });

      for (let j = i + 1; j < array.length; j++) {
        comparisons++;
        steps.push({
          array: [...array],
          activeIndices: [i, j, minIndex],
          comparedIndices: [j, minIndex],
          swappedIndices: [],
          description: `Comparing ${array[j]} with current minimum ${array[minIndex]}`,
          comparisons,
          swaps
        });

        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        swaps++;
        steps.push({
          array: [...array],
          activeIndices: [],
          comparedIndices: [],
          swappedIndices: [i, minIndex],
          description: `Swapped ${array[minIndex]} with ${array[i]}`,
          comparisons,
          swaps
        });
      }
    }

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Selection Sort completed!",
      comparisons,
      swaps
    });

    return steps;
  }, []);

  const generateInsertionSortSteps = useCallback((arr: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Starting Insertion Sort",
      comparisons,
      swaps
    });

    for (let i = 1; i < array.length; i++) {
      let key = array[i];
      let j = i - 1;

      steps.push({
        array: [...array],
        activeIndices: [i],
        comparedIndices: [],
        swappedIndices: [],
        description: `Inserting ${key} into sorted portion`,
        comparisons,
        swaps
      });

      while (j >= 0 && array[j] > key) {
        comparisons++;
        steps.push({
          array: [...array],
          activeIndices: [i],
          comparedIndices: [j, j + 1],
          swappedIndices: [],
          description: `Comparing ${array[j]} with ${key}`,
          comparisons,
          swaps
        });

        array[j + 1] = array[j];
        swaps++;
        j--;

        steps.push({
          array: [...array],
          activeIndices: [j + 2],
          comparedIndices: [],
          swappedIndices: [j + 1, j + 2],
          description: `Shifting ${array[j + 2]} to the right`,
          comparisons,
          swaps
        });
      }
      
      if (j >= 0) {
        comparisons++;
      }
      
      array[j + 1] = key;
    }

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Insertion Sort completed!",
      comparisons,
      swaps
    });

    return steps;
  }, []);

  const generateQuickSortSteps = useCallback((arr: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Starting Quick Sort",
      comparisons,
      swaps
    });

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    const partition = (low: number, high: number): number => {
      const pivot = array[high];
      let i = low - 1;

      steps.push({
        array: [...array],
        activeIndices: [high],
        comparedIndices: [],
        swappedIndices: [],
        description: `Pivot selected: ${pivot}`,
        comparisons,
        swaps
      });

      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({
          array: [...array],
          activeIndices: [high],
          comparedIndices: [j],
          swappedIndices: [],
          description: `Comparing ${array[j]} with pivot ${pivot}`,
          comparisons,
          swaps
        });

        if (array[j] < pivot) {
          i++;
          if (i !== j) {
            [array[i], array[j]] = [array[j], array[i]];
            swaps++;
            steps.push({
              array: [...array],
              activeIndices: [high],
              comparedIndices: [],
              swappedIndices: [i, j],
              description: `Swapped ${array[i]} and ${array[j]}`,
              comparisons,
              swaps
            });
          }
        }
      }

      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      swaps++;
      steps.push({
        array: [...array],
        activeIndices: [],
        comparedIndices: [],
        swappedIndices: [i + 1, high],
        description: `Placed pivot ${pivot} in correct position`,
        comparisons,
        swaps
      });

      return i + 1;
    };

    quickSort(0, array.length - 1);

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Quick Sort completed!",
      comparisons,
      swaps
    });

    return steps;
  }, []);

  const generateMergeSortSteps = useCallback((arr: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const array = [...arr];
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Starting Merge Sort",
      comparisons,
      swaps
    });

    const mergeSort = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        steps.push({
          array: [...array],
          activeIndices: Array.from({length: right - left + 1}, (_, i) => left + i),
          comparedIndices: [],
          swappedIndices: [],
          description: `Dividing array from ${left} to ${right}`,
          comparisons,
          swaps
        });

        mergeSort(left, mid);
        mergeSort(mid + 1, right);
        merge(left, mid, right);
      }
    };

    const merge = (left: number, mid: number, right: number) => {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        comparisons++;
        steps.push({
          array: [...array],
          activeIndices: [k],
          comparedIndices: [left + i, mid + 1 + j],
          swappedIndices: [],
          description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
          comparisons,
          swaps
        });

        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }
        k++;
        swaps++;

        steps.push({
          array: [...array],
          activeIndices: [],
          comparedIndices: [],
          swappedIndices: [k - 1],
          description: `Merged ${array[k - 1]} into position`,
          comparisons,
          swaps
        });
      }

      while (i < leftArr.length) {
        array[k] = leftArr[i];
        i++;
        k++;
        swaps++;
      }

      while (j < rightArr.length) {
        array[k] = rightArr[j];
        j++;
        k++;
        swaps++;
      }
    };

    mergeSort(0, array.length - 1);

    steps.push({
      array: [...array],
      activeIndices: [],
      comparedIndices: [],
      swappedIndices: [],
      description: "Merge Sort completed!",
      comparisons,
      swaps
    });

    return steps;
  }, []);

  const generateSteps = useCallback((algorithm: string, arr: number[]): AlgorithmStep[] => {
    switch (algorithm) {
      case "Bubble Sort":
        return generateBubbleSortSteps(arr);
      case "Selection Sort":
        return generateSelectionSortSteps(arr);
      case "Insertion Sort":
        return generateInsertionSortSteps(arr);
      case "Quick Sort":
        return generateQuickSortSteps(arr);
      case "Merge Sort":
        return generateMergeSortSteps(arr);
      default:
        // Return a simple default for unsupported algorithms
        return [{
          array: [...arr],
          activeIndices: [],
          comparedIndices: [],
          swappedIndices: [],
          description: `${algorithm} visualization not yet implemented`,
          comparisons: 0,
          swaps: 0
        }];
    }
  }, [generateBubbleSortSteps, generateSelectionSortSteps, generateInsertionSortSteps, generateQuickSortSteps, generateMergeSortSteps]);

  const initializeAlgorithms = useCallback(() => {
    const array = parseArray(inputArray);
    const steps1 = generateSteps(algorithm1, array);
    const steps2 = generateSteps(algorithm2, array);

    setAlgo1State({
      steps: steps1,
      currentStep: 0,
      isRunning: false,
      stats: {
        comparisons: steps1[steps1.length - 1]?.comparisons || 0,
        swaps: steps1[steps1.length - 1]?.swaps || 0,
        totalSteps: steps1.length - 1
      }
    });

    setAlgo2State({
      steps: steps2,
      currentStep: 0,
      isRunning: false,
      stats: {
        comparisons: steps2[steps2.length - 1]?.comparisons || 0,
        swaps: steps2[steps2.length - 1]?.swaps || 0,
        totalSteps: steps2.length - 1
      }
    });
  }, [inputArray, algorithm1, algorithm2, parseArray, generateSteps]);

  const playAlgorithm = useCallback((algorithmNumber: 1 | 2) => {
    if (algorithmNumber === 1) {
      setAlgo1State(prev => ({ ...prev, isRunning: !prev.isRunning }));
    } else {
      setAlgo2State(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }
  }, []);

  const resetAlgorithm = useCallback((algorithmNumber: 1 | 2) => {
    if (algorithmNumber === 1) {
      setAlgo1State(prev => ({ ...prev, currentStep: 0, isRunning: false }));
    } else {
      setAlgo2State(prev => ({ ...prev, currentStep: 0, isRunning: false }));
    }
  }, []);

  const stepForward = useCallback((algorithmNumber: 1 | 2) => {
    if (algorithmNumber === 1) {
      setAlgo1State(prev => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1)
      }));
    } else {
      setAlgo2State(prev => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1)
      }));
    }
  }, []);

  const stepBack = useCallback((algorithmNumber: 1 | 2) => {
    if (algorithmNumber === 1) {
      setAlgo1State(prev => ({
        ...prev,
        currentStep: Math.max(prev.currentStep - 1, 0)
      }));
    } else {
      setAlgo2State(prev => ({
        ...prev,
        currentStep: Math.max(prev.currentStep - 1, 0)
      }));
    }
  }, []);

  // Auto-step when playing
  useEffect(() => {
    if (algo1State.isRunning && algo1State.currentStep < algo1State.steps.length - 1) {
      const timer = setTimeout(() => {
        setAlgo1State(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      }, 2000 - speed[0] * 19);
      return () => clearTimeout(timer);
    } else if (algo1State.currentStep >= algo1State.steps.length - 1) {
      setAlgo1State(prev => ({ ...prev, isRunning: false }));
    }
  }, [algo1State.isRunning, algo1State.currentStep, algo1State.steps.length, speed]);

  useEffect(() => {
    if (algo2State.isRunning && algo2State.currentStep < algo2State.steps.length - 1) {
      const timer = setTimeout(() => {
        setAlgo2State(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      }, 2000 - speed[0] * 19);
      return () => clearTimeout(timer);
    } else if (algo2State.currentStep >= algo2State.steps.length - 1) {
      setAlgo2State(prev => ({ ...prev, isRunning: false }));
    }
  }, [algo2State.isRunning, algo2State.currentStep, algo2State.steps.length, speed]);

  return {
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
  };
};

import { BaseAlgorithm } from './BaseAlgorithm';
import type { AlgorithmStep } from '../types/algorithm';

export class InsertionSort extends BaseAlgorithm {
  name = 'Insertion Sort';
  description = 'A sorting algorithm that builds the final sorted array one item at a time by inserting each element into its correct position.';
  complexity = {
    time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)'
  };

  execute(data: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const arr = [...data];
    const n = arr.length;
    let stepId = 0;
    let totalComparisons = 0;
    let totalSwaps = 0;

    steps.push(this.createStep(
      stepId++,
      'Starting Insertion Sort - Initial array',
      arr,
      [],
      [],
      [],
      1,
      { comparisons: totalComparisons, swaps: totalSwaps }
    ));

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push(this.createStep(
        stepId++,
        `Inserting element ${key} from position ${i} into sorted portion`,
        arr,
        [],
        [],
        [i],
        2,
        { comparisons: totalComparisons, swaps: totalSwaps }
      ));

      while (j >= 0 && arr[j] > key) {
        totalComparisons++;
        
        steps.push(this.createStep(
          stepId++,
          `Comparing ${arr[j]} at position ${j} with key ${key}`,
          arr,
          [j],
          [],
          [j, i],
          3,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));

        arr[j + 1] = arr[j];
        totalSwaps++;
        
        steps.push(this.createStep(
          stepId++,
          `Moving ${arr[j]} one position right`,
          arr,
          [],
          [j, j + 1],
          [j + 1],
          4,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));

        j--;
      }

      if (j >= 0) {
        totalComparisons++;
        steps.push(this.createStep(
          stepId++,
          `${arr[j]} <= ${key}, found correct position`,
          arr,
          [j],
          [],
          [j + 1],
          3,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));
      }

      arr[j + 1] = key;
      
      steps.push(this.createStep(
        stepId++,
        `Inserting ${key} at position ${j + 1}`,
        arr,
        [],
        [],
        [j + 1],
        5,
        { comparisons: totalComparisons, swaps: totalSwaps }
      ));
    }

    steps.push(this.createStep(
      stepId++,
      'Insertion Sort completed - Array is now sorted',
      arr,
      [],
      [],
      Array.from({ length: arr.length }, (_, i) => i),
      6,
      { comparisons: totalComparisons, swaps: totalSwaps }
    ));

    return steps;
  }
}
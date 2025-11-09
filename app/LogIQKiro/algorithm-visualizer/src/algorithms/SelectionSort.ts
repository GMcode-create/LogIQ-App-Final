import { BaseAlgorithm } from './BaseAlgorithm';
import type { AlgorithmStep } from '../types/algorithm';

export class SelectionSort extends BaseAlgorithm {
  name = 'Selection Sort';
  description = 'A sorting algorithm that finds the minimum element and places it at the beginning, then repeats for the remaining unsorted portion.';
  complexity = {
    time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
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
      'Starting Selection Sort - Initial array',
      arr,
      [],
      [],
      [],
      1,
      { comparisons: totalComparisons, swaps: totalSwaps }
    ));

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      steps.push(this.createStep(
        stepId++,
        `Finding minimum element in unsorted portion (from index ${i})`,
        arr,
        [],
        [],
        [i],
        2,
        { comparisons: totalComparisons, swaps: totalSwaps }
      ));

      for (let j = i + 1; j < n; j++) {
        totalComparisons++;
        
        steps.push(this.createStep(
          stepId++,
          `Comparing ${arr[j]} at index ${j} with current minimum ${arr[minIndex]} at index ${minIndex}`,
          arr,
          [j, minIndex],
          [],
          [j, minIndex],
          3,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
          steps.push(this.createStep(
            stepId++,
            `New minimum found: ${arr[minIndex]} at index ${minIndex}`,
            arr,
            [],
            [],
            [minIndex],
            4,
            { comparisons: totalComparisons, swaps: totalSwaps }
          ));
        }
      }

      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        totalSwaps++;
        
        steps.push(this.createStep(
          stepId++,
          `Swapping minimum element ${arr[i]} to position ${i}`,
          arr,
          [],
          [i, minIndex],
          [i],
          5,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));
      } else {
        steps.push(this.createStep(
          stepId++,
          `Minimum element ${arr[i]} is already in correct position ${i}`,
          arr,
          [],
          [],
          [i],
          5,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));
      }
    }

    steps.push(this.createStep(
      stepId++,
      'Selection Sort completed - Array is now sorted',
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
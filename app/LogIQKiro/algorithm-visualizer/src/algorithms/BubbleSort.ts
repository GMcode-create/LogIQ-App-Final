import { BaseAlgorithm } from './BaseAlgorithm';
import type { AlgorithmStep } from '../types/algorithm';

export class BubbleSort extends BaseAlgorithm {
  name = 'Bubble Sort';
  description = 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.';
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

    // Initial state
    steps.push(this.createStep(
      stepId++,
      'Starting Bubble Sort - Initial array',
      arr,
      [],
      [],
      [],
      1,
      { comparisons: totalComparisons, swaps: totalSwaps }
    ));

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      
      steps.push(this.createStep(
        stepId++,
        `Pass ${i + 1}: Starting new pass through the array`,
        arr,
        [],
        [],
        [],
        2,
        { comparisons: totalComparisons, swaps: totalSwaps }
      ));

      for (let j = 0; j < n - i - 1; j++) {
        totalComparisons++;
        
        // Compare adjacent elements
        steps.push(this.createStep(
          stepId++,
          `Comparing elements at positions ${j} and ${j + 1}: ${arr[j]} vs ${arr[j + 1]}`,
          arr,
          [j, j + 1],
          [],
          [j, j + 1],
          3,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          totalSwaps++;
          swapped = true;

          steps.push(this.createStep(
            stepId++,
            `Swapping ${arr[j + 1]} and ${arr[j]} (positions ${j} and ${j + 1})`,
            arr,
            [],
            [j, j + 1],
            [j, j + 1],
            4,
            { comparisons: totalComparisons, swaps: totalSwaps }
          ));
        }
      }

      if (!swapped) {
        steps.push(this.createStep(
          stepId++,
          'No swaps made in this pass - array is sorted!',
          arr,
          [],
          [],
          [],
          5,
          { comparisons: totalComparisons, swaps: totalSwaps }
        ));
        break;
      }
    }

    // Final state
    steps.push(this.createStep(
      stepId++,
      'Bubble Sort completed - Array is now sorted',
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
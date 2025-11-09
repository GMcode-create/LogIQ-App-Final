import type { Algorithm, AlgorithmStep, ValidationResult, StepMetrics } from '../types/algorithm';

export abstract class BaseAlgorithm implements Algorithm {
  abstract name: string;
  abstract description: string;
  abstract complexity: {
    time: { best: string; average: string; worst: string };
    space: string;
  };

  abstract execute(data: number[]): AlgorithmStep[];

  validate(data: number[]): ValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Input must be an array');
    }

    if (data.length === 0) {
      errors.push('Array cannot be empty');
    }

    if (data.length > 1000) {
      errors.push('Array size cannot exceed 1000 elements');
    }

    if (!data.every(item => typeof item === 'number' && !isNaN(item))) {
      errors.push('All elements must be valid numbers');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  protected createStep(
    id: number,
    description: string,
    data: number[],
    comparisons: number[] = [],
    swaps: number[] = [],
    highlights: number[] = [],
    pseudocodeLine: number = 0,
    metrics: Partial<StepMetrics> = {}
  ): AlgorithmStep {
    return {
      id,
      description,
      data: [...data],
      comparisons,
      swaps,
      highlights,
      pseudocodeLine,
      metrics: {
        comparisons: metrics.comparisons || 0,
        swaps: metrics.swaps || 0,
        arrayAccesses: metrics.arrayAccesses || 0,
        timeComplexity: metrics.timeComplexity || 'O(n²)'
      }
    };
  }
}
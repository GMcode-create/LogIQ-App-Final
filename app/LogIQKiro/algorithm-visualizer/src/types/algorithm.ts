export interface Algorithm {
  name: string;
  description: string;
  complexity: {
    time: { best: string; average: string; worst: string };
    space: string;
  };
  execute(data: number[]): AlgorithmStep[];
  validate(data: number[]): ValidationResult;
}

export interface AlgorithmStep {
  id: number;
  description: string;
  data: number[];
  comparisons: number[];
  swaps: number[];
  highlights: number[];
  pseudocodeLine: number;
  metrics: StepMetrics;
}

export interface StepMetrics {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  timeComplexity: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface VisualizationState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  data: number[];
  algorithm: Algorithm | null;
  steps: AlgorithmStep[];
}

export interface AlgorithmMetadata {
  name: string;
  description: string;
  category: string;
  complexity: {
    time: { best: string; average: string; worst: string };
    space: string;
  };
  pseudocode: string[];
}
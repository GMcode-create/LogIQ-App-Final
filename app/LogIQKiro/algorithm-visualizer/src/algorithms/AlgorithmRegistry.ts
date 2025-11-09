import type { Algorithm, AlgorithmMetadata } from '../types/algorithm';

export class AlgorithmRegistry {
  private static instance: AlgorithmRegistry;
  private algorithms: Map<string, Algorithm> = new Map();
  private metadata: Map<string, AlgorithmMetadata> = new Map();

  private constructor() {}

  static getInstance(): AlgorithmRegistry {
    if (!AlgorithmRegistry.instance) {
      AlgorithmRegistry.instance = new AlgorithmRegistry();
    }
    return AlgorithmRegistry.instance;
  }

  register(algorithm: Algorithm, metadata: AlgorithmMetadata): void {
    this.algorithms.set(algorithm.name, algorithm);
    this.metadata.set(algorithm.name, metadata);
  }

  getAlgorithm(name: string): Algorithm | undefined {
    return this.algorithms.get(name);
  }

  getMetadata(name: string): AlgorithmMetadata | undefined {
    return this.metadata.get(name);
  }

  getAllAlgorithms(): Algorithm[] {
    return Array.from(this.algorithms.values());
  }

  getAllMetadata(): AlgorithmMetadata[] {
    return Array.from(this.metadata.values());
  }

  getAlgorithmNames(): string[] {
    return Array.from(this.algorithms.keys());
  }
}
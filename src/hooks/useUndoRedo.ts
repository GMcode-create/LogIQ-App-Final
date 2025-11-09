import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
}

export const useUndoRedo = <T>(
  initialValue: T,
  options: UseUndoRedoOptions = {}
) => {
  const { maxHistorySize = 50, debounceMs = 500 } = options;
  
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const currentValue = history[currentIndex];

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const addToHistory = useCallback((value: T) => {
    // Clear any pending debounced updates
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        // Remove any future history if we're not at the end
        const newHistory = prev.slice(0, currentIndex + 1);
        
        // Add the new value
        newHistory.push(value);
        
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          setCurrentIndex(prev => Math.max(0, prev - 1));
        } else {
          setCurrentIndex(newHistory.length - 1);
        }
        
        return newHistory;
      });
    }, debounceMs);
  }, [currentIndex, maxHistorySize, debounceMs]);

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canRedo]);

  const reset = useCallback((newInitialValue?: T) => {
    const resetValue = newInitialValue ?? initialValue;
    setHistory([resetValue]);
    setCurrentIndex(0);
  }, [initialValue]);

  const setValue = useCallback((value: T) => {
    // If the value is different from current, add to history
    if (JSON.stringify(value) !== JSON.stringify(currentValue)) {
      addToHistory(value);
    }
  }, [currentValue, addToHistory]);

  return {
    value: currentValue,
    setValue,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historySize: history.length,
    currentIndex,
  };
};
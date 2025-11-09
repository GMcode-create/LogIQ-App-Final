import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

interface ShortcutDefinition {
  key: string;
  description: string;
  category: string;
  action: () => void;
}



export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcuts,
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when user is typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const ctrlKey = event.ctrlKey || event.metaKey;
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;

      // Create a key combination string
      let keyCombo = '';
      if (ctrlKey) keyCombo += 'ctrl+';
      if (shiftKey) keyCombo += 'shift+';
      if (altKey) keyCombo += 'alt+';
      keyCombo += key;

      // Check for exact matches first
      if (shortcuts[keyCombo]) {
        if (preventDefault) {
          event.preventDefault();
        }
        shortcuts[keyCombo]();
        return;
      }

      // Check for simple key matches
      if (shortcuts[key]) {
        if (preventDefault) {
          event.preventDefault();
        }
        shortcuts[key]();
        return;
      }
    },
    [shortcuts, enabled, preventDefault]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);
};

// Hook for managing global shortcuts
export const useGlobalKeyboardShortcuts = (
  shortcuts: ShortcutDefinition[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  // Create shortcuts object for useKeyboardShortcuts
  const shortcutActions = shortcuts.reduce((acc, shortcut) => {
    acc[shortcut.key] = shortcut.action;
    return acc;
  }, {} as KeyboardShortcuts);

  useKeyboardShortcuts(shortcutActions, options);
};

// Predefined shortcut combinations for common actions
export const createAlgorithmShortcuts = (actions: {
  playPause?: () => void;
  reset?: () => void;
  stepForward?: () => void;
  stepBack?: () => void;
  setSpeedSlow?: () => void;
  setSpeedNormal?: () => void;
  setSpeedFast?: () => void;
  setSpeedVeryFast?: () => void;
  toggleVisualization?: () => void;
}): ShortcutDefinition[] => {
  const shortcuts: ShortcutDefinition[] = [];

  if (actions.playPause) {
    shortcuts.push({
      key: ' ',
      description: 'Play/Pause algorithm execution',
      category: 'Playback Controls',
      action: actions.playPause
    });
  }

  if (actions.reset) {
    shortcuts.push({
      key: 'r',
      description: 'Reset algorithm to initial state',
      category: 'Playback Controls',
      action: actions.reset
    });
  }

  if (actions.stepForward) {
    shortcuts.push({
      key: 'arrowright',
      description: 'Step forward one iteration',
      category: 'Playback Controls',
      action: actions.stepForward
    });
  }

  if (actions.stepBack) {
    shortcuts.push({
      key: 'arrowleft',
      description: 'Step backward one iteration',
      category: 'Playback Controls',
      action: actions.stepBack
    });
  }

  // Speed presets
  if (actions.setSpeedSlow) {
    shortcuts.push({
      key: '1',
      description: 'Set speed to Slow',
      category: 'Speed Control',
      action: actions.setSpeedSlow
    });
  }

  if (actions.setSpeedNormal) {
    shortcuts.push({
      key: '2',
      description: 'Set speed to Normal',
      category: 'Speed Control',
      action: actions.setSpeedNormal
    });
  }

  if (actions.setSpeedFast) {
    shortcuts.push({
      key: '3',
      description: 'Set speed to Fast',
      category: 'Speed Control',
      action: actions.setSpeedFast
    });
  }

  if (actions.setSpeedVeryFast) {
    shortcuts.push({
      key: '4',
      description: 'Set speed to Very Fast',
      category: 'Speed Control',
      action: actions.setSpeedVeryFast
    });
  }

  if (actions.toggleVisualization) {
    shortcuts.push({
      key: 'v',
      description: 'Toggle visualization type',
      category: 'Visualization',
      action: actions.toggleVisualization
    });
  }



  return shortcuts;
};

// Navigation shortcuts
export const createNavigationShortcuts = (actions: {
  goToHome?: () => void;
  goToCompare?: () => void;
  goToCustom?: () => void;
}): ShortcutDefinition[] => {
  const shortcuts: ShortcutDefinition[] = [];

  if (actions.goToHome) {
    shortcuts.push({
      key: 'ctrl+1',
      description: 'Go to Algorithm Visualizer',
      category: 'Navigation',
      action: actions.goToHome
    });
  }

  if (actions.goToCompare) {
    shortcuts.push({
      key: 'ctrl+2',
      description: 'Go to Algorithm Comparison',
      category: 'Navigation',
      action: actions.goToCompare
    });
  }

  if (actions.goToCustom) {
    shortcuts.push({
      key: 'ctrl+3',
      description: 'Go to Custom Builder',
      category: 'Navigation',
      action: actions.goToCustom
    });
  }

  return shortcuts;
};
import React, { createContext, useContext, useState } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string;
}

export interface Tutorial {
  id: string;
  name: string;
  steps: TutorialStep[];
}

interface TutorialContextType {
  currentTutorial: Tutorial | null;
  currentStepIndex: number;
  isActive: boolean;
  startTutorial: (tutorial: Tutorial) => void;
  nextStep: () => void;
  previousStep: () => void;
  closeTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: React.ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const startTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial(tutorial);
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentTutorial && currentStepIndex < currentTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      closeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const closeTutorial = () => {
    setIsActive(false);
    setCurrentTutorial(null);
    setCurrentStepIndex(0);
  };

  const value: TutorialContextType = {
    currentTutorial,
    currentStepIndex,
    isActive,
    startTutorial,
    nextStep,
    previousStep,
    closeTutorial,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};
import React from 'react';
import { useTutorial } from '@/contexts/TutorialContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  BookOpen,
  CheckCircle
} from 'lucide-react';

const LeftTutorialPanel: React.FC = () => {
  const {
    currentTutorial,
    currentStepIndex,
    isActive,
    nextStep,
    previousStep,
    closeTutorial,
  } = useTutorial();

  if (!isActive || !currentTutorial || !currentTutorial.steps || currentTutorial.steps.length === 0) {
    return null;
  }

  // Ensure body background is preserved when tutorial is active
  React.useEffect(() => {
    if (isActive) {
      // Add tutorial-active class to body for styling
      document.body.classList.add('tutorial-active');
      
      return () => {
        // Cleanup on unmount
        document.body.classList.remove('tutorial-active');
      };
    }
  }, [isActive]);

  const currentStep = currentTutorial.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / currentTutorial.steps.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === currentTutorial.steps.length - 1;

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-80">
      <Card className="bg-slate-900/95 backdrop-blur-md border-slate-700 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-white text-lg">
                {currentTutorial.name}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeTutorial}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Step {currentStepIndex + 1} of {currentTutorial.steps.length}
              </span>
              <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                Tutorial
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step Content */}
          <div>
            <h3 className="text-white font-semibold mb-2">
              {currentStep.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {currentStep.content}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 space-y-3">
            {/* Navigation row */}
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                disabled={isFirstStep}
                className="border-slate-600 text-gray-300 hover:bg-slate-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                onClick={nextStep}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeftTutorialPanel;
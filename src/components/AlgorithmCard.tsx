
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";
import { AlgorithmState } from "@/hooks/useAlgorithmComparison";

interface AlgorithmCardProps {
  title: string;
  color: string;
  algorithm: string;
  setAlgorithm: (value: string) => void;
  algorithmState: AlgorithmState;
  onPlay: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  inputArray: number[];
}

const algorithms = [
  "Bubble Sort", "Selection Sort", "Quick Sort", "Merge Sort", "Heap Sort",
  "Binary Search", "Linear Search", "DFS", "BFS"
];

export const AlgorithmCard = ({
  title,
  color,
  algorithm,
  setAlgorithm,
  algorithmState,
  onPlay,
  onReset,
  onStepForward,
  onStepBack,
  inputArray
}: AlgorithmCardProps) => {
  const currentStep = algorithmState.steps[algorithmState.currentStep];
  const maxValue = Math.max(...inputArray);
  const arrayLength = inputArray.length;
  
  // Adjust bar width and spacing based on array size
  const getBarWidth = () => {
    if (arrayLength <= 10) return "24px";
    if (arrayLength <= 20) return "16px";
    if (arrayLength <= 30) return "12px";
    return "8px";
  };

  const getGap = () => {
    if (arrayLength <= 10) return "gap-1";
    if (arrayLength <= 20) return "gap-0.5";
    return "gap-px";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Select Algorithm */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className={`text-${color}-400 text-lg`}>Select Algorithm</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map((algo) => (
                <SelectItem key={algo} value={algo}>{algo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4">
            <div className={`text-lg font-semibold text-${color}-400 mb-2`}>Controls</div>
            <div className="flex gap-2 mb-3">
              <Button
                className={`bg-${color}-600 hover:bg-${color}-700 flex-1`}
                onClick={onPlay}
              >
                {algorithmState.isRunning ? (
                  <Pause className="w-4 h-4 mr-1" />
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                {algorithmState.isRunning ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 hover:bg-slate-700 flex-1"
                onClick={onReset}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 hover:bg-slate-700 flex-1"
                onClick={onStepBack}
                disabled={algorithmState.currentStep === 0}
              >
                <StepBack className="w-4 h-4 mr-1" />
                Step Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 hover:bg-slate-700 flex-1"
                onClick={onStepForward}
                disabled={algorithmState.currentStep >= algorithmState.steps.length - 1}
              >
                <StepForward className="w-4 h-4 mr-1" />
                Step Forward
              </Button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              Step {algorithmState.currentStep + 1} of {algorithmState.steps.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className={`text-${color}-400 text-lg`}>{algorithm}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
            <div className={`h-full flex items-end justify-center ${getGap()} min-w-fit`}>
              {currentStep ? currentStep.array.map((value, index) => {
                let barColor = `bg-${color}-500`;
                
                if (currentStep.activeIndices.includes(index)) {
                  barColor = 'bg-yellow-500';
                } else if (currentStep.comparedIndices.includes(index)) {
                  barColor = 'bg-orange-500';
                } else if (currentStep.swappedIndices.includes(index)) {
                  barColor = 'bg-green-500';
                }

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`${barColor} rounded-t transition-colors duration-300`}
                      style={{
                        height: `${(value / maxValue) * 120}px`,
                        width: getBarWidth()
                      }}
                    />
                    <div className="text-xs text-gray-400 mt-1" style={{ fontSize: arrayLength > 20 ? '10px' : '12px' }}>
                      {value}
                    </div>
                  </div>
                );
              }) : inputArray.map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`bg-${color}-500 rounded-t`}
                    style={{
                      height: `${(value / maxValue) * 120}px`,
                      width: getBarWidth()
                    }}
                  />
                  <div className="text-xs text-gray-400 mt-1" style={{ fontSize: arrayLength > 20 ? '10px' : '12px' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Explanation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className={`text-${color}-400 text-lg`}>Step-by-Step Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className={`w-6 h-6 bg-${color}-600 rounded flex items-center justify-center text-xs`}>
                {algorithmState.currentStep + 1}
              </div>
              <div className="text-sm text-gray-300">
                {currentStep ? currentStep.description : "Click play to start"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-blue-900/30 rounded p-2 text-center">
                <div className="text-xs text-blue-400">Comparisons</div>
                <div className="text-lg font-bold text-blue-400">
                  {currentStep ? currentStep.comparisons : 0}
                </div>
              </div>
              <div className="bg-purple-900/30 rounded p-2 text-center">
                <div className="text-xs text-purple-400">Swaps</div>
                <div className="text-lg font-bold text-purple-400">
                  {currentStep ? currentStep.swaps : 0}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-400 mb-1">Progress</div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{
                    width: `${((algorithmState.currentStep) / Math.max(algorithmState.steps.length - 1, 1)) * 100}%`
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(((algorithmState.currentStep) / Math.max(algorithmState.steps.length - 1, 1)) * 100)}% Complete
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

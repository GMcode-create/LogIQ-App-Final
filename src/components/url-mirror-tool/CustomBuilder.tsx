
import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Save, Download, Upload, Code2, Settings, Palette, AlertTriangle, RotateCcw, SkipBack, SkipForward, BookOpen, Undo, Redo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useGlobalKeyboardShortcuts, createNavigationShortcuts, createAlgorithmShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNavigate } from "react-router-dom";


interface ExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  steps?: any[];
}

const CustomBuilder = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [algorithmName, setAlgorithmName] = useState("");
  const initialCode = `function bubbleSort(arr) {
  const n = arr.length;
  let steps = [];
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        description: \`Comparing \${arr[j]} and \${arr[j + 1]}\`
      });
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          swapped: [j, j + 1],
          description: \`Swapped \${arr[j + 1]} and \${arr[j]}\`
        });
      }
    }
  }
  
  return { sortedArray: arr, steps };
}

// Test the algorithm
const testArray = [64, 34, 25, 12, 22, 11, 90];
return bubbleSort(testArray);`;

  // Undo/Redo functionality for code editor
  const {
    value: code,
    setValue: setCode,
    undo: undoCode,
    redo: redoCode,
    canUndo,
    canRedo,
  } = useUndoRedo(initialCode, { debounceMs: 1000 });
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(50);

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];

  const templates = [
    { 
      name: "Selection Sort", 
      code: `function selectionSort(arr) {
  const n = arr.length;
  let steps = [];
  
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      array: [...arr],
      comparing: [i],
      description: \`Finding minimum element from position \${i}\`
    });
    
    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [minIdx, j],
        description: \`Comparing \${arr[minIdx]} with \${arr[j]}\`
      });
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: [...arr],
        swapped: [i, minIdx],
        description: \`Swapped \${arr[minIdx]} and \${arr[i]}\`
      });
    }
  }
  
  return { sortedArray: arr, steps };
}

// Test the algorithm
const testArray = [64, 25, 12, 22, 11];
return selectionSort(testArray);` 
    },
    { 
      name: "Linear Search", 
      code: `function linearSearch(arr, target) {
  let steps = [];
  
  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      comparing: [i],
      description: \`Checking if \${arr[i]} equals \${target}\`
    });
    
    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        found: i,
        description: \`Found \${target} at index \${i}!\`
      });
      return { result: i, steps };
    }
  }
  
  steps.push({
    array: [...arr],
    description: \`\${target} not found in array\`
  });
  
  return { result: -1, steps };
}

// Test the algorithm
const testArray = [64, 34, 25, 12, 22, 11, 90];
const target = 22;
return linearSearch(testArray, target);` 
    },
    { 
      name: "Insertion Sort", 
      code: `function insertionSort(arr) {
  const n = arr.length;
  let steps = [];
  
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    steps.push({
      array: [...arr],
      comparing: [i],
      description: \`Inserting \${key} into sorted portion\`
    });
    
    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        description: \`Moving \${arr[j]} to the right\`
      });
      
      arr[j + 1] = arr[j];
      j--;
      
      steps.push({
        array: [...arr],
        swapped: [j + 1, j + 2],
        description: \`Shifted element to position \${j + 2}\`
      });
    }
    
    arr[j + 1] = key;
  }
  
  return { sortedArray: arr, steps };
}

// Test the algorithm
const testArray = [64, 34, 25, 12, 22, 11, 90];
return insertionSort(testArray);` 
    },
  ];

  const executeCode = (): ExecutionResult => {
    try {
      // Create a safe execution environment with console access for debugging
      const func = new Function('console', code);
      const mockConsole = {
        log: (...args: any[]) => console.log('[Algorithm]', ...args),
        error: (...args: any[]) => console.error('[Algorithm]', ...args),
        warn: (...args: any[]) => console.warn('[Algorithm]', ...args)
      };
      
      const result = func(mockConsole);
      
      // Check if result has steps for visualization
      if (result && result.steps && Array.isArray(result.steps)) {
        // Validate steps format
        const validSteps = result.steps.every(step => 
          step && typeof step === 'object' && 
          (step.array || step.description)
        );
        
        if (validSteps) {
          return {
            success: true,
            result: result,
            steps: result.steps
          };
        } else {
          return {
            success: false,
            error: "Invalid steps format. Each step should have 'array' and/or 'description' properties."
          };
        }
      } else if (result && Array.isArray(result)) {
        // Handle case where algorithm returns just an array
        return {
          success: true,
          result: result,
          steps: [{
            array: result,
            description: "Algorithm completed successfully",
            comparing: [],
            swapped: []
          }]
        };
      } else if (result) {
        // Handle other result types
        return {
          success: true,
          result: result,
          steps: [{
            description: `Result: ${JSON.stringify(result)}`,
            comparing: [],
            swapped: []
          }]
        };
      } else {
        return {
          success: false,
          error: "Algorithm returned no result. Make sure your function returns a value."
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setCurrentStep(0);

    // Execute the algorithm
    const result = executeCode();
    setExecutionResult(result);

    setTimeout(() => {
      setIsRunning(false);
    }, 1000);
  };

  const handleStepForward = () => {
    if (executionResult?.steps && currentStep < executionResult.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (executionResult?.steps && executionResult.steps.length > 0) {
      setIsPlaying(!isPlaying);
    } else {
      // If no steps exist, run the algorithm first
      handleRun();
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && executionResult?.steps && currentStep < executionResult.steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000 - speed * 19); // Speed control similar to main visualizer

      return () => clearTimeout(timer);
    } else if (currentStep >= (executionResult?.steps?.length || 0) - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, executionResult?.steps, speed]);

  // Auto-save functionality for logged-in users
  useEffect(() => {
    if (user) {
      // Load user's work when they log in or component mounts
      const loadUserWork = () => {
        try {
          const userWorkKey = `user_work_${user.id}`;
          const savedWork = localStorage.getItem(userWorkKey);
          
          if (savedWork) {
            const workData = JSON.parse(savedWork);
            setAlgorithmName(workData.algorithmName || "");
            setLanguage(workData.language || "javascript");
            setCode(workData.code || code);
            
            toast({
              title: "Work Restored",
              description: "Your previous work has been restored.",
            });
          }
        } catch (error) {
          console.error("Failed to load user work:", error);
        }
      };

      loadUserWork();
    }
  }, [user]); // Only run when user changes

  // Auto-save user's work every 30 seconds when logged in
  useEffect(() => {
    if (!user) return;

    const autoSave = () => {
      try {
        const userWorkKey = `user_work_${user.id}`;
        const workData = {
          algorithmName,
          language,
          code,
          lastSaved: new Date().toISOString(),
        };

        localStorage.setItem(userWorkKey, JSON.stringify(workData));
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    };

    // Save immediately when any field changes
    const timeoutId = setTimeout(autoSave, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [user, algorithmName, language, code]);

  // Save work when user logs out or page unloads
  useEffect(() => {
    if (!user) return;

    const saveOnUnload = () => {
      if (user) {
        try {
          const userWorkKey = `user_work_${user.id}`;
          const workData = {
            algorithmName,
            language,
            code,
            lastSaved: new Date().toISOString(),
          };
          localStorage.setItem(userWorkKey, JSON.stringify(workData));
        } catch (error) {
          console.error("Failed to save on unload:", error);
        }
      }
    };

    window.addEventListener('beforeunload', saveOnUnload);
    return () => window.removeEventListener('beforeunload', saveOnUnload);
  }, [user, algorithmName, language, code]);

  // Export functionality
  const handleExportCode = () => {
    try {
      const exportData = {
        name: algorithmName || "Untitled Algorithm",
        language: language,
        code: code,
        timestamp: new Date().toISOString(),
        version: "1.0"
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${algorithmName || 'algorithm'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Algorithm code has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export algorithm code.",
        variant: "destructive",
      });
    }
  };

  // Import functionality
  const handleImportCode = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast({
        title: "Invalid File Type",
        description: "Please select a JSON file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        // Validate imported data structure
        if (!importData.code) {
          throw new Error("Invalid file format: missing code property");
        }

        // Update state with imported data
        setAlgorithmName(importData.name || "Imported Algorithm");
        setLanguage(importData.language || "javascript");
        setCode(importData.code);
        
        // Reset execution state
        setExecutionResult(null);
        setCurrentStep(0);
        setIsPlaying(false);

        toast({
          title: "Import Successful",
          description: `Algorithm "${importData.name || 'Untitled'}" has been imported successfully.`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to parse the imported file. Please check the file format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Save project functionality (localStorage)
  const handleSaveProject = () => {
    try {
      const projectData = {
        name: algorithmName || "Untitled Algorithm",
        language: language,
        code: code,
        timestamp: new Date().toISOString(),
      };

      const savedProjects = JSON.parse(localStorage.getItem('savedAlgorithms') || '[]');
      const existingIndex = savedProjects.findIndex((p: any) => p.name === projectData.name);
      
      if (existingIndex >= 0) {
        savedProjects[existingIndex] = projectData;
      } else {
        savedProjects.push(projectData);
      }

      localStorage.setItem('savedAlgorithms', JSON.stringify(savedProjects));

      toast({
        title: "Project Saved",
        description: `Algorithm "${projectData.name}" has been saved locally.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the project.",
        variant: "destructive",
      });
    }
  };

  const navigate = useNavigate();

  // Navigation shortcuts
  const navigationShortcuts = createNavigationShortcuts({
    goToHome: () => navigate('/'),
    goToCompare: () => navigate('/compare'),
    goToCustom: () => navigate('/custom'),
  });

  // Algorithm control shortcuts
  const algorithmShortcuts = createAlgorithmShortcuts({
    playPause: handlePlay,
    reset: handleReset,
    stepForward: handleStepForward,
    stepBack: handleStepBack,
    setSpeedSlow: () => setSpeed(25),
    setSpeedNormal: () => setSpeed(50),
    setSpeedFast: () => setSpeed(75),
    setSpeedVeryFast: () => setSpeed(100),
  });

  // Editor shortcuts
  const editorShortcuts = [
    {
      key: 'ctrl+z',
      description: 'Undo code changes',
      category: 'Editor',
      action: undoCode
    },
    {
      key: 'ctrl+y',
      description: 'Redo code changes',
      category: 'Editor',
      action: redoCode
    },
    {
      key: 'ctrl+s',
      description: 'Save project',
      category: 'Editor',
      action: handleSaveProject
    },
    {
      key: 'ctrl+r',
      description: 'Run algorithm',
      category: 'Editor',
      action: handleRun
    }
  ];

  const allShortcuts = [...navigationShortcuts, ...algorithmShortcuts, ...editorShortcuts];
  useGlobalKeyboardShortcuts(allShortcuts);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <div className="pt-16"> {/* Added padding top to account for fixed nav */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-[length:200%_200%] animate-gradient mb-4">
              CUSTOM ALGORITHM BUILDER
            </h1>
            <p className="text-xl text-gray-300">
              Create and visualize your own algorithms with our interactive editor
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Algorithm Editor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                      <TabsTrigger value="editor">Editor</TabsTrigger>
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="editor" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Algorithm Name</Label>
                          <Input
                            id="name"
                            value={algorithmName}
                            onChange={(e) => setAlgorithmName(e.target.value)}
                            placeholder="My Custom Algorithm"
                            className="bg-slate-800 border-slate-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="code">Code Editor</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={undoCode}
                              disabled={!canUndo}
                              className="border-slate-600 hover:bg-slate-700"
                              title="Undo (Ctrl+Z)"
                            >
                              <Undo className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={redoCode}
                              disabled={!canRedo}
                              className="border-slate-600 hover:bg-slate-700"
                              title="Redo (Ctrl+Y)"
                            >
                              <Redo className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          id="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="min-h-[400px] font-mono text-sm bg-slate-900 border-slate-700 resize-none"
                          placeholder="Write your algorithm here..."
                        />
                      </div>

                      {/* Step-by-Step Explanation Panel */}
                      <Card className="bg-slate-800/30 border-slate-700">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                            <BookOpen className="w-5 h-5" />
                            Step-by-Step Explanation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {executionResult?.steps && executionResult.steps.length > 0 ? (
                            <>
                              {/* Step Indicators */}
                              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {executionResult.steps.map((_, index) => (
                                  <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${index === currentStep
                                        ? 'bg-blue-500 text-white'
                                        : index < currentStep
                                          ? 'bg-green-500 text-white'
                                          : 'bg-slate-700 text-gray-400'
                                      }`}
                                  >
                                    {index + 1}
                                  </div>
                                ))}
                              </div>

                              {/* Current Step Info */}
                              <div className="bg-slate-900/50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-white font-medium">
                                    Step {currentStep + 1} of {executionResult.steps.length}
                                  </h4>
                                  <div className="flex gap-2">
                                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                                      {executionResult.steps[currentStep]?.comparing ? 'Comparing' :
                                        executionResult.steps[currentStep]?.swapped ? 'Swapping' : 'Processing'}
                                    </Badge>
                                  </div>
                                </div>

                                {executionResult.steps[currentStep]?.description && (
                                  <p className="text-gray-300 text-sm mb-3">
                                    {executionResult.steps[currentStep].description}
                                  </p>
                                )}

                                {/* Statistics */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="bg-slate-800/50 rounded p-2">
                                    <div className="text-gray-400">Comparisons</div>
                                    <div className="text-yellow-400 font-medium">
                                      {executionResult.steps.slice(0, currentStep + 1).filter(step => step.comparing).length}
                                    </div>
                                  </div>
                                  <div className="bg-slate-800/50 rounded p-2">
                                    <div className="text-gray-400">Swaps</div>
                                    <div className="text-green-400 font-medium">
                                      {executionResult.steps.slice(0, currentStep + 1).filter(step => step.swapped).length}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Playback Controls */}
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleReset}
                                  className="border-slate-600 hover:bg-slate-700"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleStepBack}
                                  disabled={currentStep === 0}
                                  className="border-slate-600 hover:bg-slate-700"
                                >
                                  <SkipBack className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleStepForward}
                                  disabled={currentStep === executionResult.steps.length - 1}
                                  className="border-slate-600 hover:bg-slate-700"
                                >
                                  <SkipForward className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-8 text-gray-400">
                              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>Run your algorithm to see step-by-step explanations</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="templates" className="space-y-4">
                      <div className="grid gap-4">
                        {templates.map((template) => (
                          <Card key={template.name} className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
                            onClick={() => setCode(template.code)}>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                              <pre className="text-xs text-gray-400 bg-slate-900/50 p-2 rounded overflow-x-auto">
                                {template.code.substring(0, 100)}...
                              </pre>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>


                  </Tabs>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-pink-400 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Visualization Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900/70 rounded-lg p-6 min-h-[400px]">
                    {isRunning ? (
                      <div className="text-center">
                        <div className="grid grid-cols-8 gap-2 mb-4">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-16 bg-gradient-to-t from-pink-600 to-orange-400 rounded animate-pulse"
                              style={{
                                animationDelay: `${i * 0.1}s`,
                                height: `${Math.random() * 60 + 20}px`
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-400">Running algorithm...</p>
                      </div>
                    ) : executionResult ? (
                      <div className="space-y-4">
                        {executionResult.success ? (
                          <>
                            {/* Algorithm Visualization */}
                            <div className="h-48 bg-slate-800/50 rounded-lg p-4 overflow-x-auto">
                              {executionResult.steps && executionResult.steps.length > 0 && executionResult.steps[currentStep]?.array ? (
                                <div className="h-full flex items-end justify-center gap-1 min-w-fit">
                                  {executionResult.steps[currentStep].array.map((value: number, index: number) => {
                                    const currentStepData = executionResult.steps![currentStep];
                                    let barColor = 'bg-blue-500';

                                    if (currentStepData.comparing?.includes(index)) {
                                      barColor = 'bg-yellow-500';
                                    } else if (currentStepData.swapped?.includes(index)) {
                                      barColor = 'bg-green-500';
                                    } else if (currentStepData.found === index) {
                                      barColor = 'bg-purple-500';
                                    }

                                    const maxValue = Math.max(...executionResult.steps![currentStep].array);
                                    const arrayLength = executionResult.steps![currentStep].array.length;

                                    return (
                                      <div key={index} className="flex flex-col items-center">
                                        <div
                                          className={`${barColor} rounded-t transition-colors duration-300`}
                                          style={{
                                            height: `${(value / maxValue) * 140}px`,
                                            width: arrayLength > 15 ? '16px' : arrayLength > 10 ? '20px' : '24px'
                                          }}
                                        />
                                        <div className="text-xs text-gray-400 mt-1" style={{ fontSize: arrayLength > 20 ? '10px' : '12px' }}>
                                          {value}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-lg font-semibold text-green-400 mb-2">✓ Algorithm Executed Successfully</div>
                                    <div className="text-sm text-gray-400">
                                      Result: {JSON.stringify(executionResult.result, null, 2)}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Step Controls */}
                            {executionResult.steps && executionResult.steps.length > 0 && (
                              <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleStepBack}
                                    disabled={currentStep === 0}
                                    className="border-slate-600 hover:bg-slate-700"
                                  >
                                    ←
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="border-slate-600 hover:bg-slate-700"
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleStepForward}
                                    disabled={currentStep === executionResult.steps.length - 1}
                                    className="border-slate-600 hover:bg-slate-700"
                                  >
                                    →
                                  </Button>
                                </div>
                                <div className="text-sm text-gray-400">
                                  Step {currentStep + 1} of {executionResult.steps.length}
                                </div>
                              </div>
                            )}

                            {/* Step Description */}
                            {executionResult.steps && executionResult.steps.length > 0 && executionResult.steps[currentStep]?.description && (
                              <div className="bg-slate-800/50 rounded-lg p-3">
                                <div className="text-sm text-gray-300">
                                  {executionResult.steps[currentStep].description}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                              <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>
                            <div className="text-red-400 font-semibold mb-2">Execution Error</div>
                            <div className="text-sm text-gray-400 bg-red-900/20 rounded p-3 font-mono">
                              {executionResult.error}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center h-full flex items-center justify-center">
                        <div>
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-gray-400">Click "Run Algorithm" to see visualization</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Step-by-Step Control Panel */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6 space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-purple-400">Step-by-Step</h2>
                    <div className="flex items-center gap-2 text-gray-300">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">
                        {executionResult?.steps && executionResult.steps.length > 0
                          ? "Navigate through algorithm execution"
                          : "Select an algorithm and click play to start"
                        }
                      </span>
                    </div>

                    {executionResult?.steps && executionResult.steps.length > 0 && (
                      <div className="text-sm text-gray-400">
                        Step {currentStep + 1} of {executionResult.steps.length}
                      </div>
                    )}
                  </div>

                  {/* Statistics */}
                  {executionResult?.steps && executionResult.steps.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-400 tracking-wider">COMPARISONS</span>
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1">
                          <span className="text-blue-400 font-bold">
                            {executionResult.steps[currentStep]?.comparisons || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-400 tracking-wider">SWAPS</span>
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1">
                          <span className="text-purple-400 font-bold">
                            {executionResult.steps[currentStep]?.swaps || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="space-y-3">
                    {/* Play Button */}
                    <Button
                      onClick={handlePlay}
                      disabled={!code.trim() || isRunning}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                      {isPlaying ? "Pause" : isRunning ? "Running..." : "Play"}
                    </Button>

                    {/* Reset Button */}
                    <Button
                      onClick={handleReset}
                      disabled={!executionResult?.steps || executionResult.steps.length === 0}
                      variant="outline"
                      className="w-full h-12 border-slate-600 text-gray-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>

                    {/* Navigation Buttons */}
                    {executionResult?.steps && executionResult.steps.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={handleStepBack}
                          disabled={currentStep === 0}
                          variant="outline"
                          className="h-12 border-slate-600 text-gray-300 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <SkipBack className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={handleStepForward}
                          disabled={currentStep === executionResult.steps.length - 1}
                          variant="outline"
                          className="h-12 border-slate-600 text-gray-300 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <SkipForward className="w-5 h-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-green-400">Algorithm Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Lines of Code</span>
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {code.split('\n').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Characters</span>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {code.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Language</span>
                    <Badge variant="outline" className="border-purple-500 text-purple-400">
                      {languages.find(l => l.value === language)?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-blue-400">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleRun}
                    disabled={!code.trim() || isRunning}
                    className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? "Running..." : "Run Algorithm"}
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-slate-700 hover:bg-slate-800"
                    onClick={handleSaveProject}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Project
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-slate-700 hover:bg-slate-800"
                    onClick={handleExportCode}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Code
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-slate-700 hover:bg-slate-800"
                    onClick={handleImportCode}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Code
                  </Button>

                  {/* Hidden file input for import functionality */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CustomBuilder;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BarChart3, Code, Zap, Pause, RotateCcw, ArrowRight, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, ScrollSectionHeader } from "@/components/ui/scroll-reveal";
import { useReducedMotion } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";

// Animated sorting visualization component
const SortingVisualization = () => {
  const [data, setData] = useState([40, 70, 45, 90, 60, 25, 80, 35, 55, 75]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithm, setAlgorithm] = useState("Quick Sort");

  const algorithms = ["Quick Sort", "Merge Sort", "Bubble Sort", "Heap Sort"];
  
  const resetData = () => {
    setData([40, 70, 45, 90, 60, 25, 80, 35, 55, 75]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const startSorting = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      // Simulate sorting animation
      const sortedData = [...data].sort((a, b) => a - b);
      let step = 0;
      const interval = setInterval(() => {
        if (step < sortedData.length) {
          setData(prev => {
            const newData = [...prev];
            // Simulate gradual sorting
            for (let i = 0; i <= step; i++) {
              newData[i] = sortedData[i];
            }
            return newData;
          });
          setCurrentStep(step);
          step++;
        } else {
          setIsPlaying(false);
          clearInterval(interval);
        }
      }, 300);
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      
      <div className="relative z-10">
        {/* Algorithm selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {algorithms.map((algo) => (
            <motion.button
              key={algo}
              onClick={() => setAlgorithm(algo)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                algorithm === algo
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 hover:bg-slate-600/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {algo}
            </motion.button>
          ))}
        </div>

        {/* Visualization area */}
        <div className="h-32 flex items-end justify-center space-x-1 mb-6 bg-slate-900/30 rounded-lg p-4">
          {data.map((height, index) => (
            <motion.div
              key={index}
              className={`rounded-t transition-all duration-300 ${
                index <= currentStep && isPlaying
                  ? 'bg-gradient-to-t from-green-500 to-emerald-400'
                  : 'bg-gradient-to-t from-cyan-500 to-blue-400'
              }`}
              style={{
                height: `${height}px`,
                width: '24px',
              }}
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ 
                scale: index <= currentStep && isPlaying ? 1.1 : 1,
                opacity: 1
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startSorting}
              disabled={isPlaying}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? 'Running...' : 'Start Sort'}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={resetData}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-400/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Interactive code editor component
const CodeEditor = () => {
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const codeLines = [
    "function quickSort(arr, low, high) {",
    "  if (low < high) {",
    "    let pi = partition(arr, low, high);",
    "    quickSort(arr, low, pi - 1);",
    "    quickSort(arr, pi + 1, high);",
    "  }",
    "}"
  ];

  const runCode = () => {
    setIsRunning(true);
    setActiveLines([]);
    
    codeLines.forEach((_, index) => {
      setTimeout(() => {
        setActiveLines(prev => [...prev, index]);
        if (index === codeLines.length - 1) {
          setTimeout(() => setIsRunning(false), 500);
        }
      }, index * 400);
    });
  };

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 font-mono text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-slate-400 text-xs">quicksort.js</span>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={runCode}
            disabled={isRunning}
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white border-0"
          >
            <Play className="w-3 h-3 mr-1" />
            {isRunning ? 'Running' : 'Run'}
          </Button>
        </motion.div>
      </div>
      
      <div className="space-y-1">
        {codeLines.map((line, index) => (
          <motion.div
            key={index}
            className={`px-2 py-1 rounded transition-all duration-300 ${
              activeLines.includes(index)
                ? 'bg-cyan-500/20 border-l-2 border-cyan-400'
                : 'hover:bg-slate-800/50'
            }`}
            initial={{ opacity: 0.7 }}
            animate={{ 
              opacity: activeLines.includes(index) ? 1 : 0.7,
              x: activeLines.includes(index) ? 4 : 0
            }}
          >
            <span className="text-slate-500 mr-4 select-none">{index + 1}</span>
            <span className={activeLines.includes(index) ? 'text-white' : 'text-slate-300'}>
              {line}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Performance comparison chart component
const PerformanceChart = () => {
  const [selectedMetric, setSelectedMetric] = useState("time");
  
  const algorithms = [
    { 
      name: "Quick Sort", 
      time: 22, 
      space: 45, 
      color: "from-yellow-500 to-orange-500",
      textColor: "text-yellow-400"
    },
    { 
      name: "Merge Sort", 
      time: 44, 
      space: 78, 
      color: "from-blue-500 to-indigo-500",
      textColor: "text-blue-400"
    },
    { 
      name: "Heap Sort", 
      time: 78, 
      space: 32, 
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-400"
    },
    { 
      name: "Bubble Sort", 
      time: 156, 
      space: 12, 
      color: "from-red-500 to-rose-500",
      textColor: "text-red-400"
    }
  ];

  const maxValue = Math.max(...algorithms.map(a => selectedMetric === "time" ? a.time : a.space));

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-white">Performance Metrics</h4>
        <div className="flex gap-2">
          {["time", "space"].map((metric) => (
            <motion.button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedMetric === metric
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/30 hover:bg-slate-600/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {metric === "time" ? "Time (ms)" : "Space (MB)"}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {algorithms.map((algorithm, index) => {
          const value = selectedMetric === "time" ? algorithm.time : algorithm.space;
          const percentage = (value / maxValue) * 100;
          
          return (
            <motion.div
              key={algorithm.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${algorithm.textColor}`}>
                  {algorithm.name}
                </span>
                <span className="text-sm text-slate-300">
                  {value}{selectedMetric === "time" ? "ms" : "MB"}
                </span>
              </div>
              <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${algorithm.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const DemoSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="demo">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" style={{ backgroundPosition: '100% 50%' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollSectionHeader className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Interactive Demos
              </span>
              <br />
              <span className="text-white">See Algorithms in Action</span>
            </h2>
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Explore our interactive algorithm visualizer. Watch sorting algorithms unfold, 
                follow code execution step-by-step, and compare performance metrics in real-time.
              </p>
            </ScrollReveal>
          </ScrollSectionHeader>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Main Sorting Visualization */}
            <ScrollReveal variant="slideLeft" delay={0.2}>
              <Card className="group relative h-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">
                      Sorting Algorithm Visualization
                    </CardTitle>
                  </div>
                  <p className="text-slate-300">
                    Watch algorithms like Quick Sort, Merge Sort, and Bubble Sort 
                    transform data in real-time with interactive controls.
                  </p>
                </CardHeader>
                <CardContent className="relative">
                  <SortingVisualization />
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Code Editor and Performance Chart */}
            <div className="space-y-6">
              <ScrollReveal variant="slideRight" delay={0.4}>
                <Card className="group relative bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-white">
                        Interactive Code Editor
                      </CardTitle>
                    </div>
                    <p className="text-slate-300">
                      Follow algorithm execution with live syntax highlighting 
                      and step-by-step code visualization.
                    </p>
                  </CardHeader>
                  <CardContent className="relative">
                    <CodeEditor />
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal variant="slideRight" delay={0.6}>
                <Card className="group relative bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-white">
                        Performance Comparison
                      </CardTitle>
                    </div>
                    <p className="text-slate-300">
                      Analyze and compare time complexity, space usage, and 
                      efficiency metrics across different algorithms.
                    </p>
                  </CardHeader>
                  <CardContent className="relative">
                    <PerformanceChart />
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/25 hover:shadow-2xl transition-all duration-300 font-bold text-white border-0"
                >
                  <Link to="/algorithm-visualizer" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Try Algorithm Visualizer
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 font-semibold transition-all duration-300"
                >
                  <Link to="/algorithm-visualizer/custom" className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Build Custom Algorithm
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
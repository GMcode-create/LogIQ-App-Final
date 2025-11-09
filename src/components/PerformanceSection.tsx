import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, MemoryStick, Zap, Scale, TrendingUp, Clock, Cpu, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem, ScrollSectionHeader } from "@/components/ui/scroll-reveal";
import { useReducedMotion } from "@/hooks/use-scroll-animation";

// Animated counter component
const AnimatedCounter = ({ value, suffix = "", duration = 1000 }: { value: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(value * easeOutCubic);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{Math.round(count * 10) / 10}{suffix}</span>;
};

// Animated progress bar component
const AnimatedProgressBar = ({ 
  percentage, 
  gradient, 
  delay = 0,
  label,
  value 
}: { 
  percentage: number; 
  gradient: string; 
  delay?: number;
  label: string;
  value: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm text-slate-300">{value}</span>
      </div>
      <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradient} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3, duration: 1.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      </div>
    </motion.div>
  );
};

// Interactive chart component
const InteractiveChart = ({ isAfter }: { isAfter: boolean }) => {
  const beforeData = [
    { x: 0, y: 180 },
    { x: 50, y: 160 },
    { x: 100, y: 120 },
    { x: 150, y: 90 },
    { x: 200, y: 80 },
    { x: 250, y: 60 },
    { x: 300, y: 40 },
    { x: 350, y: 30 },
    { x: 400, y: 20 }
  ];

  const afterData = [
    { x: 0, y: 180 },
    { x: 50, y: 170 },
    { x: 100, y: 160 },
    { x: 150, y: 150 },
    { x: 200, y: 140 },
    { x: 250, y: 130 },
    { x: 300, y: 120 },
    { x: 350, y: 110 },
    { x: 400, y: 100 }
  ];

  const createPath = (data: typeof beforeData) => {
    return `M ${data.map(point => `${point.x} ${point.y}`).join(' L ')}`;
  };

  return (
    <div className="relative h-64 bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      
      <svg viewBox="0 0 400 200" className="w-full h-full relative z-10">
        <defs>
          <linearGradient id="beforeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="afterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isAfter ? "#06b6d4" : "#ef4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isAfter ? "#06b6d4" : "#ef4444"} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgb(148 163 184 / 0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Area fill */}
        <motion.path
          d={`${createPath(isAfter ? afterData : beforeData)} L 400 200 L 0 200 Z`}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Main line */}
        <motion.path
          d={createPath(isAfter ? afterData : beforeData)}
          stroke={isAfter ? "url(#afterGradient)" : "url(#beforeGradient)"}
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {(isAfter ? afterData : beforeData).map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={isAfter ? "#06b6d4" : "#ef4444"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
            className="drop-shadow-lg"
          />
        ))}
      </svg>
      
      <div className="absolute bottom-4 left-6 right-6 flex justify-between text-xs text-slate-400">
        <span>0ms</span>
        <span>Input Size</span>
        <span>1000ms</span>
      </div>
    </div>
  );
};

const PerformanceSection = () => {
  const [isAfter, setIsAfter] = useState(false);

  const metrics = [
    {
      icon: Activity,
      title: "Processing Speed",
      beforeValue: 1.0,
      afterValue: 3.2,
      suffix: "x",
      description: "Baseline Performance",
      color: "from-cyan-500 to-blue-600",
      iconColor: "text-cyan-400"
    },
    {
      icon: MemoryStick,
      title: "Memory Efficiency",
      beforeValue: 86,
      afterValue: 42,
      suffix: " MB",
      description: "Average Allocation",
      color: "from-purple-500 to-pink-600",
      iconColor: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Energy Consumption",
      beforeValue: 0.98,
      afterValue: 0.61,
      suffix: " kWh",
      description: "Power Usage",
      color: "from-yellow-500 to-orange-600",
      iconColor: "text-yellow-400"
    },
    {
      icon: Clock,
      title: "Response Time",
      beforeValue: 245,
      afterValue: 89,
      suffix: "ms",
      description: "Average Latency",
      color: "from-green-500 to-emerald-600",
      iconColor: "text-green-400"
    }
  ];

  const algorithmData = [
    { name: "Bubble Sort", before: 78, after: 45, color: "from-red-500 to-red-600" },
    { name: "Merge Sort", before: 44, after: 28, color: "from-blue-500 to-blue-600" },
    { name: "Quick Sort", before: 22, after: 15, color: "from-green-500 to-green-600" },
    { name: "Heap Sort", before: 65, after: 38, color: "from-purple-500 to-purple-600" },
    { name: "Radix Sort", before: 33, after: 21, color: "from-yellow-500 to-yellow-600" }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" style={{ backgroundPosition: '100% 100%' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollSectionHeader className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Performance Analytics
              </span>
              <br />
              <span className="text-white">See the Difference</span>
            </h2>
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Interactive performance metrics showcase the tangible impact of algorithm optimization. 
                Toggle between states to witness real-time transformations.
              </p>
            </ScrollReveal>
            
            {/* Enhanced Interactive Toggle */}
            <ScrollReveal variant="fadeScale" delay={0.5}>
              <div className="flex flex-col items-center gap-6 mb-12">
                <div className="flex items-center justify-center gap-8">
                  <motion.button
                    onClick={() => setIsAfter(false)}
                    className={`text-xl font-semibold transition-all duration-300 px-6 py-3 rounded-lg ${
                      !isAfter 
                        ? 'text-red-400 bg-red-500/10 border border-red-500/30 scale-110' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'
                    }`}
                    whileHover={{ scale: !isAfter ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Before Optimization
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setIsAfter(true)}
                    className={`text-xl font-semibold transition-all duration-300 px-6 py-3 rounded-lg ${
                      isAfter 
                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 scale-110' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'
                    }`}
                    whileHover={{ scale: isAfter ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    After Optimization
                  </motion.button>
                </div>
                
                {/* Performance Summary */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isAfter ? 'after-summary' : 'before-summary'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`text-sm px-4 py-2 rounded-full border ${
                        isAfter 
                          ? 'text-green-300 bg-green-500/10 border-green-500/30' 
                          : 'text-orange-300 bg-orange-500/10 border-orange-500/30'
                      }`}
                    >
                      {isAfter 
                        ? '🚀 Optimized algorithms show 3.2x faster processing with 51% less memory usage'
                        : '⚠️ Standard algorithms with baseline performance metrics'
                      }
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </ScrollReveal>
          </ScrollSectionHeader>

          {/* Dashboard-style Metric Cards */}
          <ScrollStagger 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            staggerDelay={0.1}
            delayChildren={0.2}
          >
            {metrics.map((metric, index) => (
              <ScrollStaggerItem key={metric.title} index={index}>
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                <Card className="group relative h-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${metric.color} rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  <CardContent className="relative p-6 text-center">
                    {/* Icon with animated background */}
                    <motion.div 
                      className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl relative overflow-hidden bg-slate-700/50"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                      <metric.icon className={`w-8 h-8 ${metric.iconColor} relative z-10`} />
                    </motion.div>
                    
                    {/* Animated value */}
                    <div className="text-3xl font-bold text-white mb-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isAfter ? 'after' : 'before'}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AnimatedCounter 
                            value={isAfter ? metric.afterValue : metric.beforeValue} 
                            suffix={metric.suffix}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">{metric.title}</h3>
                    <p className="text-sm text-slate-400">{metric.description}</p>
                    
                    {/* Enhanced Performance indicator with improvement percentage */}
                    <motion.div 
                      className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                        isAfter ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}
                      animate={{ scale: isAfter ? 1.05 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isAfter ? (
                        <>
                          ↗ Optimized 
                          {metric.title === "Processing Speed" && " (+220%)"}
                          {metric.title === "Memory Efficiency" && " (-51%)"}
                          {metric.title === "Energy Consumption" && " (-38%)"}
                          {metric.title === "Response Time" && " (-64%)"}
                        </>
                      ) : (
                        '→ Baseline'
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
                </motion.div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>

          {/* Interactive Visualizations */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Time Complexity Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Time Complexity Analysis
              </h3>
              <InteractiveChart isAfter={isAfter} />
              
              <div className="mt-6 flex justify-center gap-8">
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{ opacity: !isAfter ? 1 : 0.6 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                  <span className="text-sm text-slate-300">Before Optimization</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  animate={{ opacity: isAfter ? 1 : 0.6 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
                  <span className="text-sm text-slate-300">After Optimization</span>
                </motion.div>
              </div>
              
              {/* Performance Improvement Summary */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={isAfter ? 'after-chart' : 'before-chart'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`text-sm ${
                      isAfter ? 'text-cyan-300' : 'text-orange-300'
                    }`}
                  >
                    {isAfter 
                      ? 'Optimized algorithms maintain consistent performance even with larger datasets'
                      : 'Standard algorithms show exponential time complexity growth'
                    }
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Algorithm Performance Bars */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Database className="w-6 h-6 text-purple-400" />
                Algorithm Performance (ms)
              </h3>
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                {algorithmData.map((algorithm, index) => (
                  <AnimatedProgressBar
                    key={algorithm.name}
                    label={algorithm.name}
                    percentage={isAfter ? (algorithm.after / 78) * 100 : (algorithm.before / 78) * 100}
                    gradient={algorithm.color}
                    delay={index * 0.1}
                    value={`${isAfter ? algorithm.after : algorithm.before}ms`}
                  />
                ))}
              </div>

              {/* Scalability Index Card */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Scale className="w-6 h-6 text-cyan-400" />
                        <h4 className="text-xl font-bold text-white">Scalability Index</h4>
                      </div>
                      <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
                        Real-time
                      </Badge>
                    </div>
                    <div className="text-right mb-4">
                      <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={isAfter ? 'after' : 'before'}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4 }}
                          >
                            <AnimatedCounter value={isAfter ? 76.4 : 45.2} />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={isAfter ? 'after-scalability' : 'before-scalability'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-slate-300 leading-relaxed"
                      >
                        {isAfter 
                          ? 'Enhanced architecture demonstrates exponential performance improvements with optimized algorithms and efficient resource utilization.'
                          : 'Baseline performance metrics showing standard algorithm behavior with room for significant optimization improvements.'
                        }
                      </motion.p>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
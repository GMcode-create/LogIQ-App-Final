import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Link, TrendingUp, Settings, Download, ChevronRight, Play, BarChart3, Palette, Share2 } from "lucide-react";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem, ScrollSectionHeader } from "@/components/ui/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const DetailedFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const featureCards = [
    {
      id: "algorithms",
      icon: Link,
      title: "Algorithm Types",
      description: "50+ sorting, searching, and graph algorithms",
      color: "yellow",
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      details: {
        title: "50+ Algorithm Types",
        content: "From basic sorting algorithms like Bubble Sort to advanced graph algorithms like Dijkstra's. Each algorithm includes step-by-step visualization, complexity analysis, and real-world applications.",
        features: [
          "Sorting: Bubble, Merge, Quick, Heap, Radix",
          "Searching: Binary, Linear, Interpolation",
          "Graph: BFS, DFS, Dijkstra, A*, Kruskal's",
          "Tree: AVL, Red-Black, Segment Trees"
        ]
      }
    },
    {
      id: "editor",
      icon: Code2,
      title: "Code Editor",
      description: "Built-in IDE with syntax highlighting",
      color: "cyan",
      bgColor: "bg-cyan-500/20",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      details: {
        title: "Professional Code Editor",
        content: "Full-featured IDE with intelligent code completion, syntax highlighting, and integrated debugging tools. Write, test, and visualize your algorithms in real-time.",
        features: [
          "Multi-language support (Python, Java, C++, JavaScript)",
          "Intelligent autocomplete and error detection",
          "Integrated debugger with breakpoints",
          "Real-time code execution and visualization"
        ]
      }
    },
    {
      id: "performance",
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Real-time metrics and benchmarking",
      color: "purple",
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      details: {
        title: "Advanced Performance Analytics",
        content: "Monitor execution time, memory usage, and complexity metrics in real-time. Compare different algorithms and optimize your code with detailed performance insights.",
        features: [
          "Real-time execution time tracking",
          "Memory usage visualization",
          "Big O complexity analysis",
          "Comparative benchmarking tools"
        ]
      }
    },
    {
      id: "personalization",
      icon: Settings,
      title: "Personalization",
      description: "Customizable interface and learning paths",
      color: "blue",
      bgColor: "bg-blue-500/20",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      details: {
        title: "Tailored Learning Experience",
        content: "Customize your learning journey with personalized difficulty levels, preferred programming languages, and adaptive content that matches your skill level.",
        features: [
          "Adaptive difficulty adjustment",
          "Custom color themes and layouts",
          "Personalized learning recommendations",
          "Progress tracking and achievements"
        ]
      }
    },
    {
      id: "export",
      icon: Download,
      title: "Export & Share",
      description: "Share visualizations and export reports",
      color: "green",
      bgColor: "bg-green-500/20",
      textColor: "text-green-400",
      borderColor: "border-green-500/30",
      details: {
        title: "Seamless Sharing & Export",
        content: "Export your visualizations, performance reports, and code snippets in multiple formats. Share your work with colleagues or include in presentations and documentation.",
        features: [
          "Export to PDF, PNG, SVG formats",
          "Generate shareable links",
          "Code snippet export with syntax highlighting",
          "Performance report generation"
        ]
      }
    }
  ];

  const algorithmTypes = [
    "Sorting: Bubble, Merge, Quick, Heap, Radix, and more",
    "Searching: Binary, Linear, Interpolation, Jump",
    "Graph: BFS, DFS, Dijkstra, A*, Kruskal's, Prim's",
    "Tree & Custom algorithms: AVL, Segment Trees, and user-defined approaches"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" style={{ backgroundPosition: '100% 50%' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <ScrollSectionHeader className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Engineered for Peak
              </span>
              <br />
              <span className="text-white">Performance</span>
            </h2>
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Explore a professional-grade toolset designed for sophisticated algorithm 
                visualization and comprehensive performance analysis.
              </p>
            </ScrollReveal>
          </ScrollSectionHeader>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Interactive Feature Buttons */}
            <ScrollStagger 
              className="space-y-4"
              staggerDelay={0.1}
              delayChildren={0.2}
            >
              {featureCards.map((feature, index) => (
                <ScrollStaggerItem key={feature.id} index={index}>
                  <motion.div
                    whileHover={{ 
                      y: -3,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                      className={`group relative w-full h-auto py-6 px-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden justify-start ${
                        activeFeature === feature.id ? `border-${feature.color}-500/50 bg-${feature.color}-500/5` : ''
                      }`}
                    >
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/5 to-${feature.color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Glow effect */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                      
                      <div className="relative flex items-center gap-4 w-full">
                        <motion.div 
                          className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ rotate: 5 }}
                        >
                          <feature.icon className={`w-6 h-6 ${feature.textColor}`} />
                        </motion.div>
                        
                        <div className="flex-1 text-left min-w-0">
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-base text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                            {feature.description}
                          </p>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: activeFeature === feature.id ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronRight className={`w-5 h-5 ${feature.textColor} group-hover:translate-x-1 transition-transform duration-300`} />
                        </motion.div>
                      </div>
                    </Button>
                  </motion.div>
                </ScrollStaggerItem>
              ))}
            </ScrollStagger>

            {/* Dynamic Content Area */}
            <ScrollReveal variant="slideRight" delay={0.4}>
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden min-h-[500px]">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {activeFeature ? (
                      <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        {(() => {
                          const feature = featureCards.find(f => f.id === activeFeature);
                          if (!feature) return null;
                          
                          return (
                            <>
                              <motion.div 
                                className="flex items-center gap-3 mb-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <motion.div
                                  className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center`}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <feature.icon className={`w-6 h-6 ${feature.textColor}`} />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white">{feature.details.title}</h3>
                              </motion.div>
                              
                              <motion.p 
                                className="text-slate-300 mb-8 leading-relaxed text-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                {feature.details.content}
                              </motion.p>

                              <div className="space-y-4">
                                {feature.details.features.map((featureItem, index) => (
                                  <motion.div 
                                    key={index}
                                    className="flex items-center gap-3 group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    whileHover={{ x: 4 }}
                                  >
                                    <motion.div 
                                      className={`w-6 h-6 ${feature.bgColor} rounded-full flex items-center justify-center group-hover:bg-${feature.color}-500/30 transition-colors duration-300`}
                                      whileHover={{ scale: 1.1 }}
                                    >
                                      <motion.div 
                                        className={`w-2.5 h-2.5 bg-${feature.color}-400 rounded-full`}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                                      />
                                    </motion.div>
                                    <span className="text-slate-200 group-hover:text-white transition-colors duration-300 text-base">
                                      {featureItem}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>


                            </>
                          );
                        })()}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-16"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Code2 className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-4">Explore Our Features</h3>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
                          Click on any feature button to learn more about our comprehensive 
                          algorithm visualization and analysis tools.
                        </p>
                        <motion.div
                          className="mt-8 flex justify-center gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <BarChart3 className="w-6 h-6 text-purple-400" />
                          <Palette className="w-6 h-6 text-yellow-400" />
                          <Share2 className="w-6 h-6 text-green-400" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
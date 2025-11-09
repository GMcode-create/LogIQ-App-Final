import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Binary, 
  GitCompare, 
  Code2, 
  TrendingUp, 
  Zap, 
  Brain,
  Target,
  Layers
} from "lucide-react";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem, ScrollSectionHeader } from "@/components/ui/scroll-reveal";
import { useReducedMotion } from "@/hooks/use-scroll-animation";
import { useBreakpoint, useTouchDevice, getOptimizedAnimationProps, getResponsiveClasses } from "@/lib/responsive-utils";

// Algorithm-themed custom icons
const AlgorithmIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h18v18H3V3z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M7 7h10v2H7V7z" fill="currentColor"/>
    <path d="M7 11h6v2H7v-2z" fill="currentColor"/>
    <path d="M7 15h8v2H7v-2z" fill="currentColor"/>
    <circle cx="17" cy="12" r="2" fill="currentColor"/>
  </svg>
);

const SortIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="18" width="4" height="3" fill="currentColor"/>
    <rect x="7" y="14" width="4" height="7" fill="currentColor"/>
    <rect x="11" y="10" width="4" height="11" fill="currentColor"/>
    <rect x="15" y="6" width="4" height="15" fill="currentColor"/>
    <rect x="19" y="2" width="2" height="19" fill="currentColor"/>
  </svg>
);

const TreeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="4" r="2" fill="currentColor"/>
    <circle cx="7" cy="12" r="2" fill="currentColor"/>
    <circle cx="17" cy="12" r="2" fill="currentColor"/>
    <circle cx="4" cy="20" r="2" fill="currentColor"/>
    <circle cx="10" cy="20" r="2" fill="currentColor"/>
    <circle cx="14" cy="20" r="2" fill="currentColor"/>
    <circle cx="20" cy="20" r="2" fill="currentColor"/>
    <path d="M12 6v4M7 10l5-4 5 4M7 14v4M17 14v4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const GraphIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="3" fill="currentColor"/>
    <circle cx="18" cy="6" r="3" fill="currentColor"/>
    <circle cx="6" cy="18" r="3" fill="currentColor"/>
    <circle cx="18" cy="18" r="3" fill="currentColor"/>
    <path d="M9 6h6M9 18h6M6 9v6M18 9v6M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const features = [
  {
    icon: AlgorithmIcon,
    title: "Interactive Visualizer",
    description: "Watch algorithms come to life with step-by-step execution. Understand complex logic through beautiful, animated visualizations that make learning intuitive.",
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    category: "visualization"
  },
  {
    icon: GitCompare,
    title: "Algorithm Comparison",
    description: "Run multiple algorithms side-by-side. Compare performance, efficiency, and behavior on the same dataset with real-time metrics and insights.",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    category: "analysis"
  },
  {
    icon: Code2,
    title: "Custom Code Builder",
    description: "Import your own algorithms or build new ones. Our intuitive editor supports multiple languages with syntax highlighting and debugging tools.",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    category: "development"
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Deep dive into algorithm performance with comprehensive analytics. Track time complexity, space usage, and optimization opportunities.",
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    category: "metrics"
  },
  {
    icon: SortIcon,
    title: "Sorting Algorithms",
    description: "Master all sorting techniques from bubble sort to quicksort. Visualize how different algorithms handle various data patterns and sizes.",
    color: "blue",
    gradient: "from-blue-500 to-indigo-500",
    category: "algorithms"
  },
  {
    icon: TreeIcon,
    title: "Tree & Graph Traversal",
    description: "Explore tree and graph algorithms with interactive visualizations. See BFS, DFS, and pathfinding algorithms in action with clear animations.",
    color: "teal",
    gradient: "from-teal-500 to-cyan-500",
    category: "structures"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const FeaturesSection = () => {
  const { isMobile, isTablet, currentBreakpoint } = useBreakpoint();
  const { isTouchDevice, hasHover } = useTouchDevice();
  
  return (
    <section className={getResponsiveClasses(
      "relative overflow-hidden",
      {
        sm: "py-16",
        md: "py-20",
        lg: "py-24"
      }
    )}>
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" style={{ backgroundPosition: '100% 0%' }} />
      </div>
      
      <div className={getResponsiveClasses(
        "container mx-auto relative z-10",
        {
          sm: "px-4",
          md: "px-6"
        }
      )}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollSectionHeader className={getResponsiveClasses(
            "text-center",
            {
              sm: "mb-12",
              md: "mb-14", 
              lg: "mb-16"
            }
          )}>
            <h2 className={getResponsiveClasses(
              "font-bold",
              {
                sm: "text-3xl mb-4",
                md: "text-4xl mb-5",
                lg: "text-5xl mb-6"
              }
            )}>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
              <br />
              <span className="text-white">for Algorithm Mastery</span>
            </h2>
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <p className={getResponsiveClasses(
                "text-slate-300 mx-auto leading-relaxed",
                {
                  sm: "text-base max-w-2xl px-2",
                  md: "text-lg max-w-2xl",
                  lg: "text-xl max-w-3xl"
                }
              )}>
                Everything you need to understand, analyze, and master algorithms. 
                From interactive visualizations to performance analytics.
              </p>
            </ScrollReveal>
          </ScrollSectionHeader>

          {/* Features Grid */}
          <ScrollStagger 
            className={getResponsiveClasses(
              "grid gap-6",
              {
                sm: "grid-cols-1",
                md: "grid-cols-2",
                lg: "grid-cols-3",
                xl: "grid-cols-4"
              }
            )}
            staggerDelay={isMobile ? 0.05 : 0.1}
            delayChildren={0.2}
          >
            {features.map((feature, index) => (
              <ScrollStaggerItem key={index} index={index}>
                <motion.div
                  whileHover={(hasHover && !isMobile) ? { 
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                >
                  <Card className="group relative h-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Glow effect - reduced on mobile */}
                  {!isMobile && (
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  )}
                  
                  <CardContent className={getResponsiveClasses(
                    "relative text-center h-full flex flex-col",
                    {
                      sm: "p-4",
                      md: "p-5",
                      lg: "p-6"
                    }
                  )}>
                    {/* Icon Container */}
                    <motion.div 
                      className={getResponsiveClasses(
                        "mx-auto flex items-center justify-center rounded-xl relative overflow-hidden bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors duration-300",
                        {
                          sm: "w-12 h-12 mb-4",
                          md: "w-14 h-14 mb-5",
                          lg: "w-16 h-16 mb-6"
                        }
                      )}
                      whileHover={(hasHover && !isMobile) ? { scale: 1.1, rotate: 5 } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                      <feature.icon className={getResponsiveClasses(
                        `text-${feature.color}-400 relative z-10 group-hover:text-white transition-colors duration-300`,
                        {
                          sm: "w-6 h-6",
                          md: "w-7 h-7",
                          lg: "w-8 h-8"
                        }
                      )} />
                      
                      {/* Pulse effect - disabled on mobile for performance */}
                      {!isMobile && (
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-30`}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.3, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </motion.div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className={getResponsiveClasses(
                        "font-bold text-white group-hover:text-cyan-300 transition-colors duration-300",
                        {
                          sm: "text-lg mb-3",
                          md: "text-xl mb-4"
                        }
                      )}>
                        {feature.title}
                      </h3>
                      <p className={getResponsiveClasses(
                        "text-slate-300 leading-relaxed flex-1",
                        {
                          sm: "text-sm",
                          md: "text-sm"
                        }
                      )}>
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Category Badge */}
                    <motion.div 
                      className={getResponsiveClasses(
                        `px-3 py-1 rounded-full font-medium bg-${feature.color}-500/20 text-${feature.color}-300 border border-${feature.color}-500/30`,
                        {
                          sm: "mt-3 text-xs",
                          md: "mt-4 text-xs"
                        }
                      )}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (isMobile ? index * 0.05 : index * 0.1) }}
                    >
                      {feature.category}
                    </motion.div>
                  </CardContent>
                  </Card>
                </motion.div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
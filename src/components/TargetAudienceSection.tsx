import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Code, Briefcase, FlaskConical } from "lucide-react";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem, ScrollSectionHeader } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Master algorithms with interactive visualizations and step-by-step breakdowns. Build strong foundations for technical interviews.",
    colorClass: "border-logiq-cyan text-logiq-cyan",
    bgGlow: "bg-logiq-cyan/10",
    shadowGlow: "shadow-[0_0_20px_rgba(0,188,212,0.3)]"
  },
  {
    icon: Users,
    title: "Educators",
    description: "Teach complex algorithms with engaging visual tools. Help students understand data structures through interactive demonstrations.",
    colorClass: "border-logiq-magenta text-logiq-magenta",
    bgGlow: "bg-logiq-magenta/10",
    shadowGlow: "shadow-[0_0_20px_rgba(233,30,99,0.3)]"
  },
  {
    icon: Code,
    title: "Developers",
    description: "Optimize your code with algorithm analysis tools. Compare time complexity and performance across different implementations.",
    colorClass: "border-logiq-purple text-logiq-purple",
    bgGlow: "bg-logiq-purple/10",
    shadowGlow: "shadow-[0_0_20px_rgba(156,39,176,0.3)]"
  },
  {
    icon: Briefcase,
    title: "Interview Candidates",
    description: "Practice coding interviews with real-time algorithm visualization. Master the most common technical interview questions.",
    colorClass: "border-logiq-yellow text-logiq-yellow",
    bgGlow: "bg-logiq-yellow/10",
    shadowGlow: "shadow-[0_0_20px_rgba(255,193,7,0.3)]",
    featured: true
  },
  {
    icon: FlaskConical,
    title: "Researchers",
    description: "Analyze algorithm performance with detailed metrics. Research and compare algorithmic approaches for academic work.",
    colorClass: "border-logiq-cyan-light text-logiq-cyan-light",
    bgGlow: "bg-logiq-cyan-light/10",
    shadowGlow: "shadow-[0_0_20px_rgba(77,208,225,0.3)]"
  }
];

const TargetAudienceSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="about">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" style={{ backgroundPosition: '100% 0%' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header with Scroll Animation */}
          <ScrollSectionHeader className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Built for Algorithm</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Enthusiasts
              </span>
            </h2>
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                LogiQ empowers developers, students, and educators to master algorithms through 
                interactive visualizations and comprehensive learning tools.
              </p>
            </ScrollReveal>
          </ScrollSectionHeader>

          {/* Main grid - 2x2 layout for first 4 cards with staggered animation */}
          <ScrollStagger 
            className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto"
            staggerDelay={0.15}
            delayChildren={0.2}
          >
            {audiences.slice(0, 4).map((audience, index) => (
              <ScrollStaggerItem key={index} index={index}>
                <motion.div
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <Card 
                    className={`group relative h-full bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 ${
                      audience.featured ? 'ring-2 ring-yellow-400/40 shadow-lg shadow-yellow-400/20 mt-6' : ''
                    }`}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    {/* Glow effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    
                    <CardContent className="relative p-8 text-center h-full flex flex-col">
                      {/* Featured badge */}
                      {audience.featured && (
                        <motion.div 
                          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                          initial={{ opacity: 0, y: -10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-full shadow-xl border-2 border-yellow-300">
                            Most Popular
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Circular icon container */}
                      <motion.div 
                        className={`w-24 h-24 mx-auto mb-6 rounded-full border-2 border-cyan-400/50 flex items-center justify-center bg-slate-700/50 group-hover:bg-slate-600/50 transition-all duration-500 ease-out relative overflow-hidden`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Glow effect background */}
                        <div className={`absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        <audience.icon className={`w-12 h-12 text-cyan-400 relative z-10 group-hover:text-white transition-colors duration-300`} />
                        
                        {/* Pulse effect */}
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-500/30 rounded-full opacity-0 group-hover:opacity-30`}
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
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">
                        {audience.title}
                      </h3>
                      
                      <p className="text-slate-300 leading-relaxed flex-grow group-hover:text-slate-200 transition-colors duration-300">
                        {audience.description}
                      </p>
                      
                      {/* Category indicator */}
                      <motion.div 
                        className={`mt-4 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {audience.title.toLowerCase()}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>

          {/* Researchers card - centered bottom with scroll animation */}
          <ScrollReveal variant="fadeScale" delay={0.8} className="flex justify-center">
            <motion.div
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <Card className="group relative bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 max-w-md transition-all duration-300 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <CardContent className="relative p-8 text-center">
                  {/* Circular icon container */}
                  <motion.div 
                    className={`w-24 h-24 mx-auto mb-6 rounded-full border-2 border-cyan-400/50 flex items-center justify-center bg-slate-700/50 group-hover:bg-slate-600/50 transition-all duration-500 ease-out relative overflow-hidden`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glow effect background */}
                    <div className={`absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <FlaskConical className={`w-12 h-12 text-cyan-400 relative z-10 group-hover:text-white transition-colors duration-300`} />
                    
                    {/* Pulse effect */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-purple-500/30 rounded-full opacity-0 group-hover:opacity-30`}
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
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {audiences[4].title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {audiences[4].description}
                  </p>
                  
                  {/* Category indicator */}
                  <motion.div 
                    className={`mt-4 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    researchers
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
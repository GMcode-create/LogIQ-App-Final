import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Clock, Users } from "lucide-react";
import { ScrollReveal, ScrollStagger, ScrollStaggerItem, ScrollSectionHeader } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Enhanced gradient background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" style={{ backgroundPosition: '100% 100%' }} />
      </div>
      
      {/* Subtle pattern overlays */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(0, 188, 212, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(156, 39, 176, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(233, 30, 99, 0.06) 0%, transparent 50%)
        `
      }}></div>
      
      {/* Animated decorative floating elements */}
      <motion.div 
        className="absolute top-16 left-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-500/8 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Geometric floating shapes with scroll animations */}
      <motion.div 
        className="absolute top-20 right-1/4 w-16 h-16 border border-cyan-400/20 opacity-30"
        animate={{
          rotate: [0, 360],
          y: [-10, 10, -10],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div 
        className="absolute bottom-32 left-1/3 w-12 h-12 border border-purple-400/20 opacity-25"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading with scroll animation */}
          <ScrollSectionHeader className="mb-8">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-white">Ready to Master</span>
              <br />
              <motion.span 
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-extrabold"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Algorithms?
              </motion.span>
            </h2>
          </ScrollSectionHeader>
          
          <ScrollReveal variant="fadeUp" delay={0.3}>
            <p className="text-xl md:text-2xl text-slate-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Join thousands of students and developers who've accelerated their 
              algorithm understanding with LogiQ's interactive visualizations.
            </p>
          </ScrollReveal>
          
          {/* Enhanced CTA buttons with scroll animation */}
          <ScrollReveal variant="fadeScale" delay={0.5}>
            <div className="flex justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  asChild
                  variant="hero" 
                  size="xl" 
                  className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/25 hover:shadow-2xl transition-all duration-300 font-bold text-white border-0"
                >
                  <a href="/algorithm-visualizer">
                    <Sparkles className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                    Start Visualizing Now
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
          
          {/* Enhanced trust indicators with staggered animation */}
          <ScrollStagger 
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400 mb-8"
            staggerDelay={0.1}
            delayChildren={0.7}
          >
            {[
              { icon: Shield, text: "Free forever" },
              { icon: Clock, text: "No credit card required" }
            ].map((item, index) => (
              <ScrollStaggerItem key={index} index={index}>
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              </ScrollStaggerItem>
            ))}
          </ScrollStagger>
          
          {/* Supporting text with enhanced styling and animation */}
          <ScrollReveal variant="fadeUp" delay={0.9}>
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-4">
                Trusted by students at top universities and developers at leading tech companies
              </p>
              <div className="flex justify-center items-center gap-4 opacity-60">
                <motion.div 
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div 
                  className="w-2 h-2 bg-yellow-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
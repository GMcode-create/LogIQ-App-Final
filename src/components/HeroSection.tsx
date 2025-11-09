import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccessibilityPreferences, useBrowserCapabilities, useReducedMotion } from "@/hooks/use-scroll-animation";
import { createAccessibleVariants } from "@/lib/accessibility-utils";
import AccessibleMotion from "@/components/ui/accessible-motion";
import { useBreakpoint, useTouchDevice, getOptimizedAnimationProps, getResponsiveClasses } from "@/lib/responsive-utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Globe } from "lucide-react";

// Subtle geometric shapes for background animation
const GeometricShape = ({ type, delay, x, y }: { type: 'dot' | 'hexagon'; delay: number; x: number; y: number }) => {
  const { prefersReducedMotion } = useAccessibilityPreferences();
  const capabilities = useBrowserCapabilities();
  
  if (!capabilities.supportsAnimations || prefersReducedMotion) {
    return (
      <div 
        className={`absolute ${type === 'dot' ? 'w-1 h-1 rounded-full bg-blue-900/10' : 'w-3 h-3 bg-purple-900/10'}`}
        style={{ 
          left: x + '%', 
          top: y + '%',
          clipPath: type === 'hexagon' ? 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' : undefined
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <AccessibleMotion
      className={`absolute ${type === 'dot' ? 'w-1 h-1 rounded-full bg-blue-900/15' : 'w-3 h-3 bg-purple-900/15'}`}
      style={{ 
        left: x + '%', 
        top: y + '%',
        clipPath: type === 'hexagon' ? 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' : undefined
      }}
      initial={{ opacity: 0.1, scale: 0.8 }}
      animate={{
        opacity: [0.1, 0.15, 0.1],
        scale: [0.8, 1.1, 0.8],
        rotate: type === 'hexagon' ? [0, 360] : 0,
      }}
      transition={{
        duration: 35 + Math.random() * 25,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      enablePerformanceOptimization={true}
      respectReducedMotion={true}
      ariaLabel="Decorative background shape"
      role="presentation"
    />
  );
};

// Connecting lines between shapes
const ConnectingLine = ({ delay, startX, startY, endX, endY }: { 
  delay: number; 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number; 
}) => {
  const { prefersReducedMotion } = useAccessibilityPreferences();
  
  if (prefersReducedMotion) return null;

  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

  return (
    <AccessibleMotion
      className="absolute h-px bg-gradient-to-r from-transparent via-blue-800/10 to-transparent origin-left"
      style={{
        left: startX + '%',
        top: startY + '%',
        width: length + 'px',
        transform: `rotate(${angle}deg)`,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{
        scaleX: [0, 1, 0],
        opacity: [0, 0.12, 0],
      }}
      transition={{
        duration: 45 + Math.random() * 15,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      enablePerformanceOptimization={true}
      respectReducedMotion={true}
      ariaLabel="Decorative connecting line"
      role="presentation"
    />
  );
};

// Floating particle for subtle background movement
const FloatingParticle = ({ delay }: { delay: number }) => {
  const { prefersReducedMotion } = useAccessibilityPreferences();
  const capabilities = useBrowserCapabilities();
  
  if (!capabilities.supportsAnimations || prefersReducedMotion) {
    return (
      <div 
        className="absolute w-1 h-1 bg-blue-800/10 rounded-full"
        style={{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <AccessibleMotion
      className="absolute w-1 h-1 bg-blue-800/12 rounded-full"
      initial={{ 
        opacity: 0.08,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      }}
      animate={{
        opacity: [0.08, 0.15, 0.08],
        y: [0, -40, 0],
        x: [0, Math.random() * 25 - 12.5, 0],
      }}
      transition={{
        duration: 40 + Math.random() * 20,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      enablePerformanceOptimization={true}
      respectReducedMotion={true}
      ariaLabel="Decorative floating particle"
      role="presentation"
    />
  );
};

// Floating tech icons for modern background
const FloatingTechIcon = ({ delay, x, y, icon }: { delay: number; x: number; y: number; icon: string }) => {
  const { prefersReducedMotion } = useAccessibilityPreferences();
  
  if (prefersReducedMotion) {
    return (
      <div 
        className="absolute text-blue-400/10 text-2xl"
        style={{ left: x + '%', top: y + '%' }}
        aria-hidden="true"
      >
        {icon}
      </div>
    );
  }

  return (
    <AccessibleMotion
      className="absolute text-blue-400/15 text-2xl"
      style={{ left: x + '%', top: y + '%' }}
      initial={{ opacity: 0.1, rotate: 0, scale: 0.8 }}
      animate={{
        opacity: [0.1, 0.2, 0.1],
        rotate: [0, 360],
        scale: [0.8, 1.2, 0.8],
        y: [0, -30, 0],
      }}
      transition={{
        duration: 25 + Math.random() * 15,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      enablePerformanceOptimization={true}
      respectReducedMotion={true}
      ariaLabel="Decorative tech icon"
      role="presentation"
    >
      {icon}
    </AccessibleMotion>
  );
};





const HeroSection = () => {
  const [geometricShapes, setGeometricShapes] = useState<Array<{id: number; type: 'dot' | 'hexagon'; x: number; y: number; delay: number}>>([]);
  const [connectingLines, setConnectingLines] = useState<Array<{id: number; startX: number; startY: number; endX: number; endY: number; delay: number}>>([]);
  const [particles, setParticles] = useState<number[]>([]);
  const [techIcons, setTechIcons] = useState<Array<{id: number; icon: string; x: number; y: number; delay: number}>>([]);
  const prefersReducedMotion = useReducedMotion();
  const capabilities = useBrowserCapabilities();
  const { isMobile, isTablet } = useBreakpoint();
  const { isTouchDevice, hasHover } = useTouchDevice();

  useEffect(() => {
    // Generate subtle geometric shapes with better distribution
    const shapes = Array.from({ length: isMobile ? 8 : 15 }, (_, i) => ({
      id: i,
      type: Math.random() > 0.6 ? 'hexagon' : 'dot' as 'dot' | 'hexagon',
      x: Math.random() * 85 + 7.5, // Better edge margins
      y: Math.random() * 85 + 7.5,
      delay: Math.random() * 15, // Longer stagger
    }));
    setGeometricShapes(shapes);

    // Generate connecting lines between some shapes with better logic
    const lines = [];
    for (let i = 0; i < shapes.length - 1; i++) {
      if (Math.random() > 0.75 && lines.length < (isMobile ? 3 : 6)) {
        const shape1 = shapes[i];
        const shape2 = shapes[i + 1];
        const distance = Math.sqrt(Math.pow(shape2.x - shape1.x, 2) + Math.pow(shape2.y - shape1.y, 2));
        
        // Only connect shapes that are reasonably close but not too close
        if (distance > 15 && distance < 35) {
          lines.push({
            id: lines.length,
            startX: shape1.x,
            startY: shape1.y,
            endX: shape2.x,
            endY: shape2.y,
            delay: Math.random() * 30, // Longer delays for more subtle appearance
          });
        }
      }
    }
    setConnectingLines(lines);

    // Floating particles for subtle movement
    const particleCount = isMobile ? 6 : 10;
    setParticles(Array.from({ length: particleCount }, (_, i) => i));

    // Tech icons for modern background
    const techIconSymbols = ['⚡', '🔧', '⚙️', '💻', '🚀', '⭐', '🔥', '💎'];
    const iconCount = isMobile ? 4 : 8;
    const icons = Array.from({ length: iconCount }, (_, i) => ({
      id: i,
      icon: techIconSymbols[i % techIconSymbols.length],
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      delay: Math.random() * 20,
    }));
    setTechIcons(icons);
  }, [isMobile, isTablet]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Tech Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b1e] via-[#1a1b2e] to-[#0a0b1e]">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(79, 195, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 195, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }} />
        </div>
        
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M20 20h160M20 60h40m80 0h60M20 100h60m80 0h40M20 140h160M20 180h40m80 0h60" 
                      stroke="rgba(79, 195, 247, 0.3)" strokeWidth="1" fill="none"/>
                <circle cx="60" cy="60" r="3" fill="rgba(79, 195, 247, 0.4)"/>
                <circle cx="140" cy="100" r="3" fill="rgba(79, 195, 247, 0.4)"/>
                <circle cx="60" cy="140" r="3" fill="rgba(79, 195, 247, 0.4)"/>
                <rect x="95" y="95" width="10" height="10" fill="rgba(79, 195, 247, 0.3)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/15 via-transparent to-transparent" style={{ backgroundPosition: '70% 80%' }} />
        
        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute right-1/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
      </div>

      {/* Subtle Geometric Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Geometric Shapes */}
        {geometricShapes.map((shape) => (
          <GeometricShape
            key={shape.id}
            type={shape.type}
            delay={shape.delay}
            x={shape.x}
            y={shape.y}
          />
        ))}
        
        {/* Connecting Lines */}
        {connectingLines.map((line) => (
          <ConnectingLine
            key={line.id}
            delay={line.delay}
            startX={line.startX}
            startY={line.startY}
            endX={line.endX}
            endY={line.endY}
          />
        ))}
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <FloatingParticle key={particle} delay={particle * 2} />
        ))}
        
        {/* Floating Tech Icons */}
        {techIcons.map((techIcon) => (
          <FloatingTechIcon
            key={techIcon.id}
            delay={techIcon.delay}
            x={techIcon.x}
            y={techIcon.y}
            icon={techIcon.icon}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className={getResponsiveClasses(
        "container mx-auto text-center z-10 relative flex items-center justify-center h-full",
        {
          sm: "px-4 py-8",
          md: "px-6 py-12",
          lg: "px-6 py-16"
        }
      )}>
        <motion.div 
          className={getResponsiveClasses(
            "mx-auto animate-optimized",
            {
              sm: "max-w-3xl",
              md: "max-w-4xl", 
              lg: "max-w-5xl",
              xl: "max-w-6xl"
            }
          )}
          variants={createAccessibleVariants({
            hidden: { opacity: 0, y: isMobile ? 20 : 30 },
            visible: { opacity: 1, y: 0 }
          }, {
            respectReducedMotion: true,
            fallbackDuration: 0.3,
            enablePerformanceOptimizations: true
          })}
          initial="hidden"
          animate="visible"
          transition={{ duration: prefersReducedMotion || isMobile ? 0.3 : 0.8, delay: 0.2 }}
          aria-label="LogiQ Algorithm Visualizer main content"
        >
          {/* Main Title - Bright Blue */}
          <motion.h1 
            className={getResponsiveClasses(
              "font-bold leading-tight animate-optimized",
              {
                sm: "text-4xl mb-4",
                md: "text-5xl mb-5", 
                lg: "text-6xl mb-6",
                xl: "text-7xl mb-6",
                "2xl": "text-8xl mb-6"
              }
            )}
            variants={createAccessibleVariants({
              hidden: { opacity: 0, y: isMobile ? 15 : 20 },
              visible: { opacity: 1, y: 0 }
            }, {
              respectReducedMotion: true,
              fallbackDuration: 0.3,
              enablePerformanceOptimizations: true
            })}
            initial="hidden"
            animate="visible"
            transition={{ duration: prefersReducedMotion || isMobile ? 0.3 : 0.8, delay: 0.2 }}
          >
            <span className="text-[#4FC3F7] font-extrabold block">
              Visualize Algorithms
            </span>
            <span className="text-white block">
              Like Never Before
            </span>
          </motion.h1>
          
          {/* Subtitle - White Text */}
          <motion.p
            className={getResponsiveClasses(
              "text-white mx-auto leading-relaxed animate-optimized",
              {
                sm: "text-lg mb-8 max-w-3xl px-2",
                md: "text-xl mb-9 max-w-3xl",
                lg: "text-2xl mb-10 max-w-4xl",
                xl: "text-3xl mb-10 max-w-4xl"
              }
            )}
            variants={createAccessibleVariants({
              hidden: { opacity: 0, y: isMobile ? 15 : 20 },
              visible: { opacity: 1, y: 0 }
            }, {
              respectReducedMotion: true,
              fallbackDuration: 0.3,
              enablePerformanceOptimizations: true
            })}
            initial="hidden"
            animate="visible"
            transition={{ duration: prefersReducedMotion || isMobile ? 0.3 : 0.8, delay: 0.4 }}
          >
            Advanced algorithm visualization and benchmarking platform for students, educators, developers, and interview preparation.
          </motion.p>


          {/* Action Buttons */}
          <motion.div
            className={getResponsiveClasses(
              "flex flex-wrap justify-center gap-4 animate-optimized",
              {
                sm: "mb-8 px-4",
                md: "mb-10 px-0",
                lg: "mb-12"
              }
            )}
            variants={createAccessibleVariants({
              hidden: { opacity: 0, y: isMobile ? 15 : 20 },
              visible: { opacity: 1, y: 0 }
            }, {
              respectReducedMotion: true,
              fallbackDuration: 0.3,
              enablePerformanceOptimizations: true
            })}
            initial="hidden"
            animate="visible"
            transition={{ duration: prefersReducedMotion || isMobile ? 0.3 : 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              size={isMobile ? "default" : "lg"}
              className="bg-gradient-to-r from-[#4FC3F7] to-[#29B6F6] hover:from-[#29B6F6] hover:to-[#0288D1] text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              <Link to="/algorithm-visualizer" className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Algorithm Visualizer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            
            <Button
              asChild
              size={isMobile ? "default" : "lg"}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold transition-all duration-300"
            >
              <Link to="/algorithm-visualizer/compare" className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Compare Algorithms
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Feature Highlights - White Text */}
          <motion.div
            className={getResponsiveClasses(
              "flex flex-wrap justify-center text-white animate-optimized",
              {
                sm: "gap-3 text-xs px-4",
                md: "gap-4 text-sm px-0",
                lg: "gap-6 text-sm"
              }
            )}
            variants={createAccessibleVariants({
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }, {
              respectReducedMotion: true,
              fallbackDuration: 0.3,
              enablePerformanceOptimizations: true
            })}
            initial="hidden"
            animate="visible"
            transition={{ delay: prefersReducedMotion || isMobile ? 0.8 : 1.0 }}
            role="list"
            aria-label="Key features"
          >
            {["Real-time Visualization", "Performance Analytics", "Interactive Learning"].map((feature, index) => (
              <motion.div
                key={feature}
                className={getResponsiveClasses(
                  "flex items-center gap-2 rounded-full bg-white/10 border border-white/20 animate-optimized",
                  {
                    sm: "px-2 py-1 text-xs",
                    md: "px-3 py-1 text-sm"
                  }
                )}
                variants={createAccessibleVariants({
                  hidden: { opacity: 0, x: isMobile ? -10 : -20 },
                  visible: { opacity: 1, x: 0 }
                }, {
                  respectReducedMotion: true,
                  fallbackDuration: 0.3,
                  enablePerformanceOptimizations: true
                })}
                initial="hidden"
                animate="visible"
                transition={{ delay: (prefersReducedMotion || isMobile ? 1.0 : 1.2) + index * 0.1 }}
                role="listitem"
              >
                <div 
                  className={`w-2 h-2 bg-[#4FC3F7] rounded-full ${prefersReducedMotion || isMobile ? '' : 'animate-pulse'}`}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default HeroSection;
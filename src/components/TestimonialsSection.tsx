import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ScrollReveal, ScrollSectionHeader } from "@/components/ui/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Computer Science Student",
    avatar: "AR",
    content: "The visualizer made complex data structures like AVL trees finally click for me. An essential tool for any CS student aiming for top-tier companies.",
    rating: 5
  },
  {
    name: "Samantha Chen",
    role: "Software Engineer",
    content: "As a software engineer, I use this platform to refresh my knowledge on algorithms before interviews. The step-by-step visualizations are incredibly effective.",
    rating: 5
  },
  {
    name: "Dr. Alan Grant",
    role: "Professor, CS Department",
    content: "An excellent pedagogical tool. Visual learning is powerful, and this platform harnesses it perfectly for computer science education.",
    rating: 5
  },
  {
    name: "Maria Santos",
    role: "Tech Interview Coach",
    content: "Preparing for FAANG interviews was daunting. This visualizer was my secret weapon for mastering dynamic programming and graph algorithms.",
    rating: 5
  },
  {
    name: "Leo Martinez",
    role: "Computer Science Student",
    content: "The ability to control the pace of the visualization is key. I can slow down complex steps to really understand what's happening under the hood.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, prefersReducedMotion]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Touch/swipe handlers
  const handleDragStart = () => {
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      prevTestimonial();
    } else if (info.offset.x < -threshold) {
      nextTestimonial();
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex justify-center mb-6">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-5 h-5 ${
            i < rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-600 text-gray-600'
          }`} 
        />
      ))}
    </div>
  );

  const UserAvatar = ({ name, className = "" }: { name: string; className?: string }) => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <Avatar className={className}>
        <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-white font-semibold border border-cyan-500/30">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  };

  // Calculate the transform offset for smooth scrolling
  const getTransformOffset = () => {
    const cardWidth = 320; // 80 * 4 (w-80 = 320px)
    const gap = 32; // gap-8 = 32px
    const totalCardWidth = cardWidth + gap;
    return -(currentIndex * totalCardWidth);
  };

  // Get the scale and opacity for each card based on its position
  const getCardStyle = (index: number) => {
    const distance = Math.abs(index - currentIndex);
    const isCenter = distance === 0;
    const isAdjacent = distance === 1;
    
    return {
      scale: isCenter ? 1 : isAdjacent ? 0.85 : 0.7,
      opacity: isCenter ? 1 : isAdjacent ? 0.6 : 0.3,
      y: isCenter ? 0 : isAdjacent ? 20 : 40,
      zIndex: isCenter ? 10 : isAdjacent ? 5 : 1
    };
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollSectionHeader className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Loved by Developers and Educators
            </h2>
            <ScrollReveal variant="fadeUp" delay={0.3}>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Our platform is trusted by students, software engineers, and computer science professors for mastering algorithms.
              </p>
            </ScrollReveal>
          </ScrollSectionHeader>

          {/* Clean Testimonial Layout */}
          <ScrollReveal variant="fadeUp" delay={0.4}>
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Three Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16">
                {[0, 1, 2].map((offset) => {
                  const testimonialIndex = (currentIndex + offset - 1 + testimonials.length) % testimonials.length;
                  const testimonial = testimonials[testimonialIndex];
                  const isCenter = offset === 1;
                  
                  return (
                    <motion.div
                      key={`${testimonialIndex}-${offset}`}
                      className={`text-center p-8 rounded-xl border-2 backdrop-blur-sm transition-all duration-500 ${
                        isCenter 
                          ? 'border-cyan-400/50 bg-slate-800/30 shadow-2xl shadow-cyan-500/10' 
                          : 'border-slate-600/60 bg-slate-800/15 shadow-lg shadow-black/20'
                      }`}
                      animate={{
                        opacity: isCenter ? 1 : 0.5,
                        scale: isCenter ? 1.02 : 0.92,
                        y: isCenter ? -5 : 15,
                        rotateY: isCenter ? 0 : offset === 0 ? -2 : 2
                      }}
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      onClick={() => !isCenter && goToTestimonial(testimonialIndex)}
                      style={{ cursor: !isCenter ? 'pointer' : 'default' }}
                      whileHover={!isCenter ? {
                        scale: 0.95,
                        y: 10,
                        transition: { duration: 0.3 }
                      } : {}}
                    >
                      {/* Large Quote Mark */}
                      <motion.div 
                        className={`text-6xl font-serif mb-6 ${
                          isCenter ? 'text-cyan-400' : 'text-slate-600'
                        }`}
                        animate={{
                          scale: isCenter ? 1.1 : 1,
                          opacity: isCenter ? 1 : 0.7
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        "
                      </motion.div>
                      
                      {/* Avatar */}
                      <motion.div 
                        className="mb-6 flex justify-center"
                        animate={{
                          scale: isCenter ? 1.05 : 1,
                          y: isCenter ? -2 : 0
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <UserAvatar 
                          name={testimonial.name} 
                          className={`${isCenter ? 'w-20 h-20' : 'w-16 h-16'} transition-all duration-500 ${
                            isCenter ? 'ring-2 ring-cyan-400/30 ring-offset-2 ring-offset-slate-800' : ''
                          }`} 
                        />
                      </motion.div>
                      
                      {/* Quote Text */}
                      <motion.blockquote 
                        className={`mb-6 leading-relaxed ${
                          isCenter ? 'text-white text-base' : 'text-slate-400 text-sm'
                        } min-h-[120px] flex items-center`}
                        animate={{
                          opacity: isCenter ? 1 : 0.8,
                          scale: isCenter ? 1 : 0.98
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <p>
                          {testimonial.content}
                        </p>
                      </motion.blockquote>
                      
                      {/* Star Rating */}
                      <motion.div 
                        className="flex justify-center mb-4"
                        animate={{
                          scale: isCenter ? 1.1 : 1,
                          opacity: isCenter ? 1 : 0.7
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 fill-yellow-400 text-yellow-400 transition-all duration-500 ${
                              isCenter ? 'drop-shadow-sm' : ''
                            }`} 
                          />
                        ))}
                      </motion.div>
                      
                      {/* User Info */}
                      <motion.div 
                        className={`${
                          isCenter ? 'text-white' : 'text-slate-400'
                        }`}
                        animate={{
                          opacity: isCenter ? 1 : 0.8,
                          y: isCenter ? 0 : 2
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="font-semibold text-lg mb-1">
                          {testimonial.name}
                        </div>
                        <div className="text-sm opacity-80">
                          {testimonial.role}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>


            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
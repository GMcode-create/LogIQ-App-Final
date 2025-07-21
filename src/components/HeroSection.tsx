import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-code-pattern overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-32 bg-card/30 rounded-lg p-4 transform -rotate-12 backdrop-blur-sm border border-border/50">
          <div className="text-xs text-muted-foreground font-mono">
            function dijkstra(graph, start) {"{"}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            {"  "}// ... implementation ...
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {"}"}
          </div>
        </div>
        
        <div className="absolute bottom-32 right-20 w-48 h-24 bg-card/30 rounded-lg p-3 transform rotate-6 backdrop-blur-sm border border-border/50">
          <div className="text-xs text-muted-foreground font-mono">
            public class Node {"{"}
          </div>
          <div className="text-xs text-muted-foreground font-mono mt-1">
            {"  "}int key;
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {"  "}Node left, right;
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {"}"}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Visualize Algorithms</span>
            <br />
            <span className="text-foreground">Like Never Before</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced algorithm visualization and benchmarking platform for students, educators, 
            developers, and interview preparation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="group">
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Visualizing
            </Button>
            <Button variant="outline-glow" size="xl">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Issue Indicator */}
      <div className="absolute bottom-8 left-8">
        <div className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-destructive rounded-full"></div>
          1 Issue
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, Suspense } from "react";
import Index from "./pages/Index";
import AlgorithmVisualizer from "./pages/AlgorithmVisualizer";
import NotFound from "./pages/NotFound";
import { startPerformanceMonitoring, runFullDiagnostics } from "@/lib/performance-monitor";
import { initializeBrowserCompatibility } from "@/lib/cross-browser-test";
import { PerformanceOptimizationProvider } from "@/hooks/use-performance-optimization";
import { AnimationErrorProvider } from "@/components/ui/animation-error-boundary";
import { preloadCriticalAnimations } from "@/lib/lazy-animation-loader";
import "./styles/button-fixes.css";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    try {
      // Initialize browser compatibility testing
      initializeBrowserCompatibility();
      
      // Preload critical animations
      preloadCriticalAnimations().catch(error => {
        console.warn('Failed to preload critical animations:', error);
      });
      
      // Start performance monitoring in development
      if (import.meta.env.DEV) {
        startPerformanceMonitoring();
        
        // Run diagnostics after initial load
        const timer = setTimeout(() => {
          runFullDiagnostics();
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('App initialization error:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimationErrorProvider>
        <PerformanceOptimizationProvider
          options={{
            enableAdaptiveMode: true,
            enableMemoryManagement: true,
            enableProgressiveLoading: true,
            enablePerformanceMonitoring: import.meta.env.DEV,
          }}
        >
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={
                <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                  <div className="loading-skeleton w-32 h-8 rounded"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/algorithm-visualizer/*" element={<AlgorithmVisualizer />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </PerformanceOptimizationProvider>
      </AnimationErrorProvider>
    </QueryClientProvider>
  );
};

export default App;

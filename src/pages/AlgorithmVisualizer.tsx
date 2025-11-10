import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TutorialProvider } from "@/contexts/TutorialContext";


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import LeftTutorialPanel from "@/components/ui/LeftTutorialPanel";
import Compare from "@/components/url-mirror-tool/Compare";
import CustomBuilder from "@/components/url-mirror-tool/CustomBuilder";
import NotFound from "@/components/url-mirror-tool/NotFound";
import Index from "@/components/url-mirror-tool/Index";

const queryClient = new QueryClient();

const AlgorithmVisualizer = () => {
  console.log("Algorithm Visualizer is rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TutorialProvider>
          <Toaster />
          <Sonner />
          <LeftTutorialPanel />
          <Routes>
            <Route index element={<Index />} />
            <Route path="compare" element={<Compare />} />
            <Route path="custom" element={<CustomBuilder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TutorialProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AlgorithmVisualizer;
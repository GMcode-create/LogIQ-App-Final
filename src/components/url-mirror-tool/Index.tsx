
import Navigation from "@/components/Navigation";
import AlgorithmVisualizer from "@/components/AlgorithmVisualizer";
import { useGlobalKeyboardShortcuts, createNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // Navigation shortcuts
  const navigationShortcuts = createNavigationShortcuts({
    goToHome: () => navigate('/'),
    goToVisualizer: () => navigate('/algorithm-visualizer'),
    goToCompare: () => navigate('/algorithm-visualizer/compare'),
    goToCustom: () => navigate('/algorithm-visualizer/custom'),
  });

  useGlobalKeyboardShortcuts(navigationShortcuts);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <div className="pt-16"> {/* Added padding top to account for fixed nav */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-[length:200%_200%] animate-gradient mb-4">
              ALGORITHM VISUALIZER
            </h1>
            <p className="text-xl text-gray-300">
              Visualize algorithms with interactive step-by-step execution
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <AlgorithmVisualizer />
        </div>
      </div>
    </div>
  );
};

export default Index;

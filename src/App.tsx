import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

// Simple test component to verify the app works
const TestIndex = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            LogIQ Algorithm Flow
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Advanced algorithm visualization and benchmarking platform
          </p>
          <div className="space-y-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
            <div className="mt-8">
              <p className="text-gray-400">
                Visualize algorithms • Compare performance • Learn interactively
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="animate-pulse bg-gray-300 w-32 h-8 rounded"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<TestIndex />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl">Page Not Found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

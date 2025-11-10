import { BrowserRouter, Routes, Route } from "react-router-dom";

const SimpleHome = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">LogiQ</h1>
      <p className="text-slate-300 mb-8">Algorithm Visualization Platform</p>
      <a 
        href="/algorithm-visualizer" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Go to Visualizer
      </a>
    </div>
  </div>
);

const SimpleVisualizer = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Algorithm Visualizer</h1>
      <p className="text-slate-300 mb-8">Visualizer will be loaded here</p>
      <a 
        href="/" 
        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Back to Home
      </a>
    </div>
  </div>
);

const SimpleApp = () => {
  console.log('🎯 SimpleApp rendering...');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleHome />} />
        <Route path="/algorithm-visualizer" element={<SimpleVisualizer />} />
        <Route path="*" element={<SimpleHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default SimpleApp;
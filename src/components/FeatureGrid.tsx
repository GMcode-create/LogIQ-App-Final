import React from 'react';
import { Activity, GitCompare, Code, BarChart3 } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    {
      icon: Activity,
      title: 'Interactive Visualizer',
      description: 'Watch algorithms come to life. Step through code execution and understand complex logic with interactive, animated visualizations.',
    },
    {
      icon: GitCompare,
      title: 'Algorithm Comparison',
      description: 'Run algorithms side-by-side. Compare their performance, step count, and efficiency on the same dataset in real-time.',
    },
    {
      icon: Code,
      title: 'Custom Algorithm Builder',
      description: 'Bring your own algorithms. Use our intuitive builder to write, import, and visualize your custom logic seamlessly.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Get detailed insights. Analyze time and space complexity with comprehensive charts and metrics for every algorithm run.',
    },
  ];

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-1"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(6,182,212,0.05) 0%, transparent 50%),
                  linear-gradient(45deg, transparent 25%, rgba(6,182,212,0.02) 25%, rgba(6,182,212,0.02) 50%, transparent 50%, transparent 75%, rgba(6,182,212,0.02) 75%),
                  linear-gradient(-45deg, transparent 25%, rgba(6,182,212,0.02) 25%, rgba(6,182,212,0.02) 50%, transparent 50%, transparent 75%, rgba(6,182,212,0.02) 75%)
                `,
                backgroundSize: '100% 100%, 20px 20px, 20px 20px',
              }}
            >
              {/* Vertical accent bar */}
              <div className="absolute left-0 top-6 w-1 h-6 bg-slate-600 rounded-r transition-all duration-300 group-hover:bg-cyan-400 group-hover:h-8 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              
              {/* Icon */}
              <div className="mb-4">
                <feature.icon className="w-8 h-8 text-pink-400 stroke-[1.5]" />
              </div>
              
              {/* Content */}
              <div className="transition-transform duration-300 group-hover:translate-x-2">
                <h3 className="text-xl font-semibold text-white mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
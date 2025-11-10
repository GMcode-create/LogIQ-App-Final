
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TutorialMenu from "@/components/ui/TutorialMenu";

import { Home, Scale, Code, Play, Code2 } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Visualizer", path: "/algorithm-visualizer", icon: Play },
    { name: "Compare", path: "/algorithm-visualizer/compare", icon: Scale },
    { name: "Custom Code", path: "/algorithm-visualizer/custom", icon: Code },
  ];

  return (
    <>
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-6">
        <div className="bg-slate-900/70 backdrop-blur-md rounded-full border border-slate-800/50 shadow-2xl">
          <div className="flex items-center justify-between px-8 py-3">
            {/* Logo and Title - Left Side */}
            <NavLink to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">LogiQ</h1>
            </NavLink>
            
            {/* Navigation Items - Center */}
            <nav className="bg-slate-800/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-700/50 shadow-xl">
              <div className="flex space-x-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/" || item.path === "/algorithm-visualizer"}
                      className={() => {
                        // Custom logic to handle nested routes properly
                        const currentPath = location.pathname;
                        let isCurrentlyActive = false;
                        
                        if (item.path === "/") {
                          isCurrentlyActive = currentPath === "/";
                        } else if (item.path === "/algorithm-visualizer") {
                          isCurrentlyActive = currentPath === "/algorithm-visualizer" || currentPath === "/algorithm-visualizer/";
                        } else if (item.path === "/algorithm-visualizer/compare") {
                          isCurrentlyActive = currentPath === "/algorithm-visualizer/compare";
                        } else if (item.path === "/algorithm-visualizer/custom") {
                          isCurrentlyActive = currentPath === "/algorithm-visualizer/custom";
                        } else {
                          isCurrentlyActive = currentPath === item.path;
                        }
                        
                        return cn(
                          "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 relative overflow-hidden",
                          isCurrentlyActive
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                            : "text-gray-300 hover:text-white hover:bg-slate-700/50"
                        );
                      }}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-semibold">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            {/* Tutorial Menu - Right Side */}
            <div className="flex items-center space-x-3">
              <TutorialMenu />
            </div>
          </div>
        </div>
      </header>


    </>
  );
};

export default Navigation;


import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import TutorialMenu from "@/components/ui/TutorialMenu";

import { User, LogOut, Home, Scale, Code, Play } from "lucide-react";

const Navigation = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { name: "Visualizer", path: "/", icon: Play },
    { name: "Compare", path: "/compare", icon: Scale },
    { name: "Custom Code", path: "/custom", icon: Code },
  ];

  return (
    <>
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-6">
        <div className="bg-slate-900/70 backdrop-blur-md rounded-full border border-slate-800/50 shadow-2xl">
          <div className="flex items-center justify-between px-8 py-3">
            {/* Logo and Title - Left Side */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">LogIQ</h1>
            </div>
            
            {/* Navigation Items - Center */}
            <nav className="bg-slate-800/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-700/50 shadow-xl">
              <div className="flex space-x-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) =>
                        cn(
                          "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 relative overflow-hidden",
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                            : "text-gray-300 hover:text-white hover:bg-slate-700/50"
                        )
                      }
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-semibold">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>

            {/* Authentication Section - Right Side */}
            <div className="flex items-center space-x-3">
              {/* Tutorial Menu */}
              <TutorialMenu />

              {/* Authentication */}
              {user ? (
                <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-700/50 shadow-xl">
                  <div className="flex items-center space-x-2 px-4 py-2 text-white">
                    {user.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.provider === 'google' && (
                      <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full">Google</span>
                    )}
                  </div>
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-full px-3 py-2 transition-smooth"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-2 text-sm font-medium transition-smooth"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navigation;

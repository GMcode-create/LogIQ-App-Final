import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBreakpoint, useTouchDevice, getResponsiveClasses, getTouchTargetStyles } from "@/lib/responsive-utils";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isMobile = useIsMobile();
  const { currentBreakpoint } = useBreakpoint();
  const { isTouchDevice, hasHover } = useTouchDevice();
  const location = useLocation();

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  // Track active section for navigation indicators (only on home page)
  useEffect(() => {
    // Clear active section when not on home page
    if (location.pathname !== '/') {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const sections = ['hero', 'features', 'demo', 'performance', 'testimonials'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const navigationLinks = [
    { href: "#features", label: "Features", section: "features" },
    { href: "#demo", label: "Demo", section: "demo" },
    { href: "#performance", label: "Performance", section: "performance" },
    { href: "#testimonials", label: "About", section: "testimonials" },
  ];

  const appLinks = [
    { href: "/algorithm-visualizer", label: "Algorithm Visualizer" },
  ];

  // Helper function to determine if a navigation item should be highlighted
  const isNavItemActive = (type: 'section' | 'route', identifier: string) => {
    if (type === 'section') {
      // Only highlight sections when on home page
      return location.pathname === '/' && activeSection === identifier;
    } else {
      // Only highlight routes when not on home page or when explicitly on that route
      return location.pathname === identifier;
    }
  };

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800/50 shadow-lg navbar-stable">
      <div className={getResponsiveClasses(
        "container mx-auto flex items-center justify-between",
        {
          sm: "px-4 h-14",
          md: "px-6 h-16"
        }
      )}>
        {/* Logo and Brand */}
        <Link to="/" className={getResponsiveClasses(
          "flex items-center hover:opacity-80 transition-opacity duration-300",
          {
            sm: "gap-2",
            md: "gap-3"
          }
        )}>
          <div className={getResponsiveClasses(
            "bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25",
            {
              sm: "w-8 h-8",
              md: "w-10 h-10"
            }
          )}>
            <Code2 className={getResponsiveClasses(
              "text-white",
              {
                sm: "w-5 h-5",
                md: "w-6 h-6"
              }
            )} />
          </div>
          <span className={getResponsiveClasses(
            "font-bold text-white",
            {
              sm: "text-lg",
              md: "text-xl"
            }
          )}>LogiQ</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className={getResponsiveClasses(
          "hidden items-center justify-center flex-1",
          {
            md: "flex gap-6",
            lg: "flex gap-8"
          }
        )}>
          {/* Main navigation links (only show on home page) */}
          {location.pathname === '/' && navigationLinks.map((link) => (
            <a
              key={link.section}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className={`relative text-sm font-medium transition-all duration-300 group px-3 py-2 rounded-lg ${
                isNavItemActive('section', link.section)
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
              style={getTouchTargetStyles(isTouchDevice)}
            >
              {link.label}
              {/* Active indicator */}
              <span
                className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
                  isNavItemActive('section', link.section) ? "w-6" : "w-0 group-hover:w-6"
                }`}
              />
            </a>
          ))}
          
          {/* App navigation links */}
          {appLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative text-sm font-medium transition-all duration-300 group px-3 py-2 rounded-lg ${
                isNavItemActive('route', link.href)
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
              style={getTouchTargetStyles(isTouchDevice)}
            >
              {link.label}
              {/* Active indicator */}
              <span
                className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
                  isNavItemActive('route', link.href) ? "w-6" : "w-0 group-hover:w-6"
                }`}
              />
            </Link>
          ))}
        </div>
        
        {/* Desktop CTA Button */}
        <div className={getResponsiveClasses(
          "hidden items-center",
          {
            md: "flex"
          }
        )}>
          <Button 
            asChild
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 overflow-fix"
            style={getTouchTargetStyles(isTouchDevice)}
          >
            <Link to="/algorithm-visualizer">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-slate-800/50 overflow-fix"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          style={getTouchTargetStyles(isTouchDevice)}
        >
          {isMenuOpen ? (
            <X className={getResponsiveClasses("", {
              sm: "w-5 h-5",
              md: "w-6 h-6"
            })} />
          ) : (
            <Menu className={getResponsiveClasses("", {
              sm: "w-5 h-5", 
              md: "w-6 h-6"
            })} />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700/50">
          <div className={getResponsiveClasses(
            "container mx-auto space-y-2",
            {
              sm: "px-4 py-4",
              md: "px-6 py-4"
            }
          )}>
            {/* Mobile Navigation Links */}
            {location.pathname === '/' && navigationLinks.map((link) => (
              <a
                key={link.section}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`block font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                  isNavItemActive('section', link.section)
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                style={{
                  ...getTouchTargetStyles(isTouchDevice),
                  fontSize: isTouchDevice ? '16px' : '14px'
                }}
              >
                {link.label}
              </a>
            ))}
            
            {/* Mobile App Links */}
            {appLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                  isNavItemActive('route', link.href)
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                style={{
                  ...getTouchTargetStyles(isTouchDevice),
                  fontSize: isTouchDevice ? '16px' : '14px'
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile CTA Button */}
            <div className={getResponsiveClasses(
              "border-t border-slate-700/50 pt-3",
              {
                sm: "pt-3",
                md: "pt-4"
              }
            )}>
              <Button 
                asChild
                size="sm"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 overflow-fix"
                style={{
                  ...getTouchTargetStyles(isTouchDevice),
                  fontSize: isTouchDevice ? '16px' : '14px'
                }}
              >
                <Link to="/algorithm-visualizer">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
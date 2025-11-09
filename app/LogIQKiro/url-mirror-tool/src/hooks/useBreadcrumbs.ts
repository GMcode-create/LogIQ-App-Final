import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
}

export const useBreadcrumbs = () => {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    
    // Build breadcrumbs based on URL segments
    const crumbs: BreadcrumbItem[] = [];
    
    // Always start with home if not on home page
    if (pathname !== '/') {
      crumbs.push({
        label: 'Home',
        path: '/',
        description: 'Algorithm Visualizer Home'
      });
    }

    // Build path progressively
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map segments to readable labels
      const segmentLabels: Record<string, { label: string; description: string }> = {
        'compare': {
          label: 'Algorithm Comparison',
          description: 'Side-by-side algorithm performance comparison'
        },
        'custom': {
          label: 'Custom Builder',
          description: 'Build and test your own algorithms'
        }
      };

      const segmentInfo = segmentLabels[segment];
      if (segmentInfo) {
        crumbs.push({
          label: segmentInfo.label,
          path: currentPath,
          description: segmentInfo.description
        });
      }
    });

    return crumbs;
  }, [location.pathname]);

  return {
    breadcrumbs,
    currentPath: location.pathname,
    isHomePage: location.pathname === '/'
  };
};

export default useBreadcrumbs;
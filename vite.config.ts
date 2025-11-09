import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate animation libraries into their own chunks
          'framer-motion': ['framer-motion'],
          'animations': [
            './src/lib/animations.ts',
            './src/lib/animation-utils.ts',
            './src/hooks/use-scroll-animation.tsx'
          ],
          'animation-components': [
            './src/components/ui/animated-container.tsx',
            './src/components/ui/animated-button.tsx',
            './src/components/ui/scroll-reveal.tsx',
            './src/components/ui/animated-progress.tsx'
          ],
          'performance-monitoring': [
            './src/lib/performance-monitor.ts',
            './src/lib/animation-performance-monitor.ts'
          ]
        }
      }
    },
    // Optimize chunk size limits
    chunkSizeWarningLimit: 1000,
    // Enable minification for better performance
    minify: mode === 'production' ? 'esbuild' : false
  }
}));

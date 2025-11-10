import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp.tsx'
import './index.css'

console.log('🚀 Simple main.tsx is loading...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Root element found, rendering simple app...');
  
  try {
    createRoot(rootElement).render(<SimpleApp />);
    console.log('✅ Simple app rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering simple app:', error);
  }
}
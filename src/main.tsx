import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

// Add console log to verify the script is loading
console.log('🚀 Main.tsx is loading...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: Arial;">Error: Root element not found. Please check your HTML.</div>';
} else {
  console.log('✅ Root element found, rendering app...');
  
  try {
    createRoot(rootElement).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    console.log('✅ App rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    rootElement.innerHTML = `<div style="color: red; padding: 20px; font-family: Arial;">Error rendering app: ${error.message}</div>`;
  }
}

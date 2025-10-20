import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

try {
  console.log('Starting React initialization');
  const rootElement = document.getElementById("root");
  console.log('Root element:', rootElement);
  
  if (!rootElement) {
    throw new Error('Could not find root element');
  }

  const root = createRoot(rootElement);
  console.log('Root created');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Render called');
} catch (err) {
  const error = err as Error;
  console.error('Error initializing React:', error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
}

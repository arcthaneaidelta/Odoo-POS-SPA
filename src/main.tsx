import React from 'react';
import ReactDOM from 'react-dom/client';
import { DemoProvider } from './context/DemoContext';
import { App } from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DemoProvider>
      <App />
    </DemoProvider>
  </React.StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// replace Tailwind import with the new global stylesheet
import './assets/styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
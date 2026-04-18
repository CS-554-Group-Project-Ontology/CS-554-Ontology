import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import fbconfig from './firebase/FirebaseConfig';
import './index.css';
import App from './App.tsx';

initializeApp(fbconfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

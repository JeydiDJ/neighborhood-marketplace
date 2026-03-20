import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Tailwind first
import './styles/tailwind.css';

// Optional: your global CSS
import './styles/index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measuring
reportWebVitals();
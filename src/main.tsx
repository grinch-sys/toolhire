import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DBProvider } from './state/db';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <DBProvider>
        <App />
      </DBProvider>
    </BrowserRouter>
  </React.StrictMode>
);

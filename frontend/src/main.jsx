import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CustomerAuthProvider } from './context/CustomerAuthContext.jsx';
import './index.css';

// Falls back to an empty string if not configured - the Google button will
// simply not render / not function until a real client ID is supplied,
// without breaking the rest of the site.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <AuthProvider>
            <CustomerAuthProvider>
              <App />
            </CustomerAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

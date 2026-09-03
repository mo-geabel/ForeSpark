import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react';

let rawKey = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '').trim();
if (rawKey.startsWith('k_test_') || rawKey.startsWith('k_live_')) {
  rawKey = 'p' + rawKey;
}

const PUBLISHABLE_KEY = rawKey || 'pk_test_bWVhc3VyZWQtcmVkYmlyZC05NzI1LmNsZXJrLmFjY291bnRzLmRldiQ';

if (!PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)

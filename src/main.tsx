import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SharePage } from './components/SharePage.tsx'
import './index.css'

/* ─── Route detection: /p/:id → SharePage, else → App ─── */
const pathname = window.location.pathname;
const shareMatch = pathname.match(/^\/p\/([^/]+)/);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {shareMatch ? (
      <SharePage snippetId={shareMatch[1]} />
    ) : (
      <App />
    )}
  </React.StrictMode>,
)


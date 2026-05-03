import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// PostHog must import before App so init fires before first render
import './lib/posthog'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

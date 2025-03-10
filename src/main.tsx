import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PostHogProvider } from 'posthog-js/react'
import { AuthProvider } from './contexts/AuthContext'

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PostHogProvider 
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </PostHogProvider>
  </React.StrictMode>,
)

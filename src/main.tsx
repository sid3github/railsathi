import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/toast/ToastProvider'
import { LanguageProvider } from './i18n/LanguageProvider'
import { ErrorScreen } from './screens/ErrorScreen'
import { JourneyProvider } from './state/JourneyProvider'
import { router } from './router'
import '@fontsource-variable/dm-sans/standard.css'
import '@fontsource/dm-mono/latin-400.css'
// Devanagari is last in every font stack, so unicode-range means this only
// downloads when Hindi is actually on screen.
import '@fontsource-variable/noto-sans-devanagari/wght.css'
import './index.css'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ErrorBoundary fallback={<ErrorScreen />}>
        <ToastProvider>
          <JourneyProvider>
            <RouterProvider router={router} />
          </JourneyProvider>
        </ToastProvider>
      </ErrorBoundary>
    </LanguageProvider>
  </StrictMode>,
)

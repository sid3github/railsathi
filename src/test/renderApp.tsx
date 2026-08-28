import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ToastProvider } from '../components/toast/ToastProvider'
import { LanguageProvider } from '../i18n/LanguageProvider'
import { routes } from '../router'
import { JourneyProvider } from '../state/JourneyProvider'

/** Renders the real route tree at a given path, exactly as main.tsx composes it. */
export function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  const utils = render(
    <LanguageProvider>
      <ToastProvider>
        <JourneyProvider>
          <RouterProvider router={router} />
        </JourneyProvider>
      </ToastProvider>
    </LanguageProvider>,
  )
  return { ...utils, router, path: () => router.state.location.pathname }
}

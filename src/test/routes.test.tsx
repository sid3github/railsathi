import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROUTE_PATHS } from '../routeManifest'
import { renderApp } from './renderApp'

describe('route manifest', () => {
  // The build emits a static index.html for each of these paths so GitHub Pages
  // serves a 200. If a path here stopped resolving, deep links would silently
  // start rendering the not-found screen with a success status.
  it.each(ROUTE_PATHS)('%s resolves to a real screen, not the not-found page', path => {
    renderApp(path)
    expect(screen.queryByText(/that page has moved on without you/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('covers every journey screen the app can reach', () => {
    expect(ROUTE_PATHS).toEqual([
      '/',
      '/journey',
      '/journey/rebook',
      '/journey/rebook/confirmed',
      '/journey/refund',
      '/journey/refund/confirmed',
      '/journey/callback',
      '/journey/callback/confirmed',
    ])
  })
})

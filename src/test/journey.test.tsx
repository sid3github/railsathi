import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './renderApp'

describe('finding a plan from the home screen', () => {
  it('opens the journey when a valid PNR is submitted', async () => {
    const user = userEvent.setup()
    const app = renderApp('/')
    await user.click(screen.getByRole('button', { name: /view my plan/i }))
    await waitFor(() => expect(app.path()).toBe('/journey'))
  })

  it('keeps the passenger on the page and explains why when the PNR is too short', async () => {
    const user = userEvent.setup()
    const app = renderApp('/')
    const field = screen.getByRole('textbox', { name: /pnr/i })
    await user.clear(field)
    await user.type(field, '123')
    await user.click(screen.getByRole('button', { name: /view my plan/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/10 digits/i)
    expect(app.path()).toBe('/')
    expect(field).toHaveAttribute('aria-invalid', 'true')
  })

  it('asks for a PNR when the field is empty', async () => {
    const user = userEvent.setup()
    const app = renderApp('/')
    await user.clear(screen.getByRole('textbox', { name: /pnr/i }))
    await user.click(screen.getByRole('button', { name: /view my plan/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/enter a pnr/i)
    expect(app.path()).toBe('/')
  })

  it('clears the error as soon as the passenger starts correcting it', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const field = screen.getByRole('textbox', { name: /pnr/i })
    await user.clear(field)
    await user.click(screen.getByRole('button', { name: /view my plan/i }))
    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await user.type(field, '8')
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('offers the demo journey as a one-tap route in', async () => {
    const user = userEvent.setup()
    const app = renderApp('/')
    await user.click(screen.getByRole('button', { name: /use the demo journey/i }))
    await waitFor(() => expect(app.path()).toBe('/journey'))
  })
})

describe('the three journeys each reach a resolved outcome', () => {
  it('rebooking ends on a confirmed itinerary', async () => {
    const user = userEvent.setup()
    const app = renderApp('/journey')

    await user.click(screen.getByRole('link', { name: /see train options/i }))
    await waitFor(() => expect(app.path()).toBe('/journey/rebook'))

    await user.click(screen.getByRole('button', { name: /confirm my new plan/i }))
    await waitFor(() => expect(app.path()).toBe('/journey/rebook/confirmed'))
    expect(await screen.findByRole('heading', { level: 1, name: /you.re all set/i })).toBeInTheDocument()
  })

  it('the refund option opens the refund screen, not the train chooser', async () => {
    // Regression: this CTA used to navigate to /journey/rebook, so a passenger
    // asking for their money back was shown a list of trains instead.
    const user = userEvent.setup()
    const app = renderApp('/journey')

    await user.click(screen.getByRole('link', { name: /start my refund/i }))
    await waitFor(() => expect(app.path()).toBe('/journey/refund'))
    expect(app.path()).not.toBe('/journey/rebook')
  })

  it('a refund ends on a tracked refund', async () => {
    const user = userEvent.setup()
    const app = renderApp('/journey/refund')

    await user.click(screen.getByRole('button', { name: /confirm my refund/i }))
    await waitFor(() => expect(app.path()).toBe('/journey/refund/confirmed'))
    expect(await screen.findByRole('heading', { name: /is on its way/i })).toBeInTheDocument()
  })

  it('a callback ends on a booked call that repeats the choices made', async () => {
    const user = userEvent.setup()
    const app = renderApp('/journey')

    await user.click(screen.getByRole('link', { name: /request a callback/i }))
    await waitFor(() => expect(app.path()).toBe('/journey/callback'))

    await user.click(screen.getByRole('radio', { name: /english/i }))
    await user.click(screen.getByRole('radio', { name: /within an hour/i }))
    await user.click(screen.getByRole('button', { name: /request my callback/i }))

    await waitFor(() => expect(app.path()).toBe('/journey/callback/confirmed'))
    expect(await screen.findByText(/within an hour, in English/i)).toBeInTheDocument()
  })

  it('never asks for a password, OTP or payment detail anywhere in the callback flow', async () => {
    renderApp('/journey/callback')
    for (const field of screen.getAllByRole('radio')) {
      expect(field).toHaveAttribute('type', 'radio')
    }
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(document.querySelector('input[type="password"]')).toBeNull()
  })
})

describe('choosing an alternative train', () => {
  it('is exposed as a radio group with one option selected', () => {
    renderApp('/journey/rebook')
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    expect(radios.filter(r => r.getAttribute('aria-checked') === 'true')).toHaveLength(1)
  })

  it('updates the summary panel when a different train is chosen', async () => {
    const user = userEvent.setup()
    renderApp('/journey/rebook')

    await user.click(screen.getByRole('radio', { name: /duronto/i }))

    const panel = screen.getByRole('complementary')
    expect(panel).toHaveTextContent('22209')
    expect(panel).toHaveTextContent('₹340')
  })

  it('moves selection with the arrow keys, as a radio group should', async () => {
    const user = userEvent.setup()
    renderApp('/journey/rebook')

    const [first] = screen.getAllByRole('radio')
    first.focus()
    await user.keyboard('{ArrowDown}')

    expect(screen.getByRole('radio', { name: /duronto/i })).toHaveAttribute('aria-checked', 'true')
  })
})

describe('routing', () => {
  it.each([
    ['/journey', /your train has been/i],
    ['/journey/rebook', /ways to delhi/i],
    ['/journey/refund', /get your fare back/i],
    ['/journey/callback', /we.ll call you/i],
    ['/journey/rebook/confirmed', /you.re all set/i],
    ['/journey/refund/confirmed', /that.s sorted/i],
    ['/journey/callback/confirmed', /we.ll ring you shortly/i],
  ])('renders %s standalone, so a shared link works', async (path, expected) => {
    renderApp(path)
    expect(await screen.findByText(expected)).toBeInTheDocument()
  })

  it('shows a helpful page for an unknown route rather than a blank screen', async () => {
    renderApp('/this-route-does-not-exist')
    expect(await screen.findByText(/that page has moved on without you/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to the start/i })).toBeInTheDocument()
  })
})

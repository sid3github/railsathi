import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from './renderApp'

describe('choosing a language', () => {
  it('translates the page, not just a label', async () => {
    const user = userEvent.setup()
    renderApp('/journey')
    expect(screen.getByText(/your train has been/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /change language/i }))

    expect(await screen.findByText(/रद्द हो गई है।/)).toBeInTheDocument()
    expect(screen.queryByText(/your train has been/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'मेरी यात्रा' })).toBeInTheDocument()
  })

  it('tells assistive technology which language the page is in', async () => {
    const user = userEvent.setup()
    renderApp('/journey')
    expect(document.documentElement.lang).toBe('en-IN')

    await user.click(screen.getByRole('button', { name: /change language/i }))
    await waitFor(() => expect(document.documentElement.lang).toBe('hi-IN'))
  })

  it('remembers the choice for the next visit', async () => {
    const user = userEvent.setup()
    const first = renderApp('/journey')
    await user.click(screen.getByRole('button', { name: /change language/i }))
    await waitFor(() => expect(localStorage.getItem('railsathi.language')).toBe('hi'))
    first.unmount()

    renderApp('/journey')
    expect(await screen.findByText(/रद्द हो गई है।/)).toBeInTheDocument()
  })

  it('falls back to English when site data cannot be read', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied')
    })
    renderApp('/journey')
    expect(screen.getByText(/your train has been/i)).toBeInTheDocument()
    getItem.mockRestore()
  })
})

describe('the "why was it cancelled" dialog', () => {
  it('opens as a modal dialog with focus moved inside it', async () => {
    const user = userEvent.setup()
    renderApp('/journey')
    await user.click(screen.getByRole('button', { name: /why was it cancelled/i }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    expect(within(dialog).getByRole('heading')).toHaveTextContent(/why was this train cancelled/i)
  })

  it('closes on Escape and returns focus to whatever opened it', async () => {
    const user = userEvent.setup()
    renderApp('/journey')
    const trigger = screen.getByRole('button', { name: /why was it cancelled/i })
    await user.click(trigger)
    await screen.findByRole('dialog')

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.activeElement).toBe(trigger)
  })

  it('closes from its own button', async () => {
    const user = userEvent.setup()
    renderApp('/journey')
    await user.click(screen.getByRole('button', { name: /why was it cancelled/i }))
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /show my choices/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

describe('sharing and saving a plan', () => {
  it('copies the link and announces it politely when there is no share sheet', async () => {
    const user = userEvent.setup()
    // userEvent installs its own clipboard stub, so spy after setup, not before.
    const writeText = vi.spyOn(navigator.clipboard, 'writeText')
    renderApp('/journey/rebook/confirmed')

    await user.click(screen.getByRole('button', { name: /share my plan/i }))

    expect(writeText).toHaveBeenCalledWith(window.location.href)
    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent(/link copied/i)
  })

  it('uses the platform share sheet when the device has one', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: share, configurable: true, writable: true })
    const user = userEvent.setup()
    renderApp('/journey/rebook/confirmed')

    await user.click(screen.getByRole('button', { name: /share my plan/i }))

    expect(share).toHaveBeenCalled()
    Reflect.deleteProperty(navigator, 'share')
  })

  it('treats a dismissed share sheet as a choice, not an error', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError'))
    Object.defineProperty(navigator, 'share', { value: share, configurable: true, writable: true })
    const user = userEvent.setup()
    renderApp('/journey/rebook/confirmed')

    await user.click(screen.getByRole('button', { name: /share my plan/i }))

    await waitFor(() => expect(share).toHaveBeenCalled())
    expect(screen.queryByText(/could not share/i)).not.toBeInTheDocument()
    Reflect.deleteProperty(navigator, 'share')
  })

  it('saves the itinerary to the device and says so', async () => {
    const user = userEvent.setup()
    renderApp('/journey/rebook/confirmed')

    await user.click(screen.getByRole('button', { name: /save travel plan/i }))

    expect(JSON.parse(localStorage.getItem('railsathi.savedPlan') ?? '{}')).toMatchObject({ train: '12909' })
    expect(await screen.findByRole('status')).toHaveTextContent(/saved to this device/i)
  })
})

describe('journey progress', () => {
  it('marks the current step for assistive technology', () => {
    renderApp('/journey/rebook')
    const steps = screen.getAllByRole('listitem')
    const current = steps.filter(s => s.getAttribute('aria-current') === 'step')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent(/choose/i)
  })
})

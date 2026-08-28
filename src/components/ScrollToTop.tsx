import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Each screen is a fresh step in the journey, so it should start at the top —
 * except when a link points at an anchor, which should scroll to that section.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = prefersReducedMotion ? 'auto' : 'smooth'

    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior, block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior })
  }, [pathname, hash])

  return null
}

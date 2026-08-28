import { expect, test } from '@playwright/test'
import { findContrastFailures, goto, ROUTES, setLanguage, VIEWPORTS, type Language } from './helpers'

const LANGUAGES: Language[] = ['en', 'hi']

test.describe('colour contrast', () => {
  for (const language of LANGUAGES) {
    test(`every text node meets WCAG AA in ${language}`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktop)
      await goto(page, '/')
      await setLanguage(page, language)

      const problems: Record<string, unknown> = {}
      let checked = 0
      for (const path of ROUTES) {
        await goto(page, path)
        const result = await findContrastFailures(page)
        checked += result.checked
        if (result.failures.length) problems[path] = result.failures
      }
      expect(problems).toEqual({})
      // Guards against the audit silently measuring nothing.
      expect(checked).toBeGreaterThan(200)
    })
  }
})

test.describe('keyboard', () => {
  // Phase 1 converted several buttons to links and the focus rule still only
  // named button and input, so links had no visible ring. Scripted .focus() does
  // not trigger :focus-visible, so this has to be a real key press.
  test('a real Tab press gives links a visible focus ring', async ({ page }) => {
    await goto(page, '/journey')
    await page.keyboard.press('Tab')

    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      if (!el) return null
      const cs = getComputedStyle(el)
      return {
        tag: el.tagName,
        className: (el.className || '').toString(),
        focusVisible: el.matches(':focus-visible'),
        outlineStyle: cs.outlineStyle,
        outlineWidth: parseFloat(cs.outlineWidth),
      }
    })

    expect(focused?.tag).toBe('A')
    expect(focused?.className).toContain('skip-link')
    expect(focused?.focusVisible).toBe(true)
    expect(focused?.outlineStyle).not.toBe('none')
    expect(focused?.outlineWidth).toBeGreaterThanOrEqual(2)
  })

  test('the skip link jumps focus to the main content', async ({ page }) => {
    await goto(page, '/journey')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
  })

  test('the train chooser moves selection with the arrow keys', async ({ page }) => {
    await goto(page, '/journey/rebook')
    await page.getByRole('radio').first().focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('radio', { name: /duronto/i })).toHaveAttribute('aria-checked', 'true')
  })

  test('the dialog traps focus and restores it on Escape', async ({ page }) => {
    await goto(page, '/journey')
    const trigger = page.getByRole('button', { name: /why was it cancelled/i })
    await trigger.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true)

    // Tab past the end and focus should cycle back inside, not escape to the page.
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab')
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    expect(await trigger.evaluate(node => node === document.activeElement)).toBe(true)
  })
})

test.describe('touch targets', () => {
  test('every control is at least 44px on a phone', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    const problems: Record<string, unknown> = {}

    for (const path of ROUTES) {
      await goto(page, path)
      const small = await page.evaluate(() => {
        const out: { el: string; w: number; h: number; text: string }[] = []
        for (const el of document.querySelectorAll<HTMLElement>('a, button, [role="radio"], input[type="radio"]')) {
          const cs = getComputedStyle(el)
          if (cs.display === 'none' || cs.visibility === 'hidden') continue
          let box = el.getBoundingClientRect()
          if (!box.width || !box.height) continue
          // A radio inside a label is tapped via the label, so measure that.
          const label = (el as HTMLInputElement).type === 'radio' ? el.closest('label') : null
          if (label) box = label.getBoundingClientRect()
          if (Math.min(box.width, box.height) < 44) {
            out.push({
              el: (el.className || el.tagName).toString().slice(0, 28),
              w: Math.round(box.width),
              h: Math.round(box.height),
              text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24),
            })
          }
        }
        const unique = new Map(out.map(o => [`${o.el}${o.w}${o.h}`, o]))
        return [...unique.values()]
      })
      if (small.length) problems[path] = small
    }
    expect(problems).toEqual({})
  })
})

test.describe('document semantics', () => {
  test('every route has one h1 and never skips a heading level', async ({ page }) => {
    const problems: Record<string, unknown> = {}
    for (const path of ROUTES) {
      await goto(page, path)
      const issues = await page.evaluate(() => {
        const levels = [...document.querySelectorAll('h1, h2, h3, h4')].map(h => Number(h.tagName[1]))
        const found: string[] = []
        const h1Count = levels.filter(l => l === 1).length
        if (h1Count !== 1) found.push(`${h1Count} h1 elements`)
        let previous = 0
        levels.forEach((level, index) => {
          if (index === 0 && level !== 1) found.push(`starts at h${level}`)
          else if (level > previous + 1) found.push(`h${previous} jumps to h${level}`)
          previous = level
        })
        return found
      })
      if (issues.length) problems[path] = issues
    }
    expect(problems).toEqual({})
  })

  test('the html lang attribute follows the chosen language', async ({ page }) => {
    await goto(page, '/journey')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-IN')
    await setLanguage(page, 'hi')
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi-IN')
  })
})

import type { Page } from '@playwright/test'
import { ROUTE_PATHS } from '../src/routeManifest'

/** Every route, plus an unknown one so the not-found screen is covered too. */
export const ROUTES = [...ROUTE_PATHS, '/not-a-real-page']

export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 900 },
} as const

export type Language = 'en' | 'hi'

/** Route paths are relative to the Vite base, which is also the Playwright baseURL. */
export function url(path: string) {
  return path === '/' ? './' : `.${path}`
}

export async function goto(page: Page, path: string) {
  await page.goto(url(path))
  await page.waitForSelector('#main')
}

export async function setLanguage(page: Page, language: Language) {
  const target = language === 'hi' ? 'hi-IN' : 'en-IN'
  if (await page.locator('html').getAttribute('lang') === target) return
  await page.getByRole('button', { name: /change language|भाषा बदलें/i }).click()
  await page.waitForFunction(
    expected => document.documentElement.lang === expected,
    target,
  )
}

/**
 * Blocks that are narrower than their containing block, sit inside a
 * centre-aligned parent, and lack auto side margins. Such a block is pinned to
 * one edge while its text centres within it — the headline bug in this codebase.
 */
export async function findOffCentreBlocks(page: Page) {
  return page.evaluate(() => {
    const out: { el: string; text: string; skewPx: number }[] = []
    for (const el of document.querySelectorAll<HTMLElement>('#main *')) {
      const cs = getComputedStyle(el)
      if (cs.display !== 'block') continue
      if (cs.position === 'absolute' || cs.position === 'fixed') continue
      if (cs.marginLeft === 'auto' && cs.marginRight === 'auto') continue

      const parent = el.parentElement
      if (!parent) continue
      const pcs = getComputedStyle(parent)
      if (pcs.textAlign !== 'center' || pcs.display !== 'block') continue

      const pb = parent.getBoundingClientRect()
      const b = el.getBoundingClientRect()
      const innerLeft = pb.left + parseFloat(pcs.paddingLeft)
      const innerRight = pb.right - parseFloat(pcs.paddingRight)
      if (b.width >= innerRight - innerLeft - 1) continue

      const skew = Math.round(b.left - innerLeft - (innerRight - b.right))
      if (Math.abs(skew) > 2) {
        out.push({
          el: (el.className || el.tagName).toString().slice(0, 30),
          text: (el.textContent ?? '').trim().slice(0, 40),
          skewPx: skew,
        })
      }
    }
    return out
  })
}

/**
 * The text of each block's final rendered line. Comparing words rather than
 * pixel widths keeps this stable across platforms with different font metrics.
 */
export async function findSingleWordLastLines(page: Page, selector: string) {
  return page.evaluate(sel => {
    const orphans: { el: string; text: string; lastLine: string }[] = []

    const lastLineOf = (el: Element): string | null => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const nodes: Text[] = []
      let node = walker.nextNode()
      while (node) {
        nodes.push(node as Text)
        node = walker.nextNode()
      }
      if (!nodes.length) return null

      const range = document.createRange()
      range.selectNodeContents(el)
      const lines = [...range.getClientRects()].filter(r => r.width > 1)
      if (lines.length < 2) return null
      const lastTop = Math.round(lines[lines.length - 1].top)

      // Walk characters and keep those rendered on the final line.
      let collected = ''
      for (const text of nodes) {
        const value = text.data
        for (let i = 0; i < value.length; i++) {
          const charRange = document.createRange()
          charRange.setStart(text, i)
          charRange.setEnd(text, i + 1)
          const rect = charRange.getBoundingClientRect()
          if (rect.width === 0 && rect.height === 0) continue
          if (Math.round(rect.top) === lastTop) collected += value[i]
        }
      }
      return collected.trim()
    }

    for (const el of document.querySelectorAll(sel)) {
      if (getComputedStyle(el).display === 'flex') continue
      const full = (el.textContent ?? '').trim()
      if (full.split(/\s+/).length < 5) continue
      const last = lastLineOf(el)
      if (last && last.split(/\s+/).filter(Boolean).length === 1) {
        orphans.push({ el: (el.className || el.tagName).toString().slice(0, 26), text: full.slice(0, 50), lastLine: last })
      }
    }
    return orphans
  }, selector)
}

/** Elements whose box extends beyond the viewport, which forces sideways scrolling. */
export async function findHorizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const out: string[] = []
    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      out.push(`document scrolls horizontally: ${document.documentElement.scrollWidth} > ${window.innerWidth}`)
    }
    for (const el of document.querySelectorAll<HTMLElement>('#main *')) {
      if (el.closest('.hero-visual')) continue // deliberately bleeds off the edge
      const b = el.getBoundingClientRect()
      if (b.width > 0 && (b.right > window.innerWidth + 1 || b.left < -1)) {
        out.push(`${(el.className || el.tagName).toString().slice(0, 30)} extends past the edge`)
      }
    }
    return [...new Set(out)]
  })
}

/** Every rendered text node measured against its effective background. */
export async function findContrastFailures(page: Page) {
  return page.evaluate(() => {
    const parse = (c: string) => {
      const m = c.match(/[\d.]+/g)
      return m ? ([...m.slice(0, 3).map(Number), m[3] === undefined ? 1 : Number(m[3])] as number[]) : null
    }
    const lin = (v: number) => {
      const x = v / 255
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
    }
    const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2])
    const ratio = (a: number[], b: number[]) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
      return (hi + 0.05) / (lo + 0.05)
    }
    const backgroundOf = (el: Element): number[] => {
      let node: Element | null = el
      while (node && node !== document.documentElement) {
        const c = parse(getComputedStyle(node).backgroundColor)
        if (c && c[3] > 0.9) return c
        node = node.parentElement
      }
      return [255, 255, 255]
    }

    const failures: { el: string; text: string; ratio: number; required: number }[] = []
    let checked = 0
    for (const el of document.querySelectorAll('body *')) {
      const hasOwnText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent?.trim())
      if (!hasOwnText) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue
      const fg = parse(cs.color)
      if (!fg) continue
      checked++
      const size = parseFloat(cs.fontSize)
      const weight = Number(cs.fontWeight)
      const required = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5
      const value = ratio(fg, backgroundOf(el))
      if (value < required) {
        failures.push({
          el: (el.className || el.tagName).toString().slice(0, 30),
          text: (el.textContent ?? '').trim().slice(0, 34),
          ratio: Number(value.toFixed(2)),
          required,
        })
      }
    }
    const unique = new Map(failures.map(f => [`${f.el}|${f.ratio}`, f]))
    return { checked, failures: [...unique.values()] }
  })
}

import { expect, test } from '@playwright/test'
import {
  findHorizontalOverflow,
  findOffCentreBlocks,
  findSingleWordLastLines,
  goto,
  ROUTES,
  setLanguage,
  VIEWPORTS,
  type Language,
} from './helpers'

const CONFIRMATION_ROUTES = [
  '/journey/rebook/confirmed',
  '/journey/refund/confirmed',
  '/journey/callback/confirmed',
]

const LANGUAGES: Language[] = ['en', 'hi']

test.describe('confirmation headline alignment', () => {
  // The regression this suite exists for: .confirmed-screen h1 inherited
  // max-width:660px from the shared display rule but kept margin:0, so inside the
  // 790px centred container its box was pinned left and the text rendered 65px
  // left of the mark above it. jsdom cannot catch this — it performs no layout.
  for (const path of CONFIRMATION_ROUTES) {
    test(`${path} centres the headline on the same axis as the mark`, async ({ page }) => {
      await goto(page, path)

      const mark = await page.locator('.confirmation-mark').boundingBox()
      const heading = await page.locator('.confirmed-screen h1').boundingBox()
      const lead = await page.locator('.confirmation-lead').boundingBox()
      expect(mark && heading && lead).toBeTruthy()

      const centre = (box: { x: number; width: number }) => box.x + box.width / 2
      expect(Math.abs(centre(heading!) - centre(mark!))).toBeLessThanOrEqual(1)
      expect(Math.abs(centre(lead!) - centre(mark!))).toBeLessThanOrEqual(1)
    })
  }
})

test.describe('centred containers', () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`no block sits off-centre inside a centred container on ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const problems: Record<string, unknown> = {}
      for (const language of LANGUAGES) {
        await goto(page, '/')
        await setLanguage(page, language)
        for (const path of ROUTES) {
          await goto(page, path)
          const offCentre = await findOffCentreBlocks(page)
          if (offCentre.length) problems[`${language} ${path}`] = offCentre
        }
      }
      expect(problems).toEqual({})
    })
  }
})

test.describe('paired confirmation cards', () => {
  test('end level and align their footer links', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await goto(page, '/journey/rebook/confirmed')

    const bottoms = await page.locator('.confirmed-grid .confirmed-card').evaluateAll(nodes =>
      nodes.map(n => Math.round(n.getBoundingClientRect().bottom)),
    )
    expect(bottoms).toHaveLength(2)
    expect(Math.abs(bottoms[0] - bottoms[1])).toBeLessThanOrEqual(1)

    // Each link used to follow its own card's content, leaving them 12px apart.
    const linkTops = await page.locator('.confirmed-grid .text-button').evaluateAll(nodes =>
      nodes.map(n => Math.round(n.getBoundingClientRect().top)),
    )
    expect(linkTops).toHaveLength(2)
    expect(Math.abs(linkTops[0] - linkTops[1])).toBeLessThanOrEqual(1)
  })
})

test.describe('responsive layout', () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`nothing overflows horizontally on ${name}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const problems: Record<string, unknown> = {}
      for (const language of LANGUAGES) {
        await goto(page, '/')
        await setLanguage(page, language)
        for (const path of ROUTES) {
          await goto(page, path)
          const overflow = await findHorizontalOverflow(page)
          if (overflow.length) problems[`${language} ${path}`] = overflow
        }
      }
      expect(problems).toEqual({})
    })
  }
})

test.describe('typography', () => {
  test('no heading or lead paragraph ends on a single word', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    const problems: Record<string, unknown> = {}
    for (const language of LANGUAGES) {
      await goto(page, '/')
      await setLanguage(page, language)
      for (const path of ROUTES) {
        await goto(page, path)
        const orphans = await findSingleWordLastLines(page, '#main h1, #main h2, #main h3, #main p')
        if (orphans.length) problems[`${language} ${path}`] = orphans
      }
    }
    expect(problems).toEqual({})
  })
})

test.describe('disruption watermark', () => {
  test('has clear space beside the copy on a wide screen', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop)
    await goto(page, '/journey')

    const geometry = await page.evaluate(() => {
      const card = document.querySelector('.disruption-card')!
      const copy = document.querySelector('.disruption-copy')!
      const cardBox = card.getBoundingClientRect()
      const after = getComputedStyle(card, '::after')
      return {
        gapToCardEdge: cardBox.right - copy.getBoundingClientRect().right,
        fontSize: parseFloat(after.fontSize),
        cardHeight: cardBox.height,
        display: after.display,
      }
    })

    expect(geometry.display).not.toBe('none')
    // The mark needs room to the right of the copy, or it prints over the text.
    expect(geometry.gapToCardEdge).toBeGreaterThan(60)
    // It also has to fit the card's height, or it clips mid-glyph as it used to.
    expect(geometry.fontSize).toBeLessThanOrEqual(geometry.cardHeight)
  })

  test('is dropped on narrow screens where it would print over the copy', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await goto(page, '/journey')
    const display = await page.evaluate(
      () => getComputedStyle(document.querySelector('.disruption-card')!, '::after').display,
    )
    expect(display).toBe('none')
  })
})

import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDuration, translate, type TranslationKey } from './dictionary'
import { en } from './en'
import { hi } from './hi'

const placeholders = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort()

describe('dictionaries', () => {
  it('cover exactly the same keys', () => {
    expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort())
  })

  it('never leave a Hindi string empty', () => {
    const empty = Object.entries(hi).filter(([, value]) => !value.trim())
    expect(empty).toEqual([])
  })

  it('use the same placeholders in both languages', () => {
    const mismatched = Object.keys(en).filter(key => {
      const k = key as TranslationKey
      return placeholders(en[k]).join() !== placeholders(hi[k]).join()
    })
    expect(mismatched).toEqual([])
  })

  it('does not leave a Hindi value identical to English where it should be translated', () => {
    // Brand name, acronyms and the +1 marker are deliberately shared.
    const shared = new Set(['brand.name', 'format.nextDay', 'trip.pnrLabel', 'trip.coachLabel', 'rebook.extra'])
    const untranslated = Object.keys(en).filter(key => {
      const k = key as TranslationKey
      return !shared.has(key) && en[k] === hi[k]
    })
    expect(untranslated).toEqual([])
  })
})

describe('translate', () => {
  it('substitutes named placeholders', () => {
    expect(translate('en', 'confirmed.title.line2', { name: 'Anita' })).toBe('Anita.')
    expect(translate('hi', 'confirmed.title.line2', { name: 'अनीता' })).toBe('अनीता।')
  })

  it('leaves an unknown placeholder untouched rather than printing undefined', () => {
    expect(translate('en', 'rebook.hold', {})).toBe('Seats held for {time}')
  })

  it('returns Hindi when Hindi is selected', () => {
    expect(translate('hi', 'options.disruption.title.emphasis')).toBe('रद्द हो गई है।')
  })
})

describe('formatters', () => {
  it('formats rupees with Indian digit grouping and no paise', () => {
    expect(formatCurrency(3480, 'en')).toBe('₹3,480')
    expect(formatCurrency(150000, 'en')).toBe('₹1,50,000')
  })

  it('formats duration in the active language', () => {
    expect(formatDuration(935, 'en')).toBe('15h 35m')
    expect(formatDuration(935, 'hi')).toBe('15घं 35मि')
  })
})

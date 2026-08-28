import { describe, expect, it } from 'vitest'
import { formatPnr, normalisePnr, validatePnr } from './pnr'

describe('normalisePnr', () => {
  it('strips the spaces people use when reading a PNR aloud', () => {
    expect(normalisePnr('8634 112 789')).toBe('8634112789')
  })

  it('strips any other punctuation', () => {
    expect(normalisePnr('8634-112-789')).toBe('8634112789')
  })
})

describe('validatePnr', () => {
  it('accepts ten digits', () => {
    expect(validatePnr('8634112789')).toEqual({ ok: true, pnr: '8634112789' })
  })

  it('accepts ten digits written with spaces', () => {
    expect(validatePnr('8634 112 789')).toEqual({ ok: true, pnr: '8634112789' })
  })

  it('reports an empty field separately from a malformed one', () => {
    expect(validatePnr('')).toEqual({ ok: false, reason: 'empty' })
    expect(validatePnr('   ')).toEqual({ ok: false, reason: 'empty' })
  })

  it('rejects the wrong number of digits', () => {
    expect(validatePnr('123')).toEqual({ ok: false, reason: 'format' })
    expect(validatePnr('12345678901')).toEqual({ ok: false, reason: 'format' })
  })

  it('rejects letters, which normalise away to nothing', () => {
    expect(validatePnr('abcdefghij')).toEqual({ ok: false, reason: 'empty' })
  })
})

describe('formatPnr', () => {
  it('groups a valid PNR for reading', () => {
    expect(formatPnr('8634112789')).toBe('8634 112 789')
  })

  it('leaves an incomplete PNR ungrouped rather than mangling it', () => {
    expect(formatPnr('863')).toBe('863')
  })
})

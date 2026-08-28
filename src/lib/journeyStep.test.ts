import { describe, expect, it } from 'vitest'
import { stepForPath } from './journeyStep'

describe('stepForPath', () => {
  it('puts the disruption explanation at step one', () => {
    expect(stepForPath('/journey')).toBe(1)
  })

  it.each(['/journey/rebook', '/journey/refund', '/journey/callback'])('puts %s at step two', path => {
    expect(stepForPath(path)).toBe(2)
  })

  it.each([
    '/journey/rebook/confirmed',
    '/journey/refund/confirmed',
    '/journey/callback/confirmed',
  ])('puts %s at step three', path => {
    expect(stepForPath(path)).toBe(3)
  })

  it('ignores a trailing slash', () => {
    expect(stepForPath('/journey/rebook/')).toBe(2)
    expect(stepForPath('/journey/refund/confirmed/')).toBe(3)
  })
})

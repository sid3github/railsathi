export type PnrValidation = { ok: true; pnr: string } | { ok: false; reason: 'empty' | 'format' }

/** Indian Railways PNRs are ten digits; spaces are common when people read them aloud. */
export function normalisePnr(input: string): string {
  return input.replace(/\D/g, '')
}

export function validatePnr(input: string): PnrValidation {
  const pnr = normalisePnr(input)
  if (pnr.length === 0) return { ok: false, reason: 'empty' }
  if (pnr.length !== 10) return { ok: false, reason: 'format' }
  return { ok: true, pnr }
}

/** Display grouping: 8634 112 789. */
export function formatPnr(pnr: string): string {
  const digits = normalisePnr(pnr)
  if (digits.length !== 10) return digits
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
}

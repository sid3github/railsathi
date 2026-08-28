export const JOURNEY_STEPS = ['understand', 'choose', 'travelEasy'] as const
export type JourneyStep = (typeof JOURNEY_STEPS)[number]

/**
 * Maps a route to its place in the three-step journey. Kept as a pure function so
 * every entry point — including a deep link a passenger was sent — shows the right
 * position without the app having to remember how they got there.
 */
export function stepForPath(pathname: string): number {
  const path = pathname.replace(/\/+$/, '')
  if (path.endsWith('/confirmed')) return 3
  if (/\/journey\/(rebook|refund|callback)$/.test(path)) return 2
  return 1
}

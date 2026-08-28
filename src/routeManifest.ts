/**
 * Every path the app can render, as flat data.
 *
 * The router (router.tsx) builds its nested tree from these paths, and the build
 * emits a real index.html at each one so GitHub Pages serves a 200 instead of
 * falling back to 404.html. A test asserts every path here renders a real screen,
 * so the two cannot drift apart.
 */
export const ROUTE_PATHS = [
  '/',
  '/journey',
  '/journey/rebook',
  '/journey/rebook/confirmed',
  '/journey/refund',
  '/journey/refund/confirmed',
  '/journey/callback',
  '/journey/callback/confirmed',
] as const

export type RoutePath = (typeof ROUTE_PATHS)[number]

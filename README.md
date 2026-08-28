# RailSathi

**A clear next step when an Indian rail journey is disrupted.**

**Live:** https://sid3github.github.io/railsathi/

When a train is cancelled, the passenger is handed a status code and left to work
out the rest — usually on a phone, on a platform, with a deadline. RailSathi
translates that disruption into plain language, lays out the real choices with
their trade-offs stated up front, and ends with something concrete: a confirmed
seat, a tracked refund, or a callback booked.

Built for the [Build What Moves India](https://buildwhatmovesindia.com) challenge.

> **Independent concept prototype.** Not affiliated with, endorsed by, or connected
> to Indian Railways or IRCTC. Every PNR, seat, fare, refund and support outcome
> here is synthetic. The app never asks for a password, OTP, payment detail,
> Aadhaar/PAN number, or any real government credential — and there is no login, so
> no demo credentials are needed to walk the whole journey.

## The three journeys

A disruption has more than one right answer, so all three paths complete:

| Path | Route | Ends at |
| --- | --- | --- |
| Rebook onto another train | `/journey/rebook` | A confirmed seat and a refund tracker |
| Take the fare back | `/journey/refund` | A tracked refund with expected dates |
| Talk to someone | `/journey/callback` | A booked callback in the chosen language |

Every screen is its own URL, so a plan can be shared and a deep link opens
correctly on its own.

## Design decisions worth knowing

**Hindi is real, not a toggle.** All 178 strings are translated, the choice
persists, and `<html lang>` follows it. `hi.ts` is typed as a complete
`Dictionary`, so a missing key fails the build rather than falling back to
English in front of someone who chose Hindi. Devanagari gets its own leading and
tracking, because the Latin display setting crowds matras.

**Built for a slow connection.** First load is **268 kB across 7 requests, all
from one origin** — measured on the live build, not estimated. It started at
about 1.24 MB across three origins. The hero was 1.12 MB of that; it is now
AVIF/WebP at two widths behind `<picture>`, down to 50 kB at the size a 2x phone
actually needs. Fonts are self-hosted, so no third-party request sits in front of
first paint, and the 118 kB Devanagari face only downloads if Hindi is chosen.

**Accessible by measurement, not by assertion.** All 308 text nodes across nine
routes clear WCAG AA contrast in both languages. Train selection is a real radio
group with arrow-key support, the dialog traps and restores focus, every control
has a 44 px touch target, and `prefers-reduced-motion` is honoured.

**Nothing dead-ends.** No `alert()` stubs, no buttons that go nowhere. Sharing
uses the platform share sheet with a clipboard fallback.

## Built with Codex

Codex wrote this prototype — the journey structure, the screens, the design
system, and the synthetic data model. The hero illustration is original art
generated with OpenAI's image tool; its prompt and provenance are kept alongside
it in [`src/assets`](src/assets/indian-express-hero-v2.prompt.txt).

## Running locally

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm test` | Run the unit and integration suite |
| `npm run test:e2e` | Run the Playwright layout and accessibility suite |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |
| `npm run images` | Regenerate the hero renditions from the source PNG |

## Tests

Two suites, both run in CI ahead of the build so a regression cannot deploy.

**Unit and integration — 68 tests, Vitest and Testing Library.** What a visitor
actually does: each journey reaching a resolved outcome, every screen rendering
standalone, PNR validation, the radio group's keyboard behaviour, the dialog's
focus handling, and key and placeholder parity between the two dictionaries.

**Layout and accessibility — 22 tests, Playwright against the production build.**
jsdom performs no layout, so `getBoundingClientRect` returns zeros there and a
misaligned heading or an invisible focus ring passes unnoticed. These run in a
real browser at 375/768/1280 in both languages, and assert:

- Confirmation headlines share a centre axis with the mark above them
- No constrained block sits off-centre inside a centre-aligned container
- Nothing overflows horizontally; paired cards end level and align their links
- No heading or lead paragraph ends on a single word
- Every text node meets WCAG AA contrast
- A real Tab press produces a visible focus ring
- Every control is at least 44px on a phone
- Each route has one `h1` and skips no heading level

Every one of these guards was verified by reverting the fix it covers and
confirming the suite goes red.

## Architecture

```
src/
  data/journey.ts     Synthetic trip, alternatives and refund stages
  i18n/               en + hi dictionaries, provider, Intl formatters
  state/              Journey choices, defaulted so deep links render
  components/         Header, dialog, toast, tracker, share, error boundary
  screens/            One file per screen
  layouts/            Journey shell: header, progress, outlet
  router.tsx          Route table (exported bare so tests can mount it)
```

## Deployment

Pushing to `main` lints, tests, builds and publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

GitHub Pages serves project sites from a subpath and has no SPA rewrite rule, so
the build emits `404.html` as a copy of `index.html` — deep links boot the router
instead of 404ing. The subpath itself is set by `base` in `vite.config.ts`.

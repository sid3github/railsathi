# RailSathi

**A clear next step when an Indian rail journey is disrupted.**

When a train is delayed or cancelled, the passenger is handed a status code and left
to work out the rest. RailSathi translates that disruption into plain language, lays
out the real choices with their trade-offs stated up front, and ends the journey with
something concrete: a confirmed seat, a tracked refund, or a callback booked.

Built for the [Build What Moves India](https://buildwhatmovesindia.com) challenge.

> **Independent concept prototype.** Not affiliated with, endorsed by, or connected to
> Indian Railways or IRCTC. Every PNR, seat, fare, refund and support outcome in this
> project is synthetic. The app never asks for a password, OTP, payment detail,
> Aadhaar/PAN number, or any real government credential.

## Running locally

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Because Pages serves project sites from a subpath and has no SPA rewrite rule, the
build emits `404.html` as a copy of `index.html` so deep links boot the router
instead of 404ing. The subpath itself is set by `base` in `vite.config.ts`.

# Submission pack

Everything the [Build What Moves India](https://buildwhatmovesindia.com/brief) form
asks for. Deadline: **28 August 2026, 20:00 IST — no grace period.**

## Checklist

- [x] **Live public link, no access request** — https://sid3github.github.io/railsathi/
- [x] **Mock login credentials** — none needed; there is no login anywhere in the journey
- [x] **Complete citizen journey, start to finish** — three of them (rebook, refund, callback)
- [x] **Synthetic data** for everything a real system would hold
- [x] **Built with Codex**
- [ ] **Project summary under 250 words** — draft below, paste into the form
- [ ] **Video, max 2 minutes** — shot list below, you record

---

## Project summary (232 words)

**RailSathi — a clear next step when an Indian rail journey is disrupted.**

When a train is cancelled today, the passenger gets a status message and a portal
built for record-keeping rather than for deciding. They are on a platform, on a
phone, with a deadline, and the work of figuring out what to do next is entirely
theirs.

RailSathi turns that same disruption into a decision. It says what changed in
plain language, then lays out three honest paths — rebook onto another train,
take the fare back, or ask a person to call — with the cost, the timing and the
trade-off of each stated before any commitment. Every path finishes somewhere
real: a confirmed seat, a tracked refund with dates, or a booked callback.

Why it is easier than the experience it replaces:

- One decision per screen, in the passenger's words rather than railway vocabulary.
- Hindi that actually works — all 178 strings, not a token toggle.
- A 268 kB first load from a single origin, down from 1.24 MB across three.
- Measured accessibility: every text node clears WCAG AA contrast in both
  languages, with 44 px touch targets and full keyboard support.
- Nothing dead-ends, and no login, OTP or payment detail is ever requested.

All journey data is synthetic and labelled as a demonstration. Independent, and
not affiliated with Indian Railways or IRCTC.

---

## Video shot list (2:00)

Record at a phone aspect ratio if you can — the brief cares about mobile, and it
makes the responsive work visible for free.

### Minute one — the citizen journey

| Time | On screen | Say |
| --- | --- | --- |
| 0:00–0:08 | Landing page. Type the PNR, tap **View my plan**. | "Anita's train from Mumbai to Delhi is tonight. No login, no OTP — just her PNR." |
| 0:08–0:20 | Cancellation headline, then tap **Why was it cancelled?** and close it. | "It's cancelled. RailSathi says so in plain language, and explains what it means for her fare." |
| 0:20–0:30 | The three option cards. Let the costs and trade-offs sit on screen. | "Three honest paths, each with its cost and timing stated before she commits to anything." |
| 0:30–0:45 | Train chooser. Tap the Duronto — the panel updates to +₹340. Tap **Confirm my new plan**. | "She picks the fastest. The panel updates live, so she sees the extra fare before deciding." |
| 0:45–0:52 | Confirmation: seat, refund tracker, share. | "A confirmed seat, her refund already tracked, and one tap to send the plan to whoever is waiting." |
| 0:52–1:00 | **Tap हि.** Let the whole page turn to Hindi. Scroll a little. | "And the whole thing is in Hindi — every screen, not a token toggle." |

### Minute two — how it was built

| Time | On screen | Say |
| --- | --- | --- |
| 1:00–1:12 | Repo tree, or the Codex session. | "Codex built this — the journey structure, the screens, the design system, and the original hero art." |
| 1:12–1:28 | Network panel, or the before/after numbers. | "It started at 1.24 MB across three origins. The hero alone was 1.12 MB. It's now 268 kB from one origin, seven requests, nothing third-party in front of first paint." |
| 1:28–1:44 | Contrast audit output, or tab through the train chooser with visible focus rings. | "Accessibility is measured, not claimed: 308 text nodes clearing WCAG AA in both languages, a real radio group, a dialog that traps and restores focus." |
| 1:44–2:00 | `npm test` output, then the live URL. | "59 tests run in CI before anything deploys — including one guarding the refund path, which used to send people to a list of trains instead of their money. Three journeys, all of them finish." |

### Worth avoiding

- Don't narrate the UI ("now I click here"). Say what the passenger gets.
- Don't open with the tech. The first minute is Anita's, not the stack's.
- Do say "synthetic" once, early. It reads as rigour, not as a caveat.

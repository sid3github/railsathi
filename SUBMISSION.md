# Submission pack

Deadline: **28 August 2026, 20:00 IST — no grace period.**

## Where this gets submitted

The **Project Submission form has not been sent yet.** The registration confirmation
(21 Aug) says: *"Submissions close August 28, 2026 at 8:00 PM IST. We'll email you
the details."*

- **"Apply Now" on the site is Registration only** — name, email, WhatsApp, age,
  solo/team, profession, finale attendance. No fields for the link, video or
  summary. Already completed.
- The FAQ confirms two separate forms: *"Each teammate must enter the other
  person's registered email in the Project Submission form."*
- Watch **siddharthpadwal3@gmail.com** and the
  [WhatsApp Channel](https://whatsapp.com/channel/0029VbDbaoSGOj9kXqHBow0W).
  Use the registered email everywhere — entries are tracked by it and cannot be
  moved to another address.

## Checklist

- [x] **Registered** (21 Aug, confirmation received)
- [x] **Live public link, no access request** — https://sid3github.github.io/railsathi/
- [x] **Mock login credentials** — none needed; there is no login in the journey
- [x] **Complete citizen journey** — three of them, each ending in a resolved outcome
- [x] **Synthetic data** everywhere a real system would hold personal information
- [x] **Built with Codex**
- [x] **Project summary under 250 words** — 247 words, below
- [ ] **Video, max 2 minutes** — shot list below, you record
- [ ] **Partner's registered email** — leave blank if solo
- [ ] **Submit** once the form arrives

---

## Project summary (247 words)

**RailSathi — a clear next step when an Indian rail journey is disrupted.**

When a train is cancelled the passenger gets a terse SMS and a portal built for
record-keeping, not deciding — on a platform, on a phone, with a deadline.

RailSathi turns the disruption into a decision. It says what changed in plain
language, then offers three honest paths — rebook, take the fare back, or ask a
person to call — each with its cost and timing stated before any commitment.
Every path ends somewhere real.

Why it is easier: one decision per screen, in the passenger's words; complete
Hindi rather than a token toggle; a 268 kB first load built for a mid-range phone
on a slow connection; WCAG AA contrast throughout with 44px touch targets; and no
login, OTP or payment ever requested.

Beyond the interface, this is an event-driven layer over existing railway systems,
not a new booking stack. It would subscribe to cancellation events, match them to
booked PNRs, and push a signed one-time link over SMS and WhatsApp, so the
passenger never goes looking. Alternatives are computed once per disrupted train
and cached, because everyone on that train needs the same answer.

Honestly mocked: all journey data, availability and refunds. Holding a seat needs
reservation write access, refunds would report the railway's existing automatic
process rather than move money, and the open PNR field here becomes a signed link
in production.

Independent prototype, unaffiliated with Indian Railways or IRCTC.

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

### Minute two — how it was built, and how it would really work

The brief scores *end-to-end thinking* ("does the solution address the backend,
infrastructure and processes, not just the interface?") and *honesty*
("are limitations, mock data and dependencies clearly disclosed?"). The last two
rows are there to answer both directly — don't cut them for time.

| Time | On screen | Say |
| --- | --- | --- |
| 1:00–1:12 | Repo tree, or the Codex session. | "Codex built this — the journey structure, the screens, the design system, and the original hero art." |
| 1:12–1:24 | Network panel, or the before/after numbers. | "It started at 1.24 MB across three origins. The hero alone was 1.12 MB. It's now 268 kB from one origin, seven requests, nothing third-party in front of first paint." |
| 1:24–1:36 | Tab through the train chooser so the focus rings show. | "Accessibility is measured, not claimed: every text node clears WCAG AA in both languages, and 22 browser tests hold it there." |
| 1:36–1:50 | Talk over the options screen, or a simple arrow sketch. | "At scale this isn't a new booking stack — it's an event-driven layer on top of the railway's own systems. Subscribe to cancellation events, match booked PNRs, push a signed link over SMS and WhatsApp so nobody has to go looking. One cancelled train is a thousand passengers needing the same answer, so alternatives are computed once and cached." |
| 1:50–2:00 | The **synthetic data** pill, visible on screen. | "Everything here is mocked, and labelled as mocked. Holding a seat would need reservation write access; refunds would report the railway's existing automatic process, not move money. That's the honest boundary between what works today and what needs a partnership." |

### Worth avoiding

- Don't narrate the UI ("now I click here"). Say what the passenger gets.
- Don't open with the tech. The first minute is Anita's, not the stack's.
- Do say "synthetic" once, early. It reads as rigour, not as a caveat.

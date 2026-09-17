# AWS Community Day — Student-First Redesign

A ground-up rethinking of the original [AWS Student Community Day site](https://payalnarwal.github.io/AWS-Student-Community-Day/), designed around the questions a student attendee actually asks.

**Open `index.html` in a browser — no build step, no dependencies.**

---

## 1. Problems identified in the original site

| # | Problem | Evidence | Priority |
|---|---------|----------|----------|
| P1 | **No schedule exists.** 9 speakers are listed, but there is no time, duration, or running order. A student can't answer "is this worth my whole Saturday?" or plan around lunch/practicals. | Speaker section = name + topic only | High |
| P2 | **"Who is this for?" is unanswered.** No eligibility info (other colleges? non-CS? beginners?), no skill level per talk, and cost is never stated. | Absent from every section | High |
| P3 | **Registration is a dead end.** One button, no confirmation, no "what happens next" — the #1 anxiety after clicking Register is unresolved. | "Register Now" button only | High |
| P4 | **Zero logistics.** Venue is one line. Nothing about metro, check-in time, what to bring, food, or accessibility. | Venue section = 1 sentence | Medium |
| P5 | **Nothing after the event.** No recordings, resources, feedback, or certificate info — the event simply ends. | Absent | Medium |
| P6 | **Generic visual language.** Emoji-heavy copy, filler sections (team roster of 25 names before logistics), flat hierarchy — reads like a template, not a product. | Whole page | Medium |

## 2. How this redesign solves each

- **P1 → "The day, hour by hour"**: a real timeline with times, breaks (visually distinct), and two tracks (Main stage / Hands-on corner) via accessible tab switcher. Every talk gets a **"You'll leave with:"** line — the *outcome*, not just the topic.
- **P2 → Facts up front + "Is this for me?" card**: hero answers When/Where/Who/Cost in four labelled rows before any scrolling. A sticky side card honestly lists who the event fits (and one "not this one" row — telling students what an event *isn't* builds trust). Skill chips (`Beginner friendly` / `Some basics help`) appear on every session.
- **P3 → Full registration flow**: modal form (3 fields + optional accessibility/allergy field) → **inline, friendly validation** → honest loading state → personalized confirmation ("You're in, *Riya*!") with next-3-steps and add-to-calendar. A separate **"What happens after you register?"** section shows the entire journey (confirmation → reminder → check-in → day → recordings) *before* you commit.
- **P4 → "Getting there"**: address, metro line + gate + walk time, arrival deadline, what to bring, accessibility info — plus a hand-drawn SVG map (no API keys, no generic embed).
- **P5 → "Missed it, or want more?"**: recordings, ongoing practice paths, and feedback — closing the loop past event day.
- **P6 → Editorial design system**: warm paper background, AWS squid-ink navy, one orange accent, Fraunces display + Inter body, 8px-based spacing, consistent chips/buttons. No emoji as UI decoration; no filler sections.

## 3. Interaction & states covered

- Hover/focus/active on all buttons and links, `:focus-visible` rings
- Registration: **error states** (per-field, human copy), **loading state**, **confirmation state**
- Track switching with `role="tablist"` / `aria-selected`
- FAQ `<details>` with animated chevron
- Add-to-calendar generates a real **.ics file client-side** (with a 24h alarm) — works in Google/Apple/Outlook
- Live countdown, `prefers-reduced-motion` support, skip-link, ESC/backdrop close, focus restore on modal close
- Fully responsive: 2-column → 1-column at 900px, hamburger nav at 700px

## 4. Deliberate non-features

- No "meet the team" roster of 25 names — attendees care about *their* day, not the org chart
- No sponsor logos section with no context
- No fake urgency or seat-scarity counters beyond the honest countdown
- Vanilla HTML/CSS/JS only — the value is in the decisions, not the stack

## 5. With more time

- Persisted registration state ("You're registered" instead of the button)
- "Add a specific talk to my calendar" per session
- A saved-session builder ("my plan for the day")
- Real QR + waitlist states when seats fill
- Dark mode

---
*Every section earns its place by answering a question a student actually has: What is this? → Is it for me? → What can I attend? → How do I register? → What happens next?*

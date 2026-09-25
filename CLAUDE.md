# Candidate Interview Form — working notes

## What this is

A **recruiter-side candidate interview form**. A recruiter works it live while
interviewing a candidate, capturing what the candidate has actually done, what
they want, and whether they're placeable — then exports an internal write-up and
a client-safe submittal profile.

## Where the code came from, and the one idea that matters

This repo is a **verbatim fork of [RHJOForm](https://github.com/davshe06/RHJOForm)**,
a *client-side job order intake* app. Nothing has been reframed yet — the code
here still asks client-intake questions. That reframing is the work.

**The reframe is an inversion, not a trim.** The source app captures
**requirements from a client**. This app captures **evidence from a candidate**.

The payoff: the **role taxonomy is already correct and fully reusable.** All 36
roles, their focus areas, their deep-dive question sets, and their tool option
lists are the right skill vocabulary for interviewing. What changes is what gets
recorded about each area and how each question is phrased.

| Source (client intake) | Here (candidate interview) |
| --- | --- |
| "Which cloud do you need?" | "Which clouds have you worked in, and what did you own?" |
| Focus area = must-have / nice-to-have / % of time | Focus area = depth + years + **recency** |
| Tip: "screen for X" | Tip: "probe for X" / "red flag if they can't explain Y" |
| Top 3 things the candidate must have | Top 3 things **the candidate wants** |
| Client's budget / bill rate | Candidate's current comp, target, and floor |

**Recency has no equivalent in the source app and matters enormously for
placement** — "expert, but last touched it four years ago" is a different
candidate. Build it in rather than bolting it on.

## Sibling repos — do not modify them

- **RHJOForm** — the full client intake app. The source of this fork.
- **TDCJOchecklist** — a condensed checklist variant of the client intake. Not
  relevant here; interviews need depth, not brevity.

## Architecture (inherited, unchanged)

Vanilla JS, vanilla CSS, **no build step, no dependencies, no framework**. Open
`index.html` directly or `python3 -m http.server 8000`. The only dependency
anywhere is `@anthropic-ai/sdk` inside the Vercel function. Keep it that way
unless asked — a recruiter can open a file and it works, and it deploys to
GitHub Pages as static files.

`app.js` is a **generic render engine**. It knows nothing about specific roles;
it renders whatever the catalogs register. Role knowledge lives entirely in data.

Each `roles-*.js` is an IIFE registering into `window.FORMS`:

```js
window.FORMS.management = {
  id: "management",
  label: "Management Resources",
  business: "pts",                // which business tab hosts it (pts | tts)
  stackLabel: "Systems & Skills", // optional: overrides the "Tech Stack" step label
  brand: APP_BRAND,
  common: COMMON,                 // basics / logistics / team / closing steps
  roles: ROLES,                   // role configs keyed by id
  roleOrder: ROLE_ORDER           // display order in the picker
};
```

The IIFE wrapper matters: every catalog declares top-level `COMMON`, `ROLES`,
`ROLE_ORDER`, so without it they collide.

Catalogs: `roles-management.js` (14 finance/accounting roles, PTS),
`roles-tech.js` (13 roles, TTS), `roles-digital.js` (9 roles, TTS) — 36 total.
Two-level nav: business selector (PTS / TTS) → form toggle (shown only when a
business hosts more than one form). Each form keeps a fully independent record
in the store; `state` is a live pointer to the active one, which is why the rest
of the engine needs no awareness of forms.

### A role config

```js
role_id: {
  label, icon, tagline,
  about,        // 2–3 sentence plain-language explainer, shown in the notes rail
                // (still valuable here — helps recruiters new to a skill area)
  blurb,        // coaching note on the Focus Areas step
  timePrompt,   // the "top 3 things" question
  focusAreas: [{ id, label, icon, deepDive: { intro, questions, tips } }],
  specialists:  [{ label, overlapsArea }],   // overlapsArea must be a focusArea id
  profileRules: [{ must: [focusAreaIds], profile, detail }],
  stackCategories: [{ id, label, placeholder, options }],
  aiUseCases, aiTools, metrics, backgrounds
}
```

Question types: `text`, `textarea`, `number`, `select`, `radio`, `chips`
(multi-select, always allows custom "+ Other…"), `textlist` (N numbered
short-answer boxes). Conditional display via `showIf(answers, state)`. Tips via
`when(answers, state)`; `areaPriority(state, id)` reads a focus area's priority.

### Reusable machinery worth keeping

- **Notes rail** — paste-ahead box + live notes. Maps perfectly: paste the
  résumé ahead of the call, take live notes during it.
- **"Close To The Next Steps" scheduler** — date + two-day/two-window time
  pickers. Maps directly onto capturing the candidate's interview availability.
- **Background check / drug screen / equipment questions** — already the right
  questions, just asked of the candidate ("are you willing to…") instead of
  the client.
- **Role explainer card**, theming, business selector, `textlist` — all reusable.

## The export logic INVERTS — do not get this backwards

The source app has a full internal export plus a **"candidate PDF"** that strips
**commercial terms** (bill rate, fees, internal client intel) so it's safe to
hand a candidate. See `CANDIDATE_EXCLUDE_IDS` / `CANDIDATE_EXCLUDE_SECTIONS`.

Here the same mechanism runs in reverse:

- **Internal recruiter export** — everything: current comp, competing
  interviews, counteroffer risk, recruiter's own assessment.
- **Client submittal export** — strips **candidate-private** data: current comp,
  other interviews in play, personal contact details, internal assessment
  notes. What's left is a professional profile safe to send a client.

Getting this wrong leaks a candidate's current salary to a hiring manager.
**Treat the exclusion list as a correctness concern, not cosmetics, and assert
it in a test** — fill the private fields, generate the client export, and assert
none of those values appear.

Five export paths must stay in sync when questions change: on-screen summary,
markdown copy, Word (`docx.js`), print/PDF, and the filtered client submittal.

## Conventions

**Cache busting is mandatory.** `index.html` appends `?v=N` to every asset.
**Bump `N` on every deploy** — GitHub Pages sits behind a CDN and browsers cache
JS hard. This has bitten this codebase before.

**Storage keys are namespaced `rh-interview-*`.** RHJOForm, TDCJOchecklist and
this app are all served from `davshe06.github.io`, and `localStorage` is
per-**origin**, not per-path. Never revert these to a sibling's keys or the apps
will overwrite each other's saved data.

**Verify in a real browser before committing.** Playwright is at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; drive `file://` against
`index.html`, assert behavior, and check `pageerror` + console errors are empty.
Syntax checks alone have missed real bugs here.

**Validate catalogs after editing them** — every `profileRule.must` entry and
every `specialist.overlapsArea` must be a real `focusArea` id in that role.

**Theming.** Colors are CSS custom properties. Light lives on bare `:root`; dark
is duplicated across `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`, with `:root[data-theme="light"]` pinning light. The
active form is stamped on `<html>` as `data-form` and per-business accents key
off it — Management Resources red (`#ad0019`), Tech/Digital blue (`#2456d6`).
Never hard-code an accent in a component; use the tokens, including
`--accent-ring` for focus rings.

## Catalog drift — a known open problem

Three repos now each carry ~330KB of near-identical role catalogs, with no build
step to share them. Decide an approach early rather than on the third divergent
edit. Current thinking: keep `roles-*.js` **byte-identical** across repos so an
update is a file copy, and put all interview-specific framing in the engine plus
a separate overlay file. Revisit if that proves awkward.

## Deployment

- **GitHub Pages:** Settings → Pages → branch `main`, folder `/ (root)`.
- **AI analysis:** `api/analyze.js` on Vercel with `ANTHROPIC_API_KEY` set
  server-side — the key must never reach the browser. When hosted on Pages, the
  endpoint URL is pasted into the AI settings on the Review & Export step. The
  prompt in that file still analyzes *job orders*; it needs rewriting to assess
  a **candidate** (marketability, gaps, probes the recruiter missed, a draft
  submittal summary).

## Commit trailer

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: <session url>
```

Never put a model identifier in code comments, PR titles/bodies, or any other
pushed artifact — commit trailers only.

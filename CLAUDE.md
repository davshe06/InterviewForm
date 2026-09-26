# Candidate Interview Form — working notes

## What this is

A **recruiter-side candidate interview form**. A recruiter works it live while
screening a candidate: walking the résumé, rating each skill by depth and
recency, running a scripted technical deep dive, and capturing what they want,
their pay, and their availability. **Role Fit** then scores the candidate
against every role to decide *what kind of role to place them in*. Exports are
an internal write-up.

## Where the code came from

A fork of [RHJOForm](https://github.com/davshe06/RHJOForm), a *client-side job
order intake* app. The reframe is done: the source captured **requirements
from a client**; this app captures **evidence from a candidate**. The 36-role
taxonomy came from RHJOForm; every question, tip, and step has been rebuilt for
interviewing.

**Recency matters as much as depth** — "expert, but last touched it four years
ago" is a different candidate. It's built into the depth model and into fit.

## Decisions so far (agreed with the owner)

- **All three catalogs** (Management Resources, Tech, Digital) — all 36 roles.
- **General skills interview**, not tied to a specific job order (bench / MPC).
  The interview *determines* the role; the recruiter shortlists roles the
  résumé points to, and Role Fit ranks every role.
- **Exports are internal only.** Candidate name, LinkedIn, contact info and
  current employer all stay in. No client submittal yet (see Exports).
- **Pay:** one pay-type selector (**W2 / IC / C2C**) with an **ideal range and
  a bottom end**, captured as both **hourly and salary**. C2C reveals the
  candidate's company details: name, owner vs. third-party vendor, contact
  name / email / phone, city/state. No EIN or insurance details (onboarding
  collects those). **Current pay is not asked.**
- **Work authorization** uses the two lawful questions only ("authorized to
  work in the US?", "require sponsorship now or in future?") — never
  citizenship. Background check / drug screen are **willingness only**.
- **No placeability scale.**
- **Stale-skill reminder:** yes — 3 years for fast-moving skills, 5 for slow.

## Architecture

Vanilla JS, vanilla CSS, **no build step, no dependencies, no framework**. Open
`index.html` directly or `python3 -m http.server 8000`. The only dependency
anywhere is `@anthropic-ai/sdk` inside the Vercel function. Keep it that way
unless asked — a recruiter can open a file and it works, and it deploys to
GitHub Pages as static files.

Load order (index.html): `skills-*.js` → `roles-*.js` → `interview.js` →
`docx.js` → `app.js`. Every data file is an IIFE registering into a global:

| File | Registers | What it holds |
| --- | --- | --- |
| `skills-shared.js`, `skills-tech.js`, `skills-finance.js`, `skills-digital.js` | `window.SKILLS` | The skill registry (185 skills) |
| `roles-management.js` (PTS), `roles-tech.js` (TTS), `roles-digital.js` (TTS) | `window.FORMS` | Role catalogs; roles reference skills by id |
| `interview.js` | `window.INTERVIEW` | Role-independent sections: candidate, motivation, history, wants, pay, next (screening, references, close), wrapup |

`app.js` is a **generic engine** — it knows nothing about specific roles or
skills. One interview record (`state`) spans all catalogs; role keys are
`"catalog:role"`. The PTS/TTS toggle only filters the role picker; the accent
follows the primary role's catalog (else the first role explored).

### Skills — the shared vocabulary

A skill that means the same thing across roles is **one skill**, shared by id
(e.g. `cloud_platforms` is on Backend, Full-Stack, Data Engineer, DevOps, and
Cloud Architect). Shared ids are what let Role Fit surface roles the recruiter
didn't shortlist — keep new skills shared where they genuinely overlap.

```js
cloud_platforms: {
  label, icon,
  decay: "fast",          // "fast" → stale after 3 years; "slow" → 5
  what: "…",              // one plain-language line for non-specialist recruiters
  ask: ["…", "…"],        // questions to put to the candidate, in order
  listen: "…",            // what a strong answer includes
  red: "…",               // red flags
  capture: [ questions ]  // structured fields, past tense — what they did
}
```

There is no separate proof point: the specific example behind a rating goes
in the skill's **Their experience** box (`state.skills[id].details`). Saved
interviews that still carry a `proof_point` have it moved into `details` on
load.

### Roles

```js
backend_engineer: {
  label, icon, tagline, about,  // about = plain-language explainer (notes rail)
  opener,     // the question that opens this role on the Skills step
  coach,      // what separates candidates / levels for this role
  certs,      // certification chips offered on the Candidate step
  skills: [skillIds],                     // interview order
  profiles: [{ skills: [ids], profile }], // owned/led recently ⇒ "marketable as"
  teammates: [{ label, skill? }],         // specialist overlapping an owned skill ⇒ probe
  tools: [{ id, label, options }],        // tools used hands-on (also feeds fit)
  aiUse, aiTools, metrics, environments   // chip options
}
```

### The five steps

The form follows the order a screening call actually runs. `STEPS` in `app.js`
groups the `interview.js` sections into five steps:

1. **Candidate & Motivation.** Roles to explore (picked from the résumé
   before the call), then the `candidate` and `motivation` sections: why
   they're looking, timing, other applications and recruiting firms, and
   counteroffer risk. These come first so the recruiter knows before the deep
   dive.
2. **Career History** (`history`). Position 1 is prefilled from the current
   title and employer if it hasn't been touched.
3. **Skills & Deep Dive.** Each skill is rated in one pass. Once it's rated
   Exposure or above, its row shows years, recency, evidence, interest, their
   experience, and the skill's deep dive (ask, signals, capture). Tools and AI
   use come after the skills.
4. **Wants, Pay & Close** (`wants`, `pay`, `next`). `next` holds screening
   willingness, references, interview availability, and agreed next steps.
5. **Role Fit & Wrap-up**, marked "After the call" in the nav. It holds Role
   Fit, the `wrapup` section (recruiter summary, concerns), then Review &
   Export. The write-up at the bottom redraws as the recruiter types above it.

**Question ids are unique across all sections.** The validator enforces this.
It's what lets `migrateInterview()` move a saved answer to whichever section
owns its question now. When a question is dropped, add it to
`RETIRED_QUESTIONS` so an old answer lands in the live notes instead of
vanishing.

### Interview sections (`interview.js`)

Question types: `text`, `textarea`, `number`, `select`, `radio`, `chips`
(always allows "+ Other…"), `textlist` (N numbered boxes), `group` (N repeated
mini-forms — career positions, references, other applications), `payrange` (ideal low–high + bottom end).
`optionsFrom: "certs" | "environments" | "metrics" | "teammates"` pulls chip
options from the shortlisted roles. `link: true` exports as a hyperlink.
`showIf(answers, state)` and tips' `when(answers, state)` as usual;
`exploring(state, catalogId)` gates catalog-specific questions (e.g. MR
capability pillars, Tech clearance).

Group fields are `{ id, label, placeholder, head?, long?, type?: "radio",
options?, showIf?(item) }`: `head` fields join into the item's lead line on
export ("Title — Company — Dates"), the rest export as "Label: value";
`showIf(item)` hides a field per item (e.g. the recruiting firm name appears
only when "Through a recruiting firm?" is Yes). The validator checks them.

## Experience Depth — the model

Each skill records, in `state.skills[skillId]`:

| Field | Values | Meaning |
| --- | --- | --- |
| `depth` | unset / `none` / `exposure` / `hands_on` / `owned` / `led` | unset = never discussed; `none` = asked, no real experience (a known gap) |
| `years` | `<1` / `1–2` / `3–5` / `6–9` / `10+` | cumulative years actually doing it |
| `last` | `"current"` / a year number / `"earlier"` | last hands-on. **Stored as an absolute year**, never "N years ago"; `"current"` is anchored to `state.interviewDate`; `"earlier"` = year not pinned down yet |
| `evidence` | `example` / `general` / `claimed` | walked me through it / described generally / résumé only |
| `interest` | `more` / `avoid` | wants more of it / wants to avoid it |
| `details` | free text | the specific example behind the rating, in their words. The box appears once a skill is rated Exposure or above and is exported after the rating line. It replaces the old per-skill proof point |

The depth test shown to recruiters: *could they deliver it tomorrow with nobody
helping?* Definitions live in `DEPTH_LEVELS` in `app.js`.

**Stale skills:** a Hands-on-or-deeper skill whose last hands-on year is
`STALE_YEARS[skill.decay]` or more years ago (fast 3, slow 5) shows "Last did
this in YYYY. Ask what's changed since then and how quickly they'd get back up
to speed." Other engine-side prompts: Owned/Led on résumé only, 6+ years of
Exposure, strong-but-wants-to-avoid, "earlier" without a year, 5+ Owned/Led.

Deep dives open inside the skill's row once it's rated Exposure or deeper.
Owned/Led dives start open. A dive the recruiter opened or closed keeps that
state when the row redraws.

## Role Fit

`roleFit()` scores **every** role on its own skills: None 0, Exposure .25,
Hands-on .6, Owned .85, Led 1; stale ×.6; unrated = 0 (coverage matters); a
skill used by 5+ roles weighs half. With 3+ tools recorded, tool overlap is
20% — but only for roles whose skills already score above zero (tools adjust a
score, never create one). Roles show only with a non-zero fit or when explored.
`roleProfile()` gives "Currently / Was marketable as"; `suggestedLevel()`
suggests seniority from ratings (ignoring None) and direct reports. "Explore"
adds a role to the shortlist and jumps to the Skills step.

## Exports — internal only

All exports are internal recruiter write-ups and carry everything captured.
Four export paths stay in sync because they all read `collectSummary()`:
on-screen summary, markdown copy, Word (`docx.js`), and print/PDF.

**If a client submittal is built later**, it must **fail closed**: every field
opts in to the client export (anything unmarked stays internal), a pre-export
scan blocks any private value (pay normalized to digits, email, phone, C2C
company details) found anywhere in the rendered output, and a browser test
fills the private fields with sentinel values and asserts none appear in the
markdown, print HTML, or Word XML. Getting this wrong leaks a candidate's pay
to a hiring manager.

## Conventions

**Nobody should ever need a hard refresh.** `sw.js` (a service worker,
registered from `app.js` over http/https only) makes every load revalidate
with the server and tags each `.js`/`.css` URL per load, so a normal reload or
revisit always runs the latest deploy — even if a `?v` bump is forgotten. It
falls back to its Cache Storage copy only when offline. A tab left open across
a deploy gets a "new version available — Reload" bar (it compares its `?v`
with the live `index.html`), and the current step survives the reload. Keep
the service worker network-first; never make it cache-first. To retire it,
ship an `sw.js` that unregisters itself — deleting the file leaves installed
workers running.

**Still bump `?v=N` on every deploy** — it covers first visits before the
service worker installs, and it's what triggers the reload bar in open tabs.

**Storage keys are namespaced `rh-interview-*`** (record: `rh-interview-v2`;
current step per tab: sessionStorage `rh-interview-step`; offline copy: Cache
Storage `rh-interview-offline-*`).
RHJOForm, TDCJOchecklist and this app are all served from `davshe06.github.io`,
and `localStorage` is per-**origin**, not per-path. Never revert these to a
sibling's keys or the apps will overwrite each other's saved data.

**Validate catalogs after editing them:** `node tools/check-catalogs.cjs` —
checks every role's skills, profiles, and teammates resolve; skill shape;
question types; and that no skill is orphaned. (`.cjs` because `package.json`
is `"type": "module"` for the Vercel function.)

**Verify in a real browser before committing:** `node tools/browser-test.cjs`
drives `file://index.html` in Chromium
(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) through a full
interview, every export, all 36 roles, persistence, dark mode, and 390px
width; then serves a copy with GitHub Pages' caching headers to check that
deploys show up without a hard refresh (with a no-service-worker control),
the reload bar, and offline loading. It fails on any `pageerror` or console
error. Extend it when behavior
changes. Syntax checks alone have missed real bugs here.

**Theming.** Colors are CSS custom properties. Light lives on bare `:root`; dark
is duplicated across `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`, with `:root[data-theme="light"]` pinning light. The
active catalog is stamped on `<html>` as `data-form` and per-business accents
key off it — Management Resources red (`#ad0019`), Tech/Digital blue
(`#2456d6`). Never hard-code an accent in a component; use the tokens,
including `--accent-ring` for focus rings.

## Relationship to the sibling repos — do not modify them

- **RHJOForm** — the client intake app this was forked from.
- **TDCJOchecklist** — a condensed checklist variant of the client intake.

The role catalogs here are **no longer byte-identical** to RHJOForm's: every
focus area was mapped onto the shared skill registry and all wording rewritten
for interviews, so an overlay would have been as large as the catalog. What
still lines up with RHJOForm is the role list (ids, labels, `about`, tool
option lists). When RHJOForm adds or changes a role, port it by hand: add the
role here with its skills (reusing existing skill ids wherever the skill is
the same), then run the validator and browser test.

## Deployment

- **GitHub Pages:** Settings → Pages → branch `main`, folder `/ (root)`.
- **AI analysis:** `api/analyze.js` on Vercel with `ANTHROPIC_API_KEY` set
  server-side — the key must never reach the browser. When hosted on Pages, the
  endpoint URL is pasted into the AI settings on the Role Fit & Wrap-up step. The
  prompt assesses a **candidate**: placement read, strengths, gaps and risks,
  probes the recruiter missed, and a candidate summary without pay or contact
  details.

## Commit trailer

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: <session url>
```

Never put a model identifier in code comments, PR titles/bodies, or any other
pushed artifact — commit trailers only.

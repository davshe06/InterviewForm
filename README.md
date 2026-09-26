# Candidate Interview Form

A recruiter-side interview tool. A recruiter works it live while screening a
candidate: why they're looking, walking the résumé, rating each skill by
depth, recency, and evidence with a scripted technical deep dive, and
capturing what the candidate wants, their pay, and their availability. After
the call, Role Fit scores the candidate against all 36 roles to decide where
to place them. The result exports as an internal write-up.

Forked from [RHJOForm](https://github.com/davshe06/RHJOForm), a client-side job
order intake app. The role taxonomy came from there; the questions, coaching,
and flow have been rebuilt for interviewing candidates.

## The interview

Five steps, in the order a screening call runs:

1. **Candidate & Motivation**
   - Before the call: pick the 1–3 roles the résumé points to (from PTS or
     TTS).
   - On the call: contact details, work authorization, portfolio, and why
     they're looking. The motivation part covers how soon they could move,
     other roles they've applied to (and through which recruiting firm), and
     counteroffer risk.
2. **Career History**: recent positions, including the manager they reported
   to, what they owned, and why they left.
3. **Skills & Deep Dive**
   - Every skill of the roles being explored is rated None / Exposure /
     Hands-on / Owned / Led, with years, last hands-on year, evidence,
     interest, and their experience.
   - Once a skill is rated, its deep dive opens in place: the questions to
     ask, what strong answers include, red flags, and structured capture.
   - Tools and AI use follow the skills.
4. **Wants, Pay & Close**
   - What they want next.
   - Pay and logistics: W2 / IC / C2C, hourly and salary ranges.
   - Screening willingness, references, interview availability, and agreed
     next steps.
5. **Role Fit & Wrap-up** (after the call)
   - Every role scored against the ratings, with a suggested level and the
     primary role.
   - Your summary and concerns.
   - Review and export.

## Running it

No build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / `/ (root)`.

## Layout

| File | Purpose |
| --- | --- |
| `index.html` | Page shell; loads skills, then roles, then the interview steps, then the engine |
| `skills-*.js` | The skill registry — 185 skills, each with interview questions, answer signals, and capture fields |
| `roles-*.js` | Role catalogs — Management Resources (PTS, 14), Tech (TTS, 13), Digital & Marketing (TTS, 9) |
| `interview.js` | Role-independent question sections: candidate, motivation, history, wants, pay, screening & close, wrap-up |
| `app.js` | Generic render engine — steps, state, depth model, role fit, exports, theming |
| `styles.css` | All styling, including light/dark and per-business accents |
| `docx.js` | Dependency-free Word (.docx) generator |
| `sw.js` | Service worker — every load gets the latest deploy (no hard refresh); works offline |
| `api/analyze.js` | Vercel serverless function for AI analysis |
| `tools/check-catalogs.cjs` | Validates skills, roles, and interview steps — `node tools/check-catalogs.cjs` |
| `tools/browser-test.cjs` | End-to-end browser test — `node tools/browser-test.cjs` |

See `CLAUDE.md` for the full architecture and conventions.

## Storage keys

Namespaced `rh-interview-*` so this app does not collide with RHJOForm or
TDCJOchecklist — all three are served from `davshe06.github.io`, which is a
single origin, and `localStorage` is per-origin rather than per-path.

## Updates without a hard refresh

`sw.js` makes every load check the server, so a normal reload (or reopening
the page) always shows the latest deploy, and the form still opens offline. A
tab left open across a deploy shows a "new version available" bar with a
Reload button; answers and the current step are kept. `index.html` still
appends `?v=N` to every asset — bump `N` on each deploy.

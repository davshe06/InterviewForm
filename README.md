# Candidate Interview Form

A recruiter-side interview tool. A recruiter works it live while screening a
candidate: walking the résumé, rating each skill by depth, recency, and
evidence, running a scripted technical deep dive, and capturing what the
candidate wants, their pay, and their availability. The Role Fit step then
scores the candidate against all 36 roles to decide where to place them. The
result exports as an internal write-up.

Forked from [RHJOForm](https://github.com/davshe06/RHJOForm), a client-side job
order intake app. The role taxonomy came from there; the questions, coaching,
and flow have been rebuilt for interviewing candidates.

## The interview

1. **Candidate & Roles** — contact details, work authorization, and the 1–3
   roles the résumé points to (from either PTS or TTS).
2. **Career History** — recent positions (with the manager they reported to), what they owned, why they left.
3. **Experience Depth** — every skill of the roles being explored, rated
   None / Exposure / Hands-on / Owned / Led, with years, last hands-on year,
   evidence, and interest.
4. **Technical Deep Dive** — for each rated skill: questions to ask, what
   strong answers include, red flags, structured capture, and a proof point.
5. **Role Fit** — every role scored against the ratings, a suggested level,
   and the recruiter's choice of primary role.
6. **What They Want**, 7. **Pay & Logistics** (W2 / IC / C2C, hourly and
   salary ranges), 8. **References & Applications** (references, other roles
   they've applied to, and which recruiting firm if any), 9. **Screening &
   Next Steps**, 10. **Review & Export**.

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
| `interview.js` | Role-independent steps: candidate, history, wants, pay, references & applications, screening |
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

# Candidate Interview Form

A recruiter-side interview tool. A recruiter works it live while interviewing a
candidate — capturing verified experience depth, motivations, comp, and
availability — then exports an internal write-up plus a client-safe submittal
profile.

Forked from [RHJOForm](https://github.com/davshe06/RHJOForm), a client-side job
order intake app. The role taxonomy carries over unchanged; the questions are
being reframed from *requirements a client wants* to *evidence a candidate has*.

> **Status: initial import.** The code is still the client-intake app. See
> `CLAUDE.md` for the reframe plan.

## Running it

No build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

GitHub Pages: Settings → Pages → Deploy from a branch → `main` / `/ (root)`.

## Layout

| File | Purpose |
| --- | --- |
| `index.html` | Page shell; loads the catalogs, then the engine |
| `app.js` | Generic render engine — steps, state, exports, theming |
| `styles.css` | All styling, including light/dark and per-business accents |
| `docx.js` | Dependency-free Word (.docx) generator |
| `roles-management.js` | Management Resources catalog (PTS) — 14 roles |
| `roles-tech.js` | Tech catalog (TTS) — 13 roles |
| `roles-digital.js` | Digital & Marketing catalog (TTS) — 9 roles |
| `api/analyze.js` | Vercel serverless function for AI analysis |

`app.js` is generic — it renders whatever the `roles-*.js` catalogs register into
`window.FORMS`. Adding or removing a form is a file plus a `<script>` tag, with
no engine changes. See `CLAUDE.md` for the full architecture and conventions.

## Storage keys

Namespaced `rh-interview-*` so this app does not collide with RHJOForm or
TDCJOchecklist — all three are served from `davshe06.github.io`, which is a
single origin, and `localStorage` is per-origin rather than per-path.

## Cache busting

`index.html` appends `?v=N` to every asset. Bump `N` on each deploy so browsers
and the GitHub Pages CDN fetch fresh files instead of serving stale copies.

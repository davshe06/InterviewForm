/* =========================================================================
   Candidate Interview — render engine
   ---------------------------------------------------------------------------
   One interview record per candidate. The recruiter shortlists the roles the
   résumé points to; their skills (skills-*.js) drive Experience Depth and the
   Technical Deep Dive; Role Fit then scores every role in every catalog
   against the ratings, so the interview decides the placement, not the
   shortlist. Role-independent steps come from interview.js. This file knows
   nothing about specific roles or skills.
   ========================================================================= */

const STORAGE_KEY = "rh-interview-v2";

/* ---------- businesses, catalogs, roles ----------
   FORMS (roles-*.js) holds the three role catalogs, each tagged with its line
   of business. The business toggle filters the role picker and sets the
   accent; the interview itself spans catalogs. Role keys are "catalog:role". */

const BUSINESSES = {
  pts: { id: "pts", label: "PTS", full: "Project & Talent Solutions" },
  tts: { id: "tts", label: "TTS", full: "Technology & Transformation Solutions" }
};
const BUSINESS_ORDER = ["pts", "tts"];
const IV = window.INTERVIEW;

function catalogsFor(bid) { return Object.keys(FORMS).filter(id => FORMS[id].business === bid); }

function allRoleKeys() {
  const out = [];
  Object.keys(FORMS).forEach(cat => FORMS[cat].roleOrder.forEach(rid => out.push(cat + ":" + rid)));
  return out;
}

function roleByKey(key) {
  if (!key) return null;
  const [cat, rid] = key.split(":");
  const role = FORMS[cat] && FORMS[cat].roles[rid];
  return role ? { key, cat, rid, role } : null;
}

function shortlistRoles() { return state.shortlist.map(roleByKey).filter(Boolean); }

/* true when a shortlisted (or chosen primary) role comes from this catalog —
   used by interview.js for catalog-specific questions */
function exploring(s, cat) {
  const keys = (s.shortlist || []).concat(s.fit && s.fit.primary ? [s.fit.primary] : []);
  return keys.some(k => k.split(":")[0] === cat);
}

/* ---------- state ---------- */

function blankInterview() {
  return {
    shortlist: [],
    common: { candidate: {}, history: {}, wants: {}, pay: {}, next: {} },
    skills: {},          /* skill id → { depth, years, last, evidence, interest } */
    dives: {},           /* skill id → deep-dive answers, incl. proof_point */
    customSkills: [],    /* recruiter-added skills: { id, label } */
    tools: {},           /* tool category key → chips */
    ai: {},
    fit: { primary: null, also: [], level: null, notes: "" },
    notes: { pretext: "", live: "", pretextH: null, liveH: null },
    aiAnalysis: null,
    interviewDate: null
  };
}

function defaultStore() { return { businessId: BUSINESS_ORDER[0], interview: blankInterview() }; }

let store = loadStore();
let state = store.interview;
/* The step is remembered per tab (sessionStorage), so a reload — including
   the "new version" reload further down — lands back where the recruiter was. */
const STEP_KEY = "rh-interview-step";
let currentStep = restoreStep();

function restoreStep() {
  try { return Math.max(0, parseInt(sessionStorage.getItem(STEP_KEY), 10) || 0); }
  catch (e) { return 0; }
}
function rememberStep() {
  try { sessionStorage.setItem(STEP_KEY, String(currentStep)); } catch (e) {}
}

function loadStore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.interview) {
      const base = defaultStore();
      if (BUSINESSES[saved.businessId]) base.businessId = saved.businessId;
      const s = saved.interview, iv = base.interview;
      iv.shortlist = (s.shortlist || []).filter(k => roleByKey(k));
      iv.common = Object.assign(iv.common, s.common || {});
      ["skills", "dives", "tools", "ai"].forEach(k => { iv[k] = s[k] || {}; });
      iv.customSkills = s.customSkills || [];
      iv.fit = Object.assign(iv.fit, s.fit || {});
      iv.notes = Object.assign(iv.notes, s.notes || {});
      iv.aiAnalysis = s.aiAnalysis || null;
      iv.interviewDate = s.interviewDate || null;
      return base;
    }
  } catch (e) { /* corrupted — start fresh */ }
  return defaultStore();
}

let saveTimer = null;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, 200);
}
function flushSave() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) {}
}
/* Flush any pending debounced save before the page goes away, so a quick
   reload or tab close never drops the last edit. */
window.addEventListener("pagehide", flushSave);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushSave();
});

function switchBusiness(bid) {
  if (bid === store.businessId || !BUSINESSES[bid]) return;
  store.businessId = bid;
  saveState();
  render();
}

/* ---------- theme ----------
   "auto" follows the system preference via the prefers-color-scheme media
   query; "light"/"dark" pin it by stamping data-theme on <html>. Stored under
   its own key — a UI preference, so "Start new interview" leaves it alone. */

const THEME_KEY = "rh-interview-theme";

function themePref() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : "auto";
  } catch (e) { return "auto"; }
}

function applyTheme(pref) {
  if (pref === "light" || pref === "dark") {
    document.documentElement.dataset.theme = pref;
  } else {
    delete document.documentElement.dataset.theme;
  }
}

function setThemePref(pref) {
  try {
    if (pref === "auto") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch (e) {}
  applyTheme(pref);
}

applyTheme(themePref());

/* ---------- experience depth model ----------
   Each skill records what the candidate has actually done:
     depth    — what they could deliver unaided (see DEPTH_LEVELS)
     years    — cumulative years doing it, not tenure in a job that listed it
     last     — last hands-on: "current" (as of the interview), a year, or
                "earlier" until the year is pinned down
     evidence — how well they backed the rating up
     interest — whether they want more of it or want to avoid it
   A skill with no depth was never discussed; "none" means asked, and they
   have no real experience — a known gap. */

const DEPTH_LEVELS = [
  { id: "none", label: "None", def: "Asked — no real experience." },
  { id: "exposure", label: "Exposure", def: "Assisted, trained on it, or worked alongside it. Couldn't do it alone." },
  { id: "hands_on", label: "Hands-on", def: "Did it independently and repeatedly, within a scope someone else set." },
  { id: "owned", label: "Owned", def: "Accountable for the outcome and set the scope. Can explain the trade-offs and what went wrong." },
  { id: "led", label: "Led", def: "Set the direction, built or rebuilt it, taught others." }
];
const DEPTH_RANK = { none: 0, exposure: 1, hands_on: 2, owned: 3, led: 4 };
const YEARS_OPTIONS = ["<1", "1–2", "3–5", "6–9", "10+"];
const EVIDENCE_OPTIONS = [
  { id: "example", label: "Walked me through it" },
  { id: "general", label: "Described generally" },
  { id: "claimed", label: "Résumé only" }
];
const INTEREST_OPTIONS = [
  { id: "more", label: "↑ Wants more" },
  { id: "avoid", label: "↓ Wants to avoid" }
];

/* Years since last hands-on before a Hands-on-or-deeper skill gets the
   "ask what's changed" prompt. Each skill declares how fast it decays: tech,
   digital, and platform skills are "fast" (3 years); accounting, finance, and
   delivery skills are "slow" (5 years). */
const STALE_YEARS = { fast: 3, slow: 5 };

function depthRank(a) { return a && DEPTH_RANK[a.depth] != null ? DEPTH_RANK[a.depth] : -1; }
function depthLabel(id) { const d = DEPTH_LEVELS.find(x => x.id === id); return d ? d.label : ""; }

/* Stamped the first time it's needed and cleared by "Start new interview".
   Recency chips and "hands-on now" are anchored to it. */
function interviewDate() {
  if (!state.interviewDate) {
    const d = new Date();
    state.interviewDate = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
    saveState();
  }
  return state.interviewDate;
}
function interviewYear() { return +interviewDate().slice(0, 4); }

function lastYear(a) {
  if (!a || a.last == null) return null;
  if (a.last === "current") return interviewYear();
  return typeof a.last === "number" ? a.last : null;
}
function yearsSinceHandsOn(a) {
  const y = lastYear(a);
  return y == null ? null : new Date().getFullYear() - y;
}
function staleCutoff(skillId) {
  const def = skillDef(skillId);
  return STALE_YEARS[(def && def.decay) || "fast"];
}
function isStale(a, skillId) {
  const age = yearsSinceHandsOn(a);
  return depthRank(a) >= DEPTH_RANK.hands_on && age != null && age >= staleCutoff(skillId);
}

/* ---------- skills ---------- */

function slugId(label) {
  return "custom_" + label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    + "_" + Math.random().toString(36).slice(2, 6);
}

/* A recruiter-added skill gets a generic deep dive. Its staleness follows the
   catalogs being explored: slow if any is Management Resources. */
function customSkillDef(c) {
  const slow = shortlistRoles().some(r => r.cat === "management");
  return {
    id: c.id, label: c.label, icon: "➕", custom: true, decay: slow ? "slow" : "fast",
    what: "A skill you added for this candidate.",
    ask: ["Walk me through the most recent time you used this — what was the situation, what did you do, and what was the result?"],
    listen: "Specifics: scope, their own decisions, and a measurable result.",
    red: "Only generalities, or the team's work described as their own.",
    capture: [
      { id: "details", type: "textarea", label: "What did they do here?", placeholder: "Scope, scale, what they owned vs. supported…" },
      { id: "tools", type: "text", label: "Tools / platforms used", placeholder: "Tools, platforms, certifications…" }
    ]
  };
}

function skillDef(id) {
  if (SKILLS[id]) return Object.assign({ id }, SKILLS[id]);
  const c = (state.customSkills || []).find(x => x.id === id);
  return c ? customSkillDef(c) : null;
}

function skillState(id) {
  if (!state.skills[id]) state.skills[id] = {};
  if (!state.dives[id]) state.dives[id] = {};
  return state.skills[id];
}

/* Skills of the shortlisted roles, in interview order, each listed once with
   the roles that share it; recruiter-added skills last. */
function interviewSkills() {
  const seen = {};
  const out = [];
  shortlistRoles().forEach(r => r.role.skills.forEach(id => {
    if (seen[id]) { seen[id].roles.push(r.key); return; }
    const entry = { id, def: skillDef(id), roles: [r.key] };
    seen[id] = entry;
    out.push(entry);
  }));
  (state.customSkills || []).forEach(c => out.push({ id: c.id, def: customSkillDef(c), roles: [] }));
  return out;
}

/* How many roles (across every catalog) use each skill. A skill most roles
   share tells you little about which role fits, so Role Fit weights it less. */
let usageCache = null;
function skillUsage() {
  if (usageCache) return usageCache;
  usageCache = {};
  allRoleKeys().forEach(k => roleByKey(k).role.skills.forEach(id => { usageCache[id] = (usageCache[id] || 0) + 1; }));
  return usageCache;
}

/* ---------- role fit ----------
   Each role scores the candidate on its own skills: depth → value (None 0,
   Exposure .25, Hands-on .6, Owned .85, Led 1), stale skills count at 60%,
   unrated skills count as 0 (so coverage matters), and a skill five or more
   roles share counts half. When the candidate has named 3+ tools, tool
   overlap with the role's tool lists contributes 20% — but only for a role
   whose skills already score above zero. */

const DEPTH_VALUE = { none: 0, exposure: .25, hands_on: .6, owned: .85, led: 1 };

function candidateTools() {
  const set = new Set();
  Object.values(state.tools || {}).forEach(v => (Array.isArray(v) ? v : []).forEach(t => set.add(String(t).toLowerCase().trim())));
  return set;
}

function roleFit(key) {
  const r = roleByKey(key);
  if (!r) return null;
  const usage = skillUsage();
  let wsum = 0, vsum = 0, rated = 0;
  r.role.skills.forEach(id => {
    const w = usage[id] >= 5 ? .5 : 1;
    wsum += w;
    const a = state.skills[id];
    if (depthRank(a) < 0) return;
    rated++;
    let v = DEPTH_VALUE[a.depth] || 0;
    if (isStale(a, id)) v *= .6;
    vsum += w * v;
  });
  const skillScore = wsum ? vsum / wsum : 0;
  const tools = candidateTools();
  let toolScore = null;
  if (tools.size >= 3) {
    const opts = new Set();
    r.role.tools.forEach(c => c.options.forEach(o => opts.add(o.toLowerCase().trim())));
    let hit = 0;
    opts.forEach(o => { if (tools.has(o)) hit++; });
    toolScore = opts.size ? Math.min(1, hit / Math.min(5, opts.size)) : 0;
  }
  /* tools only adjust a score the skills have earned — never create one */
  const fit = toolScore == null || skillScore === 0 ? skillScore : .8 * skillScore + .2 * toolScore;
  return { key, r, fit, rated, total: r.role.skills.length, profile: roleProfile(r.role) };
}

function rankedFits() {
  return allRoleKeys().map(roleFit)
    .filter(f => f.fit > 0 || state.shortlist.includes(f.key) || state.fit.primary === f.key)
    .sort((a, b) => b.fit - a.fit);
}

/* Placement profile for a role: its profiles' skill sets matched against
   skills the candidate owned or led — recent ones first; a match that only
   works by counting stale skills is labelled as such. */
function roleProfile(role) {
  const strong = role.skills.filter(id => depthRank(state.skills[id]) >= DEPTH_RANK.owned);
  if (!strong.length) return null;
  const fresh = strong.filter(id => !isStale(state.skills[id], id));
  const match = ids => role.profiles.find(p => p.skills.every(id => ids.includes(id)));
  let p = match(fresh);
  if (p) return { kicker: "Currently marketable as", profile: p.profile, skills: p.skills, stale: false };
  p = match(strong);
  if (p) return { kicker: "Was marketable as", profile: p.profile + " (stale)", skills: p.skills, stale: true };
  return null;
}

/* Suggested seniority from the depth ratings on a role's skills they have
   (a "None" gap doesn't lower it), lifted to Manager / Director when they
   lead a team. A starting point, not a verdict. */
function suggestedLevel(key) {
  const r = roleByKey(key);
  if (!r) return null;
  const ranks = r.role.skills.map(id => depthRank(state.skills[id])).filter(x => x >= DEPTH_RANK.exposure);
  if (ranks.length < 2) return null;
  const mean = ranks.reduce((s, x) => s + x, 0) / ranks.length;
  const reports = state.common.history.direct_reports;
  if (mean >= 3 && (reports === "9–15" || reports === "16+")) return "Director / executive";
  if (mean >= 2.6 && (reports === "4–8" || reports === "9–15" || reports === "16+")) return "Manager";
  if (mean >= 3.3) return "Lead / principal";
  if (mean >= 2.6) return "Senior";
  if (mean >= 1.8) return "Mid-level";
  return "Entry / junior";
}

/* ---------- wizard structure ---------- */

const STEPS = [
  { kind: "candidate", title: "Candidate & Roles" },
  { kind: "common", key: "history", title: "Career History" },
  { kind: "depth", title: "Experience Depth" },
  { kind: "dives", title: "Technical Deep Dive" },
  { kind: "fit", title: "Role Fit" },
  { kind: "common", key: "wants", title: "What They Want" },
  { kind: "common", key: "pay", title: "Pay & Logistics" },
  { kind: "common", key: "next", title: "Screening & Next Steps" },
  { kind: "review", title: "Review & Export" }
];

/* Union of a role field across the shortlisted roles, for optionsFrom chips. */
function shortlistOptions(kind) {
  const out = [];
  shortlistRoles().forEach(r => (r.role[kind] || []).forEach(o => {
    const label = typeof o === "string" ? o : o.label;
    if (!out.includes(label)) out.push(label);
  }));
  return out;
}

/* A common step's definition with role-dependent options resolved, so
   rendering and export use identical question sets. */
function commonStepDef(key) {
  const step = IV.steps[key];
  const questions = step.questions.map(q => q.optionsFrom ? Object.assign({}, q, { options: shortlistOptions(q.optionsFrom) }) : q);
  return Object.assign({}, step, { questions, answers: state.common[key] });
}

/* ---------- DOM + rendering utilities ---------- */

function el(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function esc(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderQuestions(container, questions, answers, scopeId, onChange) {
  const wrappers = {};

  questions.forEach(q => {
    const wrap = el("div", "question");
    wrap.dataset.qid = q.id;
    wrappers[q.id] = wrap;
    wrap.appendChild(el("label", "q-label", esc(q.label)));
    if (q.help) wrap.appendChild(el("p", "q-help", esc(q.help)));

    const name = scopeId + "__" + q.id;
    const val = answers[q.id];

    if (q.type === "text" || q.type === "number") {
      const input = el("input");
      input.type = q.type;
      input.placeholder = q.placeholder || "";
      input.value = val != null ? val : "";
      input.addEventListener("input", () => { answers[q.id] = input.value; changed(); });
      wrap.appendChild(input);
    } else if (q.type === "textarea") {
      const ta = el("textarea");
      ta.placeholder = q.placeholder || "";
      ta.rows = 3;
      ta.value = val || "";
      ta.addEventListener("input", () => { answers[q.id] = ta.value; changed(); });
      wrap.appendChild(ta);
    } else if (q.type === "textlist") {
      /* a fixed number of short-answer boxes stored as a ranked array */
      const count = q.count || 3;
      if (!Array.isArray(answers[q.id])) answers[q.id] = [];
      const list = el("div", "textlist");
      for (let i = 0; i < count; i++) {
        const row = el("div", "textlist-row");
        row.appendChild(el("span", "textlist-num", (i + 1) + "."));
        const input = el("input");
        input.type = "text";
        input.placeholder = q.placeholder || "";
        input.value = answers[q.id][i] || "";
        input.addEventListener("input", () => { answers[q.id][i] = input.value; changed(); });
        row.appendChild(input);
        list.appendChild(row);
      }
      wrap.appendChild(list);
    } else if (q.type === "group") {
      /* N repeated mini-forms (e.g. positions), stored as an array of objects */
      if (!Array.isArray(answers[q.id])) answers[q.id] = [];
      const list = el("div", "group-list");
      for (let i = 0; i < (q.count || 3); i++) {
        const item = answers[q.id][i] || (answers[q.id][i] = {});
        const card = el("div", "group-item");
        card.appendChild(el("div", "group-num", String(i + 1)));
        const grid = el("div", "group-grid");
        q.fields.forEach(f => {
          const cell = el("label", "group-field" + (f.long ? " long" : ""));
          cell.appendChild(el("span", "group-field-lab", esc(f.label)));
          const input = el(f.long ? "textarea" : "input");
          if (!f.long) input.type = "text";
          else input.rows = 2;
          input.placeholder = f.placeholder || "";
          input.value = item[f.id] || "";
          input.addEventListener("input", () => { item[f.id] = input.value; changed(); });
          cell.appendChild(input);
          grid.appendChild(cell);
        });
        card.appendChild(grid);
        list.appendChild(card);
      }
      wrap.appendChild(list);
    } else if (q.type === "payrange") {
      /* ideal low–high plus the bottom end they'd walk away below */
      const v = (answers[q.id] && typeof answers[q.id] === "object") ? answers[q.id] : (answers[q.id] = {});
      const row = el("div", "payrange");
      const num = (key, ph) => {
        const box = el("span", "pay-input");
        box.appendChild(el("span", "pay-cur", "$"));
        const input = el("input");
        input.type = "number"; input.min = 0; input.step = q.step || 1; input.placeholder = ph;
        input.value = v[key] != null ? v[key] : "";
        input.setAttribute("aria-label", q.label + " " + ph);
        input.addEventListener("input", () => { v[key] = input.value; changed(); });
        box.appendChild(input);
        return box;
      };
      const ideal = el("div", "pay-block");
      ideal.appendChild(el("span", "pay-lab", "Ideal range"));
      const idealRow = el("div", "pay-row");
      idealRow.appendChild(num("min", "low"));
      idealRow.appendChild(el("span", "sched-dash", "–"));
      idealRow.appendChild(num("max", "high"));
      idealRow.appendChild(el("span", "pay-unit", esc(q.unit || "")));
      ideal.appendChild(idealRow);
      const floor = el("div", "pay-block");
      floor.appendChild(el("span", "pay-lab", "Bottom end"));
      const floorRow = el("div", "pay-row");
      floorRow.appendChild(num("floor", "walk-away"));
      floorRow.appendChild(el("span", "pay-unit", esc(q.unit || "")));
      floor.appendChild(floorRow);
      row.appendChild(ideal);
      row.appendChild(floor);
      wrap.appendChild(row);
    } else if (q.type === "select") {
      const sel = el("select");
      sel.appendChild(el("option", null, "— select —"));
      q.options.forEach(o => {
        const opt = el("option", null, esc(o));
        opt.value = o;
        if (val === o) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener("change", () => {
        answers[q.id] = sel.selectedIndex === 0 ? undefined : sel.value;
        changed();
      });
      wrap.appendChild(sel);
    } else if (q.type === "radio") {
      const group = el("div", "seg-group");
      q.options.forEach(o => {
        const lab = el("label", "seg");
        const input = el("input");
        input.type = "radio"; input.name = name; input.value = o;
        if (val === o) input.checked = true;
        input.addEventListener("change", () => { answers[q.id] = o; changed(); });
        lab.appendChild(input);
        lab.appendChild(el("span", null, esc(o)));
        group.appendChild(lab);
      });
      wrap.appendChild(group);
    } else if (q.type === "chips") {
      /* Chip groups accept custom entries: values in the answer array that
         aren't suggested options render as removable custom chips, and a
         "+ Other…" inline input adds new ones. */
      const group = el("div", "chip-group");
      if (!Array.isArray(answers[q.id])) answers[q.id] = [];

      const buildChips = (focusAdder) => {
        group.innerHTML = "";
        const custom = (answers[q.id] || []).filter(v => !q.options.includes(v));
        q.options.concat(custom).forEach(o => {
          const isCustom = !q.options.includes(o);
          const lab = el("label", "chip" + (isCustom ? " custom" : ""));
          const input = el("input");
          input.type = "checkbox";
          input.checked = (answers[q.id] || []).includes(o);
          input.addEventListener("change", () => {
            const cur = answers[q.id] || (answers[q.id] = []);
            if (input.checked) { if (!cur.includes(o)) cur.push(o); }
            else answers[q.id] = cur.filter(x => x !== o);
            changed();
            if (isCustom && !input.checked) buildChips(false); // unchecked custom chip disappears
          });
          lab.appendChild(input);
          lab.appendChild(el("span", null, esc(o)));
          group.appendChild(lab);
        });

        const addLab = el("label", "chip chip-add");
        const addInput = el("input");
        addInput.type = "text";
        addInput.placeholder = "+ Other…";
        const commit = (refocus) => {
          const v = addInput.value.trim();
          if (!v) return;
          const cur = answers[q.id] || (answers[q.id] = []);
          if (!cur.includes(v)) cur.push(v);
          changed();
          buildChips(refocus);
        };
        addInput.addEventListener("keydown", e => {
          if (e.key === "Enter") { e.preventDefault(); commit(true); }
        });
        addInput.addEventListener("blur", () => commit(false));
        addLab.appendChild(addInput);
        group.appendChild(addLab);
        if (focusAdder) addInput.focus();
      };

      buildChips(false);
      wrap.appendChild(group);
    }

    container.appendChild(wrap);
  });

  function updateVisibility() {
    questions.forEach(q => {
      if (!q.showIf) return;
      wrappers[q.id].classList.toggle("hidden", !q.showIf(answers, state));
    });
  }
  function changed() { updateVisibility(); saveState(); if (onChange) onChange(); }
  updateVisibility();
}

function renderTips(container, rules, answers) {
  container.innerHTML = "";
  (rules || []).forEach(rule => {
    let show = false;
    try { show = !!rule.when(answers, state); } catch (e) {}
    if (show) container.appendChild(el("div", "tip", "💡 " + esc(rule.text)));
  });
}

/* ---------- interview availability (two days × two windows) ---------- */

function dateField(obj, key) {
  const wrap = el("label", "sched-field");
  wrap.appendChild(el("span", "sched-field-lab", "Date"));
  const inp = el("input");
  inp.type = "date";
  inp.value = obj[key] || "";
  inp.addEventListener("change", () => { obj[key] = inp.value; saveState(); });
  wrap.appendChild(inp);
  return wrap;
}

function timeField(obj, key, labelTxt) {
  const wrap = el("label", "sched-field");
  wrap.appendChild(el("span", "sched-field-lab", labelTxt));
  const inp = el("input");
  inp.type = "time";
  inp.value = obj[key] || "";
  inp.addEventListener("change", () => { obj[key] = inp.value; saveState(); });
  wrap.appendChild(inp);
  return wrap;
}

function ensureDayWindows(sc) {
  if (!Array.isArray(sc.days)) sc.days = [];
  while (sc.days.length < 2) sc.days.push({ date: "", ranges: [] });
  sc.days.forEach(d => {
    if (!Array.isArray(d.ranges)) d.ranges = [];
    while (d.ranges.length < 2) d.ranges.push({ start: "", end: "" });
  });
  return sc.days;
}

function buildDayWindows(sc, title) {
  const days = ensureDayWindows(sc);
  const block = el("div", "sched-block daywin-block");
  block.appendChild(el("div", "sched-label", title));
  days.forEach((d, di) => {
    const row = el("div", "sched-row daywin-day");
    row.appendChild(el("div", "sched-sublabel", "Day " + (di + 1)));
    const controls = el("div", "sched-controls");
    controls.appendChild(dateField(d, "date"));
    d.ranges.forEach((r, ri) => {
      const grp = el("div", "sched-window");
      grp.appendChild(el("span", "sched-window-lab", "Window " + (ri + 1)));
      const inner = el("div", "sched-range");
      inner.appendChild(timeField(r, "start", "Start"));
      inner.appendChild(el("span", "sched-dash", "–"));
      inner.appendChild(timeField(r, "end", "End"));
      grp.appendChild(inner);
      controls.appendChild(grp);
    });
    row.appendChild(controls);
    block.appendChild(row);
  });
  return block;
}

function fmtDate(d) {
  if (!d) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return d;
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString(undefined,
    { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(t) {
  if (!t) return "";
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t;
  let h = +m[1]; const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return h + ":" + m[2] + " " + ap;
}

function availabilityState() {
  const n = state.common.next;
  if (!n.availability || typeof n.availability !== "object") n.availability = {};
  return n.availability;
}

/* Export lines — one per proposed day, listing its filled windows. */
function availabilityLines() {
  const out = [];
  ensureDayWindows(availabilityState()).forEach((d, di) => {
    const date = fmtDate(d.date);
    const windows = (d.ranges || [])
      .map(r => [fmtTime(r.start), fmtTime(r.end)].filter(Boolean).join("–"))
      .filter(Boolean);
    if (!date && !windows.length) return;
    out.push({ label: "Interview availability · Day " + (di + 1),
      value: [date, windows.join(", ")].filter(Boolean).join(" — "), id: "availability_day" + di });
  });
  return out;
}

/* ---------- common steps ---------- */

function renderCommonStep(main, key) {
  const def = commonStepDef(key);
  main.appendChild(el("h2", null, esc(def.title)));
  if (def.subtitle) main.appendChild(el("p", "subtitle", esc(def.subtitle)));
  if (def.coach) main.appendChild(el("div", "coach", "🎯 " + esc(def.coach)));

  if (def.availability) {
    const host = el("div", "close-next");
    host.appendChild(el("h3", "subhead", "🗓️ Interview availability"));
    host.appendChild(el("p", "subtitle", "Two days they could interview, with two time windows each."));
    host.appendChild(buildDayWindows(availabilityState(), "Propose two days"));
    main.appendChild(host);
  }

  const qContainer = el("div", "questions");
  const tipsContainer = el("div", "tips");
  main.appendChild(qContainer);
  main.appendChild(tipsContainer);
  const refresh = () => renderTips(tipsContainer, def.tips, def.answers);
  renderQuestions(qContainer, def.questions, def.answers, key, refresh);
  refresh();
}

/* ---------- step 1: candidate + roles to explore ---------- */

function toggleShortlist(key) {
  const i = state.shortlist.indexOf(key);
  if (i >= 0) state.shortlist.splice(i, 1);
  else {
    state.shortlist.push(key);
    roleByKey(key).role.skills.forEach(skillState);
  }
  saveState();
}

function renderCandidateStep(main) {
  main.appendChild(el("h2", null, "Candidate & Roles to Explore"));
  main.appendChild(el("p", "subtitle",
    "Pick the roles the résumé points to — their skills drive the depth and deep-dive steps. Role Fit then scores every role, including ones you didn't pick."));

  const pickerWrap = el("div", "picker-wrap");
  pickerWrap.appendChild(el("div", "q-label", "Which roles might fit? Pick 1–3."));

  /* shortlisted roles from the other business stay visible here */
  const elsewhere = shortlistRoles().filter(r => FORMS[r.cat].business !== store.businessId);
  if (elsewhere.length) {
    const row = el("div", "shortlist-row");
    row.appendChild(el("span", "shortlist-lab", "Also exploring:"));
    elsewhere.forEach(r => {
      const b = el("button", "chip-remove", esc(r.role.icon + " " + r.role.label) + " ×");
      b.title = "Remove from roles to explore";
      b.addEventListener("click", () => { toggleShortlist(r.key); render(); });
      row.appendChild(b);
    });
    pickerWrap.appendChild(row);
  }

  catalogsFor(store.businessId).forEach(cat => {
    const form = FORMS[cat];
    if (catalogsFor(store.businessId).length > 1) pickerWrap.appendChild(el("div", "picker-group", esc(form.label)));
    const grid = el("div", "role-grid");
    form.roleOrder.forEach(rid => {
      const key = cat + ":" + rid;
      const r = form.roles[rid];
      const on = state.shortlist.includes(key);
      const card = el("button", "role-card" + (on ? " selected" : ""));
      card.setAttribute("aria-pressed", on ? "true" : "false");
      card.innerHTML =
        "<span class='role-icon'>" + r.icon + "</span>" +
        "<span class='role-label'>" + esc(r.label) + "</span>" +
        "<span class='role-tag'>" + esc(r.tagline) + "</span>";
      card.addEventListener("click", () => { toggleShortlist(key); render(); });
      grid.appendChild(card);
    });
    pickerWrap.appendChild(grid);
  });
  main.appendChild(pickerWrap);

  const n = state.shortlist.length;
  if (n) {
    main.appendChild(el("div", "role-note",
      "Exploring <strong>" + n + " role" + (n === 1 ? "" : "s") + "</strong> — " +
      interviewSkills().length + " skills to rate on Experience Depth."));
  }
  if (n > 3) {
    main.appendChild(el("div", "tip warn",
      "⚠️ " + n + " roles makes the depth step long. Narrow to the 2–3 the résumé supports best — Role Fit will still surface the others."));
  }

  main.appendChild(el("hr", "divider"));
  renderCommonStep(main, "candidate");
}

/* ---------- role-required guard ---------- */

function needsRoleNotice(main, what) {
  main.appendChild(el("h2", null, what));
  const notice = el("div", "tip warn",
    "⚠️ Pick at least one role to explore on the first step — its skills load here.");
  main.appendChild(notice);
  const btn = el("button", "btn primary", "← Go to Candidate & Roles");
  btn.addEventListener("click", () => { currentStep = 0; render(); });
  main.appendChild(el("div", "actions")).appendChild(btn);
}

/* ---------- experience depth ----------
   One row per skill. Depth is rated from what the candidate could deliver
   unaided; years, last hands-on, evidence, and interest only appear once a
   skill is rated Exposure or above. Changing a row redraws just that row plus
   the summary below the list, so the page never jumps. */

function renderDepthStep(main) {
  if (!state.shortlist.length && !(state.customSkills || []).length) return needsRoleNotice(main, "Experience Depth");

  main.appendChild(el("h2", null, "Experience Depth"));
  main.appendChild(el("p", "subtitle",
    "Rate each skill from what they can walk you through, not what's on the résumé. Leave a skill on — if it never came up."));

  const legend = el("div", "depth-legend");
  legend.appendChild(el("div", "depth-legend-test",
    "The test: <strong>could they deliver it tomorrow with nobody helping?</strong>"));
  const dl = el("dl");
  DEPTH_LEVELS.forEach(d => {
    dl.appendChild(el("dt", null, esc(d.label)));
    dl.appendChild(el("dd", null, esc(d.def)));
  });
  legend.appendChild(dl);
  main.appendChild(legend);

  const summary = el("div");
  const onChange = () => drawDepthSummary(summary);
  const skills = interviewSkills();
  const done = new Set();

  shortlistRoles().forEach(r => {
    const head = el("div", "role-block");
    head.appendChild(el("div", "role-block-title", r.role.icon + " " + esc(r.role.label)));
    head.appendChild(el("div", "role-block-opener", "Open with: “" + esc(r.role.opener) + "”"));
    head.appendChild(el("div", "role-block-coach", esc(r.role.coach)));
    main.appendChild(head);

    const shared = r.role.skills.filter(id => done.has(id));
    if (shared.length) {
      main.appendChild(el("p", "q-help shared-note",
        "Also part of this role, rated above: " + shared.map(id => esc(skillDef(id).label)).join(", ") + "."));
    }
    const list = el("div", "depth-list");
    r.role.skills.filter(id => !done.has(id)).forEach(id => {
      done.add(id);
      const row = el("div", "depth-row");
      list.appendChild(row);
      drawDepthRow(row, skills.find(s => s.id === id), onChange);
    });
    if (list.childNodes.length) main.appendChild(list);
  });

  const custom = skills.filter(s => s.def.custom);
  if (custom.length) {
    main.appendChild(el("div", "role-block", "<div class='role-block-title'>➕ Other skills</div>"));
    const list = el("div", "depth-list");
    custom.forEach(s => {
      const row = el("div", "depth-row");
      list.appendChild(row);
      drawDepthRow(row, s, onChange);
    });
    main.appendChild(list);
  }

  /* Add a skill they have that isn't listed */
  const addBox = el("div", "custom-add");
  const addRow = el("div", "custom-add-row");
  const addInput = el("input");
  addInput.type = "text";
  addInput.placeholder = "Add a skill that isn't listed…";
  const addBtn = el("button", "btn", "+ Add");
  const addSkill = () => {
    const v = addInput.value.trim();
    if (!v) return;
    if (interviewSkills().some(s => s.def.label.toLowerCase() === v.toLowerCase())) { addInput.value = ""; return; }
    const c = { id: slugId(v), label: v };
    state.customSkills.push(c);
    skillState(c.id);
    saveState();
    render();
  };
  addBtn.addEventListener("click", addSkill);
  addInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } });
  addRow.appendChild(addInput);
  addRow.appendChild(addBtn);
  addBox.appendChild(addRow);
  main.appendChild(addBox);

  main.appendChild(summary);
  drawDepthSummary(summary);
}

/* A segmented single-choice control. Clicking the selected option again
   clears it, so a mis-click never forces a wrong answer. */
function segControl(name, options, current, onPick) {
  const group = el("div", "seg-group compact");
  options.forEach(o => {
    const lab = el("label", "seg");
    const input = el("input");
    input.type = "radio"; input.name = name;
    input.checked = current === o.id;
    input.addEventListener("click", () => onPick(current === o.id ? null : o.id));
    lab.appendChild(input);
    lab.appendChild(el("span", null, esc(o.label)));
    if (o.title) lab.title = o.title;
    group.appendChild(lab);
  });
  return group;
}

function depthField(labelText, control) {
  const f = el("div", "depth-field");
  f.appendChild(el("span", "depth-lab", esc(labelText)));
  f.appendChild(control);
  return f;
}

function drawDepthRow(row, entry, onChange) {
  row.innerHTML = "";
  const id = entry.id, def = entry.def;
  const a = skillState(id);
  const rank = depthRank(a);
  row.className = "depth-row" + (rank >= DEPTH_RANK.owned ? " strong" : rank >= 0 ? " rated" : "");
  const redraw = () => { saveState(); drawDepthRow(row, entry, onChange); onChange(); };
  const set = (key, v) => { if (v == null) delete a[key]; else a[key] = v; redraw(); };

  const head = el("div", "depth-head");
  const nameCell = el("div", "depth-name");
  nameCell.appendChild(el("span", null, def.icon + " " + esc(def.label)));
  if (def.custom) {
    const rm = el("button", "alloc-remove", "×");
    rm.title = "Remove this skill";
    rm.addEventListener("click", () => {
      state.customSkills = state.customSkills.filter(c => c.id !== id);
      delete state.skills[id];
      delete state.dives[id];
      saveState();
      render();
    });
    nameCell.appendChild(rm);
  }
  nameCell.appendChild(el("div", "depth-what", esc(def.what)));
  head.appendChild(nameCell);
  head.appendChild(segControl("depth__" + id,
    DEPTH_LEVELS.map(d => ({ id: d.id, label: d.label, title: d.def })), a.depth, v => set("depth", v)));
  row.appendChild(head);

  if (rank < DEPTH_RANK.exposure) return;

  const detail = el("div", "depth-detail");

  const years = el("select");
  years.appendChild(el("option", null, "—"));
  YEARS_OPTIONS.forEach(o => {
    const opt = el("option", null, esc(o) + " yrs");
    opt.value = o;
    if (a.years === o) opt.selected = true;
    years.appendChild(opt);
  });
  years.addEventListener("change", () => set("years", years.selectedIndex === 0 ? null : years.value));
  detail.appendChild(depthField("Years doing it", years));

  /* Recency chips are built from the interview year and stored as absolute
     years, so the record still reads correctly when reopened later. */
  const iy = interviewYear();
  const lastWrap = el("div", "depth-last");
  const isEarlier = a.last === "earlier" || (typeof a.last === "number" && a.last < iy - 3);
  const lastOpts = [{ id: "current", label: "Now" }, { id: iy - 1, label: String(iy - 1) },
                    { id: iy - 2, label: String(iy - 2) }, { id: iy - 3, label: String(iy - 3) },
                    { id: "earlier", label: "Earlier…" }];
  lastWrap.appendChild(segControl("last__" + id, lastOpts, isEarlier ? "earlier" : a.last, v => set("last", v)));
  if (isEarlier) {
    const yr = el("select");
    yr.appendChild(el("option", null, "Which year?"));
    for (let y = iy - 4; y >= iy - 25; y--) {
      const opt = el("option", null, String(y));
      opt.value = y;
      if (a.last === y) opt.selected = true;
      yr.appendChild(opt);
    }
    yr.addEventListener("change", () => set("last", yr.selectedIndex === 0 ? "earlier" : +yr.value));
    lastWrap.appendChild(yr);
  }
  detail.appendChild(depthField("Last hands-on", lastWrap));

  detail.appendChild(depthField("Evidence",
    segControl("evidence__" + id, EVIDENCE_OPTIONS, a.evidence, v => set("evidence", v))));
  detail.appendChild(depthField("Interest",
    segControl("interest__" + id, INTEREST_OPTIONS, a.interest, v => set("interest", v))));
  row.appendChild(detail);

  const flags = depthFlags(a, id);
  if (flags.length) {
    const box = el("div", "tips depth-flags");
    flags.forEach(f => box.appendChild(el("div", "tip" + (f.warn ? " warn" : ""), "💡 " + esc(f.text))));
    row.appendChild(box);
  }
}

/* Recruiter prompts for one rated skill. Engine-side, so they work for every
   skill without per-skill authoring. */
function depthFlags(a, id) {
  const out = [];
  const rank = depthRank(a);
  const lvl = depthLabel(a.depth);
  if (a.last === "earlier") {
    out.push({ text: "Pin down the year — “earlier” could mean four years ago or fifteen." });
  }
  if (isStale(a, id)) {
    out.push({ warn: true, text: "Last did this in " + lastYear(a) + ". Ask what's changed since then and how quickly they'd get back up to speed." });
  }
  if (rank >= DEPTH_RANK.owned && a.evidence === "claimed") {
    out.push({ warn: true, text: "Rated " + lvl + " but it's only on the résumé so far — ask for a specific time it went wrong and what they did about it." });
  }
  if (rank === DEPTH_RANK.exposure && (a.years === "6–9" || a.years === "10+")) {
    out.push({ text: a.years + " years of exposure without doing it on their own — were they blocked from owning it, or is it not their strength?" });
  }
  if (rank >= DEPTH_RANK.hands_on && a.interest === "avoid") {
    out.push({ text: "Strong here but wants to avoid it — don't put them forward for roles heavy in this." });
  }
  return out;
}

function drawDepthSummary(container) {
  container.innerHTML = "";
  const skills = interviewSkills();
  const rated = skills.filter(s => depthRank(state.skills[s.id]) >= 0);
  const strong = skills.filter(s => depthRank(state.skills[s.id]) >= DEPTH_RANK.owned);
  const stale = skills.filter(s => isStale(state.skills[s.id], s.id));

  container.appendChild(el("p", "total-label",
    "Rated: " + rated.length + " of " + skills.length + " · Owned or led: " + strong.length +
    " · Stale (not hands-on recently): " + stale.length));

  if (strong.length >= 5) {
    const tips = el("div", "tips");
    tips.appendChild(el("div", "tip",
      "💡 Owned or led " + strong.length + " skills — ask which one they want to lead with in their next role. Broad generalists are easier to place when they pick a lane."));
    container.appendChild(tips);
  }

  const top = rankedFits()[0];
  if (top && top.fit > 0) {
    const card = el("div", "profile-card");
    card.appendChild(el("div", "profile-kicker", "Leading fit so far"));
    card.appendChild(el("div", "profile-name", esc(top.r.role.label) + " · " + Math.round(top.fit * 100) + "%"));
    card.appendChild(el("p", "profile-detail",
      (top.profile ? esc(top.profile.kicker + ": " + top.profile.profile) + ". " : "") +
      "See Role Fit for the full ranking across every role."));
    container.appendChild(card);
  }
}

/* Short badge text for a rated skill, e.g. "Owned · 6–9 yrs · Now". */
function depthBadge(a) {
  const parts = [depthLabel(a.depth)];
  if (a.years) parts.push(a.years + " yrs");
  if (a.last === "current") parts.push("Now");
  else if (typeof a.last === "number") parts.push(String(a.last));
  return parts.join(" · ");
}

/* Full export line for a rated skill. */
function depthDetail(a, id) {
  if (a.depth === "none") return "None — asked, no real experience";
  const parts = [depthLabel(a.depth)];
  if (a.years) parts.push(a.years + " yrs");
  const iy = interviewYear();
  if (a.last === "current") parts.push("hands-on now (as of " + fmtDate(interviewDate()) + ")");
  else if (a.last === "earlier") parts.push("last hands-on before " + (iy - 3) + " (year not pinned down)");
  else if (typeof a.last === "number") {
    const age = yearsSinceHandsOn(a);
    parts.push("last hands-on " + a.last + (age >= 1 ? " (~" + age + " yr" + (age === 1 ? "" : "s") + " ago)" : ""));
  }
  const ev = EVIDENCE_OPTIONS.find(o => o.id === a.evidence);
  if (ev) parts.push("evidence: " + ev.label.toLowerCase());
  const it = INTEREST_OPTIONS.find(o => o.id === a.interest);
  if (it) parts.push(it.label.toLowerCase());
  let out = parts.join(" · ");
  if (isStale(a, id)) out += " — ⚠ not hands-on in " + yearsSinceHandsOn(a) + " years";
  return out;
}

/* ---------- technical deep dive ---------- */

/* Every deep dive ends with a proof point — the specific example behind the
   depth rating. */
const PROOF_QUESTION = {
  id: "proof_point", type: "textarea", label: "Proof point — one specific example",
  placeholder: "Situation → what they personally did → the result (numbers if they have them)"
};
function diveQuestions(def) { return def.capture.concat([PROOF_QUESTION]); }

/* rated skills worth a deep dive (Exposure or deeper), strongest first */
function divedSkills() {
  return interviewSkills()
    .filter(s => depthRank(state.skills[s.id]) >= DEPTH_RANK.exposure)
    .sort((x, y) => depthRank(state.skills[y.id]) - depthRank(state.skills[x.id]));
}

/* tool categories across the shortlisted roles, merged by label */
function toolCategories() {
  const cats = [];
  shortlistRoles().forEach(r => r.role.tools.forEach(c => {
    const key = c.label.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const found = cats.find(x => x.key === key);
    if (found) c.options.forEach(o => { if (!found.options.includes(o)) found.options.push(o); });
    else cats.push({ key, label: c.label, options: c.options.slice() });
  }));
  return cats;
}

function toolQuestions() {
  return toolCategories().map(c => ({ id: c.key, type: "chips", label: c.label, options: c.options }));
}

function aiQuestions() {
  return [
    { id: "usage", type: "chips", label: "How they use AI in their work", options: shortlistOptions("aiUse") },
    { id: "tools", type: "chips", label: "AI tools they've used", options: shortlistOptions("aiTools") },
    { id: "example", type: "textarea", label: "Best example of AI in their work",
      placeholder: "What they built or sped up, and the result" }
  ];
}

function renderDivesStep(main) {
  if (!state.shortlist.length && !(state.customSkills || []).length) return needsRoleNotice(main, "Technical Deep Dive");

  main.appendChild(el("h2", null, "Technical Deep Dive"));
  const dived = divedSkills();
  main.appendChild(el("p", "subtitle", dived.length
    ? "A deep dive for every skill rated Exposure or above — strongest first. Ask the questions in order, listen for the signals, and record what they actually did."
    : "No skills rated yet — rate them on Experience Depth and their deep dives appear here."));

  const teammates = [];
  shortlistRoles().forEach(r => r.role.teammates.forEach(t => { if (t.skill) teammates.push(t); }));
  const onTeam = state.common.history.teammates || [];

  dived.forEach(s => {
    const a = state.skills[s.id];
    const strong = depthRank(a) >= DEPTH_RANK.owned;
    const details = el("details", "dive" + (strong ? " must" : ""));
    if (strong) details.open = true;

    const summary = el("summary");
    summary.appendChild(el("span", "dive-title", s.def.icon + " " + esc(s.def.label)));
    summary.appendChild(el("span", "dive-badge " + (isStale(a, s.id) ? "badge-stale" : strong ? "badge-must" : "badge-nice"),
      esc(depthBadge(a))));
    details.appendChild(summary);

    const body = el("div", "dive-body");
    body.appendChild(el("p", "q-help", esc(s.def.what)));

    const ask = el("div", "dive-ask");
    ask.appendChild(el("div", "dive-ask-title", "Ask"));
    const ol = el("ol");
    s.def.ask.forEach(q => ol.appendChild(el("li", null, esc(q))));
    ask.appendChild(ol);
    body.appendChild(ask);

    const signals = el("div", "dive-signals");
    const good = el("div", "dive-signal good");
    good.appendChild(el("div", "dive-signal-title", "✓ Strong answers include"));
    good.appendChild(el("p", null, esc(s.def.listen)));
    const bad = el("div", "dive-signal bad");
    bad.appendChild(el("div", "dive-signal-title", "⚠ Red flags"));
    bad.appendChild(el("p", null, esc(s.def.red)));
    signals.appendChild(good);
    signals.appendChild(bad);
    body.appendChild(signals);

    /* a specialist on their team overlapping a skill they rate as owned —
       separate what they did from what the specialist did */
    if (strong) {
      teammates.filter(t => t.skill === s.id && onTeam.includes(t.label)).slice(0, 1).forEach(t => {
        body.appendChild(el("div", "tip warn",
          "⚠️ Their team had a dedicated " + esc(t.label) + ". Separate what they owned from what the " + esc(t.label) + " did."));
      });
    }

    const qContainer = el("div", "questions");
    body.appendChild(qContainer);
    renderQuestions(qContainer, diveQuestions(s.def), state.dives[s.id] || (state.dives[s.id] = {}), "dive_" + s.id);
    details.appendChild(body);
    main.appendChild(details);
  });

  const toolQs = toolQuestions();
  if (toolQs.length) {
    main.appendChild(el("h3", "subhead", "🧰 Tools & Platforms"));
    main.appendChild(el("p", "subtitle", "Tools they've used hands-on — not just been near. These also feed Role Fit."));
    const qContainer = el("div", "questions tools-section");
    main.appendChild(qContainer);
    renderQuestions(qContainer, toolQs, state.tools, "tools");
  }

  if (state.shortlist.length) {
    main.appendChild(el("h3", "subhead", "🤖 AI in Their Work"));
    const qContainer = el("div", "questions");
    main.appendChild(qContainer);
    renderQuestions(qContainer, aiQuestions(), state.ai, "ai");
  }
}

/* ---------- role fit ---------- */

function renderFitStep(main) {
  main.appendChild(el("h2", null, "Role Fit"));
  main.appendChild(el("p", "subtitle",
    "Every role in every catalog, scored against the depth ratings. Pick the primary role to place them in, and any others they'd also fit."));

  const fits = rankedFits().slice(0, 12);
  if (!fits.some(f => f.fit > 0)) {
    main.appendChild(el("div", "tip warn", "⚠️ Rate skills on Experience Depth to see how they fit each role."));
  }

  if (fits.length) {
    const table = el("div", "fit-table");
    fits.forEach(f => {
      const row = el("div", "fit-row" + (state.fit.primary === f.key ? " primary" : ""));
      const name = el("div", "fit-name");
      name.appendChild(el("span", "fit-role", f.r.role.icon + " " + esc(f.r.role.label)));
      name.appendChild(el("span", "fit-cat", esc(FORMS[f.r.cat].label) +
        (state.shortlist.includes(f.key) ? " · exploring" : "")));
      if (f.profile) name.appendChild(el("span", "fit-profile", esc(f.profile.kicker + ": " + f.profile.profile)));
      row.appendChild(name);

      const bar = el("div", "fit-bar-wrap");
      const track = el("div", "fit-bar");
      const fill = el("div", "fit-fill");
      fill.style.width = Math.round(f.fit * 100) + "%";
      track.appendChild(fill);
      bar.appendChild(track);
      bar.appendChild(el("span", "fit-pct", Math.round(f.fit * 100) + "%"));
      bar.appendChild(el("span", "fit-cov", "rated " + f.rated + " of " + f.total + " skills"));
      row.appendChild(bar);

      const actions = el("div", "fit-actions");
      const prim = el("label", "seg");
      const pin = el("input");
      pin.type = "radio"; pin.name = "fit_primary";
      pin.checked = state.fit.primary === f.key;
      pin.addEventListener("change", () => {
        state.fit.primary = f.key;
        state.fit.also = state.fit.also.filter(k => k !== f.key);
        saveState(); render();
      });
      prim.appendChild(pin);
      prim.appendChild(el("span", null, "Primary"));
      actions.appendChild(prim);

      const also = el("label", "chip");
      const ain = el("input");
      ain.type = "checkbox";
      ain.checked = state.fit.also.includes(f.key);
      ain.disabled = state.fit.primary === f.key;
      ain.addEventListener("change", () => {
        state.fit.also = ain.checked ? state.fit.also.concat([f.key]) : state.fit.also.filter(k => k !== f.key);
        saveState();
      });
      also.appendChild(ain);
      also.appendChild(el("span", null, "Also fits"));
      actions.appendChild(also);

      if (!state.shortlist.includes(f.key)) {
        const ex = el("button", "btn small", "Explore");
        ex.title = "Add this role's skills to Experience Depth";
        ex.addEventListener("click", () => { toggleShortlist(f.key); currentStep = 2; render(); });
        actions.appendChild(ex);
      } else if (f.rated < f.total) {
        actions.appendChild(el("span", "fit-hint", (f.total - f.rated) + " to rate"));
      }
      row.appendChild(actions);
      table.appendChild(row);
    });
    main.appendChild(table);
  }

  const how = el("details", "fit-how");
  how.appendChild(el("summary", null, "How fit is scored"));
  how.appendChild(el("p", "q-help",
    "Each role is scored on its own skills: None 0, Exposure 25%, Hands-on 60%, Owned 85%, Led 100%. Stale skills count at 60%. " +
    "Unrated skills count as zero, so explore a role and rate its skills before trusting a low score. Skills most roles share (like AI in engineering work) count half. " +
    "Once the candidate has 3+ tools recorded, tool overlap adds 20% to roles their skills already score on."));
  main.appendChild(how);

  main.appendChild(el("hr", "divider"));

  const qs = el("div", "questions");
  main.appendChild(qs);
  const levelWrap = el("div", "question");
  levelWrap.appendChild(el("label", "q-label", "Level to place them at"));
  const suggestion = suggestedLevel(state.fit.primary || (fits[0] && fits[0].key));
  if (suggestion) levelWrap.appendChild(el("p", "q-help", "Suggested from the depth ratings and team size: <strong>" + esc(suggestion) + "</strong>"));
  const seg = el("div", "seg-group");
  IV.levels.forEach(l => {
    const lab = el("label", "seg");
    const input = el("input");
    input.type = "radio"; input.name = "fit_level";
    input.checked = state.fit.level === l;
    input.addEventListener("change", () => { state.fit.level = l; saveState(); });
    lab.appendChild(input);
    lab.appendChild(el("span", null, esc(l)));
    seg.appendChild(lab);
  });
  levelWrap.appendChild(seg);
  qs.appendChild(levelWrap);

  const notesWrap = el("div", "question");
  notesWrap.appendChild(el("label", "q-label", "Why this role — in your words"));
  const ta = el("textarea");
  ta.rows = 3;
  ta.placeholder = "What makes them a fit, and what gap a client would ask about";
  ta.value = state.fit.notes || "";
  ta.addEventListener("input", () => { state.fit.notes = ta.value; saveState(); });
  notesWrap.appendChild(ta);
  qs.appendChild(notesWrap);
}

/* ---------- review + export ---------- */

function answerLine(label, value, id) {
  if (value == null) return null;
  if (Array.isArray(value)) return value.length ? { label, value: value.join(", "), id } : null;
  const v = String(value).trim();
  return v ? { label, value: v, id } : null;
}

/* Make a bare domain clickable — exports render hrefs as real hyperlinks. */
function normalizeUrl(v) {
  const s = String(v).trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : "https://" + s;
}

function fmtMoney(v) {
  const n = parseFloat(v);
  return isNaN(n) ? "" : "$" + n.toLocaleString("en-US");
}

function payLine(q, v) {
  if (!v || typeof v !== "object") return null;
  const unit = q.unit || "";
  const lo = fmtMoney(v.min), hi = fmtMoney(v.max), floor = fmtMoney(v.floor);
  const parts = [];
  if (lo || hi) parts.push("ideal " + [lo, hi].filter(Boolean).join("–") + unit);
  if (floor) parts.push("bottom end " + floor + unit);
  return parts.length ? { label: q.label, value: parts.join(" · "), id: q.id } : null;
}

/* Lines for a set of questions, skipping hidden ones; handles every type. */
function collectQuestionLines(questions, answers) {
  const lines = [];
  questions.forEach(q => {
    if (q.showIf && !q.showIf(answers, state)) return;
    const v = answers[q.id];
    if (q.type === "textlist") {
      const items = (v || []).map(x => String(x || "").trim()).filter(Boolean);
      if (items.length) lines.push({ label: q.label, value: items.map((x, i) => (i + 1) + ") " + x).join("  "), id: q.id });
      return;
    }
    if (q.type === "group") {
      (v || []).forEach((item, i) => {
        if (!item) return;
        const get = k => String(item[k] || "").trim();
        const headFields = q.fields.filter(f => !f.long).map(f => get(f.id)).filter(Boolean);
        const longFields = q.fields.filter(f => f.long && get(f.id)).map(f => f.label + ": " + get(f.id));
        if (!headFields.length && !longFields.length) return;
        lines.push({ label: q.label.replace(/s$/, "") + " " + (i + 1),
          value: [headFields.join(" — "), longFields.join(". ")].filter(Boolean).join(". "), id: q.id + "_" + i });
      });
      return;
    }
    if (q.type === "payrange") { const l = payLine(q, v); if (l) lines.push(l); return; }
    const line = answerLine(q.label, v, q.id);
    if (line) {
      if (q.link) line.href = normalizeUrl(line.value);
      lines.push(line);
    }
  });
  return lines;
}

function collectCommon(key) {
  const def = commonStepDef(key);
  const lines = collectQuestionLines(def.questions, def.answers);
  if (key === "next") lines.unshift(...availabilityLines());
  return lines.length ? { title: def.title, lines } : null;
}

function roleName(key) { const r = roleByKey(key); return r ? r.role.label : ""; }

function collectSummary() {
  const sections = [];

  const cand = collectCommon("candidate");
  const roles = shortlistRoles();
  if (roles.length) {
    const line = { label: "Roles explored", value: roles.map(r => r.role.label).join(", "), id: "roles_explored" };
    if (cand) cand.lines.push(line); else sections.push({ title: "Candidate", lines: [line] });
  }
  if (cand) sections.push(cand);

  /* Role fit first — the answer to "where do we place them?" */
  const fitLines = [];
  if (state.fit.primary) fitLines.push({ label: "Primary role", value: roleName(state.fit.primary), id: "fit_primary" });
  if (state.fit.also.length) fitLines.push({ label: "Also fits", value: state.fit.also.map(roleName).join(", "), id: "fit_also" });
  if (state.fit.level) fitLines.push({ label: "Level", value: state.fit.level, id: "fit_level" });
  const top = rankedFits().filter(f => f.fit > 0).slice(0, 5);
  if (top.length) {
    fitLines.push({ label: "Top fits", id: "fit_top",
      value: top.map(f => f.r.role.label + " " + Math.round(f.fit * 100) + "% (" + f.rated + "/" + f.total + " rated)").join(" · ") });
  }
  const primaryFit = state.fit.primary && roleFit(state.fit.primary);
  if (primaryFit && primaryFit.profile) {
    fitLines.push({ label: primaryFit.profile.kicker, value: primaryFit.profile.profile, id: "fit_profile" });
  }
  if ((state.fit.notes || "").trim()) fitLines.push({ label: "Why this role", value: state.fit.notes.trim(), id: "fit_notes" });
  if (fitLines.length) sections.push({ title: "Role Fit", lines: fitLines });

  const history = collectCommon("history"); if (history) sections.push(history);

  /* Experience depth, strongest first, then each skill's deep dive */
  const skills = interviewSkills();
  const rated = skills.filter(s => depthRank(state.skills[s.id]) >= 0)
    .sort((x, y) => depthRank(state.skills[y.id]) - depthRank(state.skills[x.id]));
  if (rated.length) {
    sections.push({ title: "Experience Depth",
      lines: rated.map(s => ({ label: s.def.label, value: depthDetail(state.skills[s.id], s.id), id: "depth_" + s.id })) });
  }
  divedSkills().forEach(s => {
    const lines = collectQuestionLines(diveQuestions(s.def), state.dives[s.id] || {});
    if (lines.length) sections.push({ title: s.def.label + " (" + depthLabel(state.skills[s.id].depth) + ")", lines });
  });

  const tools = collectQuestionLines(toolQuestions(), state.tools);
  if (tools.length) sections.push({ title: "Tools & Platforms", lines: tools });
  if (state.shortlist.length) {
    const ai = collectQuestionLines(aiQuestions(), state.ai);
    if (ai.length) sections.push({ title: "AI in Their Work", lines: ai });
  }

  ["wants", "pay", "next"].forEach(k => { const s = collectCommon(k); if (s) sections.push(s); });

  /* AI analysis → free-text section */
  if (state.aiAnalysis && (state.aiAnalysis.text || "").trim())
    sections.push({ title: "AI Analysis", text: state.aiAnalysis.text.trim() });

  /* Persistent notes → free-text sections at the end of the output */
  if ((state.notes.live || "").trim())
    sections.push({ title: "Live Notes", text: state.notes.live.trim() });
  if ((state.notes.pretext || "").trim())
    sections.push({ title: "Résumé / Pre-Call Notes", text: state.notes.pretext.trim() });

  return sections;
}

function titleLine() {
  const c = state.common.candidate;
  const name = (c.full_name || "").trim() || "Candidate interview";
  const role = state.fit.primary ? roleName(state.fit.primary) : (c.current_title || "").trim();
  return name + (role ? " — " + role : "");
}

/* ---------- feedback email ----------
   mailto: only works when a desktop mail client is registered as the handler.
   On a machine using Outlook on the web (or any browser with no mail handler)
   the click silently does nothing, so we try mailto first and fall back to the
   Outlook web compose deep link if the page never loses focus. */

const FEEDBACK_TO = "david.sheehan@roberthalf.com";
const FEEDBACK_SUBJECT = "RH Candidate Interview Form Feedback";

function feedbackMailto() {
  return "mailto:" + FEEDBACK_TO + "?subject=" + encodeURIComponent(FEEDBACK_SUBJECT);
}

function feedbackWebUrl() {
  return "https://outlook.office.com/mail/deeplink/compose"
    + "?to=" + encodeURIComponent(FEEDBACK_TO)
    + "&subject=" + encodeURIComponent(FEEDBACK_SUBJECT);
}

function openFeedbackEmail() {
  /* If a desktop client takes the mailto, the browser loses focus — treat that
     as success. If focus never leaves, no handler exists: open Outlook on the
     web instead. */
  let handedOff = false;
  const markHandled = () => { handedOff = true; };
  window.addEventListener("blur", markHandled, { once: true });
  document.addEventListener("visibilitychange", markHandled, { once: true });

  try { window.location.href = feedbackMailto(); } catch (e) { /* blocked */ }

  setTimeout(() => {
    window.removeEventListener("blur", markHandled);
    document.removeEventListener("visibilitychange", markHandled);
    if (handedOff || document.hidden) return;      // a mail app opened
    window.open(feedbackWebUrl(), "_blank", "noopener");
  }, 1200);
}

/* Reliable download — anchor MUST be attached to the DOM for click() to fire
   in Firefox and others. */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function printSummary() {
  printDoc(titleLine(), "Interviewed " + fmtDate(interviewDate()), collectSummary());
}

function printDoc(title, subtitle, sections) {
  let rows = "";
  sections.forEach(sec => {
    rows += "<h2>" + esc(sec.title) + "</h2>";
    if (sec.text) { rows += "<p class='note'>" + esc(sec.text).replace(/\n/g, "<br>") + "</p>"; return; }
    rows += "<dl>";
    sec.lines.forEach(l => {
      const val = l.href
        ? '<a href="' + esc(l.href) + '">' + esc(l.value) + "</a>"
        : esc(l.value).replace(/\n/g, "<br>");
      rows += "<dt>" + esc(l.label) + "</dt><dd>" + val + "</dd>";
    });
    rows += "</dl>";
  });
  if (!sections.length) rows = "<p>No details captured yet.</p>";

  const doc =
    "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + esc(title) + "</title><style>" +
    "*{box-sizing:border-box}body{font-family:Calibri,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a2233;margin:40px;line-height:1.5}" +
    "h1{font-size:26px;margin:0 0 4px}.date{color:#5b6577;font-size:13px;margin:0 0 20px}" +
    "h2{font-size:13px;text-transform:uppercase;letter-spacing:.8px;color:#2456d6;border-bottom:1px solid #e2e7f0;padding-bottom:5px;margin:22px 0 8px}" +
    "dl{margin:0;display:grid;grid-template-columns:240px 1fr;gap:5px 16px}" +
    "dt{font-weight:600;color:#5b6577;font-size:13.5px}dd{margin:0;font-size:13.5px}" +
    "a{color:#2456d6}" +
    "p.note{white-space:pre-wrap;font-size:13.5px;margin:0}" +
    "@page{margin:18mm}</style></head><body>" +
    "<h1>" + esc(title) + "</h1><p class='date'>" + esc(subtitle) + "</p>" +
    rows + "</body></html>";

  const w = window.open("", "_blank");
  if (!w) { window.print(); return; }
  w.document.open(); w.document.write(doc); w.document.close(); w.focus();
  const go = () => w.print();
  if (w.document.readyState === "complete") setTimeout(go, 150);
  else w.onload = () => setTimeout(go, 150);
}

function fileBase() {
  const base = (state.common.candidate.full_name || "").trim() || "candidate-interview";
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "candidate-interview";
}

/* ---------- AI analysis ----------
   Calls the /api/analyze serverless endpoint (Vercel function holding the
   Anthropic API key). Endpoint + optional team code are UI settings stored
   under their own key, so "Start new interview" keeps them; the analysis
   RESULT lives in the interview record and is cleared by reset. */

const AI_CONFIG_KEY = "rh-interview-ai-config";

function aiConfig() {
  try {
    const c = JSON.parse(localStorage.getItem(AI_CONFIG_KEY)) || {};
    return { endpoint: c.endpoint || "/api/analyze", code: c.code || "" };
  } catch (e) { return { endpoint: "/api/analyze", code: "" }; }
}

function saveAiConfig(cfg) {
  try { localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(cfg)); } catch (e) {}
}

/* Minimal markdown renderer for the analysis output (headings, bold, lists). */
function mdToHtml(md) {
  const lines = esc(md).split(/\r?\n/);
  let html = "", inList = false, para = [];
  const flushPara = () => {
    if (para.length) { html += "<p>" + para.join("<br>") + "</p>"; para = []; }
  };
  const closeList = () => { if (inList) { html += "</ul>"; inList = false; } };
  const inline = s => s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
  lines.forEach(line => {
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (h) { flushPara(); closeList(); html += "<h4>" + inline(h[2]) + "</h4>"; }
    else if (li) { flushPara(); if (!inList) { html += "<ul>"; inList = true; } html += "<li>" + inline(li[1]) + "</li>"; }
    else if (!line.trim()) { flushPara(); closeList(); }
    else { closeList(); para.push(inline(line)); }
  });
  flushPara(); closeList();
  return html;
}

function renderAiSection(main) {
  const box = el("div", "ai-box");
  box.appendChild(el("div", "ai-head", "🤖 AI Analysis"));
  box.appendChild(el("p", "q-help",
    "Sends the interview to your team's AI endpoint for a role-fit read, strengths and gaps, the probes you missed, and a candidate summary. The result is added to the export."));

  const controls = el("div", "actions");
  const runBtn = el("button", "btn primary", state.aiAnalysis ? "🔄 Re-analyze interview" : "✨ Analyze interview");
  controls.appendChild(runBtn);
  box.appendChild(controls);

  /* endpoint / team-code settings, collapsed by default */
  const cfg = aiConfig();
  const settings = el("details", "ai-settings");
  settings.appendChild(el("summary", null, "Endpoint settings"));
  const epRow = el("div", "custom-add-row");
  const epInput = el("input");
  epInput.type = "text";
  epInput.placeholder = "/api/analyze or https://your-app.vercel.app/api/analyze";
  epInput.value = cfg.endpoint;
  const codeInput = el("input");
  codeInput.type = "text";
  codeInput.placeholder = "Team code (optional)";
  codeInput.value = cfg.code;
  codeInput.style.maxWidth = "180px";
  const persist = () => saveAiConfig({ endpoint: epInput.value.trim() || "/api/analyze", code: codeInput.value.trim() });
  epInput.addEventListener("input", persist);
  codeInput.addEventListener("input", persist);
  epRow.appendChild(epInput);
  epRow.appendChild(codeInput);
  settings.appendChild(epRow);
  settings.appendChild(el("p", "q-help",
    "When the app is served from Vercel, the default /api/analyze works as-is. When hosted elsewhere (e.g. GitHub Pages), paste your Vercel deployment's full endpoint URL."));
  box.appendChild(settings);

  const status = el("div", "ai-status");
  box.appendChild(status);

  const result = el("div", "ai-result");
  if (state.aiAnalysis && state.aiAnalysis.text) {
    result.innerHTML = mdToHtml(state.aiAnalysis.text);
    result.classList.add("filled");
  }
  box.appendChild(result);

  runBtn.addEventListener("click", async () => {
    const conf = aiConfig();
    runBtn.disabled = true;
    runBtn.textContent = "⏳ Analyzing… (can take up to a minute)";
    status.textContent = "";
    try {
      const headers = { "Content-Type": "application/json" };
      if (conf.code) headers["x-access-code"] = conf.code;
      const resp = await fetch(conf.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          summary: summaryMarkdown(),
          role: state.fit.primary ? roleName(state.fit.primary) : shortlistRoles().map(r => r.role.label).join(", ")
        })
      });
      let data = null;
      try { data = await resp.json(); } catch (e) {}
      if (!resp.ok || !data || !data.analysis) {
        throw new Error((data && data.error) || ("Request failed (" + resp.status + ")"));
      }
      state.aiAnalysis = { text: data.analysis, at: new Date().toISOString() };
      flushSave();
      render(); // refresh the review step so the summary includes the analysis
      return;
    } catch (err) {
      status.textContent = "⚠️ " + (err && err.message ? err.message : "Analysis failed — check the endpoint settings.");
      runBtn.textContent = state.aiAnalysis ? "🔄 Re-analyze interview" : "✨ Analyze interview";
    } finally {
      runBtn.disabled = false;
    }
  });

  main.appendChild(box);
}

function renderReviewStep(main) {
  main.appendChild(el("h2", null, "Review & Export"));

  const c = state.common.candidate, pay = state.common.pay;
  const skills = interviewSkills();
  const rated = skills.filter(s => depthRank(state.skills[s.id]) >= 0);
  const dived = divedSkills();
  const strong = dived.filter(s => depthRank(state.skills[s.id]) >= DEPTH_RANK.owned);
  const hasPay = ["hourly", "salary"].some(k => pay[k] && (String(pay[k].min || "").trim() || String(pay[k].max || "").trim()));

  const checks = [
    { ok: !!(c.full_name || "").trim() && !!((c.email || "").trim() || (c.phone || "").trim()), text: "Name and a way to reach them" },
    { ok: state.shortlist.length > 0, text: "At least one role explored" },
    { ok: rated.length >= 3, text: "At least 3 skills rated" },
    { ok: dived.length > 0 && dived.every(s => { const l = state.skills[s.id].last; return typeof l === "number" || l === "current"; }),
      text: "Last hands-on year for every rated skill" },
    { ok: strong.length > 0 && strong.every(s => !!((state.dives[s.id] || {}).proof_point || "").trim()),
      text: "Proof point on every Owned / Led skill" },
    { ok: !!state.fit.primary, text: "Primary role chosen on Role Fit" },
    { ok: !!pay.pay_type && hasPay, text: "Pay type and ideal range" },
    { ok: availabilityLines().length > 0, text: "Interview availability" }
  ];
  const list = el("div", "checklist");
  checks.forEach(ch => list.appendChild(el("div", "check " + (ch.ok ? "ok" : "miss"), (ch.ok ? "✅ " : "⬜ ") + esc(ch.text))));
  main.appendChild(list);
  const missing = checks.filter(ch => !ch.ok).length;
  if (missing > 0) main.appendChild(el("div", "tip warn", "⚠️ " + missing + " item(s) still open."));

  const actions = el("div", "actions");
  const copyBtn = el("button", "btn primary", "📋 Copy summary");
  copyBtn.addEventListener("click", async () => {
    const md = summaryMarkdown();
    try { await navigator.clipboard.writeText(md); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = md; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    copyBtn.textContent = "✓ Copied";
    setTimeout(() => (copyBtn.textContent = "📋 Copy summary"), 1500);
  });
  const wordBtn = el("button", "btn", "📄 Download Word doc");
  wordBtn.addEventListener("click", () => {
    const bytes = buildInterviewDocx(titleLine(), "Interviewed " + fmtDate(interviewDate()), collectSummary());
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    downloadBlob(blob, fileBase() + "-interview.docx");
    wordBtn.textContent = "✓ Downloaded";
    setTimeout(() => (wordBtn.textContent = "📄 Download Word doc"), 1500);
  });
  const printBtn = el("button", "btn", "🖨️ Save as PDF");
  printBtn.addEventListener("click", printSummary);
  actions.appendChild(copyBtn); actions.appendChild(wordBtn); actions.appendChild(printBtn);
  main.appendChild(actions);

  renderAiSection(main);

  const summary = el("div", "summary");
  summary.appendChild(el("h3", null, esc(titleLine())));
  const sections = collectSummary();
  if (!sections.length) summary.appendChild(el("p", "q-help", "Nothing captured yet — work through the steps and the summary will build itself here."));
  sections.forEach(sec => {
    summary.appendChild(el("h4", null, esc(sec.title)));
    if (sec.text) { summary.appendChild(el("div", "summary-note", esc(sec.text))); return; }
    const dl = el("dl");
    sec.lines.forEach(l => {
      dl.appendChild(el("dt", null, esc(l.label)));
      dl.appendChild(el("dd", null, l.href
        ? '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.value) + "</a>"
        : esc(l.value)));
    });
    summary.appendChild(dl);
  });
  main.appendChild(summary);
}

function summaryMarkdown() {
  let md = "# Candidate Interview: " + titleLine() + "\n\n_Interviewed " + fmtDate(interviewDate()) + "_\n";
  collectSummary().forEach(sec => {
    md += "\n## " + sec.title + "\n\n";
    if (sec.text) { md += sec.text + "\n"; return; }
    sec.lines.forEach(l => {
      md += "- **" + l.label + ":** " + (l.href ? "[" + l.value + "](" + l.href + ")" : l.value) + "\n";
    });
  });
  return md;
}

/* ---------- shell ---------- */

function truthy(v) {
  if (Array.isArray(v)) return v.some(x => x && typeof x === "object" ? Object.values(x).some(truthy) : truthy(x));
  if (v && typeof v === "object") return Object.values(v).some(truthy);
  return !!(v && String(v).trim());
}

function stepDone(w) {
  if (w.kind === "candidate") return state.shortlist.length > 0 && truthy(state.common.candidate.full_name);
  if (w.kind === "common") return Object.keys(state.common[w.key]).some(k => truthy(state.common[w.key][k]));
  if (w.kind === "depth") return interviewSkills().some(s => depthRank(state.skills[s.id]) >= 0);
  if (w.kind === "dives") return divedSkills().some(s => truthy(state.dives[s.id]));
  if (w.kind === "fit") return !!state.fit.primary;
  return false;
}

/* The accent follows the placement: the primary role's catalog, else the
   first role being explored, else the business toggle. */
function accentForm() {
  const r = roleByKey(state.fit.primary) || shortlistRoles()[0];
  if (r) return r.cat;
  return catalogsFor(store.businessId)[0];
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  document.documentElement.dataset.form = accentForm();
  if (currentStep >= STEPS.length) currentStep = STEPS.length - 1;
  rememberStep();

  const side = el("nav", "sidebar");
  side.appendChild(el("div", "brand", esc(IV.brand.title) + "<br><span>" + esc(IV.brand.subtitle) + "</span>"));
  const focus = roleByKey(state.fit.primary);
  if (focus) side.appendChild(el("div", "role-chip", focus.role.icon + " " + esc(focus.role.label)));
  else if (state.shortlist.length) {
    side.appendChild(el("div", "role-chip", "🔎 Exploring " + state.shortlist.length + " role" + (state.shortlist.length === 1 ? "" : "s")));
  }
  STEPS.forEach((w, i) => {
    const btn = el("button", "nav-step" + (i === currentStep ? " active" : "") + (stepDone(w) ? " done" : ""));
    btn.innerHTML = "<span class='nav-num'>" + (i + 1) + "</span> " + esc(w.title);
    btn.addEventListener("click", () => { currentStep = i; render(); });
    side.appendChild(btn);
  });
  /* theme toggle: Auto follows system preference; Light/Dark pin it */
  const themeBox = el("div", "theme-toggle");
  [["auto", "◐ Auto"], ["light", "☀️ Light"], ["dark", "🌙 Dark"]].forEach(([val, labelTxt]) => {
    const btn = el("button", "theme-btn" + (themePref() === val ? " active" : ""), labelTxt);
    btn.addEventListener("click", () => {
      setThemePref(val);
      themeBox.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    themeBox.appendChild(btn);
  });
  side.appendChild(themeBox);

  const reset = el("button", "nav-reset", "🗑 Start new interview");
  let armed = false, armTimer = null;
  reset.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      reset.textContent = "⚠️ Click again to clear everything";
      reset.classList.add("armed");
      armTimer = setTimeout(() => {
        armed = false;
        reset.textContent = "🗑 Start new interview";
        reset.classList.remove("armed");
      }, 4000);
      return;
    }
    clearTimeout(armTimer);
    state = blankInterview();
    store.interview = state;
    flushSave();
    currentStep = 0;
    render();
  });
  side.appendChild(reset);

  /* feedback — opens a pre-addressed draft (desktop Outlook, else Outlook web) */
  const feedback = el("a", "nav-feedback", "✉️ Feedback? Email David Sheehan");
  feedback.href = feedbackMailto();          /* keeps right-click → copy address */
  feedback.addEventListener("click", e => { e.preventDefault(); openFeedbackEmail(); });
  side.appendChild(feedback);

  app.appendChild(side);

  const main = el("main", "panel");
  const w = STEPS[currentStep];

  /* Business selector (PTS / TTS) filters the role picker on the first step. */
  if (w.kind === "candidate") {
    const bizBar = el("div", "form-toggle business-toggle");
    bizBar.appendChild(el("span", "form-toggle-label", "Business"));
    const bizSeg = el("div", "form-seg");
    BUSINESS_ORDER.forEach(bid => {
      if (!catalogsFor(bid).length) return;
      const b = BUSINESSES[bid];
      const btn = el("button", "form-seg-btn" + (store.businessId === bid ? " active" : ""), b.label);
      btn.title = b.full;
      btn.addEventListener("click", () => switchBusiness(bid));
      bizSeg.appendChild(btn);
    });
    bizBar.appendChild(bizSeg);
    main.appendChild(bizBar);
  }

  if (w.kind === "candidate") renderCandidateStep(main);
  else if (w.kind === "common") renderCommonStep(main, w.key);
  else if (w.kind === "depth") renderDepthStep(main);
  else if (w.kind === "dives") renderDivesStep(main);
  else if (w.kind === "fit") renderFitStep(main);
  else renderReviewStep(main);

  const nav = el("div", "step-nav");
  if (currentStep > 0) {
    const prev = el("button", "btn", "← Back");
    prev.addEventListener("click", () => { currentStep--; render(); });
    nav.appendChild(prev);
  }
  if (currentStep < STEPS.length - 1) {
    const next = el("button", "btn primary", "Next →");
    next.addEventListener("click", () => { currentStep++; render(); });
    nav.appendChild(next);
  }
  main.appendChild(nav);
  app.appendChild(main);

  renderNotesPanel(app);
}

/* Persistent notes rail — visible on every step, saved to state, and rolled
   into the final output. Editing it does NOT re-render (so typing never loses
   focus); it just updates state and autosaves. */
function renderNotesPanel(app) {
  const panel = el("aside", "notes-panel");

  /* plain-language explainer of the role in focus, for reps outside the domain */
  const r = roleByKey(state.fit.primary) || shortlistRoles()[0];
  if (r && r.role.about) {
    const box = el("div", "role-about");
    /* "an" before vowel-sounding starts (ERP, AI) — U reads as "you", so "a UX" */
    const article = /^[AEIO]/.test(r.role.label) ? "an" : "a";
    box.appendChild(el("div", "role-about-title", r.role.icon + " What is " + article + " " + esc(r.role.label) + "?"));
    box.appendChild(el("p", "role-about-text", esc(r.role.about)));
    panel.appendChild(box);
  }

  panel.appendChild(el("div", "notes-head", "🗒️ Notes"));
  panel.appendChild(el("p", "notes-sub", "Kept across every step and added to the export."));
  panel.appendChild(notesField("Résumé / LinkedIn (paste before the call)", "pretext",
    "Paste the résumé or LinkedIn profile before the call…"));
  panel.appendChild(notesField("Live notes", "live",
    "Jot anything they mention that isn't a field on this screen…"));
  app.appendChild(panel);
}

/* One notes field. Text autosaves; a manual vertical resize is captured via
   ResizeObserver and stored (…H), then reapplied so the chosen height
   survives step changes. */
function notesField(labelText, key, placeholder) {
  const hKey = key + "H";
  const block = el("div", "notes-block");
  block.appendChild(el("label", "notes-label", labelText));
  const ta = el("textarea");
  ta.placeholder = placeholder;
  ta.value = state.notes[key] || "";
  if (state.notes[hKey]) ta.style.height = state.notes[hKey] + "px";
  ta.addEventListener("input", () => { state.notes[key] = ta.value; saveState(); });

  if (typeof ResizeObserver !== "undefined") {
    let lastH = null;
    const ro = new ResizeObserver(() => {
      const h = ta.offsetHeight;
      if (!h) return;
      if (lastH === null) { lastH = h; return; }   // first measurement = baseline
      if (h !== lastH) { lastH = h; state.notes[hKey] = h; saveState(); }
    });
    ro.observe(ta);
  }

  block.appendChild(ta);
  return block;
}

/* ---------- staying current ----------
   sw.js makes every load revalidate with the server, so a normal reload always
   gets the latest deploy (no hard refresh). A tab left open across a deploy
   still runs the old code, so when it comes back into view (and every 15
   minutes) the page compares its asset version with the live index.html and
   offers a one-click reload. Answers are already saved; nothing is lost.
   Both only apply over http(s) — opening index.html from disk skips them. */

const SERVED = /^https?:$/.test(location.protocol);

if (SERVED && "serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).catch(() => {});
}

function assetVersion(html) {
  const m = /app\.js\?v=([^"'&\s>]+)/.exec(html);
  return m ? m[1] : null;
}
const LOADED_VERSION = assetVersion(document.documentElement.outerHTML);

async function checkForUpdate() {
  if (!SERVED || !LOADED_VERSION || document.querySelector(".update-bar")) return;
  try {
    const resp = await fetch("index.html", { cache: "no-store" });
    if (!resp.ok) return;
    const live = assetVersion(await resp.text());
    if (live && live !== LOADED_VERSION) showUpdateBar();
  } catch (e) { /* offline — try again later */ }
}

function showUpdateBar() {
  const bar = el("div", "update-bar");
  bar.setAttribute("role", "status");
  bar.appendChild(el("span", null, "A new version of the form is available. Your answers are saved."));
  const btn = el("button", "btn primary", "Reload");
  btn.addEventListener("click", () => { flushSave(); rememberStep(); location.reload(); });
  bar.appendChild(btn);
  document.body.appendChild(bar);
}

if (SERVED) {
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkForUpdate(); });
  setInterval(checkForUpdate, 15 * 60 * 1000);
}

document.addEventListener("DOMContentLoaded", render);

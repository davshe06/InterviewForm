/* Catalog validator — run after editing any skills-*.js, roles-*.js, or
   interview.js:   node tools/check-catalogs.cjs
   No dependencies. Loads the files as classic scripts, the way the browser
   does, and exits non-zero if anything is inconsistent. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");

global.window = global;
global.exploring = () => false;   /* referenced by interview.js showIf closures */
["skills-shared.js", "skills-tech.js", "skills-finance.js", "skills-digital.js",
 "roles-management.js", "roles-tech.js", "roles-digital.js", "interview.js"]
  .forEach(f => vm.runInThisContext(fs.readFileSync(path.join(root, f), "utf8"), { filename: f }));

const SKILLS = window.SKILLS, FORMS = window.FORMS, IV = window.INTERVIEW;
const TYPES = ["text", "textarea", "number", "select", "radio", "chips", "textlist", "group", "payrange"];
const NEEDS_OPTIONS = ["select", "radio", "chips"];
const problems = [];
const bad = msg => problems.push(msg);

function checkQuestions(where, questions, reserved) {
  const ids = new Set();
  questions.forEach(q => {
    if (!q.id || !q.label) bad(where + ": question missing id or label");
    if (ids.has(q.id)) bad(where + ": duplicate question id " + q.id);
    ids.add(q.id);
    if (reserved && reserved.includes(q.id)) bad(where + ": question id " + q.id + " is reserved");
    if (!TYPES.includes(q.type)) bad(where + "/" + q.id + ": unknown type " + q.type);
    if (NEEDS_OPTIONS.includes(q.type) && !q.optionsFrom && !(q.options && q.options.length))
      bad(where + "/" + q.id + ": " + q.type + " needs options or optionsFrom");
    if (q.type === "group") {
      if (!(q.fields && q.fields.length)) bad(where + "/" + q.id + ": group needs fields");
      const fids = new Set();
      (q.fields || []).forEach(f => {
        if (!f.id || !f.label) bad(where + "/" + q.id + ": group field missing id or label");
        if (fids.has(f.id)) bad(where + "/" + q.id + ": duplicate group field " + f.id);
        fids.add(f.id);
        if (f.type && f.type !== "radio") bad(where + "/" + q.id + "/" + f.id + ": group fields are text, long, or radio");
        if (f.type === "radio" && !(f.options && f.options.length)) bad(where + "/" + q.id + "/" + f.id + ": radio needs options");
        if (f.showIf && typeof f.showIf !== "function") bad(where + "/" + q.id + "/" + f.id + ": showIf must be a function");
      });
    }
  });
}

/* skills */
const used = {};
Object.entries(SKILLS).forEach(([id, s]) => {
  ["label", "icon", "what", "listen", "red"].forEach(k => { if (!s[k]) bad("skill " + id + ": missing " + k); });
  if (!["slow", "fast"].includes(s.decay)) bad("skill " + id + ": decay must be slow or fast");
  if (!Array.isArray(s.ask) || !s.ask.length) bad("skill " + id + ": needs at least one ask question");
  if (!Array.isArray(s.capture) || !s.capture.length) bad("skill " + id + ": needs capture questions");
  else checkQuestions("skill " + id, s.capture, ["proof_point"]);
});

/* roles */
const roleIds = new Set();
Object.entries(FORMS).forEach(([cat, form]) => {
  if (!["pts", "tts"].includes(form.business)) bad(cat + ": unknown business " + form.business);
  const keys = Object.keys(form.roles);
  if (keys.length !== form.roleOrder.length || keys.some(k => !form.roleOrder.includes(k)))
    bad(cat + ": roleOrder doesn't match roles");
  Object.entries(form.roles).forEach(([rid, r]) => {
    const where = cat + ":" + rid;
    if (roleIds.has(rid)) bad(where + ": role id also used in another catalog");
    roleIds.add(rid);
    ["label", "icon", "tagline", "about", "opener", "coach"].forEach(k => { if (!r[k]) bad(where + ": missing " + k); });
    const skills = new Set();
    (r.skills || []).forEach(id => {
      if (!SKILLS[id]) bad(where + ": unknown skill " + id);
      if (skills.has(id)) bad(where + ": skill listed twice " + id);
      skills.add(id);
      used[id] = (used[id] || 0) + 1;
    });
    (r.profiles || []).forEach(p => p.skills.forEach(id => {
      if (!skills.has(id)) bad(where + ": profile '" + p.profile + "' uses skill " + id + " the role doesn't list");
    }));
    (r.teammates || []).forEach(t => {
      if (t.skill && !skills.has(t.skill)) bad(where + ": teammate '" + t.label + "' overlaps skill " + t.skill + " the role doesn't list");
    });
    (r.tools || []).forEach(t => { if (!t.id || !t.label || !Array.isArray(t.options)) bad(where + ": malformed tool category"); });
  });
});
Object.keys(SKILLS).forEach(id => { if (!used[id]) bad("skill " + id + ": not used by any role"); });

/* role-independent interview sections — question ids unique across all of
   them, so a saved answer can follow its question between sections */
const homes = {};
Object.entries(IV.sections).forEach(([key, sec]) => {
  checkQuestions("interview." + key, sec.questions);
  sec.questions.forEach(q => {
    if (homes[q.id]) bad("interview." + key + "/" + q.id + ": id also used in section " + homes[q.id]);
    homes[q.id] = key;
    if (q.optionsFrom && !["certs", "environments", "metrics", "teammates"].includes(q.optionsFrom))
      bad("interview." + key + "/" + q.id + ": unknown optionsFrom " + q.optionsFrom);
  });
});

const roleCount = Object.values(FORMS).reduce((n, f) => n + f.roleOrder.length, 0);
if (problems.length) {
  console.error(problems.length + " problem(s):\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log("OK — " + Object.keys(SKILLS).length + " skills, " + roleCount + " roles, " +
  Object.keys(IV.sections).length + " interview sections.");

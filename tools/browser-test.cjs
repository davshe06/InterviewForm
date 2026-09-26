/* End-to-end browser test — drives index.html over file:// in Chromium and
   walks a full interview.   node tools/browser-test.cjs
   Needs Playwright (resolved locally, else from the global npm root) and
   Chromium at CHROME_PATH or /opt/pw-browsers/chromium-1194/chrome-linux/chrome.
   Prints one line per check and exits non-zero if any fail. */
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

function loadPlaywright() {
  try { return require("playwright"); }
  catch (e) { return require(path.join(execSync("npm root -g").toString().trim(), "playwright")); }
}
const { chromium } = loadPlaywright();
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const PAGE = "file://" + path.join(__dirname, "..", "index.html");
const OUT = process.env.TEST_OUT || path.join(require("os").tmpdir(), "interview-browser-test");
fs.mkdirSync(OUT, { recursive: true });

let failures = 0;
const check = (ok, msg) => { console.log((ok ? "ok: " : "FAIL: ") + msg); if (!ok) failures++; };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", e => errors.push("pageerror: " + e.message));
  p.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await p.goto(PAGE);
  const Y = await p.evaluate(() => interviewYear());

  const step = n => p.locator(".nav-step").nth(n - 1).click();
  const row = label => p.locator(".depth-row", { has: p.locator(".depth-name > span", { hasText: new RegExp("^\\S+ " + esc(label) + "$") }) });
  const pick = async (label, group, text) => {
    const r = row(label);
    const sel = { depth: ".depth-head .seg", last: ".depth-last .seg" }[group];
    const loc = sel ? r.locator(sel) : r.locator(".depth-field", { hasText: group === "evidence" ? "Evidence" : "Interest" }).locator(".seg");
    await loc.filter({ hasText: new RegExp("^" + esc(text) + "$") }).click();
  };
  const years = (label, v) => row(label).locator(".depth-field", { hasText: "Years" }).locator("select").selectOption(v);
  const fill = (qid, v) => p.locator('[data-qid="' + qid + '"] input, [data-qid="' + qid + '"] textarea').first().fill(v);
  const radio = (qid, v) => p.locator('[data-qid="' + qid + '"] .seg', { hasText: new RegExp("^" + esc(v) + "$") }).click();
  const chip = (qid, v) => p.locator('[data-qid="' + qid + '"] .chip', { hasText: new RegExp("^" + esc(v) + "$") }).click();

  const tips = sec => p.locator('[data-section="' + sec + '"] > .tips').innerText();

  /* ---- step 1: candidate + motivation (TTS: Backend + DevOps) ---- */
  check(await p.locator(".nav-step").count() === 5, "five steps");
  check((await p.locator(".nav-divider").innerText()).toLowerCase().includes("after the call"), "after-the-call divider before the last step");
  await p.click('.form-seg-btn:has-text("TTS")');
  check(await p.locator(".picker-group").count() === 2, "TTS picker groups Tech and Digital");
  await p.click('.role-card:has-text("Software Engineer (Backend)")');
  await p.click('.role-card:has-text("DevOps / SRE")');
  check((await p.locator(".role-note").innerText()).includes("Exploring 2 roles"), "shortlist of 2 shown");
  check(!(await p.locator('[data-qid="mr_pillars"]').count()) || await p.locator('[data-qid="mr_pillars"]').isHidden(), "no MR questions yet");
  await fill("full_name", "Jordan Rivera");
  await fill("email", "jordan@example.com");
  await fill("phone", "(555) 010-2030");
  await fill("linkedin", "linkedin.com/in/jordanrivera");
  await fill("samples", "github.com/jrivera");
  await fill("current_title", "Senior Software Engineer");
  await fill("current_employer", "Acme Payments");
  await radio("work_authorized", "Yes");
  await radio("sponsorship", "No");
  check(await p.locator('[data-qid="clearance"]').isVisible(), "clearance question shown when a Tech role is explored");
  check(await p.locator('[data-qid="certs"] .chip', { hasText: "CKA / CKAD" }).count() === 1, "certification chips come from shortlisted roles");

  /* motivation, on the same step */
  check(await p.locator('[data-section="motivation"] h3').innerText() === "Why They're Looking", "motivation section on step 1");
  await fill("why_looking", "Wants to own a platform end to end");
  await p.locator('[data-qid="timeline"] select').selectOption("2 weeks' notice");
  const app1 = p.locator('[data-qid="applications"] .group-item').first();
  await app1.locator('[data-fid="company"] input').fill("Globex");
  await app1.locator('[data-fid="role"] input').fill("Staff Engineer");
  await app1.locator('[data-fid="stage"] .seg', { hasText: "Final round" }).click();
  check(await app1.locator('[data-fid="firm"]').isHidden(), "recruiting firm hidden until 'through a firm' is Yes");
  await app1.locator('[data-fid="via_firm"] .seg', { hasText: /^No$/ }).click();
  check(await app1.locator('[data-fid="firm"]').isHidden(), "recruiting firm hidden for a direct application");
  await app1.locator('[data-fid="via_firm"] .seg', { hasText: /^Yes$/ }).click();
  check(await app1.locator('[data-fid="firm"]').isVisible(), "recruiting firm shown when applied through a firm");
  await app1.locator('[data-fid="firm"] input').fill("TEKsystems");
  await radio("counteroffer", "High");
  const motTips = await tips("motivation");
  check(motTips.includes("working with another recruiting firm"), "other-firm prompt");
  check(motTips.includes("final round or offer"), "competing-offer prompt");
  check(motTips.includes("If your company matched"), "counteroffer prompt");

  /* ---- step 2: career history ---- */
  await step(2);
  check(await p.locator("h2").innerText() === "Career History", "career history step");
  const pos = p.locator('[data-qid="positions"] .group-item').first();
  check(await pos.locator('[data-fid="title"] input').inputValue() === "Senior Software Engineer" &&
        await pos.locator('[data-fid="company"] input').inputValue() === "Acme Payments", "position 1 prefilled from the current title and employer");
  await pos.locator('[data-fid="dates"] input').fill("2021 – present");
  await pos.locator('[data-fid="manager_name"] input').fill("Priya Shah");
  await pos.locator('[data-fid="manager_title"] input').fill("VP Engineering");
  await pos.locator('[data-fid="owned"] textarea').fill("Owned the ledger service");
  await fill("reports_to", "CTO");
  await fill("reports_to_name", "Sam Okafor");
  await p.locator('[data-qid="direct_reports"] select').selectOption("1–3");
  await chip("teammates", "DevOps / SRE");
  check(await p.locator('[data-qid="teammates"] .chip', { hasText: "Software Architect" }).count() === 1, "teammate chips come from shortlisted roles");

  /* ---- step 3: skills & deep dive ---- */
  await step(3);
  check(await p.locator("h2").innerText() === "Skills & Deep Dive", "skills step");
  check(await p.locator(".role-block").count() === 2, "a header block per explored role");
  check((await p.locator(".role-block-opener").first().innerText()).startsWith("Open with:"), "role opener question shown");
  check((await p.locator(".shared-note").innerText()).includes("Cloud Platforms"), "shared skill listed once, noted on the second role");
  check(await row("Cloud Platforms").count() === 1, "Cloud Platforms rendered exactly once");
  check(await row("Back-End Languages & Frameworks").locator(".depth-detail").count() === 0, "no detail before rating");
  check(await row("Back-End Languages & Frameworks").locator(".dive").count() === 0, "no deep dive before rating");
  await pick("Back-End Languages & Frameworks", "depth", "Owned");
  await years("Back-End Languages & Frameworks", "6–9");
  await pick("Back-End Languages & Frameworks", "last", "Now");
  await pick("Back-End Languages & Frameworks", "evidence", "Walked me through it");
  const expBox = row("Back-End Languages & Frameworks").locator(".depth-field.wide textarea");
  check(await expBox.isVisible(), "experience box shown once a skill is rated");
  await expBox.click();
  await p.keyboard.type("Built the payments ledger API in Go and Java");
  check(await expBox.inputValue() === "Built the payments ledger API in Go and Java", "typing in the experience box keeps focus");
  check(await p.evaluate(() => state.skills.backend_languages.details) === "Built the payments ledger API in Go and Java", "experience details saved");
  const langDive = row("Back-End Languages & Frameworks").locator(".dive");
  check(await langDive.count() === 1 && await langDive.evaluate(d => d.open), "rating a skill Owned opens its deep dive in the row");
  check(await langDive.locator(".dive-ask li").count() >= 2, "ask script shown");
  check(await langDive.locator(".dive-signal.good").count() === 1 && await langDive.locator(".dive-signal.bad").count() === 1, "strong-answer and red-flag signals shown");
  check(await langDive.locator('[data-qid="proof_point"]').count() === 0, "no separate proof point — their experience covers it");
  await langDive.locator('[data-qid="language"] .chip', { hasText: /^Go$/ }).click();
  await pick("System Design & Architecture", "depth", "Led");
  await pick("System Design & Architecture", "last", "Now");
  await pick("Cloud Platforms", "depth", "Owned");
  await pick("Cloud Platforms", "last", String(Y - 3));
  check((await row("Cloud Platforms").locator(".depth-flags").innerText()).includes("Last did this in " + (Y - 3)), "fast skill stale at 3 years");
  await pick("Cloud Platforms", "last", String(Y - 1));
  check(await row("Cloud Platforms").locator(".depth-flags").count() === 0, "fast skill fresh at 1 year");
  check((await row("Cloud Platforms").locator(".dive .tip.warn").innerText()).includes("dedicated DevOps / SRE"), "teammate-overlap prompt on an owned skill");
  await pick("Databases & Data Access", "depth", "Hands-on");
  await pick("Databases & Data Access", "last", "Now");
  check(!(await row("Databases & Data Access").locator(".dive").evaluate(d => d.open)), "Hands-on deep dive starts closed");
  await pick("Streaming & Messaging", "depth", "None");
  check(await row("Streaming & Messaging").locator("textarea").count() === 0, "no experience box for None");
  check(await row("Streaming & Messaging").locator(".dive").count() === 0, "no deep dive for None");
  await pick("Infrastructure as Code", "depth", "Hands-on");
  await pick("Infrastructure as Code", "last", "Now");
  await pick("Containers & Kubernetes", "depth", "Exposure");
  await years("Containers & Kubernetes", "10+");
  await pick("Containers & Kubernetes", "last", "Now");
  check((await row("Containers & Kubernetes").locator(".depth-flags").innerText()).includes("10+ years of exposure"), "long-exposure prompt");
  await pick("APIs & Services", "depth", "Owned");
  await pick("APIs & Services", "evidence", "Résumé only");
  check((await row("APIs & Services").locator(".depth-flags").innerText()).includes("only on the résumé"), "résumé-only prompt");
  await pick("APIs & Services", "last", "Earlier…");
  check((await row("APIs & Services").locator(".depth-flags").innerText()).includes("Pin down the year"), "pin-down-year prompt");
  await row("APIs & Services").locator(".depth-last select").selectOption(String(Y - 6));
  check(await p.evaluate(() => state.skills.apis_services.last) === Y - 6, "earlier year stored as a number");
  await pick("APIs & Services", "last", "Now");
  await pick("APIs & Services", "interest", "↓ Wants to avoid");
  await pick("APIs & Services", "interest", "↓ Wants to avoid");
  check(await p.evaluate(() => state.skills.apis_services.interest) === undefined, "clicking a selected option clears it");
  const sdDive = () => row("System Design & Architecture").locator(".dive");
  await sdDive().locator("summary").click();
  await years("System Design & Architecture", "10+");
  check(!(await sdDive().evaluate(d => d.open)), "a deep dive the recruiter closed stays closed when the row redraws");
  check(await p.locator(".depth-row .dive").count() === 7, "one deep dive per skill rated Exposure or above");
  const strongBoxes = p.locator(".depth-row.strong .depth-field.wide textarea");
  for (let i = 0; i < await strongBoxes.count(); i++) {
    if (!(await strongBoxes.nth(i).inputValue())) await strongBoxes.nth(i).fill("Specific example " + (i + 1));
  }
  for (const t of ["Docker", "Kubernetes", "GitHub Actions", "PostgreSQL", "Datadog"]) {
    await p.locator('.tools-section .chip', { hasText: new RegExp("^" + esc(t) + "$") }).first().click();
  }
  check(await p.evaluate(() => candidateTools().size) === 5, "tools recorded for fit scoring");
  check((await p.locator(".profile-card .profile-kicker").innerText()).toLowerCase().includes("leading fit"), "leading-fit card on the skills step");

  /* ---- step 5 (after the call): role fit ---- */
  await step(5);
  check(await p.locator("h2").innerText() === "Role Fit & Wrap-up", "wrap-up step");
  const fitRows = await p.locator(".fit-row .fit-role").allInnerTexts();
  check(fitRows.length >= 3, "ranked fit rows (" + fitRows.length + ")");
  check(fitRows.some(t => t.includes("Cloud Architect")), "a role that wasn't explored surfaces through shared skills");
  check(fitRows[0].includes("Software Engineer (Backend)"), "strongest fit first: " + fitRows[0]);
  check(await p.locator(".fit-profile").first().innerText().then(t => t.includes("marketable")), "placement profile on the fit row");
  const arch = p.locator(".fit-row", { hasText: "Cloud Architect" });
  await arch.locator("button", { hasText: "Explore" }).click();
  check(await p.locator("h2").innerText() === "Skills & Deep Dive", "Explore jumps to the Skills step");
  check(await p.locator(".role-block").count() === 3, "explored role added to the skills step");
  await pick("Cloud Migration & Modernization", "depth", "Hands-on");
  await pick("Cloud Migration & Modernization", "last", String(Y - 1));
  await step(5);
  await p.locator(".fit-row", { hasText: "Software Engineer (Backend)" }).locator(".seg", { hasText: "Primary" }).click();
  await p.locator(".fit-row", { hasText: "DevOps / SRE" }).locator(".chip", { hasText: "Also fits" }).click();
  check(await p.evaluate(() => state.fit.primary) === "tech:backend_engineer", "primary role saved");

  /* 1–5 fit rating: the slider starts at the suggestion, the recruiter sets their own */
  const fitRow = name => p.locator(".fit-row", { has: p.locator(".fit-role", { hasText: name }) });
  const beSuggested = await p.evaluate(() => suggestedRating(roleFit("tech:backend_engineer").fit));
  check(beSuggested >= 1 && beSuggested <= 5 && await fitRow("Software Engineer (Backend)").locator(".fit-slider").inputValue() === String(beSuggested),
    "slider starts at the suggested 1–5 rating (" + beSuggested + ")");
  check((await fitRow("Software Engineer (Backend)").locator(".fit-word").innerText()).includes("suggested"), "an untouched rating is marked suggested");
  check(await fitRow("Software Engineer (Backend)").locator(".link-btn").isHidden(), "no reset until the recruiter rates");
  check(await p.locator(".fit-pct, .fit-bar").count() === 0, "percentages replaced by the 1–5 rating");
  await fitRow("DevOps / SRE").locator(".fit-slider").fill("4");
  check(await p.evaluate(() => state.fit.ratings["tech:devops_sre"]) === 4, "slider saves the recruiter's rating");
  check((await fitRow("DevOps / SRE").locator(".fit-rate").innerText()).includes("Good fit") &&
        await fitRow("DevOps / SRE").locator(".fit-rate.set").count() === 1, "slider label updates in place");
  await fitRow("Software Engineer (Backend)").locator(".fit-slider").fill("5");
  await fitRow("Full-Stack Developer").locator(".fit-slider").fill("2");
  await fitRow("Full-Stack Developer").locator(".link-btn").click();
  check(await p.evaluate(() => state.fit.ratings["tech:fullstack_developer"]) === undefined &&
        await fitRow("Full-Stack Developer").locator(".fit-slider").inputValue() === String(await p.evaluate(() => suggestedRating(roleFit("tech:fullstack_developer").fit))),
    "Use suggested clears the recruiter's rating");
  check((await p.locator(".question", { hasText: "Level to place them at" }).innerText()).includes("Suggested"), "level suggestion shown");
  await p.locator(".seg", { hasText: /^Senior$/ }).click();
  await p.locator(".question", { hasText: "Why this role" }).locator("textarea").fill("Owns backend services end to end; cloud is recent and hands-on.");

  /* ---- MR questions appear once a Management role is explored ---- */
  await step(1);
  await p.click('.form-seg-btn:has-text("PTS")');
  check((await p.locator(".shortlist-row").innerText()).includes("Also exploring"), "roles from the other business stay visible");
  await p.click('.role-card:has-text("Controller")');
  await step(2);
  check(await p.locator('[data-qid="mr_pillars"]').isVisible(), "MR capability question shown once an MR role is explored");
  await step(3);
  await pick("Month-End Close", "depth", "Owned");
  await pick("Month-End Close", "last", "Earlier…");
  await row("Month-End Close").locator(".depth-last select").selectOption(String(Y - 4));
  check(await row("Month-End Close").locator(".depth-flags").count() === 0, "slow skill not stale at 4 years");
  await row("Month-End Close").locator(".depth-last select").selectOption(String(Y - 5));
  check((await row("Month-End Close").locator(".depth-flags").innerText()).includes("Last did this in " + (Y - 5)), "slow skill stale at 5 years");
  await pick("Month-End Close", "depth", "Owned");   /* clear it again */
  await step(1);
  await p.click('.role-card:has-text("Controller")');

  /* ---- step 4: wants, pay, and the close ---- */
  await step(4);
  check(await p.locator("h2").innerText() === "Wants, Pay & Close", "wants/pay/close step");
  check((await p.locator(".section-head").allInnerTexts()).join("|") === "What They Want Next|Pay & Logistics|Screening, References & Next Steps", "three sections in call order");
  check(await p.locator('[data-qid="earliest_start"]').count() === 0 && await p.locator('[data-qid="why_looking"]').count() === 0, "duplicate questions consolidated");
  await p.locator('[data-qid="top3"] input').nth(0).fill("Own a platform");
  await chip("engagement", "Contract-to-hire");
  check((await tips("wants")).includes("Direct hire (Perm)"), "perm/FTEP reminder");
  check(await p.locator('[data-qid="c2c_company"]').isHidden(), "C2C fields hidden by default");
  await radio("pay_type", "C2C");
  check(await p.locator('[data-qid="c2c_company"]').isVisible(), "C2C fields shown for C2C");
  await fill("c2c_company", "Rivera Consulting LLC");
  await radio("c2c_relationship", "They own the company");
  const hourly = p.locator('[data-qid="hourly"] input');
  await hourly.nth(0).fill("80"); await hourly.nth(1).fill("95"); await hourly.nth(2).fill("85");
  check((await tips("pay")).includes("bottom end is above"), "floor-above-ideal check");
  await hourly.nth(2).fill("75");
  const salary = p.locator('[data-qid="salary"] input');
  await salary.nth(0).fill("165000"); await salary.nth(1).fill("185000"); await salary.nth(2).fill("155000");
  const ref = p.locator('[data-qid="references"] .group-item').first();
  await ref.locator('[data-fid="name"] input').fill("Priya Shah");
  await ref.locator('[data-fid="relationship"] input').fill("Former manager");
  await ref.locator('[data-fid="company"] input').fill("Acme Payments");
  await ref.locator('[data-fid="contact_ok"] .seg', { hasText: "Not yet" }).click();
  check((await tips("next")).includes("aren't cleared to contact yet"), "reference not-yet prompt");
  await p.locator(".daywin-block input[type=date]").first().fill(Y + "-10-06");
  await p.locator(".daywin-block input[type=time]").nth(0).fill("09:00");
  await p.locator(".daywin-block input[type=time]").nth(1).fill("11:00");
  await fill("next_steps", "Submit to two backend roles this week");

  /* ---- step 5: your read, review, and every export ---- */
  await step(5);
  await fill("summary", "Strong backend owner, recent cloud work.");
  const misses = await p.locator(".check.miss").allInnerTexts();
  check(misses.length === 0, "checklist complete" + (misses.length ? ": " + misses.join(" | ") : ""));
  const summary = await p.locator(".summary").innerText();
  const expect = [
    ["Jordan Rivera — Software Engineer (Backend)", "title line"],
    ["Software Engineer (Backend) — 5/5 Strong fit", "primary role with its 1–5 rating"],
    ["DevOps / SRE 4/5 Good fit [", "recruiter's fit rating in the write-up"],
    ["(suggested)", "untouched ratings marked suggested in the write-up"],
    ["Strong backend owner, recent cloud work.", "recruiter summary"],
    ["Wants to own a platform end to end", "why they're looking"],
    ["ideal $80–$95/hr · bottom end $75/hr", "hourly pay line"],
    ["ideal $165,000–$185,000/yr · bottom end $155,000/yr", "salary pay line"],
    ["Rivera Consulting LLC", "C2C company"],
    ["Owned · 6–9 yrs · hands-on now", "depth detail"],
    ["Experience: Built the payments ledger API in Go and Java", "experience details on the depth line"],
    ["None — asked, no real experience", "None exported as a gap"],
    ["Back-End Languages & Frameworks (Owned)", "deep-dive capture section"],
    ["Senior Software Engineer — Acme Payments — 2021 – present", "position line"],
    ["Interview availability · Day 1", "availability"],
    ["Manager's name: Priya Shah", "manager name on a position"],
    ["Sam Okafor", "most senior person's name"],
    ["github.com/jrivera", "portfolio link"],
    ["Priya Shah — Former manager — Acme Payments", "reference line"],
    ["Globex — Staff Engineer. Stage: Final round. Through a recruiting firm: Yes. Recruiting firm: TEKsystems", "application with recruiting firm"]
  ];
  /* section headings are upper-cased by CSS, so compare case-insensitively */
  expect.forEach(([s, what]) => check(summary.toLowerCase().includes(s.toLowerCase()), "on-screen summary: " + what));
  const heads = await p.locator(".summary h4").allTextContents();
  check(heads.indexOf("Role Fit") < heads.indexOf("Your Read") && heads.indexOf("Your Read") < heads.indexOf("Why They're Looking") &&
        heads.indexOf("Why They're Looking") < heads.indexOf("Career History"), "write-up leads with fit, your read, then motivation: " + heads.slice(0, 5).join(" | "));
  const md = await p.evaluate(() => summaryMarkdown());
  check(md.includes("## Role Fit") && md.includes("## Experience Depth") && md.includes("Experience: Built the payments ledger") && md.includes("[linkedin.com/in/jordanrivera](https://linkedin.com/in/jordanrivera)"), "markdown export");
  const [dl] = await Promise.all([p.waitForEvent("download"), p.click('button:has-text("Word")')]);
  const docx = path.join(OUT, "out.docx");
  await dl.saveAs(docx);
  const xml = execSync(`python3 -c "import zipfile,sys;print(zipfile.ZipFile(sys.argv[1]).read('word/document.xml').decode())" ${docx}`).toString();
  check(xml.includes("Role Fit") && xml.includes("Rivera Consulting LLC") && xml.includes("Experience: Built the payments ledger"), "Word export");
  check(xml.includes("Candidate Interview: Jordan Rivera") && !xml.includes("Job Order") && !xml.includes("Intake completed"), "Word export title");
  const [pop] = await Promise.all([p.waitForEvent("popup"), p.evaluate(() => printSummary())]);
  await pop.waitForLoadState();
  const printed = await pop.evaluate(() => { window.print = () => {}; return document.body.textContent; });
  check(printed.includes("Experience Depth") && printed.includes("bottom end $75/hr"), "print / PDF export");
  await pop.close();

  /* ---- persistence and reset ---- */
  await p.evaluate(() => flushSave());
  await p.reload();
  check(await p.evaluate(() => state.fit.primary === "tech:backend_engineer" && state.skills.backend_languages.depth === "owned" && state.common.pay.hourly.floor === "75" && state.fit.ratings["tech:devops_sre"] === 4), "record survives a reload");
  check(await p.evaluate(() => !!localStorage.getItem("rh-interview-v2")), "saved under an rh-interview-* key");

  /* ---- an interview saved under the old 10-step layout still loads ---- */
  await p.evaluate(() => {
    /* replace the in-memory record too, or the save on page hide would
       overwrite the old-layout record before the reload reads it */
    store = { businessId: "tts", interview: {
      shortlist: ["tech:backend_engineer"],
      common: { candidate: { full_name: "Old Record" }, history: {},
        wants: { why_looking: "Old why", timeline: "Immediately", top3: ["Old top"] },
        pay: { pay_type: "W2", earliest_start: "2 weeks from offer" },
        market: { applications: [{ company: "Initech", via_firm: "Yes", firm: "Old Firm" }], references: [{ name: "Old Ref" }] },
        next: { counteroffer: "Low", samples: "old.dev", summary: "Old summary", next_steps: "Old next" } },
      skills: { backend_languages: { depth: "owned", last: "current" } },
      dives: { backend_languages: { proof_point: "Old proof", language: ["Go"] } },
      fit: {}, notes: { live: "" } } };
    localStorage.setItem("rh-interview-v2", JSON.stringify(store));
  });
  await p.reload();
  const mig = await p.evaluate(() => ({ c: state.common, sk: state.skills.backend_languages, dv: state.dives.backend_languages, live: state.notes.live }));
  check(mig.c.motivation.why_looking === "Old why" && mig.c.motivation.timeline === "Immediately" && mig.c.motivation.counteroffer === "Low" &&
        mig.c.motivation.applications[0].firm === "Old Firm", "old answers move to the motivation section");
  check(mig.c.next.references[0].name === "Old Ref" && mig.c.candidate.samples === "old.dev" && mig.c.wrapup.summary === "Old summary" &&
        mig.c.next.next_steps === "Old next" && mig.c.wants.top3[0] === "Old top", "old answers move to their new sections");
  check(!("market" in mig.c) && !("why_looking" in mig.c.wants) && !("counteroffer" in mig.c.next), "nothing left behind in old sections");
  check(mig.live.includes("Earliest start / notice period: 2 weeks from offer") && !("earliest_start" in mig.c.pay), "a retired question's answer is kept in the live notes");
  check(mig.sk.details === "Old proof" && !("proof_point" in mig.dv) && mig.dv.language[0] === "Go", "old proof point becomes the skill's experience details");

  /* ---- every role renders its skills (with deep dives) and fit ---- */
  const allOk = await p.evaluate(() => {
    const bad = [];
    allRoleKeys().forEach(key => {
      state.shortlist = [key];
      roleByKey(key).role.skills.forEach(id => { skillState(id); state.skills[id].depth = "owned"; state.skills[id].last = "current"; });
      currentStep = 2; render();
      if (document.querySelectorAll(".depth-row").length !== roleByKey(key).role.skills.length) bad.push(key + " depth");
      if (document.querySelectorAll(".depth-row .dive").length !== roleByKey(key).role.skills.length) bad.push(key + " dives");
      currentStep = 4; render();
      if (!document.querySelector(".fit-row")) bad.push(key + " fit");
      state.skills = {};
    });
    return bad;
  });
  check(allOk.length === 0, "all 36 roles render skills, deep dives, and fit" + (allOk.length ? ": " + allOk.join(", ") : ""));

  await p.evaluate(() => { currentStep = 0; render(); });
  await p.click(".nav-reset"); await p.click(".nav-reset");
  check(await p.evaluate(() => state.shortlist.length === 0 && state.interviewDate === null && !state.fit.primary), "Start new interview clears the record");

  /* ---- theming and small screens ---- */
  await p.click('.form-seg-btn:has-text("PTS")');
  await p.click('.role-card:has-text("Controller")');
  const accent = await p.evaluate(() => getComputedStyle(document.querySelector(".role-card.selected")).borderColor);
  check(accent === "rgb(173, 0, 25)", "Management Resources accent (" + accent + ")");
  await p.click('.theme-btn:has-text("Dark")');
  await step(3);
  await p.screenshot({ path: path.join(OUT, "depth-dark.png") });
  await p.setViewportSize({ width: 390, height: 900 });
  for (const n of [1, 2, 3, 4, 5]) {
    await step(n);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    check(!overflow, "no horizontal scroll at 390px on step " + n);
  }

  check(errors.length === 0, "no page or console errors" + (errors.length ? ": " + errors.join(" | ") : ""));

  await updateTests(browser);

  await browser.close();
  console.log(failures ? failures + " check(s) failed" : "all checks passed");
  process.exit(failures ? 1 : 0);
})();


/* ---------- staying current without a hard refresh ----------
   Serves a copy of the site the way GitHub Pages does (Cache-Control:
   max-age=600 plus ETags), "deploys" changes into the copy, and checks that
   ordinary loads pick them up — even when nobody bumps ?v — that an open tab
   is offered a reload, and that the form still opens offline. */
async function updateTests(browser) {
  const http = require("http");
  const crypto = require("crypto");
  const os = require("os");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "interview-site-"));
  const repo = path.join(__dirname, "..");
  fs.readdirSync(repo).filter(f => /\.(html|js|css)$/.test(f)).forEach(f => fs.copyFileSync(path.join(repo, f), path.join(root, f)));
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

  const server = http.createServer((req, res) => {
    let file = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/site\/?/, "") || "index.html";
    const full = path.join(root, file);
    if (!full.startsWith(root) || !fs.existsSync(full)) { res.writeHead(404); return res.end(); }
    const body = fs.readFileSync(full);
    const etag = '"' + crypto.createHash("md5").update(body).digest("hex") + '"';
    const headers = { "Content-Type": types[path.extname(full)] || "application/octet-stream",
      "Cache-Control": "max-age=600", "ETag": etag };
    if (req.headers["if-none-match"] === etag) { res.writeHead(304, headers); return res.end(); }
    res.writeHead(200, headers);
    res.end(body);
  });
  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const url = "http://127.0.0.1:" + server.address().port + "/site/";

  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", e => errors.push("pageerror: " + e.message));
  const deploy = (file, fn) => fs.writeFileSync(path.join(root, file), fn(fs.readFileSync(path.join(root, file), "utf8")));

  await p.goto(url);
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  check(await p.evaluate(() => !!navigator.serviceWorker.controller), "service worker controls the page");

  /* a deploy that forgets to bump ?v still shows up on a normal reload */
  deploy("app.js", s => s + "\nwindow.__deploy = 'A';\n");
  await p.reload();
  check(await p.evaluate(() => window.__deploy) === "A", "normal reload picks up a deploy without a ?v bump");

  /* …and on a plain revisit, which browsers otherwise serve from cache */
  deploy("app.js", s => s.replace("window.__deploy = 'A';", "window.__deploy = 'B';"));
  await p.goto("about:blank");
  await p.goto(url);
  check(await p.evaluate(() => window.__deploy) === "B", "revisiting the page picks up a deploy");

  /* a tab left open across a deploy is offered a reload, on the same step */
  await p.evaluate(() => { currentStep = 3; render(); });
  deploy("index.html", s => s.replace(/\?v=(\d+)/g, (m, n) => "?v=" + (Number(n) + 1)));
  deploy("app.js", s => s.replace("window.__deploy = 'B';", "window.__deploy = 'C';"));
  await p.evaluate(() => checkForUpdate());
  await p.waitForSelector(".update-bar", { timeout: 5000 }).catch(() => {});
  check(await p.locator(".update-bar").count() === 1, "open tab shows the new-version bar");
  await Promise.all([p.waitForNavigation(), p.click('.update-bar button:has-text("Reload")')]);
  check(await p.evaluate(() => window.__deploy) === "C", "Reload button loads the new version");
  check(await p.evaluate(() => currentStep) === 3 && await p.locator("h2").first().innerText() === "Wants, Pay & Close", "reload returns to the same step");
  await p.evaluate(() => checkForUpdate());
  await p.waitForTimeout(500);
  check(await p.locator(".update-bar").count() === 0, "no bar once up to date");

  /* control: with the service worker blocked, the same revisit is stale —
     proof the checks above test something real */
  const bare = await browser.newContext({ serviceWorkers: "block" });
  const q = await bare.newPage();
  await q.goto(url);
  deploy("index.html", s => s.replace(/\?v=(\d+)/g, (m, n) => "?v=" + (Number(n) + 1)));
  deploy("app.js", s => s.replace("window.__deploy = 'C';", "window.__deploy = 'D';"));
  await q.goto("about:blank");
  await q.goto(url);
  check(await q.evaluate(() => window.__deploy) === "C", "control: without the service worker a revisit serves the old version");
  await bare.close();
  await p.goto(url);
  check(await p.evaluate(() => window.__deploy) === "D", "with the service worker the same revisit is current");

  /* offline: the last copy still opens */
  await new Promise(r => server.close(r));
  server.closeAllConnections && server.closeAllConnections();
  await ctx.setOffline(true);
  await p.reload().catch(() => {});
  check(await p.locator(".nav-step").count() === 5, "form still opens offline");

  check(errors.length === 0, "no page errors while updating" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();
  fs.rmSync(root, { recursive: true, force: true });
}

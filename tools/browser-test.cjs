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

  /* ---- step 1: candidate + roles to explore (TTS: Backend + DevOps) ---- */
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
  await fill("current_title", "Senior Software Engineer");
  await radio("work_authorized", "Yes");
  await radio("sponsorship", "No");
  check(await p.locator('[data-qid="clearance"]').isVisible(), "clearance question shown when a Tech role is explored");
  check(await p.locator('[data-qid="certs"] .chip', { hasText: "CKA / CKAD" }).count() === 1, "certification chips come from shortlisted roles");

  /* ---- step 2: career history ---- */
  await step(2);
  const pos = p.locator('[data-qid="positions"] .group-item').first();
  await pos.locator("input").nth(0).fill("Senior Software Engineer");
  await pos.locator("input").nth(1).fill("Acme Payments");
  await pos.locator("input").nth(2).fill("2021 – present");
  await pos.locator("textarea").nth(0).fill("Owned the ledger service");
  await p.locator('[data-qid="direct_reports"] select').selectOption("1–3");
  await chip("teammates", "DevOps / SRE");
  check(await p.locator('[data-qid="teammates"] .chip', { hasText: "Software Architect" }).count() === 1, "teammate chips come from shortlisted roles");

  /* ---- step 3: experience depth ---- */
  await step(3);
  check(await p.locator(".role-block").count() === 2, "a header block per explored role");
  check((await p.locator(".role-block-opener").first().innerText()).startsWith("Open with:"), "role opener question shown");
  check((await p.locator(".shared-note").innerText()).includes("Cloud Platforms"), "shared skill listed once, noted on the second role");
  check(await row("Cloud Platforms").count() === 1, "Cloud Platforms rendered exactly once");
  check(await row("Back-End Languages & Frameworks").locator(".depth-detail").count() === 0, "no detail before rating");
  await pick("Back-End Languages & Frameworks", "depth", "Owned");
  await years("Back-End Languages & Frameworks", "6–9");
  await pick("Back-End Languages & Frameworks", "last", "Now");
  await pick("Back-End Languages & Frameworks", "evidence", "Walked me through it");
  await pick("System Design & Architecture", "depth", "Led");
  await pick("System Design & Architecture", "last", "Now");
  await pick("Cloud Platforms", "depth", "Owned");
  await pick("Cloud Platforms", "last", String(Y - 3));
  check((await row("Cloud Platforms").locator(".depth-flags").innerText()).includes("Last did this in " + (Y - 3)), "fast skill stale at 3 years");
  await pick("Cloud Platforms", "last", String(Y - 1));
  check(await row("Cloud Platforms").locator(".depth-flags").count() === 0, "fast skill fresh at 1 year");
  await pick("Databases & Data Access", "depth", "Hands-on");
  await pick("Databases & Data Access", "last", "Now");
  await pick("Streaming & Messaging", "depth", "None");
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
  check((await p.locator(".profile-card .profile-kicker").innerText()).toLowerCase().includes("leading fit"), "leading-fit card on depth step");

  /* ---- step 4: technical deep dive ---- */
  await step(4);
  const titles = await p.locator(".dive .dive-title").allInnerTexts();
  check(titles.length === 7 && titles[0].includes("System Design"), "deep dives for exposure+ skills, Led first (" + titles.length + ")");
  check(!titles.some(t => t.includes("Streaming")), "no deep dive for a None skill");
  check(await p.locator(".dive").first().locator(".dive-ask li").count() >= 2, "ask script shown");
  check(await p.locator(".dive").first().locator(".dive-signal.good").count() === 1 && await p.locator(".dive").first().locator(".dive-signal.bad").count() === 1, "strong-answer and red-flag signals shown");
  const cloudDive = p.locator(".dive", { has: p.locator(".dive-title", { hasText: "Cloud Platforms" }) });
  check((await cloudDive.locator(".tip.warn").innerText()).includes("dedicated DevOps / SRE"), "teammate-overlap prompt on an owned skill");
  const langDive = p.locator(".dive", { has: p.locator(".dive-title", { hasText: "Back-End Languages" }) });
  await langDive.locator('[data-qid="language"] .chip', { hasText: /^Go$/ }).click();
  await langDive.locator('[data-qid="proof_point"] textarea').fill("Rewrote the ledger service in Go; p99 800ms → 120ms");
  const openProofs = p.locator('.dive[open] [data-qid="proof_point"] textarea');
  for (let i = 0; i < await openProofs.count(); i++) {
    if (!(await openProofs.nth(i).inputValue())) await openProofs.nth(i).fill("Specific example " + (i + 1));
  }
  for (const t of ["Docker", "Kubernetes", "GitHub Actions", "PostgreSQL", "Datadog"]) {
    await p.locator('.tools-section .chip', { hasText: new RegExp("^" + esc(t) + "$") }).first().click();
  }
  check(await p.evaluate(() => candidateTools().size) === 5, "tools recorded for fit scoring");

  /* ---- step 5: role fit ---- */
  await step(5);
  const fitRows = await p.locator(".fit-row .fit-role").allInnerTexts();
  check(fitRows.length >= 3, "ranked fit rows (" + fitRows.length + ")");
  check(fitRows.some(t => t.includes("Cloud Architect")), "a role that wasn't explored surfaces through shared skills");
  check(fitRows[0].includes("Software Engineer (Backend)"), "strongest fit first: " + fitRows[0]);
  check(await p.locator(".fit-profile").first().innerText().then(t => t.includes("marketable")), "placement profile on the fit row");
  const arch = p.locator(".fit-row", { hasText: "Cloud Architect" });
  await arch.locator("button", { hasText: "Explore" }).click();
  check(await p.locator("h2").innerText() === "Experience Depth", "Explore jumps to Experience Depth");
  check(await p.locator(".role-block").count() === 3, "explored role added to the depth step");
  await pick("Cloud Migration & Modernization", "depth", "Hands-on");
  await pick("Cloud Migration & Modernization", "last", String(Y - 1));
  await step(5);
  await p.locator(".fit-row", { hasText: "Software Engineer (Backend)" }).locator(".seg", { hasText: "Primary" }).click();
  await p.locator(".fit-row", { hasText: "DevOps / SRE" }).locator(".chip", { hasText: "Also fits" }).click();
  check(await p.evaluate(() => state.fit.primary) === "tech:backend_engineer", "primary role saved");
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

  /* ---- steps 6–8 ---- */
  await step(6);
  await p.locator('[data-qid="top3"] input').nth(0).fill("Own a platform");
  await chip("engagement", "Contract-to-hire");
  check((await p.locator(".tips").innerText()).includes("Direct hire (Perm)"), "perm/FTEP reminder");
  await step(7);
  check(await p.locator('[data-qid="c2c_company"]').isHidden(), "C2C fields hidden by default");
  await radio("pay_type", "C2C");
  check(await p.locator('[data-qid="c2c_company"]').isVisible(), "C2C fields shown for C2C");
  await fill("c2c_company", "Rivera Consulting LLC");
  await radio("c2c_relationship", "They own the company");
  const hourly = p.locator('[data-qid="hourly"] input');
  await hourly.nth(0).fill("80"); await hourly.nth(1).fill("95"); await hourly.nth(2).fill("85");
  check((await p.locator(".tips").innerText()).includes("bottom end is above"), "floor-above-ideal check");
  await hourly.nth(2).fill("75");
  const salary = p.locator('[data-qid="salary"] input');
  await salary.nth(0).fill("165000"); await salary.nth(1).fill("185000"); await salary.nth(2).fill("155000");
  await step(8);
  await p.locator(".daywin-block input[type=date]").first().fill(Y + "-10-06");
  await p.locator(".daywin-block input[type=time]").nth(0).fill("09:00");
  await p.locator(".daywin-block input[type=time]").nth(1).fill("11:00");
  await radio("counteroffer", "High");
  check((await p.locator(".tips").innerText()).includes("If your company matched"), "counteroffer prompt");

  /* ---- review + every export ---- */
  await step(9);
  const misses = await p.locator(".check.miss").allInnerTexts();
  check(misses.length === 0, "checklist complete" + (misses.length ? ": " + misses.join(" | ") : ""));
  const summary = await p.locator(".summary").innerText();
  const expect = [
    ["Jordan Rivera — Software Engineer (Backend)", "title line"],
    ["Software Engineer (Backend)", "primary role"],
    ["ideal $80–$95/hr · bottom end $75/hr", "hourly pay line"],
    ["ideal $165,000–$185,000/yr · bottom end $155,000/yr", "salary pay line"],
    ["Rivera Consulting LLC", "C2C company"],
    ["Owned · 6–9 yrs · hands-on now", "depth detail"],
    ["None — asked, no real experience", "None exported as a gap"],
    ["Rewrote the ledger service", "proof point"],
    ["Senior Software Engineer — Acme Payments — 2021 – present", "position line"],
    ["Interview availability · Day 1", "availability"]
  ];
  expect.forEach(([s, what]) => check(summary.includes(s), "on-screen summary: " + what));
  const md = await p.evaluate(() => summaryMarkdown());
  check(md.includes("## Role Fit") && md.includes("## Experience Depth") && md.includes("[linkedin.com/in/jordanrivera](https://linkedin.com/in/jordanrivera)"), "markdown export");
  const [dl] = await Promise.all([p.waitForEvent("download"), p.click('button:has-text("Word")')]);
  const docx = path.join(OUT, "out.docx");
  await dl.saveAs(docx);
  const xml = execSync(`python3 -c "import zipfile,sys;print(zipfile.ZipFile(sys.argv[1]).read('word/document.xml').decode())" ${docx}`).toString();
  check(xml.includes("Role Fit") && xml.includes("Rewrote the ledger service") && xml.includes("Rivera Consulting LLC"), "Word export");
  check(xml.includes("Candidate Interview: Jordan Rivera") && !xml.includes("Job Order") && !xml.includes("Intake completed"), "Word export title");
  const [pop] = await Promise.all([p.waitForEvent("popup"), p.evaluate(() => printSummary())]);
  await pop.waitForLoadState();
  const printed = await pop.evaluate(() => { window.print = () => {}; return document.body.textContent; });
  check(printed.includes("Experience Depth") && printed.includes("bottom end $75/hr"), "print / PDF export");
  await pop.close();

  /* ---- persistence and reset ---- */
  await p.evaluate(() => flushSave());
  await p.reload();
  check(await p.evaluate(() => state.fit.primary === "tech:backend_engineer" && state.skills.backend_languages.depth === "owned" && state.common.pay.hourly.floor === "75"), "record survives a reload");
  check(await p.evaluate(() => !!localStorage.getItem("rh-interview-v2")), "saved under an rh-interview-* key");

  /* ---- every role renders its depth and deep-dive steps ---- */
  const allOk = await p.evaluate(() => {
    const bad = [];
    allRoleKeys().forEach(key => {
      state.shortlist = [key];
      roleByKey(key).role.skills.forEach(id => { skillState(id); state.skills[id].depth = "owned"; state.skills[id].last = "current"; });
      currentStep = 2; render();
      if (document.querySelectorAll(".depth-row").length !== roleByKey(key).role.skills.length) bad.push(key + " depth");
      currentStep = 3; render();
      if (document.querySelectorAll(".dive").length !== roleByKey(key).role.skills.length) bad.push(key + " dives");
      currentStep = 4; render();
      if (!document.querySelector(".fit-row")) bad.push(key + " fit");
      state.skills = {};
    });
    return bad;
  });
  check(allOk.length === 0, "all 36 roles render depth, deep dive, and fit" + (allOk.length ? ": " + allOk.join(", ") : ""));

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
  for (const n of [1, 3, 5, 7]) {
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
  check(await p.evaluate(() => currentStep) === 3 && await p.locator("h2").first().innerText() === "Technical Deep Dive", "reload returns to the same step");
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
  check(await p.locator(".nav-step").count() === 9, "form still opens offline");

  check(errors.length === 0, "no page errors while updating" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();
  fs.rmSync(root, { recursive: true, force: true });
}

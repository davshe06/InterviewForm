/* Finance & accounting skills (Management Resources). Most age slowly —
   accounting knowledge holds its value longer than a JavaScript framework —
   so they use the "slow" staleness cutoff. Shape: skills-shared.js. */
(function () {
  window.SKILLS = window.SKILLS || {};

  const CLOSE_DAYS = ["1–3 days", "4–5 days", "6–10 days", "10+ days"];

Object.assign(window.SKILLS, {

  /* ---------------- finance leadership ---------------- */

  finance_leadership: {
    label: "Finance Leadership & Strategy", icon: "🧭", decay: "slow",
    what: "Running the finance function at the top — strategy, board and investor relationships, and the decisions a CFO owns.",
    ask: [
      "What was the situation when you walked into your last senior finance seat, and what had to be true in 90 days?",
      "Walk me through a board or sponsor meeting you prepared for. What did they push you on?",
      "Tell me about a strategic decision you drove — capital, cost, pricing, an acquisition — and how it turned out."
    ],
    listen: "A named situation (turnaround, growth, PE hold, exit prep), their own decisions with numbers, board/sponsor cadence, and outcomes.",
    red: "Describes the CFO they worked for rather than themselves; no board exposure; 'strategy' with no decision.",
    capture: [
      { id: "scope", type: "chips", label: "What they owned",
        options: ["The whole finance function", "Board / investor reporting", "Strategic planning", "Capital structure", "Cost reduction", "Turnaround / restructuring", "Built the finance team"] },
      { id: "stakeholders", type: "chips", label: "Stakeholders they managed",
        options: ["Board", "PE sponsor", "Lenders / banks", "CEO / owner", "Auditors", "Business unit leaders"] },
      { id: "authority", type: "radio", label: "Decision authority held",
        options: ["Full — acted as the CFO", "Recommended, CEO decided", "Advisory only"] },
      { id: "situations", type: "chips", label: "Situations they've led through",
        options: ["Steady state", "High growth", "Turnaround / distressed", "PE-backed hold", "Exit / sale prep", "IPO", "Interim / transition"] }
    ]
  },

  financial_reporting: {
    label: "Financial Reporting", icon: "📑", decay: "slow",
    what: "Producing financial statements and reporting packages — for management, boards, lenders, or the SEC.",
    ask: [
      "What did your monthly reporting package contain, and who read it?",
      "Have you done consolidations? Multi-entity, foreign currency, intercompany eliminations?",
      "What reporting basis — US GAAP, IFRS, tax basis?"
    ],
    listen: "Specific outputs and audiences, consolidation mechanics (FX translation, eliminations), and the system used.",
    red: "Ran a report someone else built; can't explain an elimination entry.",
    capture: [
      { id: "outputs", type: "chips", label: "What they produced",
        options: ["Monthly financial statements", "Board packages", "Lender / covenant reporting", "Investor reporting", "SEC filings (10-Q / 10-K)", "Consolidated statements", "Statutory / local filings"] },
      { id: "basis", type: "chips", label: "Reporting basis", options: ["US GAAP", "IFRS", "Cash / tax basis"] },
      { id: "consolidations", type: "radio", label: "Consolidations",
        options: ["Multi-entity with foreign currency", "Multi-entity, single currency", "Single entity only"] }
    ]
  },

  debt_capital: {
    label: "Debt, Capital & Lender Management", icon: "📜", decay: "slow",
    what: "Managing borrowing — revolvers, term loans, covenants, borrowing bases, refinancing, and lender relationships.",
    ask: [
      "What did the capital structure look like, and what did you personally manage?",
      "Walk me through a covenant calculation or borrowing base certificate you prepared.",
      "Have you been part of a refinancing or a tight-covenant situation? What happened?"
    ],
    listen: "Named facility types, covenant math, borrowing base mechanics, and lender conversations they led.",
    red: "Knows the loan exists but never touched covenants.",
    capture: [
      { id: "scope", type: "chips", label: "Responsibilities",
        options: ["Covenant compliance / reporting", "Borrowing base", "Revolver management", "Refinancing", "Fundraising", "Interest calculations", "Lender reporting"] },
      { id: "structure", type: "chips", label: "Capital structures worked with",
        options: ["Revolver / ABL", "Term loan", "Bonds", "Mezzanine", "Sponsor equity"] }
    ]
  },

  finance_team_leadership: {
    label: "Finance Team Leadership", icon: "👥", decay: "slow",
    what: "Leading accounting or finance staff — reviewing work, developing people, hiring, and fixing a struggling team.",
    ask: [
      "How big was your team, and what roles reported to you?",
      "Tell me about someone you developed — where were they when you started and where did they end up?",
      "Tell me about a time you had to fix a team — turnover, poor performance, or a restructure."
    ],
    listen: "Team size and composition, a development story, a performance-management story, and how much they still do hands-on.",
    red: "'Managed' people who didn't report to them; no hiring or tough-conversation experience.",
    capture: [
      { id: "size", type: "select", label: "Largest team led", options: ["None", "1–3", "4–8", "9–15", "16–30", "30+"] },
      { id: "scope", type: "chips", label: "What they did",
        options: ["Reviewed work", "Coached / developed", "Hiring", "Performance management", "Workload planning", "Restructured the team"] }
    ]
  },

  ma_deals: {
    label: "M&A, Integration & Carve-Outs", icon: "🤝", decay: "slow",
    what: "Finance work on deals — diligence, exit prep, integrating an acquisition, or separating a carve-out.",
    ask: [
      "Which side of the deal were you on, and what did you own?",
      "Walk me through Day 1 — what had to be ready and what broke?",
      "For carve-outs: did you build standalone costs or manage a TSA?"
    ],
    listen: "Deal side (buy, sell, integration, carve-out), named deliverables (QoE support, opening balance sheet, TSA), and timeline pressure.",
    red: "Was at a company that got acquired, with no deal role.",
    capture: [
      { id: "scope", type: "chips", label: "Deal work",
        options: ["Buy-side diligence", "Sell-side / exit prep", "Acquisition integration", "Carve-out / divestiture", "Valuation", "Chart of accounts harmonization", "Opening balance sheet", "TSA management", "Standalone cost modeling", "Day-1 readiness"] },
      { id: "deals", type: "select", label: "Deals worked", options: ["1", "2–3", "4–6", "7+"] }
    ]
  },

  controls_audit: {
    label: "Internal Controls & External Audit", icon: "🛡️", decay: "slow",
    what: "Designing and running financial controls, SOX compliance, and managing the external audit.",
    ask: [
      "Walk me through the last external audit you managed — the PBC list, the timeline, and the toughest finding.",
      "Have you worked in a SOX environment? Did you own controls or test them?",
      "Tell me about a deficiency you remediated."
    ],
    listen: "Owned the audit relationship, SOX control ownership, a remediation with root cause, and audit-firm names.",
    red: "Pulled PBC items only; never owned a control; no remediation story.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["Managed the external audit", "Prepared PBC schedules", "SOX compliance", "Designed / documented controls", "Remediated deficiencies", "Policy writing"] },
      { id: "sox", type: "radio", label: "SOX environment", options: ["Public / SOX", "SOX-like (PE / pre-IPO)", "No formal SOX"] }
    ]
  },

  /* ---------------- accounting operations ---------------- */

  month_end_close: {
    label: "Month-End Close", icon: "📅", decay: "slow",
    what: "Closing the books each month — journal entries, accruals, reconciliations, review, and sign-off.",
    ask: [
      "Walk me through your close calendar — what happened on day 1, day 3, day 5?",
      "What did you personally prepare versus review?",
      "What's the fastest close you ran, and what did you change to get there?"
    ],
    listen: "A day-by-day sequence, named accruals and reconciliations, preparer/reviewer clarity, and close-time numbers.",
    red: "Can't describe the sequence; everything is 'we' with no personal ownership.",
    capture: [
      { id: "role", type: "radio", label: "Their role in the close",
        options: ["Owned and ran the close", "Reviewed and approved", "Hands-on preparer", "Player-coach"] },
      { id: "duration", type: "select", label: "Close duration they ran", options: CLOSE_DAYS },
      { id: "areas", type: "chips", label: "Close areas handled",
        options: ["Journal entries", "Account reconciliations", "Accruals", "Revenue", "Payroll", "Fixed assets", "Inventory", "Intercompany"] }
    ]
  },

  tech_accounting_gaap: {
    label: "Technical Accounting (GAAP)", icon: "📐", decay: "slow",
    what: "Applying accounting standards to real transactions — revenue, leases, stock comp, business combinations.",
    ask: [
      "Which standards have you applied hands-on? Walk me through the most complex one.",
      "Have you written a technical memo? What was the conclusion and did the auditors agree?"
    ],
    listen: "ASC numbers used correctly, a specific arrangement they analyzed, and memo experience.",
    red: "Knows the ASC numbers but no applied example.",
    capture: [
      { id: "areas", type: "chips", label: "Standards applied",
        options: ["Revenue (ASC 606)", "Leases (ASC 842)", "Stock comp (ASC 718)", "Business combinations (ASC 805)", "Impairment", "Derivatives / hedging", "Income taxes (ASC 740)", "Inventory costing", "Accruals / estimates"] },
      { id: "memos", type: "radio", label: "Wrote technical memos?", options: ["Yes, regularly", "Occasionally", "No"] }
    ]
  },

  transactional_accounting: {
    label: "AP / AR & Transactional Accounting", icon: "🔁", decay: "slow",
    what: "The day-to-day transactions — payables, receivables, payroll, fixed assets, billing.",
    ask: [
      "Which transactional areas did you run or oversee, and at what volume?",
      "Tell me about a process you fixed — duplicate payments, slow collections, billing errors."
    ],
    listen: "Volumes, controls (three-way match, approvals), and a concrete fix.",
    red: "Only oversight at a distance.",
    capture: [
      { id: "scope", type: "chips", label: "Areas",
        options: ["Accounts payable", "Accounts receivable / collections", "Payroll", "Fixed assets", "Inventory", "Expense reporting", "Billing"] },
      { id: "hands_on", type: "radio", label: "Level", options: ["Hands-on", "Oversight", "Both"] }
    ]
  },

  reconciliations: {
    label: "Reconciliations & Cleanup", icon: "🧾", decay: "slow",
    what: "Keeping balance-sheet accounts reconciled — and cleaning up the backlog when they aren't.",
    ask: [
      "Have you inherited a reconciliation backlog? How far behind, and how did you catch up?",
      "Which accounts were hardest to reconcile, and why?"
    ],
    listen: "Backlog size and a catch-up plan, hard accounts (intercompany, suspense), and root causes fixed.",
    red: "Only bank recs.",
    capture: [
      { id: "accounts", type: "chips", label: "Reconciliations done",
        options: ["Bank", "Balance sheet", "Intercompany", "Inventory", "Payroll", "Prepaid / accrual", "Suspense / clearing"] },
      { id: "cleanup", type: "radio", label: "Cleaned up a backlog?", options: ["Yes — significant", "Some", "No"] }
    ]
  },

  finance_process_improvement: {
    label: "Finance Process Improvement", icon: "⚡", decay: "slow",
    what: "Making finance work better — automating manual steps, documenting procedures, standardizing, and rebuilding models.",
    ask: [
      "Tell me about a manual process you automated or redesigned. What was the before and after?",
      "Did you use a method — Lean, Six Sigma, process mapping?"
    ],
    listen: "Measured before/after (hours, days, errors), tooling, and a named method if claimed.",
    red: "'Improved processes' with no example or measure.",
    capture: [
      { id: "scope", type: "chips", label: "Improvements delivered",
        options: ["Automated manual work", "Documented procedures", "Standardized the close", "Rebuilt models / templates", "System optimization", "Improved forecast accuracy"] },
      { id: "methodology", type: "chips", label: "Methods used",
        options: ["Lean / Six Sigma", "Process mapping (BPMN)", "RPA / automation", "Benchmarking", "No formal method"] },
      { id: "result", type: "text", label: "Best measurable result", placeholder: "e.g., cut close from 10 to 6 days" }
    ]
  },

  close_acceleration: {
    label: "Close Acceleration", icon: "⏱️", decay: "slow",
    what: "Compressing the close — redesigning tasks, automation, pre-close work, materiality, and roles.",
    ask: [
      "What was the close duration before and after your work, and what were the levers?",
      "What got pushed into pre-close, and what did you stop doing?"
    ],
    listen: "Before/after days, specific levers, and structural changes rather than working harder.",
    red: "Faster close achieved by overtime.",
    capture: [
      { id: "levers", type: "chips", label: "Levers used",
        options: ["Task standardization", "Automation / tooling", "Pre-close activities", "Materiality thresholds", "Reconciliation redesign", "Org / role changes", "System configuration"] },
      { id: "result", type: "text", label: "Before → after", placeholder: "e.g., 12 days → 6 days" }
    ]
  },

  /* ---------------- technical accounting / SEC ---------------- */

  ipo_readiness: {
    label: "IPO Readiness", icon: "🔔", decay: "slow",
    what: "Getting a private company to public-company standard — S-1, audited financials, SOX readiness, close calendar.",
    ask: [
      "Which IPO(s) have you worked on, and what stage were you involved at?",
      "What did you own in the S-1 — financials, MD&A, carve-out or predecessor statements?",
      "What broke under the deadline, and how did you handle it?"
    ],
    listen: "Named deals or stages, S-1 sections owned, comfort letter support, and deadline stories.",
    red: "Worked at a company that later went public.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["S-1 / registration statement", "Carve-out or predecessor financials", "3-year audited financials", "SOX readiness", "Public-company close calendar", "Segment reporting", "EPS / capitalization", "MD&A drafting", "Comfort letter support"] },
      { id: "ipos", type: "select", label: "IPOs worked", options: ["1", "2–3", "4+"] }
    ]
  },

  revenue_recognition: {
    label: "Revenue Recognition (ASC 606)", icon: "💵", decay: "slow",
    what: "Applying ASC 606 to complex contracts — performance obligations, variable consideration, SSP.",
    ask: [
      "Walk me through the most complex revenue arrangement you analyzed. What were the performance obligations?",
      "How did you determine standalone selling price?",
      "Did you implement 606 or remediate a revenue error?"
    ],
    listen: "The five-step model applied to a real contract, SSP methodology, and principal-vs-agent or modification analysis.",
    red: "Recites the five steps with no applied example.",
    capture: [
      { id: "complexity", type: "chips", label: "Complexity handled",
        options: ["Multiple performance obligations", "Variable consideration", "Principal vs. agent", "Contract modifications", "Licensing / IP", "Percentage of completion", "SaaS / subscription", "Standalone selling price"] },
      { id: "mandate", type: "chips", label: "Work done",
        options: ["Implemented ASC 606", "Reviewed existing policy", "Wrote contract memos", "Remediated an error"] }
    ]
  },

  restatements: {
    label: "Restatements & Error Remediation", icon: "🚨", decay: "slow",
    what: "Fixing material errors — root cause, restating prior periods, remediating controls, and working with auditors.",
    ask: [
      "Tell me about a restatement or material weakness you worked. What was the error and what was your role?",
      "How did you find the root cause, and what control fixed it?"
    ],
    listen: "Severity (material weakness vs deficiency), root-cause method, and auditor/audit-committee communication.",
    red: "Only heard about it.",
    capture: [
      { id: "severity", type: "chips", label: "Severity handled",
        options: ["Material weakness / restatement", "Significant deficiency", "Out-of-period adjustment", "Investigation"] },
      { id: "scope", type: "chips", label: "What they did",
        options: ["Root cause analysis", "Restated prior periods", "Remediated controls", "Auditor communication", "SEC correspondence"] }
    ]
  },

  complex_transactions: {
    label: "Complex Transactions", icon: "🧩", decay: "slow",
    what: "Accounting for unusual events — acquisitions, purchase price allocation, impairment, equity, derivatives.",
    ask: [
      "Walk me through a purchase price allocation or impairment test you worked on.",
      "Which complex transaction are you proudest of getting right?"
    ],
    listen: "Specific standards, valuation-firm coordination, and journal entries they supported.",
    red: "Can name topics but not walk through one.",
    capture: [
      { id: "areas", type: "chips", label: "Transactions",
        options: ["Business combinations (ASC 805)", "Purchase price allocation", "Goodwill / impairment", "Equity & stock comp", "Debt / derivatives (ASC 815)", "Leases (ASC 842)", "Discontinued operations", "Variable interest entities"] }
    ]
  },

  sec_reporting: {
    label: "SEC Reporting", icon: "📄", decay: "slow",
    what: "Preparing periodic SEC filings — 10-K, 10-Q, 8-K — usually in Workiva.",
    ask: [
      "Which filings have you owned, and what was your role on the last 10-K?",
      "Which tool did you file in, and what did you personally draft?"
    ],
    listen: "Filing ownership, Workiva fluency, sections drafted (MD&A, footnotes), and XBRL awareness.",
    red: "Pulled numbers for someone else's filing.",
    capture: [
      { id: "filings", type: "chips", label: "Filings", options: ["10-K", "10-Q", "8-K", "S-1 / S-4", "Proxy", "XBRL tagging"] },
      { id: "role", type: "radio", label: "Their role", options: ["Owned the filing process", "Prepared sections", "Reviewed", "Supported"] },
      { id: "tools", type: "chips", label: "Tools", options: ["Workiva", "Active Disclosure", "Certent", "Excel / Word"] }
    ]
  },

  accounting_policy: {
    label: "Accounting Policy & Documentation", icon: "📚", decay: "slow",
    what: "Writing the accounting rulebook — policy manuals, technical memos, position papers.",
    ask: [
      "What policies or memos have you written, and who used them?",
      "How did you keep documentation current?"
    ],
    listen: "Named documents and their audience, and a maintenance process.",
    red: "Edited a template once.",
    capture: [
      { id: "scope", type: "chips", label: "Documentation written",
        options: ["Accounting policy manual", "Technical memos", "Position papers", "Whitepapers for auditors", "Training the team"] }
    ]
  },

  auditor_interaction: {
    label: "Auditor Interaction", icon: "🔍", decay: "slow",
    what: "Defending accounting positions to the audit firm — inquiries, negotiations, national office consultations.",
    ask: [
      "Tell me about a position you had to defend to the auditors. How did it end?",
      "Which firms have you worked with or for?"
    ],
    listen: "A contested position with a resolution, and audit-firm background.",
    red: "Only delivered PBC items.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["Presented positions to auditors", "Responded to audit inquiries", "Negotiated adjustments", "Coordinated PBC delivery", "National office consultations"] },
      { id: "firm", type: "text", label: "Audit firms", placeholder: "e.g., EY (audit alum), Deloitte as auditor" }
    ]
  },

  ifrs: {
    label: "IFRS & Multi-GAAP", icon: "🌍", decay: "slow",
    what: "Reporting under IFRS or more than one framework — conversions, dual reporting, local statutory.",
    ask: [
      "Where have you reported under IFRS, and what were the main GAAP differences you handled?",
      "Have you converted between frameworks?"
    ],
    listen: "Specific US GAAP/IFRS differences handled, jurisdictions, and group reporting packages.",
    red: "IFRS listed on the résumé with no example.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["IFRS conversion", "Dual reporting (US GAAP + IFRS)", "Local statutory GAAP", "Group reporting packages"] },
      { id: "countries", type: "text", label: "Jurisdictions", placeholder: "e.g., UK, Germany, Brazil" }
    ]
  },

  /* ---------------- tax ---------------- */

  tax_provision: {
    label: "Tax Provision (ASC 740)", icon: "📊", decay: "slow",
    what: "Calculating income tax for the financial statements — current and deferred tax, valuation allowances, uncertain positions.",
    ask: [
      "Did you prepare the provision yourself or review it? Quarterly or annual?",
      "Walk me through a deferred tax item or valuation allowance judgment you made."
    ],
    listen: "Preparer vs reviewer, quarterly public-company experience, and deferred tax mechanics.",
    red: "Supported schedules only.",
    capture: [
      { id: "role", type: "radio", label: "Their role", options: ["Owned and prepared the provision", "Reviewed the provision", "Supported / schedules only"] },
      { id: "complexity", type: "chips", label: "Complexity handled",
        options: ["Valuation allowance", "Uncertain tax positions (FIN 48)", "Multi-jurisdiction", "Stock comp", "NOLs", "Purchase accounting"] },
      { id: "frequency", type: "radio", label: "Frequency", options: ["Quarterly (public)", "Annual", "Both"] }
    ]
  },

  income_tax: {
    label: "Income Tax Compliance", icon: "📄", decay: "slow",
    what: "Preparing and reviewing income tax returns — federal, state, partnership.",
    ask: [
      "Which returns have you prepared or reviewed, and how many states?",
      "Did you prepare in-house or manage an outside firm?"
    ],
    listen: "Return types, state footprint, and preparer/reviewer role.",
    red: "Individual returns only (for a corporate role).",
    capture: [
      { id: "scope", type: "chips", label: "Returns",
        options: ["Federal corporate (1120)", "State / multistate", "Partnership (1065)", "S-corp", "Consolidated returns"] },
      { id: "role", type: "radio", label: "Their role", options: ["Prepared returns", "Reviewed returns", "Managed an outside firm"] }
    ]
  },

  indirect_tax: {
    label: "Indirect Tax (Sales & Use)", icon: "🏷️", decay: "slow",
    what: "Sales and use tax, VAT/GST, nexus, and tax engines.",
    ask: [
      "Have you done a nexus study? What came out of it?",
      "Which tax engine did you run, and how was it configured?"
    ],
    listen: "Post-Wayfair nexus work, registrations, exemption certificates, and engine configuration.",
    red: "Filed returns someone else calculated.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Sales & use tax", "Nexus analysis", "Exemption certificates", "VAT / GST", "Property tax", "Excise"] },
      { id: "engines", type: "chips", label: "Tax engines", options: ["Avalara", "Vertex", "Sovos", "Manual / in-house"] }
    ]
  },

  international_tax: {
    label: "International Tax", icon: "🌍", decay: "slow",
    what: "Cross-border tax — GILTI, Subpart F, foreign tax credits, transfer pricing, Pillar Two.",
    ask: [
      "Which international provisions have you calculated hands-on?",
      "Have you done transfer pricing yourself or worked with a TP team?"
    ],
    listen: "Specific computations (GILTI, FTC), countries, and TP depth.",
    red: "Generalist claiming TP without a study.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["GILTI / Subpart F", "Transfer pricing", "Foreign tax credits", "Treaty analysis", "Local country filings", "Pillar Two"] }
    ]
  },

  tax_planning: {
    label: "Tax Planning & Strategy", icon: "♟️", decay: "slow",
    what: "Structuring to lower tax legitimately — ETR management, entity structure, credits, M&A tax.",
    ask: [
      "Tell me about a planning idea you brought forward. What did it save?",
      "How much of your time was planning versus compliance?"
    ],
    listen: "A quantified saving and a clear planning-to-compliance split.",
    red: "No planning examples.",
    capture: [
      { id: "scope", type: "chips", label: "Planning work",
        options: ["Effective tax rate management", "Entity structuring", "M&A tax", "Credits & incentives (R&D)", "State planning"] }
    ]
  },

  tax_controversy: {
    label: "Tax Audits & Controversy", icon: "⚖️", decay: "slow",
    what: "Defending the company in tax audits — IDRs, negotiations, settlements.",
    ask: [
      "Tell me about a tax audit you defended. What was at stake and how did it end?"
    ],
    listen: "Audit type (IRS, state, foreign), their role, and the outcome.",
    red: "Answered a notice once.",
    capture: [
      { id: "scope", type: "chips", label: "Audits handled", options: ["IRS", "State", "Foreign"] },
      { id: "role", type: "chips", label: "Their role", options: ["Responded to IDRs", "Led the defense", "Supported outside counsel", "Negotiated settlements"] }
    ]
  },

  /* ---------------- treasury ---------------- */

  cash_management: {
    label: "Cash Management", icon: "💵", decay: "slow",
    what: "Daily cash operations — positioning, wires, funding accounts, sweeps, intercompany transfers.",
    ask: [
      "Walk me through your morning cash routine. How many accounts and entities?",
      "Have you worked with multiple currencies?"
    ],
    listen: "Daily positioning steps, account/entity counts, and FX exposure.",
    red: "Released wires someone else set up.",
    capture: [
      { id: "scope", type: "chips", label: "Daily work",
        options: ["Cash positioning", "Wire / ACH processing", "Account funding", "Concentration / sweeps", "Intercompany transfers", "Bank reconciliation"] },
      { id: "currencies", type: "radio", label: "Currencies", options: ["Multi-currency", "Single currency"] }
    ]
  },

  cash_forecasting: {
    label: "Cash Forecasting", icon: "📉", decay: "slow",
    what: "Predicting cash in and out — 13-week forecasts, rolling forecasts, direct and indirect methods.",
    ask: [
      "Walk me through the 13-week (or equivalent) forecast you built. What drove the receipts line?",
      "How accurate was it, and how did you improve it?",
      "Have you forecast cash in a tight or distressed situation?"
    ],
    listen: "Receipts and disbursement drivers, variance tracking, and a pressure situation.",
    red: "Updated a template monthly.",
    capture: [
      { id: "horizon", type: "chips", label: "Horizons built", options: ["Daily / weekly", "13-week", "Monthly", "Annual", "Rolling"] },
      { id: "situation", type: "radio", label: "Hardest situation", options: ["Tight / distressed", "Adequate", "Strong / excess cash"] }
    ]
  },

  banking_relationships: {
    label: "Banking Relationships", icon: "🏦", decay: "slow",
    what: "Managing banks — accounts, fees, KYC, and bank selection.",
    ask: [
      "Which banks did you manage, and what did you negotiate with them?",
      "Have you run a bank RFP or fee analysis?"
    ],
    listen: "Named banks, fee savings, and account rationalization.",
    red: "Only opened accounts.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Bank relationship management", "Account opening / closing", "Bank fee analysis", "KYC / documentation", "RFPs / bank selection"] }
    ]
  },

  fx_risk: {
    label: "FX & Interest Rate Risk", icon: "📐", decay: "slow",
    what: "Hedging currency, interest, or commodity exposure — and the hedge accounting behind it.",
    ask: [
      "Which exposures did you hedge, with which instruments?",
      "Have you done hedge accounting (ASC 815) documentation?"
    ],
    listen: "Exposure analysis, instruments used, and hedge accounting depth.",
    red: "Knows the terms only.",
    capture: [
      { id: "scope", type: "chips", label: "Risk work",
        options: ["FX hedging", "Interest rate hedging", "Commodity hedging", "Exposure analysis", "Hedge accounting (ASC 815)"] },
      { id: "instruments", type: "chips", label: "Instruments", options: ["Forwards", "Swaps", "Options", "Collars"] }
    ]
  },

  treasury_systems: {
    label: "Treasury Systems", icon: "🖥️", decay: "slow",
    what: "Treasury management systems (Kyriba, GTreasury) versus spreadsheets and bank portals.",
    ask: [
      "Which TMS did you use, and did you implement or just operate it?"
    ],
    listen: "Named TMS, implementation role, and connectivity setup.",
    red: "Excel only, presented as a system.",
    capture: [
      { id: "tms", type: "chips", label: "Treasury systems",
        options: ["Kyriba", "GTreasury", "FIS / Quantum", "Coupa Treasury", "Bank portals only", "Excel only"] },
      { id: "implemented", type: "radio", label: "Implemented a TMS?", options: ["Yes", "No"] }
    ]
  },

  working_capital: {
    label: "Working Capital", icon: "🔄", decay: "slow",
    what: "Freeing up cash — DSO, DPO, inventory, supply chain finance.",
    ask: [
      "What working-capital lever did you pull, and how much cash did it release?"
    ],
    listen: "A lever with a dollar result and the metric (DSO, DPO, DIO) moved.",
    red: "Reported the metrics without changing them.",
    capture: [
      { id: "scope", type: "chips", label: "Levers",
        options: ["DSO / collections", "DPO / payment terms", "Inventory", "Supply chain finance", "Cash conversion cycle analysis"] }
    ]
  },

  /* ---------------- internal audit ---------------- */

  sox_testing: {
    label: "SOX Testing", icon: "📋", decay: "slow",
    what: "Testing SOX controls — walkthroughs, test of design and effectiveness, deficiency evaluation, ITGCs.",
    ask: [
      "Walk me through how you tested a key control, start to finish.",
      "Have you evaluated a deficiency's severity? How?",
      "Did you test ITGCs or rely on IT auditors?"
    ],
    listen: "Design vs operating effectiveness, sampling, deficiency evaluation, and ITGC exposure.",
    red: "Only filled in test templates.",
    capture: [
      { id: "scope", type: "chips", label: "SOX work",
        options: ["Walkthroughs", "Control testing", "Documentation / narratives", "Deficiency evaluation", "Scoping / risk assessment", "PCAOB / external auditor coordination", "ITGC testing"] },
      { id: "maturity", type: "chips", label: "Program situations",
        options: ["Established program", "Built out a program", "First-year compliance", "Pre-IPO readiness"] }
    ]
  },

  operational_audit: {
    label: "Operational Audits", icon: "🏭", decay: "slow",
    what: "Auditing processes beyond financial controls — procurement, inventory, payroll, IT, compliance.",
    ask: [
      "Tell me about an operational audit that found something important. What changed?"
    ],
    listen: "Area audited, finding, and business impact.",
    red: "Only SOX.",
    capture: [
      { id: "areas", type: "chips", label: "Areas audited",
        options: ["Procurement", "Inventory / supply chain", "Revenue cycle", "Payroll / HR", "IT", "Treasury", "Compliance"] }
    ]
  },

  audit_planning: {
    label: "Risk Assessment & Audit Planning", icon: "🎲", decay: "slow",
    what: "Building the annual audit plan from a risk assessment.",
    ask: [
      "Did you build the audit plan or execute one? How were risks ranked?"
    ],
    listen: "Risk assessment method and plan ownership.",
    red: "Executed assigned audits only.",
    capture: [
      { id: "role", type: "radio", label: "Their role", options: ["Built the annual plan", "Contributed to planning", "Executed an existing plan"] },
      { id: "framework", type: "chips", label: "Frameworks", options: ["COSO", "COBIT", "IIA standards", "ERM", "NIST"] }
    ]
  },

  audit_reporting: {
    label: "Audit Reporting & Audit Committee", icon: "📢", decay: "slow",
    what: "Writing audit reports and presenting findings to management and the audit committee.",
    ask: [
      "Have you presented to an audit committee? What was the finding and how was it received?",
      "Did you write final reports or draft findings?"
    ],
    listen: "Audit committee exposure and report ownership.",
    red: "Supported documentation only.",
    capture: [
      { id: "audience", type: "chips", label: "Audiences", options: ["Audit committee", "CFO / CAE", "Process owners", "External auditors", "Board"] },
      { id: "writing", type: "radio", label: "Report writing", options: ["Wrote final reports", "Drafted findings", "Supported documentation"] }
    ]
  },

  remediation: {
    label: "Remediation & Follow-Up", icon: "🔧", decay: "slow",
    what: "Fixing findings — designing new controls, retesting, and advising process owners.",
    ask: [
      "Tell me about a finding you helped remediate. What control replaced it?"
    ],
    listen: "Root cause, new control design, and retest results.",
    red: "Tracked remediation in a spreadsheet only.",
    capture: [
      { id: "scope", type: "chips", label: "Work done", options: ["Tracked remediation", "Designed new controls", "Retested", "Advised process owners"] },
      { id: "severity", type: "radio", label: "Most serious state handled", options: ["Material weaknesses", "Significant deficiencies", "Minor findings"] }
    ]
  },

  audit_analytics: {
    label: "Audit Data Analytics", icon: "📉", decay: "fast",
    what: "Using data tools to audit whole populations — ACL, IDEA, Alteryx, SQL.",
    ask: [
      "Describe an analytic you built that found something sampling would have missed."
    ],
    listen: "Full-population testing with a real finding and named tools.",
    red: "Excel filters only.",
    capture: [
      { id: "tools", type: "chips", label: "Tools", options: ["ACL / Galvanize", "IDEA", "Alteryx", "Power BI", "SQL", "Python"] },
      { id: "scope", type: "chips", label: "Uses", options: ["Full-population testing", "Continuous monitoring", "Fraud analytics", "Sampling"] }
    ]
  },

  /* ---------------- compliance / risk ---------------- */

  regulatory_compliance: {
    label: "Regulatory Compliance", icon: "📜", decay: "slow",
    what: "Knowing and applying the regulations that govern an industry — BSA/AML, HIPAA, SEC/FINRA, GDPR, FCPA.",
    ask: [
      "Which regulatory regime do you know best, and in what kind of institution?",
      "Have you faced a regulatory exam directly? What did the examiners focus on?"
    ],
    listen: "One regime deeply, the institution type, and direct exam experience.",
    red: "Generic compliance vocabulary with no regime.",
    capture: [
      { id: "regimes", type: "chips", label: "Regulations",
        options: ["SOX", "BSA / AML", "SEC / FINRA", "HIPAA", "GDPR / privacy", "FCPA / anti-bribery", "OSHA / safety", "Government contracting (FAR / DFARS)", "Banking (OCC / FDIC / Fed)", "Insurance"] },
      { id: "exams", type: "radio", label: "Faced regulatory exams?", options: ["Yes — regularly", "Occasionally", "No"] }
    ]
  },

  policy_procedure: {
    label: "Policy & Procedure", icon: "📝", decay: "slow",
    what: "Writing and maintaining compliance policies, and mapping them to regulations.",
    ask: [
      "Have you built a compliance program from scratch or maintained one? What did you write?"
    ],
    listen: "Build vs maintain, specific policies, and regulatory mapping.",
    red: "Updated dates on existing policies.",
    capture: [
      { id: "scope", type: "chips", label: "Work done", options: ["Wrote policies", "Updated / maintained", "Enforced", "Gap assessment", "Mapped to regulations", "Built a program from scratch"] }
    ]
  },

  compliance_monitoring: {
    label: "Compliance Monitoring & Testing", icon: "📡", decay: "slow",
    what: "Verifying compliance — transaction monitoring, testing, issue tracking.",
    ask: [
      "How did you test compliance, and how often? What happened when you found an issue?"
    ],
    listen: "Testing cadence, issue management, and committee reporting.",
    red: "Monitoring means reviewing alerts only.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Transaction monitoring", "Compliance testing", "Issue tracking", "Root cause analysis", "Reporting to committees"] }
    ]
  },

  erm: {
    label: "Enterprise Risk Management", icon: "🎲", decay: "slow",
    what: "Company-wide risk work — risk registers, vendor risk, business continuity, risk appetite.",
    ask: [
      "Walk me through the risk assessment you ran. How did the top risks get chosen and who acted on them?"
    ],
    listen: "A risk taxonomy, scoring method, and executive follow-through.",
    red: "A risk register nobody read.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Risk assessments", "Risk register / taxonomy", "Third-party / vendor risk", "Business continuity", "Operational risk", "Risk appetite framework"] },
      { id: "framework", type: "chips", label: "Frameworks", options: ["COSO ERM", "ISO 31000", "NIST", "Basel"] }
    ]
  },

  compliance_training: {
    label: "Compliance Training & Culture", icon: "🎓", decay: "slow",
    what: "Employee-facing compliance — training content, delivery, and awareness.",
    ask: [
      "What training did you build or deliver, and how did you measure it worked?"
    ],
    listen: "Content built, completion and effectiveness measures.",
    red: "Assigned vendor courses only.",
    capture: [
      { id: "scope", type: "chips", label: "Work done", options: ["Built training content", "Delivered training", "Tracked completion", "Awareness campaigns", "Code of conduct"] }
    ]
  },

  investigations: {
    label: "Investigations & Financial Crime", icon: "🔎", decay: "slow",
    what: "Handling issues when they surface — internal investigations, hotline, SAR filing.",
    ask: [
      "Walk me through an investigation you ran, start to finish.",
      "Have you written SARs?"
    ],
    listen: "Investigation steps, documentation, legal coordination, and SAR experience.",
    red: "Forwarded hotline reports to legal.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Internal investigations", "Hotline / whistleblower", "SAR filing", "Regulatory reporting", "Coordinated with legal"] }
    ]
  },

  /* ---------------- FP&A ---------------- */

  budgeting_forecasting: {
    label: "Budgeting & Forecasting", icon: "🗓️", decay: "slow",
    what: "Building the annual budget and the forecasts that update it.",
    ask: [
      "Did you own the forecast process or build your piece of it? Who gave you inputs?",
      "How accurate was your forecast, and what did you do when a department missed?"
    ],
    listen: "Process ownership, input management across departments, and accuracy with numbers.",
    red: "Consolidated submissions without challenging them.",
    capture: [
      { id: "ownership", type: "radio", label: "Their role", options: ["Owned the forecast process", "Built their piece", "Supported / consolidated"] },
      { id: "cadence", type: "chips", label: "Cadences", options: ["Annual budget", "Monthly forecast", "Quarterly reforecast", "Rolling forecast", "Long-range plan"] }
    ]
  },

  financial_modeling: {
    label: "Financial Modeling", icon: "🧮", decay: "slow",
    what: "Building models from scratch — three-statement, driver-based, scenario, valuation.",
    ask: [
      "Describe a model you built from a blank sheet. What decision did it drive?",
      "How did you structure it so someone else could use it?",
      "What's your Excel level — and do you use Power Query, VBA, or Python?"
    ],
    listen: "Built from scratch, the decision it drove, structure (inputs/calcs/outputs), and tooling.",
    red: "Updates templates; can't describe model structure.",
    capture: [
      { id: "complexity", type: "radio", label: "Modeling level", options: ["Built models from scratch", "Maintained and extended", "Updated templates"] },
      { id: "types", type: "chips", label: "Model types",
        options: ["Three-statement", "Scenario / sensitivity", "Unit economics", "Driver-based", "Valuation / DCF", "Cash flow", "LBO"] }
    ]
  },

  variance_reporting: {
    label: "Reporting & Variance Analysis", icon: "📊", decay: "slow",
    what: "Management reporting and explaining why results differ from plan.",
    ask: [
      "Give me an example where your variance analysis changed a decision."
    ],
    listen: "Insight beyond numbers, a recommendation, and a changed decision.",
    red: "Reports numbers without the 'why'.",
    capture: [
      { id: "outputs", type: "chips", label: "What they produced",
        options: ["Monthly management reporting", "Board / investor decks", "KPI dashboards", "Variance analysis", "Departmental reporting"] },
      { id: "depth", type: "radio", label: "Analysis depth", options: ["Explains the why and recommends", "Explains variances", "Reports the numbers"] }
    ]
  },

  business_partnering: {
    label: "Business Partnering", icon: "🤝", decay: "slow",
    what: "Working with operators outside finance to shape decisions.",
    ask: [
      "Which leaders did you partner with, and what did you help them decide?"
    ],
    listen: "Named functions, audience seniority, and influence on decisions.",
    red: "Sent reports to the business.",
    capture: [
      { id: "partners", type: "chips", label: "Partners",
        options: ["Sales", "Marketing", "Operations", "Engineering / R&D", "HR", "Executive team", "Business unit leaders"] },
      { id: "seniority", type: "radio", label: "Most senior audience", options: ["C-suite / board", "VP / director", "Manager level"] }
    ]
  },

  finance_bi: {
    label: "Finance Reporting & BI", icon: "📊", decay: "fast",
    what: "Building the reporting layer finance runs on — Power BI, Tableau, EPM reports, data models.",
    ask: [
      "What dashboards or reports did you build, and who used them every week?",
      "Where did the data come from, and did you build the data model yourself?",
      "Do you write SQL?"
    ],
    listen: "Adopted reports, data modeling, source systems, and SQL or Power Query.",
    red: "Formats exports from the ERP.",
    capture: [
      { id: "tools", type: "chips", label: "Tools",
        options: ["Excel (advanced)", "Power BI", "Tableau", "Hyperion / HFM", "OneStream", "Adaptive Insights", "Anaplan", "Cognos", "SQL", "Power Query"] },
      { id: "deliverables", type: "chips", label: "What they built",
        options: ["Executive dashboards", "Financial statements", "Operational KPIs", "Self-service models", "Data models / semantic layer", "Ad hoc reports"] }
    ]
  },

  specialized_analysis: {
    label: "Specialized Financial Analysis", icon: "🔬", decay: "slow",
    what: "Domain analysis — revenue/pricing, cost and margin, headcount, capex, SaaS metrics, project profitability.",
    ask: [
      "Which analysis area are you strongest in? Walk me through an example."
    ],
    listen: "Domain vocabulary (ARR/NRR, contribution margin, capex ROI) used in a real example.",
    red: "Generic answers.",
    capture: [
      { id: "areas", type: "chips", label: "Areas",
        options: ["Revenue / pricing", "Cost / margin", "Headcount planning", "Capex / ROI", "SaaS metrics (ARR, churn)", "Inventory / supply chain", "Project profitability"] }
    ]
  },

  pricing_profitability: {
    label: "Pricing & Predictive Modeling", icon: "🎯", decay: "slow",
    what: "Pricing strategy, profitability analysis, and scenario or predictive forecasting.",
    ask: [
      "Tell me about a price change you modeled and defended. What happened to margin?",
      "What scenario or statistical techniques have you used?"
    ],
    listen: "A real price action with results, elasticity thinking, and tools beyond Excel if claimed.",
    red: "Reported margin without influencing it.",
    capture: [
      { id: "scope", type: "chips", label: "Pricing work",
        options: ["Price setting / strategy", "Margin / profitability analysis", "Discounting & rebates", "Price increase modeling", "Elasticity analysis", "Customer / product profitability"] },
      { id: "predictive", type: "chips", label: "Predictive / scenario work",
        options: ["Scenario & sensitivity analysis", "Predictive forecasting", "Statistical modeling", "Monte Carlo / simulation"] }
    ]
  },

  /* ---------------- supply chain & procurement ---------------- */

  spend_analytics: {
    label: "Spend Analytics", icon: "📉", decay: "slow",
    what: "Understanding where the money goes — spend cubes, categorization, savings opportunities.",
    ask: [
      "Walk me through a spend analysis you built. How messy was the data and what did you find?"
    ],
    listen: "Data cleansing, categorization taxonomy, and quantified opportunities.",
    red: "Pivot table on AP data.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Spend cube / categorization", "Supplier rationalization", "Tail spend analysis", "Savings opportunity identification", "Benchmarking", "Contract compliance / leakage"] },
      { id: "spend", type: "select", label: "Largest spend analyzed", options: ["Under $10M", "$10M–$50M", "$50M–$250M", "$250M–$1B", "$1B+"] }
    ]
  },

  strategic_sourcing: {
    label: "Strategic Sourcing & Negotiation", icon: "🤝", decay: "slow",
    what: "Running sourcing events and negotiating with suppliers.",
    ask: [
      "Tell me about a negotiation you led. What was the category, the leverage, and the result?",
      "Direct or indirect categories?"
    ],
    listen: "Led negotiations, category strategy, should-cost thinking, and savings numbers.",
    red: "Supported someone else's negotiation.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["RFP / RFQ events", "Supplier negotiation", "Contract redlining", "Category strategy", "Supplier consolidation", "Should-cost modeling"] },
      { id: "categories", type: "chips", label: "Categories",
        options: ["Direct materials", "Indirect / MRO", "IT & telecom", "Professional services", "Logistics / freight", "Facilities", "Travel", "Marketing"] },
      { id: "authority", type: "radio", label: "Negotiating role", options: ["Led negotiations", "Supported the negotiator", "Analysis only"] }
    ]
  },

  inventory_planning: {
    label: "Inventory & Demand Planning", icon: "🏭", decay: "slow",
    what: "Optimizing inventory — E&O, safety stock, demand planning, S&OP.",
    ask: [
      "What inventory problem did you fix, and how much cash or service did it change?"
    ],
    listen: "Turns or DIO before/after, planning methods, and S&OP participation.",
    red: "Ran cycle counts only.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Inventory optimization", "Excess & obsolete analysis", "Safety stock / reorder points", "Demand planning", "S&OP process", "Inventory accounting / costing"] }
    ]
  },

  p2p_procurement_ops: {
    label: "Procure-to-Pay & Procurement Ops", icon: "🧾", decay: "slow",
    what: "The spend cycle — requisitions, POs, approvals, supplier onboarding, invoice processing, payments.",
    ask: [
      "Walk me through the P2P process you redesigned or ran. Where were the bottlenecks?",
      "Which P2P system did you implement or configure?"
    ],
    listen: "Named process steps, automation rate or cost-per-invoice, and system work.",
    red: "Processed invoices only.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Requisition / approval workflows", "Purchase orders", "Supplier onboarding", "Invoice processing", "Three-way match", "Payments", "Procurement policy", "Catalog management", "System implementation"] },
      { id: "tools", type: "chips", label: "Systems", options: ["Coupa", "Ariba", "Jaggaer", "GEP", "Bill.com", "Tipalti", "ERP-native"] }
    ]
  },

  supplier_risk: {
    label: "Supplier Risk & Performance", icon: "🛡️", decay: "slow",
    what: "Managing the supply base beyond price — risk, scorecards, ESG, continuity.",
    ask: [
      "How did you measure supplier performance, and what did you do with a failing supplier?"
    ],
    listen: "Scorecards, risk mitigation, and a single-source story.",
    red: "No performance measurement.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Supplier risk assessment", "Performance scorecards", "Diversity spend", "ESG / sustainability", "Business continuity", "Single-source mitigation"] }
    ]
  },

  cost_reduction: {
    label: "Cost Reduction Programs", icon: "✂️", decay: "slow",
    what: "Cost takeout beyond procurement — zero-based budgeting, make vs buy, outsourcing, footprint.",
    ask: [
      "What's the largest savings program you delivered, and how were savings validated in the P&L?"
    ],
    listen: "Dollar savings and finance-validated tracking.",
    red: "Savings never reached the P&L.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Cost takeout program", "Zero-based budgeting", "Make vs. buy analysis", "Outsourcing evaluation", "Footprint / logistics optimization"] },
      { id: "delivered", type: "text", label: "Largest savings delivered", placeholder: "e.g., $5M annualized" }
    ]
  },

  /* ---------------- finance transformation ---------------- */

  o2c: {
    label: "Order to Cash (O2C)", icon: "💳", decay: "slow",
    what: "The revenue cycle — order management, billing, credit, collections, cash application.",
    ask: [
      "Walk me through an O2C improvement you delivered. What happened to DSO?",
      "Did you assess, design, or implement?"
    ],
    listen: "DSO before/after, specific sub-process fixes, and mandate scope.",
    red: "Collections calls only.",
    capture: [
      { id: "scope", type: "chips", label: "Sub-processes",
        options: ["Order management", "Billing / invoicing", "Credit management", "Collections", "Cash application", "Disputes / deductions", "Revenue recognition"] },
      { id: "mandate", type: "radio", label: "How far they went", options: ["Assessed and recommended", "Designed the future state", "Implemented the change", "End to end"] }
    ]
  },

  r2r: {
    label: "Record to Report (R2R)", icon: "📗", decay: "slow",
    what: "The close-and-report cycle end to end, redesigned as a process.",
    ask: [
      "What did the R2R process look like before and after your work?"
    ],
    listen: "Documentation, controls, and structural redesign.",
    red: "Ran the close without changing it.",
    capture: [
      { id: "scope", type: "chips", label: "Sub-processes",
        options: ["Journal entries", "Reconciliations", "Intercompany", "Consolidation", "Financial reporting", "Close calendar / governance"] }
    ]
  },

  shared_services: {
    label: "Shared Services", icon: "🏢", decay: "slow",
    what: "Building or optimizing a shared-services center for AP, AR, payroll, general accounting.",
    ask: [
      "Were you building, optimizing, or migrating work into a shared-services center? What was your part?"
    ],
    listen: "Stage, functions, locations, and transition management.",
    red: "Worked in an SSC without changing it.",
    capture: [
      { id: "stage", type: "chips", label: "Stages", options: ["Built a new SSC", "Optimized an existing SSC", "Migrated work into an SSC", "Evaluated outsourcing"] },
      { id: "scope", type: "chips", label: "Functions", options: ["AP", "AR", "Payroll", "General accounting", "Travel & expense", "Master data"] }
    ]
  },

  /* ---------------- financial systems / EPM ---------------- */

  finance_system_admin: {
    label: "Finance System Administration", icon: "🔧", decay: "fast",
    what: "Day-to-day ownership of finance systems — security roles, chart of accounts, upgrades, troubleshooting.",
    ask: [
      "What did you administer, and what broke most often at month-end?",
      "How did you manage user access and upgrades?"
    ],
    listen: "Admin depth, month-end support, access control, and upgrade experience.",
    red: "Power user only.",
    capture: [
      { id: "scope", type: "chips", label: "Admin work",
        options: ["User access / security roles", "Chart of accounts maintenance", "Troubleshooting", "Month-end system support", "Upgrades / patches", "Vendor management"] },
      { id: "depth", type: "radio", label: "Depth", options: ["Full system admin", "Functional configuration", "Power user"] }
    ]
  },

  finance_automation: {
    label: "Finance Automation", icon: "⚡", decay: "fast",
    what: "Automating manual finance work — Power Automate, UiPath, Alteryx, BlackLine, VBA, Python.",
    ask: [
      "What have you automated, with which tool, and how many hours did it save?"
    ],
    listen: "A built automation with measured savings.",
    red: "Recorded a macro once.",
    capture: [
      { id: "scope", type: "chips", label: "Automated",
        options: ["Close tasks", "AP / invoice processing", "Reconciliations", "Reporting", "RPA / bots"] },
      { id: "tools", type: "chips", label: "Tools", options: ["Power Automate", "UiPath", "Alteryx", "BlackLine", "Excel VBA", "Python"] }
    ]
  },

  epm_platforms: {
    label: "EPM Platforms", icon: "🛠️", decay: "fast",
    what: "Enterprise performance management tools — Hyperion/HFM, OneStream, Anaplan, Adaptive, Planful.",
    ask: [
      "Which EPM platform have you built in, and what did you build — consolidation, planning, reporting?",
      "Were you the architect, a builder, or supporting an existing model?",
      "Certified?"
    ],
    listen: "Named platform, model builds, role, and certification.",
    red: "Loaded data into someone else's model.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms",
        options: ["Hyperion / HFM", "OneStream", "Anaplan", "Adaptive Insights", "Planful", "Vena", "SAP BPC", "Oracle EPM Cloud"] },
      { id: "scope", type: "chips", label: "Work done",
        options: ["New implementation", "Upgrade / migration", "Model build", "Consolidation build", "Planning / budgeting build", "Admin & support"] },
      { id: "role", type: "radio", label: "Their role", options: ["Lead / architect", "Built and configured", "Supported existing model", "Business SME"] }
    ]
  },

  finance_data_integration: {
    label: "Finance Data Integration & Migration", icon: "🔀", decay: "fast",
    what: "Moving and connecting financial data between systems — mapping, cleansing, conversion, validation.",
    ask: [
      "Which systems did you connect or migrate, and how did you prove the converted balances were right?"
    ],
    listen: "Reconciled conversion, mapping documents, and technical depth.",
    red: "Moved files without reconciling.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["ERP data migration", "System-to-system integration", "Data mapping", "Data cleansing", "Historical conversion", "Validation / reconciliation"] },
      { id: "technical", type: "radio", label: "Technical depth", options: ["Built pipelines (SQL / ETL)", "Configured integration tools", "Defined requirements"] }
    ]
  },

  ai_data_readiness: {
    label: "Data Readiness for AI", icon: "🤖", decay: "fast",
    what: "Getting data governed and clean enough for AI — quality, governance, master data, lineage, access.",
    ask: [
      "What did you do to make data usable for AI or analytics? What was the starting state?",
      "How did you set up data ownership and governance?"
    ],
    listen: "Data quality measures, governance roles, lineage, and a realistic view of AI use cases.",
    red: "Talks about AI models with no data foundation work.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Data quality assessment", "Data governance / ownership", "Master data management", "Taxonomy / metadata", "Data lineage & documentation", "Security & access controls", "AI use-case identification"] }
    ]
  },

  master_data: {
    label: "Master Data & Chart of Accounts", icon: "🗂️", decay: "slow",
    what: "Structural data — chart of accounts, cost centers, hierarchies, vendor and customer masters.",
    ask: [
      "Have you redesigned a chart of accounts? What drove it and what did you change?"
    ],
    listen: "Design principles, stakeholder alignment, and mapping old to new.",
    red: "Added accounts on request.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Chart of accounts redesign", "Cost center / hierarchy structure", "Vendor / customer master", "Product master", "Data standards", "Governance process"] }
    ]
  },

  advanced_analytics: {
    label: "Advanced Analytics", icon: "📈", decay: "fast",
    what: "Beyond dashboards — predictive, driver-based, and statistical models, often in Python, R, or Alteryx.",
    ask: [
      "What's a model you built beyond Excel? What did it predict and how accurate was it?"
    ],
    listen: "Tools beyond Excel, accuracy measures, and business use.",
    red: "Calls a pivot table 'advanced analytics'.",
    capture: [
      { id: "scope", type: "chips", label: "Analytics", options: ["Predictive modeling", "Scenario analysis", "Driver-based models", "Statistical analysis", "Machine learning"] },
      { id: "tools", type: "chips", label: "Tools", options: ["Python", "R", "SQL", "Alteryx", "Databricks", "Snowflake"] }
    ]
  },

  user_enablement: {
    label: "User Enablement & Training", icon: "🎓", decay: "slow",
    what: "Making a system build stick — training, documentation, runbooks, and handoff.",
    ask: [
      "How did you train users on what you built, and how did you know they adopted it?"
    ],
    listen: "Training delivered, documentation, and adoption tracking.",
    red: "Emailed a PDF.",
    capture: [
      { id: "scope", type: "chips", label: "Work done", options: ["Training delivery", "Documentation / runbooks", "Train-the-trainer", "Support handoff", "Adoption tracking"] }
    ]
  }

});
})();

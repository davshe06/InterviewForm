/* Shared skills — skills that genuinely mean the same thing across catalogs
   (project delivery, stakeholder management, ERP implementation,
   integrations). Registering them once is what lets the Role Fit step score a
   candidate against roles in every catalog: a finance PMO consultant, a
   technical PM, and a digital PM all draw on the same delivery skills.

   Skill shape (see CLAUDE.md → "Skills"):
     label, icon
     decay    — "slow" | "fast": how quickly hands-on experience goes stale
     what     — one plain-language line, for recruiters new to the skill
     ask      — questions to put to the candidate, in order
     listen   — what a strong answer includes
     red      — red flags
     capture  — structured fields recording what they actually did */
(function () {
  window.SKILLS = window.SKILLS || {};

Object.assign(window.SKILLS, {

  project_delivery: {
    label: "Project Planning & Delivery", icon: "📋", decay: "slow",
    what: "Running projects from plan to done — scope, schedule, resourcing, status, and getting it shipped.",
    ask: [
      "Walk me through the largest project you ran end to end — scope, team size, timeline, and how it landed.",
      "How did you build and maintain the plan? What did you do the week it slipped?",
      "How many projects were you running at once, and how did you keep them from colliding?"
    ],
    listen: "Concrete scope and numbers (team size, budget, dates), a named planning tool, how they re-planned when things slipped, and an honest account of what went wrong.",
    red: "Describes only attending meetings and sending status; can't say what they personally decided; every project was 'on time and on budget'.",
    capture: [
      { id: "types", type: "chips", label: "What they've delivered",
        options: ["Software product / features", "Websites / apps", "Platform / infrastructure", "Integrations / migrations", "ERP / finance systems", "Data / analytics", "Marketing campaigns", "Client / professional-services projects"] },
      { id: "concurrent", type: "select", label: "Projects run at once", options: ["1", "2–3", "4–6", "7+"] },
      { id: "largest", type: "text", label: "Largest project they ran", placeholder: "Team size, budget, duration, outcome" }
    ]
  },

  program_mgmt: {
    label: "Program / Portfolio Management", icon: "🗂️", decay: "slow",
    what: "Coordinating several related projects or teams toward one outcome — the step up from single-project PM.",
    ask: [
      "Tell me about a program with multiple workstreams — how many teams, and how did you keep dependencies aligned?",
      "How did you report program health to executives, and what did you do when two workstreams wanted the same resource?",
      "What authority did you actually have — did you own delivery, or coordinate people who reported elsewhere?"
    ],
    listen: "Number of workstreams and teams, a dependency or critical-path story, steering-committee reporting, and clarity about their decision rights.",
    red: "Every example is one team; 'program' used as a synonym for 'project'; no sense of cross-team dependencies.",
    capture: [
      { id: "authority", type: "radio", label: "Their authority",
        options: ["Owned delivery — program lead", "Managed a workstream", "Coordinated / tracked", "PMO support"] },
      { id: "teams", type: "select", label: "Teams / workstreams coordinated", options: ["2–3", "4–6", "7–10", "10+"] },
      { id: "scope", type: "chips", label: "Program scope they handled",
        options: ["Multiple related projects", "Cross-team coordination", "Portfolio governance", "Program-level roadmap", "Outcome / OKR ownership", "Steering committee"] },
      { id: "framework", type: "radio", label: "Scaled framework used", options: ["SAFe", "Scrum-of-Scrums / LeSS", "Custom / none"] }
    ]
  },

  agile_scrum: {
    label: "Agile / Scrum", icon: "🔄", decay: "slow",
    what: "Running delivery in iterations — sprints, backlogs, standups, retros — as a Scrum Master or agile PM.",
    ask: [
      "Which ceremonies did you run, and what did a typical sprint look like on your team?",
      "Tell me about a retro that actually changed how the team worked.",
      "How did you handle a stakeholder who kept adding scope mid-sprint?"
    ],
    listen: "Specifics about cadence, backlog refinement, velocity used sensibly (not as a target), and a real process change that came out of a retro.",
    red: "Recites the Scrum Guide without examples; treats agile as 'no planning'; can't describe their own role in the ceremonies.",
    capture: [
      { id: "method", type: "chips", label: "Methodologies used", options: ["Scrum", "Kanban", "SAFe / scaled agile", "Waterfall", "Hybrid"] },
      { id: "role", type: "radio", label: "Formal role they held",
        options: ["Scrum Master", "Product Owner", "Agile PM / delivery lead", "Team member only"] },
      { id: "ceremonies", type: "radio", label: "Ran the ceremonies themselves?", options: ["Yes", "Sometimes", "No"] }
    ]
  },

  stakeholder_mgmt: {
    label: "Stakeholder & Executive Management", icon: "🤝", decay: "slow",
    what: "Managing up and across — keeping executives, clients, and partner teams informed, aligned, and making decisions.",
    ask: [
      "Who was the most senior person you reported to directly, and what did you bring them each week?",
      "Tell me about a time you had to deliver bad news to an executive or client. How did you handle it?",
      "How did you get a decision out of stakeholders who disagreed?"
    ],
    listen: "Named audience levels (VP, C-suite, steering committee), a specific bad-news conversation, and a technique for forcing decisions.",
    red: "Only ever reported to their direct manager; avoids conflict stories; blames stakeholders for every problem.",
    capture: [
      { id: "audience", type: "chips", label: "Who they managed",
        options: ["Engineering / delivery teams", "Executive stakeholders", "External clients", "Cross-functional partners", "Steering committee", "Board", "Vendors / SI"] },
      { id: "seniority", type: "radio", label: "Most senior audience", options: ["Working teams", "Director level", "VP / C-suite", "Board"] },
      { id: "reporting", type: "chips", label: "Reporting they produced",
        options: ["Weekly status", "Steering committee decks", "Executive dashboards", "Ad hoc escalation"] }
    ]
  },

  budget_vendor: {
    label: "Budget & Vendor Management", icon: "💰", decay: "slow",
    what: "Owning a project budget and managing outside vendors, agencies, or offshore teams against it.",
    ask: [
      "What's the largest budget you personally owned, and how did you track burn against it?",
      "Tell me about a vendor or agency that wasn't delivering. What did you do?",
      "Did you forecast resourcing, and how did you handle running over?"
    ],
    listen: "A dollar figure they owned (not just 'the project was $X'), burn/forecast tracking, SOW or change-order experience, and a vendor-correction story.",
    red: "Budget was 'finance's job'; no vendor ever underperformed; can't name the size of what they managed.",
    capture: [
      { id: "budget", type: "select", label: "Largest budget owned", options: ["None", "Under $250k", "$250k–$1M", "$1M–$5M", "$5M–$10M", "$10M+"] },
      { id: "vendors", type: "chips", label: "Vendors / external teams managed",
        options: ["Dev shops", "Creative / marketing agencies", "Offshore teams", "Systems integrators", "Contractors / freelancers", "None"] },
      { id: "resourcing", type: "radio", label: "Forecast / allocated resources?", options: ["Yes", "Partially", "No"] }
    ]
  },

  launch_cutover: {
    label: "Testing, Launch & Cutover", icon: "🚀", decay: "slow",
    what: "Getting from build to live — UAT, go/no-go, cutover plans, and hypercare after launch.",
    ask: [
      "Walk me through a go-live you ran. What was in the cutover plan, and what went wrong on the night?",
      "How did you run UAT — who tested, how were defects triaged, and who decided go/no-go?",
      "What did hypercare look like afterwards?"
    ],
    listen: "A real cutover sequence, defect triage with severity, a go/no-go decision they influenced, and a launch-night problem they solved.",
    red: "Has only ever been on a project that 'went live' without describing the mechanics; no memory of a single defect.",
    capture: [
      { id: "scope", type: "chips", label: "What they owned",
        options: ["UAT coordination", "Test script development", "Defect triage", "Go-live / cutover planning", "Parallel run", "Hypercare / post-go-live", "Risk / issue management"] },
      { id: "launches", type: "select", label: "Go-lives they've led", options: ["1", "2–3", "4–6", "7+"] }
    ]
  },

  change_mgmt: {
    label: "Change Management & Adoption", icon: "🔁", decay: "slow",
    what: "The people side of change — communications, training, and making sure a new process or system is actually used.",
    ask: [
      "Tell me about a rollout where adoption was the hard part. How did you measure whether people were actually using it?",
      "How did you identify and handle the people resisting the change?",
      "What did your communications and training plan look like, and who delivered it?"
    ],
    listen: "Adoption metrics, a stakeholder/impact analysis, a resistance story, and a named method (Prosci/ADKAR, Kotter) applied — not just cited.",
    red: "Change management means 'sent an email and ran a training'; no measure of adoption.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["Stakeholder / impact analysis", "Communications plan", "Training strategy & delivery", "Adoption measurement", "Resistance management", "Org design / role changes"] },
      { id: "method", type: "chips", label: "Methods used", options: ["Prosci / ADKAR", "Kotter", "In-house framework", "No formal method"] },
      { id: "impact", type: "text", label: "Size of the change", placeholder: "e.g., 200 users across 3 sites" }
    ]
  },

  pmo_governance: {
    label: "PMO & Governance", icon: "🧭", decay: "slow",
    what: "The mechanics of running a program — plans, RAID logs, budget tracking, status, and governance cadence.",
    ask: [
      "What did your RAID log and status process look like on your last program?",
      "How did you set up governance — who met, how often, and what decisions did each forum make?",
      "What PM tool did you run the plan in, and how detailed was it?"
    ],
    listen: "A working cadence with named forums, a maintained RAID log, and a plan tool used at a real level of detail.",
    red: "Governance is 'weekly meetings'; can't describe how risks were escalated.",
    capture: [
      { id: "scope", type: "chips", label: "What they ran",
        options: ["Project plan / schedule", "RAID log", "Budget tracking", "Resource planning", "Vendor / SOW management", "Governance framework", "Status reporting"] },
      { id: "method", type: "radio", label: "Delivery methodology", options: ["Waterfall", "Agile", "Hybrid"] }
    ]
  },

  erp_implementation: {
    label: "ERP Implementation", icon: "🚀", decay: "slow",
    what: "Putting in or changing an ERP system (SAP, Oracle, NetSuite, Workday, Dynamics) — design, configuration, data migration, testing, go-live.",
    ask: [
      "Which system, and how many full implementations have you been through from design to go-live?",
      "What was your role — did you lead a workstream, configure the system, or act as the business SME?",
      "Tell me about the data migration. How did you validate the converted balances?"
    ],
    listen: "Named system and version, a count of full-cycle projects, phases they personally worked, and a data-conversion or cutover story with reconciliation.",
    red: "Was a user of a system someone else implemented; can't describe any phase in detail; vague on data migration.",
    capture: [
      { id: "system", type: "chips", label: "Systems implemented",
        options: ["SAP", "Oracle (EBS / Fusion)", "NetSuite", "Workday", "Microsoft Dynamics", "Sage", "Infor", "JD Edwards", "QuickBooks", "Great Plains"] },
      { id: "phases", type: "chips", label: "Phases they worked",
        options: ["Selection / RFP", "Design / blueprint", "Configuration", "Data migration", "Testing / UAT", "Go-live / hypercare", "Post-go-live optimization", "Rollout / template", "Migration (e.g., ECC → S/4)", "Support / AMS"] },
      { id: "role", type: "radio", label: "Their role",
        options: ["Led a workstream", "Functional analyst / configurer", "Technical / developer", "Business user / SME", "Project manager"] },
      { id: "count", type: "select", label: "Full-cycle implementations", options: ["1", "2–3", "4–6", "7+"] }
    ]
  },

  system_integrations: {
    label: "System Integrations", icon: "🔗", decay: "fast",
    what: "Connecting business systems — ERP, CRM, payroll, banks — through APIs, middleware, or file feeds.",
    ask: [
      "Describe an integration you built or owned. What systems, what triggered the data flow, and how were errors handled?",
      "Did you build integrations yourself, configure a connector, or write requirements for IT?",
      "What middleware or iPaaS have you used?"
    ],
    listen: "Named systems at both ends, the mechanism (API, middleware, EDI, flat file), error handling and monitoring, and their hands-on level.",
    red: "'Worked with IT on integrations' with no detail; can't say how a failed record was caught.",
    capture: [
      { id: "tech", type: "chips", label: "Integration tech used",
        options: ["REST / SOAP APIs", "Middleware (MuleSoft, Boomi, SAP PI/PO)", "iPaaS (Workato, Celigo)", "EDI", "Flat files / SFTP", "Data loaders / ETL", "Custom interfaces"] },
      { id: "systems", type: "chips", label: "Systems they connected",
        options: ["ERP", "CRM", "Payroll / HRIS", "Banking", "Expense / AP automation", "Tax engines", "Marketing platforms", "Data warehouse"] },
      { id: "depth", type: "radio", label: "Their hands-on level",
        options: ["Built integrations (API / scripting)", "Configured connectors", "Wrote requirements / coordinated IT"] }
    ]
  },

  business_analysis: {
    label: "Business Analysis & Requirements", icon: "📝", decay: "slow",
    what: "Turning what the business needs into requirements a team can build — process mapping, requirements, and testing.",
    ask: [
      "Walk me through how you gathered requirements on your last project. What did the deliverable look like?",
      "Tell me about a requirement you got wrong. How was it caught?",
      "How did you map the current and future process?"
    ],
    listen: "A named deliverable (BRD, user stories, process maps), a traceability habit, and a caught-mistake story.",
    red: "Requirements are 'what the manager said'; no documentation; never involved in testing what they specified.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["Requirements gathering", "Process mapping / redesign", "User stories", "UAT / testing", "Training / change", "Documentation"] }
    ]
  },

  finance_sme: {
    label: "Finance Subject-Matter Depth", icon: "📘", decay: "slow",
    what: "How much real accounting and finance knowledge a PM or systems person brings — the reason finance programs use finance-literate people.",
    ask: [
      "Explain in your own words what happens in a month-end close and why a system change puts it at risk.",
      "Have you worked in accounting or finance yourself, or learned it on projects?",
      "Tell me about a time your finance knowledge caught a problem the technical team missed."
    ],
    listen: "Correct close vocabulary (accruals, reconciliations, intercompany), a finance-side career stint, and a caught-problem story.",
    red: "Can't explain the close; treats finance as 'the users'.",
    capture: [
      { id: "background", type: "radio", label: "Background",
        options: ["Accountant who moved into projects / systems", "IT / PM who learned finance", "Consultant across both"] },
      { id: "depth", type: "radio", label: "Finance depth shown",
        options: ["Strong — understands the close and GAAP", "Moderate — understands finance processes", "Light"] }
    ]
  }

});
})();

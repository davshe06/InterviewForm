/* Management Resources (PTS) — finance, accounting, and business-advisory roles.
   Registers into window.FORMS. Each role lists the skills (see skills-*.js)
   a candidate for it is interviewed on; the Role Fit step scores every role
   against the candidate's depth ratings, so shared skill ids are what let a
   candidate surface for roles they weren't shortlisted for.

   Role shape (see CLAUDE.md → "Roles"):
     label, icon, tagline, about   — shown in the picker and notes rail
     opener     — the question that opens the Experience Depth step
     coach      — what separates candidates for this role, and levels within it
     certs      — certifications worth asking about
     skills     — skill ids, in interview order
     profiles   — { skills, profile }: owned/led recently across these skills
                  ⇒ "currently marketable as" this profile
     teammates  — { label, skill? }: specialists on their team; one overlapping
                  an owned skill prompts "what did you own versus them?"
     tools      — tool categories they may have used hands-on
     aiUse, aiTools, metrics, environments — chip options */
(function () {
  window.FORMS = window.FORMS || {};

const ROLES = {

  interim_cfo: {
    label: "Interim CFO / Finance Director",
    icon: "🎯",
    tagline: "Senior finance leadership on an interim basis",
    about: "An interim CFO or Finance Director steps into the top finance seat temporarily — covering a departure, a leave, or a transition, or bringing in expertise a company doesn't have yet. They own the numbers, the reporting relationships with lenders and boards, and often the fixes the last person didn't make.",
    opener: "Tell me about the last time you stepped into the top finance seat — what was the situation, and what did you fix first?",
    coach: "Situational fit decides CFO placements. Establish the situations they've actually led through (turnaround, PE hold, exit prep, growth) and whether they held real decision authority or advised someone who did.",
    certs: ["CPA", "CMA", "CFA", "MBA"],
    skills: [
      "finance_leadership",
      "financial_reporting",
      "debt_capital",
      "finance_team_leadership",
      "ma_deals",
      "erp_implementation",
      "controls_audit"
    ],
    profiles: [
      { skills: ["debt_capital", "finance_leadership"], profile: "Turnaround / restructuring CFO" },
      { skills: ["ma_deals", "finance_leadership"], profile: "Transaction-focused CFO" },
      { skills: ["financial_reporting", "controls_audit"], profile: "Technical / controls-focused CFO" },
      { skills: ["erp_implementation", "finance_team_leadership"], profile: "Transformation CFO" }
    ],
    teammates: [
      { label: "Controller", skill: "financial_reporting" },
      { label: "FP&A Lead" },
      { label: "Treasury Manager", skill: "debt_capital" },
      { label: "Accounting Manager", skill: "financial_reporting" },
      { label: "Internal Audit", skill: "controls_audit" },
      { label: "External auditors", skill: "controls_audit" }
    ],
    tools: [
      {
        id: "erp",
        label: "ERP",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "reporting",
        label: "Reporting / consolidation",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      },
      {
        id: "planning",
        label: "Planning / FP&A tools",
        options: ["Anaplan", "Adaptive Insights", "Vena", "Planful", "Excel models"]
      },
      {
        id: "treasury",
        label: "Treasury / banking",
        options: ["Kyriba", "GTreasury", "Bank portals", "Excel cash forecasts"]
      }
    ],
    aiUse: [
      "Board deck drafting",
      "Variance commentary",
      "Scenario modeling",
      "Contract / document review",
      "Meeting summaries",
      "Forecast automation",
      "Policy drafting"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Excel Copilot",
      "Power BI Copilot",
      "Anaplan / planning AI"
    ],
    metrics: [
      "EBITDA",
      "Cash flow",
      "Close cycle time",
      "Forecast accuracy",
      "Covenant compliance",
      "Audit outcome",
      "Cost savings delivered",
      "Board / sponsor satisfaction",
      "Team retention"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government"
    ]
  },

  controller: {
    label: "Controller / Assistant Controller",
    icon: "📘",
    tagline: "Close, reporting, controls, and the accounting team",
    about: "A Controller owns a company's accounting operations — making sure the books close on time and correctly, financial statements are accurate, and internal controls hold up. They typically lead the accounting team and are the main point of contact for external auditors.",
    opener: "Walk me through your current close — how many days, who does what, and which part is yours?",
    coach: "Controllers range from a hands-on player-coach at a $20M company to an oversight role at a $2B one. Pin company size, complexity (multi-entity, FX, public), and how much they prepare versus review.",
    certs: ["CPA", "CMA"],
    skills: [
      "month_end_close",
      "financial_reporting",
      "tech_accounting_gaap",
      "controls_audit",
      "finance_team_leadership",
      "transactional_accounting",
      "erp_implementation",
      "sec_reporting"
    ],
    profiles: [
      { skills: ["month_end_close", "financial_reporting"], profile: "Operational Controller" },
      { skills: ["tech_accounting_gaap", "controls_audit"], profile: "Technical Controller" },
      { skills: ["erp_implementation", "month_end_close"], profile: "Systems / transformation Controller" },
      { skills: ["finance_team_leadership", "month_end_close"], profile: "Player-coach Controller" }
    ],
    teammates: [
      { label: "Assistant Controller", skill: "month_end_close" },
      { label: "Accounting Manager", skill: "month_end_close" },
      { label: "Staff / Senior Accountants", skill: "finance_team_leadership" },
      { label: "FP&A team" },
      { label: "AP / AR clerks", skill: "transactional_accounting" },
      { label: "Internal Audit", skill: "controls_audit" },
      { label: "External auditors", skill: "controls_audit" }
    ],
    tools: [
      {
        id: "erp",
        label: "ERP",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "reporting",
        label: "Reporting / consolidation",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      },
      {
        id: "close_tools",
        label: "Close / reconciliation tools",
        options: ["BlackLine", "FloQast", "Trintech", "Excel only", "None"]
      },
      {
        id: "other_systems",
        label: "Other systems",
        options: ["Concur", "Bill.com", "Avalara", "Coupa", "ADP / payroll", "Salesforce"]
      }
    ],
    aiUse: [
      "Variance commentary",
      "Reconciliation review",
      "Technical research",
      "Policy / memo drafting",
      "Anomaly detection",
      "Close checklist automation",
      "Report drafting"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Excel Copilot",
      "BlackLine AI",
      "FloQast AI",
      "ERP-embedded AI"
    ],
    metrics: [
      "Close cycle time",
      "Audit findings",
      "Reconciliation completeness",
      "Reporting accuracy",
      "On-time filings",
      "Control deficiencies",
      "Team retention",
      "Process improvements delivered"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government"
    ]
  },

  accounting_manager: {
    label: "Accounting Manager",
    icon: "📗",
    tagline: "Hands-on close leadership and team supervision",
    about: "An Accounting Manager runs the day-to-day accounting operations — supervising staff accountants, reviewing journal entries and reconciliations, and driving the monthly close. It sits between the senior accountants doing the work and the Controller who owns the results.",
    opener: "Walk me through your close — what do you prepare yourself, and what do you review?",
    coach: "The preparer-versus-reviewer split and team size separate a true Accounting Manager from a senior accountant with the title — and from someone ready for Assistant Controller.",
    certs: ["CPA", "CMA"],
    skills: [
      "month_end_close",
      "finance_team_leadership",
      "reconciliations",
      "tech_accounting_gaap",
      "controls_audit",
      "finance_process_improvement",
      "transactional_accounting"
    ],
    profiles: [
      { skills: ["month_end_close", "finance_team_leadership"], profile: "Close-focused Accounting Manager" },
      {
        skills: ["reconciliations", "finance_process_improvement"],
        profile: "Cleanup / remediation Manager"
      },
      { skills: ["tech_accounting_gaap", "controls_audit"], profile: "Technical Accounting Manager" }
    ],
    teammates: [
      { label: "Controller", skill: "month_end_close" },
      { label: "Senior Accountants", skill: "finance_team_leadership" },
      { label: "Staff Accountants", skill: "finance_team_leadership" },
      { label: "AP / AR team", skill: "transactional_accounting" },
      { label: "Payroll", skill: "transactional_accounting" },
      { label: "External auditors", skill: "controls_audit" }
    ],
    tools: [
      {
        id: "erp",
        label: "ERP / accounting system",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "close_tools",
        label: "Close / reconciliation tools",
        options: ["BlackLine", "FloQast", "Trintech", "Excel only", "None"]
      },
      {
        id: "reporting",
        label: "Reporting",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      },
      {
        id: "other_systems",
        label: "Other systems",
        options: ["Bill.com", "Concur", "ADP / payroll", "Avalara", "Coupa"]
      }
    ],
    aiUse: [
      "Reconciliation review",
      "Variance explanations",
      "Journal entry review",
      "Documentation drafting",
      "Anomaly detection",
      "Close checklist automation"
    ],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Excel Copilot", "BlackLine AI", "FloQast AI"],
    metrics: [
      "Close cycle time",
      "Reconciliation completeness",
      "Audit adjustments",
      "Error / rework rate",
      "On-time deliverables",
      "Team development",
      "Backlog cleared"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government"
    ]
  },

  technical_accounting: {
    label: "Technical Accounting & IPO Readiness Consultant",
    icon: "📐",
    tagline: "Complex GAAP, restatements, SEC reporting, and going public",
    about: "Technical accounting consultants handle the hard, unusual accounting questions — revenue recognition on complex contracts, acquisitions, equity structures — and write the memos that support those positions to auditors. IPO readiness is a specialty within it: getting a private company's financials, controls, and reporting to public-company standard.",
    opener: "What's the most complex accounting question you've had to answer — and did the auditors agree with you?",
    coach: "Almost always Big 4-trained CPAs. Pin the standards they've applied hands-on, SEC exposure, and whether they write memos (advisory) or rebuild financials (execution).",
    certs: ["CPA", "CA / ACA (international)"],
    skills: [
      "ipo_readiness",
      "revenue_recognition",
      "restatements",
      "complex_transactions",
      "sec_reporting",
      "accounting_policy",
      "auditor_interaction",
      "ifrs"
    ],
    profiles: [
      { skills: ["ipo_readiness", "sec_reporting"], profile: "IPO readiness / SEC reporting specialist" },
      {
        skills: ["restatements", "complex_transactions"],
        profile: "Technical accounting remediation specialist"
      },
      { skills: ["revenue_recognition", "accounting_policy"], profile: "Revenue recognition specialist" },
      { skills: ["ifrs", "sec_reporting"], profile: "Multi-GAAP / international reporting specialist" }
    ],
    teammates: [
      { label: "Controller / Assistant Controller", skill: "sec_reporting" },
      { label: "SEC Reporting Manager", skill: "sec_reporting" },
      { label: "Technical Accounting Manager", skill: "complex_transactions" },
      { label: "External auditors", skill: "auditor_interaction" },
      { label: "Internal Audit / SOX", skill: "restatements" },
      { label: "Legal / securities counsel", skill: "ipo_readiness" },
      { label: "Valuation firm", skill: "complex_transactions" }
    ],
    tools: [
      {
        id: "reporting_tools",
        label: "SEC reporting tools",
        options: ["Workiva (WDesk)", "Active Disclosure", "Certent", "Excel / Word"]
      },
      {
        id: "research",
        label: "Technical research",
        options: [
          "Checkpoint",
          "PwC Viewpoint",
          "Deloitte DART",
          "EY Atlas",
          "KPMG Accounting Research Online",
          "Codification (FASB)"
        ]
      },
      {
        id: "erp",
        label: "ERP / consolidation",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "close_tools",
        label: "Close / controls tools",
        options: ["BlackLine", "FloQast", "AuditBoard", "Workiva"]
      }
    ],
    aiUse: [
      "Technical research",
      "Memo drafting",
      "Contract review at volume",
      "Policy drafting",
      "Disclosure checklist review",
      "Filing preparation",
      "Precedent search"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Checkpoint Edge AI",
      "Workiva AI",
      "PwC Viewpoint AI",
      "Excel Copilot"
    ],
    metrics: [
      "On-time filings",
      "Audit adjustments",
      "Material weaknesses remediated",
      "Memo turnaround",
      "Restatement completion",
      "IPO milestone readiness",
      "Auditor acceptance of positions"
    ],
    environments: [
      "Big 4 audit",
      "Big 4 technical accounting / national office",
      "SEC reporting function",
      "Public company",
      "Pre-IPO / recently public",
      "Transaction services"
    ]
  },

  tax_manager: {
    label: "Tax Manager / Director",
    icon: "🧾",
    tagline: "Provision, compliance, planning, and audits",
    about: "Tax professionals handle a company's tax obligations — preparing or reviewing returns, calculating the tax provision that flows into financial statements, and planning to legally minimize tax. Specialties diverge sharply: income tax, sales and use, international, and transfer pricing are largely different careers.",
    opener: "What does your tax year look like — which returns, the provision, and how much is planning versus compliance?",
    coach: "Income, indirect, and international tax are different careers. Establish the specialty first, then provision ownership and whether they prepare or review.",
    certs: ["CPA", "EA", "JD / LLM in Tax", "MST"],
    skills: ["tax_provision", "income_tax", "indirect_tax", "international_tax", "tax_planning", "tax_controversy"],
    profiles: [
      { skills: ["tax_provision", "income_tax"], profile: "Corporate income tax manager" },
      { skills: ["indirect_tax"], profile: "Indirect / sales & use tax specialist" },
      { skills: ["international_tax", "tax_planning"], profile: "International tax specialist" },
      { skills: ["tax_controversy", "income_tax"], profile: "Tax controversy specialist" }
    ],
    teammates: [
      { label: "Tax Director / VP Tax", skill: "tax_planning" },
      { label: "Tax Analysts / Seniors", skill: "income_tax" },
      { label: "Sales & Use Tax Specialist", skill: "indirect_tax" },
      { label: "International Tax Specialist", skill: "international_tax" },
      { label: "Outside tax firm", skill: "income_tax" },
      { label: "Controller / accounting team", skill: "tax_provision" }
    ],
    tools: [
      {
        id: "tax_software",
        label: "Tax compliance software",
        options: ["OneSource", "Corptax", "GoSystem", "CCH Axcess", "Lacerte", "UltraTax"]
      },
      {
        id: "provision_tools",
        label: "Provision tools",
        options: ["OneSource Tax Provision", "Corptax Provision", "Longview", "Excel"]
      },
      {
        id: "indirect_tools",
        label: "Indirect tax engines",
        options: ["Avalara", "Vertex", "Sovos", "Manual"]
      },
      {
        id: "erp",
        label: "ERP",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "research",
        label: "Research tools",
        options: ["Checkpoint", "Bloomberg BNA", "CCH IntelliConnect", "LexisNexis"]
      }
    ],
    aiUse: [
      "Tax research",
      "Return review",
      "Nexus analysis",
      "Memo drafting",
      "Data extraction",
      "Provision automation",
      "Notice response drafting"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Checkpoint Edge AI",
      "Blue J Tax",
      "Excel Copilot",
      "Avalara AI"
    ],
    metrics: [
      "On-time filings",
      "Effective tax rate",
      "Provision accuracy",
      "Audit outcomes",
      "Penalties avoided",
      "Tax savings identified",
      "Compliance penalties",
      "Return review cycle time"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Big 4 tax",
      "Regional tax firm",
      "Multinational corporate tax"
    ]
  },

  treasury: {
    label: "Treasury Analyst / Manager",
    icon: "🏦",
    tagline: "Cash management, forecasting, debt, and banking",
    about: "Treasury manages a company's actual cash — forecasting what's coming in and out, moving money between accounts and entities, managing bank relationships and debt, and hedging currency or interest-rate risk. When cash is tight, treasury becomes the most important function in the building.",
    opener: "Walk me through a normal day in treasury for you, starting with the morning cash position.",
    coach: "Operational treasury (positioning, wires) and strategic treasury (debt, hedging) are different levels. Establish entity and currency complexity, and whether they've managed lenders or hedges.",
    certs: ["CTP", "CPA", "CFA"],
    skills: [
      "cash_management",
      "cash_forecasting",
      "banking_relationships",
      "debt_capital",
      "fx_risk",
      "treasury_systems",
      "working_capital"
    ],
    profiles: [
      { skills: ["cash_management", "cash_forecasting"], profile: "Operational treasury analyst" },
      { skills: ["debt_capital", "cash_forecasting"], profile: "Treasury manager (debt-focused)" },
      { skills: ["fx_risk", "treasury_systems"], profile: "Technical treasury specialist" }
    ],
    teammates: [
      { label: "Treasurer / VP Treasury", skill: "debt_capital" },
      { label: "Cash Analysts", skill: "cash_management" },
      { label: "Controller / accounting team" },
      { label: "FP&A team", skill: "cash_forecasting" },
      { label: "AR / collections", skill: "working_capital" },
      { label: "Banking partners", skill: "banking_relationships" }
    ],
    tools: [
      {
        id: "tms",
        label: "Treasury management system",
        options: ["Kyriba", "GTreasury", "FIS / Quantum", "Coupa Treasury", "Bank portals only", "Excel only"]
      },
      {
        id: "banking_platforms",
        label: "Banking platforms",
        options: [
          "JPMorgan Access",
          "Wells Fargo CEO",
          "Bank of America CashPro",
          "Citi Direct",
          "Regional bank portals"
        ]
      },
      {
        id: "erp",
        label: "ERP",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "analysis",
        label: "Analysis tools",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      }
    ],
    aiUse: [
      "Cash forecast automation",
      "Bank fee analysis",
      "Variance explanations",
      "Covenant tracking",
      "Reconciliation",
      "Reporting",
      "Scenario modeling"
    ],
    aiTools: ["ChatGPT / Claude", "Microsoft Copilot (M365)", "Excel Copilot", "Kyriba AI", "Power BI Copilot"],
    metrics: [
      "Forecast accuracy",
      "Days cash on hand",
      "Bank fees reduced",
      "Covenant compliance",
      "Cash conversion cycle",
      "Idle cash / yield",
      "Wire accuracy",
      "DSO / DPO"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Banking",
      "PE-backed / leveraged",
      "Multinational treasury"
    ]
  },

  internal_auditor: {
    label: "Internal Auditor / Audit Manager",
    icon: "🔍",
    tagline: "Controls testing, risk assessment, and SOX",
    about: "Internal auditors independently test whether a company's controls and processes actually work — reviewing financial, operational, and compliance risks and reporting findings to management and the audit committee. In public companies much of this is SOX testing; elsewhere it's broader operational auditing.",
    opener: "Walk me through the last audit you ran, from planning to the final report.",
    coach: "SOX testing and operational/risk auditing are different tracks. Establish which, whether they built or ran the program, and their audit-committee exposure.",
    certs: ["CPA", "CIA", "CISA", "CFE", "CRMA"],
    skills: [
      "sox_testing",
      "operational_audit",
      "audit_planning",
      "audit_reporting",
      "remediation",
      "audit_analytics",
      "erm"
    ],
    profiles: [
      { skills: ["sox_testing", "remediation"], profile: "SOX / controls specialist" },
      { skills: ["operational_audit", "audit_planning"], profile: "Operational / risk auditor" },
      { skills: ["audit_analytics", "sox_testing"], profile: "Analytics-driven auditor" }
    ],
    teammates: [
      { label: "Chief Audit Executive", skill: "audit_planning" },
      { label: "IT Auditor", skill: "sox_testing" },
      { label: "Other internal auditors", skill: "operational_audit" },
      { label: "SOX Manager", skill: "sox_testing" },
      { label: "Compliance team" },
      { label: "External auditors", skill: "sox_testing" }
    ],
    tools: [
      {
        id: "audit_tools",
        label: "Audit management tools",
        options: ["AuditBoard", "Workiva", "SAP GRC", "MetricStream", "TeamMate", "Excel / SharePoint"]
      },
      {
        id: "analytics",
        label: "Analytics tools",
        options: ["ACL / Galvanize", "IDEA", "Alteryx", "Power BI", "SQL", "Tableau"]
      },
      {
        id: "erp",
        label: "ERP systems audited",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "grc",
        label: "GRC / compliance",
        options: ["ServiceNow GRC", "Archer", "LogicGate", "SAP GRC", "None"]
      }
    ],
    aiUse: [
      "Risk assessment support",
      "Control testing documentation",
      "Report drafting",
      "Anomaly / fraud detection",
      "Full-population analysis",
      "Policy review",
      "Sampling optimization"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "AuditBoard AI",
      "Workiva AI",
      "Alteryx AI",
      "Excel Copilot"
    ],
    metrics: [
      "Audit plan completion",
      "Findings identified",
      "Remediation rate",
      "SOX testing on time",
      "Material weaknesses",
      "Cost savings identified",
      "Audit committee satisfaction"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Internal audit function",
      "Risk consulting"
    ]
  },

  compliance_risk: {
    label: "Compliance / Risk Manager",
    icon: "🛡️",
    tagline: "Regulatory compliance, policy, and enterprise risk",
    about: "Compliance and risk professionals make sure a company follows the laws and regulations that govern its industry — writing policies, monitoring for violations, training staff, and managing regulatory exams. In banking and healthcare especially, this is a heavily regulated, specialized function.",
    opener: "Which regulations have you lived under, and what did a regulatory exam look like from your seat?",
    coach: "Compliance is regime-specific — a BSA/AML specialist isn't a HIPAA specialist. Establish the regime and industry first, then whether they built a program or maintained one.",
    certs: ["CAMS", "CRCM", "CCEP", "CIPP", "CFE", "CIA"],
    skills: [
      "regulatory_compliance",
      "policy_procedure",
      "compliance_monitoring",
      "erm",
      "compliance_training",
      "investigations"
    ],
    profiles: [
      {
        skills: ["regulatory_compliance", "compliance_monitoring"],
        profile: "Regulatory compliance specialist"
      },
      { skills: ["erm", "policy_procedure"], profile: "Enterprise risk manager" },
      {
        skills: ["investigations", "regulatory_compliance"],
        profile: "Investigations / financial crime specialist"
      }
    ],
    teammates: [
      { label: "Chief Compliance Officer", skill: "regulatory_compliance" },
      { label: "Compliance Analysts", skill: "compliance_monitoring" },
      { label: "Internal Audit", skill: "compliance_monitoring" },
      { label: "Legal / General Counsel", skill: "investigations" },
      { label: "Risk Manager", skill: "erm" },
      { label: "Information Security" }
    ],
    tools: [
      {
        id: "grc",
        label: "GRC platforms",
        options: ["Archer", "LogicGate", "ServiceNow GRC", "MetricStream", "Workiva", "AuditBoard"]
      },
      {
        id: "monitoring_tools",
        label: "Monitoring / screening",
        options: ["NICE Actimize", "Verafin", "Fenergo", "LexisNexis", "World-Check", "In-house"]
      },
      {
        id: "training_tools",
        label: "Training platforms",
        options: ["NAVEX", "KnowBe4", "Skillsoft", "In-house LMS"]
      },
      {
        id: "case_mgmt",
        label: "Case management",
        options: ["EthicsPoint", "i-Sight", "ServiceNow", "Excel / manual"]
      }
    ],
    aiUse: [
      "Regulatory change monitoring",
      "Policy drafting",
      "Transaction monitoring",
      "Investigation support",
      "Training content",
      "Risk assessment",
      "Document review"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Archer AI",
      "Actimize AI",
      "Regulatory intelligence tools"
    ],
    metrics: [
      "Exam / audit findings",
      "Policy currency",
      "Training completion",
      "Issue closure rate",
      "Regulatory penalties",
      "Risk assessment coverage",
      "Investigation cycle time"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Banking / credit union",
      "Insurance",
      "Broker-dealer",
      "Healthcare provider",
      "Defense / government contractor"
    ]
  },

  fpa_analyst: {
    label: "FP&A / Financial Analyst",
    icon: "📈",
    tagline: "Budgeting, forecasting, modeling, and business partnering",
    about: "FP&A (Financial Planning & Analysis) is the forward-looking side of finance — building budgets and forecasts, modeling scenarios, and explaining why results differ from plan. Strong FP&A people act as business partners, helping operators make decisions rather than just reporting numbers.",
    opener: "Tell me about a model you built from a blank sheet and the decision it drove.",
    coach: "FP&A ranges from report builders to true business partners. Modeling depth and whether their analysis changed decisions are the level signals.",
    certs: ["CFA", "CMA", "CPA", "FPAC (AFP)", "MBA"],
    skills: [
      "budgeting_forecasting",
      "financial_modeling",
      "variance_reporting",
      "business_partnering",
      "finance_bi",
      "specialized_analysis",
      "pricing_profitability",
      "finance_process_improvement"
    ],
    profiles: [
      { skills: ["financial_modeling", "budgeting_forecasting"], profile: "Core FP&A analyst" },
      {
        skills: ["business_partnering", "variance_reporting"],
        profile: "Business partner / commercial finance"
      },
      {
        skills: ["finance_bi", "finance_process_improvement"],
        profile: "FP&A systems / transformation analyst"
      }
    ],
    teammates: [
      { label: "FP&A Manager / Director", skill: "budgeting_forecasting" },
      { label: "Other Financial Analysts", skill: "variance_reporting" },
      { label: "Controller / accounting team" },
      { label: "Data / BI Analyst", skill: "finance_bi" },
      { label: "Business unit finance leads", skill: "business_partnering" }
    ],
    tools: [
      {
        id: "planning",
        label: "Planning tools",
        options: ["Anaplan", "Adaptive Insights", "Vena", "Planful", "Hyperion", "Excel models"]
      },
      {
        id: "bi",
        label: "BI / reporting",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      },
      {
        id: "erp",
        label: "ERP source system",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "data",
        label: "Data / query tools",
        options: ["SQL", "Snowflake", "Alteryx", "Python", "Power Query"]
      }
    ],
    aiUse: [
      "Variance commentary",
      "Forecast automation",
      "Scenario modeling",
      "Deck drafting",
      "Data cleanup",
      "Formula / model building",
      "Summarizing results"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Excel Copilot",
      "Power BI Copilot",
      "Anaplan / Adaptive AI",
      "Tableau Pulse"
    ],
    metrics: [
      "Forecast accuracy",
      "Budget variance",
      "Reporting timeliness",
      "Decision impact",
      "Revenue / margin outcomes",
      "Cost savings identified",
      "Model quality",
      "Stakeholder satisfaction"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Investment banking",
      "Consulting",
      "SaaS / subscription"
    ]
  },

  supply_chain: {
    label: "Supply Chain & Procurement Consultant",
    icon: "📦",
    tagline: "Sourcing, spend analytics, inventory, and cost reduction",
    about: "These consultants work the cost side of the business — analyzing what a company buys and from whom, renegotiating supplier contracts, and optimizing inventory so cash isn't tied up on shelves. It sits between finance and operations, and the deliverable is usually measurable savings.",
    opener: "What's the biggest savings you've delivered, and how was it validated in the P&L?",
    coach: "Establish analysis (find the savings) versus execution (negotiate them), direct versus indirect categories, and how savings were measured.",
    certs: ["CPSM", "CSCP", "CPIM", "Six Sigma"],
    skills: [
      "spend_analytics",
      "strategic_sourcing",
      "inventory_planning",
      "p2p_procurement_ops",
      "supplier_risk",
      "cost_reduction"
    ],
    profiles: [
      { skills: ["spend_analytics", "cost_reduction"], profile: "Spend / cost analytics consultant" },
      { skills: ["strategic_sourcing", "supplier_risk"], profile: "Strategic sourcing consultant" },
      {
        skills: ["inventory_planning", "p2p_procurement_ops"],
        profile: "Supply chain operations consultant"
      }
    ],
    teammates: [
      { label: "CPO / procurement leadership", skill: "strategic_sourcing" },
      { label: "Category managers / buyers", skill: "strategic_sourcing" },
      { label: "Supply chain / planning team", skill: "inventory_planning" },
      { label: "FP&A team", skill: "cost_reduction" },
      { label: "Operations leadership" },
      { label: "AP / P2P team", skill: "p2p_procurement_ops" }
    ],
    tools: [
      {
        id: "procurement_tools",
        label: "Procurement / sourcing systems",
        options: ["Coupa", "Ariba", "Jaggaer", "GEP", "Ivalua", "Zycus", "ERP-native"]
      },
      {
        id: "erp",
        label: "ERP",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "planning_tools",
        label: "Supply chain planning",
        options: ["Kinaxis", "o9", "Blue Yonder", "SAP IBP", "Excel"]
      },
      {
        id: "analytics",
        label: "Analytics tools",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      }
    ],
    aiUse: [
      "Spend classification",
      "Contract analysis",
      "Should-cost modeling",
      "Demand forecasting",
      "Supplier research",
      "RFP drafting",
      "Savings tracking"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Coupa AI",
      "Alteryx AI",
      "Power BI Copilot",
      "Excel Copilot"
    ],
    metrics: [
      "Savings delivered",
      "Spend under management",
      "Inventory turns",
      "Days inventory outstanding",
      "Supplier consolidation",
      "Contract compliance",
      "Cost avoidance",
      "Working capital released"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Procurement consulting",
      "Manufacturing operations",
      "Distribution / logistics",
      "Big 4 consulting"
    ]
  },

  finance_transformation: {
    label: "Finance Transformation Consultant",
    icon: "🔄",
    tagline: "O2C, P2P, R2R, shared services, and process redesign",
    about: "Finance transformation consultants redesign how finance actually works — the end-to-end cycles like order-to-cash, procure-to-pay, and record-to-report. They map current processes, find the waste and the manual workarounds, and rebuild them, often alongside a system change or a shared-services move.",
    opener: "Which finance process have you redesigned end to end, and what did it look like before and after?",
    coach: "Pin which cycles they've redesigned (O2C, P2P, R2R), whether they assessed, designed, or implemented, and the measured before/after.",
    certs: ["CPA", "Six Sigma", "PMP", "Prosci"],
    skills: [
      "o2c",
      "p2p_procurement_ops",
      "r2r",
      "close_acceleration",
      "shared_services",
      "ma_deals",
      "finance_process_improvement"
    ],
    profiles: [
      { skills: ["o2c", "p2p_procurement_ops"], profile: "Transactional cycle specialist" },
      { skills: ["r2r", "close_acceleration"], profile: "Close acceleration consultant" },
      { skills: ["ma_deals", "finance_process_improvement"], profile: "M&A integration consultant" },
      {
        skills: ["shared_services", "finance_process_improvement"],
        profile: "Shared services / operating model consultant"
      }
    ],
    teammates: [
      { label: "Controller / accounting team", skill: "r2r" },
      { label: "AP / P2P team", skill: "p2p_procurement_ops" },
      { label: "AR / collections team", skill: "o2c" },
      { label: "Shared services leadership", skill: "shared_services" },
      { label: "PMO / project managers", skill: "finance_process_improvement" },
      { label: "IT / systems team" },
      { label: "Internal Audit", skill: "finance_process_improvement" }
    ],
    tools: [
      {
        id: "erp",
        label: "ERP",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "p2p_tools",
        label: "P2P / AP automation",
        options: ["Coupa", "Ariba", "Bill.com", "Concur", "Tipalti", "Esker", "AvidXchange"]
      },
      {
        id: "o2c_tools",
        label: "O2C / billing tools",
        options: ["HighRadius", "Zuora", "Salesforce CPQ", "BillingPlatform", "ERP-native"]
      },
      {
        id: "close_tools",
        label: "Close / automation",
        options: ["BlackLine", "FloQast", "Trintech", "Power Automate", "UiPath", "Alteryx"]
      },
      {
        id: "process_tools",
        label: "Process / PM tools",
        options: ["Visio", "Lucidchart", "Celonis", "Signavio", "Jira", "Smartsheet"]
      }
    ],
    aiUse: [
      "Process documentation",
      "Current-state analysis",
      "Invoice / document processing",
      "Anomaly detection",
      "SOP drafting",
      "Business case modeling",
      "Workflow automation"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Power Automate",
      "UiPath",
      "Celonis process mining",
      "Alteryx AI"
    ],
    metrics: [
      "Close cycle time",
      "DSO / DPO",
      "Cost per invoice",
      "Manual hours eliminated",
      "Process cycle time",
      "Cost savings delivered",
      "Automation rate",
      "Day-1 readiness",
      "Error / rework rate"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Big 4 consulting",
      "Transaction services",
      "Shared services center",
      "ERP consulting firm"
    ]
  },

  financial_systems: {
    label: "Financial Systems Analyst",
    icon: "⚙️",
    tagline: "ERP implementation, integrations, and finance process automation",
    about: "Financial systems analysts sit between accounting and IT — they configure and support the systems finance runs on (ERP, planning, reporting tools), lead implementations and upgrades, and automate manual processes. They speak both accounting and technology, which is why they're hard to find.",
    opener: "Which finance systems have you implemented or run, and did you come from the finance side or the IT side?",
    coach: "The pool is small because it takes both accounting and systems. Establish the system, full-cycle implementations, and which side they came from.",
    certs: ["ERP certification (SAP / Oracle / NetSuite / Workday)", "CPA", "PMP"],
    skills: [
      "erp_implementation",
      "finance_system_admin",
      "system_integrations",
      "finance_bi",
      "finance_automation",
      "finance_sme",
      "project_delivery"
    ],
    profiles: [
      { skills: ["erp_implementation", "finance_sme"], profile: "ERP implementation consultant (finance)" },
      { skills: ["finance_system_admin", "finance_bi"], profile: "Financial systems administrator" },
      {
        skills: ["system_integrations", "finance_automation"],
        profile: "Finance automation / technical analyst"
      }
    ],
    teammates: [
      { label: "IT / ERP team", skill: "finance_system_admin" },
      { label: "Controller / accounting team", skill: "finance_sme" },
      { label: "FP&A team", skill: "finance_bi" },
      { label: "Implementation partner / consultants", skill: "erp_implementation" },
      { label: "Data / BI Analyst", skill: "finance_bi" },
      { label: "Project Manager", skill: "project_delivery" }
    ],
    tools: [
      {
        id: "erp",
        label: "ERP",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "reporting",
        label: "Reporting / BI",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      },
      {
        id: "automation_tools",
        label: "Automation tools",
        options: ["Power Automate", "UiPath", "Alteryx", "BlackLine", "VBA", "Python"]
      },
      {
        id: "integration_tools",
        label: "Integration / data",
        options: ["Boomi", "MuleSoft", "Celigo", "SQL", "REST APIs", "Snowflake"]
      }
    ],
    aiUse: [
      "Configuration documentation",
      "Test script generation",
      "Data mapping",
      "Report building",
      "Process documentation",
      "Troubleshooting",
      "Training materials"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Power BI Copilot",
      "ERP-embedded AI",
      "GitHub Copilot",
      "Alteryx AI"
    ],
    metrics: [
      "Implementation milestones",
      "Go-live success",
      "System uptime",
      "Ticket resolution time",
      "Manual hours eliminated",
      "Report adoption",
      "Data accuracy",
      "User satisfaction"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "ERP consulting firm",
      "Systems integrator",
      "Shared services"
    ]
  },

  epm_data: {
    label: "EPM / Data & Analytics Consultant",
    icon: "🧠",
    tagline: "EPM tools, BI, data integration, and AI readiness",
    about: "These consultants build the reporting and planning layer finance runs on — implementing EPM tools like Hyperion, OneStream, or Anaplan, building BI dashboards, and integrating or migrating financial data between systems. Increasingly they also prepare a company's data so it's clean and governed enough for AI to use.",
    opener: "Which EPM or BI platform have you built in, and what did you build — consolidation, planning, or reporting?",
    coach: "Platform is the hardest filter. Establish builder versus user, certification, and how much data plumbing (SQL / ETL) they did themselves.",
    certs: ["OneStream", "Anaplan Model Builder", "Oracle EPM", "Power BI (PL-300)", "CPA"],
    skills: [
      "epm_platforms",
      "finance_data_integration",
      "finance_bi",
      "ai_data_readiness",
      "master_data",
      "advanced_analytics",
      "user_enablement"
    ],
    profiles: [
      { skills: ["epm_platforms", "user_enablement"], profile: "EPM implementation consultant" },
      {
        skills: ["finance_data_integration", "master_data"],
        profile: "Finance data / integration consultant"
      },
      { skills: ["finance_bi", "advanced_analytics"], profile: "Finance analytics consultant" },
      { skills: ["ai_data_readiness", "master_data"], profile: "Data governance / AI readiness consultant" }
    ],
    teammates: [
      { label: "FP&A team", skill: "finance_bi" },
      { label: "IT / data engineering", skill: "finance_data_integration" },
      { label: "BI / Data Analyst", skill: "finance_bi" },
      { label: "ERP / systems team", skill: "epm_platforms" },
      { label: "Data governance lead", skill: "ai_data_readiness" },
      { label: "Implementation partner", skill: "epm_platforms" }
    ],
    tools: [
      {
        id: "epm",
        label: "EPM platforms",
        options: [
          "Hyperion / HFM",
          "OneStream",
          "Anaplan",
          "Adaptive Insights",
          "Planful",
          "Vena",
          "SAP BPC",
          "Oracle EPM Cloud"
        ]
      },
      {
        id: "bi",
        label: "BI / visualization",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      },
      {
        id: "data_platform",
        label: "Data platform",
        options: ["Snowflake", "Databricks", "Azure Synapse", "BigQuery", "Redshift", "SQL Server"]
      },
      {
        id: "integration_tools",
        label: "Integration / ETL",
        options: ["Boomi", "MuleSoft", "Alteryx", "Informatica", "Fivetran", "SQL", "Power Query"]
      },
      {
        id: "erp",
        label: "ERP source systems",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      }
    ],
    aiUse: [
      "Data quality assessment",
      "Report building",
      "Model documentation",
      "Data mapping",
      "Forecast automation",
      "Anomaly detection",
      "Self-service enablement"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Power BI Copilot",
      "Databricks AI",
      "Alteryx AI",
      "OneStream / Anaplan AI",
      "Snowflake Cortex"
    ],
    metrics: [
      "Implementation milestones",
      "Report adoption",
      "Data quality scores",
      "Forecast accuracy",
      "Manual reporting hours eliminated",
      "System uptime",
      "User satisfaction",
      "Time to insight"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "EPM consulting firm",
      "Big 4 consulting",
      "Systems integrator",
      "Data / analytics consultancy"
    ]
  },

  project_change: {
    label: "Project / Change Management Consultant",
    icon: "🗓️",
    tagline: "Finance PMO, program delivery, and change adoption",
    about: "These consultants run the finance side of major projects — system implementations, transformations, integrations — keeping workstreams, timelines, and stakeholders coordinated. The change-management half focuses on the people side: making sure the new process is actually adopted rather than worked around.",
    opener: "Tell me about the largest finance program you ran — what was it, how many workstreams, and what went wrong?",
    coach: "Finance PMO ranges from a plan tracker to a program lead. Establish authority, program type, whether change management was real, and how much finance they know.",
    certs: ["PMP", "Prosci", "CSM / SAFe", "Six Sigma", "CPA"],
    skills: ["program_mgmt", "change_mgmt", "stakeholder_mgmt", "pmo_governance", "launch_cutover", "finance_sme"],
    profiles: [
      { skills: ["program_mgmt", "finance_sme"], profile: "Finance program manager" },
      { skills: ["change_mgmt", "stakeholder_mgmt"], profile: "Change management consultant" },
      { skills: ["launch_cutover", "pmo_governance"], profile: "Implementation / cutover PM" }
    ],
    teammates: [
      { label: "PMO / other project managers", skill: "pmo_governance" },
      { label: "Business analysts", skill: "launch_cutover" },
      { label: "Controller / accounting team", skill: "finance_sme" },
      { label: "IT project team" },
      { label: "Systems integrator / vendor", skill: "program_mgmt" },
      { label: "Change / training team", skill: "change_mgmt" }
    ],
    tools: [
      {
        id: "pm_tools",
        label: "PM / tracking tools",
        options: ["MS Project", "Jira", "Smartsheet", "Asana", "Monday", "Planview", "Excel"]
      },
      {
        id: "collab",
        label: "Collaboration / docs",
        options: ["Confluence", "SharePoint", "Notion", "Teams", "Miro"]
      },
      {
        id: "erp",
        label: "Systems being implemented",
        options: [
          "SAP",
          "Oracle / NetSuite",
          "Workday",
          "Microsoft Dynamics",
          "Sage",
          "QuickBooks",
          "Great Plains",
          "Infor",
          "JD Edwards"
        ]
      },
      {
        id: "reporting",
        label: "Reporting / dashboards",
        options: [
          "Excel (advanced)",
          "Power BI",
          "Tableau",
          "Hyperion / HFM",
          "OneStream",
          "Adaptive Insights",
          "Anaplan",
          "Cognos"
        ]
      }
    ],
    aiUse: [
      "Status report drafting",
      "Meeting summaries",
      "Risk analysis",
      "Plan / timeline drafting",
      "Training material creation",
      "Communications drafting",
      "Documentation"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Jira / Atlassian Intelligence",
      "Notion AI",
      "AI meeting notes (Otter / Fireflies)"
    ],
    metrics: [
      "On-time delivery",
      "On-budget delivery",
      "Go-live success",
      "Adoption / utilization rate",
      "Scope adherence",
      "Defect / rework rate",
      "Stakeholder satisfaction",
      "Milestone completion"
    ],
    environments: [
      "Public accounting (Big 4)",
      "Public accounting (regional)",
      "Public company",
      "Private equity-backed",
      "Privately held",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Technology / SaaS",
      "Retail / consumer",
      "Non-profit",
      "Government",
      "Big 4 consulting",
      "Systems integrator",
      "Internal PMO",
      "Change management consultancy"
    ]
  }
};

  window.FORMS.management = {
    id: "management",
    label: "Management Resources",
    business: "pts",
    roles: ROLES,
    roleOrder: ["interim_cfo","controller","accounting_manager","technical_accounting","tax_manager","treasury","internal_auditor","compliance_risk","fpa_analyst","supply_chain","finance_transformation","financial_systems","epm_data","project_change"]
  };
})();

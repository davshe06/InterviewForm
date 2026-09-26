/* Role-independent interview steps — the questions every candidate gets,
   whichever roles they're being assessed against. app.js renders them; the
   role-specific depth, deep-dive, and fit steps come from the skill and role
   catalogs.

   Question types: text, textarea, number, select, radio, chips (always allows
   "+ Other…"), textlist (N numbered boxes), group (N repeated mini-forms, e.g.
   positions), payrange (ideal low–high + bottom end).
   Extra keys:
     optionsFrom — chips options pulled from the shortlisted roles
                   ("certs" | "environments" | "metrics" | "teammates")
     link        — export the answer as a hyperlink
     showIf(answers, state), and tips' when(answers, state), as elsewhere.
   exploring(state, catalogId) is true when a shortlisted role comes from that
   catalog, for catalog-specific questions. */
(function () {

const OPERATING = ["Mostly strategic / leading others", "Balanced / player-coach", "Mostly hands-on / individual contributor"];
const MR_PILLARS = ["Accounting, Finance, Tax, Treasury & Audit", "Finance Transformation", "Data, Systems & ERP",
                    "Performance Optimization & Business Analytics"];

window.INTERVIEW = {
  brand: { title: "Candidate Interview", subtitle: "Recruiter screen" },

  levels: ["Entry / junior", "Mid-level", "Senior", "Lead / principal", "Manager", "Director / executive"],

  steps: {

    candidate: {
      title: "Candidate",
      subtitle: "Who they are and how to reach them. Paste the résumé in the notes rail before the call.",
      coach: "Open by telling them what the call covers: their background, a skills deep dive, what they want next, pay, and availability.",
      questions: [
        { id: "full_name", type: "text", label: "Full name", placeholder: "First Last" },
        { id: "email", type: "text", label: "Email", placeholder: "name@example.com" },
        { id: "phone", type: "text", label: "Phone", placeholder: "(555) 555-5555" },
        { id: "linkedin", type: "text", label: "LinkedIn / portfolio", placeholder: "linkedin.com/in/…", link: true },
        { id: "location", type: "text", label: "Where they live", placeholder: "City, state" },
        { id: "current_title", type: "text", label: "Current / most recent title", placeholder: "e.g., Senior Accountant" },
        { id: "current_employer", type: "text", label: "Current / most recent employer", placeholder: "Company" },
        { id: "status", type: "radio", label: "Employment status",
          options: ["Employed", "Between roles", "Contract ending", "Freelance / consulting"] },
        { id: "status_detail", type: "text", label: "When does it end / how long have they been out?",
          placeholder: "e.g., contract ends 11/15",
          showIf: a => a.status === "Contract ending" || a.status === "Between roles" },
        { id: "years_total", type: "select", label: "Years of relevant experience",
          options: ["Under 2", "2–5", "5–10", "10–15", "15–20", "20+"] },
        { id: "education", type: "text", label: "Education", placeholder: "Degree, school" },
        { id: "certs", type: "chips", label: "Certifications held", optionsFrom: "certs" },
        { id: "work_authorized", type: "radio", label: "Legally authorized to work in the US?", options: ["Yes", "No"] },
        { id: "sponsorship", type: "radio", label: "Will they now or in the future require sponsorship?", options: ["No", "Yes"] },
        { id: "clearance", type: "select", label: "Security clearance",
          options: ["None", "Public Trust", "Secret", "Top Secret", "TS/SCI"],
          showIf: (a, s) => exploring(s, "tech") },
        { id: "clearance_active", type: "radio", label: "Is the clearance active?", options: ["Active", "Lapsed"],
          showIf: (a, s) => exploring(s, "tech") && a.clearance && a.clearance !== "None" }
      ],
      tips: [
        { when: a => a.status === "Between roles",
          text: "Between roles — ask what they've been doing since, and whether they're interviewing elsewhere." },
        { when: a => a.sponsorship === "Yes",
          text: "Needs sponsorship — confirm the visa type and timeline before submitting anywhere." }
      ]
    },

    history: {
      title: "Career History",
      subtitle: "Walk the résumé, most recent first. Get what they owned, not what the team did.",
      coach: "For each role ask: “What were you hired to do, what did you own, and why did you leave?” Short stints and gaps get a direct, friendly question.",
      questions: [
        { id: "positions", type: "group", count: 3, label: "Recent positions",
          fields: [
            { id: "title", label: "Title", placeholder: "Title" },
            { id: "company", label: "Company", placeholder: "Company" },
            { id: "dates", label: "Dates", placeholder: "e.g., 2021 – present" },
            { id: "owned", label: "What they owned", placeholder: "Scope, team, results", long: true },
            { id: "left", label: "Why they left / are leaving", placeholder: "Reason", long: true }
          ] },
        { id: "gaps", type: "text", label: "Gaps or short stints — and the reason", placeholder: "e.g., 2020 gap — caregiving" },
        { id: "operating_level", type: "radio", label: "Where do they operate today?", options: OPERATING },
        { id: "reports_to", type: "text", label: "Most senior person they report to", placeholder: "Title (e.g., CFO, VP Engineering)" },
        { id: "team_size", type: "text", label: "Size of their team", placeholder: "e.g., 8-person accounting team" },
        { id: "direct_reports", type: "select", label: "Direct reports", options: ["None", "1–3", "4–8", "9–15", "16+"] },
        { id: "teammates", type: "chips", label: "Who else was on their team?", optionsFrom: "teammates",
          help: "Specialists on their team tell you what they did NOT own." },
        { id: "environments", type: "chips", label: "Environments they've worked in", optionsFrom: "environments" },
        { id: "industries", type: "text", label: "Industries", placeholder: "e.g., SaaS, manufacturing, healthcare" },
        { id: "mr_pillars", type: "chips", label: "Management Resources capability areas they've delivered",
          options: MR_PILLARS, showIf: (a, s) => exploring(s, "management") },
        { id: "mr_engagements", type: "chips", label: "What have they been brought in to do?",
          options: ["Leave coverage", "Vacancy / gap coverage", "System implementation", "Audit / remediation",
                    "M&A or divestiture", "Month-end / close support", "Restructuring", "Growth / scaling", "IPO readiness"],
          showIf: (a, s) => exploring(s, "management") },
        { id: "metrics", type: "chips", label: "What they were measured on / moved", optionsFrom: "metrics" },
        { id: "accomplishment", type: "textarea", label: "Best accomplishment — what moved, and by how much?",
          placeholder: "Specific, with numbers" }
      ],
      tips: [
        { when: a => (a.positions || []).filter(p => p && /present|current|now/i.test(p.dates || "")).length > 1,
          text: "More than one position marked current — confirm which is primary and whether they're moonlighting." }
      ]
    },

    wants: {
      title: "What They Want",
      subtitle: "Motivation, direction, and dealbreakers — the things that decide whether a placement sticks.",
      coach: "Ask “why now?” before “what next?” The reason they're looking predicts what they'll accept.",
      questions: [
        { id: "why_looking", type: "textarea", label: "Why are they looking? What would make them move?",
          placeholder: "In their words" },
        { id: "looking_since", type: "select", label: "How long have they been looking?",
          options: ["Just started", "1–3 months", "3–6 months", "6+ months"] },
        { id: "top3", type: "textlist", count: 3, label: "Top 3 things they want in their next role",
          placeholder: "One per line, most important first" },
        { id: "target_titles", type: "text", label: "Titles they're targeting", placeholder: "e.g., Assistant Controller, Controller" },
        { id: "target_level", type: "radio", label: "Where do they want to operate?", options: OPERATING },
        { id: "engagement", type: "chips", label: "Open to",
          options: ["Contract / consulting", "Contract-to-hire", "Direct hire (Perm)", "FTEP", "Project-based (SOW)"] },
        { id: "avoid", type: "text", label: "Industries or company types to avoid", placeholder: "e.g., early-stage startups" },
        { id: "non_negotiables", type: "textarea", label: "Dealbreakers", placeholder: "Commute, travel, on-call, tools, culture…" },
        { id: "timeline", type: "select", label: "How soon could they move?",
          options: ["Immediately", "2 weeks' notice", "3–4 weeks", "1–2 months", "Just exploring"] }
      ],
      tips: [
        { when: (a, s) => a.target_level && s.common.history.operating_level && a.target_level !== s.common.history.operating_level,
          text: "They want to change how they operate — ask what they've already done that proves they're ready for it." },
        { when: a => (a.engagement || []).length > 0 && !(a.engagement || []).includes("Direct hire (Perm)"),
          text: "Ask whether they'd consider Direct hire (Perm) and FTEP as well." },
        { when: a => a.timeline === "Just exploring",
          text: "Just exploring — find the trigger that would make them move, and when you should check back." }
      ]
    },

    pay: {
      title: "Pay, Location & Availability",
      subtitle: "What they need to earn, how they'd be paid, and where and when they can work.",
      coach: "Ask for their ideal range and their bottom end — the number below which they'd walk away. Don't ask what they earn today.",
      questions: [
        { id: "pay_type", type: "radio", label: "Pay type", options: ["W2", "IC (1099)", "C2C"] },
        { id: "c2c_company", type: "text", label: "C2C company name", placeholder: "Legal company name",
          showIf: a => a.pay_type === "C2C" },
        { id: "c2c_relationship", type: "radio", label: "Relationship to the company",
          options: ["They own the company", "Through a third-party vendor"], showIf: a => a.pay_type === "C2C" },
        { id: "c2c_contact_name", type: "text", label: "C2C contact name", placeholder: "Name",
          showIf: a => a.pay_type === "C2C" },
        { id: "c2c_contact_email", type: "text", label: "C2C contact email", placeholder: "name@company.com",
          showIf: a => a.pay_type === "C2C" },
        { id: "c2c_contact_phone", type: "text", label: "C2C contact phone", placeholder: "(555) 555-5555",
          showIf: a => a.pay_type === "C2C" },
        { id: "c2c_location", type: "text", label: "C2C company location", placeholder: "City, state",
          showIf: a => a.pay_type === "C2C" },
        { id: "hourly", type: "payrange", label: "Hourly rate", unit: "/hr", step: 1 },
        { id: "salary", type: "payrange", label: "Salary", unit: "/yr", step: 1000 },
        { id: "pay_notes", type: "text", label: "Other pay notes", placeholder: "Bonus, benefits, equity, OT expectations…" },
        { id: "work_model", type: "chips", label: "Will accept", options: ["Remote", "Hybrid", "Onsite"] },
        { id: "max_onsite", type: "select", label: "Most days onsite per week they'll accept", options: ["1", "2", "3", "4", "5"],
          showIf: a => (a.work_model || []).includes("Hybrid") || (a.work_model || []).includes("Onsite") },
        { id: "commute", type: "text", label: "Commute limit / preferred locations", placeholder: "e.g., 30 min of downtown" },
        { id: "relocate", type: "radio", label: "Open to relocating?", options: ["Yes", "Maybe", "No"] },
        { id: "travel", type: "select", label: "Travel they'll accept", options: ["None", "Up to 10%", "Up to 25%", "Up to 50%", "50%+"] },
        { id: "timezone", type: "text", label: "Time-zone or hours limits", placeholder: "e.g., US Central, no evenings" },
        { id: "earliest_start", type: "text", label: "Earliest start / notice period", placeholder: "e.g., 2 weeks from offer" },
        { id: "assignment_length", type: "text", label: "Preferred assignment length", placeholder: "e.g., 6+ months" },
        { id: "busy_season", type: "radio", label: "OK with close / busy-season hours?", options: ["Yes", "Some", "No"],
          showIf: (a, s) => exploring(s, "management") }
      ],
      tips: [
        { when: a => payFloorAboveIdeal(a.hourly) || payFloorAboveIdeal(a.salary),
          text: "The bottom end is above the low end of their ideal range — double-check the numbers with them." },
        { when: a => a.pay_type === "C2C" && a.c2c_relationship === "Through a third-party vendor",
          text: "A third-party vendor is in the chain — get the vendor contact and confirm they'll work with us." },
        { when: a => a.pay_type === "IC (1099)",
          text: "1099 — confirm they understand they'll cover their own taxes and benefits, and that the assignment allows IC status." }
      ]
    },

    next: {
      title: "Screening & Next Steps",
      subtitle: "Willingness for the usual screening steps, where they are in the market, and what happens next.",
      coach: "Before you hang up: lock their interview availability and ask what else they have in play.",
      availability: true,
      questions: [
        { id: "working_interview", type: "radio", label: "Open to a working interview?", options: ["Yes", "Maybe", "No"] },
        { id: "assessment", type: "radio", label: "Willing to do an assessment or take-home?",
          options: ["Yes", "Depends on length", "No"] },
        { id: "samples", type: "text", label: "Work samples / portfolio / GitHub", placeholder: "Links", link: true },
        { id: "background_check", type: "radio", label: "Willing to complete a background check?",
          options: ["Yes", "Has questions", "No"] },
        { id: "drug_screen", type: "radio", label: "Willing to complete a drug screen?", options: ["Yes", "Has questions", "No"] },
        { id: "computer", type: "radio", label: "Has a suitable computer if the assignment needs one?", options: ["Yes", "No"] },
        { id: "other_interviews", type: "textarea", label: "Other interviews or offers in play",
          placeholder: "Companies, stage, timelines" },
        { id: "counteroffer", type: "radio", label: "Counteroffer risk", options: ["Low", "Medium", "High"] },
        { id: "concerns", type: "textarea", label: "Concerns / red flags", placeholder: "Anything that gave you pause" },
        { id: "summary", type: "textarea", label: "Recruiter summary", placeholder: "Your read on this candidate in 3–4 sentences" },
        { id: "next_steps", type: "textarea", label: "Agreed next steps", placeholder: "What you'll do, what they'll do, and when" }
      ],
      tips: [
        { when: a => a.counteroffer === "High",
          text: "High counteroffer risk — ask now: “If your company matched, would you stay?” and note the answer." },
        { when: a => a.background_check === "Has questions" || a.drug_screen === "Has questions",
          text: "They have questions about screening — explain the process, and bring in your manager if anything needs a decision." },
        { when: a => (a.other_interviews || "").trim().length > 0,
          text: "Other processes in play — get the stages and dates so you can move faster than they do." }
      ]
    }
  }
};

function payFloorAboveIdeal(r) {
  if (!r) return false;
  const lo = parseFloat(r.min), floor = parseFloat(r.floor);
  return !isNaN(lo) && !isNaN(floor) && floor > lo;
}

})();

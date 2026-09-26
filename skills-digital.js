/* Digital, marketing, design, and immersive skills. Front-end framework, API
   integration, software testing, and LLM apps are shared with Tech roles and
   live in skills-tech.js. Shape: skills-shared.js. */
(function () {
  window.SKILLS = window.SKILLS || {};

Object.assign(window.SKILLS, {

  /* ---------------- marketing ---------------- */

  paid_media: {
    label: "Paid Media", icon: "📣", decay: "fast",
    what: "Running paid advertising — Google, Meta, LinkedIn, programmatic — and managing the budget against results.",
    ask: [
      "Which platforms did you run hands-on, and what was the monthly spend you personally managed?",
      "Walk me through how you'd rescue a campaign whose CPA doubled overnight.",
      "Did you run it in-house or manage an agency?"
    ],
    listen: "Hands-on platform depth, a spend figure they owned, ROAS/CPA numbers, budget pacing, and a troubleshooting method.",
    red: "Strategy only, never inside the ad account; can't quote a result.",
    capture: [
      { id: "channels", type: "chips", label: "Channels run hands-on",
        options: ["Google Ads", "Meta", "LinkedIn", "TikTok", "Microsoft Ads", "Display", "Programmatic", "Amazon Ads"] },
      { id: "spend", type: "select", label: "Largest monthly spend managed",
        options: ["Under $10k", "$10k–$50k", "$50k–$100k", "$100k–$500k", "$500k+"] },
      { id: "model", type: "radio", label: "How it was run", options: ["In-house, hands-on", "Managed an agency", "Hybrid"] },
      { id: "results", type: "text", label: "Best result", placeholder: "e.g., 4.2x ROAS, CPA down 30%" }
    ]
  },

  ma_platform: {
    label: "Marketing Automation Platform", icon: "🛠️", decay: "fast",
    what: "Owning a marketing automation platform — HubSpot, Marketo, Pardot, SFMC, Eloqua — as admin or builder.",
    ask: [
      "Which platform, and were you the admin who owned the instance or a user building campaigns?",
      "What's the most complex thing you built in it?",
      "Have you migrated from one platform to another?"
    ],
    listen: "Instance ownership (fields, sync, permissions), complex builds, a migration, and certifications.",
    red: "Sent emails from templates someone else built.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms",
        options: ["HubSpot", "Marketo", "Pardot / Account Engagement", "Salesforce Marketing Cloud", "Adobe / Eloqua", "Klaviyo", "Braze"] },
      { id: "depth", type: "radio", label: "Depth", options: ["Admin / instance owner", "Power user / builder", "Campaign user"] },
      { id: "migration", type: "radio", label: "Led a platform migration?", options: ["Yes", "No"] }
    ]
  },

  email_marketing: {
    label: "Email Marketing", icon: "✉️", decay: "fast",
    what: "Planning, writing, building, and analyzing email campaigns.",
    ask: [
      "Walk me through a campaign from brief to send. Which parts did you do yourself?",
      "What did you test, and what moved open or click rates?",
      "How did you handle deliverability?"
    ],
    listen: "End-to-end ownership, tests with results, and deliverability awareness (authentication, list hygiene).",
    red: "Only scheduled sends.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["Created campaigns", "Wrote emails", "Built in the ESP", "Built journeys", "Analyzed performance", "Deliverability"] },
      { id: "esp", type: "text", label: "Email platforms", placeholder: "HubSpot, Klaviyo, Mailchimp…" }
    ]
  },

  seo: {
    label: "SEO", icon: "🔍", decay: "fast",
    what: "Search engine optimization — technical site fixes, content, keywords, and local SEO.",
    ask: [
      "Tell me about organic growth you drove. What did you change, and what happened to traffic?",
      "Technical SEO or content SEO — which is your strength?",
      "Could you implement fixes yourself, or did you need developers?"
    ],
    listen: "A traffic or ranking result with the change behind it, technical vocabulary (crawl, indexation, schema, Core Web Vitals), and tooling.",
    red: "Keyword stuffing; no measurable result.",
    capture: [
      { id: "involvement", type: "chips", label: "SEO work",
        options: ["Technical SEO", "Content SEO", "Keyword research", "Local SEO", "Link building", "AI search / GEO"] },
      { id: "tools", type: "text", label: "SEO tools", placeholder: "Ahrefs, Semrush, Screaming Frog, GSC…" },
      { id: "implements", type: "radio", label: "Implemented fixes themselves?", options: ["Yes", "With developers", "No"] }
    ]
  },

  website_cro: {
    label: "Website & Conversion (CRO)", icon: "🌐", decay: "fast",
    what: "Running the website and improving conversion — CMS, landing pages, testing.",
    ask: [
      "Which CMS did you work in, and could you build pages yourself?",
      "Tell me about a conversion test you ran and what it changed."
    ],
    listen: "Hands-on CMS work, test design, and a conversion lift.",
    red: "Sent change requests to developers only.",
    capture: [
      { id: "cms", type: "chips", label: "CMS platforms",
        options: ["WordPress", "Webflow", "HubSpot CMS", "Drupal", "Shopify", "Sitecore", "AEM"] },
      { id: "scope", type: "chips", label: "What they did",
        options: ["Updated the website", "Built landing pages", "Managed developers", "A/B / CRO testing"] },
      { id: "tools", type: "text", label: "Testing / CRO tools", placeholder: "Optimizely, VWO, Hotjar…" }
    ]
  },

  marketing_analytics: {
    label: "Marketing Analytics & Attribution", icon: "📊", decay: "fast",
    what: "Measuring marketing — GA4, dashboards, funnel and pipeline reporting, attribution.",
    ask: [
      "What dashboards did you build, and which number did leadership watch?",
      "How did you attribute pipeline or revenue to marketing?"
    ],
    listen: "Built (not just read) reporting, an attribution model with its limits, and funnel metrics.",
    red: "Screenshots platform reports.",
    capture: [
      { id: "tools", type: "chips", label: "Tools",
        options: ["GA4", "Adobe Analytics", "Looker / Looker Studio", "Tableau", "Power BI", "Platform-native", "SQL"] },
      { id: "scope", type: "chips", label: "What they built",
        options: ["Campaign dashboards", "Executive reporting", "Funnel / pipeline reporting", "Multi-touch attribution", "Revenue reporting"] }
    ]
  },

  content_marketing: {
    label: "Content Marketing", icon: "📝", decay: "slow",
    what: "Creating or managing content — blogs, whitepapers, video, social.",
    ask: [
      "Can you send samples? Which pieces did you write yourself versus commission?",
      "How did you measure whether content worked?"
    ],
    listen: "Portfolio, creator-vs-editor clarity, and performance measures.",
    red: "No samples.",
    capture: [
      { id: "creates", type: "chips", label: "Content created", options: ["Blogs", "Whitepapers / ebooks", "Video", "Social content", "Case studies", "Newsletters"] },
      { id: "mode", type: "radio", label: "Created or managed", options: ["Created it themselves", "Managed freelancers / agency", "Both"] }
    ]
  },

  social_media: {
    label: "Social Media", icon: "💬", decay: "fast",
    what: "Organic and paid social, community, and influencers.",
    ask: [
      "Which platforms did you run, and what grew under you?",
      "Organic, paid, or both?"
    ],
    listen: "Platform-specific tactics and measured growth.",
    red: "Posted content with no strategy or metric.",
    capture: [
      { id: "scope", type: "chips", label: "Scope", options: ["Organic", "Paid", "Community management", "Influencers"] },
      { id: "platforms", type: "text", label: "Platforms", placeholder: "LinkedIn, Instagram, TikTok…" }
    ]
  },

  journeys_workflows: {
    label: "Workflows & Journeys", icon: "🔀", decay: "fast",
    what: "Building automated, multi-step customer journeys across channels.",
    ask: [
      "Describe the most complex journey you built — triggers, branches, channels.",
      "How did you test it before it went live?"
    ],
    listen: "Branching logic, exit criteria, multi-channel orchestration, and QA.",
    red: "Single-email triggers only.",
    capture: [
      { id: "complexity", type: "radio", label: "Most complex built", options: ["Complex multi-channel orchestration", "Multi-step nurtures", "Simple triggers"] },
      { id: "channels", type: "chips", label: "Channels", options: ["Email", "SMS", "Push", "Ads / retargeting", "Direct mail", "In-app"] }
    ]
  },

  lead_management: {
    label: "Lead Management & Scoring", icon: "🎯", decay: "fast",
    what: "Lead scoring, lifecycle stages, and the handoff from marketing to sales.",
    ask: [
      "How did your scoring model work, and how did you know it was right?",
      "What was the MQL-to-SQL process, and where did it break?"
    ],
    listen: "Behavioral + fit scoring, validated against conversion, and a sales SLA.",
    red: "Scoring built once and never reviewed.",
    capture: [
      { id: "scope", type: "chips", label: "What they owned",
        options: ["Lead scoring models", "Lifecycle stages", "MQL → SQL handoff", "Routing / assignment", "Marketing ↔ sales SLA"] }
    ]
  },

  marketing_data: {
    label: "Marketing Data & CRM Integration", icon: "🗄️", decay: "fast",
    what: "Data hygiene and CRM sync behind marketing automation — fields, dedupe, enrichment.",
    ask: [
      "How did your platform sync with the CRM, and what went wrong with it?",
      "What did you do about duplicates and data quality?"
    ],
    listen: "Sync architecture, field mapping, dedupe rules, and enrichment tools.",
    red: "Data was 'IT's problem'.",
    capture: [
      { id: "crm", type: "chips", label: "CRMs", options: ["Salesforce", "Microsoft Dynamics", "HubSpot CRM"] },
      { id: "work", type: "chips", label: "Data work",
        options: ["Sync / integrations", "Data hygiene / dedup", "Enrichment", "Field mapping / architecture"] }
    ]
  },

  segmentation: {
    label: "Segmentation & Personalization", icon: "🧬", decay: "fast",
    what: "Audience strategy — segments, dynamic content, personalization.",
    ask: [
      "Give me an example of a segment you built and what personalization it drove."
    ],
    listen: "Segment logic tied to a result.",
    red: "Uses first-name tokens only.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["List / segment strategy", "Dynamic content", "Personalization tokens", "Predictive / AI segments"] }
    ]
  },

  /* ---------------- UX / design ---------------- */

  user_research: {
    label: "User Research", icon: "🔬", decay: "slow",
    what: "Studying users — interviews, usability tests, surveys — and turning findings into design decisions.",
    ask: [
      "Walk me through a study you ran end to end — the question, the method, the participants, and what changed as a result.",
      "How did you synthesize findings?",
      "Were you a dedicated researcher or a designer who researches?"
    ],
    listen: "Method chosen for the question, recruiting, synthesis (affinity mapping, tagging), and a product decision that changed.",
    red: "Research that never changed anything; surveys only.",
    capture: [
      { id: "methods", type: "chips", label: "Methods",
        options: ["User interviews", "Usability testing", "Surveys", "Field studies", "Card sorting", "Diary studies", "A/B / experiments"] },
      { id: "dedicated", type: "radio", label: "Role", options: ["Dedicated researcher", "Designer who researches", "Split"] },
      { id: "tools", type: "text", label: "Research tools", placeholder: "Dovetail, UserTesting, Maze…" }
    ]
  },

  ui_design: {
    label: "Interaction & UI Design", icon: "🖌️", decay: "fast",
    what: "Designing screens and flows — wireframes to polished UI — usually in Figma.",
    ask: [
      "Take me through a case study in your portfolio: the problem, your process, and the shipped result.",
      "Which platforms have you designed for — web, iOS, Android, desktop?",
      "How did you work with engineers at handoff?"
    ],
    listen: "A portfolio with shipped work, process not just visuals, platform conventions (HIG, Material), and dev collaboration.",
    red: "Dribbble shots with no problem or outcome.",
    capture: [
      { id: "tools", type: "chips", label: "Design tools", options: ["Figma", "Sketch", "Adobe XD", "Framer"] },
      { id: "platforms", type: "chips", label: "Platforms", options: ["Responsive web", "iOS", "Android", "Desktop app"] },
      { id: "visual", type: "radio", label: "Strength", options: ["Highly polished visual / UI", "Balanced UX + UI", "Mostly UX / lower-fi"] },
      { id: "portfolio", type: "text", label: "Portfolio link", placeholder: "URL" }
    ]
  },

  design_prototyping: {
    label: "Design Prototyping", icon: "🧩", decay: "fast",
    what: "Building prototypes to test ideas or hand off — from wireflows to high-fidelity and in-engine prototypes.",
    ask: [
      "What fidelity did you usually prototype at, and what were the prototypes for?",
      "Show me (describe) your most advanced prototype."
    ],
    listen: "Fidelity matched to purpose, and advanced tooling if claimed.",
    red: "Static mockups only.",
    capture: [
      { id: "fidelity", type: "chips", label: "Fidelity", options: ["Low-fi / wireflows", "High-fi interactive", "Motion / advanced (Framer, code)", "In-engine / XR"] },
      { id: "tools", type: "text", label: "Prototyping tools", placeholder: "Figma, ProtoPie, Framer, ShapesXR…" }
    ]
  },

  design_systems: {
    label: "Design Systems", icon: "🧱", decay: "fast",
    what: "Building or contributing to a shared library of components, tokens, and guidelines.",
    ask: [
      "Did you build or own a design system, or use one? What was in it?",
      "How did you govern changes and get teams to adopt it?"
    ],
    listen: "Components, tokens, documentation, governance, and adoption metrics.",
    red: "Used a UI kit.",
    capture: [
      { id: "involvement", type: "radio", label: "Relationship to the system", options: ["Built / owned the system", "Contributed components", "Consumed an existing system"] },
      { id: "tokens", type: "radio", label: "Worked with design tokens?", options: ["Yes", "No"] }
    ]
  },

  information_architecture: {
    label: "Information Architecture", icon: "🗂️", decay: "slow",
    what: "Organizing content and navigation so people can find things.",
    ask: [
      "Tell me about a navigation or taxonomy you restructured. How did you validate it?"
    ],
    listen: "Card sorting / tree testing used to validate structure.",
    red: "Moved menu items by opinion.",
    capture: [
      { id: "activities", type: "chips", label: "Activities", options: ["Navigation / taxonomy", "Card sorting", "Tree testing", "Content modeling"] }
    ]
  },

  content_design: {
    label: "Content Design / UX Writing", icon: "✍️", decay: "slow",
    what: "Writing the words in the interface — labels, errors, onboarding, voice.",
    ask: [
      "Show me UX copy you wrote that measurably helped users."
    ],
    listen: "Examples with rationale and results.",
    red: "Marketing copy presented as UX writing.",
    capture: [
      { id: "scope", type: "radio", label: "Ownership", options: ["Owned UX writing", "Collaborated with a writer", "Not their area"] }
    ]
  },

  accessibility: {
    label: "Accessibility", icon: "♿", decay: "slow",
    what: "Making products usable by people with disabilities — WCAG, ARIA, screen readers, audits.",
    ask: [
      "What accessibility standard did you design or build to, and how did you test it?",
      "Tell me about an accessibility issue you found and fixed."
    ],
    listen: "WCAG level, screen-reader testing, automated + manual audits, and a specific fix.",
    red: "Accessibility = color contrast only.",
    capture: [
      { id: "level", type: "chips", label: "Standards", options: ["WCAG 2.1 / 2.2 AA", "WCAG AAA", "Section 508", "Best-effort"] },
      { id: "activities", type: "chips", label: "What they did",
        options: ["Accessible design from the start", "Semantic HTML / ARIA", "Screen-reader testing", "Automated a11y testing", "Audits / remediation"] }
    ]
  },

  /* ---------------- front-end ---------------- */

  html_css_styling: {
    label: "HTML / CSS & Styling", icon: "🎨", decay: "fast",
    what: "The craft of markup and styling — responsive layout, cross-browser, fidelity to design.",
    ask: [
      "How do you approach turning a Figma design into responsive CSS?",
      "What styling approach did your last codebase use, and would you choose it again?"
    ],
    listen: "Modern layout (grid/flex), responsive strategy, a styling approach with trade-offs, and design fidelity.",
    red: "Relies entirely on a component library without understanding CSS.",
    capture: [
      { id: "approach", type: "chips", label: "Styling approaches", options: ["CSS / SCSS", "Tailwind", "CSS-in-JS", "CSS Modules", "Component library"] },
      { id: "fidelity", type: "radio", label: "Design fidelity", options: ["Pixel-perfect", "Reasonable fidelity", "Not a focus"] }
    ]
  },

  typescript: {
    label: "TypeScript", icon: "🟦", decay: "fast",
    what: "Typed JavaScript — types, generics, typed API layers.",
    ask: [
      "How strict was your TypeScript config, and how did you type your API responses?",
      "Show me a generic you wrote."
    ],
    listen: "Strict mode, generics, typed API boundaries (zod, OpenAPI types).",
    red: "Uses `any` everywhere.",
    capture: [
      { id: "level", type: "radio", label: "Level", options: ["Strong", "Basic", "Minimal"] }
    ]
  },

  web_performance: {
    label: "Web Performance", icon: "⚡", decay: "fast",
    what: "Making web apps fast — Core Web Vitals, bundle size, rendering, caching.",
    ask: [
      "Tell me about a page you made faster. What did you measure, and what changed?"
    ],
    listen: "Measured before/after (LCP, INP, CLS, bundle size) and the technique used.",
    red: "Never measured performance.",
    capture: [
      { id: "focus", type: "chips", label: "Performance work",
        options: ["Core Web Vitals", "Bundle size", "Lazy loading / code splitting", "Rendering / SSR", "Caching"] }
    ]
  },

  build_tooling: {
    label: "Build Tooling & CI", icon: "🔧", decay: "fast",
    what: "Front-end build systems, monorepos, and CI pipelines.",
    ask: [
      "Did you set up or change the build tooling on your last project? Why?"
    ],
    listen: "Configured bundlers or monorepo tooling and CI for the front end.",
    red: "Never looked at the build config.",
    capture: [
      { id: "tools", type: "chips", label: "Tooling", options: ["Vite", "Webpack", "Turbopack", "esbuild", "Monorepo (Nx / Turborepo)", "CI/CD pipelines"] }
    ]
  },

  /* ---------------- GenAI creative ---------------- */

  image_generation: {
    label: "AI Image Generation", icon: "🎨", decay: "fast",
    what: "Creating images with AI tools — Midjourney, Stable Diffusion, Flux, Firefly — with control techniques.",
    ask: [
      "Which tools do you work in day to day, and what does your workflow look like from brief to final?",
      "How do you control composition — ControlNet, inpainting, references?",
      "Show me a series, not a single image."
    ],
    listen: "A repeatable workflow, control techniques, and a portfolio of series work.",
    red: "Single lucky images; one tool only; no control techniques.",
    capture: [
      { id: "tools", type: "chips", label: "Generation tools",
        options: ["Midjourney", "Stable Diffusion", "Flux", "Adobe Firefly", "DALL·E / GPT image", "Ideogram"] },
      { id: "control", type: "chips", label: "Control techniques",
        options: ["ControlNet", "Inpainting / outpainting", "Img2img", "Reference / style transfer", "Regional prompting"] },
      { id: "portfolio", type: "text", label: "Portfolio link", placeholder: "URL" }
    ]
  },

  prompt_craft: {
    label: "Prompt Craft & Consistency", icon: "✍️", decay: "fast",
    what: "Keeping characters and brand style consistent across many generations.",
    ask: [
      "How do you keep the same character or brand look across a campaign?",
      "Do you keep a prompt library or system?"
    ],
    listen: "Consistency techniques, documented prompt systems, and examples.",
    red: "Can't reproduce a look twice.",
    capture: [
      { id: "consistency", type: "radio", label: "Consistency shown", options: ["Recurring characters / brand", "Somewhat", "Not shown"] },
      { id: "systems", type: "radio", label: "Prompt system", options: ["Documented system", "Informal", "None"] }
    ]
  },

  creative_model_training: {
    label: "Creative Model Training (LoRA)", icon: "🧠", decay: "fast",
    what: "Training custom image models — LoRAs, embeddings — for brand or character consistency.",
    ask: [
      "What have you trained, on what dataset, and where did you run it?"
    ],
    listen: "Trained models with dataset curation and hardware or hosted pipeline.",
    red: "Downloads other people's LoRAs.",
    capture: [
      { id: "scope", type: "chips", label: "Training work",
        options: ["Training LoRAs", "Textual inversion / embeddings", "Fine-tuning base models", "Dataset curation"] },
      { id: "infra", type: "radio", label: "Pipeline", options: ["Runs their own pipeline", "Hosted services"] }
    ]
  },

  post_production: {
    label: "Post-Production & Editing", icon: "🖌️", decay: "slow",
    what: "Finishing AI output with traditional tools — Photoshop, After Effects, compositing.",
    ask: [
      "How much of your final output is raw generation versus edited? Show me a before/after."
    ],
    listen: "Traditional craft skills and before/after examples.",
    red: "Ships raw generations only.",
    capture: [
      { id: "tools", type: "chips", label: "Editing tools",
        options: ["Photoshop", "After Effects", "Illustrator", "DaVinci / Premiere", "Figma", "Nuke / compositing"] },
      { id: "finishing", type: "radio", label: "Manual finishing", options: ["Heavy", "Moderate", "Minimal"] }
    ]
  },

  ai_video: {
    label: "AI Video & Motion", icon: "🎬", decay: "fast",
    what: "Generating and editing video with AI — Runway, Sora, Veo, Kling.",
    ask: [
      "Send me your latest reel. Which tools, and what was shipped for a client?"
    ],
    listen: "A recent reel, shipped work, and editing craft.",
    red: "Only tool names; no reel.",
    capture: [
      { id: "tools", type: "chips", label: "Video tools", options: ["Runway", "Sora", "Veo", "Kling", "Pika", "Luma"] },
      { id: "scope", type: "chips", label: "Work", options: ["Short social clips", "Ads / commercials", "Animation", "VFX / compositing"] }
    ]
  },

  art_direction: {
    label: "Art Direction & Brand", icon: "🎯", decay: "slow",
    what: "Directing a visual look and other creatives, not just executing.",
    ask: [
      "Tell me about a visual direction you set and how you got others to execute it."
    ],
    listen: "Owned direction, led creatives, and pitched to stakeholders.",
    red: "Executor only.",
    capture: [
      { id: "scope", type: "chips", label: "Direction work",
        options: ["Owned the visual style", "Maintained brand consistency", "Directed other creatives", "Client / stakeholder pitching"] },
      { id: "level", type: "radio", label: "Level", options: ["Hands-on executor", "Player-coach", "Primarily director"] }
    ]
  },

  three_d_assets: {
    label: "3D Modeling & Assets", icon: "🧊", decay: "fast",
    what: "Creating 3D models and assets — Blender, Maya, Substance, photogrammetry, AI 3D generation.",
    ask: [
      "What 3D assets have you made, in which tools, and where did they end up?"
    ],
    listen: "Named tools, asset budgets (polys, textures), and destinations (engine, product viz).",
    red: "Imported asset-store models only.",
    capture: [
      { id: "tools", type: "chips", label: "3D tools",
        options: ["Blender", "Maya", "3ds Max", "Substance", "Photogrammetry / scanning", "AI 3D generation (Meshy / Luma)", "Spline"] },
      { id: "role", type: "radio", label: "Create or integrate", options: ["Created assets", "Integrated existing assets", "Both"] }
    ]
  },

  rights_ethics: {
    label: "Rights, Licensing & Ethics", icon: "⚖️", decay: "fast",
    what: "Usage rights for commercial generative work — IP-safe models, clearance, likeness, disclosure.",
    ask: [
      "How did you make sure AI output was safe to use commercially?"
    ],
    listen: "IP-safe tooling, clearance processes, and likeness/consent awareness.",
    red: "Never considered it.",
    capture: [
      { id: "concerns", type: "chips", label: "What they handled",
        options: ["Commercial-safe models", "Copyright / IP clearance", "Likeness / consent", "Disclosure requirements"] }
    ]
  },

  /* ---------------- AI-native building ---------------- */

  ai_coding_tools: {
    label: "AI Coding Tools", icon: "🤖", decay: "fast",
    what: "Building software by directing AI coding tools — Cursor, Claude Code, Copilot, v0, Lovable.",
    ask: [
      "Walk me through building your last feature with AI tools. How did you scope the task, and what did you have to correct?",
      "How do you review AI-generated code before shipping it?",
      "Which tools do you use for what?"
    ],
    listen: "Task scoping, reviewing and correcting output, agentic multi-file work, and knowing where tools fail.",
    red: "Accepts whatever the tool produces; can't explain the code it wrote.",
    capture: [
      { id: "tools", type: "chips", label: "Tools",
        options: ["Cursor", "Claude Code", "GitHub Copilot", "v0", "Lovable", "Replit Agent", "Bolt", "Windsurf"] },
      { id: "agentic", type: "radio", label: "Agentic depth", options: ["Drives multi-file agentic work", "Assisted / inline completions", "Light usage"] }
    ]
  },

  rapid_mvp: {
    label: "Rapid Prototyping / MVPs", icon: "⚡", decay: "fast",
    what: "Going from idea to working demo or MVP very fast.",
    ask: [
      "What's the fastest you've gone from idea to something users touched? Show me.",
      "How far did it go — demo, MVP, or production?"
    ],
    listen: "Shipped MVPs with links, and honesty about quality level.",
    red: "Only throwaway demos presented as products.",
    capture: [
      { id: "output", type: "radio", label: "Furthest they've taken it", options: ["Production features", "Working MVPs", "Demos / mockups"] },
      { id: "links", type: "text", label: "Things they've shipped", placeholder: "Links" }
    ]
  },

  product_sense: {
    label: "Product & Design Sense", icon: "✨", decay: "slow",
    what: "Deciding what to build and how it should feel — product judgment for builders.",
    ask: [
      "Tell me about a feature you decided NOT to build. Why?",
      "How did you get user feedback and act on it?"
    ],
    listen: "Prioritization reasoning, user feedback loops, and design ownership.",
    red: "Builds whatever is asked.",
    capture: [
      { id: "scope", type: "chips", label: "Product work", options: ["Defined what to build", "UI / UX decisions", "User feedback loops", "Prioritization"] }
    ]
  },

  fullstack_fundamentals: {
    label: "Full-Stack Fundamentals", icon: "🧱", decay: "fast",
    what: "The engineering fundamentals under AI-assisted building — data modeling, auth, debugging.",
    ask: [
      "Explain how auth works in the last app you built.",
      "Tell me about a bug the AI couldn't fix. How did you?"
    ],
    listen: "Can explain their own stack, and debugs without the tool.",
    red: "Relies entirely on AI to explain their code.",
    capture: [
      { id: "stack", type: "text", label: "Typical stack", placeholder: "Next.js, React, Node, Supabase, Postgres…" },
      { id: "depth", type: "radio", label: "Fundamentals shown", options: ["Strong CS / engineering fundamentals", "Solid working knowledge", "Relies on AI for most of it"] }
    ]
  },

  deploy_shipping: {
    label: "Deployment & Shipping", icon: "🚀", decay: "fast",
    what: "Getting apps live and keeping them running — hosting, deploys, environments.",
    ask: [
      "Where do your apps run, and who handles deploys and incidents?"
    ],
    listen: "Owns deploys, environments, and basic monitoring.",
    red: "Everything runs on localhost.",
    capture: [
      { id: "platforms", type: "chips", label: "Hosting", options: ["Vercel", "Netlify", "Replit", "Supabase", "Cloudflare", "AWS / GCP"] },
      { id: "ops", type: "radio", label: "Ownership", options: ["End to end", "With support", "No"] }
    ]
  },

  ai_output_review: {
    label: "Debugging & Reviewing AI Output", icon: "🔁", decay: "fast",
    what: "The quality discipline around AI-generated code — review, testing, version control, refactoring.",
    ask: [
      "What's your process before merging AI-written code?"
    ],
    listen: "Review, tests, small commits, and refactoring.",
    red: "No version control.",
    capture: [
      { id: "practices", type: "chips", label: "Practices", options: ["Code review of AI output", "Testing", "Version control discipline", "Refactoring"] }
    ]
  },

  /* ---------------- conversational AI ---------------- */

  conversation_design: {
    label: "Conversation Design", icon: "🗨️", decay: "slow",
    what: "Designing dialogue — flows, persona, fallbacks, and multilingual or voice experiences.",
    ask: [
      "Walk me through a conversation flow you designed, including how it failed gracefully.",
      "How did you define the bot's persona and tone?"
    ],
    listen: "Flow design, error and fallback handling, and persona guidelines.",
    red: "Happy-path scripts only.",
    capture: [
      { id: "scope", type: "chips", label: "Design work", options: ["Dialogue flows", "Persona / tone", "Error / fallback handling", "Multilingual", "Voice + chat"] },
      { id: "role", type: "radio", label: "Role", options: ["Dedicated conversation designer", "Designed and built", "Mostly built"] }
    ]
  },

  nlu_platforms: {
    label: "NLU / Intent Platforms", icon: "🎯", decay: "fast",
    what: "Classic intent-based bot platforms — Dialogflow, Rasa, Lex, Bot Framework.",
    ask: [
      "Which platform, and how did you manage intents and training data as the bot grew?"
    ],
    listen: "Intent design, training data management, and hybrid LLM approaches.",
    red: "Built one FAQ bot.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms",
        options: ["Dialogflow", "Rasa", "Microsoft Bot Framework / Copilot Studio", "Amazon Lex", "IBM watsonx", "Kore.ai"] }
    ]
  },

  bot_channels: {
    label: "Bot Channels & Voice", icon: "📱", decay: "fast",
    what: "Where bots live — web chat, WhatsApp, Teams, voice/IVR.",
    ask: [
      "Which channels did your bot run on? Any voice?"
    ],
    listen: "Channel-specific constraints and voice (ASR/TTS, latency) if claimed.",
    red: "Web widget only.",
    capture: [
      { id: "channels", type: "chips", label: "Channels", options: ["Web chat", "WhatsApp / SMS", "Slack / Teams", "Voice / IVR", "Mobile app", "Social DMs"] }
    ]
  },

  bot_analytics: {
    label: "Bot Analytics & Optimization", icon: "📊", decay: "fast",
    what: "Tuning bots after launch — containment, accuracy, CSAT, drop-off.",
    ask: [
      "What was your containment rate, and what did you change to improve it?"
    ],
    listen: "Metrics with a before/after.",
    red: "Launched and moved on.",
    capture: [
      { id: "scope", type: "chips", label: "What they tracked / improved",
        options: ["Containment / deflection", "Intent accuracy", "CSAT", "Drop-off analysis", "A/B testing"] }
    ]
  },

  ai_guardrails: {
    label: "AI Guardrails & Safety", icon: "🛡️", decay: "fast",
    what: "Protecting LLM products — hallucination control, PII, moderation, prompt-injection defense.",
    ask: [
      "What guardrails did you build, and what did they catch in production?"
    ],
    listen: "Specific controls, regulated-domain experience, and incidents caught.",
    red: "Trusts the model's default behavior.",
    capture: [
      { id: "concerns", type: "chips", label: "Controls built",
        options: ["Hallucination controls", "PII / privacy", "Content moderation", "Compliance (HIPAA / finance)", "Prompt-injection defense"] }
    ]
  },

  /* ---------------- XR ---------------- */

  xr_engine: {
    label: "XR Engine Development", icon: "🎮", decay: "fast",
    what: "Building immersive apps in Unity, Unreal, WebXR, or native frameworks.",
    ask: [
      "Which engine, and which shipped experiences can you show me?",
      "Walk me through the architecture of your last XR app."
    ],
    listen: "Shipped titles on real devices, engine depth, and language fluency (C#, C++).",
    red: "Tutorial projects only.",
    capture: [
      { id: "engine", type: "chips", label: "Engines", options: ["Unity", "Unreal", "WebXR (three.js / Babylon)", "Native (RealityKit / ARKit)"] },
      { id: "lang", type: "text", label: "Languages", placeholder: "C#, C++, Swift…" }
    ]
  },

  spatial_design: {
    label: "Spatial & Interaction Design", icon: "🖐️", decay: "fast",
    what: "Designing for 3D space — spatial UI, hand and controller input, locomotion, onboarding.",
    ask: [
      "How did you design interaction for hands or controllers, and how did you test it?"
    ],
    listen: "Shipped headset UX, input modalities, and user testing in-headset.",
    red: "2D UI placed in 3D.",
    capture: [
      { id: "scope", type: "chips", label: "Design work",
        options: ["Spatial UI / UX", "Hand / controller interaction", "Gaze / voice input", "Locomotion", "Onboarding / tutorials"] }
    ]
  },

  xr_platforms: {
    label: "XR Platforms & Hardware", icon: "📟", decay: "fast",
    what: "Target devices and SDKs — Quest, Vision Pro, HoloLens, mobile AR.",
    ask: [
      "Which devices have you shipped on, and what platform constraints mattered?"
    ],
    listen: "Named devices and SDKs with constraints handled.",
    red: "PC VR demos only.",
    capture: [
      { id: "devices", type: "chips", label: "Devices",
        options: ["Meta Quest", "Apple Vision Pro", "HoloLens", "Mobile AR (ARKit / ARCore)", "PCVR / SteamVR", "PlayStation VR"] }
    ]
  },

  xr_performance: {
    label: "XR Performance & Optimization", icon: "⚡", decay: "fast",
    what: "Hitting headset frame rates — draw calls, poly budgets, thermal, foveated rendering.",
    ask: [
      "What frame-rate target did you hit, on which device, and what did you optimize to get there?"
    ],
    listen: "Target fps on a standalone headset and the profiling behind it.",
    red: "Never profiled.",
    capture: [
      { id: "focus", type: "chips", label: "Optimization work",
        options: ["Frame rate / draw calls", "Poly / texture budgets", "Thermal / battery", "Foveated rendering", "Occlusion / LODs"] }
    ]
  },

  xr_comfort: {
    label: "XR Comfort & Accessibility", icon: "🌀", decay: "slow",
    what: "Preventing motion sickness and making XR accessible and comfortable.",
    ask: [
      "What did you do to reduce motion sickness in your last experience?"
    ],
    listen: "Comfort options, locomotion choices, and accessibility.",
    red: "Hadn't considered it.",
    capture: [
      { id: "scope", type: "chips", label: "Work done",
        options: ["Motion-sickness mitigation", "Comfort options", "Accessibility", "Ergonomics / session length"] }
    ]
  }

});
})();

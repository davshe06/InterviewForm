/* Digital & Marketing (TTS) — marketing, design, front-end, creative AI, conversational AI, and XR roles.
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

  digital_marketing_manager: {
    label: "Digital Marketing Manager",
    icon: "📈",
    tagline: "Full-funnel marketing generalist or channel lead",
    about: "A Digital Marketing Manager owns a company's online marketing — paid ads, email, SEO, social, and the analytics that tie it all to revenue. The exact mix varies enormously by company, which is why this intake pins down where they'll actually spend their time.",
    opener: "Walk me through the marketing mix you ran — channels, budget, and which number you were measured on.",
    coach: "This title means ten different jobs. Rate each channel separately — the pattern tells you performance marketer, lifecycle / marketing ops, or content and brand.",
    certs: ["Google Ads", "Meta Blueprint", "HubSpot", "GA4"],
    skills: [
      "paid_media",
      "ma_platform",
      "email_marketing",
      "seo",
      "website_cro",
      "marketing_analytics",
      "content_marketing",
      "social_media"
    ],
    profiles: [
      { skills: ["paid_media", "marketing_analytics"], profile: "Performance / growth marketer" },
      { skills: ["ma_platform", "email_marketing"], profile: "Marketing operations / lifecycle marketer" },
      { skills: ["content_marketing", "seo"], profile: "Content & brand marketer" }
    ],
    teammates: [
      { label: "SEO Specialist", skill: "seo" },
      { label: "Paid Media Manager", skill: "paid_media" },
      { label: "Marketing Automation Manager", skill: "ma_platform" },
      { label: "Designer" },
      { label: "Copywriter", skill: "content_marketing" },
      { label: "Web Developer", skill: "website_cro" },
      { label: "Analytics Team", skill: "marketing_analytics" }
    ],
    tools: [
      {
        id: "crm",
        label: "CRM",
        options: ["Salesforce", "HubSpot CRM", "Dynamics 365", "Zoho", "Pipedrive"]
      },
      { id: "creative", label: "Creative", options: ["Figma", "Adobe Creative Cloud", "Canva", "CapCut"] }
    ],
    aiUse: [
      "Content creation",
      "Email drafting",
      "SEO optimization",
      "Paid ad optimization",
      "Campaign reporting",
      "Personalization",
      "Image creation",
      "Workflow automation"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Jasper / Copy.ai",
      "Midjourney / DALL·E",
      "HubSpot AI",
      "Google Ads AI / PMax",
      "Canva AI",
      "SEO AI (Surfer / Clearscope)"
    ],
    metrics: [
      "Leads generated",
      "Pipeline",
      "Revenue",
      "ROAS",
      "Website traffic",
      "Conversions",
      "Email performance",
      "CAC",
      "MQLs",
      "SQLs",
      "Marketing ROI"
    ],
    environments: [
      "B2B",
      "B2C",
      "SaaS",
      "Agency",
      "Enterprise",
      "Startup",
      "E-commerce",
      "Manufacturing",
      "Healthcare",
      "Financial Services",
      "Retail"
    ]
  },

  ux_designer: {
    label: "UX Designer / Researcher",
    icon: "🎨",
    tagline: "Product design, interaction, and user research",
    about: "UX designers shape how digital products look, feel, and flow — from researching users to wireframes to polished interfaces, usually in Figma. Dedicated researchers focus on studying users; designers focus on crafting the experience.",
    opener: "Take me through a case study from your portfolio — the problem, your process, and what shipped.",
    coach: "UX spans pure research to pixel-level UI. The research-versus-design balance and design-system ownership decide the profile.",
    certs: ["NN/g UX Certification", "IAAP (accessibility)"],
    skills: [
      "user_research",
      "ui_design",
      "design_prototyping",
      "design_systems",
      "information_architecture",
      "content_design",
      "accessibility"
    ],
    profiles: [
      { skills: ["user_research", "accessibility"], profile: "UX Researcher (evaluative-leaning)" },
      { skills: ["ui_design", "design_prototyping"], profile: "Product / UX Designer" },
      { skills: ["design_systems", "ui_design"], profile: "Design Systems Designer" }
    ],
    teammates: [
      { label: "UX Researcher", skill: "user_research" },
      { label: "UI / Visual Designer", skill: "ui_design" },
      { label: "Content Designer / UX Writer", skill: "content_design" },
      { label: "Design System Lead", skill: "design_systems" },
      { label: "Front-End Developer" },
      { label: "Product Manager" }
    ],
    tools: [
      {
        id: "prototyping",
        label: "Prototyping",
        options: ["Figma", "Framer", "ProtoPie", "Principle", "Axure"]
      },
      { id: "handoff", label: "Handoff / dev", options: ["Figma Dev Mode", "Zeplin", "Storybook"] },
      {
        id: "analytics",
        label: "Product analytics",
        options: ["Amplitude", "Hotjar", "FullStory", "Mixpanel", "GA4"]
      },
      { id: "collab", label: "Collaboration", options: ["FigJam", "Miro", "Notion", "Confluence"] }
    ],
    aiUse: [
      "Design variations / ideation",
      "Research synthesis",
      "UX copy generation",
      "Rapid prototyping",
      "Image / asset generation",
      "Summarizing user feedback"
    ],
    aiTools: ["Figma AI", "ChatGPT / Claude", "Midjourney / DALL·E", "v0 / Lovable", "Dovetail AI", "UserTesting AI"],
    metrics: [
      "Usability scores (SUS)",
      "Task success rate",
      "Time on task",
      "Feature adoption",
      "Retention",
      "Conversion",
      "NPS / CSAT",
      "Accessibility compliance",
      "Design-system adoption"
    ],
    environments: [
      "B2B SaaS",
      "Consumer apps",
      "Enterprise software",
      "Agency / consultancy",
      "E-commerce",
      "Fintech",
      "Healthcare",
      "Startup",
      "Design studio"
    ]
  },

  marketing_automation: {
    label: "Marketing Automation Specialist",
    icon: "⚙️",
    tagline: "Platform ops, journeys, lead management, and data",
    about: "Marketing automation specialists run platforms like HubSpot and Marketo that send automated email journeys, score leads, and hand the best ones to sales. It's the operational engine behind modern marketing — part marketer, part systems administrator.",
    opener: "Which platform do you own, and what's the most complex thing you've built in it?",
    coach: "Platform and admin depth are the biggest filters. Separate campaign builders from instance owners and the marketing-ops engineers who own the CRM sync.",
    certs: ["Marketo Certified Expert", "HubSpot", "Salesforce Marketing Cloud", "Pardot / Account Engagement"],
    skills: [
      "ma_platform",
      "journeys_workflows",
      "lead_management",
      "marketing_data",
      "segmentation",
      "marketing_analytics"
    ],
    profiles: [
      { skills: ["ma_platform", "marketing_data"], profile: "Marketing Ops Engineer" },
      { skills: ["journeys_workflows", "lead_management"], profile: "Demand Gen / Lifecycle Marketer" },
      { skills: ["marketing_analytics", "marketing_data"], profile: "Marketing Ops Analyst" }
    ],
    teammates: [
      { label: "Email Marketer", skill: "journeys_workflows" },
      { label: "Demand Gen Manager", skill: "lead_management" },
      { label: "Salesforce / CRM Admin", skill: "marketing_data" },
      { label: "Data Analyst", skill: "marketing_analytics" },
      { label: "Content Marketer" },
      { label: "Web Developer" }
    ],
    tools: [
      {
        id: "data",
        label: "Data / CDP",
        options: ["Segment", "Snowflake", "ZoomInfo", "Clearbit", "Census"]
      },
      {
        id: "web",
        label: "CMS / landing pages",
        options: ["WordPress", "Unbounce", "Webflow", "HubSpot CMS", "Instapage"]
      },
      {
        id: "ads",
        label: "Ad platforms",
        options: ["Google Ads", "LinkedIn Ads", "Meta Ads", "Microsoft Ads"]
      }
    ],
    aiUse: [
      "Email drafting",
      "Subject-line optimization",
      "Segmentation",
      "Predictive lead scoring",
      "Content generation",
      "Workflow suggestions",
      "Reporting summaries"
    ],
    aiTools: [
      "HubSpot AI / Breeze",
      "Salesforce Einstein",
      "Marketo AI",
      "ChatGPT / Claude",
      "Predictive lead scoring",
      "Zapier AI / agents"
    ],
    metrics: [
      "MQLs",
      "SQLs",
      "Pipeline",
      "Conversion rates",
      "Email performance",
      "Deliverability",
      "Lead velocity",
      "Campaign ROI",
      "Data quality",
      "Funnel conversion"
    ],
    environments: [
      "B2B",
      "B2C",
      "SaaS",
      "Agency",
      "Enterprise",
      "Startup",
      "E-commerce",
      "Manufacturing",
      "Healthcare",
      "Financial Services"
    ]
  },

  digital_pm: {
    label: "Digital Project Manager",
    icon: "🗓️",
    tagline: "Delivery, agile, stakeholders, and budgets",
    about: "Digital project managers keep website, app, and campaign projects on schedule and on budget — coordinating designers, developers, clients, and vendors. Many also run agile/scrum delivery processes for their teams.",
    opener: "Tell me about a digital project you ran — the team, the budget, and how the launch went.",
    coach: "Separate scrum-focused delivery leads, client-facing agency PMs, and budget-owning program managers.",
    certs: ["PMP", "CSM", "PSM"],
    skills: ["project_delivery", "agile_scrum", "stakeholder_mgmt", "budget_vendor", "launch_cutover"],
    profiles: [
      { skills: ["agile_scrum", "project_delivery"], profile: "Agile Delivery Manager" },
      { skills: ["stakeholder_mgmt", "budget_vendor"], profile: "Client-facing / senior PM" },
      { skills: ["project_delivery", "budget_vendor"], profile: "Program / vendor-heavy PM" }
    ],
    teammates: [
      { label: "Scrum Master", skill: "agile_scrum" },
      { label: "Product Owner", skill: "agile_scrum" },
      { label: "Business Analyst" },
      { label: "Account Manager", skill: "stakeholder_mgmt" },
      { label: "Developer(s)" },
      { label: "Designer(s)" }
    ],
    tools: [
      {
        id: "roadmap",
        label: "Roadmapping",
        options: ["Aha!", "Productboard", "Roadmunk", "Jira Advanced Roadmaps"]
      },
      {
        id: "docs",
        label: "Docs / collaboration",
        options: ["Confluence", "Notion", "Google Workspace", "SharePoint"]
      },
      { id: "design", label: "Design / handoff", options: ["Figma", "Miro", "Adobe XD"] },
      { id: "analytics", label: "Analytics / reporting", options: ["GA4", "Looker", "Power BI", "Tableau"] },
      { id: "resource", label: "Time / resourcing", options: ["Harvest", "Float", "Smartsheet", "Monday"] }
    ],
    aiUse: [
      "Status reporting",
      "Meeting summaries",
      "Risk analysis",
      "Resource planning",
      "Documentation",
      "Timeline / estimate assistance"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Notion AI",
      "Jira AI / Atlassian Intelligence",
      "AI meeting notes (Otter / Fireflies)"
    ],
    metrics: [
      "On-time delivery",
      "On-budget delivery",
      "Scope adherence",
      "Team velocity",
      "Stakeholder satisfaction",
      "Defect / rework rate",
      "Utilization",
      "Launch success",
      "Cycle time"
    ],
    environments: ["Agency", "In-house", "B2B", "B2C", "SaaS", "E-commerce", "Enterprise", "Startup", "Consulting"]
  },

  frontend_developer: {
    label: "Front-End Developer",
    icon: "💻",
    tagline: "Framework, UI engineering, performance, and integration",
    about: "Front-end developers build the part of a website or web app that users see and interact with, using JavaScript frameworks like React. They turn designs into fast, responsive, accessible interfaces in the browser.",
    opener: "Which framework do you ship in, and what's a component or feature you're proud of?",
    coach: "Framework, TypeScript strength, and how far toward the backend they reach are the key filters.",
    certs: [],
    skills: [
      "frontend_framework",
      "html_css_styling",
      "typescript",
      "web_performance",
      "accessibility",
      "sw_testing",
      "api_integration",
      "build_tooling"
    ],
    profiles: [
      { skills: ["frontend_framework", "typescript"], profile: "Modern front-end engineer" },
      { skills: ["web_performance", "accessibility"], profile: "UX-focused front-end specialist" },
      { skills: ["frontend_framework", "api_integration"], profile: "Full-stack-leaning front-end" }
    ],
    teammates: [
      { label: "Back-End Developer", skill: "api_integration" },
      { label: "Full-Stack Developer", skill: "api_integration" },
      { label: "UI / UX Designer", skill: "html_css_styling" },
      { label: "DevOps Engineer", skill: "build_tooling" },
      { label: "QA Engineer", skill: "sw_testing" },
      { label: "Tech Lead" }
    ],
    tools: [
      {
        id: "ci",
        label: "Version control / CI",
        options: ["GitHub Actions", "GitLab CI", "CircleCI", "Azure DevOps"]
      },
      {
        id: "hosting",
        label: "Hosting / cloud",
        options: ["Vercel", "Netlify", "AWS", "Cloudflare", "Azure"]
      }
    ],
    aiUse: [
      "Code generation / completion",
      "Code review",
      "Test generation",
      "Debugging",
      "Documentation",
      "Refactoring"
    ],
    aiTools: ["GitHub Copilot", "Cursor", "Claude Code", "v0", "Vercel AI SDK", "OpenAI / Anthropic APIs"],
    metrics: [
      "Core Web Vitals",
      "Page load / Lighthouse",
      "Accessibility compliance",
      "Test coverage",
      "Bug / defect rate",
      "Sprint velocity",
      "Uptime",
      "Bundle size"
    ],
    environments: [
      "Agency",
      "Product company",
      "B2B SaaS",
      "Consumer apps",
      "E-commerce",
      "Fintech",
      "Enterprise",
      "Startup"
    ]
  },

  genai_artist: {
    label: "GenAI Artist",
    icon: "🖼️",
    tagline: "Generative image, video, and concept art with AI tooling",
    about: "GenAI artists create images, video, and other visuals using AI tools like Midjourney and Stable Diffusion. The skill is directing the AI — prompting, keeping characters and brand style consistent — then finishing the output with traditional tools like Photoshop.",
    opener: "Walk me through your workflow on a recent piece, from brief to final — which tools, and how much did you finish by hand?",
    coach: "Tool stack and technical depth (ControlNet, LoRA training) separate prompt artists from technical artists; art direction separates executors from directors.",
    certs: ["Adobe Certified Professional"],
    skills: [
      "image_generation",
      "prompt_craft",
      "creative_model_training",
      "post_production",
      "ai_video",
      "art_direction",
      "three_d_assets",
      "rights_ethics"
    ],
    profiles: [
      { skills: ["image_generation", "post_production"], profile: "Production GenAI artist" },
      { skills: ["creative_model_training", "three_d_assets"], profile: "Technical GenAI artist" },
      { skills: ["art_direction", "image_generation"], profile: "AI-fluent art director" }
    ],
    teammates: [
      { label: "Graphic / Visual Designer", skill: "post_production" },
      { label: "Motion Designer", skill: "ai_video" },
      { label: "Art Director", skill: "art_direction" },
      { label: "3D Artist", skill: "three_d_assets" },
      { label: "ML / AI Engineer", skill: "creative_model_training" },
      { label: "Brand / Creative Team" }
    ],
    tools: [
      {
        id: "workflow",
        label: "Workflow / pipeline",
        options: ["ComfyUI", "Automatic1111", "APIs / scripting", "Photoshop plugins"]
      },
      {
        id: "collab",
        label: "Collaboration / DAM",
        options: ["Figma", "Frame.io", "Notion", "Google Drive", "Air"]
      }
    ],
    aiUse: [
      "Concept / ideation",
      "Campaign creative",
      "Product / marketing visuals",
      "Storyboards",
      "Style exploration",
      "Video generation",
      "Asset variations",
      "Personalized creative"
    ],
    aiTools: [
      "Midjourney",
      "Stable Diffusion / Flux",
      "Runway / Sora",
      "ComfyUI",
      "Adobe Firefly",
      "ElevenLabs",
      "Custom LoRAs / fine-tuning"
    ],
    metrics: [
      "Output volume",
      "Turnaround time",
      "Creative approval rate",
      "Brand consistency",
      "Campaign performance",
      "Cost per asset",
      "Stakeholder satisfaction"
    ],
    environments: [
      "Agency",
      "Brand / in-house creative",
      "Entertainment / media",
      "Gaming",
      "E-commerce",
      "Advertising",
      "Startup",
      "Design studio"
    ]
  },

  vibe_coder: {
    label: "Vibe Coder",
    icon: "🛠️",
    tagline: "AI-native builder shipping fast with agentic coding tools",
    about: "A vibe coder builds software by directing AI coding tools (Cursor, Claude Code, v0) rather than hand-writing most of the code — turning ideas into working apps extremely fast. The best pair strong product instincts with enough engineering judgment to keep the AI's output solid.",
    opener: "Show me the last thing you built with AI tools — how long did it take, and what did you have to fix yourself?",
    coach: "Depth ranges from polished prototyper to production engineer. How they review and correct AI output is the strongest signal.",
    certs: [],
    skills: [
      "ai_coding_tools",
      "rapid_mvp",
      "product_sense",
      "fullstack_fundamentals",
      "deploy_shipping",
      "api_integration",
      "ai_output_review"
    ],
    profiles: [
      { skills: ["ai_coding_tools", "product_sense"], profile: "AI-native product builder" },
      {
        skills: ["fullstack_fundamentals", "deploy_shipping"],
        profile: "AI-accelerated full-stack engineer"
      },
      { skills: ["api_integration", "rapid_mvp"], profile: "Prototyper / hacker" }
    ],
    teammates: [
      { label: "Software Engineer", skill: "fullstack_fundamentals" },
      { label: "Product Manager", skill: "product_sense" },
      { label: "Designer", skill: "product_sense" },
      { label: "DevOps / Platform", skill: "deploy_shipping" },
      { label: "AI Engineer", skill: "api_integration" },
      { label: "Founder / Technical Lead" }
    ],
    tools: [
      {
        id: "ai",
        label: "AI / LLM APIs",
        options: ["Anthropic / Claude", "OpenAI", "Google Gemini", "LangChain", "Vercel AI SDK"]
      },
      {
        id: "automation",
        label: "Automation / glue",
        options: ["Zapier", "n8n", "Make", "Retool", "Airtable"]
      }
    ],
    aiUse: [
      "Building the app itself",
      "Prototyping features",
      "Debugging",
      "Refactoring",
      "Writing tests",
      "Wiring integrations",
      "Generating UI",
      "Product ideation"
    ],
    aiTools: [
      "Cursor",
      "Claude Code",
      "GitHub Copilot",
      "v0 / Lovable",
      "Replit Agent",
      "Anthropic / OpenAI APIs",
      "LangChain"
    ],
    metrics: [
      "Shipping velocity",
      "Time to prototype",
      "Features shipped",
      "Product outcomes",
      "User adoption",
      "Iteration speed",
      "Uptime / reliability"
    ],
    environments: [
      "Startup",
      "Founder / indie hacker",
      "Product company",
      "Agency",
      "Freelance",
      "Big tech",
      "Bootcamp / self-taught"
    ]
  },

  chatbot_developer: {
    label: "Chatbot Developer / Designer",
    icon: "💬",
    tagline: "Conversational AI, assistants, and LLM-powered agents",
    about: "Chatbot developers and designers build conversational AI — customer-service bots, virtual assistants, and voice agents. Today that usually means LLM-powered assistants connected to company knowledge and systems; the design side crafts the conversation flows and personality.",
    opener: "Tell me about a bot or assistant you shipped — who used it, and how well did it resolve conversations?",
    coach: "Separate conversation designers, classic NLU builders, and LLM / agent engineers.",
    certs: ["Google Dialogflow", "Microsoft Copilot Studio", "Rasa"],
    skills: [
      "conversation_design",
      "llm_apps",
      "nlu_platforms",
      "bot_channels",
      "api_integration",
      "bot_analytics",
      "ai_guardrails"
    ],
    profiles: [
      { skills: ["llm_apps", "api_integration"], profile: "Conversational AI engineer" },
      { skills: ["conversation_design", "bot_channels"], profile: "Conversation designer" },
      { skills: ["nlu_platforms", "bot_analytics"], profile: "Bot platform developer" }
    ],
    teammates: [
      { label: "Conversation Designer", skill: "conversation_design" },
      { label: "AI / ML Engineer", skill: "llm_apps" },
      { label: "NLU Engineer", skill: "nlu_platforms" },
      { label: "Backend Developer", skill: "api_integration" },
      { label: "UX Writer", skill: "conversation_design" },
      { label: "Data Analyst", skill: "bot_analytics" }
    ],
    tools: [
      {
        id: "data",
        label: "Data / vector store",
        options: ["Pinecone", "pgvector", "Elasticsearch", "Weaviate", "Redis"]
      }
    ],
    aiUse: [
      "The bot itself (core product)",
      "Intent generation",
      "Response drafting",
      "Test conversation generation",
      "Summarizing transcripts",
      "Knowledge-base retrieval",
      "Sentiment analysis"
    ],
    aiTools: [
      "Claude / Anthropic API",
      "OpenAI API",
      "LangChain / LangGraph",
      "RAG / vector DBs",
      "Voice AI (ElevenLabs / Vapi)",
      "Evals / guardrails tooling"
    ],
    metrics: [
      "Containment / deflection rate",
      "CSAT",
      "Intent accuracy",
      "Resolution rate",
      "Fallback rate",
      "Handoff rate",
      "Engagement",
      "Response latency"
    ],
    environments: [
      "SaaS",
      "Customer support / CX",
      "Enterprise",
      "Healthcare",
      "Financial Services",
      "E-commerce",
      "Agency",
      "Startup"
    ]
  },

  vr_ar_developer: {
    label: "VR / AR Designer / Developer",
    icon: "🥽",
    tagline: "Immersive, spatial, and mixed-reality experiences",
    about: "VR/AR developers and designers build immersive experiences for headsets like Meta Quest and Apple Vision Pro, and phone-based augmented reality — games, training simulations, product visualization. Most build in Unity or Unreal; designers focus on spatial UX.",
    opener: "Which immersive experiences have you shipped, and on which devices?",
    coach: "Engine, target device, and designer-versus-developer are the key filters.",
    certs: ["Unity Certified", "Unreal Engine"],
    skills: [
      "xr_engine",
      "spatial_design",
      "xr_platforms",
      "three_d_assets",
      "xr_performance",
      "xr_comfort",
      "design_prototyping"
    ],
    profiles: [
      { skills: ["xr_engine", "xr_performance"], profile: "XR / immersive developer" },
      { skills: ["spatial_design", "xr_comfort"], profile: "XR / spatial designer" },
      { skills: ["xr_engine", "three_d_assets"], profile: "Technical artist / generalist" }
    ],
    teammates: [
      { label: "Unity / Unreal Developer", skill: "xr_engine" },
      { label: "3D Artist", skill: "three_d_assets" },
      { label: "XR / Spatial Designer", skill: "spatial_design" },
      { label: "Technical Artist", skill: "xr_performance" },
      { label: "Product Manager" },
      { label: "QA (device testing)" }
    ],
    tools: [
      {
        id: "sdk",
        label: "XR SDKs",
        options: ["OpenXR", "ARKit", "ARCore", "MRTK", "XR Interaction Toolkit", "Meta XR SDK"]
      }
    ],
    aiUse: [
      "3D asset generation",
      "Code generation",
      "Environment / scene generation",
      "NPC / interaction logic",
      "Texture generation",
      "Prototyping"
    ],
    aiTools: [
      "AI 3D generation (Meshy / Luma)",
      "Unity Muse / Sentis",
      "GitHub Copilot",
      "NPC / dialogue AI (Inworld / Convai)",
      "Texture generation",
      "OpenAI / Anthropic APIs"
    ],
    metrics: [
      "Frame rate / performance",
      "Comfort / sickness scores",
      "Session length",
      "User engagement",
      "Crash / stability rate",
      "Load times",
      "Task completion"
    ],
    environments: [
      "Gaming / game studio",
      "Entertainment / media",
      "Enterprise / training",
      "Healthcare / simulation",
      "Product company",
      "Agency",
      "Startup",
      "Defense / aerospace"
    ]
  }
};

  window.FORMS.digital = {
    id: "digital",
    label: "Digital & Marketing",
    business: "tts",
    roles: ROLES,
    roleOrder: ["digital_marketing_manager","ux_designer","marketing_automation","digital_pm","frontend_developer","genai_artist","vibe_coder","chatbot_developer","vr_ar_developer"]
  };
})();

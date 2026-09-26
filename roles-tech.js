/* Tech & Engineering (TTS) — software, data, AI, cloud, security, QA, and enterprise-application roles.
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

  backend_engineer: {
    label: "Software Engineer (Backend)",
    icon: "🖥️",
    tagline: "Services, APIs, data, and system design",
    about: "Backend engineers build the server side of software — the APIs, business logic, and databases that power what users see. They design how systems store and move data, and keep services fast, secure, and reliable at scale.",
    opener: "Tell me about the most recent service you built or owned — what did it do, and what did you personally decide?",
    coach: "Language and system-design depth are the biggest filters. Separate someone who builds features in an existing service from someone who designed the service and carried it in production.",
    certs: ["AWS Certified Developer", "AWS Solutions Architect", "Azure Developer", "GCP Professional"],
    skills: [
      "backend_languages",
      "apis_services",
      "databases",
      "cloud_platforms",
      "system_design",
      "streaming_messaging",
      "sw_testing",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["backend_languages", "system_design"], profile: "Senior / staff backend engineer" },
      { skills: ["apis_services", "databases"], profile: "Core services / API engineer" },
      { skills: ["cloud_platforms", "system_design"], profile: "Cloud / distributed-systems engineer" }
    ],
    teammates: [
      { label: "Front-End Developer" },
      { label: "DevOps / SRE", skill: "cloud_platforms" },
      { label: "Data Engineer", skill: "databases" },
      { label: "QA Engineer", skill: "sw_testing" },
      { label: "Software Architect", skill: "system_design" },
      { label: "DBA", skill: "databases" }
    ],
    tools: [
      {
        id: "db",
        label: "Databases",
        options: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "MongoDB", "Redis", "DynamoDB", "Elasticsearch"]
      },
      {
        id: "cicd",
        label: "CI/CD & containers",
        options: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker", "Kubernetes", "ArgoCD", "Azure DevOps"]
      },
      {
        id: "observability",
        label: "Observability",
        options: ["Datadog", "Prometheus / Grafana", "New Relic", "ELK / OpenSearch", "Splunk", "OpenTelemetry"]
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
    aiTools: [
      "GitHub Copilot",
      "Cursor",
      "Claude Code",
      "OpenAI / Anthropic APIs",
      "LangChain",
      "RAG / vector DBs",
      "Agent frameworks / MCP"
    ],
    metrics: [
      "Uptime / SLA",
      "Latency / throughput",
      "Defect / escape rate",
      "Deployment frequency",
      "Code coverage",
      "Incident count",
      "Sprint velocity",
      "Cost efficiency"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Healthcare",
      "E-commerce",
      "Gaming"
    ]
  },

  fullstack_developer: {
    label: "Full-Stack Developer",
    icon: "🧩",
    tagline: "Front-end, back-end, and everything between",
    about: "Full-stack developers work across the whole application: the interface users see in the browser and the server logic and database behind it. They can ship a complete feature end to end, which makes them especially valuable to smaller teams and startups.",
    opener: "Walk me through a feature you shipped end to end — the UI, the API, and the data.",
    coach: "Full-stack always has a center of gravity. Rate front-end and back-end separately — the gap between them tells you which way they lean.",
    certs: ["AWS / Azure / GCP associate"],
    skills: ["frontend_framework", "backend_languages", "databases", "cloud_platforms", "ai_in_engineering"],
    profiles: [
      { skills: ["frontend_framework", "backend_languages"], profile: "True full-stack engineer" },
      { skills: ["backend_languages", "databases"], profile: "Back-end-leaning full-stack" },
      { skills: ["frontend_framework", "cloud_platforms"], profile: "Front-end / product engineer" }
    ],
    teammates: [
      { label: "Front-End Developer", skill: "frontend_framework" },
      { label: "Back-End Developer", skill: "backend_languages" },
      { label: "DevOps / SRE", skill: "cloud_platforms" },
      { label: "UI / UX Designer" },
      { label: "QA Engineer" },
      { label: "Product Manager" }
    ],
    tools: [
      {
        id: "db",
        label: "Databases",
        options: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Supabase"]
      },
      {
        id: "cloud",
        label: "Cloud / DevOps",
        options: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "GitHub Actions", "Terraform"]
      },
      {
        id: "testing",
        label: "Testing",
        options: ["Jest", "Vitest", "Playwright", "Cypress", "Testing Library", "JUnit"]
      },
      { id: "build", label: "Build tools", options: ["Vite", "Webpack", "Turborepo", "Nx", "esbuild"] }
    ],
    aiUse: ["Code generation", "Code review", "Test generation", "Documentation", "Debugging"],
    aiTools: [
      "GitHub Copilot",
      "Cursor",
      "Claude Code",
      "v0 / Lovable",
      "OpenAI / Anthropic APIs",
      "Vercel AI SDK",
      "RAG / vector DBs"
    ],
    metrics: ["Feature velocity", "Uptime", "Defect rate", "Core Web Vitals", "Test coverage", "Deployment frequency"],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "E-commerce",
      "Healthcare",
      "Agency"
    ]
  },

  mobile_developer: {
    label: "Mobile Developer",
    icon: "📱",
    tagline: "Native, cross-platform, and app delivery",
    about: "Mobile developers build apps for phones and tablets — natively for iPhone (Swift) or Android (Kotlin), or with cross-platform frameworks like React Native and Flutter that share one codebase. They handle app-store releases, device quirks, and mobile performance.",
    opener: "Which apps have you shipped to the App Store or Play Store, and what did you personally build in them?",
    coach: "iOS, Android, and cross-platform are separate pools. Establish platform and native-versus-cross-platform first, then release ownership.",
    certs: ["Google Associate Android Developer"],
    skills: [
      "mobile_native",
      "mobile_cross_platform",
      "mobile_ui",
      "api_integration",
      "mobile_release",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["mobile_native", "mobile_ui"], profile: "Native mobile engineer" },
      { skills: ["mobile_cross_platform", "api_integration"], profile: "Cross-platform mobile engineer" },
      { skills: ["mobile_native", "mobile_release"], profile: "Senior mobile engineer" }
    ],
    teammates: [
      { label: "iOS Developer", skill: "mobile_native" },
      { label: "Android Developer", skill: "mobile_native" },
      { label: "Back-End Developer", skill: "api_integration" },
      { label: "UI / UX Designer", skill: "mobile_ui" },
      { label: "QA Engineer", skill: "mobile_release" },
      { label: "DevOps Engineer" }
    ],
    tools: [
      {
        id: "backend",
        label: "Backend / API",
        options: ["REST", "GraphQL", "Firebase", "Supabase", "WebSockets", "gRPC"]
      },
      {
        id: "cicd",
        label: "CI/CD (mobile)",
        options: ["Fastlane", "Bitrise", "GitHub Actions", "App Center", "Codemagic"]
      },
      { id: "testing", label: "Testing", options: ["XCTest", "Espresso", "Appium", "Detox", "Maestro"] },
      {
        id: "analytics",
        label: "Analytics / crash",
        options: ["Firebase Analytics", "Crashlytics", "Sentry", "Amplitude", "Mixpanel"]
      }
    ],
    aiUse: ["Code generation", "Test generation", "Documentation", "Crash analysis"],
    aiTools: [
      "GitHub Copilot",
      "Cursor",
      "Core ML",
      "ML Kit",
      "On-device LLMs",
      "OpenAI / Anthropic APIs",
      "Firebase AI"
    ],
    metrics: [
      "App store rating",
      "Crash-free rate",
      "App performance / load time",
      "Release cadence",
      "Adoption / retention"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Consumer apps",
      "E-commerce",
      "Healthcare",
      "Gaming"
    ]
  },

  data_engineer: {
    label: "Data Engineer",
    icon: "🧱",
    tagline: "Pipelines, warehouses, streaming, and modeling",
    about: "Data engineers build the pipelines that collect, clean, and move data into warehouses where analysts and AI models can use it. Think of them as the plumbers of the data world — without them, dashboards and machine learning have nothing reliable to run on.",
    opener: "Walk me through a pipeline you built, from the source system to the table analysts used.",
    coach: "Warehouse platform and batch-versus-streaming are the biggest filters. Separate pipeline builders from analytics engineers (modeling) and platform owners.",
    certs: [
      "Snowflake SnowPro",
      "Databricks Data Engineer",
      "AWS Data Engineer",
      "Azure Data Engineer",
      "GCP Data Engineer"
    ],
    skills: [
      "data_pipelines",
      "data_warehouse",
      "streaming_messaging",
      "orchestration",
      "sql_data_modeling",
      "cloud_platforms",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["data_warehouse", "sql_data_modeling"], profile: "Analytics / warehouse engineer" },
      { skills: ["streaming_messaging", "cloud_platforms"], profile: "Streaming / real-time data engineer" },
      { skills: ["data_pipelines", "cloud_platforms"], profile: "Cloud data engineer" }
    ],
    teammates: [
      { label: "Data Scientist" },
      { label: "Analytics Engineer", skill: "sql_data_modeling" },
      { label: "ML Engineer" },
      { label: "Data Analyst" },
      { label: "Platform / DevOps Engineer", skill: "cloud_platforms" },
      { label: "DBA", skill: "data_warehouse" }
    ],
    tools: [
      {
        id: "processing",
        label: "Processing / compute",
        options: ["Spark", "Databricks", "Flink", "dbt", "Pandas", "Snowpark"]
      },
      {
        id: "streaming",
        label: "Streaming",
        options: ["Kafka", "Kinesis", "Pub/Sub", "Flink", "Spark Streaming"]
      },
      { id: "lang", label: "Languages", options: ["Python", "SQL", "Scala", "Java"] }
    ],
    aiUse: [
      "Pipeline / SQL generation",
      "Data documentation",
      "Anomaly detection",
      "Code review",
      "Data-quality checks",
      "Schema mapping"
    ],
    aiTools: [
      "Copilot / AI coding assistants",
      "OpenAI / Anthropic APIs",
      "Embeddings / vector DBs",
      "Feature stores",
      "Databricks AI",
      "dbt AI"
    ],
    metrics: [
      "Pipeline reliability / SLA",
      "Data freshness",
      "Data quality",
      "Cost efficiency",
      "Throughput / volume",
      "Incident count",
      "Time-to-data"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Healthcare",
      "E-commerce",
      "AdTech",
      "Gaming"
    ]
  },

  data_scientist: {
    label: "Data Scientist / ML Engineer",
    icon: "🤖",
    tagline: "Modeling, experimentation, and ML in production",
    about: "Data scientists analyze data to find patterns and build predictive models — forecasting churn, detecting fraud, powering recommendations. ML engineers are the more software-focused variant who put those models into production systems.",
    opener: "Tell me about a model you built that made it into production — or didn't, and why.",
    coach: "The split is research and analysis versus production ML engineering. Rate modeling and MLOps separately — their balance decides Data Scientist versus ML Engineer.",
    certs: ["AWS ML Specialty", "GCP ML Engineer", "Azure Data Scientist", "Databricks ML"],
    skills: [
      "ml_modeling",
      "ds_programming",
      "ml_frameworks",
      "mlops",
      "feature_engineering",
      "experimentation",
      "cloud_ml",
      "llm_apps"
    ],
    profiles: [
      { skills: ["ml_modeling", "experimentation"], profile: "Data Scientist (research-leaning)" },
      { skills: ["mlops", "ml_frameworks"], profile: "ML Engineer (production)" },
      { skills: ["feature_engineering", "cloud_ml"], profile: "Applied ML engineer" }
    ],
    teammates: [
      { label: "Data Engineer", skill: "feature_engineering" },
      { label: "ML Engineer", skill: "mlops" },
      { label: "Data Analyst" },
      { label: "Research Scientist", skill: "ml_modeling" },
      { label: "Backend Engineer" },
      { label: "Product Manager" }
    ],
    tools: [
      {
        id: "data",
        label: "Data / warehouse",
        options: ["Snowflake", "BigQuery", "Databricks", "Spark", "Redshift", "PostgreSQL"]
      },
      {
        id: "viz",
        label: "Notebooks / BI",
        options: ["Jupyter", "Databricks Notebooks", "Tableau", "Power BI", "Streamlit", "Hex"]
      }
    ],
    aiUse: [
      "Model prototyping",
      "Code generation",
      "Data labeling / synthetic data",
      "Literature / research assist",
      "Documentation",
      "Feature ideation"
    ],
    aiTools: [
      "Hugging Face",
      "OpenAI / Anthropic APIs",
      "LangChain",
      "Fine-tuning / LoRA",
      "RAG / vector DBs",
      "AutoML",
      "Copilot / AI coding assistants"
    ],
    metrics: [
      "Model accuracy / AUC",
      "Precision / recall",
      "Model latency",
      "Business impact / lift",
      "Experiment velocity",
      "Models in production",
      "Data quality"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Healthcare",
      "AdTech",
      "E-commerce",
      "Research lab"
    ]
  },

  ai_engineer: {
    label: "AI Engineer (GenAI / LLM)",
    icon: "🧠",
    tagline: "LLM apps, RAG, agents, and evaluation",
    about: "AI engineers build applications on top of large language models like Claude or GPT — chat assistants, document analysis, autonomous agents. The craft is prompting, connecting models to company data (RAG), and making the outputs reliable enough for production.",
    opener: "What have you built on top of an LLM that real users rely on?",
    coach: "The newest role — separate demo builders from people who shipped. Evaluation rigor and production experience are the strongest signals.",
    certs: ["AWS / Azure / GCP AI certifications"],
    skills: ["llm_apps", "llm_evaluation", "retrieval_rag", "model_finetuning", "llmops", "backend_languages"],
    profiles: [
      { skills: ["llm_apps", "retrieval_rag"], profile: "GenAI application engineer" },
      { skills: ["model_finetuning", "llmops"], profile: "ML / LLM platform engineer" },
      { skills: ["llm_evaluation", "llm_apps"], profile: "Applied AI engineer" }
    ],
    teammates: [
      { label: "ML Engineer", skill: "model_finetuning" },
      { label: "Data Scientist" },
      { label: "Backend Engineer", skill: "backend_languages" },
      { label: "Data Engineer", skill: "retrieval_rag" },
      { label: "MLOps Engineer", skill: "llmops" },
      { label: "Product Manager" }
    ],
    tools: [
      {
        id: "vectordb",
        label: "Vector DB / retrieval",
        options: ["Pinecone", "pgvector", "Weaviate", "Qdrant", "Chroma", "Elasticsearch / OpenSearch"]
      },
      {
        id: "mlops",
        label: "LLMOps / serving",
        options: ["LangSmith", "Weights & Biases", "AWS Bedrock", "Azure OpenAI", "vLLM", "Modal"]
      },
      { id: "cloud", label: "Cloud / GPU", options: ["AWS", "Azure", "GCP", "Modal", "Replicate", "RunPod"] },
      {
        id: "data",
        label: "Data / backend",
        options: ["PostgreSQL", "FastAPI", "Redis", "Node", "Supabase"]
      }
    ],
    aiUse: [
      "Code generation",
      "Eval automation",
      "Synthetic data generation",
      "Prompt testing",
      "Documentation",
      "Research / literature review"
    ],
    aiTools: [
      "Claude / Anthropic API",
      "OpenAI API",
      "LangChain / LangGraph",
      "LlamaIndex",
      "Hugging Face",
      "vLLM / model serving",
      "Agent frameworks / MCP",
      "Evals (LangSmith / Braintrust)"
    ],
    metrics: [
      "Response quality / eval score",
      "Latency",
      "Cost per query",
      "Hallucination / accuracy rate",
      "Adoption / usage",
      "Deployment velocity",
      "Retrieval precision"
    ],
    environments: [
      "AI / ML startup",
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Research lab",
      "Fintech",
      "Consulting / SI"
    ]
  },

  devops_sre: {
    label: "DevOps / SRE",
    icon: "♾️",
    tagline: "CI/CD, cloud, Kubernetes, and reliability",
    about: "DevOps and Site Reliability Engineers keep software shipping and running: they automate build-and-deploy pipelines, manage cloud infrastructure, and respond when systems go down. The goal is fast releases without outages.",
    opener: "Walk me through how code gets from a developer's laptop to production where you work now — and which parts of that you built.",
    coach: "DevOps leans build/deploy automation; SRE leans production reliability. Cloud, Kubernetes depth, and on-call history decide which.",
    certs: ["CKA / CKAD", "AWS DevOps Professional", "Azure DevOps Engineer", "Terraform Associate"],
    skills: [
      "cicd",
      "iac",
      "cloud_platforms",
      "containers_k8s",
      "observability",
      "reliability_oncall",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["iac", "cloud_platforms"], profile: "Cloud / platform engineer" },
      { skills: ["containers_k8s", "observability"], profile: "Kubernetes / SRE" },
      { skills: ["reliability_oncall", "observability"], profile: "Site Reliability Engineer" }
    ],
    teammates: [
      { label: "Cloud Architect", skill: "cloud_platforms" },
      { label: "Platform Engineer", skill: "iac" },
      { label: "Security Engineer" },
      { label: "Backend Developer" },
      { label: "Data / Infra Engineer" },
      { label: "IT / Sysadmin" }
    ],
    tools: [
      { id: "cloud", label: "Cloud", options: ["AWS", "Azure", "GCP", "Multi-cloud", "On-prem / hybrid"] },
      {
        id: "scripting",
        label: "Scripting / languages",
        options: ["Bash", "Python", "Go", "PowerShell", "TypeScript"]
      }
    ],
    aiUse: [
      "Pipeline / IaC generation",
      "Incident summarization",
      "Runbook generation",
      "Log / anomaly analysis",
      "Config review",
      "Documentation"
    ],
    aiTools: [
      "GitHub Copilot",
      "AIOps (Datadog / PagerDuty AI)",
      "K8sGPT / K8s AI tooling",
      "GPU infrastructure",
      "Inference serving (vLLM / Triton)",
      "OpenAI / Anthropic APIs"
    ],
    metrics: [
      "Uptime / SLA",
      "MTTR",
      "Deployment frequency",
      "Change failure rate",
      "Lead time for changes",
      "Incident count",
      "Cloud cost / efficiency"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Cloud-native",
      "Healthcare",
      "E-commerce",
      "MSP / managed services"
    ]
  },

  cloud_architect: {
    label: "Cloud Architect",
    icon: "☁️",
    tagline: "Cloud platform, solutions, migration, and cost",
    about: "Cloud architects design a company's overall cloud setup on AWS, Azure, or GCP — which services to use, how they fit together, and how to keep it secure and cost-effective. It's a senior, big-picture role that guides the engineers doing the hands-on build.",
    opener: "Describe the cloud environment you designed — accounts, networking, workloads — and the decisions you'd defend.",
    coach: "Architect-level means they made the decisions, not just implemented them. Establish primary cloud, hands-on versus design-only, and certifications.",
    certs: [
      "AWS Solutions Architect Professional",
      "Azure Solutions Architect Expert",
      "GCP Professional Cloud Architect",
      "TOGAF"
    ],
    skills: [
      "cloud_platforms",
      "system_design",
      "cloud_migration",
      "cloud_security",
      "finops",
      "ai_in_engineering",
      "iac"
    ],
    profiles: [
      { skills: ["cloud_platforms", "system_design"], profile: "Cloud solutions architect" },
      { skills: ["cloud_platforms", "cloud_migration"], profile: "Cloud migration architect" },
      { skills: ["cloud_security", "finops"], profile: "Cloud governance / FinOps architect" }
    ],
    teammates: [
      { label: "DevOps / SRE" },
      { label: "Cloud Engineer", skill: "cloud_platforms" },
      { label: "Security Engineer", skill: "cloud_security" },
      { label: "Solutions Architect", skill: "system_design" },
      { label: "Network Engineer" },
      { label: "Back-End Developer" }
    ],
    tools: [
      {
        id: "cloud",
        label: "Cloud platform",
        options: ["AWS", "Azure", "GCP", "Multi-cloud", "Hybrid / on-prem"]
      },
      { id: "iac", label: "IaC", options: ["Terraform", "CloudFormation", "Bicep", "Pulumi", "Ansible"] },
      {
        id: "arch",
        label: "Architecture / diagramming",
        options: ["Lucidchart", "draw.io", "C4 model", "Visio", "Miro"]
      },
      {
        id: "containers",
        label: "Containers / serverless",
        options: ["Kubernetes", "ECS / Fargate", "Lambda", "Azure Functions", "Cloud Run"]
      },
      {
        id: "security",
        label: "Security tools",
        options: ["IAM", "Wiz", "Prisma Cloud", "GuardDuty / Defender", "CSPM"]
      },
      {
        id: "cost",
        label: "Cost / FinOps",
        options: ["Cost Explorer", "CloudHealth", "Cloudability", "Azure Cost Management", "Kubecost"]
      }
    ],
    aiUse: ["Architecture assistance", "Documentation", "Cost analysis", "IaC generation"],
    aiTools: [
      "AWS Bedrock",
      "Azure OpenAI",
      "GCP Vertex AI",
      "SageMaker",
      "GPU / AI infrastructure",
      "RAG architectures",
      "Copilot / AI assistants"
    ],
    metrics: [
      "Cost savings",
      "Availability / uptime",
      "Migration success",
      "Well-Architected score",
      "Time-to-provision",
      "Security posture"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Healthcare",
      "Financial Services",
      "Government",
      "MSP / consulting"
    ]
  },

  security_engineer: {
    label: "Security Engineer",
    icon: "🔒",
    tagline: "AppSec, cloud, SecOps, IAM, and compliance",
    about: "Security engineers protect a company's systems and data from attack — securing code and cloud environments, managing who can access what, monitoring for threats, and meeting compliance standards like SOC 2 or HIPAA.",
    opener: "Which area of security do you work in day to day, and what's the most serious issue you've handled?",
    coach: "Security splits into AppSec, cloud, SecOps, IAM, GRC, and offensive — different careers. Establish the domain first.",
    certs: ["CISSP", "OSCP", "CCSP", "Security+", "CISM", "GIAC"],
    skills: [
      "appsec",
      "cloud_security",
      "secops_ir",
      "iam_zero_trust",
      "grc_compliance",
      "offensive_security",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["appsec", "cloud_security"], profile: "Application / cloud security engineer" },
      { skills: ["secops_ir", "iam_zero_trust"], profile: "SecOps / detection engineer" },
      { skills: ["offensive_security", "appsec"], profile: "Offensive security engineer" },
      { skills: ["grc_compliance", "iam_zero_trust"], profile: "Security / GRC analyst" }
    ],
    teammates: [
      { label: "Security Analyst", skill: "secops_ir" },
      { label: "Cloud Security Engineer", skill: "cloud_security" },
      { label: "Penetration Tester", skill: "offensive_security" },
      { label: "GRC Analyst", skill: "grc_compliance" },
      { label: "IAM Specialist", skill: "iam_zero_trust" },
      { label: "DevOps Engineer" }
    ],
    tools: [
      {
        id: "cloud",
        label: "Cloud security",
        options: ["Wiz", "Prisma Cloud", "Orca", "AWS Security Hub", "Microsoft Defender"]
      },
      {
        id: "appsec",
        label: "AppSec (SAST/DAST)",
        options: ["Snyk", "Checkmarx", "Veracode", "Burp Suite", "SonarQube", "GitHub Advanced Security"]
      },
      { id: "iam", label: "IAM", options: ["Okta", "Entra ID", "SailPoint", "CyberArk", "Ping"] },
      { id: "vuln", label: "Vulnerability mgmt", options: ["Tenable", "Qualys", "Rapid7", "CrowdStrike"] },
      { id: "scripting", label: "Scripting", options: ["Python", "PowerShell", "Bash", "KQL / SPL"] }
    ],
    aiUse: ["Threat detection", "Alert triage", "Code scanning", "Documentation", "Log analysis"],
    aiTools: [
      "Microsoft Security Copilot",
      "CrowdStrike Charlotte AI",
      "AI-driven SIEM",
      "LLM security / prompt-injection testing",
      "AI governance / model risk",
      "Copilot / AI coding assistants"
    ],
    metrics: [
      "Vulnerabilities remediated",
      "MTTD",
      "MTTR",
      "Compliance posture",
      "Incidents",
      "Patch time",
      "False-positive rate"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Healthcare",
      "Financial Services",
      "Government / Defense",
      "Critical infrastructure"
    ]
  },

  qa_engineer: {
    label: "QA / Test Engineer",
    icon: "✅",
    tagline: "Automation, manual, performance, and quality",
    about: "QA / Test engineers make sure software works before customers see it. Modern QA is mostly automation — writing code that tests the product continuously (Selenium, Playwright, Cypress) — alongside manual and performance testing.",
    opener: "What does your testing look like today — how much is automated, and did you build the framework?",
    coach: "The split is manual QA versus SDET automation engineering. Framework building and coding language are the level signals.",
    certs: ["ISTQB"],
    skills: [
      "test_automation",
      "manual_testing",
      "api_testing",
      "performance_testing",
      "test_ops",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["test_automation", "api_testing"], profile: "SDET / automation engineer" },
      { skills: ["performance_testing", "test_automation"], profile: "Performance / automation engineer" },
      { skills: ["manual_testing", "test_ops"], profile: "QA analyst / quality lead" }
    ],
    teammates: [
      { label: "SDET", skill: "test_automation" },
      { label: "Manual QA Analyst", skill: "manual_testing" },
      { label: "Automation Engineer", skill: "test_automation" },
      { label: "Performance Engineer", skill: "performance_testing" },
      { label: "DevOps Engineer", skill: "test_ops" },
      { label: "Developers" }
    ],
    tools: [
      {
        id: "management",
        label: "Test management",
        options: ["TestRail", "Zephyr", "Xray", "qTest", "Azure Test Plans"]
      },
      {
        id: "cicd",
        label: "CI/CD",
        options: ["Jenkins", "GitHub Actions", "GitLab CI", "Azure DevOps", "CircleCI"]
      },
      { id: "bugtracking", label: "Bug tracking", options: ["Jira", "Azure DevOps", "Linear", "Bugzilla"] }
    ],
    aiUse: ["Test generation", "Test-data generation", "Bug triage", "Documentation", "Log analysis"],
    aiTools: [
      "Testim",
      "Applitools",
      "mabl",
      "GitHub Copilot",
      "Self-healing tests (Playwright AI)",
      "LLM-based test generation"
    ],
    metrics: [
      "Defect detection rate",
      "Escaped defects",
      "Automation coverage %",
      "Test cycle time",
      "Release quality",
      "Flaky-test rate"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Healthcare",
      "E-commerce",
      "Gaming"
    ]
  },

  technical_pm: {
    label: "Technical Project / Program Manager",
    icon: "🗓️",
    tagline: "Delivery, agile, programs, and stakeholders",
    about: "Technical project and program managers keep software initiatives on track — plans, budgets, risks, and coordination across engineering teams, often running agile/scrum ceremonies. Program managers oversee several related projects at once.",
    opener: "Tell me about the largest initiative you delivered — how many teams, how long, and what went wrong?",
    coach: "Separate a single-team delivery lead or Scrum Master from a TPM coordinating many teams. Technical fluency is the other big filter.",
    certs: ["PMP", "CSM", "SAFe", "PMI-ACP"],
    skills: [
      "project_delivery",
      "program_mgmt",
      "agile_scrum",
      "technical_fluency",
      "stakeholder_mgmt",
      "budget_vendor",
      "risk_dependency",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["program_mgmt", "stakeholder_mgmt"], profile: "Technical Program Manager (TPM)" },
      { skills: ["program_mgmt", "budget_vendor"], profile: "Senior program / portfolio manager" },
      { skills: ["project_delivery", "technical_fluency"], profile: "Technical delivery / project manager" },
      { skills: ["agile_scrum", "project_delivery"], profile: "Agile delivery lead / Scrum Master" }
    ],
    teammates: [
      { label: "Scrum Master", skill: "agile_scrum" },
      { label: "Product Owner / Manager" },
      { label: "Business Analyst" },
      { label: "Engineering Manager" },
      { label: "Developers" },
      { label: "QA Engineer" }
    ],
    tools: [
      {
        id: "pm",
        label: "PM / ticketing",
        options: ["Jira", "Azure DevOps", "Asana", "Monday", "Smartsheet"]
      },
      {
        id: "roadmap",
        label: "Roadmapping",
        options: ["Aha!", "Productboard", "Jira Advanced Roadmaps", "Roadmunk"]
      },
      {
        id: "docs",
        label: "Docs / collaboration",
        options: ["Confluence", "Notion", "SharePoint", "Google Workspace"]
      },
      {
        id: "cicd",
        label: "Delivery / CI visibility",
        options: ["GitHub", "GitLab", "Jenkins dashboards", "Azure DevOps"]
      },
      {
        id: "reporting",
        label: "Reporting / analytics",
        options: ["Power BI", "Jira dashboards", "Tableau", "Excel"]
      },
      { id: "resourcing", label: "Resourcing / time", options: ["Smartsheet", "Float", "Tempo", "Harvest"] }
    ],
    aiUse: [
      "Status reporting",
      "Meeting summaries",
      "Risk analysis",
      "Resource planning",
      "Documentation",
      "Estimate assistance"
    ],
    aiTools: [
      "ChatGPT / Claude",
      "Microsoft Copilot (M365)",
      "Jira AI / Atlassian Intelligence",
      "Notion AI",
      "AI meeting notes (Otter / Fireflies)"
    ],
    metrics: [
      "On-time delivery",
      "On-budget delivery",
      "Scope adherence",
      "Team velocity",
      "Program / roadmap milestones",
      "Cross-team dependency health",
      "Stakeholder satisfaction",
      "Defect / escape rate",
      "Release cadence",
      "Cycle time"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Healthcare",
      "E-commerce",
      "Agency"
    ]
  },

  erp_consultant: {
    label: "ERP Consultant / Analyst",
    icon: "🏢",
    tagline: "Platform, modules, implementation, and integrations",
    about: "ERP (Enterprise Resource Planning) systems like SAP, Oracle, and Workday run a company's core operations — finance, HR, supply chain, payroll. ERP consultants configure, implement, and support these platforms, usually specializing in one platform and functional area.",
    opener: "Which ERP, which modules, and how many full implementations have you been through?",
    coach: "ERP is gated by platform, version, and module — an SAP FICO consultant doesn't cross into Workday HCM. Pin all three.",
    certs: [
      "SAP certification",
      "Oracle certification",
      "Workday certification",
      "NetSuite certification",
      "Microsoft Dynamics certification"
    ],
    skills: [
      "erp_platform",
      "erp_modules",
      "erp_implementation",
      "system_integrations",
      "erp_development",
      "business_analysis",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["erp_platform", "erp_modules"], profile: "Functional ERP consultant" },
      {
        skills: ["erp_development", "system_integrations"],
        profile: "Technical / techno-functional consultant"
      },
      { skills: ["erp_implementation", "business_analysis"], profile: "Implementation lead / BA" }
    ],
    teammates: [
      { label: "Functional Consultant", skill: "erp_modules" },
      { label: "Technical / ABAP Developer", skill: "erp_development" },
      { label: "Business Analyst", skill: "business_analysis" },
      { label: "Project Manager" },
      { label: "Integration Specialist", skill: "system_integrations" },
      { label: "Basis / Admin" }
    ],
    tools: [
      {
        id: "integration",
        label: "Integration / middleware",
        options: ["MuleSoft", "Boomi", "SAP PI/PO", "Informatica", "Workato", "Custom APIs"]
      },
      {
        id: "reporting",
        label: "Reporting / BI",
        options: ["SAP BW", "Power BI", "BI Publisher", "Tableau", "Crystal Reports"]
      },
      {
        id: "dev",
        label: "Development tools",
        options: ["ABAP", "Workflow", "BTP / extensions", "PL/SQL", "Power Platform"]
      },
      {
        id: "pm",
        label: "Project / ALM tools",
        options: ["Solution Manager", "Jira", "ServiceNow", "Azure DevOps"]
      }
    ],
    aiUse: [
      "Report / query generation",
      "Configuration assistance",
      "Documentation",
      "Test-case generation",
      "Data migration assist",
      "Requirements drafting"
    ],
    aiTools: [
      "SAP Joule",
      "Microsoft Copilot (Dynamics)",
      "Oracle AI",
      "UiPath / RPA",
      "Power Automate",
      "ChatGPT / Claude"
    ],
    metrics: [
      "On-time implementation",
      "On-budget delivery",
      "User adoption",
      "Defect / rework rate",
      "Process efficiency gains",
      "Ticket resolution time",
      "Go-live success"
    ],
    environments: [
      "Manufacturing",
      "Retail / CPG",
      "Financial Services",
      "Healthcare",
      "Public sector",
      "Consulting / SI",
      "Enterprise",
      "Pharma"
    ]
  },

  crm_developer: {
    label: "CRM Developer / Consultant",
    icon: "🔷",
    tagline: "Salesforce, Dynamics, and CRM platforms",
    about: "CRM developers and consultants customize platforms like Salesforce and Dynamics 365 that companies use to manage sales and customer service. They build the custom features, automations, and integrations that make the CRM fit how the business actually works.",
    opener: "Which CRM, which clouds, and what's the most complex thing you've built on it?",
    coach: "Admin (configuration), developer (code), and functional consultant are different profiles on the same platform. Establish config versus code first.",
    certs: [
      "Salesforce Administrator",
      "Salesforce Platform Developer I / II",
      "Salesforce Architect",
      "Dynamics 365 certification",
      "HubSpot certification"
    ],
    skills: [
      "crm_platform",
      "crm_clouds",
      "crm_config_admin",
      "crm_development",
      "system_integrations",
      "crm_data_reporting",
      "ai_in_engineering"
    ],
    profiles: [
      { skills: ["crm_platform", "crm_development"], profile: "CRM developer" },
      { skills: ["crm_platform", "crm_config_admin"], profile: "CRM admin / consultant" },
      {
        skills: ["system_integrations", "crm_development"],
        profile: "CRM technical / integration developer"
      },
      { skills: ["crm_clouds", "crm_config_admin"], profile: "Functional CRM consultant" }
    ],
    teammates: [
      { label: "CRM Admin", skill: "crm_config_admin" },
      { label: "CRM Developer", skill: "crm_development" },
      { label: "CRM / Functional Consultant", skill: "crm_clouds" },
      { label: "Integration Specialist", skill: "system_integrations" },
      { label: "Business Analyst" },
      { label: "Marketing Ops" }
    ],
    tools: [
      {
        id: "dev",
        label: "Dev tools",
        options: ["Apex", "Lightning Web Components", "C# plugins", "Power Platform", "JavaScript"]
      },
      {
        id: "integration",
        label: "Integration",
        options: ["MuleSoft", "Boomi", "REST APIs", "Zapier", "Middleware"]
      },
      {
        id: "reporting",
        label: "Reporting / BI",
        options: ["CRM Analytics", "Power BI", "Tableau", "Native reports"]
      },
      {
        id: "data",
        label: "Data tools",
        options: ["Data Loader", "dataloader.io", "Import Wizard", "ETL tools"]
      },
      {
        id: "devops",
        label: "DevOps / release",
        options: ["Salesforce DX", "Copado", "Gearset", "Azure DevOps", "Change sets"]
      }
    ],
    aiUse: ["Config assistance", "Code generation", "Report generation", "Documentation", "Data cleanup"],
    aiTools: [
      "Einstein / Agentforce",
      "Copilot Studio",
      "HubSpot AI",
      "ChatGPT / Claude",
      "Power Platform AI",
      "Agent builders"
    ],
    metrics: [
      "User adoption",
      "On-time delivery",
      "Data quality",
      "Automation / efficiency",
      "Defect rate",
      "Report usage"
    ],
    environments: [
      "Product company",
      "B2B SaaS",
      "Enterprise",
      "Startup",
      "Consulting / SI",
      "Fintech",
      "Financial Services",
      "Healthcare",
      "Manufacturing",
      "Nonprofit"
    ]
  }
};

  window.FORMS.tech = {
    id: "tech",
    label: "Tech & Engineering",
    business: "tts",
    roles: ROLES,
    roleOrder: ["backend_engineer","fullstack_developer","mobile_developer","data_engineer","data_scientist","ai_engineer","devops_sre","cloud_architect","security_engineer","qa_engineer","technical_pm","erp_consultant","crm_developer"]
  };
})();

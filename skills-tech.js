/* Tech & engineering skills. Several are shared with Digital roles (front-end
   framework, API integration, software testing, LLM apps) — they live here
   once and any role in any catalog can reference them. Shape: skills-shared.js. */
(function () {
  window.SKILLS = window.SKILLS || {};

Object.assign(window.SKILLS, {

  /* ---------------- software engineering ---------------- */

  backend_languages: {
    label: "Back-End Languages & Frameworks", icon: "🧬", decay: "fast",
    what: "The server-side language and framework they write production code in — Java, C#, Python, Go, Node.",
    ask: [
      "Which language have you written the most production code in over the last two years, and in what framework?",
      "Walk me through a service you built — what did it do, and what was the hardest bug you fixed in it?",
      "How do you structure a codebase so other engineers can work in it?"
    ],
    listen: "One clearly primary language with recent production use, a specific service and a real bug story, and opinions about structure (layers, modules, dependency injection).",
    red: "Lists six languages equally; examples are tutorials or school projects; can't name the framework version or libraries they used.",
    capture: [
      { id: "language", type: "chips", label: "Languages used in production",
        options: ["Java", "C# / .NET", "Python", "Go", "Node / TypeScript", "Ruby", "PHP", "Rust", "C++", "Kotlin", "Scala"] },
      { id: "framework", type: "text", label: "Frameworks", placeholder: "Spring Boot, .NET Core, Django, FastAPI, Express, Rails…" },
      { id: "primary", type: "text", label: "Primary language (most recent)", placeholder: "The one they'd pick for a take-home" }
    ]
  },

  apis_services: {
    label: "APIs & Services", icon: "🔌", decay: "fast",
    what: "Designing and building the APIs other systems call — REST, GraphQL, gRPC, events — and the service architecture behind them.",
    ask: [
      "Describe an API you designed. How did you version it, and how did you handle a breaking change?",
      "Have you worked in microservices, a monolith, or a migration between them? What was hard?",
      "How did you handle authentication, rate limiting, and errors in your APIs?"
    ],
    listen: "Versioning and backward-compatibility thinking, clear service boundaries, auth (OAuth/JWT), idempotency, and a monolith-vs-microservices trade-off they lived through.",
    red: "Only consumed APIs others built; 'microservices' with no mention of the pain; no idea how auth worked.",
    capture: [
      { id: "style", type: "chips", label: "API styles built", options: ["REST", "GraphQL", "gRPC", "Event-driven", "SOAP / legacy", "Webhooks"] },
      { id: "architecture", type: "chips", label: "Architectures worked in",
        options: ["Microservices", "Monolith", "Modular monolith", "Monolith → microservices migration", "Serverless"] }
    ]
  },

  databases: {
    label: "Databases & Data Access", icon: "🗄️", decay: "fast",
    what: "Working with the data layer — relational SQL, NoSQL stores, schema design, and performance.",
    ask: [
      "Which database did you know best, and how did you design the schema for your last feature?",
      "Tell me about a slow query you fixed. How did you find it and what did you change?",
      "When would you choose NoSQL over a relational database? Have you had to live with that choice?"
    ],
    listen: "Indexes, query plans (EXPLAIN), normalization trade-offs, migrations, transactions, and a concrete performance fix with numbers.",
    red: "Only uses an ORM and can't write or read raw SQL; never looked at a query plan.",
    capture: [
      { id: "sql", type: "chips", label: "Relational databases", options: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "SQLite"] },
      { id: "nosql", type: "chips", label: "NoSQL / other stores",
        options: ["MongoDB", "DynamoDB", "Redis", "Cassandra", "Elasticsearch", "Cosmos DB", "Firestore"] },
      { id: "scale", type: "radio", label: "Scale they worked at",
        options: ["High-scale / performance-critical", "Moderate", "Small / departmental"] }
    ]
  },

  cloud_platforms: {
    label: "Cloud Platforms", icon: "☁️", decay: "fast",
    what: "Hands-on work in AWS, Azure, or GCP — deploying, configuring, and operating services in the cloud.",
    ask: [
      "Which cloud do you know best, and which services did you use day to day?",
      "Did you deploy and operate your own infrastructure, or did a platform team do that for you?",
      "Tell me about a production issue that turned out to be a cloud configuration problem."
    ],
    listen: "Depth in one cloud with named services (e.g., ECS, Lambda, RDS, IAM, VPC), how they deployed, and an incident with a root cause. Certifications are a plus, not a substitute.",
    red: "Three clouds listed with no primary; only used the console; 'cloud' means someone else's pipeline.",
    capture: [
      { id: "cloud", type: "chips", label: "Clouds used", options: ["AWS", "Azure", "GCP", "On-prem / hybrid", "Multi-cloud"] },
      { id: "primary", type: "text", label: "Primary cloud and key services", placeholder: "e.g., AWS — ECS, Lambda, RDS, S3, IAM" },
      { id: "ownership", type: "radio", label: "Infrastructure ownership",
        options: ["Owned infra end to end", "Deployed own services", "Used a platform team's setup"] },
      { id: "certs", type: "chips", label: "Cloud certifications",
        options: ["AWS Associate", "AWS Professional / Specialty", "Azure Associate", "Azure Expert", "GCP Associate", "GCP Professional", "None"] }
    ]
  },

  system_design: {
    label: "System Design & Architecture", icon: "🏗️", decay: "fast",
    what: "Designing how systems fit together — service boundaries, scaling, reliability trade-offs, technology choices.",
    ask: [
      "Draw me (in words) the architecture of the last system you owned. Where did it break under load?",
      "Tell me about an architecture decision you made that you'd reverse today. Why?",
      "How did you get other engineers to agree to a design?"
    ],
    listen: "Trade-off reasoning (consistency vs availability, sync vs async, build vs buy), real scale numbers, a decision they'd reverse, and design docs/ADRs.",
    red: "Describes what someone else designed; answers are buzzwords without trade-offs; never wrote a design document.",
    capture: [
      { id: "scope", type: "chips", label: "Design work they did",
        options: ["Service-level design", "Cross-system architecture", "Scalability / distributed systems", "Event-driven design", "Serverless design", "Tech selection / standards", "Well-Architected reviews"] },
      { id: "ownership", type: "radio", label: "Decision ownership",
        options: ["Made architecture decisions", "Contributed to designs", "Followed existing patterns"] }
    ]
  },

  streaming_messaging: {
    label: "Streaming & Messaging", icon: "📨", decay: "fast",
    what: "Asynchronous and real-time data movement — queues, event streams, and change-data-capture (Kafka, Kinesis, RabbitMQ).",
    ask: [
      "What did you use a queue or stream for, and why not a direct call?",
      "How did you handle duplicate or out-of-order messages?",
      "What throughput and latency did your system run at?"
    ],
    listen: "Idempotency, ordering and partitioning, consumer lag, dead-letter queues, and real throughput numbers.",
    red: "Used Kafka 'because the company did'; never thought about duplicates or replay.",
    capture: [
      { id: "tech", type: "chips", label: "Technologies",
        options: ["Kafka", "RabbitMQ", "AWS SQS / SNS", "Kinesis", "Azure Service Bus / Event Hubs", "Pub/Sub", "Flink", "Spark Streaming", "Debezium / CDC"] },
      { id: "latency", type: "radio", label: "Latency they worked at", options: ["Sub-second real-time", "Near-real-time (minutes)", "Micro-batch"] }
    ]
  },

  sw_testing: {
    label: "Software Testing", icon: "🧪", decay: "fast",
    what: "How an engineer tests their own code — unit, integration, end-to-end — and keeps quality up without a QA team.",
    ask: [
      "What did your test pyramid look like on your last project? Roughly what coverage?",
      "Tell me about a bug a test caught before production — and one that got through.",
      "Which testing tools did you set up yourself?"
    ],
    listen: "A balance of unit/integration/E2E, named tools, mocking vs real dependencies, and tests running in CI.",
    red: "'QA handled testing'; no tests on their own code; coverage quoted as a goal in itself.",
    capture: [
      { id: "types", type: "chips", label: "Testing they wrote",
        options: ["Unit", "Integration", "Contract", "End-to-end", "Visual regression", "Load / performance", "TDD"] },
      { id: "tools", type: "text", label: "Testing tools", placeholder: "JUnit, pytest, Jest, Vitest, Playwright, Cypress…" }
    ]
  },

  ai_in_engineering: {
    label: "AI / GenAI in Their Work", icon: "🧠", decay: "fast",
    what: "How AI shows up in their technical work — from AI-assisted coding to shipping AI-powered features or running AI workloads.",
    ask: [
      "How do you use AI tools in your day-to-day work? Give me a recent example.",
      "Have you built anything that uses AI inside the product — not just to write code? What did it do?",
      "How do you check AI-generated output before you trust it?"
    ],
    listen: "A specific recent example, a clear line between using AI to work faster and building AI into products, and a review habit for AI output.",
    red: "Either 'I don't use it' with no curiosity, or claims to have built 'AI' when they only called a chatbot.",
    capture: [
      { id: "usage", type: "chips", label: "How AI factored in",
        options: ["AI-assisted coding (Copilot / Cursor / Claude Code)", "Building AI / LLM features", "Integrating AI / ML APIs", "RAG / vector search", "Serving ML / AI workloads (GPU / inference)", "AIOps / anomaly detection", "Securing AI systems", "Testing AI features", "Platform AI (Joule / Copilot / Agentforce)", "Managing AI / ML projects"] },
      { id: "depth", type: "radio", label: "Depth of AI work",
        options: ["Core part of their role", "Occasional / augmenting", "AI-assisted tooling only"] }
    ]
  },

  frontend_framework: {
    label: "Front-End Framework", icon: "⚛️", decay: "fast",
    what: "Building browser interfaces in a JavaScript framework — React, Vue, Angular, Svelte, Next.js.",
    ask: [
      "Which framework have you shipped the most in, and for how long?",
      "How did you manage state in your last app, and what would you change?",
      "Tell me about a component you built that other developers reused."
    ],
    listen: "One primary framework with recent production use, a state-management approach with trade-offs, and component design for reuse.",
    red: "Only jQuery or tutorials; can't explain re-renders or state flow; lists React and Angular as equally deep without evidence.",
    capture: [
      { id: "framework", type: "chips", label: "Frameworks used",
        options: ["React", "Next.js", "Vue", "Nuxt", "Angular", "Svelte / SvelteKit", "Remix"] },
      { id: "state", type: "text", label: "State management", placeholder: "Redux, Zustand, React Query, Pinia, NgRx…" },
      { id: "typescript", type: "radio", label: "TypeScript", options: ["Strong — typed codebases", "Some", "Not used"] }
    ]
  },

  api_integration: {
    label: "API & Service Integration", icon: "🔌", decay: "fast",
    what: "Wiring an app to the outside world — REST/GraphQL APIs, auth, payments, real-time, and third-party services.",
    ask: [
      "What third-party APIs have you integrated, and what broke first?",
      "How did you handle auth tokens, retries, and API errors in the client?",
      "Did you build any of the backend or API layer yourself?"
    ],
    listen: "Named integrations (Stripe, Auth0, Twilio, internal APIs), error and retry handling, token handling, and how far toward the backend they went.",
    red: "Copied example code without handling errors; no idea where secrets lived.",
    capture: [
      { id: "surface", type: "chips", label: "Integration surface",
        options: ["REST", "GraphQL", "BFF / API layer", "SSR / server components", "WebSockets / real-time", "Auth / identity", "Payments", "LLM / AI APIs", "Push notifications", "Offline / local storage", "CRM / ticketing systems", "Automation (Zapier / n8n)"] },
      { id: "backend", type: "radio", label: "Backend reach",
        options: ["Front-end / client only", "Light backend (Node / BFF / serverless)", "Full-stack"] },
      { id: "lang", type: "text", label: "Backend language / stack", placeholder: "Node, Python, Supabase, Firebase…" }
    ]
  },

  /* ---------------- mobile ---------------- */

  mobile_native: {
    label: "Native Mobile (iOS / Android)", icon: "📲", decay: "fast",
    what: "Building apps natively — Swift for iOS, Kotlin for Android.",
    ask: [
      "Which platform, and which apps have you shipped to the store? Can you share links?",
      "Walk me through how you handled app lifecycle and background work on that platform.",
      "What's changed on the platform in the last two years that you've adopted?"
    ],
    listen: "Store links, platform specifics (lifecycle, permissions, background tasks), and recent adoption (SwiftUI, Compose, new OS APIs).",
    red: "No shipped apps; claims deep iOS and Android equally without evidence.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms", options: ["iOS (Swift)", "iOS (Objective-C)", "Android (Kotlin)", "Android (Java)"] },
      { id: "apps", type: "text", label: "Apps shipped", placeholder: "Names / store links, user counts" }
    ]
  },

  mobile_cross_platform: {
    label: "Cross-Platform Mobile", icon: "🔀", decay: "fast",
    what: "One codebase for iOS and Android — React Native, Flutter, Kotlin Multiplatform.",
    ask: [
      "Which framework, and what did you have to drop to native code for?",
      "How did you handle performance and platform differences?",
      "Which apps did you ship with it?"
    ],
    listen: "Native modules or bridges they wrote, performance tuning, and shipped apps.",
    red: "Only Expo tutorials; never had to touch native code.",
    capture: [
      { id: "framework", type: "chips", label: "Frameworks", options: ["React Native", "Flutter", "Kotlin Multiplatform", "MAUI / Xamarin", "Ionic / Capacitor"] }
    ]
  },

  mobile_ui: {
    label: "Mobile UI Implementation", icon: "🎨", decay: "fast",
    what: "Turning designs into polished mobile screens with modern UI toolkits.",
    ask: [
      "Which UI toolkit did you use, and how close to the design did you get?",
      "How did you handle different screen sizes, dark mode, and accessibility?"
    ],
    listen: "SwiftUI/Compose fluency, adaptive layouts, and accessibility (Dynamic Type, TalkBack/VoiceOver).",
    red: "Pixel-pushing with no mention of accessibility or device variety.",
    capture: [
      { id: "toolkits", type: "chips", label: "UI toolkits", options: ["SwiftUI", "UIKit", "Jetpack Compose", "XML layouts", "Flutter widgets"] }
    ]
  },

  mobile_release: {
    label: "Mobile Performance & Release", icon: "🚀", decay: "fast",
    what: "Shipping and keeping apps healthy — store submissions, CI/CD, crash monitoring, and performance profiling.",
    ask: [
      "Who owned App Store / Play submissions, and what's the worst rejection you dealt with?",
      "What was your crash-free rate, and how did you improve it?",
      "How did your mobile CI/CD pipeline work?"
    ],
    listen: "Release ownership, crash-free numbers, profiling tools (Instruments, Android Profiler), and Fastlane/Bitrise pipelines.",
    red: "Someone else always released; no idea of crash metrics.",
    capture: [
      { id: "scope", type: "chips", label: "What they owned",
        options: ["App performance / profiling", "Mobile CI/CD (Fastlane etc.)", "App Store / Play submission", "Crash monitoring", "Automated testing"] }
    ]
  },

  /* ---------------- data ---------------- */

  data_pipelines: {
    label: "Data Pipelines & ETL / ELT", icon: "🔀", decay: "fast",
    what: "Building the pipelines that pull data from source systems, clean it, and load it into a warehouse.",
    ask: [
      "Walk me through a pipeline you built — sources, tooling, schedule, and where the data landed.",
      "How did you handle a source schema change or a late-arriving file?",
      "How did you test and monitor data quality?"
    ],
    listen: "Named tools (dbt, Airflow, Fivetran, Spark), idempotent loads, backfills, schema-change handling, and data-quality tests.",
    red: "Only ran jobs others built; no data-quality checks; 'the pipeline just worked'.",
    capture: [
      { id: "tools", type: "chips", label: "Pipeline tooling",
        options: ["dbt", "Airflow", "Fivetran / Airbyte", "Spark", "Custom Python", "Informatica / SSIS / legacy ETL", "Azure Data Factory", "Glue"] },
      { id: "pattern", type: "radio", label: "Pattern", options: ["ELT (transform in warehouse)", "ETL (transform in flight)", "Both"] }
    ]
  },

  data_warehouse: {
    label: "Data Warehouse / Lakehouse", icon: "🏛️", decay: "fast",
    what: "The central analytics platform — Snowflake, BigQuery, Databricks, Redshift, Synapse.",
    ask: [
      "Which platform did production run on, and what did you own in it?",
      "How big was it, and what did you do about cost or performance?",
      "How were access and environments (dev/prod) handled?"
    ],
    listen: "One production platform, data volumes, clustering/partitioning, cost controls, and access management.",
    red: "Lists every platform without a primary; no idea of data size or cost.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms",
        options: ["Snowflake", "BigQuery", "Databricks", "Redshift", "Synapse / Fabric", "SQL Server / on-prem"] },
      { id: "scale", type: "text", label: "Data scale", placeholder: "e.g., 40 TB, 2B rows/day" }
    ]
  },

  orchestration: {
    label: "Orchestration", icon: "🎛️", decay: "fast",
    what: "Scheduling and coordinating data jobs so they run in order and recover from failure.",
    ask: [
      "Which orchestrator did you use, and did you own it or just write DAGs in it?",
      "How did you handle retries, alerts, and backfills?"
    ],
    listen: "Owning the orchestrator vs authoring jobs, dependency design, retries, SLAs, and backfills.",
    red: "Cron jobs only, with no failure handling.",
    capture: [
      { id: "tools", type: "chips", label: "Orchestrators", options: ["Airflow", "Dagster", "Prefect", "dbt Cloud", "Step Functions", "Azure Data Factory", "Control-M"] }
    ]
  },

  sql_data_modeling: {
    label: "SQL & Data Modeling", icon: "📐", decay: "fast",
    what: "Writing strong SQL and designing analytics models — star schemas, marts, medallion layers.",
    ask: [
      "Explain the data model you built for your last analytics project. Why that shape?",
      "What's the most complex SQL you've written? Window functions? Recursive CTEs?",
      "How did you make sure metrics meant the same thing across reports?"
    ],
    listen: "Dimensional modeling vocabulary (facts, dimensions, grain), window functions, a semantic layer or metric definitions.",
    red: "SQL limited to SELECT/JOIN; can't explain grain.",
    capture: [
      { id: "approach", type: "chips", label: "Modeling approaches",
        options: ["Dimensional / star schema", "Data Vault", "One Big Table", "Medallion (bronze / silver / gold)", "Semantic layer / metrics"] },
      { id: "sql_depth", type: "radio", label: "SQL depth shown", options: ["Expert (window functions, optimization)", "Strong", "Moderate"] }
    ]
  },

  ml_modeling: {
    label: "ML Modeling", icon: "📊", decay: "fast",
    what: "Building predictive models — classification, forecasting, NLP, computer vision, recommendations.",
    ask: [
      "Walk me through a model you built: the business problem, the data, the approach, and how you measured success.",
      "How did you know it was good enough to ship? What metric, against what baseline?",
      "Tell me about a model that didn't work. What did you learn?"
    ],
    listen: "Problem framing, a baseline, the right metric for the problem (AUC, precision/recall, MAPE), leakage awareness, and business impact.",
    red: "Accuracy as the only metric; no baseline; only Kaggle-style work with no stakeholder.",
    capture: [
      { id: "types", type: "chips", label: "Modeling areas",
        options: ["Classical ML (regression / trees)", "Deep learning", "NLP", "Computer vision", "Recommenders", "Time series / forecasting", "GenAI / LLMs"] },
      { id: "depth", type: "radio", label: "Research or applied", options: ["Research / novel models", "Applied / proven techniques", "Mix"] }
    ]
  },

  ds_programming: {
    label: "Data Science Programming", icon: "🐍", decay: "fast",
    what: "The engineering side of data science — Python/R, notebooks vs production code, code quality.",
    ask: [
      "Is your code usually in notebooks or in a repo with tests? Who ran it after you?",
      "How did you package or hand off a model to engineering?"
    ],
    listen: "Version control, modules not just notebooks, tests, and a clean handoff.",
    red: "Everything lives in one notebook; no Git.",
    capture: [
      { id: "langs", type: "chips", label: "Languages / tools", options: ["Python", "R", "SQL", "Scala", "Jupyter", "pandas / numpy", "Polars"] },
      { id: "rigor", type: "radio", label: "Engineering rigor", options: ["Production-grade code", "Solid scripting", "Notebook-level"] }
    ]
  },

  ml_frameworks: {
    label: "ML Frameworks", icon: "🧠", decay: "fast",
    what: "The libraries models are built with — scikit-learn, PyTorch, TensorFlow, XGBoost, Hugging Face.",
    ask: [
      "Which framework do you reach for first, and why?",
      "Have you trained a deep-learning model yourself? On what hardware?"
    ],
    listen: "Framework choice matched to the problem, GPU training experience if deep learning is claimed.",
    red: "Claims deep learning but has only used pretrained APIs.",
    capture: [
      { id: "fw", type: "chips", label: "Frameworks",
        options: ["scikit-learn", "PyTorch", "TensorFlow / Keras", "XGBoost / LightGBM", "Hugging Face", "Spark MLlib"] }
    ]
  },

  mlops: {
    label: "MLOps & Model Deployment", icon: "🚀", decay: "fast",
    what: "Getting models into production and keeping them healthy — serving, pipelines, monitoring, retraining.",
    ask: [
      "How was your model served — batch, API, streaming? Who got paged when it broke?",
      "How did you detect drift, and what triggered retraining?",
      "Which MLOps tools did you set up?"
    ],
    listen: "A production deployment path, monitoring and drift detection, a registry (MLflow, SageMaker), and CI/CD for models.",
    red: "Handed a pickle file to engineering and never saw it again.",
    capture: [
      { id: "scope", type: "chips", label: "What they owned",
        options: ["Model serving / APIs", "Training pipelines", "Model monitoring / drift", "Feature stores", "CI/CD for ML", "Model registry"] },
      { id: "tools", type: "text", label: "MLOps tools", placeholder: "MLflow, Kubeflow, SageMaker, Vertex, W&B…" }
    ]
  },

  feature_engineering: {
    label: "Data Wrangling & Features", icon: "🧹", decay: "fast",
    what: "Getting, cleaning, and shaping data into model features — often most of the real work.",
    ask: [
      "Where did your training data come from, and what was wrong with it?",
      "Tell me about a feature that made a big difference."
    ],
    listen: "Source systems, cleaning decisions, leakage awareness, and a high-impact feature story.",
    red: "Data 'was provided clean'.",
    capture: [
      { id: "sources", type: "chips", label: "Data sources / scale",
        options: ["Warehouse (SQL)", "Big data (Spark)", "Streaming", "Unstructured (text / images)", "APIs / web data"] }
    ]
  },

  experimentation: {
    label: "Experimentation & Statistics", icon: "🔬", decay: "slow",
    what: "The science half — A/B tests, causal inference, and statistical rigor.",
    ask: [
      "Walk me through an A/B test you designed. How did you size it and decide it was done?",
      "Tell me about a result that looked significant but wasn't."
    ],
    listen: "Power/sample size, guardrail metrics, peeking problems, and causal-vs-correlational reasoning.",
    red: "Stopped tests when p < 0.05; can't explain statistical power.",
    capture: [
      { id: "scope", type: "chips", label: "Methods used",
        options: ["A/B testing", "Experiment design", "Causal inference", "Bayesian methods", "Statistical analysis"] }
    ]
  },

  cloud_ml: {
    label: "Cloud ML Platform", icon: "☁️", decay: "fast",
    what: "Managed ML platforms — SageMaker, Vertex AI, Azure ML, Databricks.",
    ask: [
      "Which platform did you train and deploy on, and what did you use it for?"
    ],
    listen: "Specific platform features used (pipelines, endpoints, feature store).",
    red: "Only notebooks hosted in the platform.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms", options: ["AWS SageMaker", "GCP Vertex AI", "Azure ML", "Databricks", "None / custom"] }
    ]
  },

  /* ---------------- AI engineering ---------------- */

  llm_apps: {
    label: "LLM Application Development", icon: "💬", decay: "fast",
    what: "Building products on top of large language models — assistants, copilots, agents, summarization — using prompts, tools, and company data.",
    ask: [
      "What LLM-powered thing have you shipped to real users? What did it do, and how many used it?",
      "Walk me through how a request flowed through it — prompt, retrieval, tools, model, output.",
      "What was the hardest reliability problem, and how did you fix it?"
    ],
    listen: "Real users, an end-to-end flow (retrieval, tool/function calling, structured output), a named model provider, and a reliability fix (evals, guardrails, fallbacks).",
    red: "Only demos or hackathon projects; 'prompt engineering' is the whole story; no idea how they'd measure quality.",
    capture: [
      { id: "apps", type: "chips", label: "What they built",
        options: ["RAG / knowledge assistants", "Chatbots / copilots", "Agents / tool-use", "Summarization / extraction", "Content generation", "Voice agents"] },
      { id: "techniques", type: "chips", label: "Techniques used",
        options: ["Prompt engineering", "RAG / knowledge base", "Function calling / tools", "Agents / multi-step", "Structured output", "Fine-tuning"] },
      { id: "providers", type: "chips", label: "Model providers",
        options: ["Anthropic (Claude)", "OpenAI", "Google (Gemini)", "Open models (Llama / Mistral)", "Azure OpenAI", "AWS Bedrock"] }
    ]
  },

  llm_evaluation: {
    label: "Prompting, Evaluation & Guardrails", icon: "🎯", decay: "fast",
    what: "Measuring and controlling LLM output quality — eval sets, automated scoring, guardrails, human review.",
    ask: [
      "How did you know a prompt change made things better and not worse?",
      "Describe your evaluation set — how was it built and how often did it run?",
      "What guardrails did you put around the model's output?"
    ],
    listen: "A maintained eval set, automated or LLM-as-judge scoring, regression runs on prompt changes, and concrete guardrails.",
    red: "'We tested it manually' — evaluation by vibes.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["Prompt design / optimization", "Eval frameworks / benchmarks", "LLM-as-judge", "Guardrails / safety", "Human-in-the-loop / feedback"] },
      { id: "rigor", type: "radio", label: "Evaluation rigor", options: ["Formal eval pipelines", "Some structured testing", "Ad hoc"] }
    ]
  },

  retrieval_rag: {
    label: "Retrieval & Vector Search (RAG)", icon: "🧲", decay: "fast",
    what: "Getting the right documents in front of the model — embeddings, vector databases, chunking, re-ranking.",
    ask: [
      "How did you chunk and embed your documents, and why that way?",
      "When retrieval returned the wrong thing, how did you find out and fix it?"
    ],
    listen: "Chunking strategy, hybrid search, re-ranking, and retrieval metrics (recall@k).",
    red: "Default chunk size, default embeddings, never measured retrieval.",
    capture: [
      { id: "vectordb", type: "chips", label: "Vector stores",
        options: ["Pinecone", "pgvector", "Weaviate", "Qdrant", "Chroma", "Elasticsearch / OpenSearch", "Milvus"] },
      { id: "techniques", type: "chips", label: "Retrieval techniques",
        options: ["Embeddings / semantic search", "Hybrid search", "Re-ranking", "Chunking strategy", "Knowledge graphs"] }
    ]
  },

  model_finetuning: {
    label: "Fine-Tuning & Model Training", icon: "🎓", decay: "fast",
    what: "Customizing models beyond prompting — LoRA/PEFT fine-tuning, preference tuning, distillation.",
    ask: [
      "What did you fine-tune, on what data, and did it beat the prompted baseline?",
      "What hardware and tooling did you train on?"
    ],
    listen: "A comparison against a prompted baseline, dataset curation, and training infrastructure.",
    red: "Fine-tuned because it sounded good; no comparison.",
    capture: [
      { id: "scope", type: "chips", label: "What they did",
        options: ["Fine-tuning (LoRA / PEFT)", "Preference tuning / RLHF", "Full training", "Distillation", "Dataset curation"] }
    ]
  },

  llmops: {
    label: "LLMOps / Production AI", icon: "🚀", decay: "fast",
    what: "Running LLM systems in production — serving, monitoring, cost and latency control, caching.",
    ask: [
      "What volume did your system handle, and what did a request cost?",
      "How did you monitor it in production, and what did you do about latency?"
    ],
    listen: "Requests per day, cost per request, tracing/observability (LangSmith, etc.), caching, and model routing.",
    red: "No idea of cost or volume.",
    capture: [
      { id: "scope", type: "chips", label: "What they owned",
        options: ["Deployment / serving", "Monitoring / tracing", "Cost / latency optimization", "Caching", "Guardrails in production", "GPU / inference infrastructure"] },
      { id: "scale", type: "text", label: "Scale", placeholder: "requests/day, users, latency" }
    ]
  },

  /* ---------------- DevOps / cloud / security ---------------- */

  cicd: {
    label: "CI/CD", icon: "🚚", decay: "fast",
    what: "Automated build, test, and deploy pipelines.",
    ask: [
      "Walk me through a pipeline you built — from commit to production.",
      "How did you handle rollbacks and database migrations in deploys?",
      "How long did a deploy take, and what did you do to speed it up?"
    ],
    listen: "Stages, environments, deploy strategies (blue/green, canary), rollback, and deploy-frequency numbers.",
    red: "Only maintained someone else's Jenkins job.",
    capture: [
      { id: "tools", type: "chips", label: "CI/CD tools",
        options: ["GitHub Actions", "GitLab CI", "Jenkins", "Azure DevOps", "CircleCI", "ArgoCD / GitOps", "Spinnaker"] },
      { id: "scope", type: "radio", label: "Build or maintain", options: ["Built / architected pipelines", "Maintained & improved", "Mix"] }
    ]
  },

  iac: {
    label: "Infrastructure as Code", icon: "📜", decay: "fast",
    what: "Defining infrastructure in code — Terraform, CloudFormation, Bicep, Pulumi.",
    ask: [
      "How did you structure your Terraform (or equivalent) — modules, state, environments?",
      "Tell me about a time a plan/apply went wrong. What happened?"
    ],
    listen: "Module design, remote state and locking, multi-environment patterns, drift, and a real failure story.",
    red: "Edits existing files only; never dealt with state.",
    capture: [
      { id: "tools", type: "chips", label: "IaC tools", options: ["Terraform", "CloudFormation", "Pulumi", "Bicep / ARM", "Ansible", "CDK"] },
      { id: "depth", type: "radio", label: "Depth", options: ["Owned / architected IaC", "Wrote modules", "Modified existing"] }
    ]
  },

  containers_k8s: {
    label: "Containers & Kubernetes", icon: "📦", decay: "fast",
    what: "Packaging apps in containers and running them on Kubernetes.",
    ask: [
      "Did you operate Kubernetes clusters or deploy to clusters someone else ran?",
      "Walk me through debugging a pod that kept restarting.",
      "How did you manage config, secrets, and upgrades?"
    ],
    listen: "Cluster operations (upgrades, autoscaling, networking), Helm, a crashloop debugging story, and secrets management.",
    red: "Wrote a Dockerfile once; 'K8s' means kubectl apply.",
    capture: [
      { id: "tech", type: "chips", label: "Technologies",
        options: ["Docker", "Kubernetes", "Helm", "EKS / AKS / GKE", "OpenShift", "Service mesh (Istio / Linkerd)", "ECS / Fargate"] },
      { id: "k8s_depth", type: "radio", label: "Kubernetes depth", options: ["Operated / tuned clusters", "Deployed to K8s", "Limited"] }
    ]
  },

  observability: {
    label: "Observability & Monitoring", icon: "📈", decay: "fast",
    what: "Metrics, logs, traces, and alerts — knowing what production is doing.",
    ask: [
      "What dashboards and alerts did you set up, and which one woke you up most?",
      "How did you cut alert noise?"
    ],
    listen: "Metrics/logs/traces distinction, SLO-based alerting, and alert-noise reduction.",
    red: "Only looked at dashboards others built.",
    capture: [
      { id: "tools", type: "chips", label: "Tooling",
        options: ["Prometheus / Grafana", "Datadog", "New Relic", "Splunk", "ELK / OpenSearch", "OpenTelemetry", "CloudWatch / Azure Monitor"] }
    ]
  },

  reliability_oncall: {
    label: "Reliability & On-call", icon: "🛡️", decay: "fast",
    what: "Keeping production up — SLOs, incident response, on-call, and postmortems.",
    ask: [
      "Tell me about the worst incident you worked. What was your role and what changed afterwards?",
      "Did you define SLOs or error budgets? How were they used?",
      "What was your on-call rotation like, and how do you feel about it now?"
    ],
    listen: "Incident command, a blameless postmortem with follow-through, SLOs that drove decisions, and an honest view of on-call.",
    red: "Never on call; incidents were 'handled by ops'. Also note if they refuse on-call entirely.",
    capture: [
      { id: "scope", type: "chips", label: "Reliability work",
        options: ["SLOs / error budgets", "Incident management", "On-call rotation", "Postmortems", "Chaos / resilience testing", "Capacity planning"] },
      { id: "oncall", type: "radio", label: "Willing to do on-call again?", options: ["Yes", "Occasionally", "No"] }
    ]
  },

  cloud_migration: {
    label: "Cloud Migration & Modernization", icon: "🚚", decay: "fast",
    what: "Moving systems to the cloud or modernizing them there — rehost, replatform, refactor.",
    ask: [
      "Tell me about a migration you led. How many workloads, which strategy, and what surprised you?",
      "How did you sequence it and handle cutover?"
    ],
    listen: "The 6 Rs (rehost/replatform/refactor…), wave planning, dependency mapping, and cutover.",
    red: "Moved one VM; greenfield only.",
    capture: [
      { id: "type", type: "chips", label: "Kinds of work",
        options: ["Data-center → cloud migration", "Re-platform / re-factor", "Greenfield cloud-native", "Cloud-to-cloud"] },
      { id: "role", type: "radio", label: "Their role", options: ["Led the migration", "Workstream / technical lead", "Contributor"] }
    ]
  },

  cloud_security: {
    label: "Cloud Security & Governance", icon: "🔐", decay: "fast",
    what: "Securing cloud environments — IAM, landing zones, posture management, guardrails, compliance.",
    ask: [
      "How did you structure accounts/subscriptions and IAM for least privilege?",
      "What posture or policy tooling did you use, and what did it catch?"
    ],
    listen: "Landing zones, least privilege, SCPs/policies, CSPM tools, and a real finding they remediated.",
    red: "Security was 'the security team's job'.",
    capture: [
      { id: "scope", type: "chips", label: "Scope",
        options: ["IAM / least privilege", "Landing zones", "CSPM / posture", "Network security", "Policy / guardrails", "Container / K8s security", "Compliance (SOC 2 / HIPAA)", "Cloud incident response"] }
    ]
  },

  finops: {
    label: "Cost & FinOps", icon: "💰", decay: "fast",
    what: "Controlling cloud spend — tagging, rightsizing, reservations, and cost reporting.",
    ask: [
      "What's the biggest cloud saving you delivered, and how?",
      "How did you allocate cost back to teams?"
    ],
    listen: "A dollar saving with the lever used (rightsizing, reserved instances, savings plans), and tagging/showback.",
    red: "No idea what the bill was.",
    capture: [
      { id: "scope", type: "chips", label: "FinOps work",
        options: ["Cost optimization", "Budgeting / forecasting", "Tagging / allocation", "Reserved / savings plans", "FinOps practice"] },
      { id: "savings", type: "text", label: "Largest saving", placeholder: "e.g., $400k/yr via rightsizing" }
    ]
  },

  appsec: {
    label: "Application Security", icon: "🛡️", decay: "fast",
    what: "Securing software as it's built — code review, SAST/DAST, threat modeling, secure SDLC.",
    ask: [
      "Walk me through a threat model you ran. What did it change?",
      "Tell me about a vulnerability you found in code and how it was fixed.",
      "How did you get developers to actually fix findings?"
    ],
    listen: "OWASP-level fluency, code reading ability, tooling in CI, and developer-relationship skills.",
    red: "Runs scanners and forwards reports without reading code.",
    capture: [
      { id: "scope", type: "chips", label: "AppSec work",
        options: ["SAST / DAST", "Secure code review", "Threat modeling", "Secure SDLC / DevSecOps", "SCA / dependencies"] },
      { id: "coding", type: "radio", label: "Coding ability", options: ["Strong (writes / reviews code)", "Some", "Minimal"] }
    ]
  },

  secops_ir: {
    label: "Security Operations & Incident Response", icon: "🚨", decay: "fast",
    what: "Detecting and responding to attacks — SIEM, threat hunting, incident response, forensics.",
    ask: [
      "Walk me through an incident you responded to, from alert to close.",
      "What detections did you write, and in what language (KQL, SPL)?"
    ],
    listen: "IR phases, detection engineering, SIEM query language, and containment decisions.",
    red: "Only triaged alerts from a queue; never wrote a detection.",
    capture: [
      { id: "scope", type: "chips", label: "SecOps work",
        options: ["SIEM / monitoring", "Detection engineering", "Threat hunting", "Incident response", "SOAR / automation", "Forensics"] },
      { id: "tools", type: "text", label: "SIEM / tools", placeholder: "Splunk, Sentinel, CrowdStrike…" }
    ]
  },

  iam_zero_trust: {
    label: "Identity & Access (IAM / Zero Trust)", icon: "🔑", decay: "fast",
    what: "Who can access what — SSO, MFA, privileged access, identity governance.",
    ask: [
      "What identity platform did you run, and what did you build on it?",
      "How did you handle joiner/mover/leaver and access reviews?"
    ],
    listen: "SSO/federation, PAM, access reviews, and lifecycle automation.",
    red: "Reset passwords; nothing more.",
    capture: [
      { id: "scope", type: "chips", label: "IAM work", options: ["SSO / federation", "MFA", "PAM", "Zero Trust", "IGA / access reviews"] }
    ]
  },

  grc_compliance: {
    label: "Security GRC & Compliance", icon: "📋", decay: "slow",
    what: "Security frameworks and audits — SOC 2, ISO 27001, PCI, HIPAA, NIST, FedRAMP.",
    ask: [
      "Which frameworks have you taken a company through, and what was your role in the audit?",
      "How did you collect evidence and track control gaps?"
    ],
    listen: "Named frameworks with audits completed, evidence collection, and gap remediation.",
    red: "Filled in questionnaires only.",
    capture: [
      { id: "frameworks", type: "chips", label: "Frameworks",
        options: ["SOC 2", "ISO 27001", "PCI DSS", "HIPAA", "NIST / CMMC", "FedRAMP", "GDPR"] }
    ]
  },

  offensive_security: {
    label: "Offensive Security / Pen Testing", icon: "🗡️", decay: "fast",
    what: "Attacking systems to find weaknesses — penetration testing and red teaming.",
    ask: [
      "Describe your favorite finding from an engagement — how you found it and how you reported it.",
      "Which certifications do you hold, and which labs or CTFs keep you sharp?"
    ],
    listen: "A specific exploit chain, clear reporting, and OSCP-level certification or equivalent practice.",
    red: "Only ran automated scanners.",
    capture: [
      { id: "scope", type: "chips", label: "Offensive work",
        options: ["Web app pentest", "Network pentest", "Red team", "Vulnerability assessment", "Bug bounty", "Cloud pentest"] }
    ]
  },

  /* ---------------- QA ---------------- */

  test_automation: {
    label: "Test Automation", icon: "🤖", decay: "fast",
    what: "Writing code that tests the product continuously — Selenium, Playwright, Cypress, Appium.",
    ask: [
      "Did you build the automation framework or write tests in an existing one? Describe its structure.",
      "How did you deal with flaky tests?",
      "What language did you write tests in?"
    ],
    listen: "Framework design (page objects, fixtures), flake reduction, parallelization, and a real coding language.",
    red: "Record-and-playback only; flaky tests 'just re-run'.",
    capture: [
      { id: "tools", type: "chips", label: "Frameworks / tools",
        options: ["Selenium", "Playwright", "Cypress", "Appium", "WebdriverIO", "Custom framework"] },
      { id: "language", type: "text", label: "Languages", placeholder: "Java, TypeScript, Python, C#" },
      { id: "scope", type: "radio", label: "Build or write", options: ["Built / architected frameworks (SDET)", "Wrote tests in an existing framework", "Mix"] }
    ]
  },

  manual_testing: {
    label: "Manual & Exploratory Testing", icon: "🔎", decay: "slow",
    what: "Human-led testing — test design, exploratory sessions, regression, UAT support.",
    ask: [
      "How did you decide what to test when time was short?",
      "Tell me about the best bug you found by exploring rather than following a script."
    ],
    listen: "Risk-based prioritization, test design techniques, and a clever exploratory find.",
    red: "Only executes scripts written by others.",
    capture: [
      { id: "scope", type: "chips", label: "Manual work", options: ["Exploratory", "Test case design", "Regression", "UAT support", "Accessibility testing"] }
    ]
  },

  api_testing: {
    label: "API Testing", icon: "🔌", decay: "fast",
    what: "Testing services directly through their APIs rather than the UI.",
    ask: [
      "How did you test an API — what did you check beyond the status code?",
      "Did you automate API tests in CI?"
    ],
    listen: "Schema/contract checks, negative tests, auth, and CI integration.",
    red: "Clicked through Postman manually only.",
    capture: [
      { id: "tools", type: "chips", label: "API testing tools", options: ["Postman", "REST Assured", "Karate", "SoapUI", "Pact", "Custom scripts"] }
    ]
  },

  performance_testing: {
    label: "Performance & Load Testing", icon: "⚡", decay: "fast",
    what: "Testing how a system behaves under load — throughput, latency, breaking points.",
    ask: [
      "Walk me through a load test you designed — the scenario, the target, and what you found.",
      "How did you tell whether the bottleneck was the app, the database, or the test itself?"
    ],
    listen: "Realistic workload modeling, targets, bottleneck analysis, and a finding that got fixed.",
    red: "Ran a JMeter script someone else wrote.",
    capture: [
      { id: "tools", type: "chips", label: "Performance tools", options: ["JMeter", "k6", "Gatling", "LoadRunner", "Locust"] }
    ]
  },

  test_ops: {
    label: "Test Ops & CI Integration", icon: "🚚", decay: "fast",
    what: "Running tests inside delivery pipelines — environments, test data, reporting.",
    ask: [
      "How did tests run in your pipeline, and who looked at the results?",
      "How did you manage test data and environments?"
    ],
    listen: "Tests gating merges, environment management, and test-data strategy.",
    red: "Tests run on their laptop before release.",
    capture: [
      { id: "scope", type: "chips", label: "What they owned", options: ["Tests in CI/CD", "Test environments", "Test data management", "Reporting / dashboards"] }
    ]
  },

  /* ---------------- technical PM ---------------- */

  technical_fluency: {
    label: "Technical Fluency (for PMs)", icon: "🧠", decay: "fast",
    what: "How deep a project/program manager goes technically — can they follow architecture debates and spot risk?",
    ask: [
      "Explain the architecture of the last system your team built, as you'd explain it to an executive.",
      "Tell me about a time you pushed back on an engineering estimate. What made you doubt it?",
      "Were you ever an engineer yourself?"
    ],
    listen: "Accurate architecture explanation, a well-founded estimate challenge, and domains they understand.",
    red: "Can't explain what the team built; defers every technical question.",
    capture: [
      { id: "level", type: "radio", label: "Technical depth",
        options: ["Former engineer / deeply technical", "Conversant with architecture & trade-offs", "Coordination-focused"] },
      { id: "domains", type: "chips", label: "Domains they understand",
        options: ["Cloud / infrastructure", "APIs / integrations", "Data / ML", "Mobile / web", "Security", "ERP / enterprise apps"] }
    ]
  },

  risk_dependency: {
    label: "Risk & Dependency Management", icon: "⚠️", decay: "slow",
    what: "Spotting risks and cross-team dependencies early, and managing releases and roadmaps around them.",
    ask: [
      "Tell me about a risk you saw coming before anyone else. What did you do?",
      "How did you track dependencies between teams?"
    ],
    listen: "Early-warning habits, a dependency map or board, and a mitigated risk with a result.",
    red: "Risks were 'escalated' and then someone else's problem.",
    capture: [
      { id: "scope", type: "chips", label: "What they managed",
        options: ["Risk management", "Cross-team dependencies", "Release / launch management", "Roadmap / planning"] }
    ]
  },

  /* ---------------- ERP / CRM ---------------- */

  erp_platform: {
    label: "ERP Platform", icon: "🧭", decay: "fast",
    what: "Deep knowledge of one ERP — SAP, Oracle, Workday, NetSuite, Dynamics — including the version.",
    ask: [
      "Which ERP and version do you know best? How many years hands-on?",
      "Have you worked on S/4HANA (or the cloud version of your platform)? In what capacity?",
      "Which certifications do you hold?"
    ],
    listen: "One platform, the exact version (ECC vs S/4, EBS vs Fusion, F&O vs BC), and certifications.",
    red: "'SAP' without a module or version; experience only as an end user.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms",
        options: ["SAP", "Oracle (EBS / Fusion)", "Workday", "NetSuite", "Microsoft Dynamics 365", "Infor", "JD Edwards"] },
      { id: "version", type: "text", label: "Versions / editions", placeholder: "e.g., S/4HANA 2022, ECC 6.0, D365 F&O" },
      { id: "certified", type: "radio", label: "Certified on the platform?", options: ["Yes", "No"] }
    ]
  },

  erp_modules: {
    label: "ERP Functional Modules", icon: "🧩", decay: "fast",
    what: "The business area they configure within the ERP — finance, supply chain, HCM, procurement, manufacturing.",
    ask: [
      "Which modules have you configured, and what's one configuration decision you made in each?",
      "Were you functional, technical, or both?"
    ],
    listen: "Specific configuration (e.g., FI/CO org structure, MM pricing), and a clear functional/technical identity.",
    red: "Module list with no configuration examples.",
    capture: [
      { id: "modules", type: "chips", label: "Modules",
        options: ["Finance (FICO / GL)", "Supply chain / SCM", "HCM / HR / Payroll", "Procurement", "Manufacturing / PP", "Sales / OTC", "Projects / PS"] },
      { id: "type", type: "radio", label: "Functional or technical", options: ["Functional", "Technical", "Techno-functional"] }
    ]
  },

  erp_development: {
    label: "ERP Technical Development", icon: "💻", decay: "fast",
    what: "Code inside the ERP — ABAP, extensions, reports, workflow.",
    ask: [
      "What have you built in code on the platform? Reports, interfaces, extensions?",
      "How did you handle transports / releases and upgrades?"
    ],
    listen: "Named objects built (RICEFW), extension frameworks (BTP), and release handling.",
    red: "Tweaked reports only.",
    capture: [
      { id: "skills", type: "chips", label: "Development skills",
        options: ["ABAP", "BTP / extensions", "Custom reports (SQR / BI Publisher)", "Workflow", "PL/SQL", "X++", "Scripting"] }
    ]
  },

  crm_platform: {
    label: "CRM Platform", icon: "🧭", decay: "fast",
    what: "Deep knowledge of one CRM — Salesforce, Dynamics 365, HubSpot, ServiceNow.",
    ask: [
      "Which CRM and how many years? Which certifications do you hold?",
      "What's the most complex org you've worked in — users, objects, integrations?"
    ],
    listen: "Platform depth, named certifications (Admin, PD1/PD2, Architect), and org complexity.",
    red: "Only a user of the CRM.",
    capture: [
      { id: "platform", type: "chips", label: "Platforms", options: ["Salesforce", "Microsoft Dynamics 365", "HubSpot", "ServiceNow", "Oracle / SAP CRM"] },
      { id: "certs", type: "text", label: "Certifications", placeholder: "e.g., Salesforce Admin, PD1, App Builder" }
    ]
  },

  crm_clouds: {
    label: "CRM Clouds / Modules", icon: "🧩", decay: "fast",
    what: "The specific CRM product areas — Sales Cloud, Service Cloud, Marketing Cloud, CPQ, Field Service.",
    ask: [
      "Which clouds have you implemented, and what business process did each support?"
    ],
    listen: "Named clouds tied to processes (lead-to-cash, case management).",
    red: "Assumes Marketing Cloud is the same as core Salesforce.",
    capture: [
      { id: "modules", type: "chips", label: "Clouds / modules",
        options: ["Sales Cloud", "Service Cloud", "Marketing Cloud", "Experience Cloud", "CPQ / Revenue", "Field Service", "Commerce"] }
    ]
  },

  crm_config_admin: {
    label: "CRM Configuration & Admin", icon: "🔧", decay: "fast",
    what: "No-code/low-code CRM work — flows, objects, security, reports.",
    ask: [
      "Walk me through the most complex Flow (or workflow) you built.",
      "How did you design the security model — profiles, permission sets, sharing?"
    ],
    listen: "Flow design with error handling, a coherent security model, and data model changes.",
    red: "Only page layouts and reports.",
    capture: [
      { id: "scope", type: "chips", label: "Declarative work",
        options: ["Flows / automation", "Objects / schema", "Security / profiles / permissions", "Reports / dashboards", "Release management"] }
    ]
  },

  crm_development: {
    label: "CRM Development", icon: "💻", decay: "fast",
    what: "Code on the CRM platform — Apex, Lightning Web Components, Dynamics plugins.",
    ask: [
      "Show me (describe) something you built in code. Why code instead of configuration?",
      "How did you handle governor limits and testing?"
    ],
    listen: "Bulkified Apex, LWC components, test classes, and a reasoned code-vs-config choice.",
    red: "Copied code from forums; no tests.",
    capture: [
      { id: "skills", type: "chips", label: "Development skills",
        options: ["Apex", "Lightning Web Components", "Visualforce", "Dynamics plugins / C#", "JavaScript", "Salesforce DX / CI"] }
    ]
  },

  crm_data_reporting: {
    label: "CRM Data & Reporting", icon: "📊", decay: "fast",
    what: "CRM data quality, migrations, and reporting/analytics.",
    ask: [
      "Tell me about a data migration into the CRM. How did you dedupe and validate it?",
      "What reporting or analytics did you build for the business?"
    ],
    listen: "Migration tooling, dedupe rules, and reporting that people used.",
    red: "Imported a CSV once.",
    capture: [
      { id: "scope", type: "chips", label: "Scope",
        options: ["Dashboards / reports", "Data migration", "Data quality", "CRM Analytics / Tableau"] }
    ]
  }

});
})();

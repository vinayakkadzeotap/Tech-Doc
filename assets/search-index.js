/* ============================================================
   ZEOTAP DOCS — SEARCH INDEX
   Full-text search data for all 26 documentation pages.
   Consumed by scripts.js search engine.
   ============================================================ */
window.ZEOTAP_SEARCH_INDEX = [
  {
    url: "index.html",
    title: "Table of Contents",
    subtitle: "Complete documentation index",
    icon: "",
    chapter: "Home",
    tags: ["home", "index", "toc", "contents", "overview", "start", "navigation"],
    sections: []
  },
  {
    url: "01-platform-overview.html",
    title: "Platform Architecture Overview",
    subtitle: "Foundation",
    icon: "",
    chapter: "Chapter 1",
    tags: ["architecture", "platform", "overview", "pillars", "collect", "unify", "activate", "GCP", "AWS", "kubernetes", "microservices", "CDP", "customer data platform"],
    sections: [
      { id: "what-is-zeotap", title: "What is Zeotap CDP?", keywords: "CDP customer data platform enterprise" },
      { id: "three-pillars", title: "The Three Pillars", keywords: "collect unify activate" },
      { id: "architecture", title: "System Architecture", keywords: "microservices GCP AWS kubernetes" },
      { id: "data-flow", title: "End-to-End Data Flow", keywords: "pipeline ingestion processing" },
      { id: "tech-stack", title: "Technology Stack", keywords: "Java Scala Python Go TypeScript" },
      { id: "deployment", title: "Deployment Model", keywords: "cloud infrastructure SaaS" }
    ]
  },
  {
    url: "02-data-collection.html",
    title: "Data Collection & SDKs",
    subtitle: "Ingestion",
    icon: "",
    chapter: "Chapter 2",
    tags: ["SDK", "data collection", "javascript", "android", "iOS", "mobile", "web", "events", "tracking", "browser", "server-side"],
    sections: [
      { id: "collect-sdk", title: "Collect SDK Overview", keywords: "javascript android iOS mobile tracking" },
      { id: "web-sdk", title: "Web SDK Integration", keywords: "javascript browser tag analytics" },
      { id: "mobile-sdk", title: "Mobile SDK", keywords: "android iOS swift kotlin" },
      { id: "server-side", title: "Server-Side Events", keywords: "API HTTP events server" },
      { id: "event-schema", title: "Event Schema & Validation", keywords: "schema validation payload JSON" },
      { id: "consent", title: "Consent Management", keywords: "consent GDPR opt-in privacy" }
    ]
  },
  {
    url: "03-data-ingestion.html",
    title: "Data Ingestion Pipelines",
    subtitle: "Ingestion",
    icon: "",
    chapter: "Chapter 3",
    tags: ["ingestion", "pipeline", "Kafka", "batch", "streaming", "ETL", "Spark", "real-time", "file upload", "SFTP", "S3"],
    sections: [
      { id: "ingestion-overview", title: "Ingestion Overview", keywords: "pipeline streaming batch" },
      { id: "kafka", title: "Kafka Streaming Pipeline", keywords: "Kafka streaming real-time events" },
      { id: "batch-ingestion", title: "Batch File Ingestion", keywords: "SFTP S3 CSV batch files" },
      { id: "spark-processing", title: "Spark Processing Jobs", keywords: "Apache Spark data processing" },
      { id: "schema-registry", title: "Schema Registry", keywords: "Avro schema versioning" },
      { id: "monitoring", title: "Pipeline Monitoring", keywords: "monitoring metrics latency" }
    ]
  },
  {
    url: "03-identity-resolution.html",
    title: "Identity Resolution",
    subtitle: "Identity",
    icon: "",
    chapter: "Chapter 4",
    tags: ["identity", "resolution", "UCID", "ID graph", "matching", "stitching", "cross-device", "deterministic", "probabilistic", "hashing"],
    sections: [
      { id: "identity-overview", title: "Identity Resolution Overview", keywords: "UCID cross-device matching" },
      { id: "id-graph", title: "Identity Graph Architecture", keywords: "graph database relationships IDs" },
      { id: "deterministic", title: "Deterministic Matching", keywords: "email phone exact match" },
      { id: "probabilistic", title: "Probabilistic Matching", keywords: "device fingerprint ML scoring" },
      { id: "ucid", title: "UCID — Universal Customer ID", keywords: "universal ID customer profile" },
      { id: "id-types", title: "Supported ID Types", keywords: "email phone cookie device GAID IDFA" },
      { id: "conflict-resolution", title: "Conflict Resolution", keywords: "merge rules priority" }
    ]
  },
  {
    url: "04-genai-zoe.html",
    title: "GenAI & Zoe AI Assistant",
    subtitle: "AI & Analytics",
    icon: "",
    chapter: "Chapter 9",
    tags: ["GenAI", "Zoe", "AI", "LLM", "MCP", "natural language", "chatbot", "assistant", "GPT", "Claude", "audience builder", "NLP"],
    sections: [
      { id: "zoe-overview", title: "Zoe AI Overview", keywords: "AI assistant natural language CDP" },
      { id: "mcp-protocol", title: "MCP Protocol", keywords: "Model Context Protocol tool calls" },
      { id: "audience-builder", title: "Natural Language Audience Builder", keywords: "NLP audience segment creation" },
      { id: "llm-integration", title: "LLM Integration", keywords: "GPT Claude language model" },
      { id: "query-engine", title: "Query Engine", keywords: "SQL generation BigQuery analytics" },
      { id: "safety", title: "Safety & Guardrails", keywords: "guardrails safety validation" }
    ]
  },
  {
    url: "05-profile-store.html",
    title: "Profile Store",
    subtitle: "Identity",
    icon: "",
    chapter: "Chapter 5",
    tags: ["profile", "Delta Lake", "profile store", "attributes", "traits", "Spark", "ACID", "time-travel", "GCS", "S3", "customer 360"],
    sections: [
      { id: "what-is-profile-store", title: "What is the Profile Store?", keywords: "customer 360 unified profile" },
      { id: "architecture", title: "Architecture", keywords: "Delta Lake Spark GCS S3" },
      { id: "delta-lake", title: "Delta Lake Storage", keywords: "ACID transactions versioning" },
      { id: "profile-merge", title: "Profile Merge Pipeline", keywords: "merge deduplication enrichment" },
      { id: "profile-schema", title: "Profile Schema", keywords: "attributes traits consent schema" },
      { id: "post-processors", title: "Post-Processors", keywords: "computed attributes ML scores" },
      { id: "api", title: "Internal Config API", keywords: "REST API endpoints configuration" },
      { id: "profile-api-external", title: "Customer-Facing Profile API", keywords: "read write delete search upsert REST" }
    ]
  },
  {
    url: "06-audience-management.html",
    title: "Audience Management",
    subtitle: "Audience",
    icon: "",
    chapter: "Chapter 6",
    tags: ["audience", "segment", "segmentation", "rules", "builder", "real-time", "batch", "lookalike", "overlap", "activation"],
    sections: [
      { id: "audience-overview", title: "Audience Overview", keywords: "segment builder rules" },
      { id: "segment-builder", title: "Segment Builder", keywords: "UI rules conditions drag-drop" },
      { id: "realtime-audiences", title: "Real-Time Audiences", keywords: "streaming live refresh" },
      { id: "lookalike", title: "Lookalike Modelling", keywords: "ML expansion seed audience" },
      { id: "audience-overlap", title: "Audience Overlap", keywords: "intersection analysis reach" },
      { id: "activation", title: "Audience Activation", keywords: "export destination sync" }
    ]
  },
  {
    url: "07-customer-journeys.html",
    title: "Customer Journeys",
    subtitle: "Audience",
    icon: "",
    chapter: "Chapter 7",
    tags: ["journey", "workflow", "orchestration", "trigger", "campaign", "email", "push", "SMS", "automation", "canvas"],
    sections: [
      { id: "journeys-overview", title: "Journey Builder Overview", keywords: "workflow orchestration canvas" },
      { id: "triggers", title: "Event Triggers", keywords: "event-based trigger entry exit" },
      { id: "channels", title: "Channel Actions", keywords: "email push SMS in-app channels" },
      { id: "split-testing", title: "A/B & Multivariate Testing", keywords: "A/B test experiment variant" },
      { id: "journey-analytics", title: "Journey Analytics", keywords: "funnel conversion reporting" },
      { id: "api-journeys", title: "Journeys API", keywords: "REST API journey management" }
    ]
  },
  {
    url: "08-data-activation.html",
    title: "Data Activation",
    subtitle: "Audience",
    icon: "",
    chapter: "Chapter 8",
    tags: ["activation", "destination", "connector", "export", "sync", "Google Ads", "Meta", "DV360", "Amazon", "TTD", "LiveRamp"],
    sections: [
      { id: "activation-overview", title: "Activation Overview", keywords: "export destinations connectors" },
      { id: "destinations", title: "Destination Catalogue", keywords: "Google Meta Amazon programmatic" },
      { id: "sync-engine", title: "Sync Engine", keywords: "real-time batch push pull" },
      { id: "id-translation", title: "ID Translation", keywords: "hashing encoding partner IDs" },
      { id: "activation-api", title: "Activation API", keywords: "REST endpoints trigger export" },
      { id: "monitoring-activation", title: "Monitoring & Alerts", keywords: "status logs errors alerts" }
    ]
  },
  {
    url: "10-ml-platform.html",
    title: "ML Platform",
    subtitle: "AI & Analytics",
    icon: "",
    chapter: "Chapter 10",
    tags: ["machine learning", "ML", "models", "propensity", "churn", "LTV", "scoring", "training", "inference", "Vertex AI", "MLflow"],
    sections: [
      { id: "ml-overview", title: "ML Platform Overview", keywords: "machine learning models scoring" },
      { id: "propensity", title: "Propensity Models", keywords: "churn purchase conversion" },
      { id: "ltv", title: "Lifetime Value Scoring", keywords: "LTV customer value" },
      { id: "model-training", title: "Model Training Pipeline", keywords: "training Vertex AI Spark" },
      { id: "feature-store", title: "Feature Store", keywords: "features engineering attributes" },
      { id: "inference", title: "Real-Time Inference", keywords: "prediction scoring API serving" }
    ]
  },
  {
    url: "11-reporting-bi.html",
    title: "Reporting & BI",
    subtitle: "AI & Analytics",
    icon: "",
    chapter: "Chapter 11",
    tags: ["reporting", "BI", "analytics", "BigQuery", "Looker", "dashboard", "metrics", "KPI", "data warehouse", "charts"],
    sections: [
      { id: "reporting-overview", title: "Reporting Overview", keywords: "analytics dashboards KPI metrics" },
      { id: "bigquery", title: "BigQuery Integration", keywords: "data warehouse SQL analytics" },
      { id: "looker", title: "Looker Dashboards", keywords: "BI visualization charts reports" },
      { id: "custom-reports", title: "Custom Report Builder", keywords: "builder filters dimensions" },
      { id: "data-exports", title: "Data Exports & Scheduled Reports", keywords: "export CSV email schedule" }
    ]
  },
  {
    url: "12-unity-dashboard.html",
    title: "Unity Dashboard",
    subtitle: "Frontend",
    icon: "",
    chapter: "Chapter 12",
    tags: ["Unity", "dashboard", "frontend", "React", "UI", "SPA", "micro-frontend", "authentication", "admin", "user management"],
    sections: [
      { id: "unity-overview", title: "Unity Dashboard Overview", keywords: "React SPA frontend portal" },
      { id: "architecture-unity", title: "Frontend Architecture", keywords: "micro-frontend module federation" },
      { id: "auth-ui", title: "Authentication Flow", keywords: "OAuth SSO login session" },
      { id: "modules", title: "Core Modules", keywords: "audiences journeys reports admin" },
      { id: "theming", title: "Theming & Whitelabelling", keywords: "branding theme customisation" }
    ]
  },
  {
    url: "13-privacy-gdpr.html",
    title: "Privacy & GDPR",
    subtitle: "Security",
    icon: "",
    chapter: "Chapter 13",
    tags: ["privacy", "GDPR", "CCPA", "data protection", "consent", "erasure", "right to be forgotten", "PII", "encryption", "compliance", "DSR"],
    sections: [
      { id: "privacy-overview", title: "Privacy-First Architecture", keywords: "GDPR CCPA compliance design" },
      { id: "consent-management", title: "Consent Management Platform", keywords: "CMP consent signals opt-in" },
      { id: "dsr", title: "Data Subject Requests", keywords: "DSR erasure right access portability" },
      { id: "data-retention", title: "Data Retention Policies", keywords: "TTL expiry deletion schedule" },
      { id: "encryption", title: "Encryption & Pseudonymisation", keywords: "AES encryption hashing PII" },
      { id: "audit", title: "Audit Logging & Compliance", keywords: "audit log access control trail" }
    ]
  },
  {
    url: "14-auth-iam.html",
    title: "Authentication & IAM",
    subtitle: "Security",
    icon: "",
    chapter: "Chapter 14",
    tags: ["authentication", "IAM", "RBAC", "SSO", "OAuth", "JWT", "API keys", "permissions", "roles", "access control", "SAML"],
    sections: [
      { id: "auth-overview", title: "Authentication Overview", keywords: "OAuth SSO SAML login" },
      { id: "rbac", title: "Role-Based Access Control", keywords: "RBAC roles permissions users" },
      { id: "api-keys", title: "API Key Management", keywords: "API keys rotation scopes" },
      { id: "jwt", title: "JWT Tokens", keywords: "JWT tokens claims expiry" },
      { id: "sso", title: "SSO Integration", keywords: "SAML Okta Azure AD SSO" },
      { id: "service-accounts", title: "Service Accounts", keywords: "service account machine-to-machine" }
    ]
  },
  {
    url: "15-infrastructure.html",
    title: "Infrastructure",
    subtitle: "Infrastructure",
    icon: "",
    chapter: "Chapter 15",
    tags: ["infrastructure", "GCP", "AWS", "Kubernetes", "Terraform", "Helm", "networking", "VPC", "load balancer", "autoscaling"],
    sections: [
      { id: "infra-overview", title: "Infrastructure Overview", keywords: "GCP AWS Kubernetes cloud" },
      { id: "kubernetes", title: "Kubernetes Architecture", keywords: "K8s pods services namespaces" },
      { id: "terraform", title: "Terraform IaC", keywords: "Terraform modules infrastructure as code" },
      { id: "networking", title: "Networking & Security Groups", keywords: "VPC firewall load balancer" },
      { id: "storage", title: "Storage Systems", keywords: "GCS S3 Bigtable CloudSQL" },
      { id: "autoscaling", title: "Autoscaling & Capacity", keywords: "HPA VPA autoscaling metrics" }
    ]
  },
  {
    url: "16-observability.html",
    title: "Observability & Monitoring",
    subtitle: "Infrastructure",
    icon: "",
    chapter: "Chapter 16",
    tags: ["observability", "monitoring", "logging", "tracing", "Datadog", "Prometheus", "Grafana", "alerts", "SLO", "SLA", "Jaeger"],
    sections: [
      { id: "observability-overview", title: "Observability Stack Overview", keywords: "monitoring logging tracing" },
      { id: "metrics", title: "Metrics & Dashboards", keywords: "Prometheus Grafana Datadog metrics" },
      { id: "logging", title: "Centralised Logging", keywords: "ELK stack log aggregation" },
      { id: "tracing", title: "Distributed Tracing", keywords: "Jaeger OpenTelemetry trace" },
      { id: "alerting", title: "Alerting & On-Call", keywords: "PagerDuty alerts runbooks SLO" }
    ]
  },
  {
    url: "17-cicd.html",
    title: "CI/CD Pipelines",
    subtitle: "Infrastructure",
    icon: "",
    chapter: "Chapter 17",
    tags: ["CI/CD", "pipeline", "GitHub Actions", "Jenkins", "deployment", "Docker", "Helm", "release", "canary", "blue-green", "rollback"],
    sections: [
      { id: "cicd-overview", title: "CI/CD Strategy Overview", keywords: "continuous integration deployment" },
      { id: "github-actions", title: "GitHub Actions Workflows", keywords: "workflow YAML trigger build test" },
      { id: "docker", title: "Docker & Container Build", keywords: "Dockerfile image registry" },
      { id: "helm-deploy", title: "Helm Chart Deployments", keywords: "Helm charts values Kubernetes" },
      { id: "canary", title: "Canary & Blue-Green Deployments", keywords: "canary traffic split rollout" },
      { id: "rollback", title: "Rollback Procedures", keywords: "rollback emergency hotfix" }
    ]
  },
  {
    url: "18-testing.html",
    title: "Testing & QA",
    subtitle: "Testing",
    icon: "",
    chapter: "Chapter 18",
    tags: ["testing", "unit test", "integration test", "E2E", "QA", "JUnit", "pytest", "Jest", "Selenium", "contract testing", "performance testing"],
    sections: [
      { id: "testing-overview", title: "Testing Strategy Overview", keywords: "test pyramid unit integration E2E" },
      { id: "unit-tests", title: "Unit Testing", keywords: "JUnit pytest Jest mocking" },
      { id: "integration-tests", title: "Integration Tests", keywords: "contract Pact API testing" },
      { id: "e2e-tests", title: "End-to-End Testing", keywords: "Selenium Cypress browser automation" },
      { id: "performance", title: "Performance & Load Testing", keywords: "JMeter Gatling load stress" },
      { id: "data-quality", title: "Data Quality Testing", keywords: "Great Expectations data validation" }
    ]
  },
  {
    url: "appendix-a-api-reference.html",
    title: "Appendix A — Full API Reference",
    subtitle: "Appendix · All HTTP APIs",
    icon: "",
    chapter: "Appendix A",
    tags: ["API", "REST", "HTTP", "endpoints", "reference", "collect", "identity", "profile", "audiences", "destinations", "GDPR", "reporting"],
    sections: [
      { id: "base-urls", title: "Base URLs & Authentication", keywords: "apikey auth headers base URL" },
      { id: "collect-apis", title: "Data Collection APIs", keywords: "track identify page" },
      { id: "identity-graph-apis", title: "Identity Graph APIs", keywords: "identity resolution graph" },
      { id: "profile-api", title: "Profile API", keywords: "read write delete search upsert" },
      { id: "audiences-apis", title: "Audiences APIs", keywords: "segment create list export" },
      { id: "destinations-apis", title: "Destinations APIs", keywords: "connector sync activation" },
      { id: "gdpr-apis", title: "GDPR / Privacy APIs", keywords: "DSR consent erasure" },
      { id: "reporting-apis", title: "Reporting APIs", keywords: "metrics analytics exports" }
    ]
  },
  {
    url: "appendix-b-data-dictionary.html",
    title: "Appendix B — Data Dictionary",
    subtitle: "Appendix · Field Definitions",
    icon: "",
    chapter: "Appendix B",
    tags: ["data dictionary", "fields", "schema", "attributes", "types", "definitions", "events", "profile fields"],
    sections: [
      { id: "event-fields", title: "Event Fields", keywords: "event schema properties" },
      { id: "profile-fields", title: "Profile Fields", keywords: "user attributes traits schema" },
      { id: "audience-fields", title: "Audience Fields", keywords: "segment criteria fields" },
      { id: "consent-fields", title: "Consent Fields", keywords: "consent preferences signals" }
    ]
  },
  {
    url: "appendix-c-glossary.html",
    title: "Appendix C — Glossary",
    subtitle: "Appendix · Key Terms",
    icon: "",
    chapter: "Appendix C",
    tags: ["glossary", "terms", "definitions", "acronyms", "CDP", "UCID", "GDPR", "identity", "segment", "activation"],
    sections: [
      { id: "glossary-a", title: "A–F Terms", keywords: "activation audience CDP consent" },
      { id: "glossary-g", title: "G–M Terms", keywords: "GDPR identity matching profile" },
      { id: "glossary-n", title: "N–Z Terms", keywords: "segment UCID unify webhook" }
    ]
  },
  {
    url: "appendix-d-poc-directory.html",
    title: "Appendix D — PoC Directory",
    subtitle: "Appendix · Proof of Concept Tracker",
    icon: "",
    chapter: "Appendix D",
    tags: ["PoC", "proof of concept", "demos", "integrations", "experiments", "sandbox", "pilot"],
    sections: [
      { id: "poc-overview", title: "PoC Directory Overview", keywords: "proof of concept pilots experiments" },
      { id: "active-pocs", title: "Active PoCs", keywords: "current running live pilots" },
      { id: "completed-pocs", title: "Completed PoCs", keywords: "finished shipped graduated" }
    ]
  },
  {
    url: "appendix-e-product-docs.html",
    title: "Appendix E — Product Documentation",
    subtitle: "Appendix · Official Product Docs",
    icon: "",
    chapter: "Appendix E",
    tags: ["product docs", "official", "external", "links", "Confluence", "knowledge base", "reference"],
    sections: [
      { id: "product-docs-overview", title: "Product Docs Overview", keywords: "official documentation links" },
      { id: "external-links", title: "External Links", keywords: "Confluence wiki product" }
    ]
  },
  {
    url: "pipeline-sim.html",
    title: "Pipeline Simulator — Journey of a Click",
    subtitle: "Interactive · End-to-End Event Trace",
    icon: "",
    chapter: "Interactive",
    tags: ["pipeline", "simulator", "event", "click", "trace", "journey", "SDK", "Kafka", "ingestion", "identity", "profile", "audience", "activation"],
    sections: [
      { id: "sdk-capture", title: "SDK Event Capture", keywords: "javascript SDK browser event" },
      { id: "api-gateway", title: "API Gateway", keywords: "ingestion gateway auth rate-limit" },
      { id: "kafka-publish", title: "Kafka Publish", keywords: "Kafka topic streaming publish" },
      { id: "schema-validate", title: "Schema Validation", keywords: "Avro schema registry validate" },
      { id: "identity-stitch", title: "Identity Stitching", keywords: "UCID match stitch resolve" },
      { id: "profile-write", title: "Profile Write", keywords: "Delta Lake profile update merge" },
      { id: "audience-eval", title: "Audience Evaluation", keywords: "segment match trigger activation" }
    ]
  },
  {
    url: "learning-hub.html",
    title: "Learning Hub",
    subtitle: "Onboarding · Paths, Quizzes & Badges",
    icon: "",
    chapter: "Learning",
    tags: ["learning", "onboarding", "quiz", "badge", "module", "path", "new employee", "training", "certification"],
    sections: [
      { id: "learning-paths", title: "Learning Paths", keywords: "onboarding paths beginner intermediate" },
      { id: "quizzes", title: "Quizzes", keywords: "quiz test knowledge check" },
      { id: "badges", title: "Achievement Badges", keywords: "badge unlock achievement reward" },
      { id: "progress", title: "Progress Tracking", keywords: "progress completion modules" }
    ]
  }
];

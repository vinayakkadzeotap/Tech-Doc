import type { Domain } from './types';

export const AUDIENCES_SEGMENTATION: Domain = {
  id: 'audiences-segmentation',
  title: 'Audiences & Segmentation',
  icon: 'Users',
  color: '#ec4899',
  description:
    'Builds, manages, and orchestrates audience segments from unified profiles. Supports rule-based, AI-recommended, and lookalike audiences with category affinity scoring.',
  architectureNotes: `The Audiences & Segmentation domain handles the full lifecycle of audience management:

audiences is the core Scala-based segmentation engine that builds and evaluates audience rules against the profile store. tarak-the-targeting handles segment distribution — creating segments and distributing AdIDs/cookies to downstream channels for activation.

windvane is the audience workflow orchestrator, replacing Cloud Composer DAGs for audience pipelines. It manages the scheduling and execution of segment computation jobs.

audience_recommendation provides AI-driven audience insights and lookalike audience suggestions. cat-affinity computes category affinity scores using BigQuery SQL pipelines.

The system interfaces upstream with the Profile Store (Delta Lake) for segment evaluation and downstream with the Activation domain for segment delivery to channels.`,
  mermaidArch: `graph TB
    subgraph Core["Segmentation Core"]
      AUD["audiences<br/>Segmentation Engine (Scala)"]
      TAR["tarak-the-targeting<br/>Segment Distribution"]
      WV["windvane<br/>Workflow Orchestrator"]
    end

    subgraph Intelligence["Audience Intelligence"]
      AR["audience_recommendation<br/>AI-Driven Insights"]
      CA["cat-affinity<br/>Category Affinity (BQ SQL)"]
    end

    subgraph Upstream["Data Sources"]
      PS["Profile Store<br/>(Delta Lake)"]
      CANON["canon<br/>Catalog Service"]
    end

    subgraph Downstream["Activation"]
      CH["Channel Service<br/>Ad-tech Channels"]
      CONNECT["zeotap-connect<br/>Destination Connectors"]
    end

    PS --> AUD
    CANON --> AUD
    AUD --> TAR
    WV --> AUD
    AR --> AUD
    CA --> PS
    TAR --> CH
    TAR --> CONNECT`,
  mermaidDataFlow: '',
  repos: [
    {
      id: 'audiences',
      name: 'audiences',
      displayName: 'Audience Segmentation Engine',
      purpose: 'Core segmentation engine that builds and evaluates audience rules against the unified profile store.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 90 }, { name: 'Java', pct: 10 }],
      size: '65M',
      keyModules: [],
      dependencies: [
        { name: 'Apache Spark', type: 'library', description: 'Batch processing' },
        { name: 'Delta Lake', type: 'database', description: 'Profile store' },
      ],
      interRepoLinks: ['daap-segment-library', 'tarak-the-targeting', 'windvane'],
    },
    {
      id: 'tarak-the-targeting',
      name: 'tarak-the-targeting',
      displayName: 'Targeting & Distribution',
      purpose: 'Segmentation and audience distribution — creates segments and distributes AdIDs/cookies to downstream activation channels.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 90 }, { name: 'Java', pct: 10 }],
      size: '66M',
      keyModules: [],
      dependencies: [
        { name: 'Apache Spark', type: 'library', description: 'Batch processing' },
        { name: 'Kafka', type: 'queue', description: 'Event publishing' },
      ],
      interRepoLinks: ['audiences', 'channel-service'],
    },
    {
      id: 'windvane',
      name: 'windvane',
      displayName: 'Windvane (Workflow Orchestrator)',
      purpose: 'Audience workflow orchestrator replacing Cloud Composer DAGs — manages scheduling and execution of segment computation pipelines.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 100 }],
      size: '824K',
      keyModules: [],
      dependencies: [
        { name: 'Akka', type: 'library', description: 'Actor-based scheduling' },
      ],
      interRepoLinks: ['audiences', 'daap'],
    },
    {
      id: 'audience-recommendation',
      name: 'audience_recommendation',
      displayName: 'Audience Recommendation',
      purpose: 'AI-driven audience insights and lookalike audience recommendations.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '64M',
      keyModules: [],
      dependencies: [],
      interRepoLinks: ['audiences'],
    },
    {
      id: 'cat-affinity',
      name: 'cat-affinity',
      displayName: 'Category Affinity Pipeline',
      purpose: 'Category affinity scoring pipeline using BigQuery SQL for user interest classification.',
      language: 'SQL',
      languages: [{ name: 'SQL', pct: 80 }, { name: 'Python', pct: 20 }],
      size: '720K',
      keyModules: [],
      dependencies: [
        { name: 'BigQuery', type: 'cloud', description: 'SQL-based affinity computation' },
      ],
      interRepoLinks: ['audiences'],
    },
  ],
};

export const ACTIVATION_DISTRIBUTION: Domain = {
  id: 'activation-distribution',
  title: 'Activation & Distribution',
  icon: 'Send',
  color: '#f59e0b',
  description:
    'The "last mile" — distributes audience segments to downstream channels (Google Ads, Facebook, Salesforce, etc.) via connectors, managing field mapping, sync schedules, and delivery verification.',
  architectureNotes: `The Activation domain handles delivering audience segments to 30+ ad-tech and marketing channels:

channel-service is the core activation service managing channel configurations, segment delivery, and sync schedules. channel-platform provides the platform abstraction for channel management.

Multiple distribution services exist for different use cases: daemos-the-distributor and data-distributor handle bulk data distribution. data-destination and doraemon-the-destination manage destination-specific connector logic. data-uploader handles file-based distribution.

zeotap-connect is the modern activation connectors platform consolidating destination integrations. charlie-the-communicator manages segment export details and notifications.

All distribution services connect upstream to the segmentation engine (audiences, tarak-the-targeting) and downstream to external platforms (Google Ads, Facebook, TTD, Salesforce, etc.).`,
  mermaidArch: `graph LR
    subgraph Segments["Audience Segments"]
      AUD["audiences<br/>Segmentation"]
      TAR["tarak-the-targeting<br/>Distribution"]
    end

    subgraph Core["Activation Core"]
      CS["channel-service<br/>Channel Management"]
      CP["channel-platform<br/>Platform Abstraction"]
      ZC["zeotap-connect<br/>Modern Connectors"]
    end

    subgraph Distribution["Distribution Services"]
      DAEMOS["daemos-the-distributor<br/>Bulk Distribution"]
      DD["data-distributor<br/>Data Distribution"]
      DEST["data-destination<br/>Destination Logic"]
      DOR["doraemon-the-destination<br/>Destination Connector"]
      DU["data-uploader<br/>File Distribution"]
      CC["charlie-the-communicator<br/>Export Details"]
    end

    subgraph Channels["External Channels"]
      GAD["Google Ads"]
      FB["Facebook"]
      TTD["The Trade Desk"]
      SF["Salesforce"]
      MORE["30+ more..."]
    end

    AUD --> TAR
    TAR --> CS
    CS --> CP
    CS --> ZC
    CS --> DAEMOS
    DAEMOS --> DD
    DD --> DEST
    DEST --> DOR
    ZC --> GAD
    ZC --> FB
    DOR --> TTD
    DOR --> SF
    CC --> MORE`,
  mermaidDataFlow: '',
  repos: [
    {
      id: 'channel-service',
      name: 'channel-service',
      displayName: 'Channel Service',
      purpose: 'Core activation service managing channel configurations, segment delivery, sync schedules, and licensing across 30+ ad-tech channels.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 90 }, { name: 'Java', pct: 10 }],
      size: '53M',
      keyModules: [],
      dependencies: [
        { name: 'Kafka', type: 'queue', description: 'Event publishing' },
        { name: 'PostgreSQL', type: 'database', description: 'Channel metadata' },
      ],
      interRepoLinks: ['clarkkent-the-connect', 'tarak-the-targeting'],
    },
    {
      id: 'zeotap-connect',
      name: 'zeotap-connect',
      displayName: 'Zeotap Connect',
      purpose: 'Modern activation connectors platform consolidating destination integrations for data delivery to external platforms.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 80 }, { name: 'Scala', pct: 20 }],
      size: '38M',
      keyModules: [],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Connector metadata' },
        { name: 'RabbitMQ', type: 'queue', description: 'Async processing' },
      ],
      interRepoLinks: ['channel-service', 'clarkkent-the-connect'],
    },
    {
      id: 'daemos-the-distributor',
      name: 'daemos-the-distributor',
      displayName: 'Daemos (Bulk Distributor)',
      purpose: 'Bulk data distribution service handling large-scale segment delivery to channels.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 90 }, { name: 'Other', pct: 10 }],
      size: '75M',
      keyModules: [],
      dependencies: [
        { name: 'RabbitMQ', type: 'queue', description: 'Distribution queue' },
        { name: 'GCS', type: 'cloud', description: 'File storage' },
      ],
      interRepoLinks: ['data-distributor', 'clarkkent-the-connect'],
    },
    {
      id: 'data-distributor',
      name: 'data-distributor',
      displayName: 'Data Distributor',
      purpose: 'General-purpose data distribution service for segment delivery.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 90 }, { name: 'Other', pct: 10 }],
      size: '55M',
      keyModules: [],
      dependencies: [],
      interRepoLinks: ['daemos-the-distributor', 'data-destination'],
    },
    {
      id: 'data-destination',
      name: 'data-destination',
      displayName: 'Data Destination',
      purpose: 'Destination-specific connector logic for delivering data to various activation channels.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 90 }, { name: 'Java', pct: 10 }],
      size: '22M',
      keyModules: [],
      dependencies: [],
      interRepoLinks: ['doraemon-the-destination', 'channel-service'],
    },
    {
      id: 'doraemon-the-destination',
      name: 'doraemon-the-destination',
      displayName: 'Doraemon (Destination Connector)',
      purpose: 'Destination activation connector with platform-specific API integrations.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 90 }, { name: 'Java', pct: 10 }],
      size: '25M',
      keyModules: [],
      dependencies: [],
      interRepoLinks: ['data-destination', 'channel-service'],
    },
    {
      id: 'data-uploader',
      name: 'data-uploader',
      displayName: 'Data Uploader',
      purpose: 'File-based data upload and distribution service for batch segment delivery.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 90 }, { name: 'Other', pct: 10 }],
      size: '60M',
      keyModules: [],
      dependencies: [
        { name: 'GCS/S3', type: 'cloud', description: 'File upload' },
        { name: 'RabbitMQ', type: 'queue', description: 'Upload orchestration' },
      ],
      interRepoLinks: ['clarkkent-the-connect'],
    },
    {
      id: 'charlie-the-communicator',
      name: 'charlie-the-communicator',
      displayName: 'Charlie (Export Details)',
      purpose: 'Manages segment export details, notifications, and communication for activation workflows.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 100 }],
      size: '5.1M',
      keyModules: [],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Export metadata' },
      ],
      interRepoLinks: ['clarkkent-the-connect'],
    },
  ],
};

export const PROFILE_DATA_MGMT: Domain = {
  id: 'profile-data-mgmt',
  title: 'Profile & Data Management',
  icon: 'HardDrive',
  color: '#10b981',
  description:
    'Manages unified customer profiles — data I/O, quality validation, profile merge/enrichment, and workflow orchestration using a free-monad DSL architecture.',
  architectureNotes: `The Profile & Data Management domain provides the foundational data management layer:

dazz-data-manager is the core data management service coordinating data operations. bookkeeper serves as the data manager coordinator, orchestrating workflows across multiple processing steps.

zeoflow is the architectural cornerstone — a free-monad DSL for data transformation workflows using the Read/Transform/Write pattern. zeoflow-mapper provides data flow mapping, and zeoflow-sql-ui offers a SQL UI for pipeline management.

The zeocore libraries (zeocore-commons, zeocore-library, zeocore-apps-merge, zeocore-apps-enricher) provide shared utilities for profile merge, enrichment, and consent parsing.

Data quality is managed through a suite of tools: data-io provides functional I/O operations, data-expectations offers a DSL for data validation, data-owl provides statistics/quality framework, and dataquality provides general quality tooling.`,
  mermaidArch: `graph TB
    subgraph Core["Data Management Core"]
      DAZZ["dazz-data-manager<br/>Data Manager (Scala)"]
      BK["bookkeeper<br/>Coordinator"]
    end

    subgraph Workflow["Workflow Layer"]
      ZF["zeoflow<br/>Free-Monad DSL"]
      ZFM["zeoflow-mapper<br/>Data Flow Mapping"]
      ZFSQL["zeoflow-sql-ui<br/>SQL UI"]
    end

    subgraph Quality["Data Quality"]
      DIO["data-io<br/>Functional I/O"]
      DE["data-expectations<br/>Validation DSL"]
      DOW["data-owl<br/>Statistics Framework"]
      DQ["dataquality<br/>Quality Tooling"]
    end

    subgraph ZeoCore["Core Libraries"]
      ZCC["zeocore-commons<br/>Shared Libs"]
      ZCL["zeocore-library<br/>Consent Parser"]
      ZCM["zeocore-apps-merge<br/>Profile Merge"]
      ZCE["zeocore-apps-enricher<br/>Enrichment"]
    end

    DAZZ --> BK
    DAZZ --> ZF
    ZF --> ZFM
    DAZZ --> DIO
    DAZZ --> DE
    DAZZ --> DOW
    DAZZ --> ZCC
    ZCM --> ZCC
    ZCE --> ZCC`,
  mermaidDataFlow: '',
  repos: [
    {
      id: 'dazz-data-manager', name: 'dazz-data-manager', displayName: 'Dazz Data Manager',
      purpose: 'Core data management service coordinating data operations across the platform.',
      language: 'Scala', languages: [{ name: 'Scala', pct: 100 }], size: '163M',
      keyModules: [], dependencies: [], interRepoLinks: ['bookkeeper', 'zeoflow'],
    },
    {
      id: 'bookkeeper', name: 'bookkeeper', displayName: 'Bookkeeper (Coordinator)',
      purpose: 'Data manager coordinator orchestrating multi-step data processing workflows.',
      language: 'Scala', languages: [{ name: 'Scala', pct: 100 }], size: '22M',
      keyModules: [], dependencies: [], interRepoLinks: ['dazz-data-manager'],
    },
    {
      id: 'zeoflow', name: 'zeoflow', displayName: 'ZeoFlow (Free-Monad DSL)',
      purpose: 'Open-source free-monad DSL for data transformation workflows — Read/Transform/Write pattern used across the data platform.',
      language: 'Scala', languages: [{ name: 'Scala', pct: 100 }], size: '460K',
      keyModules: [], dependencies: [{ name: 'Cats Free', type: 'library', description: 'Free monad implementation' }],
      interRepoLinks: ['datawave', 'dazz-data-manager'],
    },
    {
      id: 'zeoflow-mapper', name: 'zeoflow-mapper', displayName: 'ZeoFlow Mapper',
      purpose: 'Data flow mapping service providing transformation mapping between schemas.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '60M',
      keyModules: [], dependencies: [], interRepoLinks: ['zeoflow'],
    },
    {
      id: 'data-io', name: 'data-io', displayName: 'Data I/O Library',
      purpose: 'Functional programming (FP) framework for data I/O operations — provides composable readers/writers.',
      language: 'Scala', languages: [{ name: 'Scala', pct: 100 }], size: '792K',
      keyModules: [], dependencies: [{ name: 'Cats', type: 'library', description: 'Functional Scala' }],
      interRepoLinks: ['datawave', 'beam-pipeline'],
    },
    {
      id: 'data-expectations', name: 'data-expectations', displayName: 'Data Expectations DSL',
      purpose: 'Free-based DSL for data validation — defines expected data shapes and constraints.',
      language: 'Scala', languages: [{ name: 'Scala', pct: 100 }], size: '1.0M',
      keyModules: [], dependencies: [], interRepoLinks: ['dazz-data-manager'],
    },
    {
      id: 'data-owl', name: 'data-owl', displayName: 'Data Owl (Quality Framework)',
      purpose: 'Custom data statistics and quality framework for monitoring data health across pipelines.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '3.6M',
      keyModules: [], dependencies: [], interRepoLinks: ['daap'],
    },
    {
      id: 'zeocore-commons', name: 'zeocore-commons', displayName: 'ZeoCore Commons',
      purpose: 'Shared commons library for all zeoCore services providing base utilities and types.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '1.1M',
      keyModules: [], dependencies: [], interRepoLinks: ['zeocore-library', 'zeocore-apps-merge'],
    },
    {
      id: 'zeocore-library', name: 'zeocore-library', displayName: 'ZeoCore Library',
      purpose: 'Core library modules including consent parser and shared platform libraries.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '1.0M',
      keyModules: [], dependencies: [], interRepoLinks: ['zeocore-commons'],
    },
    {
      id: 'zeocore-apps-merge', name: 'zeocore-apps-merge', displayName: 'ZeoCore Apps Merge',
      purpose: 'Delta-lake based profile merge module for unifying app event data into customer profiles.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '580K',
      keyModules: [], dependencies: [{ name: 'Delta Lake', type: 'database', description: 'Profile storage' }],
      interRepoLinks: ['zeocore-commons', 'daap'],
    },
    {
      id: 'zeocore-apps-enricher', name: 'zeocore-apps-enricher', displayName: 'ZeoCore Apps Enricher',
      purpose: 'Core apps enrichment service adding derived attributes to customer profiles.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '440K',
      keyModules: [], dependencies: [], interRepoLinks: ['zeocore-commons'],
    },
  ],
};

export const ANALYTICS_OBSERVABILITY: Domain = {
  id: 'analytics-observability',
  title: 'Analytics & Observability',
  icon: 'BarChart3',
  color: '#06b6d4',
  description:
    'Platform analytics, real-time audience insights, pipeline observability (ZeoPulse), and reporting infrastructure across all product modules.',
  architectureNotes: `The Analytics & Observability domain provides platform-wide visibility:

ZeoPulse is the CDP pipeline observability platform built on ClickHouse + PostgreSQL, monitoring data flow across all 6 product modules.

zai-v2-dataflow provides real-time audience insights using streaming + batch pipelines with Aerospike profile store. ZeoIQ is the intelligence/analytics service providing advanced analytics capabilities.

ReportingPipeline handles aggregated report processing, raw log processing, bid/stalk reports, and provides a Django-based reporting API. Vision serves as the zeoFlow Command Center for cost, log, and platform service monitoring.`,
  mermaidArch: `graph TB
    subgraph Observability["Pipeline Observability"]
      ZP["ZeoPulse<br/>CDP Pipeline Monitor"]
      CH["ClickHouse<br/>Analytics DB"]
    end

    subgraph Analytics["Analytics"]
      ZAI["zai-v2-dataflow<br/>Real-time Insights"]
      ZIQ["ZeoIQ<br/>Intelligence Service"]
    end

    subgraph Reporting["Reporting"]
      RP["ReportingPipeline<br/>Reports (Django)"]
      VIS["Vision<br/>zeoFlow Command Center"]
    end

    ZP --> CH
    ZAI --> ZP
    RP --> ZP
    VIS --> ZP`,
  mermaidDataFlow: '',
  repos: [
    {
      id: 'zeopulse', name: 'ZeoPulse', displayName: 'ZeoPulse (Observability)',
      purpose: 'CDP pipeline observability platform monitoring data flow across all 6 product modules, built on ClickHouse + PostgreSQL.',
      language: 'Python', languages: [{ name: 'Python', pct: 100 }], size: '13M',
      keyModules: [], dependencies: [
        { name: 'ClickHouse', type: 'database', description: 'Analytics storage' },
        { name: 'PostgreSQL', type: 'database', description: 'Metadata' },
      ], interRepoLinks: [],
    },
    {
      id: 'zai-v2-dataflow', name: 'zai-v2-dataflow', displayName: 'Real-time Audience Insights',
      purpose: 'Real-time audience insights using streaming + batch pipelines with Aerospike profile store.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '2.8M',
      keyModules: [], dependencies: [
        { name: 'Aerospike', type: 'database', description: 'Profile store' },
      ], interRepoLinks: [],
    },
    {
      id: 'zeoiq', name: 'ZeoIQ', displayName: 'ZeoIQ (Intelligence)',
      purpose: 'Intelligence and analytics service providing advanced analytical capabilities.',
      language: 'Scala', languages: [{ name: 'Scala', pct: 100 }], size: '604K',
      keyModules: [], dependencies: [], interRepoLinks: [],
    },
    {
      id: 'reporting-pipeline', name: 'ReportingPipeline', displayName: 'Reporting Pipeline',
      purpose: 'Aggregated report processing, raw log processing, bid/stalk reports with Django-based reporting API.',
      language: 'Python', languages: [{ name: 'Python', pct: 70 }, { name: 'Other', pct: 30 }], size: '266M',
      keyModules: [], dependencies: [
        { name: 'Django', type: 'library', description: 'Reporting API' },
      ], interRepoLinks: [],
    },
    {
      id: 'vision', name: 'Vision', displayName: 'Vision (Command Center)',
      purpose: 'zeoFlow Command Center for cost monitoring, log analysis, and platform service health.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '1.4M',
      keyModules: [], dependencies: [], interRepoLinks: ['zeoflow'],
    },
  ],
};

export const AUTH_CONSENT: Domain = {
  id: 'auth-consent',
  title: 'Auth & Consent',
  icon: 'Shield',
  color: '#ef4444',
  description:
    'Authentication, RBAC authorization, and consent management — ensuring data privacy compliance across the platform with fine-grained access control.',
  architectureNotes: `The Auth & Consent domain provides security and privacy across the platform:

UserAccessManagement is the central RBAC platform providing role-based access control, token validation, org management, and user provisioning. It integrates with Okta for SSO.

akbar-the-authenticator is the core authentication service handling token generation, validation, and refresh. It provides the auth backend used by all other services via the rbac-authenticator library.

consent-preference-centre-ui provides the user-facing consent preference center where end users can manage their data consent choices (IAB TCF, CCPA compliance).

All platform services integrate with this domain via shared libraries (rbac-authenticator, common-utils) for token validation and access control.`,
  mermaidArch: `graph TB
    subgraph Auth["Authentication"]
      AKBAR["akbar-the-authenticator<br/>Token Service"]
      OKTA["Okta SSO"]
    end

    subgraph RBAC["Authorization"]
      UAM["UserAccessManagement<br/>RBAC Platform (Python)"]
    end

    subgraph Consent["Consent Management"]
      CPC["consent-preference-centre-ui<br/>User Consent UI"]
    end

    subgraph Services["Platform Services"]
      S1["All Backend Services"]
      S2["rbac-authenticator lib"]
    end

    OKTA --> AKBAR
    AKBAR --> UAM
    UAM --> S2
    S2 --> S1
    CPC --> UAM`,
  mermaidDataFlow: '',
  repos: [
    {
      id: 'user-access-management', name: 'UserAccessManagement', displayName: 'User Access Management',
      purpose: 'Central RBAC authentication and authorization platform — role management, token validation, org management, user provisioning.',
      language: 'Python', languages: [{ name: 'Python', pct: 100 }], size: '22M',
      keyModules: [], dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'User/role metadata' },
        { name: 'Okta', type: 'service', description: 'SSO integration' },
      ], interRepoLinks: ['akbar-the-authenticator'],
    },
    {
      id: 'akbar-the-authenticator', name: 'akbar-the-authenticator', displayName: 'Akbar (Auth Service)',
      purpose: 'Core authentication service handling token generation, validation, and refresh for all platform services.',
      language: 'Java', languages: [{ name: 'Java', pct: 100 }], size: '424K',
      keyModules: [], dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Token metadata' },
      ], interRepoLinks: ['UserAccessManagement'],
    },
    {
      id: 'consent-preference-centre-ui', name: 'consent-preference-centre-ui', displayName: 'Consent Preference Centre',
      purpose: 'User-facing consent preference center for managing data consent choices (IAB TCF, CCPA compliance).',
      language: 'TypeScript', languages: [{ name: 'TypeScript', pct: 80 }, { name: 'JavaScript', pct: 20 }], size: '1.4M',
      keyModules: [], dependencies: [
        { name: 'React/Angular', type: 'library', description: 'UI framework' },
      ], interRepoLinks: ['UserAccessManagement'],
    },
  ],
};

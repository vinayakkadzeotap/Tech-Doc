import type { Domain } from './types';

export const IDENTITY_RESOLUTION: Domain = {
  id: 'identity-resolution',
  title: 'Identity Resolution & Graph',
  icon: 'Fingerprint',
  color: '#8b5cf6',
  description:
    'The identity backbone of Zeotap — resolves fragmented user identifiers (cookies, emails, device IDs) into unified customer profiles using deterministic and probabilistic matching across a distributed graph.',
  architectureNotes: `The Identity Resolution system operates in three tiers:

Tier 1 — Data Collection (Edge): Three Go HTTP servers (IntelligentMapper-V2, SmartPixel-3P, SPL-3P) deployed at the edge handle pixel fires, cookie syncs, and SDK data. They enrich signals with IP geolocation (MaxMind), enforce consent (IAB TCF/CCPA), and publish to Kafka (third-party) or PubSub (first-party).

Tier 2 — Orchestration & ETL: clarkkent-the-connect manages segment lifecycle (creation, licensing, match tests, auto-refresh) across 30+ ad-tech channels. transformer handles the ETL pipeline for private graph data, transforming raw data into graph-ready device/edge events.

Tier 3 — Identity Graph: zeocore-idu-microservices maintains the real-time identity graph in Aerospike via Gremlin/TinkerPop. Uses component-based resolution where connected subgraphs merge deterministically (lexicographic winner), with Redis distributed locking for concurrent mutations.

Key patterns: Actor-based concurrency (Akka), Supervisor trees (Suture/Go), event-driven architecture (Kafka + RabbitMQ), regional deployment (EUR/USA/IND routing).`,
  mermaidArch: `graph TB
    subgraph Collection["Data Collection (Go)"]
      IM["IntelligentMapper-V2<br/>Pixel + SDK Handler"]
      SP["SmartPixel-3P<br/>3P Collection"]
      SPL["SPL-3P<br/>3P with Rule Engine"]
    end

    subgraph Enrichment["Enrichment Layer"]
      GEO["MaxMind GeoIP2<br/>ISP + City"]
      CONSENT["IAB TCF / CCPA<br/>Consent Engine"]
      COOKIES["Cookie Mapper<br/>Channel Mapping"]
    end

    subgraph Messaging["Message Layer"]
      KAFKA["Apache Kafka<br/>3P Events"]
      PUBSUB["Google PubSub<br/>1P Events"]
      RMQ["RabbitMQ<br/>Internal Orchestration"]
    end

    subgraph Orchestration["Orchestration (Scala)"]
      CK["clarkkent-the-connect<br/>Segment Manager"]
      TF["transformer<br/>Private Graph ETL"]
    end

    subgraph Graph["Identity Graph"]
      IDU["zeocore-idu-microservices<br/>Graph CRUD Engine"]
      AERO["Aerospike + Gremlin<br/>Device/Edge/Component Graph"]
      REDIS["Redis<br/>Distributed Locking"]
    end

    IM --> GEO
    SP --> GEO
    SPL --> GEO
    IM --> CONSENT
    SP --> CONSENT
    SPL --> CONSENT
    IM --> COOKIES
    SP --> COOKIES
    SPL --> COOKIES

    IM --> KAFKA
    IM --> PUBSUB
    SP --> KAFKA
    SP --> PUBSUB
    SPL --> KAFKA

    CK --> RMQ
    RMQ --> TF
    TF --> RMQ
    RMQ --> IDU
    IDU --> AERO
    IDU --> REDIS`,
  mermaidDataFlow: `sequenceDiagram
    participant Browser as Browser/SDK
    participant SPL as SmartPixel/SPL
    participant Kafka as Kafka/PubSub
    participant Connect as clarkkent-the-connect
    participant RMQ as RabbitMQ
    participant Transform as transformer
    participant IDU as idu-microservices
    participant Aero as Aerospike Graph

    Browser->>SPL: Pixel fire / SDK call
    SPL->>SPL: Validate API key
    SPL->>SPL: Resolve geo (MaxMind)
    SPL->>SPL: Enforce consent (TCF/CCPA)
    SPL->>SPL: Map cookies
    SPL->>Kafka: Publish event

    Connect->>RMQ: Upload job (region-routed)
    RMQ->>Transform: upload.transform.eur
    Transform->>Transform: ETL pipeline
    Transform->>RMQ: Device/Edge events

    RMQ->>IDU: Device queue
    IDU->>IDU: DeviceProcessorActor
    IDU->>Aero: Upsert device vertex
    RMQ->>IDU: Edge queue
    IDU->>IDU: EdgeProcessorActor
    IDU->>Aero: Create edge + merge components`,
  repos: [
    {
      id: 'clarkkent-the-connect',
      name: 'clarkkent-the-connect',
      displayName: 'Connect Backend Service',
      purpose:
        'Central orchestration layer for segment management and activation — handles creation, licensing, match testing, export, auto-refresh, and distribution to 30+ ad-tech channels.',
      language: 'Scala',
      languages: [
        { name: 'Scala', pct: 55 },
        { name: 'Java', pct: 40 },
        { name: 'Other', pct: 5 },
      ],
      size: '62M',
      keyModules: [
        {
          name: 'SegmentControllerV4',
          path: 'app/controllers/',
          description:
            'Segment CRUD, pause/resume/archive, match test triggers, bulk operations',
        },
        {
          name: 'ChannelSegmentCreationServiceV2',
          path: 'app/services/',
          description:
            'Creates segments on 30+ external channels (Facebook, Google, TTD, etc.)',
        },
        {
          name: 'RefreshTriggerLaunchService',
          path: 'app/services/',
          description:
            'Akka Quartz-driven auto-refresh for segment re-exports',
        },
        {
          name: 'UploadService',
          path: 'app/services/',
          description:
            'Routes upload jobs to transformer via RabbitMQ with region keys (upload.transform.eur)',
        },
        {
          name: 'KingpinService',
          path: 'app/services/',
          description: 'Triggers match test jobs for segment validation',
        },
        {
          name: 'dynamicquerybuilder',
          path: 'lib/',
          description: 'Builds segment queries dynamically from UI rules',
        },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Segment/destination/licensing metadata via Ebean ORM' },
        { name: 'RabbitMQ', type: 'queue', description: 'Match test reports, uploads, RBAC events, licensing' },
        { name: 'BigQuery', type: 'cloud', description: 'Region-mapped datasets for segment data' },
        { name: 'GCS', type: 'cloud', description: 'File uploads (Weborama)' },
        { name: 'SendGrid', type: 'service', description: 'Email notifications' },
        { name: 'RBAC Service', type: 'service', description: 'Token validation, org info' },
      ],
      interRepoLinks: [
        'transformer',
        'channel-service',
        'canon',
        'daap',
        'segment-estimator',
      ],
    },
    {
      id: 'zeocore-idu-microservices',
      name: 'zeocore-idu-microservices',
      displayName: 'IDU Graph Engine',
      purpose:
        'Real-time identity graph CRUD engine — maintains device/edge/component graph in Aerospike via Gremlin, with connected-component merge/split and Redis distributed locking.',
      language: 'Scala',
      languages: [
        { name: 'Scala', pct: 45 },
        { name: 'Java', pct: 50 },
        { name: 'Other', pct: 5 },
      ],
      size: '456K',
      keyModules: [
        {
          name: 'GraphTraversalSourceProvider',
          path: 'app/',
          description:
            'Gremlin WebSocket connection to Aerospike graph (TinkerPop driver)',
        },
        {
          name: 'DeviceProcessorActor',
          path: 'app/',
          description:
            'Akka actor for device vertex upserts with component assignment',
        },
        {
          name: 'EdgeProcessorActor',
          path: 'app/',
          description:
            'Akka actor for edge creation with deterministic component merge (lexicographic winner)',
        },
        {
          name: 'AerospikeUtilsv2',
          path: 'app/',
          description:
            'Core graph CRUD with Gremlin traversals — device/edge/component operations',
        },
        {
          name: 'MessagePollingService',
          path: 'app/',
          description:
            'Continuous RabbitMQ polling with Akka RoundRobinPool dispatch',
        },
      ],
      dependencies: [
        { name: 'Aerospike', type: 'database', description: 'Identity graph storage via Gremlin/TinkerPop' },
        { name: 'RabbitMQ', type: 'queue', description: 'Device and edge queues with DLQs' },
        { name: 'Redis', type: 'database', description: 'Distributed locking via Redisson for concurrent graph mutations' },
      ],
      interRepoLinks: ['transformer'],
    },
    {
      id: 'intelligentmapper-v2',
      name: 'IntelligentMapper-V2',
      displayName: 'IntelligentMapper V2',
      purpose:
        'High-throughput Go HTTP server for pixel fires and SDK data collection — enriches with MaxMind geo, enforces IAB TCF/CCPA consent, maps cookies, publishes to Kafka/PubSub.',
      language: 'Go',
      languages: [
        { name: 'Go', pct: 95 },
        { name: 'Other', pct: 5 },
      ],
      size: '310M',
      keyModules: [
        {
          name: 'server/SDKApiHandler',
          path: 'server/',
          description: 'Handles /v2/events, /v2/data — mobile SDK calls',
        },
        {
          name: 'server/WebApiHandler',
          path: 'server/',
          description:
            'Handles /, /z.png, /fp, /zi — web pixel fires, cookie syncs, identity calls',
        },
        {
          name: 'publisher/',
          path: 'publisher/',
          description:
            'Dual publisher: Kafka (Sarama) for 3P + PubSub for 1P',
        },
        {
          name: 'consent/',
          path: 'consent/',
          description: 'IAB TCF consent string parsing and CCPA handling',
        },
        {
          name: 'geolocation/',
          path: 'geolocation/',
          description:
            'Geo resolution factory — MMDB, CloudFlare header, hybrid resolvers',
        },
        {
          name: 'server/rule_resolver',
          path: 'server/',
          description:
            'Resolves pixel firing rules by IP geo, publisher ID, telco redirects',
        },
      ],
      dependencies: [
        { name: 'Kafka', type: 'queue', description: 'Third-party event publishing via Sarama' },
        { name: 'Google PubSub', type: 'queue', description: 'First-party event publishing' },
        { name: 'MaxMind GeoIP2', type: 'service', description: 'ISP + City geo databases (MMDB)' },
        { name: 'Redis', type: 'database', description: 'Caching via go-redis' },
        { name: 'GCS', type: 'cloud', description: 'Log file upload' },
        { name: 'ID5 API', type: 'service', description: 'Identity partner integration' },
        { name: 'NewRelic', type: 'service', description: 'APM monitoring' },
      ],
      interRepoLinks: ['transformer', 'SmartPixel-3P', 'SPL-3P'],
    },
    {
      id: 'spl-3p',
      name: 'SPL-3P',
      displayName: 'SmartPixel 3P (Rule Engine)',
      purpose:
        'Third-party-only SmartPixel with GCS-backed dynamic config, RBAC-protected config APIs, OIDC auth for MMDB updates, and Kafka-only publishing.',
      language: 'Go',
      languages: [
        { name: 'Go', pct: 95 },
        { name: 'Other', pct: 5 },
      ],
      size: '968K',
      keyModules: [
        {
          name: 'ConfigSupervisor',
          path: 'config_setup/',
          description:
            'GCS-backed dynamic config with hot-reloading via subscriber pattern',
        },
        {
          name: 'rbac_auth_middleware',
          path: 'middlewares/',
          description: 'RBAC auth middleware for config APIs',
        },
        {
          name: 'service_account_oidc',
          path: 'middlewares/',
          description: 'OIDC authentication for MMDB update endpoint',
        },
        {
          name: 'RuleResolver',
          path: 'server/',
          description:
            'Subscribes to config changes for dynamic rule resolution',
        },
      ],
      dependencies: [
        { name: 'Kafka', type: 'queue', description: 'Third-party event publishing' },
        { name: 'GCS', type: 'cloud', description: 'Config files, log uploads' },
        { name: 'MaxMind GeoIP2', type: 'service', description: 'MMDB databases' },
        { name: 'RBAC Service', type: 'service', description: 'Token validation' },
      ],
      interRepoLinks: ['IntelligentMapper-V2', 'transformer'],
    },
    {
      id: 'smartpixel-3p',
      name: 'SmartPixel-3P',
      displayName: 'SmartPixel 3P',
      purpose:
        'SmartPixel variant supporting both 3P (Kafka) and 1P (PubSub) flows with ID5 integration and MMDB auto-update. Shares codebase with IntelligentMapper-V2.',
      language: 'Go',
      languages: [
        { name: 'Go', pct: 95 },
        { name: 'Other', pct: 5 },
      ],
      size: '1.0M',
      keyModules: [
        {
          name: 'server/',
          path: 'server/',
          description: 'Gin HTTP server with SDK + Web API handlers',
        },
        {
          name: 'publisher/',
          path: 'publisher/',
          description: 'Dual Kafka + PubSub publisher',
        },
        {
          name: 'mmdb/mmdb_update',
          path: 'mmdb/',
          description: 'Live MMDB database refresh capability',
        },
        {
          name: 'id5/',
          path: 'id5/',
          description: 'ID5 identity partner integration (decrypt, cache, API)',
        },
      ],
      dependencies: [
        { name: 'Kafka', type: 'queue', description: 'Third-party publishing' },
        { name: 'Google PubSub', type: 'queue', description: 'First-party publishing' },
        { name: 'MaxMind GeoIP2', type: 'service', description: 'With auto-update' },
        { name: 'ID5 API', type: 'service', description: 'Identity resolution partner' },
      ],
      interRepoLinks: ['IntelligentMapper-V2', 'transformer'],
    },
    {
      id: 'transformer',
      name: 'transformer',
      displayName: 'Private Graph ETL Manager',
      purpose:
        'Manages the ETL pipeline for private graph data — receives upload instructions from Connect, transforms raw data into device/edge events for the identity graph.',
      language: 'Scala',
      languages: [
        { name: 'Java', pct: 60 },
        { name: 'Scala', pct: 35 },
        { name: 'Other', pct: 5 },
      ],
      size: '20M',
      keyModules: [
        {
          name: 'AkkaTaskScheduler',
          path: 'app/tasks/',
          description: 'Background task scheduling via Akka for periodic ETL',
        },
        {
          name: 'DatabaseRepository',
          path: 'app/repositories/',
          description: 'Generic Ebean CRUD for ETL metadata/state',
        },
        {
          name: 'AuthorizedAccessAction',
          path: 'app/actions/',
          description:
            'Annotation-based RBAC access control at product/feature/resource level',
        },
        {
          name: 'ConsumerBinder',
          path: 'app/',
          description: 'RabbitMQ consumer initialization for upload messages',
        },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'ETL metadata and state via Ebean ORM' },
        { name: 'RabbitMQ', type: 'queue', description: 'Consumes upload messages from Connect' },
        { name: 'RBAC Service', type: 'service', description: 'Authentication and authorization' },
        { name: 'NewRelic', type: 'service', description: 'APM monitoring' },
      ],
      interRepoLinks: ['clarkkent-the-connect', 'zeocore-idu-microservices'],
    },
  ],
};

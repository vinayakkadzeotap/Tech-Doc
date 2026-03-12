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
  mermaidDataFlow: `sequenceDiagram
    participant UI as Audience Builder UI
    participant TAR as tarak-the-targeting
    participant WV as windvane
    participant PS as Profile Store (Delta Lake)
    participant BQ as BigQuery
    participant CH as channel-service
    participant DEST as doraemon-the-destination
    participant EXT as External Channel (Google Ads)

    UI->>TAR: Create segment (predicate rules)
    TAR->>TAR: SegmentQueryBuilder → SQL
    TAR->>WV: Trigger audience workflow
    WV->>BQ: Execute segment query
    BQ->>PS: Read profiles matching rules
    PS-->>BQ: Matching profile IDs
    BQ-->>WV: Segment results + counts
    WV->>WV: Generate membership report
    WV-->>TAR: Workflow complete

    Note over TAR,EXT: Activation Path
    TAR->>CH: Push segment to channel
    CH->>CH: Resolve channel config + auth
    CH->>DEST: Deliver segment payload
    DEST->>EXT: API call (Customer Match upload)
    EXT-->>DEST: Delivery confirmation
    DEST-->>CH: Status: delivered
    CH-->>TAR: Sync complete`,
  repos: [
    {
      id: 'tarak-the-targeting',
      name: 'tarak-the-targeting',
      displayName: 'Tarak (Core Segment Engine)',
      purpose: 'Central backend for audience segmentation lifecycle — segment creation, editing, validation, export, revenue attribution, and licensing across 30+ advertising channels. Internally "ZATv2".',
      language: 'Java',
      languages: [{ name: 'Java', pct: 60 }, { name: 'Scala', pct: 35 }, { name: 'Other', pct: 5 }],
      size: '66M',
      keyModules: [
        { name: 'SegmentController', path: 'app/controllers/', description: 'Segment CRUD, listing, validation, export REST API' },
        { name: 'SegmentQueryBuilder', path: 'app/daap/builder/', description: 'Query builder with filter chains (Affinity, Recency, Country, OTR) generating BQ-compatible SQL' },
        { name: 'ExportController', path: 'app/controllers/', description: 'Triggers exports via DAAP segment library, polls completion, publishes to RabbitMQ' },
        { name: 'SegmentQueuingService', path: 'app/services/', description: 'Queues segment operations for async processing' },
        { name: 'SegmentDestinationController', path: 'app/controllers/', description: 'Manages segment-to-destination mappings' },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Targeting DB + taxonomy DB' },
        { name: 'RabbitMQ', type: 'queue', description: 'Export queue, segment events' },
        { name: 'BigQuery', type: 'cloud', description: 'Segment queries' },
        { name: 'GCS', type: 'cloud', description: 'Segment payloads' },
        { name: 'RBAC Service', type: 'service', description: 'Authentication/authorization' },
      ],
      interRepoLinks: ['channel-service', 'daap-segment-library', 'doraemon-the-destination', 'zeotap-connect', 'charlie-the-communicator', 'windvane'],
    },
    {
      id: 'windvane',
      name: 'windvane',
      displayName: 'Windvane (Workflow Orchestrator)',
      purpose: 'Replaces Airflow DAGs for audience workflows — stateful sequential workflow engine with PostgreSQL persistence, org-level concurrency limits, graceful shutdown, and orphan recovery.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 55 }, { name: 'Scala', pct: 45 }],
      size: '824K',
      keyModules: [
        { name: 'AudienceCreateFlow', path: 'app/flows/', description: 'get_segments → execute BQ dgQuery → generate report → notify via RMQ → CEG membership' },
        { name: 'AudienceDestinationBQFlow', path: 'app/flows/', description: 'BigQuery-based destination distribution flow' },
        { name: 'WorkflowExecutor', path: 'app/services/', description: 'Executes workflows step-by-step with state persistence' },
        { name: 'FlowResolver', path: 'app/services/', description: 'Resolves FlowType to Flow implementation' },
        { name: 'LaunchController', path: 'app/controllers/', description: 'POST /launch — triggers workflow execution' },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Workflow state persistence' },
        { name: 'BigQuery', type: 'cloud', description: 'Segment queries' },
        { name: 'GCS', type: 'cloud', description: 'Segment payloads' },
        { name: 'RabbitMQ', type: 'queue', description: 'Reporting + backend notifications' },
        { name: 'Databricks', type: 'cloud', description: 'Processing execution' },
      ],
      interRepoLinks: ['tarak-the-targeting'],
    },
    {
      id: 'audiences',
      name: 'audiences',
      displayName: 'Audiences (Summary API)',
      purpose: 'API service for audience summary and folder management — REST endpoints for listing audience summaries per org and folder CRUD operations.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '65M',
      keyModules: [
        { name: 'AudienceSummaryController', path: 'app/controllers/', description: 'Lists audience summaries by orgId' },
        { name: 'FolderController', path: 'app/controllers/', description: 'CRUD for audience folders' },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Audience metadata' },
        { name: 'RabbitMQ', type: 'queue', description: 'Event messaging' },
        { name: 'RBAC', type: 'service', description: 'Authentication' },
      ],
      interRepoLinks: ['tarak-the-targeting', 'doraemon-the-destination'],
    },
    {
      id: 'cat-affinity',
      name: 'cat-affinity',
      displayName: 'Category Affinity Pipeline',
      purpose: 'BigQuery SQL pipeline computing per-user category affinity probabilities — 11 sequential steps with 7 scoring variations (recency, velocity, breadth, RFM, funnel) producing CTR + Conversion affinity scores.',
      language: 'SQL',
      languages: [{ name: 'SQL', pct: 90 }, { name: 'Other', pct: 10 }],
      size: '720K',
      keyModules: [
        { name: '02_V1_RECENCY', path: '02_V1_RECENCY/', description: 'Intent-weighted recency score (decay lambda=0.023)' },
        { name: '05_CTR_AFFINITY', path: '05_CTR_AFFINITY/', description: 'CTR score = Recency + Velocity + Breadth' },
        { name: '07_V4_FUNNEL', path: '07_V4_FUNNEL/', description: 'Funnel depth (View→Search→Wishlist→Basket→Checkout→Purchase)' },
        { name: '09_FINAL_UNIFIED', path: '09_FINAL_UNIFIED/', description: 'Merged CTR + Conversion probability distributions' },
      ],
      dependencies: [
        { name: 'BigQuery', type: 'cloud', description: '11-step SQL pipeline execution' },
      ],
      interRepoLinks: ['tarak-the-targeting'],
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
  mermaidDataFlow: `sequenceDiagram
    participant TAR as tarak-the-targeting
    participant CS as channel-service
    participant ZC as zeotap-connect
    participant DAEMOS as daemos-the-distributor
    participant DD as data-distributor
    participant DOR as doraemon-the-destination
    participant CC as charlie-the-communicator
    participant EXT as External Platform

    TAR->>CS: Push segment to channel
    CS->>CS: Resolve channel type + config

    alt Modern Connector (zeotap-connect)
      CS->>ZC: Trigger via ConnectorRegistry
      ZC->>ZC: Field mapping + format transform
      ZC->>EXT: API push (OAuth2 authenticated)
    else Legacy Distribution
      CS->>DAEMOS: Queue segment via RabbitMQ
      DAEMOS->>DAEMOS: Akka actor pipeline
      DAEMOS->>DD: File-based distribution
      DD->>DD: Format convert + PGP encrypt
      DD->>DOR: Platform-specific delivery
      DOR->>EXT: API push (Google/FB/TTD)
    end

    EXT-->>CC: Delivery confirmation
    CC->>CC: Update export status
    CC->>TAR: Notification (email/webhook)`,
  repos: [
    {
      id: 'channel-service',
      name: 'channel-service',
      displayName: 'Channel Service',
      purpose: 'Massive activation service with 50+ channel-specific service implementations (Google Ads, Facebook, TTD, Salesforce, etc.). Each channel has its own service class handling authentication, segment push, and sync lifecycle.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 55 }, { name: 'Java', pct: 45 }],
      size: '53M',
      keyModules: [
        { name: 'ChannelServiceImpl', path: 'app/services/', description: 'Base channel service — 50+ implementations (GoogleAdsChannelService, FacebookChannelService, TTDChannelService, etc.)' },
        { name: 'ChannelController', path: 'app/controllers/', description: 'REST API for channel CRUD, segment push, sync status' },
        { name: 'SegmentPushService', path: 'app/services/', description: 'Pushes segment data to channel-specific APIs with retry and rate limiting' },
        { name: 'SyncSchedulerService', path: 'app/services/', description: 'Manages sync schedules (daily, hourly, real-time) per channel' },
        { name: 'ChannelAuthService', path: 'app/services/', description: 'OAuth2/API key auth management per channel (token refresh, credential rotation)' },
      ],
      dependencies: [
        { name: 'Kafka', type: 'queue', description: 'Event publishing for segment delivery' },
        { name: 'PostgreSQL', type: 'database', description: 'Channel configs, sync state, credentials' },
        { name: 'Redis', type: 'database', description: 'Rate limiting and caching' },
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
      ],
      interRepoLinks: ['clarkkent-the-connect', 'tarak-the-targeting', 'channel-platform', 'doraemon-the-destination'],
    },
    {
      id: 'channel-platform',
      name: 'channel-platform',
      displayName: 'Channel Platform (Shared Models)',
      purpose: 'Shared library providing channel abstraction models, DTOs, and interfaces used across all activation services. Defines the ChannelType enum, segment delivery contracts, and common activation utilities.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '2.4M',
      keyModules: [
        { name: 'ChannelType', path: 'src/main/java/', description: 'Enum of 50+ supported channel types (GOOGLE_ADS, FACEBOOK, TTD, etc.)' },
        { name: 'IChannelService', path: 'src/main/java/', description: 'Interface contract for all channel service implementations' },
        { name: 'SegmentDeliveryDTO', path: 'src/main/java/', description: 'Data transfer objects for segment delivery payloads' },
        { name: 'ChannelConfig', path: 'src/main/java/', description: 'Channel configuration models (auth, endpoints, rate limits)' },
      ],
      dependencies: [],
      interRepoLinks: ['channel-service', 'zeotap-connect'],
    },
    {
      id: 'zeotap-connect',
      name: 'zeotap-connect',
      displayName: 'Zeotap Connect (Modern Connectors)',
      purpose: 'Next-gen activation connectors platform with control plane / data plane architecture. Control plane manages connector configs and orchestration; data plane handles actual data movement. Replaces legacy channel-service for new integrations.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 70 }, { name: 'Scala', pct: 20 }, { name: 'Other', pct: 10 }],
      size: '38M',
      keyModules: [
        { name: 'ConnectorController', path: 'control-plane/controllers/', description: 'Connector CRUD, activation triggers, sync management REST API' },
        { name: 'ConnectorRegistry', path: 'control-plane/registry/', description: 'Registry of available connector types with capability metadata' },
        { name: 'DataPlaneExecutor', path: 'data-plane/executor/', description: 'Executes data movement — reads segments, transforms, pushes to destination APIs' },
        { name: 'FieldMappingService', path: 'control-plane/services/', description: 'Schema mapping between CDP attributes and destination platform fields' },
        { name: 'SyncOrchestrator', path: 'control-plane/orchestrator/', description: 'Manages sync lifecycle (initial, incremental, full refresh)' },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Connector configs, mapping metadata' },
        { name: 'RabbitMQ', type: 'queue', description: 'Async data plane task dispatch' },
        { name: 'Redis', type: 'database', description: 'Sync state caching' },
        { name: 'GCS', type: 'cloud', description: 'Intermediate data staging' },
      ],
      interRepoLinks: ['channel-service', 'clarkkent-the-connect', 'tarak-the-targeting', 'channel-platform'],
    },
    {
      id: 'daemos-the-distributor',
      name: 'daemos-the-distributor',
      displayName: 'Daemos (Akka Distributor)',
      purpose: 'Akka actor-based bulk distribution pipeline — receives segment payloads from RabbitMQ, processes through actor hierarchy (Supervisor → Router → Worker), and distributes to 30+ channel-specific handlers with backpressure and retry.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 65 }, { name: 'Scala', pct: 35 }],
      size: '75M',
      keyModules: [
        { name: 'DistributorSupervisor', path: 'app/actors/', description: 'Top-level Akka supervisor managing channel-specific router actors' },
        { name: 'ChannelRouterActor', path: 'app/actors/', description: 'Routes segment batches to channel-specific worker actors' },
        { name: 'DistributionWorker', path: 'app/actors/', description: 'Worker actor — processes individual segment chunks for a channel' },
        { name: 'RMQConsumer', path: 'app/consumers/', description: 'RabbitMQ consumer receiving segment export payloads' },
        { name: 'RetryStrategy', path: 'app/strategies/', description: 'Exponential backoff retry with dead-letter queue for failed distributions' },
      ],
      dependencies: [
        { name: 'Akka', type: 'library', description: 'Actor system for concurrent distribution' },
        { name: 'RabbitMQ', type: 'queue', description: 'Segment payload ingestion + dead-letter' },
        { name: 'GCS', type: 'cloud', description: 'Segment file storage' },
        { name: 'PostgreSQL', type: 'database', description: 'Distribution state tracking' },
      ],
      interRepoLinks: ['data-distributor', 'clarkkent-the-connect', 'channel-service'],
    },
    {
      id: 'data-distributor',
      name: 'data-distributor',
      displayName: 'Data Distributor',
      purpose: 'General-purpose data distribution service — handles file-based segment delivery with format conversion (CSV, JSON, Avro), encryption (PGP), and transport (SFTP, S3, GCS).',
      language: 'Java',
      languages: [{ name: 'Java', pct: 90 }, { name: 'Other', pct: 10 }],
      size: '55M',
      keyModules: [
        { name: 'DistributionService', path: 'app/services/', description: 'Orchestrates file-based distribution — format, encrypt, transport' },
        { name: 'FormatConverter', path: 'app/converters/', description: 'Converts segment data between formats (CSV, JSON, Avro, Parquet)' },
        { name: 'PGPEncryptor', path: 'app/security/', description: 'PGP encryption for secure file delivery' },
        { name: 'TransportFactory', path: 'app/transport/', description: 'Pluggable transport layer — SFTP, S3, GCS, HTTP push' },
      ],
      dependencies: [
        { name: 'GCS/S3', type: 'cloud', description: 'File storage and delivery' },
        { name: 'SFTP', type: 'service', description: 'Secure file transfer' },
        { name: 'Bouncy Castle', type: 'library', description: 'PGP encryption' },
      ],
      interRepoLinks: ['daemos-the-distributor', 'data-destination'],
    },
    {
      id: 'data-destination',
      name: 'data-destination',
      displayName: 'Data Destination',
      purpose: 'Destination connector framework — defines the destination abstraction layer with pluggable connectors for each platform. Handles authentication, rate limiting, and error handling per destination.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 85 }, { name: 'Java', pct: 15 }],
      size: '22M',
      keyModules: [
        { name: 'IDestinationConnector', path: 'app/connectors/', description: 'Trait defining destination connector contract (connect, push, verify)' },
        { name: 'DestinationFactory', path: 'app/factory/', description: 'Creates destination connector instances by type' },
        { name: 'RateLimiter', path: 'app/throttle/', description: 'Per-destination rate limiting with token bucket algorithm' },
        { name: 'DeliveryVerifier', path: 'app/verification/', description: 'Post-delivery verification — confirms data landed at destination' },
      ],
      dependencies: [
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Destination configs and delivery state' },
      ],
      interRepoLinks: ['doraemon-the-destination', 'channel-service', 'data-distributor'],
    },
    {
      id: 'doraemon-the-destination',
      name: 'doraemon-the-destination',
      displayName: 'Doraemon (Destination APIs)',
      purpose: 'Platform-specific API integration layer — implements destination connectors for Google Ads Customer Match, Facebook Custom Audiences, TTD First-Party Data, Salesforce Data Cloud, and more.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 80 }, { name: 'Java', pct: 20 }],
      size: '25M',
      keyModules: [
        { name: 'GoogleAdsConnector', path: 'app/connectors/google/', description: 'Customer Match API — uploads hashed user lists to Google Ads' },
        { name: 'FacebookConnector', path: 'app/connectors/facebook/', description: 'Custom Audiences API — creates/updates audience segments on Facebook' },
        { name: 'TTDConnector', path: 'app/connectors/ttd/', description: 'First-Party Data API — syncs segments to The Trade Desk' },
        { name: 'SalesforceConnector', path: 'app/connectors/salesforce/', description: 'Data Cloud API — pushes segments to Salesforce' },
        { name: 'DestinationController', path: 'app/controllers/', description: 'REST API for destination management and delivery status' },
      ],
      dependencies: [
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Destination state' },
        { name: 'Google Ads API', type: 'service', description: 'Customer Match uploads' },
        { name: 'Facebook Marketing API', type: 'service', description: 'Custom Audience management' },
      ],
      interRepoLinks: ['data-destination', 'channel-service', 'tarak-the-targeting'],
    },
    {
      id: 'data-uploader',
      name: 'data-uploader',
      displayName: 'Data Uploader',
      purpose: 'File-based data upload service — handles batch segment uploads via multipart file upload, validates schemas, stages files on GCS/S3, and triggers downstream distribution pipelines.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 90 }, { name: 'Other', pct: 10 }],
      size: '60M',
      keyModules: [
        { name: 'UploadController', path: 'app/controllers/', description: 'Multipart file upload REST API with chunked upload support' },
        { name: 'SchemaValidator', path: 'app/validators/', description: 'Validates uploaded file schemas against expected catalog format' },
        { name: 'StagingService', path: 'app/services/', description: 'Stages uploaded files on GCS/S3 with partitioning' },
        { name: 'DistributionTrigger', path: 'app/triggers/', description: 'Triggers downstream distribution after successful upload and validation' },
      ],
      dependencies: [
        { name: 'GCS/S3', type: 'cloud', description: 'File staging and storage' },
        { name: 'RabbitMQ', type: 'queue', description: 'Upload event publishing' },
        { name: 'PostgreSQL', type: 'database', description: 'Upload metadata and status tracking' },
      ],
      interRepoLinks: ['clarkkent-the-connect', 'data-distributor'],
    },
    {
      id: 'charlie-the-communicator',
      name: 'charlie-the-communicator',
      displayName: 'Charlie (Export Lifecycle)',
      purpose: 'Manages the full export lifecycle — tracks export status (queued → processing → completed → failed), stores export metadata, sends notifications (email, Slack, webhook) on completion/failure, and provides export detail APIs.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 100 }],
      size: '5.1M',
      keyModules: [
        { name: 'ExportStatusController', path: 'app/controllers/', description: 'REST API for export status queries and detail retrieval' },
        { name: 'ExportLifecycleService', path: 'app/services/', description: 'Manages export state transitions (queued → processing → completed/failed)' },
        { name: 'NotificationService', path: 'app/services/', description: 'Sends export completion/failure notifications via email, Slack, webhook' },
        { name: 'ExportMetadataRepo', path: 'app/repositories/', description: 'Persists export metadata, file locations, record counts' },
      ],
      dependencies: [
        { name: 'PostgreSQL', type: 'database', description: 'Export metadata and status tracking' },
        { name: 'RabbitMQ', type: 'queue', description: 'Export event consumption' },
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
      ],
      interRepoLinks: ['clarkkent-the-connect', 'tarak-the-targeting', 'daemos-the-distributor'],
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
      DAZZ["dazz-data-manager<br/>Central API Hub (Java/Play)"]
      BK["bookkeeper<br/>Ingestion Coordinator"]
    end

    subgraph Workflow["Workflow Layer"]
      ZFM["zeoflow-mapper<br/>Config-driven Pipeline Runtime"]
      ZF["zeoflow<br/>Free-Monad DSL"]
      DIO["data-io<br/>Composable I/O (Spark+Beam)"]
      ZFSQL["zeoflow-sql-ui<br/>SQL/Test UI (Camel)"]
    end

    subgraph Quality["Data Quality"]
      DE["data-expectations<br/>Validation DSL"]
      DOW["data-owl<br/>Config Gen + Metastore"]
      DQ["dataquality<br/>PySpark ML Predictions"]
    end

    subgraph ZeoCore["Profile Processing"]
      ZCE["zeocore-apps-enricher<br/>AppTweak Enrichment"]
      ZCM["zeocore-apps-merge<br/>Delta Lake Merge (Scala)"]
      ZCC["zeocore-commons<br/>Alerting DSL + Utilities"]
      ZCL["zeocore-library<br/>TCF Parser + Cloud Utils"]
    end

    DAZZ --> BK
    DAZZ --> ZFM
    BK --> ZFM
    ZFM --> ZF
    ZF --> DIO
    ZF --> DE
    ZFSQL --> DE
    ZFSQL --> ZFM
    DOW --> DQ
    ZCE --> ZCM
    ZCM --> ZCC
    ZCC --> DIO
    ZFM --> ZCL`,
  mermaidDataFlow: `sequenceDiagram
    participant User as Platform User
    participant DAZZ as dazz-data-manager
    participant BK as bookkeeper
    participant ZF as zeoflow
    participant DIO as data-io
    participant DE as data-expectations
    participant DOW as data-owl
    participant DELTA as Profile Store (Delta Lake)

    User->>DAZZ: Trigger data pipeline
    DAZZ->>BK: Create workflow (steps + dependencies)
    BK->>BK: Resolve step ordering

    BK->>ZF: Execute Step 1: Ingest
    ZF->>DIO: Read source data (GCS/S3)
    DIO-->>ZF: Raw data frames

    BK->>ZF: Execute Step 2: Validate
    ZF->>DE: Run data expectations
    DE->>DE: Check row counts, nulls, schema
    DE-->>ZF: Validation report (pass/fail)

    BK->>ZF: Execute Step 3: Transform + Merge
    ZF->>ZF: Apply ZeoFlow DSL transforms
    ZF->>DELTA: Write unified profiles

    BK->>DOW: Execute Step 4: Quality check
    DOW->>DELTA: Compute column statistics
    DOW-->>BK: Quality report

    BK-->>DAZZ: Workflow complete
    DAZZ-->>User: Pipeline status + reports`,
  repos: [
    {
      id: 'dazz-data-manager',
      name: 'dazz-data-manager',
      displayName: 'Dazz Data Manager',
      purpose: 'Central data management API hub — 30+ controllers managing datasets, data groups, catalogs, consent, pipeline orchestration, and org onboarding. The command center for ingesting and managing customer data across the platform.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 90 }, { name: 'Scala', pct: 10 }],
      size: '163M',
      keyModules: [
        { name: 'DatasetController', path: 'app/controllers/', description: 'Dataset CRUD, ingestion triggers, status tracking via /datamanager/api/v1/' },
        { name: 'StratosController', path: 'app/controllers/', description: 'Pipeline metadata, preview, CDAP job deployment/pause/resume' },
        { name: 'ConsentController', path: 'app/controllers/', description: 'GDPR consent rules and data deletion policy management' },
        { name: 'DatasetCreateService', path: 'app/services/', description: 'Dataset creation — provisions GCS, BigQuery, PubSub cloud assets' },
        { name: 'CallbackController', path: 'app/controllers/', description: 'Receives provision, CDF pipeline, and ingestion success callbacks' },
      ],
      dependencies: [
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Ebean ORM — datasets, configs, consent metadata' },
        { name: 'RabbitMQ', type: 'queue', description: 'Async pipeline events' },
        { name: 'Redis', type: 'database', description: 'Queue and caching' },
        { name: 'GCP (BigQuery/Dataflow/PubSub/GCS)', type: 'cloud', description: 'Cloud asset provisioning' },
        { name: 'Elasticsearch', type: 'database', description: 'Search and indexing' },
      ],
      interRepoLinks: ['bookkeeper', 'zeoflow-mapper', 'UserAccessManagement', 'ZeoPulse'],
    },
    {
      id: 'bookkeeper',
      name: 'bookkeeper',
      displayName: 'Bookkeeper (Coordinator)',
      purpose: 'Event-driven ingestion coordinator — handles GCS file drop notifications, Dataflow pipeline tracking, batch re-ingestion, and PGP decryption via Cloud Run. Bridges file arrivals to pipeline execution.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 90 }, { name: 'Scala', pct: 10 }],
      size: '22M',
      keyModules: [
        { name: 'FileDropEventController', path: 'app/controllers/', description: 'Mapping callbacks, re-ingestion triggers, org migration' },
        { name: 'CallbackController', path: 'app/controllers/', description: 'Ingestion/BQ callbacks, RDEP alerts' },
        { name: 'DfTriggerConsumer', path: 'app/rabbitmq/', description: 'RabbitMQ consumer — triggers Dataflow pipelines on file arrival' },
        { name: 'DfPipelineTrackingConsumer', path: 'app/rabbitmq/', description: 'Tracks pipeline status, updates Event table, calls back to dazz' },
        { name: 'GCSNotificationService', path: 'app/services/', description: 'Processes GCS file notifications into pipeline triggers' },
      ],
      dependencies: [
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Event state, pipeline status' },
        { name: 'RabbitMQ', type: 'queue', description: 'File drop events, pipeline tracking' },
        { name: 'GCP (Dataflow/Cloud Run/GCS)', type: 'cloud', description: 'Pipeline execution and PGP decryption' },
      ],
      interRepoLinks: ['dazz-data-manager', 'ZeoPulse', 'zeoflow-mapper'],
    },
    {
      id: 'zeoflow',
      name: 'zeoflow',
      displayName: 'ZeoFlow (Free-Monad DSL)',
      purpose: 'Open-source free-monad DSL for data transformation workflows — Read/Transform/Write pattern. Pipelines are defined as pure data structures interpreted at runtime, enabling testability and composability.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 100 }],
      size: '460K',
      keyModules: [
        { name: 'FlowDSL', path: 'common/dsl/FlowDSL.scala', description: 'Sealed trait ADT — LoadSources, RunTransformations, WriteToSinks, AssertColumnExpectation' },
        { name: 'Production', path: 'common/constructs/Production.scala', description: 'e2eFlow and e2eFlowWithExpectations — for-comprehension workflow composition' },
        { name: 'SparkInterpreters', path: 'spark/', description: 'Spark-specific interpreters, sources, sinks, processors' },
        { name: 'BeamInterpreters', path: 'beam/', description: 'Apache Beam-specific interpreters for portable pipelines' },
      ],
      dependencies: [
        { name: 'Cats Free', type: 'library', description: 'Free monad implementation' },
        { name: 'data-io', type: 'library', description: 'Composable I/O operations (1.1-SNAPSHOT)' },
        { name: 'data-expectations', type: 'library', description: 'Quality assertions (1.2)' },
        { name: 'Spark + Beam', type: 'library', description: 'Dual runtime execution engines' },
      ],
      interRepoLinks: ['datawave', 'zeoflow-mapper', 'data-io', 'data-expectations', 'vision'],
    },
    {
      id: 'zeoflow-mapper',
      name: 'zeoflow-mapper',
      displayName: 'ZeoFlow Mapper (Pipeline Runtime)',
      purpose: 'Config-driven data pipeline runtime — reads ProcessingConfig, discovers data sources/sinks with auto-format detection (CSV/JSON/Parquet/Avro), executes transformations using zeoflow, and handles taxonomy mapping (Kayak, Lotame).',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 70 }, { name: 'Java', pct: 30 }],
      size: '60M',
      keyModules: [
        { name: 'Driver', path: 'zeocore/mapper/spark/', description: 'Entry point — reads ProcessingConfig, loads sources, applies UDFs, writes sinks' },
        { name: 'DataFormatFactory', path: 'data/discovery/formats/', description: 'Auto-detects data formats — CSV, JSON, Parquet, Avro' },
        { name: 'DataPickupStrategyFactory', path: 'data/discovery/pickup/', description: 'LatestPath, Lookback pickup strategies for source data' },
        { name: 'KayakProcessor', path: 'spark/processors/', description: 'Kayak taxonomy mapping processor' },
        { name: 'ConsentParserUDFOps', path: 'spark/udfs/', description: 'Consent string parsing UDFs using zeocore-library' },
      ],
      dependencies: [
        { name: 'Spark', type: 'library', description: 'Processing framework' },
        { name: 'zeoflow', type: 'library', description: 'Pipeline DSL framework' },
        { name: 'data-io', type: 'library', description: 'Source/sink I/O' },
        { name: 'zeocore-library', type: 'library', description: 'Consent parser' },
      ],
      interRepoLinks: ['zeoflow', 'data-io', 'zeocore-library', 'dazz-data-manager', 'bookkeeper'],
    },
    {
      id: 'data-io',
      name: 'data-io',
      displayName: 'Data I/O Library',
      purpose: 'Functional programming framework for composable data I/O — provides type-safe readers and writers for GCS, S3, HDFS, BigQuery, and local filesystems using Cats effect types.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 100 }],
      size: '792K',
      keyModules: [
        { name: 'SparkLoader', path: 'source/spark/', description: 'Composable Spark loaders — CSV, JSON, Parquet, Avro, FS, JDBC' },
        { name: 'BeamLoader', path: 'source/beam/', description: 'Composable Beam loaders with free monad interpreters' },
        { name: 'SparkWriter', path: 'sink/spark/', description: 'Composable Spark writers — FS, JDBC' },
        { name: 'BeamWriter', path: 'sink/beam/', description: 'Composable Beam writers — FS, JDBC' },
        { name: 'OptionalColumnOps', path: 'source/spark/constructs/', description: 'Optional column handling, timestamp, lookback operations' },
      ],
      dependencies: [
        { name: 'Cats 2.0', type: 'library', description: 'Free monads for composable I/O' },
        { name: 'Spark 2.4.3', type: 'library', description: 'Batch I/O engine' },
        { name: 'Beam 2.33', type: 'library', description: 'Streaming I/O engine' },
        { name: 'BigQuery Connector', type: 'cloud', description: 'BigQuery Spark connector' },
      ],
      interRepoLinks: ['zeoflow', 'zeoflow-mapper', 'zeocore-commons', 'datawave', 'beam-pipeline'],
    },
    {
      id: 'data-expectations',
      name: 'data-expectations',
      displayName: 'Data Expectations DSL',
      purpose: 'Free-monad-based DSL for declarative data validation — define expected row counts, null rates, value distributions, and schema constraints as composable expectations.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 100 }],
      size: '1.0M',
      keyModules: [
        { name: 'ColumnExpectation', path: 'column/dsl/', description: 'Fluent DSL — .isNonNull, .isString, .isPositiveNumber, .checkValidAgeBucket' },
        { name: 'ColumnExpectationOps', path: 'column/ops/', description: 'Executes column expectations against DataFrames' },
        { name: 'DataExpectation', path: 'data/dsl/', description: 'Dataset-level expectations (count comparison, key validity)' },
        { name: 'MetricGenerator', path: 'metric/', description: 'Produces MetricResult objects for alerting and reporting' },
      ],
      dependencies: [
        { name: 'Spark', type: 'library', description: 'DataFrame-based validation execution' },
      ],
      interRepoLinks: ['zeoflow', 'zeoflow-sql-ui', 'zeocore-commons'],
    },
    {
      id: 'data-owl',
      name: 'data-owl',
      displayName: 'Data Owl (Quality Framework)',
      purpose: 'Data statistics and quality monitoring framework — computes column-level statistics (min, max, mean, nulls, cardinality, distribution) and tracks quality metrics over time for drift detection.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '3.6M',
      keyModules: [
        { name: 'ConfigContextGenerator', path: 'config-generator/', description: 'Reads metastore → generates quality check configs per data partner' },
        { name: 'MetricGenerator', path: 'config-generator/', description: 'Generates quality metric definitions and queries' },
        { name: 'MetastoreUpdater', path: 'metastore-updater/', description: 'Writes quality results back to Elasticsearch' },
        { name: 'Annotations', path: 'config-handler/', description: '@BaseConf, @MetricConf, @SinkConf, @SourceConf config annotations' },
      ],
      dependencies: [
        { name: 'Elasticsearch', type: 'database', description: 'Quality metrics metastore' },
        { name: 'HDFS', type: 'cloud', description: 'Data quality file storage' },
        { name: 'Oozie', type: 'service', description: 'Scheduled quality checks' },
      ],
      interRepoLinks: ['daap', 'dataquality', 'ReportingPipeline'],
    },
    {
      id: 'zeocore-commons',
      name: 'zeocore-commons',
      displayName: 'ZeoCore Commons',
      purpose: 'Shared commons with free-monad alerting DSL, Delta Lake utilities, DP ratio calculations, and predictive attribute composition used across the data platform.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 60 }, { name: 'Java', pct: 40 }],
      size: '1.1M',
      keyModules: [
        { name: 'AlertDriver', path: 'alerting/', description: 'Free monad DSL: Source → Verification → ReportGenerator → Actions (email, Slack)' },
        { name: 'DeltaLakeUtils', path: 'deltalake/', description: 'Delta Lake utility operations (merge, vacuum, time-travel)' },
        { name: 'DPRatioCalculations', path: 'dp-ra-calculations/', description: 'Data partner recency/accuracy ratio calculations for merge' },
        { name: 'PredictiveAttributeComposer', path: 'predictive-attribute-composer/', description: 'Composes predictive attributes from ML model outputs' },
      ],
      dependencies: [
        { name: 'data-io', type: 'library', description: 'Source loading for alerting' },
        { name: 'data-expectations', type: 'library', description: 'Verification checks' },
        { name: 'Delta Lake', type: 'database', description: 'Profile store operations' },
        { name: 'Spark', type: 'library', description: 'Processing framework' },
      ],
      interRepoLinks: ['data-io', 'data-expectations', 'zeocore-apps-merge', 'zeocore-apps-enricher'],
    },
    {
      id: 'zeocore-library',
      name: 'zeocore-library',
      displayName: 'ZeoCore Library',
      purpose: 'Core shared library with four modules: TCF consent string parser (v1.1/v2), bloom filter utilities, GCS/S3 cloud storage abstraction, and IP address utilities.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '1.0M',
      keyModules: [
        { name: 'TCFStringDecoder', path: 'consent-parser/', description: 'Parses IAB TCF v1.1 and v2 consent strings → TCFConsentEntity (vendors, purposes)' },
        { name: 'BloomFilter', path: 'bloom-filter/', description: 'Probabilistic membership testing for deduplication' },
        { name: 'CloudStorageUtils', path: 'cloud-storage-utils/', description: 'GCS/S3 storage abstraction utilities' },
        { name: 'IPUtils', path: 'ip-utils/', description: 'IP address parsing and geolocation utilities' },
      ],
      dependencies: [
        { name: 'IAB TCF (com.iabtcf)', type: 'library', description: 'TCF consent standard library' },
      ],
      interRepoLinks: ['zeoflow-mapper', 'dazz-data-manager', 'consent-preference-centre-ui'],
    },
    {
      id: 'zeocore-apps-merge',
      name: 'zeocore-apps-merge',
      displayName: 'ZeoCore Apps Merge',
      purpose: 'Scala/Spark profile merge module — aggregates app usage data from multiple data partners into unified profiles. Handles category enrichment, recency-based DP ratio aggregation, opt-out processing, and Delta Lake upsert.',
      language: 'Scala',
      languages: [{ name: 'Scala', pct: 100 }],
      size: '580K',
      keyModules: [
        { name: 'Driver', path: 'apps-merge/', description: 'Entry: CategoryEnricher → RecencyDPRatioAggregator → SchemaRestructure → OptoutProcessor → Delta merge' },
        { name: 'RecencyResolver', path: 'resolvers/', description: 'Resolves conflicts between data partners using recency weighting' },
        { name: 'MergeAppsUsageTable', path: 'deltaTableUtils/', description: 'Delta Lake upsert operations for apps usage profiles' },
        { name: 'OptoutProcessor', path: 'processors/', description: 'Removes opted-out users from merged profiles' },
      ],
      dependencies: [
        { name: 'Delta Lake', type: 'database', description: 'Profile storage format' },
        { name: 'Spark', type: 'library', description: 'Merge processing' },
      ],
      interRepoLinks: ['zeocore-commons', 'daap'],
    },
    {
      id: 'zeocore-apps-enricher',
      name: 'zeocore-apps-enricher',
      displayName: 'ZeoCore Apps Enricher',
      purpose: 'Enriches raw app store records with metadata from AppTweak API and local enrichment result sets. Reads raw app data from GCS/S3, applies enrichment policies, writes enriched records for downstream merge.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '440K',
      keyModules: [
        { name: 'Driver', path: 'apps-enricher/', description: 'Entry: reads GCS path + config → fetches policies → enriches → writes to DB' },
        { name: 'AppTweakEnricher', path: 'enricher/', description: 'Enriches app records using AppTweak API metadata' },
        { name: 'LocalResultSetEnricher', path: 'enricher/', description: 'Enriches from local lookup tables' },
        { name: 'EnrichmentPolicyFetcher', path: 'app_enricher_store/', description: 'Fetches enrichment rules from config service' },
      ],
      dependencies: [
        { name: 'GCS/S3', type: 'cloud', description: 'Raw app data storage' },
        { name: 'AppTweak API', type: 'service', description: 'External app metadata' },
        { name: 'PostgreSQL/MySQL', type: 'database', description: 'Enriched records persistence' },
      ],
      interRepoLinks: ['zeocore-apps-merge', 'dazz-data-manager'],
    },
    {
      id: 'dataquality',
      name: 'dataquality',
      displayName: 'Data Quality (PySpark ML)',
      purpose: 'PySpark-based data quality tooling — gender prediction, age classification, IAB category analysis, and EDA reporting. Trains ML models to validate and predict user demographic attributes.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '4.2M',
      keyModules: [
        { name: 'gender/training', path: 'pyspark_jobs/gender/training/', description: 'Gender prediction model training (app usage + category features)' },
        { name: 'gender/prediction', path: 'pyspark_jobs/gender/prediction/', description: 'Gender prediction inference on profiles' },
        { name: 'reporting', path: 'pyspark_jobs/reporting/', description: 'EDA reports on gender/age/IAB distributions' },
        { name: 'iab', path: 'pyspark_jobs/iab/', description: 'IAB category analysis + LLM-based descriptions' },
      ],
      dependencies: [
        { name: 'PySpark', type: 'library', description: 'ML training and prediction' },
        { name: 'GCS', type: 'cloud', description: 'Model and data storage' },
      ],
      interRepoLinks: ['zeocore-apps-merge', 'data-owl', 'ReportingPipeline'],
    },
    {
      id: 'zeoflow-sql-ui',
      name: 'zeoflow-sql-ui',
      displayName: 'ZeoFlow SQL UI',
      purpose: 'Apache Camel-based SQL UI service for pipeline management — expectation generation/testing, query execution, E2E test orchestration, raw data generation, and Git-based config management.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '3.8M',
      keyModules: [
        { name: 'ExpectationApi', path: 'api/', description: 'REST endpoints for expectation generation and testing' },
        { name: 'QueryRunnerProcessor', path: 'processor/expectation/', description: 'Executes SQL queries against data pipelines' },
        { name: 'E2ERunnerProcessor', path: 'processor/expectation/', description: 'Orchestrates full pipeline test runs' },
        { name: 'GitOpsProcessor', path: 'processor/common/', description: 'Commits generated configs to Git repositories' },
        { name: 'ExpectationGeneratorFactory', path: 'utils/expectationutils/', description: 'Generates expectation files + test files from templates' },
      ],
      dependencies: [
        { name: 'Apache Camel', type: 'library', description: 'Integration routing framework' },
        { name: 'Spark', type: 'library', description: 'Data access for queries' },
        { name: 'Git', type: 'service', description: 'Config version control' },
      ],
      interRepoLinks: ['data-expectations', 'zeoflow-mapper'],
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
      ZP["ZeoPulse<br/>React + Express + ClickHouse"]
      CH["ClickHouse<br/>Logs/Metrics/Traces"]
      QRYN["qryn + Grafana<br/>Per-tenant Visualization"]
    end

    subgraph Analytics["Analytics"]
      ZAI["zai-v2-dataflow<br/>Druid OLAP Analytics"]
      ZIQ["ZeoIQ<br/>ML Model Mgmt (BQML)"]
    end

    subgraph Reporting["Reporting"]
      RP["ReportingPipeline<br/>Django REST (Telco/DAM/DSP)"]
      VIS["Vision<br/>3 Camel Microservices"]
    end

    ZP --> CH
    ZP --> QRYN
    ZAI --> RP
    VIS --> ZP
    RP --> ZP`,
  mermaidDataFlow: `sequenceDiagram
    participant PIPE as Data Pipeline (Spark/Dataflow)
    participant COL as MetricsCollector
    participant ZP as ZeoPulse
    participant CH as ClickHouse
    participant ALERT as AlertEngine
    participant DASH as Dashboard UI
    participant OPS as Ops Team

    PIPE->>COL: Emit pipeline metrics (records, latency, errors)
    COL->>CH: Store time-series metrics
    COL->>ZP: Pipeline event (start/complete/fail)
    ZP->>ZP: Update pipeline state

    DASH->>ZP: GET /api/pipelines/status
    ZP->>CH: Query metrics (last 24h)
    CH-->>ZP: Aggregated metrics
    ZP-->>DASH: Pipeline health + trends

    ALERT->>CH: Check SLA thresholds
    alt SLA Violation
      ALERT->>OPS: PagerDuty/Slack alert
    end

    Note over ZP,DASH: Real-time monitoring across all 6 product modules`,
  repos: [
    {
      id: 'zeopulse',
      name: 'ZeoPulse',
      displayName: 'ZeoPulse (Observability)',
      purpose: 'Multi-tenant CDP pipeline observability platform — monitors data flow across 6 CDP modules (Integrate, Unify, Segment, Activate, Orchestrate, Protect). React SPA + Express backend + ClickHouse + Grafana/qryn integration.',
      language: 'TypeScript',
      languages: [{ name: 'TypeScript', pct: 85 }, { name: 'JavaScript', pct: 15 }],
      size: '13M',
      keyModules: [
        { name: 'Routes (17 modules)', path: 'backend/src/routes/', description: 'logs, metrics, traces, alerts, dashboards, incidents, errors, serviceMap, lifecycle, applications' },
        { name: 'Workers', path: 'backend/src/workers/', description: 'alertEngine, anomalyDetector, errorTracker, healthWorker, datadogForwarder' },
        { name: 'Middleware', path: 'backend/src/middleware/', description: 'auth, rbac, tenant, admin, security middleware stack' },
        { name: 'Frontend Pages', path: 'frontend/src/pages/', description: 'React SPA with module-specific views and Grafana iframes' },
      ],
      dependencies: [
        { name: 'ClickHouse', type: 'database', description: 'MergeTree tables for logs, metrics, spans, alerts' },
        { name: 'PostgreSQL', type: 'database', description: 'Pipeline metadata and alert configs' },
        { name: 'Express.js', type: 'library', description: 'Backend API server' },
        { name: 'React/Vite', type: 'library', description: 'Frontend SPA' },
        { name: 'qryn + Grafana', type: 'service', description: 'Per-tenant LogQL/TraceQL/PromQL visualization' },
        { name: 'NGINX', type: 'service', description: 'Reverse proxy routing' },
      ],
      interRepoLinks: ['dazz-data-manager', 'bookkeeper', 'UserAccessManagement'],
    },
    {
      id: 'zai-v2-dataflow',
      name: 'zai-v2-dataflow',
      displayName: 'Real-time Audience Insights',
      purpose: 'Real-time audience insights platform using Apache Druid for OLAP analytics. Streaming dataflow jobs ingest audience data, batch Oozie jobs aggregate, and Druid provides sub-second querying for audience size/overlap.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '2.8M',
      keyModules: [
        { name: 'zai-streaming', path: 'zai-streaming/', description: 'Real-time streaming dataflow jobs for audience event ingestion' },
        { name: 'zai-batch-jobs', path: 'zai-batch-jobs/', description: 'Batch aggregation jobs for audience data' },
        { name: 'druid-conf', path: 'gcp-druid-conf/', description: 'Apache Druid configuration for OLAP analytics' },
        { name: 'oozie-jobs', path: 'gcp-oozie-jobs/', description: 'Scheduled Oozie workflows for batch processing' },
      ],
      dependencies: [
        { name: 'Apache Druid', type: 'database', description: 'OLAP analytics engine' },
        { name: 'Oozie', type: 'service', description: 'Batch job scheduling' },
        { name: 'GCP Dataflow', type: 'cloud', description: 'Streaming pipeline execution' },
      ],
      interRepoLinks: ['tarak-the-targeting', 'ReportingPipeline', 'Vision'],
    },
    {
      id: 'zeoiq',
      name: 'ZeoIQ',
      displayName: 'ZeoIQ (ML Intelligence)',
      purpose: 'ML model management and catalog search service — manages model lifecycle (create, train, run), feature tables, feature transforms, and executes models via BigQuery ML.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '604K',
      keyModules: [
        { name: 'BaseController', path: 'app/controllers/', description: 'Routes: /list, /upsert, /search/catalog, /preparedata, /runmodel' },
        { name: 'GenericModelService', path: 'app/services/', description: 'ML model lifecycle — create, train, run via BQML' },
        { name: 'CatalogSearchService', path: 'app/services/', description: 'Search org catalog for available features/attributes' },
        { name: 'BigQueryProvider', path: 'app/models/provider/', description: 'BQML execution — runs ML models in BigQuery' },
      ],
      dependencies: [
        { name: 'Play Framework', type: 'library', description: 'Web framework' },
        { name: 'BigQuery ML', type: 'cloud', description: 'In-warehouse ML model execution' },
        { name: 'PostgreSQL', type: 'database', description: 'Model metadata and feature tables' },
      ],
      interRepoLinks: ['cdp-server-workspace', 'dazz-data-manager'],
    },
    {
      id: 'reporting-pipeline',
      name: 'ReportingPipeline',
      displayName: 'Reporting Pipeline',
      purpose: 'Large-scale reporting infrastructure — aggregated reports (daily/weekly/monthly), raw log processing, bid/stalk reports, and campaign performance analytics. Django-based API serves reports to dashboards.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 70 }, { name: 'Other', pct: 30 }],
      size: '266M',
      keyModules: [
        { name: 'telco_reporting_service', path: 'reporting_api/dab_reporting_api/', description: 'Django views + query builders for telco reporting' },
        { name: 'DAM', path: 'DAM/', description: 'Data Asset Management reporting and metrics' },
        { name: 'Adapters', path: 'Adapters/', description: 'Integration adapters for external reporting sources' },
        { name: 'DSPAttributeFiller', path: 'DSPAttributeFiller/', description: 'Batch jobs filling DSP attributes in reporting tables' },
        { name: 'query_builder', path: 'telco_reporting_service/utils/', description: 'Constructs BigQuery parameterized queries for reports' },
      ],
      dependencies: [
        { name: 'Django', type: 'library', description: 'Reporting API framework' },
        { name: 'PostgreSQL', type: 'database', description: 'Report metadata' },
        { name: 'BigQuery', type: 'cloud', description: 'Report data storage' },
        { name: 'Redis', type: 'database', description: 'Report caching' },
      ],
      interRepoLinks: ['daap', 'ZeoPulse'],
    },
    {
      id: 'vision',
      name: 'Vision',
      displayName: 'Vision (Command Center)',
      purpose: 'ZeoFlow Command Center with 3 Apache Camel microservices: platform-service (job management via Kingpin), cost-service (BigQuery billing analysis), and log-service (DataProc/Airflow/Livy log aggregation).',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '1.4M',
      keyModules: [
        { name: 'platform-service', path: 'platform-service/', description: 'Job management — Kingpin integration, active jobs tracking, compute engine toggle' },
        { name: 'cost-service', path: 'cost-service/', description: 'BQ billing queries — per-workflow compute costs via scheduled Camel routes' },
        { name: 'log-service', path: 'log-service/', description: 'DataProc/Airflow/Livy log aggregation by execution ID' },
        { name: 'CamelRouteBuilder', path: 'cost-service/', description: 'Apache Camel routes for scheduled cost and job polling' },
      ],
      dependencies: [
        { name: 'Apache Camel', type: 'library', description: 'Integration routing framework' },
        { name: 'BigQuery', type: 'cloud', description: 'Billing and cost queries' },
        { name: 'PostgreSQL', type: 'database', description: 'Job and cost metadata' },
        { name: 'Kingpin', type: 'service', description: 'Job orchestrator integration' },
      ],
      interRepoLinks: ['zeoflow', 'ZeoPulse', 'dazz-data-manager'],
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
  mermaidDataFlow: `sequenceDiagram
    participant User as User Browser
    participant UI as CDP UI (unity-workspace)
    participant OKTA as Okta SSO
    participant AKBAR as akbar-the-authenticator
    participant UAM as UserAccessManagement
    participant SVC as Backend Service
    participant CPC as Consent Preference Centre

    User->>UI: Click "Sign In"
    UI->>OKTA: Redirect to Okta login
    OKTA-->>AKBAR: SSO callback (SAML assertion)
    AKBAR->>AKBAR: Validate assertion, create/link user
    AKBAR->>UAM: Fetch roles + permissions for user
    UAM-->>AKBAR: Role: analyst, Permissions: [read, create_audience]
    AKBAR->>AKBAR: Generate JWT with org + role claims
    AKBAR-->>UI: JWT token + refresh token

    UI->>SVC: API call + JWT header
    SVC->>SVC: rbac-authenticator validates JWT
    SVC->>UAM: Check permission (create_audience)
    UAM-->>SVC: Authorized
    SVC-->>UI: API response

    Note over CPC,UAM: Consent Flow (End User)
    CPC->>CPC: Display consent banner (TCF v2)
    CPC->>UAM: Store consent preferences
    UAM->>UAM: Apply consent to data processing rules`,
  repos: [
    {
      id: 'user-access-management',
      name: 'UserAccessManagement',
      displayName: 'User Access Management',
      purpose: 'Central RBAC platform — manages roles, permissions, org hierarchies, user provisioning, and API key management. Provides the /rbac/* APIs consumed by all platform services for access control.',
      language: 'Python',
      languages: [{ name: 'Python', pct: 100 }],
      size: '22M',
      keyModules: [
        { name: 'organizationViews', path: 'user_service/views/', description: 'Org CRUD, hierarchy, product configs (DataManager, Audience, Connect, Symphony)' },
        { name: 'accesscontrolViews', path: 'user_service/views/', description: 'Role and permission management per org/user' },
        { name: 'provisioningViews', path: 'user_service/views/', description: 'GCP project/asset provisioning on org creation' },
        { name: 'cloud_provisioning', path: 'user_service/cloud_provisioning/', description: 'GCP project creation, IAM roles, PubSub, service accounts' },
        { name: 'serviceAccountViews', path: 'user_service/views/', description: 'API key generation, rotation, and scope management' },
      ],
      dependencies: [
        { name: 'Django + DRF', type: 'library', description: 'Web framework (194+ migrations tracking feature evolution)' },
        { name: 'PostgreSQL', type: 'database', description: 'Users, roles, orgs, permissions, product configs' },
        { name: 'Redis', type: 'database', description: 'Token and permission caching' },
        { name: 'GCP IAM + PubSub', type: 'cloud', description: 'Cloud provisioning and cross-service updates' },
        { name: 'Auth0/OAuth', type: 'service', description: 'SSO integration' },
      ],
      interRepoLinks: ['akbar-the-authenticator', 'dazz-data-manager', 'bookkeeper', 'ZeoPulse'],
    },
    {
      id: 'akbar-the-authenticator',
      name: 'akbar-the-authenticator',
      displayName: 'Akbar (RBAC Client Library)',
      purpose: 'Java client library wrapping UserAccessManagement API — provides token validation, permission checks, and RBAC login for all Java/Play backend services. Included as a library dependency, not a standalone service.',
      language: 'Java',
      languages: [{ name: 'Java', pct: 100 }],
      size: '424K',
      keyModules: [
        { name: 'AsyncRbacAuthenticator', path: 'services/', description: 'Async RBAC token validation and permission checking' },
        { name: 'RBACAuthenticatorUtil', path: 'services/', description: 'Utility for checkPermission(token, resource, action) calls' },
        { name: 'JoltTransformer', path: 'jolt/', description: 'JSON response transformation using Jolt specs' },
        { name: 'FetchPathsConfig', path: 'enums/', description: 'Configurable UAM API endpoint paths' },
      ],
      dependencies: [
        { name: 'OkHttp', type: 'library', description: 'HTTP client for UAM API calls' },
        { name: 'Guice', type: 'library', description: 'Dependency injection' },
      ],
      interRepoLinks: ['UserAccessManagement', 'dazz-data-manager', 'bookkeeper', 'ZeoIQ', 'Vision'],
    },
    {
      id: 'consent-preference-centre-ui',
      name: 'consent-preference-centre-ui',
      displayName: 'Consent Preference Centre',
      purpose: 'User-facing consent management UI — embeddable widget for websites/apps where end users manage their data consent preferences. Supports IAB TCF v2.0, CCPA/CPRA, and custom consent categories.',
      language: 'TypeScript',
      languages: [{ name: 'TypeScript', pct: 80 }, { name: 'JavaScript', pct: 20 }],
      size: '1.4M',
      keyModules: [
        { name: 'auth', path: 'src/components/auth.js', description: 'Authentication component for consent management' },
        { name: 'profiles', path: 'src/components/profiles.js', description: 'Profile lookup — user enters identifier to find matched profiles' },
        { name: 'consentCheckbox', path: 'src/components/consentCheckbox.js', description: 'Per-purpose consent checkboxes with toggle controls' },
        { name: 'apiEffects', path: 'src/effects/apiEffects.js', description: 'API side effects — DoGet/DoPost for consent state read/write' },
      ],
      dependencies: [
        { name: 'Preact', type: 'library', description: 'Lightweight React alternative' },
        { name: 'Rollup', type: 'library', description: 'Module bundler' },
        { name: 'NGINX', type: 'service', description: 'Static file serving' },
      ],
      interRepoLinks: ['dazz-data-manager', 'zeocore-library'],
    },
  ],
};
